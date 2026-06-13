import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, PAYMENT_RATE_LIMIT } from "@/lib/api-rate-limit";

// HARDCODED: Server-side base pricing — NEVER trust frontend amount
const BASE_PRICING = {
    PRO_YEARLY: 59900,    // ₹599 in paise
    LNB_CHEMISTRY: 1900,  // ₹19 in paise
} as const;

type PurchaseType = keyof typeof BASE_PRICING;

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const requested = String(body.type || "PRO_YEARLY");
        const purchaseType: PurchaseType =
            requested === "LNB_CHEMISTRY" ? "LNB_CHEMISTRY" : "PRO_YEARLY";

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rateCheck = checkRateLimit(`payment:${user.id}`, PAYMENT_RATE_LIMIT);
        if (!rateCheck.allowed) {
            return NextResponse.json({ error: "Too many payment attempts. Please try again later." }, { status: 429 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { isPaid: true, planType: true, lnbChemistryUnlocked: true, createdAt: true, creatorCode: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (purchaseType === "PRO_YEARLY") {
            const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");
            const isGrandfathered = dbUser.createdAt < CUTOFF_DATE;
            const alreadyYearly = dbUser.planType === "YEARLY" && dbUser.isPaid;
            if (isGrandfathered || alreadyYearly) {
                return NextResponse.json({ error: "You already have yearly access" }, { status: 409 });
            }
        } else if (purchaseType === "LNB_CHEMISTRY") {
            if (dbUser.isPaid || dbUser.lnbChemistryUnlocked) {
                return NextResponse.json({ error: "You already have access to all Chemistry sets" }, { status: 409 });
            }
        }

        // Creator discount — only applies to PRO_YEARLY (not LNB add-on)
        let amountPaise: number = BASE_PRICING[purchaseType];
        let discountPct = 0;
        let creatorName: string | null = null;

        if (purchaseType === "PRO_YEARLY" && dbUser.creatorCode) {
            const creator = await prisma.creator.findUnique({
                where: { creatorCode: dbUser.creatorCode },
                select: { discountPercentage: true, creatorName: true },
            });
            if (creator && creator.discountPercentage > 0) {
                discountPct = creator.discountPercentage;
                creatorName = creator.creatorName;
                amountPaise = Math.round(amountPaise * (1 - discountPct / 100));
            }
        }

        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.error("Razorpay credentials missing");
            return NextResponse.json({ error: "Payment service unavailable" }, { status: 503 });
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

        const order = await razorpay.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-10)}_${user.id.slice(-5)}`,
            payment_capture: true,
            notes: {
                userId: user.id,
                userEmail: user.email,
                expectedAmount: amountPaise.toString(),
                purchaseType,
                ...(discountPct > 0 ? { discountPct: discountPct.toString(), creatorCode: dbUser.creatorCode! } : {}),
            },
        });

        return NextResponse.json({
            success: true,
            order,
            discount: discountPct > 0 ? { percentage: discountPct, creatorName, finalAmountPaise: amountPaise } : null,
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
