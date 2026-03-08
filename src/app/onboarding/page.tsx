"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OnboardingPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const handleGoBack = async () => {
        setCancelLoading(true);
        setError("");
        
        try {
            const res = await fetch("/api/auth/onboarding/cancel", {
                method: "DELETE",
            });
            
            if (!res.ok) {
                setError("Failed to cancel setup. Please try again.");
                setCancelLoading(false);
                return;
            }
            
            router.push("/login");
        } catch {
            setError("Network error. Please try again.");
            setCancelLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!phone || phone.trim().length < 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                setLoading(false);
                return;
            }

            // Use window.location.href for a hard redirect to clear tRPC cache
            // and ensure the dashboard fetches the fresh profile data.
            window.location.href = "/dashboard";
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%), #030303",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Animated orbs */}
            <div style={{
                position: "absolute", top: "10%", left: "15%",
                width: 300, height: 300, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
                pointerEvents: "none",
                animation: "float 8s ease-in-out infinite",
            }} />
            <div style={{
                position: "absolute", bottom: "10%", right: "10%",
                width: 400, height: 400, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)",
                pointerEvents: "none",
                animation: "float 8s ease-in-out infinite 4s",
            }} />

            <div style={{
                width: "100%",
                maxWidth: "440px",
                position: "relative",
                zIndex: 1,
                animation: "fadeInUp 0.6s ease-out",
            }}>
                {/* Glass Card */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(14,14,20,0.95), rgba(20,20,28,0.9))",
                    border: "1px solid rgba(139,92,246,0.12)",
                    borderRadius: "24px",
                    padding: "44px 36px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.05)",
                    backdropFilter: "blur(20px)",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* Top gradient line */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: "linear-gradient(90deg, transparent, #8B5CF6, transparent)",
                    }} />

                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "36px" }}>
                        <div style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 88, height: 88, borderRadius: 22,
                            background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.04))",
                            border: "1px solid rgba(139,92,246,0.15)",
                            marginBottom: 20,
                            boxShadow: "0 8px 32px rgba(139,92,246,0.15)",
                        }}>
                            <Image src="/logo.png" alt="ICSE Saviours" width={64} height={64} style={{ objectFit: "contain" }} priority />
                        </div>
                        <h1 style={{
                            fontSize: "26px", fontWeight: 800, marginBottom: "6px",
                            background: "linear-gradient(135deg, #FFF, #A78BFA)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: -0.5,
                        }}>
                            One Last Step
                        </h1>
                        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                            Enter your phone number to complete setup
                        </p>
                    </div>

                    {/* Info */}
                    <div style={{
                        background: "rgba(139,92,246,0.06)",
                        border: "1px solid rgba(139,92,246,0.1)",
                        borderRadius: "14px",
                        padding: "12px 16px",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}>
                        <span style={{ fontSize: 18 }}>📱</span>
                        <p style={{ fontSize: "12px", color: "#A78BFA", margin: 0, lineHeight: 1.5 }}>
                            Your phone number is required for account recovery and important updates.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
                            border: "1px solid rgba(239,68,68,0.2)",
                            borderRadius: "14px",
                            padding: "12px 16px",
                            marginBottom: "24px",
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <p style={{ fontSize: "13px", color: "#FCA5A5", margin: 0 }}>{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "28px" }}>
                            <label style={{
                                display: "block", fontSize: "12px", fontWeight: 600,
                                color: focused ? "#A78BFA" : "#9CA3AF",
                                marginBottom: "8px",
                                letterSpacing: 0.5, textTransform: "uppercase",
                                transition: "color 0.3s ease",
                            }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                placeholder="9876543210"
                                maxLength={15}
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: `1px solid ${focused ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)"}`,
                                    borderRadius: "14px",
                                    color: "#FFFFFF",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    letterSpacing: 1,
                                    outline: "none",
                                    transition: "all 0.3s ease",
                                    boxShadow: focused ? "0 0 20px rgba(139,92,246,0.1)" : "none",
                                }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "15px",
                                background: loading
                                    ? "rgba(139,92,246,0.5)"
                                    : "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                color: "#FFFFFF",
                                fontSize: "15px",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: "14px",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: loading
                                    ? "none"
                                    : "0 8px 24px rgba(139,92,246,0.3)",
                                letterSpacing: 0.3,
                            }}
                        >
                            {loading ? (
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⚡</span>
                                    Saving...
                                </span>
                            ) : "Continue to Dashboard →"}
                        </button>

                        {/* Go Back / Cancel */}
                        <button
                            type="button"
                            onClick={handleGoBack}
                            disabled={loading || cancelLoading}
                            style={{
                                width: "100%",
                                padding: "14px",
                                marginTop: "12px",
                                background: "rgba(255,255,255,0.03)",
                                color: "#9CA3AF",
                                fontSize: "14px",
                                fontWeight: 600,
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "14px",
                                cursor: (loading || cancelLoading) ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                if (!loading && !cancelLoading) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                    e.currentTarget.style.color = "#D1D5DB";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading && !cancelLoading) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                    e.currentTarget.style.color = "#9CA3AF";
                                }
                            }}
                        >
                            {cancelLoading ? "Cancelling..." : "Go back"}
                        </button>
                    </form>
                </div>

                <div style={{
                    textAlign: "center", marginTop: 20,
                    fontSize: 12, color: "#4B5563",
                }}>
                    Powered by AI • Built for ICSE Class 10
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
}
