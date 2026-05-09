import { getOverviewStats } from "@/lib/admin";
import OverviewDashboard from "./OverviewDashboard";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getOverviewStats();
  return <OverviewDashboard data={data} />;
}
