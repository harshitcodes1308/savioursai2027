import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const ADMIN_EMAIL = "care.savioursai@gmail.com";

export function adminSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  return new TextEncoder().encode(process.env.JWT_SECRET + "-admin-panel");
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, adminSecret(), { algorithms: ["HS256"] });
    return payload.role === "admin" && payload.email === ADMIN_EMAIL ? ADMIN_EMAIL : null;
  } catch { return null; }
}

export const getAdminEmail = cache(async () => {
  const token = (await cookies()).get("admin-token")?.value;
  return token ? verifyAdminToken(token) : null;
});

export async function verifyAdmin(request?: Request) {
  const authorization = request?.headers.get("Authorization");
  return authorization?.startsWith("Bearer ")
    ? !!(await verifyAdminToken(authorization.slice(7)))
    : !!(await getAdminEmail());
}
