import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, clearSessionCookie } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Delete the user from the database
        await prisma.user.delete({
            where: { id: session.user.id }
        });

        // Clear the auth cookie so they are fully logged out
        const response = NextResponse.json({ success: true });
        
        // We need to set the Set-Cookie header to clear the auth-token
        await clearSessionCookie(response.headers);
        
        return response;

    } catch (error: any) {
        console.error("Onboarding cancel error:", error);
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
