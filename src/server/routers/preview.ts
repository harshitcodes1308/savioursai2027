import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { FEATURE_PREVIEWS, isFeaturePreviewId } from "@/lib/feature-preview";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");

export const previewRouter = createTRPCRouter({
  start: protectedProcedure
    .input(z.object({ feature: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!isFeaturePreviewId(input.feature)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown feature preview." });
      }

      const config = FEATURE_PREVIEWS[input.feature];
      if (ctx.user.isDemo) {
        return { allowed: true, fullAccess: true, feature: input.feature, name: config.name, expiresAt: null };
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { isPaid: true, planType: true, subscriptionStatus: true, subscriptionExpiry: true, createdAt: true },
      });
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const now = new Date();
      const grandfathered = user.createdAt < CUTOFF_DATE;
      const activePlan = (user.planType === "PRO" || user.planType === "BUNDLE") &&
        user.subscriptionStatus === "ACTIVE" &&
        (!user.subscriptionExpiry || user.subscriptionExpiry > now);

      if (grandfathered || user.isPaid || activePlan) {
        return { allowed: true, fullAccess: true, feature: input.feature, name: config.name, expiresAt: null };
      }

      const existing = await ctx.prisma.featurePreview.findUnique({
        where: { userId_feature: { userId: ctx.user.id, feature: input.feature } },
      });

      if (existing) {
        return {
          allowed: existing.expiresAt > now,
          fullAccess: false,
          feature: input.feature,
          name: config.name,
          expiresAt: existing.expiresAt,
        };
      }

      const expiresAt = new Date(now.getTime() + config.minutes * 60_000);
      try {
        const preview = await ctx.prisma.featurePreview.create({
          data: { userId: ctx.user.id, feature: input.feature, expiresAt },
        });
        return { allowed: true, fullAccess: false, feature: input.feature, name: config.name, expiresAt: preview.expiresAt };
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
        const preview = await ctx.prisma.featurePreview.findUniqueOrThrow({
          where: { userId_feature: { userId: ctx.user.id, feature: input.feature } },
        });
        return { allowed: preview.expiresAt > now, fullAccess: false, feature: input.feature, name: config.name, expiresAt: preview.expiresAt };
      }
    }),
});
