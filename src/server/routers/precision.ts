import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const precisionRouter = createTRPCRouter({
    /**
     * Save a completed precision practice result
     */
    saveResult: protectedProcedure
        .input(z.object({
            subject: z.string(),
            chapter: z.string(),
            totalQuestions: z.number(),
            totalMarks: z.number(),
            marksScored: z.number(),
            accuracy: z.number(),
            rawScore: z.number(),
            predictedScore: z.number(),
            classification: z.string(),
            totalAllottedTime: z.number(),
            totalTimeTaken: z.number(),
            totalOvertime: z.number(),
            timeEfficiencyScore: z.number(),
            analyticsJson: z.string(), // full PrecisionTestResult as JSON
        }))
        .mutation(async ({ ctx, input }) => {
            // Store as a TestAttempt with precision metadata
            const attempt = await ctx.prisma.testAttempt.create({
                data: {
                    studentId: ctx.user.id,
                    subject: input.subject,
                    chapters: [input.chapter],
                    totalQuestions: input.totalQuestions,
                    duration: Math.ceil(input.totalAllottedTime / 60),
                    questions: JSON.parse(input.analyticsJson), // Store full analytics
                    answers: {}, // Answers are embedded in analyticsJson
                    status: "SUBMITTED",
                    submittedAt: new Date(),
                },
            });

            // Create result
            const result = await ctx.prisma.testResult.create({
                data: {
                    attemptId: attempt.id,
                    totalQuestions: input.totalQuestions,
                    attempted: input.totalQuestions,
                    correct: Math.round(input.accuracy * input.totalQuestions / 100),
                    incorrect: input.totalQuestions - Math.round(input.accuracy * input.totalQuestions / 100),
                    unattempted: 0,
                    accuracy: input.accuracy,
                    timeTaken: Math.ceil(input.totalTimeTaken / 60),
                    strongChapters: input.accuracy >= 75 ? [input.chapter] : [],
                    weakChapters: input.accuracy < 50 ? [input.chapter] : [],
                    mistakePatterns: [],
                    timeManagement: input.timeEfficiencyScore >= 90 ? "Excellent"
                        : input.timeEfficiencyScore >= 70 ? "Good"
                        : "Needs Improvement",
                },
            });

            return { attemptId: attempt.id, resultId: result.id };
        }),

    /**
     * Get precision practice history
     */
    getHistory: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.testAttempt.findMany({
                where: {
                    studentId: ctx.user.id,
                    // Precision practice attempts have the analytics JSON stored
                    status: "SUBMITTED",
                },
                include: { result: true },
                orderBy: { createdAt: "desc" },
                take: 20,
            });
        }),
});
