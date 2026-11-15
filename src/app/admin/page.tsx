import { getAdminEmail } from "@/lib/admin-auth";
import { getOverviewStats } from "@/lib/admin";
import OverviewDashboard from "./OverviewDashboard";
import { parseAdminScope } from "@/lib/admin-period";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  if (!(await getAdminEmail())) return null;
  const scope = parseAdminScope((await searchParams).scope);
  const data = await getOverviewStats(scope);
  return <OverviewDashboard data={data} scope={scope} />;
}
