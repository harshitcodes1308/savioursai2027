import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/* ─── Overview Stats ─── */

export async function getOverviewStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    paidUsers,
    usersToday,
    usersWeek,
    usersMonth,
    activeSessions,
    authProviders,
    planTypeBreakdown,
    signupTrendRaw,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isPaid: true } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.session.count({ where: { expiresAt: { gt: now } } }),
    prisma.user.groupBy({ by: ["authProvider"], _count: { id: true } }),
    prisma.user.groupBy({ by: ["planType"], _count: { id: true } }),
    prisma.$queryRaw<{ date: string; count: bigint }[]>(
      Prisma.sql`SELECT DATE("createdAt")::text as date, COUNT(*)::bigint as count
                 FROM users WHERE "createdAt" >= ${monthAgo}
                 GROUP BY DATE("createdAt") ORDER BY date ASC`
    ),
  ]);

  const freeUsers = totalUsers - paidUsers;
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";
  const estimatedRevenue = paidUsers * 99;

  const signupTrend = signupTrendRaw.map((r) => ({
    date: r.date,
    count: Number(r.count),
  }));

  return {
    totalUsers,
    paidUsers,
    freeUsers,
    conversionRate,
    estimatedRevenue,
    usersToday,
    usersWeek,
    usersMonth,
    activeSessions,
    authProviders: authProviders.map((a) => ({ provider: a.authProvider, count: a._count.id })),
    planTypeBreakdown: planTypeBreakdown.map((p) => ({ plan: p.planType, count: p._count.id })),
    signupTrend,
  };
}

/* ─── Users List ─── */

export async function getUsersList(search?: string, filter?: string) {
  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (filter === "paid") where.isPaid = true;
  else if (filter === "free") where.isPaid = false;
  else if (filter === "phone") where.phone = { not: null };
  else if (filter === "monthly") where.planType = "MONTHLY";
  else if (filter === "yearly") where.planType = "YEARLY";

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isPaid: true,
      planType: true,
      subscriptionStatus: true,
      authProvider: true,
      createdAt: true,
      flipBestStreak: true,
      onboardingComplete: true,
      _count: {
        select: {
          testAttempts: true,
          aiUsageLogs: true,
          focusSessions: true,
          notes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));
}

/* ─── Revenue Data ─── */

export async function getRevenueData() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [paidUsers, totalUsers, planBreakdown, revenueTimeline] = await Promise.all([
    prisma.user.count({ where: { isPaid: true } }),
    prisma.user.count(),
    prisma.user.groupBy({ by: ["planType"], _count: { id: true } }),
    prisma.$queryRaw<{ month: string; paid_count: bigint }[]>(
      Prisma.sql`SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
                        COUNT(*)::bigint as paid_count
                 FROM users WHERE "isPaid" = true AND "createdAt" >= ${sixMonthsAgo}
                 GROUP BY DATE_TRUNC('month', "createdAt")
                 ORDER BY month ASC`
    ),
  ]);

  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0";
  const estimatedRevenue = paidUsers * 99;
  const arpu = paidUsers > 0 ? (estimatedRevenue / paidUsers).toFixed(0) : "0";

  // Build cumulative revenue
  let cumulative = 0;
  const cumulativeTimeline = revenueTimeline.map((r) => {
    cumulative += Number(r.paid_count) * 99;
    return { month: r.month, revenue: cumulative, users: Number(r.paid_count) };
  });

  return {
    paidUsers,
    totalUsers,
    conversionRate,
    estimatedRevenue,
    arpu,
    planBreakdown: planBreakdown.map((p) => ({ plan: p.planType, count: p._count.id })),
    cumulativeTimeline,
  };
}

/* ─── Feature Usage ─── */

export async function getFeatureUsageData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    featureBreakdown,
    totalTests,
    focusAggregate,
    totalNotes,
    totalDoubts,
    flipAvg,
    aiTrendRaw,
  ] = await Promise.all([
    prisma.aiUsageLog.groupBy({
      by: ["feature"],
      _count: { id: true },
      _sum: { tokens: true },
    }),
    prisma.testAttempt.count(),
    prisma.focusSession.aggregate({ _sum: { actualDuration: true }, _count: { id: true } }),
    prisma.note.count(),
    prisma.doubtConversation.count(),
    prisma.user.aggregate({ _avg: { flipBestStreak: true } }),
    prisma.$queryRaw<{ date: string; count: bigint }[]>(
      Prisma.sql`SELECT DATE("timestamp")::text as date, COUNT(*)::bigint as count
                 FROM ai_usage_logs WHERE "timestamp" >= ${thirtyDaysAgo}
                 GROUP BY DATE("timestamp") ORDER BY date ASC`
    ),
  ]);

  const totalAiCalls = featureBreakdown.reduce((s, f) => s + f._count.id, 0);
  const totalTokens = featureBreakdown.reduce((s, f) => s + (f._sum.tokens ?? 0), 0);
  const focusHours = Math.round((focusAggregate._sum.actualDuration ?? 0) / 60);

  return {
    totalAiCalls,
    totalTokens,
    totalTests,
    focusSessions: focusAggregate._count.id,
    focusHours,
    totalNotes,
    totalDoubts,
    avgFlipStreak: Math.round(flipAvg._avg.flipBestStreak ?? 0),
    featureBreakdown: featureBreakdown
      .map((f) => ({
        feature: f.feature,
        calls: f._count.id,
        tokens: f._sum.tokens ?? 0,
        pct: totalAiCalls > 0 ? Math.round((f._count.id / totalAiCalls) * 100) : 0,
      }))
      .sort((a, b) => b.calls - a.calls),
    aiTrend: aiTrendRaw.map((r) => ({ date: r.date, count: Number(r.count) })),
  };
}
