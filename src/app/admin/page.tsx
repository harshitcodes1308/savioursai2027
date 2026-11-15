import { getAdminEmail } from "@/lib/admin-auth";
import { getOverviewStats } from "@/lib/admin";
import OverviewDashboard from "./OverviewDashboard";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  if (!(await getAdminEmail())) return null;
  const data = await getOverviewStats();
  return <OverviewDashboard data={data} />;
}
