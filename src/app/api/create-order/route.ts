import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const amount = body.amount || 1;

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });

        // Create Order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-10)}_${user.id.slice(-5)}`,
            payment_capture: 1, // Auto capture
            notes: {
                userId: user.id,
                userEmail: user.email
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create order" }, { status: 500 });
    }
}
