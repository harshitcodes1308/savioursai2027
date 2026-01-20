import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { predictMultipleChapterDifficulties, calculateStudyDistribution, checkTimelineFeasibility, decomposeChapterIntoTopics } from "@/lib/smart-planner";

export const plannerRouter = createTRPCRouter({
    /**
     * Generate smart study plan with AI difficulty prediction and topic decomposition
     */
    generateSmartPlan: protectedProcedure
        .input(
            z.object({
                subjectId: z.string(),
                chapterIds: z.array(z.string()),
                startDate: z.string(), // ISO date string
                targetDate: z.string(), // ISO date string
                dailyHours: z.number().min(1).max(12),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const startDate = new Date(input.startDate);
            const targetDate = new Date(input.targetDate);

            // Fetch subject and chapters
            const subject = await ctx.prisma.subject.findUnique({
                where: { id: input.subjectId },
            });

            if (!subject) {
                throw new Error("Subject not found");
            }

            const chapters = await ctx.prisma.chapter.findMany({
                where: { id: { in: input.chapterIds } },
                orderBy: { order: "asc" },
            });

            if (chapters.length === 0) {
                throw new Error("No chapters selected");
            }

            // Check timeline feasibility
            const feasibility = checkTimelineFeasibility(
                chapters.length,
                startDate,
                targetDate,
                input.dailyHours
            );

            // Predict difficulties for all chapters
            const chaptersWithDifficulty = await predictMultipleChapterDifficulties(
                chapters.map((c) => ({ id: c.id, name: c.name })),
                subject.name
            );

            // Calculate smart distribution
            const distribution = calculateStudyDistribution(
                chaptersWithDifficulty,
                startDate,
                targetDate,
                input.dailyHours
            );

            // Create daily plan entries with topic-level breakdown
            let currentDate = new Date(startDate);
            const dailyPlans = [];

            for (const dist of distribution) {
                const chapterInfo = chaptersWithDifficulty.find((c) => c.chapterId === dist.chapterId);
                const chapter = chapters.find((c) => c.id === dist.chapterId);

                if (!chapter || !chapterInfo) continue;

                // Decompose chapter into daily topics
                const topics = await decomposeChapterIntoTopics(
                    chapter.name,
                    subject.name,
                    dist.days
                );

                // Create a plan for each topic
                for (const topic of topics) {
                    if (currentDate > targetDate) break;

                    const plan = await ctx.prisma.dailyPlan.create({
                        data: {
                            userId: ctx.user.id,
                            subjectId: input.subjectId,
                            chapterId: dist.chapterId,
                            topicName: topic.topicName, // TOPIC-LEVEL, not chapter name
                            planDate: new Date(currentDate),
                            difficulty: chapterInfo.difficulty,
                            estimatedHours: input.dailyHours,
                        },
                        include: {
                            chapter: true,
                            subject: true,
                        },
                    });

                    dailyPlans.push(plan);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }

            return {
                success: true,
                plansCreated: dailyPlans.length,
                plans: dailyPlans,
                warning: feasibility.warning,
                recommendation: feasibility.recommendation,
                chaptersWithDifficulty,
            };
        }),

    /**
     * Get user's study plans
     */
    getMyPlans: protectedProcedure
        .input(
            z.object({
                startDate: z.string().optional(),
                endDate: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {
                userId: ctx.user.id,
            };

            if (input.startDate && input.endDate) {
                where.planDate = {
                    gte: new Date(input.startDate),
                    lte: new Date(input.endDate),
                };
            }

            const plans = await ctx.prisma.dailyPlan.findMany({
                where,
                orderBy: { planDate: "asc" },
                include: {
                    subject: true,
                    chapter: true,
                },
            });

            return plans;
        }),

    /**
     * Get TODAY's study plans specifically (for dashboard real-time updates)
     */
    getTodayPlans: protectedProcedure.query(async ({ ctx }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const plans = await ctx.prisma.dailyPlan.findMany({
            where: {
                userId: ctx.user.id,
                planDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            include: {
                subject: true,
                chapter: true,
            },
            orderBy: { createdAt: "asc" },
        });

        return plans;
    }),

    /**
     * Mark a plan as completed - STAY ON PLANNER, NO NAVIGATION
     */
    togglePlanComplete: protectedProcedure
        .input(
            z.object({
                planId: z.string(),
                completed: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const plan = await ctx.prisma.dailyPlan.update({
                where: { id: input.planId },
                data: { completed: input.completed },
            });

            return { success: true, plan };
        }),

    /**
     * Update plan notes
     */
    updatePlanNotes: protectedProcedure
        .input(
            z.object({
                planId: z.string(),
                notes: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const plan = await ctx.prisma.dailyPlan.update({
                where: { id: input.planId },
                data: { notes: input.notes },
            });

            return { success: true, plan };
        }),

    /**
     * Delete a plan
     */
    deletePlan: protectedProcedure
        .input(z.object({ planId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.dailyPlan.delete({
                where: { id: input.planId },
            });

            return { success: true };
        }),

    /**
     * Delete all plans (clear planner)
     */
    clearAllPlans: protectedProcedure.mutation(async ({ ctx }) => {
        await ctx.prisma.dailyPlan.deleteMany({
            where: { userId: ctx.user.id },
        });

        return { success: true };
    }),
});
