import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_ACCOUNTS: Record<string, string> = {
  "me.harshit1308@gmail.com": "admin@123",
  "tripathiayush912@gmail.com": "admin@123",
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const expected = ADMIN_ACCOUNTS[email.toLowerCase().trim()];
  if (!expected || expected !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-admin-panel");

  const token = await new SignJWT({ email: email.toLowerCase().trim(), role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  const res = NextResponse.json({ success: true, token });
  res.headers.append(
    "Set-Cookie",
    `admin-token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
  );

  return res;
}
