"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, createToken, setSessionCookie } from "@/lib/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import Razorpay from "razorpay";

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

        // 2. Fetch Order from Razorpay to get the trusted details (prevents frontend spoofing)
        const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        if (!key_id) {
            console.error("RAZORPAY_KEY_ID is missing");
            return { success: false, error: "Server configuration error" };
        }
        
        const razorpay = new Razorpay({ key_id: key_id, key_secret: key_secret });
        const order = await razorpay.orders.fetch(razorpay_order_id);
        
        const purchaseType = order.notes?.purchaseType || "PRO";

        // 3. Update Database 
        let updatedUser;
        if (purchaseType === "LNB_CHEMISTRY") {
            updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { lnbChemistryUnlocked: true },
            });
        } else {
            updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { isPaid: true },
            });
        }

        // 4. REFRESH SESSION COOKIE
        const newToken = await createToken({
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            isPaid: updatedUser.isPaid,
            planType: updatedUser.planType,
            subscriptionStatus: updatedUser.subscriptionStatus,
            subscriptionExpiry: updatedUser.subscriptionExpiry?.toISOString() ?? null,
            onboardingComplete: updatedUser.onboardingComplete,
            lnbChemistryUnlocked: updatedUser.lnbChemistryUnlocked,
        });
        await setSessionCookie(newToken, true);

        revalidatePath("/dashboard");
        
        return { success: true };

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return { success: false, error: "Verification failed" };
    }
}
