import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
    /**
     * Get user profile stats
     */
    getStats: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.user.id;

            // Get test attempts count and average score
            const testAttempts = await ctx.prisma.testAttempt.findMany({
                where: {
                    studentId: userId,
                    status: "SUBMITTED"
                },
                include: { result: true },
            });

            const totalTests = testAttempts.length;
            const avgAccuracy = totalTests > 0
                ? testAttempts.reduce((sum, attempt) => sum + (attempt.result?.accuracy || 0), 0) / totalTests
                : 0;

            // Get subjects studied (unique subjects from tests)
            const subjectsStudied = [...new Set(testAttempts.map(attempt => attempt.subject))];

            // Get total study time (sum of all test times)
            const totalStudyTime = testAttempts.reduce((sum, attempt) => sum + (attempt.result?.timeTaken || 0), 0);

            // Get recent activity
            const recentTests = await ctx.prisma.testAttempt.findMany({
                where: {
                    studentId: userId,
                    status: "SUBMITTED"
                },
                include: { result: true },
                orderBy: { createdAt: "desc" },
                take: 5,
            });

            // Get notes count
            const notesCount = await ctx.prisma.note.count({
                where: { studentId: userId },
            });

            // Get AI assistant usage
            const aiUsage = await ctx.prisma.aiUsageLog.count({
                where: { userId },
            });

            return {
                totalTests,
                avgAccuracy: Math.round(avgAccuracy * 10) / 10,
                subjectsStudied,
                totalStudyTime,
                notesCount,
                aiUsage,
                recentTests: recentTests.map(test => ({
                    id: test.id,
                    subject: test.subject,
                    score: test.result?.correct || 0,
                    total: test.totalQuestions,
                    accuracy: test.result?.accuracy || 0,
                    date: test.createdAt,
                })),
            };
        }),

    /**
     * Update user profile
     */
    updateProfile: protectedProcedure
        .input(z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.user.update({
                where: { id: ctx.user.id },
                data: {
                    name: input.name,
                    email: input.email,
                },
            });
        }),
});
