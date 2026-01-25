"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, createToken, setSessionCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function simulatePayment() {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            console.error("Payment action: User not authenticated");
            return { success: false, error: "User not authenticated. Please login." };
        }

        // Update database
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { isPaid: true }
        });

        // Update session with new paid status
        const userData = {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            isPaid: true
        };

        const newToken = await createToken(userData);
        await setSessionCookie(newToken);

        return { success: true };
    } catch (error) {
        console.error("Payment simulation failed:", error);
        return { success: false, error: "Payment failed" };
    }
}
