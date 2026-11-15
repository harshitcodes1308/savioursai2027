import { getAdminEmail } from "@/lib/admin-auth";
import AdminShell from "./AdminShell";
import AdminLogin from "./AdminLogin";
import "./admin.css";

export const metadata = { title: "Admin — Saviours AI", robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail();
  return email ? <AdminShell adminEmail={email}>{children}</AdminShell> : <AdminLogin />;
}
