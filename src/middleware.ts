import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    let isAuthenticated = false;

    if (token) {
        try {
            const secret = new TextEncoder().encode(
                process.env.JWT_SECRET || 'your-secret-key-change-in-production'
            );
            await jwtVerify(token, secret);
            isAuthenticated = true;
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

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Redirect to dashboard if accessing auth routes while authenticated
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
