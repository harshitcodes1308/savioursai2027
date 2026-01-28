"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define strict types for Razorpay
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string; // Order ID created on backend
    handler: (response: any) => void;
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
    email: string;
    name: string;
    onSuccess?: () => void;
}

export function RazorpayButton({ amount = 99, email, name, onSuccess }: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            // 1. Create Order on Backend
            const orderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });
            const orderData = await orderRes.json();
            
            if (!orderData.success) {
                console.error("Order creation failed", orderData);
                alert("Could not initiate payment. Please try again.");
                setLoading(false);
                return;
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "ICSE Saviours",
                description: "Lifetime Access",
                order_id: orderData.order.id,
                handler: async function (response: any) {
                    setLoading(true);
                    // 2. Verify Payment on Backend (via Webhook preferred, or manual verify)
                    // For simplicity & speed, we trust the success callback but let webhook handle the DB update
                    // or we can call a verify endpoint here. 
                    // To be safe, we'll wait 2 seconds then reload/redirect.
                    
                    if(onSuccess) onSuccess();
                    
                    // Simple UX: Redirect to Dashboard. 
                    // The webhook should have processed it by the time page loads, or we polling.
                    // For now, simple redirect.
                    router.push("/dashboard"); 
                    router.refresh();
                },
                prefill: {
                    name,
                    email,
                },
                theme: {
                    color: "#8B5CF6", // Violet
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
                backgroundColor: "#FFF", // White button for high contrast on dark glassmorphism
                color: "#000",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "wait" : "pointer",
                transition: "transform 0.2s",
                boxShadow: "0 4px 14px 0 rgba(255, 255, 255, 0.39)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
            {loading ? "Processing..." : "Get Lifetime Access"}
        </button>
    );
}
