import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { LOCKED_ROUTES } from '@/lib/tier-config';
import type { SessionUser } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/onboarding'];
const authRoutes = ['/login', '/signup'];

// Grandfathering cutoff — users created before this date keep full access
const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth-token')?.value;

    let isAuthenticated = false;
    let isPaid = false;
    let onboardingComplete = false;
    let user: SessionUser | null = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || 'your-secret-key-change-in-production'
            );
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

    // 3. Free tier route guard — locked features redirect to dashboard
    if (isProtectedRoute && !pathname.startsWith('/onboarding') && isAuthenticated && !isPaid) {
        const isLocked = LOCKED_ROUTES.some(r => pathname.startsWith(r));
        if (isLocked) {
            const res = NextResponse.redirect(new URL('/dashboard?locked=true', request.url));
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
    }

    // 4. Pricing page guard
    if (pathname === '/pricing') {
        if (!isAuthenticated) {
            const res = NextResponse.redirect(new URL('/signup', request.url));
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
        if (isPaid) {
            const res = NextResponse.redirect(new URL('/dashboard', request.url));
            res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res;
        }
    }

    // 5. Root redirect
    if (pathname === '/') {
        const dest = isAuthenticated ? '/dashboard' : '/login';
        const res = NextResponse.redirect(new URL(dest, request.url));
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return res;
    }

    // 6. Auth routes → dashboard if already logged in
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|fonts).*)',
    ],
};
