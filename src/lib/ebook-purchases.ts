import { prisma } from "@/lib/prisma";
import { isEbookId } from "@/lib/ebook-access";
import { qualifyReferralForProPurchase } from "@/lib/referrals";

/** Purchase types that grant Sidekick ebook access. */
export const EBOOK_PURCHASE_TYPES = ["EBOOK_SINGLE", "EBOOK_BUNDLE", "EBOOKS"] as const;
export type EbookPurchaseType = (typeof EBOOK_PURCHASE_TYPES)[number];

export function isEbookPurchaseType(value: unknown): value is EbookPurchaseType {
  return typeof value === "string" && (EBOOK_PURCHASE_TYPES as readonly string[]).includes(value);
}

// Pro access bought through the bundle lasts until boards end, same as the ₹99 plan.
const PRO_EXPIRY = new Date("2027-03-31T23:59:59+05:30");

/**
 * Grants what an ebook order paid for. Idempotent: safe to call from both the
 * client verification action and the Razorpay webhook for the same payment.
 *
 * - EBOOK_SINGLE: adds one ebook to `ebooksOwned`.
 * - EBOOK_BUNDLE: full library (incl. upcoming) + Pro plan (planType BUNDLE).
 * - EBOOKS: legacy ₹79 full-library order created before the ₹49/₹299 launch.
 */
export async function applyEbookPurchase(userId: string, purchaseType: EbookPurchaseType, ebookId?: string | null) {
  if (purchaseType === "EBOOK_SINGLE") {
    if (!isEbookId(ebookId)) throw new Error(`Invalid ebook id on order: ${ebookId}`);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { ebooksOwned: true } });
    if (!user) throw new Error("User not found");
    if (user.ebooksOwned.includes(ebookId)) {
      return prisma.user.findUniqueOrThrow({ where: { id: userId } });
    }
    return prisma.user.update({
      where: { id: userId },
      data: { ebooksOwned: { push: ebookId } },
    });
  }

  if (purchaseType === "EBOOK_BUNDLE") {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ebooksUnlocked: true,
        ebooksUnlockedAt: new Date(),
        ebooksUnlockSource: "BUNDLE",
        isPaid: true,
        planType: "BUNDLE",
        subscriptionStatus: "ACTIVE",
        subscriptionExpiry: PRO_EXPIRY,
      },
    });
    await qualifyReferralForProPurchase(userId);
    return updated;
  }

  // Legacy ₹79 all-access order.
  return prisma.user.update({
    where: { id: userId },
    data: { ebooksUnlocked: true, ebooksUnlockedAt: new Date(), ebooksUnlockSource: "PURCHASE" },
  });
}
