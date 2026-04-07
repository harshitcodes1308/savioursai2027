"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, createToken, setSessionCookie } from "@/lib/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import Razorpay from "razorpay";

interface RazorpayResponse {
    // For one-time orders
    razorpay_order_id?: string;
    // For subscriptions
    razorpay_subscription_id?: string;
    // Always present
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export async function verifyPaymentAction(response: RazorpayResponse) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "User not authenticated" };
        }

        const {
            razorpay_order_id,
            razorpay_subscription_id,
            razorpay_payment_id,
            razorpay_signature,
        } = response;

        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            console.error("RAZORPAY_KEY_SECRET is missing");
            return { success: false, error: "Server configuration error" };
        }

        const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        if (!key_id) {
            console.error("RAZORPAY_KEY_ID is missing");
            return { success: false, error: "Server configuration error" };
        }

        const razorpay = new Razorpay({ key_id, key_secret });

        // ── Branch 1: Subscription (₹199 monthly recurring) ──
        if (razorpay_subscription_id) {
            // Subscription signature: payment_id|subscription_id
            const expected = crypto
                .createHmac("sha256", key_secret)
                .update(razorpay_payment_id + "|" + razorpay_subscription_id)
                .digest("hex");

            if (expected !== razorpay_signature) {
                return { success: false, error: "Subscription verification failed" };
            }

            // Fetch from Razorpay to confirm and read trusted notes
            const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);

            // Verify it belongs to this user
            const notesUserId = (subscription.notes as any)?.userId;
            if (notesUserId && notesUserId !== user.id) {
                return { success: false, error: "Subscription does not belong to you" };
            }

            // Bill cycle: ~30 days from now
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    isPaid: true,
                    planType: "MONTHLY",
                    subscriptionStatus: "ACTIVE",
                    subscriptionExpiry: expiryDate,
                    razorpaySubscriptionId: razorpay_subscription_id,
                },
            });

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
        }

        // ── Branch 2: One-time order (₹499 yearly or LNB chemistry) ──
        if (!razorpay_order_id) {
            return { success: false, error: "Missing order or subscription id" };
        }

        // Order signature: order_id|payment_id
        const expected = crypto
            .createHmac("sha256", key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expected !== razorpay_signature) {
            return { success: false, error: "Payment verification failed" };
        }

        // Fetch trusted order details
        const order = await razorpay.orders.fetch(razorpay_order_id);
        const purchaseType = (order.notes?.purchaseType as string) || "PRO_YEARLY";

        let updatedUser;
        if (purchaseType === "LNB_CHEMISTRY") {
            updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { lnbChemistryUnlocked: true },
            });
        } else {
            // PRO_YEARLY (or legacy PRO) → ₹499 one-time, 365 days
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 365);

            updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    isPaid: true,
                    planType: "YEARLY",
                    subscriptionStatus: "ACTIVE",
                    subscriptionExpiry: expiryDate,
                },
            });
        }

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
