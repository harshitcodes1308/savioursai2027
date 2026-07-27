import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth";

const DEMO_EMAIL = "demo@saviours.test";
const DEMO_NAME = "Demo Student";
const DEMO_PASSWORD = "demo123456";
const DEMO_PHONE = "9999900000";

/**
 * POST /api/auth/demo
 * body: { plan?: "PRO" | "BUNDLE", mode?: "signup" | "signin" }
 *
 * This intentionally uses one shared database record. The requested demo plan
 * lives only in the signed cookie, so trying the product never creates a user.
 */
export async function POST(req: NextRequest) {
  const { mode = "signin", plan = "BUNDLE" } = await req.json();

  if ((mode !== "signup" && mode !== "signin") || (plan !== "PRO" && plan !== "BUNDLE")) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  // Find or create demo user
  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

  if (!user) {
    const hashed = await hashPassword(DEMO_PASSWORD);
    try {
      user = await prisma.user.create({
        data: {
          email: DEMO_EMAIL,
          password: hashed,
          name: DEMO_NAME,
          phone: DEMO_PHONE,
          role: "STUDENT",
          planType: "BUNDLE",
          subscriptionStatus: "ACTIVE",
          isPaid: true,
          onboardingComplete: true,
          authProvider: "credentials",
        },
      });
    } catch {
      // Concurrent first-time demo visitors race for one email; reuse the
      // winner instead of creating a second record or failing the tour.
      user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
      if (!user) return NextResponse.json({ error: "Could not start demo" }, { status: 503 });
    }

    // Create student profile if it doesn't exist
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });
    if (!existingProfile) {
      await prisma.studentProfile.create({
        data: { userId: user.id, grade: 10 },
      });
    }
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isPaid: user.isPaid,
    // Do not update the shared account's plan. The plan is isolated per demo JWT.
    planType: plan,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionExpiry: user.subscriptionExpiry?.toISOString() ?? null,
    onboardingComplete: true,
    lnbChemistryUnlocked: user.lnbChemistryUnlocked,
    isDemo: true,
  };

  const token = await createToken(sessionUser);

  const redirectTo = mode === "signup" ? "/onboarding" : "/dashboard";

  const maxAge = 60 * 60 * 24 * 30; // 30 days
  const secure = (process.env.NODE_ENV as string) === "production" ? "; Secure" : "";
  const response = NextResponse.json({ success: true, redirectTo });
  response.headers.append(
    "Set-Cookie",
    `auth-token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
  );

  return response;
}
