import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const creatorRouter = createTRPCRouter({
  // All creators for the "Who referred you?" dropdown
  getAll: publicProcedure.query(async () => {
    return prisma.creator.findMany({
      select: { creatorName: true, creatorCode: true, discountPercentage: true },
      orderBy: { creatorName: "asc" },
    });
  }),

  // Discount for the logged-in user's creator code (used on pricing screens)
  getMyDiscount: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: { creatorCode: true },
    });
    if (!user?.creatorCode) return null;

    const creator = await prisma.creator.findUnique({
      where: { creatorCode: user.creatorCode },
      select: { creatorName: true, creatorCode: true, discountPercentage: true, channelId: true },
    });
    return creator;
  }),

  // Save creator code for logged-in user (called from onboarding)
  saveCreatorCode: protectedProcedure
    .input(z.object({ creatorCode: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      if (input.creatorCode !== null) {
        const exists = await prisma.creator.findUnique({
          where: { creatorCode: input.creatorCode },
        });
        if (!exists) throw new Error("Invalid creator code");
      }

      await prisma.user.update({
        where: { id: ctx.user.id },
        data: { creatorCode: input.creatorCode },
      });

      return { success: true };
    }),
});
