import { NextRequest, NextResponse } from 'next/server';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(_request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { onboardingComplete: true },
        });

        const refreshedUser = {
            ...session.user,
            onboardingComplete: true,
            name: updatedUser.name, // pick up any name changes from onboarding
        };

        const newToken = await createToken(refreshedUser);
        const response = NextResponse.json({ success: true });

        const headers = new Headers();
        await setSessionCookie(newToken, false, headers);
        headers.forEach((value, key) => response.headers.set(key, value));

        return response;
    } catch (error) {
        console.error('[complete-onboarding]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
