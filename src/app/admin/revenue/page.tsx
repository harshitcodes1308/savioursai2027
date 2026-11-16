import { getAdminEmail } from "@/lib/admin-auth";
import { getRevenueData } from "@/lib/admin";
import RevenueDashboard from "./RevenueDashboard";
import { parseAdminScope, parseRevenuePeriod } from "@/lib/admin-period";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage({ searchParams }: { searchParams: Promise<{ scope?: string; range?: string; from?: string; to?: string }> }) {
  if (!(await getAdminEmail())) return null;
  const params = await searchParams;
  const scope = parseAdminScope(params.scope);
  const period = parseRevenuePeriod(params, scope);
  const data = await getRevenueData(scope, period);
  return <RevenueDashboard data={data} scope={scope} period={period} />;
}
