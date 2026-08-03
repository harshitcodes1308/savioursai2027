"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { trpc } from "@/lib/trpc/client";
import AnimatedGlassyPricing from "@/components/ui/animated-glassy-pricing";

type PaidPlan = "PRO" | "BUNDLE";

export default function PricingPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { data: session } = trpc.auth.getSession.useQuery();
  const [openingCheckout, setOpeningCheckout] = useState(false);

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const beginCheckout = async (plan: PaidPlan) => {
    if (openingCheckout) return;
    setOpeningCheckout(true);
    try {
      if (!await loadRazorpay()) throw new Error("Razorpay could not be loaded. Please check your connection.");
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: plan }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData.success) throw new Error(orderData.error || "Unable to prepare checkout.");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Saviours AI",
        description: plan === "BUNDLE" ? "Ultimate Bundle" : "AI Pro",
        order_id: orderData.order.id,
        prefill: { name: session?.user?.name || "", email: session?.user?.email || "" },
        theme: { color: "#00D4FF" },
        modal: { ondismiss: () => setOpeningCheckout(false) },
        handler: async (response: unknown) => {
          const { verifyPaymentAction } = await import("@/actions/verify-payment");
          const result = await verifyPaymentAction(response as Parameters<typeof verifyPaymentAction>[0]);
          if (result.success) { router.push("/dashboard"); router.refresh(); return; }
          alert(result.error || "Payment verification failed. Please contact support if money was deducted.");
          setOpeningCheckout(false);
        },
      };
      new (window.Razorpay as unknown as new (options: Record<string, unknown>) => { open: () => void })(options).open();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to open checkout. Please try again.");
      setOpeningCheckout(false);
    }
  };

  return (
    <AnimatedGlassyPricing
      isMobile={isMobile}
      userName={session?.user?.name}
      onSelectPlan={(plan) => {
        if (plan === "FREE") { router.push("/dashboard"); return; }
        void beginCheckout(plan);
      }}
    />
  );
}
