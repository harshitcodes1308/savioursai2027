import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const dashboardRouter = createTRPCRouter({
    /**
     * Get user profile with student/teacher details
     */
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { id: ctx.user.id },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            studentProfile: user.studentProfile,
            teacherProfile: user.teacherProfile,
        };
    }),

    /**
     * Get study statistics for dashboard - user-specific, fresh for new users
     */
    getStudyStats: protectedProcedure.query(async ({ ctx }) => {
        // Get user's daily plans
        const plans = await ctx.prisma.dailyPlan.findMany({
            where: { userId: ctx.user.id },
            include: {
                subject: true,
                chapter: true,
            },
        });

        // Calculate today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPlans = plans.filter(p => {
            const planDate = new Date(p.planDate);
            planDate.setHours(0, 0, 0, 0);
            return planDate.getTime() === today.getTime();
        });

        const completedToday = todayPlans.filter(p => p.completed);
        const todayHours = completedToday.reduce((sum, p) => sum + (p.estimatedHours || 0), 0);
        const todayGoal = todayPlans.reduce((sum, p) => sum + (p.estimatedHours || 0), 0);

        // Calculate weekly stats
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekPlans = plans.filter(p => new Date(p.planDate) >= weekAgo && new Date(p.planDate) <= today);
        const completedWeek = weekPlans.filter(p => p.completed);
        const weeklyProgress = weekPlans.length > 0 ? Math.round((completedWeek.length / weekPlans.length) * 100) : 0;

        // Calculate streak
        let currentStreak = 0;
        const sortedCompletedDates = [...new Set(
            plans.filter(p => p.completed).map(p => new Date(p.planDate).toDateString())
        )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        for (let i = 0; i < sortedCompletedDates.length; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            if (sortedCompletedDates.includes(checkDate.toDateString())) {
                currentStreak++;
            } else {
                break;
            }
        }

        // Calculate exam readiness
        const totalPlans = plans.length;
        const completedPlans = plans.filter(p => p.completed).length;
        const examReadiness = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

        // Get subject breakdown for today
        const subjectMap = new Map<string, { name: string; timeMinutes: number; completed: boolean }>();
        todayPlans.forEach(plan => {
            const key = plan.subject?.name || 'Unknown';
            const existing = subjectMap.get(key);
            if (existing) {
                existing.timeMinutes += (plan.estimatedHours || 0) * 60;
                existing.completed = existing.completed && plan.completed;
            } else {
                subjectMap.set(key, {
                    name: key,
                    timeMinutes: (plan.estimatedHours || 0) * 60,
                    completed: plan.completed,
                });
            }
        });

        return {
            todayHours,
            todayGoal: todayGoal || 0,
            weeklyProgress,
            examReadiness,
            currentStreak,
            avgHoursPerDay: weekPlans.length > 0 ? Number((completedWeek.reduce((sum, p) => sum + (p.estimatedHours || 0), 0) / 7).toFixed(1)) : 0,
            subjects: Array.from(subjectMap.values()),
        };
    }),
});
