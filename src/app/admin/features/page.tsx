import { getAdminEmail } from "@/lib/admin-auth";
import { getFeatureUsageData } from "@/lib/admin";
import FeaturesDashboard from "./FeaturesDashboard";
import { parseAdminScope } from "@/lib/admin-period";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  if (!(await getAdminEmail())) return null;
  const scope = parseAdminScope((await searchParams).scope);
  const data = await getFeatureUsageData(scope);
  return <FeaturesDashboard data={data} scope={scope} />;
}
