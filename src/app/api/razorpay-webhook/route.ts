import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "your-webhook-secret";

        // Verify Signature
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Invalid Razorpay Webhook Signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);

        // Handle Payment Captured
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            const notes = payment.notes;
            const userEmail = notes.userEmail || payment.email;

            console.log("Payment Captured for:", userEmail, "Amount:", payment.amount);

            if (userEmail) {
                // Update User as PAID
                await prisma.user.update({
                    where: { email: userEmail },
                    data: { isPaid: true }
                });
                console.log("User updated to PAID:", userEmail);
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Razorpay Webhook Error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
