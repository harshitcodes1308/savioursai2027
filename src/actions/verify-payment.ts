"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, createToken, setSessionCookie } from "@/lib/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export async function verifyPaymentAction(response: RazorpayResponse) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_secret) {
            console.error("RAZORPAY_KEY_SECRET is missing");
            return { success: false, error: "Server configuration error" };
        }

        // 1. Verify Signature
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return { success: false, error: "Payment verification failed" };
        }

        // 2. Update Database (Idempotent - safe to do even if webhook checks)
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { isPaid: true },
        });

        // 3. REFRESH SESSION COOKIE (Crucial Step: Updates isPaid in token)
        const newToken = await createToken({
            ...updatedUser,
            isPaid: true // Explicitly ensure payload has true
        });
        await setSessionCookie(newToken, true); // Assuming persistent login for paid users, or pass parameter

        revalidatePath("/dashboard");
        
        return { success: true };

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return { success: false, error: "Verification failed" };
    }
}
