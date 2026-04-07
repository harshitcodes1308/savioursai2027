import { NextRequest, NextResponse } from 'next/server';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/save-profile
 * body: { name: string, phone: string }
 *
 * Persists name + phone for the current user. Phone is mandatory and must be unique.
 * Used by the onboarding flow to capture phone numbers from Google OAuth users
 * (and any user who reaches onboarding without a saved phone).
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, phone } = await request.json();

        // Validate phone — strip non-digits, must be at least 10 digits
        const cleanedPhone = String(phone || '').replace(/\D/g, '');
        if (cleanedPhone.length < 10) {
            return NextResponse.json(
                { error: 'Please enter a valid 10-digit phone number' },
                { status: 400 }
            );
        }

        const cleanedName = String(name || '').trim();
        if (cleanedName.length < 2) {
            return NextResponse.json(
                { error: 'Please enter a valid name' },
                { status: 400 }
            );
        }

        // Check if phone is already used by another user
        const existing = await prisma.user.findUnique({
            where: { phone: cleanedPhone },
        });
        if (existing && existing.id !== session.user.id) {
            return NextResponse.json(
                { error: 'This phone number is already registered to another account' },
                { status: 409 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { name: cleanedName, phone: cleanedPhone },
        });

        // Refresh session token with new name
        const refreshedUser = {
            ...session.user,
            name: updatedUser.name,
        };
        const newToken = await createToken(refreshedUser);

        const response = NextResponse.json({ success: true });
        const headers = new Headers();
        await setSessionCookie(newToken, false, headers);
        headers.forEach((value, key) => response.headers.set(key, value));

        return response;
    } catch (error) {
        console.error('[save-profile]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
