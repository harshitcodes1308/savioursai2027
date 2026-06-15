import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, PAYMENT_RATE_LIMIT } from "@/lib/api-rate-limit";

/**
 * POST /api/create-subscription
 *
 * Creates a Razorpay Subscription for the ₹199/month Monthly plan.
 * Creator discounts use per-creator plan IDs configured in env:
 *   RAZORPAY_MONTHLY_PLAN_ID            — default (₹199)
 *   RAZORPAY_MONTHLY_PLAN_ID_{CODE}     — discounted plan for creator code (uppercase)
 *   e.g. RAZORPAY_MONTHLY_PLAN_ID_BL2047, RAZORPAY_MONTHLY_PLAN_ID_CK2047
 */
export async function POST() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rateCheck = checkRateLimit(`subscription:${user.id}`, PAYMENT_RATE_LIMIT);
        if (!rateCheck.allowed) {
            return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                isPaid: true,
                createdAt: true,
                planType: true,
                subscriptionStatus: true,
                razorpaySubscriptionId: true,
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");
        const isGrandfathered = dbUser.createdAt < CUTOFF_DATE;
        const alreadyActive =
            dbUser.isPaid &&
            dbUser.subscriptionStatus === "ACTIVE" &&
            (dbUser.planType === "MONTHLY" || dbUser.planType === "YEARLY");
        if (isGrandfathered || alreadyActive) {
            return NextResponse.json({ error: "You already have an active plan" }, { status: 409 });
        }

        if (
            dbUser.razorpaySubscriptionId &&
            (dbUser.planType === "MONTHLY" || dbUser.planType === "YEARLY") &&
            dbUser.subscriptionStatus === "ACTIVE"
        ) {
            return NextResponse.json({ error: "You already have an active subscription" }, { status: 409 });
        }

        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        // Use default plan — creator discounts apply to yearly only, not monthly
        let planId = process.env.RAZORPAY_MONTHLY_PLAN_ID;

        const totalCount = parseInt(process.env.RAZORPAY_MONTHLY_TOTAL_COUNT || "11", 10);

        if (!keyId || !keySecret) {
            console.error("Razorpay credentials missing");
            return NextResponse.json({ error: "Payment service unavailable" }, { status: 503 });
        }
        if (!planId) {
            console.error("RAZORPAY_MONTHLY_PLAN_ID missing");
            return NextResponse.json({ error: "Subscription plan not configured" }, { status: 503 });
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: totalCount,
            customer_notify: 1,
            notes: {
                userId: user.id,
                userEmail: user.email,
                planType: "MONTHLY",
            },
        });

        return NextResponse.json({
            success: true,
            subscription,
        });
    } catch (error: any) {
        console.error("Razorpay Subscription Error:", error?.error || error);
        return NextResponse.json(
            { error: error?.error?.description || "Failed to create subscription" },
            { status: 500 }
        );
    }
}
