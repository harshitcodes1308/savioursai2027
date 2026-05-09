import { getUsersList } from "@/lib/admin";
import UsersTable from "./UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ search?: string; filter?: string }> }) {
  const params = await searchParams;
  const search = params.search ?? "";
  const filter = params.filter ?? "";
  const users = await getUsersList(search || undefined, filter || undefined);
  return <UsersTable users={users} search={search} filter={filter} />;
}
