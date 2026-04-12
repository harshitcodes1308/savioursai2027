"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";

export default function PricingPage() {
    const router = useRouter();
    const { data: session } = trpc.auth.getSession.useQuery();
    const [mounted, setMounted] = useState(false);
    const [showDomin8Modal, setShowDomin8Modal] = useState(false);
    const [domin8Code, setDomin8Code] = useState('');
    const [domin8Error, setDomin8Error] = useState('');
    const [domin8Loading, setDomin8Loading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleDomin8Submit() {
        const code = domin8Code.trim();
        if (!code || !code.startsWith('W')) {
            setDomin8Error('Invalid code. Please try again.');
            return;
        }
        setDomin8Loading(true);
        try {
            const res = await fetch('/api/auth/activate-domin8', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            if (!res.ok) throw new Error('Failed');
            router.push('/dashboard');
        } catch {
            setDomin8Error('Activation failed. Please try again.');
        }
        setDomin8Loading(false);
    }

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

            {/* Domin8 Pro CTA */}
            <div
                onClick={() => { setShowDomin8Modal(true); setDomin8Code(''); setDomin8Error(''); }}
                style={{
                    textAlign: "center", marginBottom: 20,
                    padding: "18px 28px",
                    background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))",
                    border: "1.5px solid rgba(59,130,246,0.2)",
                    borderRadius: 14, cursor: "pointer",
                    transition: "all 300ms ease",
                    maxWidth: 480, width: "100%",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.1))";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)";
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))";
                }}
            >
                <div style={{ fontSize: 18, fontWeight: 800, color: "#FFF", marginBottom: 4 }}>
                    Student from <span style={{ color: "#3B82F6" }}>Domin8 Pro</span>?
                </div>
                <div style={{ fontSize: 14, color: "#9CA3AF" }}>
                    Tap here to activate your free access
                </div>
            </div>

            {/* Footer */}
            <p style={{ fontSize: 12, color: "#4B5563", textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
                Secure payment via Razorpay. No subscriptions. No hidden fees.
                Once you pay, your account is upgraded instantly and permanently.
            </p>

            {/* Domin8 Pro Code Modal */}
            {showDomin8Modal && (
                <div
                    style={{
                        position: "fixed", inset: 0, zIndex: 2000,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowDomin8Modal(false); }}
                >
                    <div style={{
                        background: "linear-gradient(135deg, rgba(26,26,36,0.95), rgba(17,17,24,0.9))",
                        border: "2px solid rgba(59,130,246,0.3)",
                        borderRadius: 22, padding: "36px 32px",
                        maxWidth: 420, width: "calc(100% - 32px)",
                        boxShadow: "0 0 40px rgba(59,130,246,0.12)",
                    }}>
                        <div style={{
                            fontSize: 24, fontWeight: 800, color: "#FFF",
                            textAlign: "center", marginBottom: 6,
                        }}>
                            Domin8 <span style={{ color: "#3B82F6" }}>Pro</span>
                        </div>
                        <p style={{
                            fontSize: 13, color: "#9CA3AF", textAlign: "center",
                            marginBottom: 24, lineHeight: 1.5,
                        }}>
                            Enter the special code provided to you
                        </p>

                        <input
                            type="text"
                            value={domin8Code}
                            onChange={(e) => { setDomin8Code(e.target.value); setDomin8Error(''); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleDomin8Submit(); }}
                            placeholder="Enter your code"
                            autoFocus
                            style={{
                                width: "100%", padding: "14px 16px", borderRadius: 12,
                                border: domin8Error ? "1.5px solid rgba(239,68,68,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.04)", color: "#FFF",
                                fontSize: 16, letterSpacing: "0.08em", outline: "none",
                                boxSizing: "border-box", textAlign: "center",
                            }}
                        />

                        {domin8Error && (
                            <div style={{ fontSize: 12, color: "#ef4444", textAlign: "center", marginTop: 10 }}>
                                {domin8Error}
                            </div>
                        )}

                        <button
                            onClick={handleDomin8Submit}
                            disabled={domin8Loading}
                            style={{
                                width: "100%", padding: "13px 24px", borderRadius: 100,
                                fontSize: 15, fontWeight: 700, cursor: domin8Loading ? "not-allowed" : "pointer",
                                background: "linear-gradient(135deg, #3B82F6, #00D4FF)",
                                color: "#FFF", border: "none", marginTop: 18,
                                opacity: domin8Loading ? 0.6 : 1,
                            }}
                        >
                            {domin8Loading ? "Activating..." : "Activate Access"}
                        </button>

                        <button
                            onClick={() => setShowDomin8Modal(false)}
                            style={{
                                width: "100%", padding: 10, background: "transparent",
                                border: "none", fontSize: 12, color: "#6B7280",
                                cursor: "pointer", marginTop: 10,
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
