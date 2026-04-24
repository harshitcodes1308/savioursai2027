import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, GOOGLE_AUTH_RATE_LIMIT } from "@/lib/api-rate-limit";
import crypto from "crypto";

export async function GET(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const rateCheck = checkRateLimit(`google-auth:${ip}`, GOOGLE_AUTH_RATE_LIMIT);
    if (!rateCheck.allowed) {
        return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
    }

    // Derive the base URL from the current request so the redirect_uri and
    // the cookie domain always match whichever host the user is actually on.
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const baseUrl = forwardedHost
        ? `${forwardedProto || (forwardedHost.startsWith("localhost") ? "http" : "https")}://${forwardedHost}`
        : process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

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

    // Build the Set-Cookie header manually and emit it on a plain redirect.
    // Using response.cookies.set on NextResponse.redirect has been observed
    // to occasionally drop the cookie on serverless runtimes, so we write
    // the header directly which is the most reliable path.
    const isSecure = (forwardedProto || "").toLowerCase() === "https";
    const cookieParts = [
        `oauth-state=${state}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        "Max-Age=600",
    ];
    if (isSecure) cookieParts.push("Secure");
    const cookieHeader = cookieParts.join("; ");

    return new NextResponse(null, {
        status: 302,
        headers: {
            Location: googleAuthUrl,
            "Set-Cookie": cookieHeader,
            "Cache-Control": "no-store",
        },
    });
}
