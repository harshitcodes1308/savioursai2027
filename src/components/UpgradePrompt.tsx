"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RazorpayButton } from "@/components/RazorpayButton";
import { trpc } from "@/lib/trpc/client";

interface UpgradePromptProps {
    featureName: string;
    description: string;
    onClose?: () => void;
    type?: "PRO" | "LNB_CHEMISTRY";
}

export function UpgradePrompt({ featureName, description, onClose, type = "PRO" }: UpgradePromptProps) {
    const router = useRouter();
    const { data: session } = trpc.auth.getSession.useQuery();
    const [hoveredCTA, setHoveredCTA] = useState(false);

    const handleGoBack = () => {
        if (onClose) {
            onClose();
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                backgroundColor: "rgba(3, 3, 5, 0.97)",
                backdropFilter: "blur(24px)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "40px 24px",
                fontFamily: "Inter, system-ui, sans-serif",
                animation: "upgradeSlideUp 0.4s ease-out",
                overflowY: "auto",
            }}
        >
            <style>{`
                @keyframes upgradeSlideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes upgradeLockPulse {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.08); opacity: 1; }
                }
                @keyframes upgradeGlowShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            <div
                style={{
                    width: "100%",
                    maxWidth: 480,
                    textAlign: "center",
                }}
            >
                {/* Lock Icon */}
                <div
                    style={{
                        width: 88,
                        height: 88,
                        borderRadius: 28,
                        background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))",
                        border: "1px solid rgba(59,130,246,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 42,
                        margin: "0 auto 28px",
                        animation: "upgradeLockPulse 2.5s ease-in-out infinite",
                        boxShadow: "0 12px 40px rgba(59,130,246,0.2)",
                    }}
                >
                    🔒
                </div>

                {/* Heading */}
                <h1
                    style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#FFF",
                        margin: "0 0 8px",
                        letterSpacing: -0.5,
                    }}
                >
                    This feature is part of
                </h1>
                <h2
                    style={{
                        fontSize: 32,
                        fontWeight: 900,
                        margin: "0 0 20px",
                        background: "linear-gradient(135deg, #3B82F6, #06B6D4, #8B5CF6)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "upgradeGlowShift 4s ease infinite",
                        lineHeight: 1.2,
                    }}
                >
                    {type === "LNB_CHEMISTRY" ? "Chemistry LNB Set Unlock" : "Saviours AI Pro"}
                </h2>

                {/* Feature Name */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 20px",
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.2)",
                        borderRadius: 100,
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#60A5FA",
                        marginBottom: 16,
                    }}
                >
                    ⚡ {featureName}
                </div>

                {/* Description */}
                <p
                    style={{
                        fontSize: 15,
                        color: "#9CA3AF",
                        lineHeight: 1.7,
                        margin: "0 0 32px",
                        padding: "0 12px",
                    }}
                >
                    {description}
                </p>

                {/* Price Card */}
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 20,
                        padding: "28px 24px",
                        marginBottom: 24,
                    }}
                >
                    <div style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 44, fontWeight: 800, color: "#FFF" }}>
                            {type === "LNB_CHEMISTRY" ? "₹19" : "₹99"}
                        </span>
                        <span style={{ fontSize: 16, color: "#6B7280", marginLeft: 6 }}>one-time</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 24px" }}>
                        {type === "LNB_CHEMISTRY"
                            ? "Pay just ₹19 to unlock all 4 remaining Chemistry sets for Last Night Before revision."
                            : "Lifetime access to all features. No subscriptions. No hidden fees."}
                    </p>

                    {/* CTA Button */}
                    <div
                        onMouseEnter={() => setHoveredCTA(true)}
                        onMouseLeave={() => setHoveredCTA(false)}
                        style={{
                            borderRadius: 14,
                            overflow: "hidden",
                            transform: hoveredCTA ? "scale(1.02)" : "scale(1)",
                            transition: "transform 0.2s ease",
                        }}
                    >
                        <RazorpayButton
                            amount={type === "LNB_CHEMISTRY" ? 19 : 99}
                            type={type}
                            email={session?.user?.email || "user@example.com"}
                            name={session?.user?.name || "User"}
                            buttonText={type === "LNB_CHEMISTRY" ? "Pay ₹19 & Unlock Sets" : "Get Lifetime Access"}
                            onSuccess={() => {
                                if (onClose) onClose();
                                router.refresh();
                            }}
                        />
                    </div>
                </div>

                {/* What you get list */}
                {type === "LNB_CHEMISTRY" ? (
                    <div
                        style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 16,
                            padding: "20px 24px",
                            marginBottom: 28,
                            textAlign: "left",
                        }}
                    >
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
                            What's Included
                        </div>
                        {[
                            "120 vital Numericals (4 Sets)",
                            "80 crucial Formulas",
                            "40 important Definitions",
                            "Unlimited Chemistry Re-rolls",
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "7px 0",
                                    fontSize: 13,
                                    color: "#D1D5DB",
                                    borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                }}
                            >
                                <span style={{
                                    width: 18, height: 18, borderRadius: 6,
                                    background: "rgba(16,185,129,0.15)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, color: "#10B981", flexShrink: 0,
                                }}>✓</span>
                                {item}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 16,
                            padding: "20px 24px",
                            marginBottom: 28,
                            textAlign: "left",
                        }}
                    >
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
                            Unlock everything with Pro
                        </div>
                    {[
                        "🤖 AI Doubt Solver with image upload",
                        "📅 Smart Study Planner",
                        "📝 Custom Test Generator",
                        "⚡ Competency Test with analytics",
                        "🎯 Exam Strategy Builder",
                        "📖 AI-Refined Notes & Flashcards",
                        "⏳ ChronoScroll & Date Battles",
                        "🧮 Physics Numerical Mastery",
                        "📄 All Guess Papers (10 subjects)",
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "7px 0",
                                fontSize: 13,
                                color: "#D1D5DB",
                                borderBottom: i < 8 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            }}
                        >
                            <span style={{
                                width: 18, height: 18, borderRadius: 6,
                                background: "rgba(16,185,129,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, color: "#10B981", flexShrink: 0,
                            }}>✓</span>
                            {item}
                        </div>
                        ))}
                    </div>
                )}

                {/* Go Back */}
                <button
                    onClick={handleGoBack}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#6B7280",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: "10px 20px",
                        borderRadius: 10,
                        transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                >
                    ← Go back to Dashboard
                </button>
            </div>
        </div>
    );
}
