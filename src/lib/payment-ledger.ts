import { prisma } from "@/lib/prisma";

/** Only call for authenticated Razorpay capture events; retries share the same ID. */
export async function recordCapturedPayment(userId: string, payment: { id?: string; amount?: number; currency?: string; created_at?: number }, purchaseType: string) {
  if (!payment.id || !Number.isSafeInteger(payment.amount) || payment.amount! <= 0 || payment.currency !== "INR") return;
  await prisma.auditLog.upsert({
    where: { id: `payment:${payment.id}` },
    create: { id: `payment:${payment.id}`, userId, action: "PAYMENT_CAPTURED",
      timestamp: payment.created_at ? new Date(payment.created_at * 1000) : new Date(),
      metadata: { paymentId: payment.id, amountPaise: payment.amount!, purchaseType, currency: "INR" } },
    update: {},
  });
}
