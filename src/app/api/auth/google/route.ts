import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, GOOGLE_AUTH_RATE_LIMIT } from "@/lib/api-rate-limit";
import crypto from "crypto";

export async function GET(request: NextRequest) {
    // Rate limit Google auth attempts by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const rateCheck = checkRateLimit(`google-auth:${ip}`, GOOGLE_AUTH_RATE_LIMIT);
    if (!rateCheck.allowed) {
        return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!clientId) {
        return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
    }

    // Generate CSRF state token
    const state = crypto.randomBytes(32).toString("hex");

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        state,
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    const response = NextResponse.redirect(googleAuthUrl);

    // Store state in HttpOnly cookie for callback verification
    response.cookies.set("oauth-state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600, // 10 minutes
        path: "/",
    });

    return response;
}
