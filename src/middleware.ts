import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

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
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // 2. PAYMENT GATE: Redirect to Pricing if Authenticated but Unpaid
    // Exception: Allow /dashboard/profile to let users see their info or logout
    if (isProtectedRoute && isAuthenticated && !isPaid) {
        // You might want to allow some routes, but for "Hard Gated", we block dashboard
        // We can allow them to go to /pricing
        /* 
           If the user is on /dashboard and NOT paid -> /pricing
           If the user is on /pricing -> Allow (handled by default as it's not in protectedRoutes?)
           Wait, protectedRoutes = ['/dashboard']. Pricing is public.
        */
        return NextResponse.redirect(new URL('/pricing', request.url));
    }

    // 3. Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
        // If paid -> Dashboard. If Unpaid -> Pricing
        if (isPaid) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/pricing', request.url));
        }
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
