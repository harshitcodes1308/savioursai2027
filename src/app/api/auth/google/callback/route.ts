import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken, setSessionCookie } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (error || !code) {
        return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`);
    }

    try {
        // Exchange code for tokens
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${baseUrl}/api/auth/google/callback`,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            console.error("Google token exchange failed:", tokenData);
            return NextResponse.redirect(`${baseUrl}/login?error=google_token_failed`);
        }

        // Get user profile from Google
        const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const profile = await profileRes.json();

        if (!profile.email) {
            return NextResponse.redirect(`${baseUrl}/login?error=google_no_email`);
        }

        // Find or create user in DB
        let user = await prisma.user.findUnique({
            where: { email: profile.email.toLowerCase() },
        });

        // GRANDFATHERING LOGIC
        const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");

        if (!user) {
            // New user — create account
            user = await prisma.user.create({
                data: {
                    email: profile.email.toLowerCase(),
                    name: profile.name || profile.email.split("@")[0],
                    password: null, // Google users don't have passwords
                    image: profile.picture || null,
                    authProvider: "google",
                    role: "STUDENT",
                    isPaid: false,
                    emailVerified: new Date(),
                },
            });

            // Create default student profile
            await prisma.studentProfile.create({
                data: { userId: user.id, grade: 10 },
            });
        } else {
            // Existing user — update their Google info if they didn't have it
            if (user.authProvider !== "google") {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        authProvider: "google",
                        image: user.image || profile.picture || null,
                        emailVerified: user.emailVerified || new Date(),
                    },
                });
            }
        }

        // Determine isPaid status (with legacy grandfathering)
        const isLegacyUser = user.createdAt < CUTOFF_DATE;
        const isPaid = user.isPaid || isLegacyUser;

        // Create session
        const sessionUser: SessionUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isPaid,
            planType: isLegacyUser && user.planType === "FREE" ? "YEARLY" : user.planType,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionExpiry: user.subscriptionExpiry?.toISOString() ?? null,
            onboardingComplete: user.onboardingComplete,
            lnbChemistryUnlocked: user.lnbChemistryUnlocked,
        };

        const token = await createToken(sessionUser);
        await setSessionCookie(token, true); // Remember me = true for Google users

        // Redirect: if onboarding not complete, go there; otherwise dashboard
        if (!user.onboardingComplete) {
            return NextResponse.redirect(`${baseUrl}/onboarding`);
        }

        return NextResponse.redirect(`${baseUrl}/dashboard`);
    } catch (err) {
        console.error("Google auth callback error:", err);
        return NextResponse.redirect(`${baseUrl}/login?error=google_auth_error`);
    }
}
