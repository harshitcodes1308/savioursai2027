import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EBOOK_IDS, canSpinForEbook } from "@/lib/ebook-access";
import { checkRateLimit, PAYMENT_RATE_LIMIT } from "@/lib/api-rate-limit";

// One free Sidekick ebook per free account. The server picks the prize; the
// wheel on the client only animates to it.
export async function POST() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.isDemo) return NextResponse.json({ error: "Create an account to spin" }, { status: 403 });

  const rate = checkRateLimit(`ebook-spin:${session.id}`, PAYMENT_RATE_LIMIT);
  if (!rate.allowed) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { isPaid: true, planType: true, ebooksUnlocked: true, ebooksOwned: true, ebookSpinAt: true, ebookSpinPrize: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.ebookSpinAt) {
    return NextResponse.json({ error: "You've already used your spin", prize: user.ebookSpinPrize }, { status: 409 });
  }
  if (!canSpinForEbook(user)) {
    return NextResponse.json({ error: "Spin is available on the free plan only" }, { status: 403 });
  }

  const candidates = EBOOK_IDS.filter((id) => !user.ebooksOwned.includes(id));
  if (candidates.length === 0) {
    return NextResponse.json({ error: "You already own every ebook" }, { status: 409 });
  }
  const prize = candidates[Math.floor(Math.random() * candidates.length)];

  // Guarded write: only succeeds if this account has never spun (prevents double-spins).
  const result = await prisma.user.updateMany({
    where: { id: session.id, ebookSpinAt: null },
    data: { ebookSpinAt: new Date(), ebookSpinPrize: prize, ebooksOwned: { push: prize } },
  });
  if (result.count === 0) {
    const fresh = await prisma.user.findUnique({ where: { id: session.id }, select: { ebookSpinPrize: true } });
    return NextResponse.json({ error: "You've already used your spin", prize: fresh?.ebookSpinPrize }, { status: 409 });
  }

  return NextResponse.json({ prize });
}
