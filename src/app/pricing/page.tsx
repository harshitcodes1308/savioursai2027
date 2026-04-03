"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";

export default function PricingPage() {
    const { data: session } = trpc.auth.getSession.useQuery();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const freeFeatures = [
        { icon: "📊", label: "Dashboard & Study Stats" },
        { icon: "📚", label: "Browse Subjects & Chapters" },
        { icon: "📄", label: "Physics Guess Papers" },
        { icon: "🧘", label: "Focus Mode Timer" },
        { icon: "👤", label: "Profile Management" },
        { icon: "📋", label: "Activity Log" },
    ];

    const proFeatures = [
        { icon: "🤖", label: "AI Doubt Solver (image + PDF)" },
        { icon: "📅", label: "Smart Study Planner" },
        { icon: "📝", label: "Custom Test Generator" },
        { icon: "⚡", label: "Competency Test with Analytics" },
        { icon: "🎯", label: "Exam Strategy Builder" },
        { icon: "📖", label: "AI-Refined Notes & Flashcards" },
        { icon: "⏳", label: "ChronoScroll Timeline" },
        { icon: "⚔️", label: "Date Battle Arena" },
        { icon: "🧮", label: "Physics Numerical Mastery" },
        { icon: "📄", label: "All 10 Subject Guess Papers" },
    ];

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#030305",
            backgroundImage: "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 24px",
            fontFamily: "Inter, system-ui, sans-serif",
        }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 600 }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "6px 16px", borderRadius: 100, marginBottom: 20,
                    background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                    fontSize: 12, fontWeight: 700, color: "#60A5FA", letterSpacing: 0.5,
                }}>
                    ⚡ ONE-TIME PAYMENT • LIFETIME ACCESS
                </div>
                <h1 style={{
                    fontSize: 38, fontWeight: 900, color: "#FFF", margin: "0 0 12px",
                    letterSpacing: -0.5, lineHeight: 1.2,
                }}>
                    Upgrade to{" "}
                    <span style={{
                        background: "linear-gradient(135deg, #3B82F6, #06B6D4, #00D4FF)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>Saviours AI Pro</span>
                </h1>
                <p style={{ fontSize: 16, color: "#9CA3AF", margin: 0, lineHeight: 1.6 }}>
                    Unlock every AI-powered feature to dominate your ICSE exams. No subscriptions, no hidden fees.
                </p>
            </div>

            {/* Comparison Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 20,
                maxWidth: 720,
                width: "100%",
                marginBottom: 40,
            }}>
                {/* Free Tier Card */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 22,
                    padding: "32px 28px",
                }}>
                    <div style={{
                        fontSize: 12, fontWeight: 700, color: "#6B7280",
                        textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
                    }}>Free Tier</div>
                    <div style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 40, fontWeight: 800, color: "#FFF" }}>₹0</span>
                        <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 6 }}>forever</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 24px" }}>
                        Basic access to get started
                    </p>

                    <div style={{
                        display: "flex", flexDirection: "column", gap: 10,
                    }}>
                        {freeFeatures.map((f, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                fontSize: 13, color: "#D1D5DB",
                            }}>
                                <span style={{
                                    width: 20, height: 20, borderRadius: 6,
                                    background: "rgba(107,114,128,0.15)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, color: "#6B7280", flexShrink: 0,
                                }}>✓</span>
                                <span>{f.icon} {f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Current plan indicator */}
                    <div style={{
                        marginTop: 28,
                        padding: "12px 20px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 12,
                        textAlign: "center",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#6B7280",
                    }}>
                        Your current plan
                    </div>
                </div>

                {/* Pro Card */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.04))",
                    border: "2px solid rgba(59,130,246,0.25)",
                    borderRadius: 22,
                    padding: "32px 28px",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* Glow */}
                    <div style={{
                        position: "absolute", top: -60, right: -60,
                        width: 180, height: 180, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)",
                        pointerEvents: "none",
                    }} />

                    {/* Popular badge */}
                    <div style={{
                        position: "absolute", top: 16, right: 16,
                        background: "linear-gradient(135deg, #3B82F6, #00D4FF)",
                        padding: "4px 12px", borderRadius: 100,
                        fontSize: 10, fontWeight: 700, color: "#FFF",
                        letterSpacing: 0.5, textTransform: "uppercase",
                    }}>★ Most Popular</div>

                    <div style={{
                        fontSize: 12, fontWeight: 700, color: "#3B82F6",
                        textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
                    }}>Pro — Lifetime</div>
                    <div style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 40, fontWeight: 800, color: "#FFF" }}>₹99</span>
                        <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 6 }}>one-time</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 24px" }}>
                        Everything in Free, plus all AI features
                    </p>

                    <div style={{
                        display: "flex", flexDirection: "column", gap: 10, marginBottom: 28,
                    }}>
                        {proFeatures.map((f, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                fontSize: 13, color: "#D1D5DB",
                            }}>
                                <span style={{
                                    width: 20, height: 20, borderRadius: 6,
                                    background: "rgba(59,130,246,0.15)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, color: "#3B82F6", flexShrink: 0,
                                }}>✓</span>
                                <span>{f.icon} {f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <RazorpayButton
                        amount={99}
                        email={session?.user?.email || "user@example.com"}
                        name={session?.user?.name || "User"}
                    />
                </div>
            </div>

            {/* Footer */}
            <p style={{ fontSize: 12, color: "#4B5563", textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
                Secure payment via Razorpay. No subscriptions. No hidden fees.
                Once you pay, your account is upgraded instantly and permanently.
            </p>
        </div>
    );
}
