import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const REFERRAL_CODE_PATTERN = /^[A-Z0-9]{8,20}$/;

export function normalizeReferralCode(value?: string | null) {
  const code = value?.trim().toUpperCase() ?? "";
  return REFERRAL_CODE_PATTERN.test(code) ? code : null;
}

export async function getOrCreateReferralCode(userId: string) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (!existing) throw new Error("User not found");
  if (existing.referralCode) return existing.referralCode;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `SAV${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
        select: { referralCode: true },
      });
      return updated.referralCode as string;
    } catch (error: unknown) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
    }
  }
  throw new Error("Could not create referral code");
}

export async function getReferrerId(referralCode?: string | null) {
  const code = normalizeReferralCode(referralCode);
  if (!code) return null;
  const referrer = await prisma.user.findUnique({
    where: { referralCode: code },
    select: { id: true },
  });
  return referrer?.id ?? null;
}

/**
 * Records that a referred user made a paid purchase. The referral ebook reward
 * was retired with the ₹49 / ₹299 ebook launch, so this only tracks attribution;
 * referrers who already earned the library keep it.
 */
export async function qualifyReferralForProPurchase(purchaserId: string) {
  await prisma.user.updateMany({
    where: { id: purchaserId, referredById: { not: null }, referralQualifiedAt: null },
    data: { referralQualifiedAt: new Date() },
  });
}
