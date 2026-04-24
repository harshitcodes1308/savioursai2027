import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/razorpay/webhook
 *
 * Razorpay webhook handler — keeps the DB in sync with subscription state.
 * Configure in Razorpay Dashboard → Webhooks with URL:
 *   https://savioursai2027.vercel.app/api/razorpay/webhook
 * with secret = RAZORPAY_WEBHOOK_SECRET, and events:
 *   - subscription.charged       (recurring payment succeeded → extend expiry)
 *   - subscription.cancelled     (user/admin cancelled)
 *   - subscription.halted        (auth failed too many times)
 *   - subscription.completed     (all cycles finished)
 *   - payment.failed             (logging only)
 */
export async function POST(req: NextRequest) {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET missing");
            return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
        }

        const rawBody = await req.text();
        const signature = req.headers.get("x-razorpay-signature") || "";

        // Verify signature
        const expected = crypto
            .createHmac("sha256", webhookSecret)
            .update(rawBody)
            .digest("hex");

        const expectedBuf = Buffer.from(expected, 'hex');
        const signatureBuf = Buffer.from(signature, 'hex');
        if (expectedBuf.length !== signatureBuf.length || !crypto.timingSafeEqual(expectedBuf, signatureBuf)) {
            console.error("[razorpay-webhook] Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const event: string = payload.event;

        // All relevant payloads carry payload.subscription.entity
        const subscription = payload.payload?.subscription?.entity;
        const subscriptionId: string | undefined = subscription?.id;
        const notesUserId: string | undefined = subscription?.notes?.userId;

        // ── Handle payment.captured (one-time orders: yearly, LNB chemistry) ──
        if (event === "payment.captured") {
            const payment = payload.payload?.payment?.entity;
            const notes = payment?.notes;
            const userEmail = notes?.userEmail || payment?.email;
            const paymentAmount = payment?.amount || 0;
            const purchaseType = notes?.purchaseType || "PRO";

            // Validate minimum amount
            const expectedMinAmount = purchaseType === "LNB_CHEMISTRY" ? 1900 : 9900;
            if (paymentAmount < expectedMinAmount) {
                console.error(`[razorpay-webhook] Suspicious payment: amount ${paymentAmount} below minimum ${expectedMinAmount} for ${userEmail}`);
                return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
            }

            if (userEmail) {
                const user = await prisma.user.findUnique({
                    where: { email: userEmail },
                    select: { id: true, isPaid: true, lnbChemistryUnlocked: true },
                });

                if (user) {
                    if (purchaseType === "LNB_CHEMISTRY" && !user.lnbChemistryUnlocked) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { lnbChemistryUnlocked: true },
                        });
                        console.log("[razorpay-webhook] LNB Chemistry unlocked:", userEmail);
                    } else if (!user.isPaid) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { isPaid: true },
                        });
                        console.log("[razorpay-webhook] User upgraded to PAID:", userEmail);
                    }
                }
            }

            return NextResponse.json({ received: true });
        }

        // ── Handle subscription events ──
        if (!subscriptionId) {
            // Not a subscription event we care about — ack and move on
            return NextResponse.json({ received: true });
        }

        // Find user by stored razorpaySubscriptionId, or fall back to notes.userId
        let user = await prisma.user.findUnique({
            where: { razorpaySubscriptionId: subscriptionId },
        });

        if (!user && notesUserId) {
            user = await prisma.user.findUnique({ where: { id: notesUserId } });
        }

        if (!user) {
            console.error(`[razorpay-webhook] No user for subscription ${subscriptionId}`);
            return NextResponse.json({ received: true });
        }

        switch (event) {
            case "subscription.charged": {
                // Recurring payment succeeded → extend expiry by 30 days from now
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        isPaid: true,
                        planType: "MONTHLY",
                        subscriptionStatus: "ACTIVE",
                        subscriptionExpiry: expiryDate,
                        razorpaySubscriptionId: subscriptionId,
                    },
                });
                break;
            }

            case "subscription.cancelled":
            case "subscription.halted": {
                // Mark cancelled but keep access until current expiry
                await prisma.user.update({
                    where: { id: user.id },
                    data: { subscriptionStatus: "CANCELLED" },
                });
                break;
            }

            case "subscription.completed": {
                // All cycles finished → expire access
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionStatus: "EXPIRED",
                        isPaid: false,
                    },
                });
                break;
            }

            default:
                // Other events (subscription.activated, .pending, etc.) — log only
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[razorpay-webhook] error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
