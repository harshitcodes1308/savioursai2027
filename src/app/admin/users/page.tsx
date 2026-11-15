import { getAdminEmail } from "@/lib/admin-auth";
import { getUsersList } from "@/lib/admin";
import UsersTable from "./UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ search?: string; filter?: string; page?: string }> }) {
  if (!(await getAdminEmail())) return null;
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.slice(0, 200) : "";
  const filter = typeof params.filter === "string" ? params.filter : "";
  const page = Math.max(1, Math.floor(Number(params.page) || 1));
  const data = await getUsersList(search, filter, Number.isFinite(page) ? page : 1);
  return <UsersTable key={`${search}:${filter}`} data={data} search={search} filter={filter} />;
}
