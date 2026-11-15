import { getAdminEmail } from "@/lib/admin-auth";
import { getRevenueData } from "@/lib/admin";
import RevenueDashboard from "./RevenueDashboard";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage() {
  if (!(await getAdminEmail())) return null;
  const data = await getRevenueData();
  return <RevenueDashboard data={data} />;
}
