import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, PAYMENT_RATE_LIMIT } from "@/lib/api-rate-limit";

// HARDCODED: Server-side price — NEVER trust frontend amount
const PLAN_PRICE_INR = 99; // ₹99
const PLAN_AMOUNT_PAISE = PLAN_PRICE_INR * 100; // 9900 paise

export async function POST() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate limit payment attempts per user
        const rateCheck = checkRateLimit(`payment:${user.id}`, PAYMENT_RATE_LIMIT);
        if (!rateCheck.allowed) {
            return NextResponse.json({ error: "Too many payment attempts. Please try again later." }, { status: 429 });
        }

        // Idempotency: Check if user is already paid
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isPaid: true, createdAt: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Legacy user check
        const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");
        if (dbUser.isPaid || dbUser.createdAt < CUTOFF_DATE) {
            return NextResponse.json({ error: "Already paid" }, { status: 409 });
        }

        // Validate env vars
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.error("Razorpay credentials missing");
            return NextResponse.json({ error: "Payment service unavailable" }, { status: 503 });
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

        const order = await razorpay.orders.create({
            amount: PLAN_AMOUNT_PAISE, // HARDCODED server-side
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-10)}_${user.id.slice(-5)}`,
            payment_capture: true,
            notes: {
                userId: user.id,
                userEmail: user.email,
                expectedAmount: PLAN_AMOUNT_PAISE.toString(),
            },
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
