import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// removed MINIMUM_AMOUNT_PAISE as we handle it dynamically


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
            const purchaseType = notes?.purchaseType || "PRO"; // Default to PRO to prevent breaking old logic

            // Validate minimum amount
            const expectedMinAmount = purchaseType === "LNB_CHEMISTRY" ? 1900 : 9900;
            if (paymentAmount < expectedMinAmount) {
                console.error(`Suspicious payment: amount ${paymentAmount} below minimum ${expectedMinAmount} for ${userEmail}`);
                return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
            }

            if (userEmail) {
                // Idempotent: only update if not already paid
                const user = await prisma.user.findUnique({
                    where: { email: userEmail },
                    select: { isPaid: true, lnbChemistryUnlocked: true },
                });

                if (user) {
                    if (purchaseType === "LNB_CHEMISTRY" && !user.lnbChemistryUnlocked) {
                        await prisma.user.update({
                            where: { email: userEmail },
                            data: { lnbChemistryUnlocked: true },
                        });
                        console.log("User unlocked LNB Chemistry:", userEmail, "Amount:", paymentAmount);
                    } else if (purchaseType === "PRO" && !user.isPaid) {
                        await prisma.user.update({
                            where: { email: userEmail },
                            data: { isPaid: true },
                        });
                        console.log("User updated to PAID (PRO):", userEmail, "Amount:", paymentAmount);
                    }
                }
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Razorpay Webhook Error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
