import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DASHBOARD_FEATURES, FEATURE_OPEN_ACTION, PRESENCE_ACTION } from "@/lib/dashboard-activity";
import { checkRateLimitAsync } from "@/lib/api-rate-limit";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.isDemo) return new NextResponse(null, { status: 204 });
  const limit = await checkRateLimitAsync(`activity:${user.id}`, { maxRequests: 30, windowSeconds: 60 });
  if (!limit.allowed) return new NextResponse(null, { status: 429 });
  const body = await request.json().catch(() => null);
  if (!body || (body.feature !== null && (typeof body.feature !== "string" || !Object.hasOwn(DASHBOARD_FEATURES, body.feature))) || typeof body.visit !== "boolean") {
    return NextResponse.json({ error: "Invalid activity" }, { status: 400 });
  }
  const now = new Date();
  const presenceId = `presence:${user.id}`;
  const writes = [prisma.auditLog.upsert({
    where: { id: presenceId },
    create: { id: presenceId, userId: user.id, action: PRESENCE_ACTION, timestamp: now },
    update: { timestamp: now },
  })];
  if (body.visit && body.feature) {
    // One open per feature/user/minute prevents duplicate tabs and React remounts inflating usage.
    const id = `feature:${user.id}:${body.feature}:${Math.floor(now.getTime() / 60_000)}`;
    writes.push(prisma.auditLog.upsert({ where: { id },
      create: { id, userId: user.id, action: FEATURE_OPEN_ACTION, timestamp: now, metadata: { feature: body.feature } }, update: {},
    }));
  }
  try {
    await prisma.$transaction(writes);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Activity unavailable" }, { status: 503 });
  }
}
