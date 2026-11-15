import { getAdminEmail } from "@/lib/admin-auth";
import { getRevenueData } from "@/lib/admin";
import RevenueDashboard from "./RevenueDashboard";
import { parseAdminScope } from "@/lib/admin-period";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  if (!(await getAdminEmail())) return null;
  const scope = parseAdminScope((await searchParams).scope);
  const data = await getRevenueData(scope);
  return <RevenueDashboard data={data} scope={scope} />;
}
