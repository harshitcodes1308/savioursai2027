import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Must match the hardcoded price in create-order
const MINIMUM_AMOUNT_PAISE = 9900; // ₹99

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret || secret === "your-webhook-secret") {
            console.error("RAZORPAY_WEBHOOK_SECRET is not configured properly");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Verify Signature (HMAC-SHA256)
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        // Use timing-safe comparison to prevent timing attacks
        if (!crypto.timingSafeEqual(
            Buffer.from(expectedSignature, "hex"),
            Buffer.from(signature, "hex")
        )) {
            console.error("Invalid Razorpay Webhook Signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);

        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            const notes = payment.notes;
            const userEmail = notes?.userEmail || payment.email;
            const paymentAmount = payment.amount; // in paise

            // Validate minimum amount
            if (paymentAmount < MINIMUM_AMOUNT_PAISE) {
                console.error(`Suspicious payment: amount ${paymentAmount} below minimum ${MINIMUM_AMOUNT_PAISE} for ${userEmail}`);
                return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
            }

            if (userEmail) {
                // Idempotent: only update if not already paid
                const user = await prisma.user.findUnique({
                    where: { email: userEmail },
                    select: { isPaid: true },
                });

                if (user && !user.isPaid) {
                    await prisma.user.update({
                        where: { email: userEmail },
                        data: { isPaid: true },
                    });
                    console.log("User updated to PAID:", userEmail, "Amount:", paymentAmount);
                }
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Razorpay Webhook Error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
