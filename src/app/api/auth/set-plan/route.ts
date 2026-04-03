import { NextRequest, NextResponse } from 'next/server';
import { getSession, createToken, setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { planType } = await request.json();
        if (!['FREE', 'MONTHLY', 'YEARLY'].includes(planType)) {
            return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { planType },
        });

        // Refresh session token with updated plan
        const updatedUser = { ...session.user, planType };
        const newToken = await createToken(updatedUser);

        const response = NextResponse.json({ success: true });
        const headers = new Headers();
        await setSessionCookie(newToken, false, headers);
        headers.forEach((value, key) => response.headers.set(key, value));

        return response;
    } catch (error) {
        console.error('[set-plan]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
