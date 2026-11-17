import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { FEATURE_PREVIEWS, isFeaturePreviewId } from "@/lib/feature-preview";
import { createTRPCRouter, protectedProcedure, type Context } from "@/server/trpc";

const input = z.object({ feature: z.string() });

type AuthedContext = Context & { user: NonNullable<Context["user"]> };

async function getPaidState(ctx: AuthedContext) {
  if (ctx.user.isDemo) return true;
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.user.id },
    select: { isPaid: true, planType: true, subscriptionStatus: true, subscriptionExpiry: true, createdAt: true },
  });
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  const now = new Date();
  return user.createdAt < new Date("2026-01-29T00:00:00+05:30") || user.isPaid || (
    (user.planType === "PRO" || user.planType === "BUNDLE") &&
    user.subscriptionStatus === "ACTIVE" &&
    (!user.subscriptionExpiry || user.subscriptionExpiry > now)
  );
}

export const previewRouter = createTRPCRouter({
  status: protectedProcedure.input(input).query(async ({ ctx, input }) => {
    if (!isFeaturePreviewId(input.feature)) throw new TRPCError({ code: "BAD_REQUEST" });
    const config = FEATURE_PREVIEWS[input.feature];
    if (await getPaidState(ctx)) return { fullAccess: true, used: 0, remaining: config.limit, exhausted: false, ...config };
    const preview = await ctx.prisma.featurePreview.findUnique({
      where: { userId_feature: { userId: ctx.user.id, feature: input.feature } },
      select: { used: true },
    });
    const used = preview?.used ?? 0;
    return { fullAccess: false, used, remaining: Math.max(0, config.limit - used), exhausted: used >= config.limit, ...config };
  }),

  consume: protectedProcedure.input(input).mutation(async ({ ctx, input }) => {
    if (!isFeaturePreviewId(input.feature)) throw new TRPCError({ code: "BAD_REQUEST" });
    const config = FEATURE_PREVIEWS[input.feature];
    if (await getPaidState(ctx)) return { allowed: true, fullAccess: true, used: 0, remaining: config.limit };
    await ctx.prisma.featurePreview.upsert({
      where: { userId_feature: { userId: ctx.user.id, feature: input.feature } },
      update: {},
      create: { userId: ctx.user.id, feature: input.feature, expiresAt: null },
    });
    const result = await ctx.prisma.featurePreview.updateMany({
      where: { userId: ctx.user.id, feature: input.feature, used: { lt: config.limit } },
      data: { used: { increment: 1 }, lastUsedAt: new Date() },
    });
    const preview = await ctx.prisma.featurePreview.findUniqueOrThrow({
      where: { userId_feature: { userId: ctx.user.id, feature: input.feature } },
      select: { used: true },
    });
    return { allowed: result.count === 1, fullAccess: false, used: preview.used, remaining: Math.max(0, config.limit - preview.used) };
  }),
});
