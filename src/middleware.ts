import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';
import { LOCKED_ROUTES } from '@/lib/tier-config';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/onboarding'];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // console.log(`Middleware processing: ${pathname}`);

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    // console.log(`Token present: ${!!token}`);

    let isAuthenticated = false;
    let isPaid = false;

    if (token) {
        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || 'your-secret-key-change-in-production'
            );
            const { payload } = await jwtVerify(token, secret);
            isAuthenticated = true;
            // Check Payment Status from Token
            const user = payload.user as any;
            isPaid = user?.isPaid || false;
            
        } catch (error) {
            // Token is invalid or expired
            isAuthenticated = false;
        }
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if route is an auth route
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    // 1. Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
        // Allow onboarding page to redirect to login (not loop)
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // 1b. Phone check: redirect to /onboarding if no phone number
    // Check for dashboard AND pricing routes (not onboarding itself)
    if ((pathname.startsWith('/dashboard') || pathname === '/pricing') && isAuthenticated && token) {
        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || 'your-secret-key-change-in-production'
            );
            const { payload } = await jwtVerify(token, secret);
            const userId = (payload.user as any)?.id;
            if (userId) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { phone: true }
                });
                if (dbUser && !dbUser.phone) {
                    return NextResponse.redirect(new URL('/onboarding', request.url));
                }
            }
        } catch {
            // Token invalid, let the normal auth flow handle it
        }
    }

    // 2. FREE TIER ROUTE GUARD: Redirect unpaid users from locked routes
    // Unpaid users can access the dashboard but locked features redirect to /dashboard?locked=true
    if (isProtectedRoute && !pathname.startsWith('/onboarding') && isAuthenticated && !isPaid) {
        // Check if this is a locked route for free users
        const isLocked = LOCKED_ROUTES.some(route => pathname.startsWith(route));
        if (isLocked) {
            const lockedRedirect = NextResponse.redirect(new URL('/dashboard?locked=true', request.url));
            lockedRedirect.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return lockedRedirect;
        }
        // Free routes → allow through
    }

    // 3. Pricing Page Guard: Control access to /pricing
    if (pathname === '/pricing') {
        if (!isAuthenticated) {
            // Not logged in → redirect to signup
            const signupRedirect = NextResponse.redirect(new URL('/signup', request.url));
            signupRedirect.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return signupRedirect;
        }
        // Paid users → redirect to dashboard (already have access)
        if (isPaid) {
            const dashboardRedirect = NextResponse.redirect(new URL('/dashboard', request.url));
            dashboardRedirect.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return dashboardRedirect;
        }
        // Unpaid authenticated user → allow access to pricing (upgrade page)
    }

    // 4. Handle Root Path: Redirect authenticated users to dashboard, others to login
    if (pathname === '/') {
        if (isAuthenticated) {
            // Both paid and free users go to dashboard
            const dashboardRedirect = NextResponse.redirect(new URL('/dashboard', request.url));
            dashboardRedirect.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return dashboardRedirect;
        }
        const loginRedirect = NextResponse.redirect(new URL('/login', request.url));
        loginRedirect.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        return loginRedirect;
    }

    // 5. Redirect authenticated users from auth routes to dashboard
    // Both paid and free users go to dashboard if already logged in
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
    ],
};
