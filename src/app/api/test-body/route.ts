import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        return NextResponse.json({ success: true, receivedBody: body });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 400 });
    }
}
