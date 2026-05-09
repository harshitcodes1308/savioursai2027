import { getRevenueData } from "@/lib/admin";
import RevenueDashboard from "./RevenueDashboard";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage() {
  const data = await getRevenueData();
  return <RevenueDashboard data={data} />;
}
