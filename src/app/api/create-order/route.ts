import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, PAYMENT_RATE_LIMIT } from "@/lib/api-rate-limit";

// HARDCODED: Server-side pricing — NEVER trust frontend amount
const PRICING = {
    PRO: 9900, // ₹99 in paise
    LNB_CHEMISTRY: 1900, // ₹19 in paise
};

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const purchaseType = (body.type === "LNB_CHEMISTRY") ? "LNB_CHEMISTRY" : "PRO";
        const amountPaise = PRICING[purchaseType];

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate limit payment attempts per user
        const rateCheck = checkRateLimit(`payment:${user.id}`, PAYMENT_RATE_LIMIT);
        if (!rateCheck.allowed) {
            return NextResponse.json({ error: "Too many payment attempts. Please try again later." }, { status: 429 });
        }

        // Idempotency: Check if user already owns what they are trying to buy
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isPaid: true, lnbChemistryUnlocked: true, createdAt: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (purchaseType === "PRO") {
            const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");
            if (dbUser.isPaid || dbUser.createdAt < CUTOFF_DATE) {
                return NextResponse.json({ error: "Already paid for Pro" }, { status: 409 });
            }
        } else if (purchaseType === "LNB_CHEMISTRY") {
            if (dbUser.isPaid || dbUser.lnbChemistryUnlocked) {
                // If they have Pro, they already have Chemistry. If they unlocked Chem, they also have it.
                return NextResponse.json({ error: "You already have access to all Chemistry sets" }, { status: 409 });
            }
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
            amount: amountPaise, // HARDCODED server-side based on type
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-10)}_${user.id.slice(-5)}`,
            payment_capture: true,
            notes: {
                userId: user.id,
                userEmail: user.email,
                expectedAmount: amountPaise.toString(),
                purchaseType: purchaseType, // Pass type to verify in webhook/action
            },
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
