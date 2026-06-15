import { prisma } from "@/lib/prisma";
import CreatorsDashboard from "./CreatorsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminCreatorsPage() {
  const creators = await prisma.creator.findMany({
    orderBy: { createdAt: "asc" },
  });

  // Count users per creator
  const usageCounts = await prisma.user.groupBy({
    by: ["creatorCode"],
    _count: { id: true },
    where: { creatorCode: { not: null } },
  });

  const usageMap: Record<string, number> = {};
  for (const row of usageCounts) {
    if (row.creatorCode) usageMap[row.creatorCode] = row._count.id;
  }

  const creatorsWithUsage = creators.map(c => ({
    ...c,
    userCount: usageMap[c.creatorCode] ?? 0,
  }));

  return <CreatorsDashboard creators={creatorsWithUsage} />;
}
