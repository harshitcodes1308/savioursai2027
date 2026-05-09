import { getFeatureUsageData } from "@/lib/admin";
import FeaturesDashboard from "./FeaturesDashboard";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage() {
  const data = await getFeatureUsageData();
  return <FeaturesDashboard data={data} />;
}
