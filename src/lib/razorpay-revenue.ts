import "server-only";
import Razorpay from "razorpay";
import { unstable_cache } from "next/cache";

export type RazorpayRevenuePayment = {
  id: string;
  amountPaise: number;
  refundedPaise: number;
  feePaise: number;
  email: string;
  contact: string;
  userId: string;
  product: string;
  method: string;
  createdAt: string;
};

type RazorpayPaymentRecord = {
  id: string;
  amount: number | string;
  amount_refunded?: number;
  fee?: number;
  currency: string;
  status: string;
  captured: boolean;
  email?: string;
  contact?: string | number;
  method?: string;
  created_at: number;
  notes?: Record<string, string>;
};

export type RazorpayRevenueSnapshot = {
  status: "ready" | "unconfigured" | "error";
  fetchedAt: string;
  truncated: boolean;
  payments: RazorpayRevenuePayment[];
  error?: string;
};

async function fetchRazorpayRevenue(): Promise<RazorpayRevenueSnapshot> {
  const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const fetchedAt = new Date().toISOString();
  if (!keyId || !keySecret) return { status: "unconfigured", fetchedAt, truncated: false, payments: [] };

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const payments: RazorpayRevenuePayment[] = [];
    const pageSize = 100;
    const maximumPayments = 10_000;
    let skip = 0;
    let truncated = false;

    while (skip < maximumPayments) {
      const page = await razorpay.payments.all({ count: pageSize, skip });
      const items = page.items as unknown as RazorpayPaymentRecord[];
      for (const payment of items) {
        const captured = payment.captured || payment.status === "captured" || payment.status === "refunded";
        const amountPaise = Number(payment.amount);
        if (!captured || payment.currency !== "INR" || !Number.isFinite(amountPaise)) continue;
        payments.push({
          id: payment.id,
          amountPaise,
          refundedPaise: Number(payment.amount_refunded ?? 0),
          feePaise: Number(payment.fee ?? 0),
          email: payment.email ?? payment.notes?.userEmail ?? "",
          contact: String(payment.contact ?? ""),
          userId: payment.notes?.userId ?? "",
          product: payment.notes?.purchaseType ?? "UNLABELLED",
          method: payment.method ?? "unknown",
          createdAt: new Date(payment.created_at * 1000).toISOString(),
        });
      }
      skip += items.length;
      if (items.length < pageSize) break;
      if (skip >= maximumPayments) truncated = true;
    }

    return { status: "ready", fetchedAt, truncated, payments };
  } catch (error) {
    console.error("[admin-revenue] Razorpay fetch failed", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", fetchedAt, truncated: false, payments: [], error: "Razorpay could not be reached. Showing the webhook ledger instead." };
  }
}

export const getRazorpayRevenueSnapshot = unstable_cache(
  fetchRazorpayRevenue,
  ["admin-razorpay-revenue-v1"],
  { revalidate: 300 },
);
