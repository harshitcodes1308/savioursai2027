import { getAdminEmail } from "@/lib/admin-auth";
import { getFeatureUsageData } from "@/lib/admin";
import FeaturesDashboard from "./FeaturesDashboard";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage() {
  if (!(await getAdminEmail())) return null;
  const data = await getFeatureUsageData();
  return <FeaturesDashboard data={data} />;
}
