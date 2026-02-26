import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, GOOGLE_AUTH_RATE_LIMIT } from "@/lib/api-rate-limit";

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

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return NextResponse.redirect(googleAuthUrl);
}
