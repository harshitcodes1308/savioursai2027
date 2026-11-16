import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DASHBOARD_FEATURES, ONLINE_WINDOW_MS, PRESENCE_ACTION } from "@/lib/dashboard-activity";
import { EBOOK_SUBJECTS } from "@/data/ebooks-config";
import { getInstagramAudience } from "@/lib/instagram";
import { getRazorpayRevenueSnapshot } from "@/lib/razorpay-revenue";
import { ADMIN_TRACKING_START, adminScopeDays, type AdminScope, type RevenuePeriod } from "@/lib/admin-period";

const realUser: Prisma.UserWhereInput = { email: { not: "demo@saviours.test" } };
const standaloneUser: Prisma.UserWhereInput = { email: { not: "demo@saviours.test" }, createdAt: { gte: ADMIN_TRACKING_START } };
const standaloneUserSql = Prisma.sql`u.email <> 'demo@saviours.test' AND u."createdAt" >= ${ADMIN_TRACKING_START}`;
const realUserSql = Prisma.sql`u.email <> 'demo@saviours.test'`;
const scopeUserWhere = (scope: AdminScope) => scope === "all" ? realUser : standaloneUser;
const scopeUserSql = (scope: AdminScope) => scope === "all" ? realUserSql : standaloneUserSql;
export function paidAccessWhere(now = new Date(), scope: AdminScope = "november"): Prisma.UserWhereInput {
  return { AND: [scopeUserWhere(scope), { OR: [
    { isPaid: true, subscriptionExpiry: null },
    { OR: [{ isPaid: true }, { planType: { in: ["PRO", "BUNDLE"] }, subscriptionStatus: "ACTIVE" }], subscriptionExpiry: { gt: now } },
    { planType: { in: ["PRO", "BUNDLE"] }, subscriptionStatus: "ACTIVE", subscriptionExpiry: null },
  ] }] };
}
const istDay = (date: Date) => new Date(date.getTime() + 330 * 60_000).toISOString().slice(0, 10);
function daysTrend(rows: { date: string; count: bigint }[], days = 30, endDate = new Date()) {
  const counts = new Map(rows.map(row => [row.date, Number(row.count)]));
  const end = new Date(`${istDay(endDate)}T00:00:00+05:30`);
  return Array.from({ length: days }, (_, i) => {
    const date = istDay(new Date(end.getTime() - (days - i - 1) * 86400_000));
    return { date, count: counts.get(date) ?? 0 };
  });
}

async function getFeatureRanking(scope: AdminScope) {
  const period = scope === "all" ? Prisma.empty : Prisma.sql`AND a.timestamp >= ${ADMIN_TRACKING_START}`;
  const rows = await prisma.$queryRaw<{ feature: string; opens: bigint; users: bigint }[]>(Prisma.sql`SELECT a.metadata->>'feature' AS feature, COUNT(*)::bigint AS opens, COUNT(DISTINCT a."userId")::bigint AS users FROM audit_logs a JOIN users u ON u.id = a."userId" WHERE a.action = 'DASHBOARD_FEATURE_OPEN' ${period} AND ${scopeUserSql(scope)} GROUP BY 1 ORDER BY opens DESC LIMIT 8`);
  return rows.filter(row => Object.hasOwn(DASHBOARD_FEATURES, row.feature)).map(row => ({
    feature: row.feature, label: DASHBOARD_FEATURES[row.feature], opens: Number(row.opens), users: Number(row.users),
  }));
}

