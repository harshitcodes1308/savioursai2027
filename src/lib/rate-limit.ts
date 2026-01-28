import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

// Configuration
const FREE_DAILY_TOKENS = 20000; // ~40 queries (assuming ~500 tokens/query)
const PRO_DAILY_TOKENS = 200000; // ~400 queries
const AI_COOLDOWN_SECONDS = 5;

/**
 * Check if the user has exceeded their daily AI rate limit or is in cooldown.
 * Throws TRPCError if limited.
 */
export async function checkAiRateLimit(userId: string) {
    const now = new Date();
    // Start of day in UTC (server time). ideally should be user timezone but server time is consistent.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // 1. Fetch User (for fresh isPaid status) and Last Log (for cooldown)
    const [user, lastLog] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { isPaid: true }
        }),
        prisma.aiUsageLog.findFirst({
            where: { userId },
            orderBy: { timestamp: "desc" },
        })
    ]);

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    // 2. Check Cooldown
    if (lastLog) {
        const secondsSinceLast = (now.getTime() - lastLog.timestamp.getTime()) / 1000;
        if (secondsSinceLast < AI_COOLDOWN_SECONDS) {
           // Provide a friendly error
           const waitTime = Math.ceil(AI_COOLDOWN_SECONDS - secondsSinceLast);
           throw new TRPCError({
               code: "TOO_MANY_REQUESTS",
               message: `Whoa! 🚦 Please wait ${waitTime}s before your next request.`,
           });
        }
    }

    // 3. Check Daily Token Usage
    const usage = await prisma.aiUsageLog.aggregate({
        where: {
            userId,
            timestamp: {
                gte: startOfDay,
            },
        },
        _sum: {
            tokens: true,
        },
    });

    const totalTokens = usage._sum.tokens || 0;
    const limit = user.isPaid ? PRO_DAILY_TOKENS : FREE_DAILY_TOKENS;

    if (totalTokens >= limit) {
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Daily AI limit reached 🛑 (${Math.floor(totalTokens / 1000)}k/${Math.floor(limit / 1000)}k tokens). Upgrade to Pro for more!`,
        });
    }

    return { totalTokens, limit };
}
