import { NextRequest, NextResponse } from 'next/server';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PlanType } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { code } = await request.json();

        if (!code || typeof code !== 'string' || !code.trim().startsWith('W')) {
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }

        // Activate as Yearly plan (full access, no payment needed)
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                planType: 'YEARLY',
                isPaid: true,
                subscriptionStatus: 'ACTIVE',
                subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
        });

        // Refresh session token
        const updatedUser = { ...session.user, planType: 'YEARLY' as PlanType };
        const newToken = await createToken(updatedUser);

        const response = NextResponse.json({ success: true });
        const headers = new Headers();
        await setSessionCookie(newToken, false, headers);
        headers.forEach((value, key) => response.headers.set(key, value));

        return response;
    } catch (error) {
        console.error('[activate-domin8]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
