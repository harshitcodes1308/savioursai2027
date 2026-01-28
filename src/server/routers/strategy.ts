import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateStrategy } from "@/lib/strategy-ai";
import { checkAiRateLimit } from "@/lib/rate-limit";

export const strategyRouter = createTRPCRouter({
    generate: protectedProcedure
        .input(
            z.object({
                subjects: z.array(z.string()),
                strengths: z.array(z.string()),
                weaknesses: z.array(z.string()),
                goals: z.object({
                    examName: z.string(),
                    targetScore: z.string(),
                    examDate: z.string(),
                }),
                schedule: z.object({
                    schoolHours: z.string(),
                    tuitionHours: z.string(),
                    selfStudyHours: z.string(),
                    wakeUpTime: z.string(),
                    sleepTime: z.string(),
                }),
                mode: z.enum(["SURVIVAL", "BALANCED", "TOPPER"]),
            })
        )
        .mutation(async ({ input, ctx }) => {
            // Check Rate Limit
            await checkAiRateLimit(ctx.user.id);

            try {
                const strategy = await generateStrategy(input);
                
                // Log Usage
                await ctx.prisma.aiUsageLog.create({
                    data: {
                        userId: ctx.user.id,
                        feature: "STUDY_PLANNER",
                        tokens: 1000, // Estimate
                        cost: 0,
                        metadata: { mode: input.mode },
                    }
                });

                return { strategy };
            } catch (error) {
                throw new Error("Failed to generate strategy. Please check your inputs and try again.");
            }
        }),
});
