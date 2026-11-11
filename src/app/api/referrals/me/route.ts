import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateReferralCode } from "@/lib/referrals";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.isDemo) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const referralCode = await getOrCreateReferralCode(user.id);
  const [profile, signedUpCount, qualifiedCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { ebooksUnlocked: true, ebooksUnlockSource: true },
    }),
    prisma.user.count({ where: { referredById: user.id } }),
    prisma.user.count({
      where: { referredById: user.id, referralQualifiedAt: { not: null } },
    }),
  ]);

  const origin = request.nextUrl.origin;
  return NextResponse.json({
    referralCode,
    referralLink: `${origin}/signup?ref=${encodeURIComponent(referralCode)}`,
    signedUpCount,
    qualifiedCount,
    ebooksUnlocked: profile?.ebooksUnlocked ?? false,
    unlockSource: profile?.ebooksUnlockSource ?? null,
  });
}
