import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateMCQs, evaluateTest } from "@/lib/test-generator";

export const testRouter = createTRPCRouter({
    /**
     * Create new test with AI-generated MCQs
     */
    createTest: protectedProcedure
        .input(z.object({
            subject: z.string(),
            chapters: z.array(z.string()),
            totalQuestions: z.number(),
            duration: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            // Generate MCQs
            const questions = await generateMCQs({
                subject: input.subject,
                chapters: input.chapters,
                count: input.totalQuestions,
            });

            // Create test attempt
            const attempt = await ctx.prisma.testAttempt.create({
                data: {
                    studentId: ctx.user.id,
                    subject: input.subject,
                    chapters: input.chapters,
                    totalQuestions: input.totalQuestions,
                    duration: input.duration,
                    questions: questions,
                    answers: {},
                    status: "IN_PROGRESS",
                },
            });

            return { attemptId: attempt.id, questions };
        }),

    /**
     * Get test attempt details
     */
    getAttempt: protectedProcedure
        .input(z.object({ attemptId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.testAttempt.findUnique({
                where: { id: input.attemptId },
                include: { result: true },
            });
        }),

    /**
     * Save answer for a question
     */
    saveAnswer: protectedProcedure
        .input(z.object({
            attemptId: z.string(),
            questionId: z.string(),
            answer: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            const attempt = await ctx.prisma.testAttempt.findUnique({
                where: { id: input.attemptId },
            });

            const answers = (attempt?.answers as Record<string, number>) || {};
            answers[input.questionId] = input.answer;

            await ctx.prisma.testAttempt.update({
                where: { id: input.attemptId },
                data: { answers },
            });

            return { success: true };
        }),

    /**
     * Mark question for review
     */
    markForReview: protectedProcedure
        .input(z.object({
            attemptId: z.string(),
            questionId: z.string(),
            marked: z.boolean(),
        }))
        .mutation(async ({ ctx, input }) => {
            const attempt = await ctx.prisma.testAttempt.findUnique({
                where: { id: input.attemptId },
            });

            let marked = (attempt?.markedReview as string[]) || [];

            if (input.marked) {
                if (!marked.includes(input.questionId)) {
                    marked.push(input.questionId);
                }
            } else {
                marked = marked.filter(id => id !== input.questionId);
            }

            await ctx.prisma.testAttempt.update({
                where: { id: input.attemptId },
                data: { markedReview: marked },
            });

            return { success: true };
        }),

    /**
     * Submit test and calculate results
     */
    submitTest: protectedProcedure
        .input(z.object({ attemptId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const attempt = await ctx.prisma.testAttempt.findUnique({
                where: { id: input.attemptId },
            });

            if (!attempt) throw new Error("Test not found");

            const questions = attempt.questions as any[];
            const answers = (attempt.answers as Record<string, number>) || {};

            const evaluation = evaluateTest(questions, answers);

            // Calculate time taken
            const timeTaken = Math.floor(
                (new Date().getTime() - attempt.startedAt.getTime()) / 60000
            );

            // Determine time management feedback
            let timeManagement = "Good";
            const percentTimeUsed = (timeTaken / attempt.duration) * 100;
            if (percentTimeUsed < 70) timeManagement = "Excellent";
            else if (percentTimeUsed > 95) timeManagement = "Needs Improvement";

            // Create result
            const result = await ctx.prisma.testResult.create({
                data: {
                    attemptId: attempt.id,
                    totalQuestions: attempt.totalQuestions,
                    attempted: evaluation.attempted,
                    correct: evaluation.correct,
                    incorrect: evaluation.incorrect,
                    unattempted: evaluation.unattempted,
                    accuracy: evaluation.accuracy,
                    timeTaken,
                    strongChapters: evaluation.strongChapters,
                    weakChapters: evaluation.weakChapters,
                    mistakePatterns: [],
                    timeManagement,
                },
            });

            // Update attempt status
            await ctx.prisma.testAttempt.update({
                where: { id: input.attemptId },
                data: {
                    status: "SUBMITTED",
                    submittedAt: new Date(),
                },
            });

            return result;
        }),

    /**
     * Get test history
     */
    getHistory: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.testAttempt.findMany({
                where: { studentId: ctx.user.id },
                include: { result: true },
                orderBy: { createdAt: "desc" },
                take: 20,
            });
        }),
});
