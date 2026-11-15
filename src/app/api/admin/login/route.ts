import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { compare } from "bcryptjs";
import { ADMIN_EMAIL, adminSecret } from "@/lib/admin-auth";
import { checkRateLimitAsync, AUTH_RATE_LIMIT } from "@/lib/api-rate-limit";

// Server-only hash; can be replaced through deployment configuration.
const DEFAULT_PASSWORD_HASH = "$2b$12$hvOtrvwMe0TfkeYIKC5.due.maDja.z6JrCWg/GYiopDxQKzdslnm";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await checkRateLimitAsync(`admin-login:${ip}`, AUTH_RATE_LIMIT);
  if (!limit.allowed) return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  const input = await req.json().catch(() => null);
  if (typeof input?.email !== "string" || typeof input?.password !== "string" || input.password.length > 256) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const validPassword = await compare(input.password, process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH);
  if (input.email.toLowerCase().trim() !== ADMIN_EMAIL || !validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await new SignJWT({ email: ADMIN_EMAIL, role: "admin" })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(adminSecret());
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin-token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res;
}
