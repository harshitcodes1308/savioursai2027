import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await request.json();
        const { phone } = body;

        if (!phone || typeof phone !== "string" || phone.trim().length < 10) {
            return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
        }

        const cleanPhone = phone.trim();

        // Check if phone already exists
        const existingPhone = await prisma.user.findUnique({
            where: { phone: cleanPhone },
        });

        if (existingPhone && existingPhone.id !== session.user.id) {
            return NextResponse.json({ error: "This phone number is already registered" }, { status: 409 });
        }

        // Update user phone
        await prisma.user.update({
            where: { id: session.user.id },
            data: { phone: cleanPhone },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Onboarding phone error:", error);
        if (error.code === "P2002") {
            return NextResponse.json({ error: "This phone number is already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
