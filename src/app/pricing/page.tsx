"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";
import { typography } from "@/lib/typography";

export default function PricingPage() {
    const { data: session } = trpc.auth.getSession.useQuery();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const features = [
        "📊 Dashboard Access",
        "📚 All Subjects & Chapters",
        "📅 Smart Study Planner",
        "🤖 AI Assistant (Tutor)",
        "📝 Custom Test Generator",
        "🎯 Strategy Builder",
        "🧘 Focus Mode",
        "📖 Revision Notes & Flashcards"
    ];

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#000",
            backgroundImage: "radial-gradient(circle at 50% 0%, #2E1065 0%, #000 50%)", // Deep violet gradient
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "Inter, sans-serif"
        }}>
            {/* Glassmorphic Card */}
            <div style={{
                position: "relative",
                width: "100%",
                maxWidth: "420px",
                padding: "32px",
                borderRadius: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                textAlign: "center"
            }}>
                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                    <h1 style={{ 
                        fontSize: "42px", 
                        fontWeight: 800, 
                        color: "#FFF", 
                        letterSpacing: "-0.02em",
                        marginBottom: "8px",
                        lineHeight: 1
                    }}>
                        Pricing
                    </h1>
                    <p style={{ color: "#A78BFA", fontSize: "16px", fontWeight: 500 }}>
                        One-time payment. Lifetime access.
                    </p>
                </div>

                {/* Price Tag */}
                <div style={{ marginBottom: "32px" }}>
                    <span style={{ fontSize: "56px", fontWeight: 800, color: "#FFF" }}>₹1</span>
                    <span style={{ fontSize: "18px", color: "#9CA3AF" }}> / lifetime</span>
                </div>

                {/* Features List */}
                <div style={{ marginBottom: "40px", textAlign: "left" }}>
                    {features.map((feature, i) => (
                        <div key={i} style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "12px", 
                            marginBottom: "12px",
                            color: "#E5E7EB",
                            fontSize: "15px"
                        }}>
                            <div style={{ 
                                width: "20px", 
                                height: "20px", 
                                borderRadius: "50%", 
                                backgroundColor: "rgba(139, 92, 246, 0.2)", 
                                color: "#A78BFA", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                fontSize: "12px"
                            }}>✓</div>
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <RazorpayButton 
                    amount={1} 
                    email={session?.user?.email || "user@example.com"} 
                    name={session?.user?.name || "User"}
                />

                <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "16px" }}>
                    Secure payment via Razorpay. No hidden fees.
                </p>
            </div>
        </div>
    );
}
