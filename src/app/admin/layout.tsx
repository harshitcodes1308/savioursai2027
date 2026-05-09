import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import AdminShell from "./AdminShell";
import AdminLogin from "./AdminLogin";

export const metadata = { title: "Admin Panel — Saviours AI" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  let adminEmail = "";
  let isValid = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-admin-panel");
      const { payload } = await jwtVerify(token, secret);
      if (payload.email && payload.role === "admin") {
        adminEmail = payload.email as string;
        isValid = true;
      }
    } catch {
      isValid = false;
    }
  }

  if (!isValid) {
    return <AdminLogin />;
  }

  return <AdminShell adminEmail={adminEmail}>{children}</AdminShell>;
}
