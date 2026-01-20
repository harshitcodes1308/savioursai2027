import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { askAI, generateStudyPlan, summarizeContent, generateQuestions } from "@/lib/ai";

export const aiRouter = createTRPCRouter({
    /**
     * Ask a question to the AI assistant
     */
    askDoubt: protectedProcedure
        .input(
            z.object({
                question: z.string().min(1),
                subject: z.string().optional(),
                topic: z.string().optional(),
                conversation: z
                    .array(
                        z.object({
                            role: z.enum(["user", "assistant"]),
                            content: z.string(),
                        })
                    )
                    .optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { searchRelevantVideos } = await import("@/lib/youtube");

            // Get AI response
            const response = await askAI(input.question, {
                subject: input.subject,
                topic: input.topic,
                conversation: input.conversation,
            });

            // Search for relevant YouTube videos
            const videos = await searchRelevantVideos(
                input.topic || input.question,
                input.subject
            );

            // Log AI usage
            await ctx.prisma.aiUsageLog.create({
                data: {
                    userId: ctx.user.id,
                    feature: "DOUBT_SOLVING",
                    tokens: Math.ceil(response.length / 4),
                    cost: 0,
                    metadata: { question: input.question, videosFound: videos.length },
                },
            });

            return { response, videos };
        }),

    /**
     * Generate an AI-powered study plan
     */
    generatePlan: protectedProcedure
        .input(
            z.object({
                subjects: z.array(z.string()),
                startDate: z.date(),
                targetDate: z.date(),
                dailyHours: z.number().min(1).max(12),
                weakTopics: z.array(z.string()).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const plan = await generateStudyPlan({
                subjects: input.subjects,
                startDate: input.startDate,
                targetDate: input.targetDate,
                dailyHours: input.dailyHours,
                weakTopics: input.weakTopics,
            });

            // Log AI usage
            await ctx.prisma.aiUsageLog.create({
                data: {
                    userId: ctx.user.id,
                    feature: "STUDY_PLANNER",
                    tokens: 500, // Estimate
                    cost: 0,
                    metadata: { subjects: input.subjects },
                },
            });

            return { plan };
        }),

    /**
     * Summarize content
     */
    summarize: protectedProcedure
        .input(
            z.object({
                content: z.string(),
                topic: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const summary = await summarizeContent(input.content, input.topic);

            // Log AI usage
            await ctx.prisma.aiUsageLog.create({
                data: {
                    userId: ctx.user.id,
                    feature: "CONTENT_SUMMARY",
                    tokens: Math.ceil((input.content.length + summary.length) / 4),
                    cost: 0,
                    metadata: { topic: input.topic },
                },
            });

            return { summary };
        }),

    /**
     * Generate practice questions
     */
    generateQuestions: protectedProcedure
        .input(
            z.object({
                subject: z.string(),
                topic: z.string(),
                count: z.number().min(1).max(10).default(5),
                difficulty: z.enum(["easy", "medium", "hard"]).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const result = await generateQuestions({
                subject: input.subject,
                topic: input.topic,
                count: input.count,
                difficulty: input.difficulty,
            });

            // Log AI usage
            await ctx.prisma.aiUsageLog.create({
                data: {
                    userId: ctx.user.id,
                    feature: "FLASHCARD_GENERATION",
                    tokens: 300, // Estimate
                    cost: 0,
                    metadata: { subject: input.subject, topic: input.topic },
                },
            });

            return result;
        }),

    /**
     * Get AI usage statistics for current user
     */
    getUsageStats: protectedProcedure.query(async ({ ctx }) => {
        const logs = await ctx.prisma.aiUsageLog.findMany({
            where: { userId: ctx.user.id },
            orderBy: { timestamp: "desc" },
            take: 50,
        });

        const totalTokens = logs.reduce((sum, log) => sum + log.tokens, 0);
        const featureCounts = logs.reduce((acc, log) => {
            acc[log.feature] = (acc[log.feature] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalTokens,
            featureCounts,
            recentLogs: logs.slice(0, 10),
        };
    }),

    /**
     * Generate Flashcards
     */
    generateFlashcards: protectedProcedure
        .input(
            z.object({
                topics: z.string(),
                subject: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { generateFlashcards } = await import("@/lib/ai");
            console.log("Generating flashcards for topics:", input.topics);

            const result = await generateFlashcards({
                topics: input.topics,
                subject: input.subject,
            });
            console.log("Flashcard generation result:", result);

            // Log AI usage
            await ctx.prisma.aiUsageLog.create({
                data: {
                    userId: ctx.user.id,
                    feature: "FLASHCARD_GENERATION",
                    tokens: 500, // Estimate
                    cost: 0,
                    metadata: { topics: input.topics },
                },
            });

            return result;
        }),
});