export async function getOverviewStats(scope: AdminScope = "november") {
  const now = new Date();
  const today = new Date(`${istDay(now)}T00:00:00+05:30`);
  const periodUser = scopeUserWhere(scope);
  const weekAgo = new Date(scope === "all" ? today.getTime() - 6 * 86400_000 : Math.max(ADMIN_TRACKING_START.getTime(), today.getTime() - 6 * 86400_000));
  const onlineSince = new Date(now.getTime() - ONLINE_WINDOW_MS);
  const [totalUsers, paidUsers, usersToday, usersWeek, usersMonth, claims, claimsToday, bundleOwners, onlineUsers, activeToday, signupRows, featureRows, claimGroups, recentUsers, recentClaims, plans, instagram] = await Promise.all([
    prisma.user.count({ where: periodUser }),
    prisma.user.count({ where: paidAccessWhere(now, scope) }),
    prisma.user.count({ where: { ...periodUser, createdAt: { gte: today } } }),
    prisma.user.count({ where: { ...periodUser, createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: periodUser }),
    prisma.user.count({ where: { ...periodUser, ebookSpinAt: scope === "all" ? { not: null } : { gte: ADMIN_TRACKING_START } } }),
    prisma.user.count({ where: { ...periodUser, ebookSpinAt: { gte: today } } }),
    prisma.user.count({ where: { ...periodUser, ebooksUnlockSource: "BUNDLE", ebooksUnlocked: true } }),
    prisma.auditLog.count({ where: { action: PRESENCE_ACTION, timestamp: { gte: onlineSince }, user: periodUser } }),
    prisma.auditLog.count({ where: { action: PRESENCE_ACTION, timestamp: { gte: today }, user: periodUser } }),
    prisma.$queryRaw<{ date: string; count: bigint }[]>(Prisma.sql`SELECT (u."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date::text AS date, COUNT(*)::bigint AS count FROM users u WHERE ${scopeUserSql(scope)} GROUP BY 1 ORDER BY 1`),
    getFeatureRanking(scope),
    prisma.user.groupBy({ by: ["ebookSpinPrize"], where: { ...periodUser, ebookSpinAt: scope === "all" ? { not: null } : { gte: ADMIN_TRACKING_START } }, _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.user.findMany({ where: periodUser, select: { id: true, name: true, email: true, planType: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.user.findMany({ where: { ...periodUser, ebookSpinAt: scope === "all" ? { not: null } : { gte: ADMIN_TRACKING_START } }, select: { id: true, name: true, ebookSpinPrize: true, ebookSpinAt: true }, orderBy: { ebookSpinAt: "desc" }, take: 5 }),
    prisma.user.groupBy({ by: ["planType"], where: paidAccessWhere(now, scope), _count: { id: true } }),
    getInstagramAudience(),
  ]);
  return {
    totalUsers, paidUsers, freeUsers: totalUsers - paidUsers, usersToday, usersWeek, usersMonth,
    claims, claimsToday, bundleOwners, onlineUsers, activeToday,
    conversionRate: totalUsers ? (paidUsers / totalUsers * 100).toFixed(1) : "0.0",
    claimRate: totalUsers ? (claims / totalUsers * 100).toFixed(1) : "0.0",
    signupTrend: daysTrend(signupRows, adminScopeDays(scope, signupRows[0]?.date, now)),
    featureRanking: featureRows,
    claimBreakdown: claimGroups.map(r => ({ subject: EBOOK_SUBJECTS.find(b => b.id === r.ebookSpinPrize)?.name ?? "Other", count: r._count.id })),
    recentUsers: recentUsers.map(u => ({ ...u, createdAt: u.createdAt.toISOString() })),
    recentClaims: recentClaims.map(u => ({ id: u.id, name: u.name, subject: EBOOK_SUBJECTS.find(b => b.id === u.ebookSpinPrize)?.name ?? "Sidekick", claimedAt: u.ebookSpinAt!.toISOString() })),
    planBreakdown: [{ plan: "Free", count: totalUsers - paidUsers }, ...plans.map(p => ({ plan: p.planType === "FREE" ? "Legacy paid" : p.planType === "BUNDLE" ? "Bundle" : "Pro", count: p._count.id }))],
    instagram,
    scope, updatedAt: now.toISOString(),
  };
}
export type OverviewStats = Awaited<ReturnType<typeof getOverviewStats>>;

export async function getUsersList(search = "", filter = "", page = 1) {
  const now = new Date();
  const where: Prisma.UserWhereInput = { AND: [realUser] };
  const conditions = where.AND as Prisma.UserWhereInput[];
  if (search) conditions.push({ OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] });
  if (filter === "paid") conditions.push(paidAccessWhere(now, "all"));
  if (filter === "free") conditions.push({ NOT: paidAccessWhere(now, "all") });
  if (filter === "claimed") conditions.push({ ebookSpinAt: { not: null } });
  if (filter === "online") conditions.push({ auditLogs: { some: { action: PRESENCE_ACTION, timestamp: { gte: new Date(now.getTime() - ONLINE_WINDOW_MS) } } } });
  if (filter === "bundle") conditions.push({ ebooksUnlockSource: "BUNDLE", ebooksUnlocked: true });
  const total = await prisma.user.count({ where });
  const currentPage = Math.min(Math.max(1, page), Math.max(1, Math.ceil(total / 50)));
  const users = await prisma.user.findMany({ where, select: {
    id: true, name: true, email: true, phone: true, isPaid: true, planType: true, subscriptionStatus: true, subscriptionExpiry: true,
    authProvider: true, createdAt: true, ebookSpinPrize: true, ebookSpinAt: true, ebooksUnlocked: true, onboardingComplete: true,
    auditLogs: { where: { action: PRESENCE_ACTION }, select: { timestamp: true }, take: 1 },
  }, orderBy: { createdAt: "desc" }, skip: (currentPage - 1) * 50, take: 50 });
  return { total, page: currentPage, pages: Math.max(1, Math.ceil(total / 50)), users: users.map(({ auditLogs, ...u }) => ({
    ...u, createdAt: u.createdAt.toISOString(), ebookSpinAt: u.ebookSpinAt?.toISOString() ?? null,
    subscriptionExpiry: u.subscriptionExpiry?.toISOString() ?? null,
    online: !!auditLogs[0] && now.getTime() - auditLogs[0].timestamp.getTime() < ONLINE_WINDOW_MS,
  })) };
}
export type AdminUsers = Awaited<ReturnType<typeof getUsersList>>;

export async function getRevenueData(scope: AdminScope, period: RevenuePeriod) {
  const [razorpay, access] = await Promise.all([getRazorpayRevenueSnapshot(), prisma.user.count({ where: paidAccessWhere(new Date(), scope) })]);
  if (razorpay.status === "ready") {
    const scopedPayments = scope === "all" ? razorpay.payments : razorpay.payments.filter(payment => new Date(payment.createdAt) >= ADMIN_TRACKING_START);
    const start = period.start ? new Date(period.start) : null;
    const end = period.end ? new Date(period.end) : null;
    const periodPayments = scopedPayments.filter(payment => (!start || new Date(payment.createdAt) >= start) && (!end || new Date(payment.createdAt) < end));
    const totalAmountPaise = scopedPayments.reduce((sum, payment) => sum + payment.amountPaise, 0);
    const totalRefundedPaise = scopedPayments.reduce((sum, payment) => sum + payment.refundedPaise, 0);
    const totalFeePaise = scopedPayments.reduce((sum, payment) => sum + payment.feePaise, 0);
    const userIds = [...new Set(periodPayments.map(payment => payment.userId).filter(Boolean))];
    const emails = [...new Set(periodPayments.map(payment => payment.email).filter(Boolean))];
    const users = await prisma.user.findMany({
      where: { OR: [{ id: { in: userIds } }, { email: { in: emails, mode: "insensitive" } }] },
      select: { id: true, name: true, email: true },
    });
    const usersById = new Map(users.map(user => [user.id, user]));
    const usersByEmail = new Map(users.map(user => [user.email.toLowerCase(), user]));
    const products = new Map<string, { amount: number; payments: number }>();
    const timeline = new Map<string, number>();
    const buyers = new Set<string>();
    let amountPaise = 0;
    let refundedPaise = 0;
    let feePaise = 0;
    for (const payment of periodPayments) {
      amountPaise += payment.amountPaise;
      refundedPaise += payment.refundedPaise;
      feePaise += payment.feePaise;
      buyers.add(payment.userId || payment.email.toLowerCase() || payment.contact || payment.id);
      const product = products.get(payment.product) ?? { amount: 0, payments: 0 };
      product.amount += payment.amountPaise - payment.refundedPaise;
      product.payments += 1;
      products.set(payment.product, product);
      const day = istDay(new Date(payment.createdAt));
      timeline.set(day, (timeline.get(day) ?? 0) + payment.amountPaise - payment.refundedPaise);
    }
    const timelineRows = [...timeline].map(([date, count]) => ({ date, count: BigInt(count) }));
    const timelineDays = period.range === "total" ? adminScopeDays(scope, [...timeline.keys()].sort()[0]) : period.days;
    return {
      totalAmount: totalAmountPaise / 100,
      totalNet: (totalAmountPaise - totalRefundedPaise - totalFeePaise) / 100,
      amount: amountPaise / 100,
      refunded: refundedPaise / 100,
      fees: feePaise / 100,
      net: (amountPaise - refundedPaise - feePaise) / 100,
      payments: periodPayments.length,
      buyers: buyers.size,
      paidAccess: access,
      source: "razorpay" as const,
      fetchedAt: razorpay.fetchedAt,
      truncated: razorpay.truncated,
      sourceMessage: `${scope === "all" ? "All-time" : "Standalone revenue since 1 Nov 2026"} · Live Razorpay history · refreshed every 5 minutes`,
      products: [...products].map(([product, value]) => ({ product, amount: value.amount / 100, payments: value.payments })).sort((a, b) => b.amount - a.amount),
      timeline: daysTrend(timelineRows, timelineDays, new Date(`${period.lastDay}T00:00:00+05:30`)).map(row => ({ date: row.date, count: row.count / 100 })),
      recentPayments: [...periodPayments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20).map(payment => {
        const user = usersById.get(payment.userId) ?? usersByEmail.get(payment.email.toLowerCase());
        return { id: payment.id, name: user?.name ?? payment.email.split("@")[0] ?? "Customer", email: user?.email ?? payment.email, amount: payment.amountPaise / 100, refunded: payment.refundedPaise / 100, product: payment.product, paymentId: payment.id, method: payment.method, date: payment.createdAt };
      }),
    };
  }

  const scopePeriodSql = scope === "all" ? Prisma.empty : Prisma.sql`AND a.timestamp >= ${ADMIN_TRACKING_START}`;
  const selectedStartSql = period.start ? Prisma.sql`AND a.timestamp >= ${new Date(period.start)}` : Prisma.empty;
  const selectedEndSql = period.end ? Prisma.sql`AND a.timestamp < ${new Date(period.end)}` : Prisma.empty;
  const timestampWhere = { ...(period.start ? { gte: new Date(period.start) } : {}), ...(period.end ? { lt: new Date(period.end) } : {}) };
  const paymentWhere: Prisma.AuditLogWhereInput = { action: "PAYMENT_CAPTURED", user: realUser, ...(Object.keys(timestampWhere).length ? { timestamp: timestampWhere } : {}) };
  const [totalSummary, summary, products, timeline, payments] = await Promise.all([
    prisma.$queryRaw<{ amount: bigint }[]>(Prisma.sql`SELECT COALESCE(SUM((a.metadata->>'amountPaise')::bigint),0)::bigint AS amount FROM audit_logs a JOIN users u ON u.id=a."userId" WHERE a.action='PAYMENT_CAPTURED' ${scopePeriodSql} AND ${realUserSql}`),
    prisma.$queryRaw<{ amount: bigint; payments: bigint; buyers: bigint }[]>(Prisma.sql`SELECT COALESCE(SUM((a.metadata->>'amountPaise')::bigint),0)::bigint AS amount, COUNT(*)::bigint AS payments, COUNT(DISTINCT a."userId")::bigint AS buyers FROM audit_logs a JOIN users u ON u.id=a."userId" WHERE a.action='PAYMENT_CAPTURED' ${selectedStartSql} ${selectedEndSql} AND ${realUserSql}`),
    prisma.$queryRaw<{ product: string; amount: bigint; payments: bigint }[]>(Prisma.sql`SELECT a.metadata->>'purchaseType' AS product, SUM((a.metadata->>'amountPaise')::bigint)::bigint AS amount, COUNT(*)::bigint AS payments FROM audit_logs a JOIN users u ON u.id=a."userId" WHERE a.action='PAYMENT_CAPTURED' ${selectedStartSql} ${selectedEndSql} AND ${realUserSql} GROUP BY 1 ORDER BY amount DESC`),
    prisma.$queryRaw<{ date: string; amount: bigint }[]>(Prisma.sql`SELECT (a.timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date::text AS date, SUM((a.metadata->>'amountPaise')::bigint)::bigint AS amount FROM audit_logs a JOIN users u ON u.id=a."userId" WHERE a.action='PAYMENT_CAPTURED' ${selectedStartSql} ${selectedEndSql} AND ${realUserSql} GROUP BY 1 ORDER BY 1`),
    prisma.auditLog.findMany({ where: paymentWhere, include: { user: { select: { name: true, email: true } } }, orderBy: { timestamp: "desc" }, take: 20 }),
  ]);
  const amount = Number(summary[0]?.amount ?? 0) / 100;
  return { totalAmount: Number(totalSummary[0]?.amount ?? 0) / 100, totalNet: Number(totalSummary[0]?.amount ?? 0) / 100, amount, refunded: 0, fees: 0, net: amount, payments: Number(summary[0]?.payments ?? 0), buyers: Number(summary[0]?.buyers ?? 0), paidAccess: access,
    source: "ledger" as const, fetchedAt: razorpay.fetchedAt, truncated: false,
    sourceMessage: razorpay.status === "unconfigured" ? "Add Razorpay server credentials to load complete payment history." : (razorpay.error ?? "Razorpay unavailable. Showing verified webhook records."),
    products: products.map(r => ({ product: r.product, amount: Number(r.amount) / 100, payments: Number(r.payments) })),
    timeline: daysTrend(timeline.map(r => ({ date: r.date, count: r.amount })), period.range === "total" ? adminScopeDays(scope, timeline[0]?.date) : period.days, new Date(`${period.lastDay}T00:00:00+05:30`)).map(r => ({ date: r.date, count: r.count / 100 })),
    recentPayments: payments.map(p => { const m = p.metadata as { amountPaise: number; purchaseType: string; paymentId: string }; return { id: p.id, name: p.user.name, email: p.user.email, amount: m.amountPaise / 100, refunded: 0, product: m.purchaseType, paymentId: m.paymentId, method: "—", date: p.timestamp.toISOString() }; }),
  };
}
export type RevenueStats = Awaited<ReturnType<typeof getRevenueData>>;

export async function getFeatureUsageData(scope: AdminScope = "november") {
  const periodUser = scopeUserWhere(scope);
  const timestampFilter = scope === "all" ? {} : { timestamp: { gte: ADMIN_TRACKING_START } };
  const createdFilter = scope === "all" ? {} : { createdAt: { gte: ADMIN_TRACKING_START } };
  const periodSql = scope === "all" ? Prisma.empty : Prisma.sql`AND a.timestamp >= ${ADMIN_TRACKING_START}`;
  const [featureRanking, ai, tests, focus, notes, doubts, aiTrend] = await Promise.all([
    getFeatureRanking(scope),
    prisma.aiUsageLog.groupBy({ by: ["feature"], where: { user: periodUser, ...timestampFilter }, _count: { id: true }, _sum: { tokens: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.testAttempt.count({ where: { student: periodUser, ...createdFilter } }),
    prisma.focusSession.aggregate({ where: { user: periodUser, ...createdFilter }, _count: { id: true }, _sum: { actualDuration: true } }),
    prisma.note.count({ where: { student: periodUser, ...createdFilter } }),
    prisma.doubtConversation.count({ where: { student: periodUser, ...createdFilter } }),
    prisma.$queryRaw<{ date: string; count: bigint }[]>(Prisma.sql`SELECT (a.timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date::text AS date, COUNT(*)::bigint AS count FROM ai_usage_logs a JOIN users u ON u.id=a."userId" WHERE ${scopeUserSql(scope)} ${periodSql} GROUP BY 1 ORDER BY 1`),
  ]);
  return { featureRanking, ai: ai.map(r => ({ feature: r.feature.replaceAll("_", " ").toLowerCase(), calls: r._count.id, tokens: r._sum.tokens ?? 0 })),
    totalAiCalls: ai.reduce((sum,r) => sum + r._count.id, 0), tokens: ai.reduce((sum,r) => sum + (r._sum.tokens ?? 0),0),
    tests, focusSessions: focus._count.id, focusHours: Math.round((focus._sum.actualDuration ?? 0) / 60), notes, doubts, aiTrend: daysTrend(aiTrend, adminScopeDays(scope, aiTrend[0]?.date)), scope,
  };
}
export type FeatureStats = Awaited<ReturnType<typeof getFeatureUsageData>>;
