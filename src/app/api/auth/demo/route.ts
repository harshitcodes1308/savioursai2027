import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth";

const DEMO_EMAIL = "demo@saviours.test";
const DEMO_NAME = "Demo Student";
const DEMO_PASSWORD = "demo123456";

/**
 * POST /api/auth/demo
 * body: { mode: "signup" | "signin" }
 *
 * "signup" → resets onboardingComplete to false → redirects to /onboarding
 * "signin" → sets onboardingComplete to true  → redirects to /dashboard
 */
export async function POST(req: NextRequest) {
  const { mode } = await req.json();

  if (mode !== "signup" && mode !== "signin") {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  // Find or create demo user
  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

  if (!user) {
    const hashed = await hashPassword(DEMO_PASSWORD);
    user = await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        password: hashed,
        name: DEMO_NAME,
        role: "STUDENT",
        planType: "YEARLY",
        subscriptionStatus: "ACTIVE",
        isPaid: true,
        onboardingComplete: mode === "signin",
        authProvider: "credentials",
      },
    });

    // Create student profile if it doesn't exist
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });
    if (!existingProfile) {
      await prisma.studentProfile.create({
        data: { userId: user.id, grade: 10 },
      });
    }
  } else {
    // Update onboarding status based on mode
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingComplete: mode === "signin",
      },
    });
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isPaid: user.isPaid,
    planType: user.planType,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionExpiry: user.subscriptionExpiry?.toISOString() ?? null,
    onboardingComplete: mode === "signin",
    lnbChemistryUnlocked: user.lnbChemistryUnlocked,
  };

  const token = await createToken(sessionUser);
  await setSessionCookie(token, true);

  const redirectTo = mode === "signup" ? "/onboarding" : "/dashboard";

  return NextResponse.json({ success: true, redirectTo });
}
