import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import type { SessionUser } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/onboarding'];
const authRoutes = ['/login', '/signup'];

// Grandfathering cutoff — users created before this date keep full access
const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Creator Portal Protection ──
    if (pathname.startsWith('/creator/dashboard')) {
        const creatorToken = request.cookies.get('creator-token')?.value;
        if (!creatorToken) {
            return NextResponse.redirect(new URL('/creator/login', request.url));
        }
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-creator-panel");
            const { payload } = await jwtVerify(creatorToken, secret);
            if (!payload || payload.role !== 'creator') {
                throw new Error("Invalid payload");
            }
        } catch {
            const res = NextResponse.redirect(new URL('/creator/login', request.url));
            res.cookies.delete('creator-token');
            return res;
        }
    }

    if (pathname === '/creator/login') {
        const creatorToken = request.cookies.get('creator-token')?.value;
        if (creatorToken) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET + "-creator-panel");
                const { payload } = await jwtVerify(creatorToken, secret);
                if (payload && payload.role === 'creator') {
                    return NextResponse.redirect(new URL('/creator/dashboard', request.url));
                }
            } catch {
                // Ignore, let them log in
            }
        }
    }

    const token = request.cookies.get('auth-token')?.value;

    let isAuthenticated = false;
    let isPaid = false;
    let onboardingComplete = false;
    let user: SessionUser | null = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            const { payload } = await jwtVerify(token, secret);
            isAuthenticated = true;
            user = payload.user as SessionUser;

            // Subscription check — handle old tokens missing planType gracefully
            const planType = user?.planType ?? 'FREE';
            const subscriptionStatus = user?.subscriptionStatus ?? 'ACTIVE';
            const hasActiveSub =
                (planType === 'MONTHLY' || planType === 'YEARLY') &&
                subscriptionStatus === 'ACTIVE';

            isPaid = user?.isPaid || hasActiveSub;
            onboardingComplete = user?.onboardingComplete ?? false;

        } catch {
            isAuthenticated = false;
        }
    }

    const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r));
    const isAuthRoute = authRoutes.some(r => pathname.startsWith(r));

    // 1. Require auth for protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // 2. Onboarding guard — redirect to /onboarding if not completed
    if (
        isAuthenticated &&
        !onboardingComplete &&
        pathname.startsWith('/dashboard')
    ) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // 3. Free tier route guard — REMOVED from middleware.
    // JWT can be stale when plan is changed directly in the DB (e.g. admin promotes
    // a user in Neon). Locking is now handled client-side by the dashboard layout,
    // which reads the DB-fresh profile via tRPC. This ensures direct DB plan changes
    // take effect immediately without requiring the user to re-login.

    // 4. Pricing page guard
    if (pathname === '/pricing') {
        if (!isAuthenticated) {
            const res = NextResponse.redirect(new URL('/signup', request.url));
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
        // Allow access if subscription is cancelled/expired (user needs to re-enroll)
        const subStatus = user?.subscriptionStatus ?? 'ACTIVE';
        const needsReenroll = subStatus === 'CANCELLED' || subStatus === 'EXPIRED';
        if (isPaid && !needsReenroll) {
            const res = NextResponse.redirect(new URL('/dashboard', request.url));
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
    }

    // 5. Root — serve the public landing page to logged-out visitors.
    //    Authenticated users are redirected away server-side (no flash of landing).
    if (pathname === '/') {
        // Authenticated + onboarded → dashboard
        if (isAuthenticated && onboardingComplete) {
            const res = NextResponse.redirect(new URL('/dashboard', request.url));
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
        // Authenticated but onboarding incomplete → onboarding
        if (isAuthenticated && !onboardingComplete) {
            const res = NextResponse.redirect(new URL('/onboarding', request.url));
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
        // Logged-out → fall through and render the landing page at /
        return NextResponse.next();
    }

    // 6. Auth routes → dashboard if already logged in (and onboarded)
    if (isAuthRoute && isAuthenticated) {
        if (!onboardingComplete) {
            // Clear the stale cookie so they can sign in / sign up fresh
            const res = NextResponse.redirect(new URL(pathname, request.url));
            res.cookies.delete('auth-token');
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|fonts).*)',
    ],
};
