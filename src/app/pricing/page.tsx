"use client";

import { useState } from "react";
import { simulatePayment } from "@/actions/payment";

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const result = await simulatePayment();
            if (result.success) {
                // Force a hard refresh to ensure middleware picks up the new token
                window.location.href = "/dashboard";
            } else {
                // Alert the specific error
                alert(result.error || "Payment failed. Please try again.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Payment error:", error);
            setIsLoading(false);
        }
    };

    const features = [
        "📅 Smart Planner",
        "🤖 AI Assistant",
        "📝 Customise Test",
        "🎯 Customise Strategy",
        "🧘 Focus Mode",
        "📖 Smart Notes",
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#000000",
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 16px",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {/* Title */}
            <h1
                style={{
                    fontSize: "clamp(48px, 8vw, 72px)",
                    fontWeight: 700,
                    marginBottom: "48px",
                    letterSpacing: "-0.02em",
                    textAlign: "center",
                    fontFamily: "'Manrope', sans-serif",
                }}
            >
                Pricing
            </h1>

            {/* Pricing Card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "380px",
                    backgroundColor: "rgba(26, 26, 26, 0.6)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "24px",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            >
                {/* Plan Label */}
                <div
                    style={{
                        fontSize: "12px",
                        color: "#888888",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "12px",
                        fontWeight: 500,
                    }}
                >
                    Premium Plan
                </div>

                {/* Price */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "4px",
                        marginBottom: "32px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "clamp(40px, 6vw, 56px)",
                            fontWeight: 700,
                            color: "#ffffff",
                            fontFamily: "'Manrope', sans-serif",
                        }}
                    >
                        ₹99
                    </span>
                    <span
                        style={{
                            fontSize: "18px",
                            color: "#666666",
                        }}
                    >
                        /month
                    </span>
                </div>

                {/* Features List */}
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        marginBottom: "32px",
                    }}
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            {/* Checkmark */}
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ flexShrink: 0 }}
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span
                                style={{
                                    fontSize: "15px",
                                    color: "#cccccc",
                                }}
                            >
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    style={{
                        width: "100%",
                        padding: "16px 24px",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        border: "none",
                        borderRadius: "16px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.7 : 1,
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                    }}
                >
                    {isLoading ? (
                        <>
                            <span
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "2px solid rgba(0,0,0,0.3)",
                                    borderTopColor: "#000000",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                }}
                            />
                            Processing...
                        </>
                    ) : (
                        "Enroll Now"
                    )}
                </button>
            </div>

            {/* Spinner Animation */}
            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
