"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RazorpayResponse {
    razorpay_order_id?: string;
    razorpay_subscription_id?: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme: {
        color: string;
    };
}

interface RazorpayInstance {
    open: () => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayButtonProps {
    amount?: number;
    type?: "PRO" | "LNB_CHEMISTRY" | "EBOOKS";
    email: string;
    name: string;
    onSuccess?: () => void;
    buttonText?: string;
    successRedirect?: string;
}

export function RazorpayButton({ type = "PRO", email, name, onSuccess, buttonText, successRedirect = "/dashboard" }: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const effectiveButtonText = buttonText || "Get Access";

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

            const orderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });
            const orderData = await orderRes.json();

            if (!orderData.success) {
                console.error("Order creation failed", orderData);
                alert(`Payment Error: ${orderData.error}`);
                setLoading(false);
                return;
            }

            const descriptions: Record<string, string> = {
                PRO: "Pro Access: ₹99",
                LNB_CHEMISTRY: "Unlock Chemistry Sets",
                EBOOKS: "Sidekick Ebooks: ₹79 one-time",
            };

            const options: RazorpayOptions = {
                key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "ICSE Saviours",
                description: descriptions[type] || "Saviours AI",
                order_id: orderData.order.id,
                handler: async function (response: RazorpayResponse) {
                    setLoading(true);

                    try {
                        const { verifyPaymentAction } = await import("@/actions/verify-payment");
                        const result = await verifyPaymentAction(response);

                        if (result.success) {
                            if(onSuccess) onSuccess();
                            router.push(successRedirect);
                            router.refresh();
                        } else {
                            alert("Payment Verified Failed: " + result.error);
                            setLoading(false);
                        }
                    } catch (err) {
                        console.error("Verification Error", err);
                        alert("Verification failed. Please contact support if money was deducted.");
                        setLoading(false);
                    }
                },
                prefill: {
                    name,
                    email,
                },
                theme: {
                    color: "#00D4FF",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            style={{
                width: "100%",
                padding: "16px",
                backgroundColor: type === "EBOOKS" ? "rgba(0,212,255,0.10)" : "#FFF",
                color: type === "EBOOKS" ? "var(--accent-gold)" : "#000",
                fontSize: "16px",
                fontWeight: 700,
                border: type === "EBOOKS" ? "1px solid var(--accent-gold-border)" : "none",
                borderRadius: "12px",
                cursor: loading ? "wait" : "pointer",
                transition: "transform 0.2s",
                boxShadow: type === "EBOOKS" ? "none" : "0 4px 14px 0 rgba(255, 255, 255, 0.22)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
            {loading ? "Processing..." : effectiveButtonText}
        </button>
    );
}
