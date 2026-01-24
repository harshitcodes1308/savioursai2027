
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { FocusTaskType, FocusModeType, FocusQuality, FocusCompletionStatus } from "@prisma/client";

export const focusRouter = createTRPCRouter({
    /**
     * Log a completed focus session
     */
    logSession: protectedProcedure
        .input(
            z.object({
                subject: z.string(),
                taskType: z.nativeEnum(FocusTaskType),
                mode: z.nativeEnum(FocusModeType),
                plannedDuration: z.number(),
                actualDuration: z.number(),
                completionStatus: z.nativeEnum(FocusCompletionStatus),
                quality: z.nativeEnum(FocusQuality),
                difficulty: z.string().optional(),
                notes: z.string().optional(),
                // NEW: Dynamic timer fields
                totalPlannedMinutes: z.number().optional(),
                focusStyle: z.string().optional(),
                customFocusMins: z.number().optional(),
                customBreakMins: z.number().optional(),
                blocksPlanned: z.number().optional(),
                blocksCompleted: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const session = await ctx.prisma.focusSession.create({
                data: {
                    userId: ctx.user.id,
                    subject: input.subject,
                    taskType: input.taskType,
                    mode: input.mode,
                    plannedDuration: input.plannedDuration,
                    actualDuration: input.actualDuration,
                    completionStatus: input.completionStatus,
                    quality: input.quality,
                    difficulty: input.difficulty,
                    notes: input.notes,
                    // NEW fields
                    totalPlannedMinutes: input.totalPlannedMinutes,
                    focusStyle: input.focusStyle,
                    customFocusMins: input.customFocusMins,
                    customBreakMins: input.customBreakMins,
                    blocksPlanned: input.blocksPlanned,
                    blocksCompleted: input.blocksCompleted || 0,
                },
            });
            return session;
        }),

    /**
     * Get recent sessions for the user
     */
    getRecentSessions: protectedProcedure
        .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
        .query(async ({ ctx, input }) => {
            const sessions = await ctx.prisma.focusSession.findMany({
                where: { userId: ctx.user.id },
                orderBy: { createdAt: "desc" },
                take: input.limit,
            });
            return sessions;
        }),
});
