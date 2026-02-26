"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [focused, setFocused] = useState<string | null>(null);

    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: (err) => {
            setError(err.message || "Invalid credentials");
        },
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        loginMutation.mutate({ email, password, rememberMe });
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
            <div className="animate-orb" style={{
                position: "absolute", top: "10%", left: "15%",
                width: 300, height: 300, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
                pointerEvents: "none",
            }} />
            <div className="animate-orb" style={{
                position: "absolute", bottom: "10%", right: "10%",
                width: 400, height: 400, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)",
                pointerEvents: "none",
                animationDelay: "4s",
            }} />

            <div className="animate-fadeIn" style={{
                width: "100%",
                maxWidth: "440px",
                position: "relative",
                zIndex: 1,
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
                        <div className="animate-float" style={{
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
                            Welcome Back
                        </h1>
                        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                            Sign in to your academic command center
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="animate-scaleIn" style={{
                            background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
                            border: "1px solid rgba(239,68,68,0.2)",
                            borderRadius: "14px",
                            padding: "12px 16px",
                            marginBottom: "24px",
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <p style={{ ...typography.text, fontSize: "13px", color: "#FCA5A5", margin: 0 }}>{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block", fontSize: "12px", fontWeight: 600,
                                color: focused === "email" ? "#A78BFA" : "#9CA3AF",
                                marginBottom: "8px",
                                letterSpacing: 0.5, textTransform: "uppercase",
                                transition: "color 0.3s ease",
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocused("email")}
                                onBlur={() => setFocused(null)}
                                placeholder="you@example.com"
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: `1px solid ${focused === "email" ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)"}`,
                                    borderRadius: "14px",
                                    color: "#FFFFFF",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "all 0.3s ease",
                                    boxShadow: focused === "email" ? "0 0 20px rgba(139,92,246,0.1)" : "none",
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block", fontSize: "12px", fontWeight: 600,
                                color: focused === "password" ? "#A78BFA" : "#9CA3AF",
                                marginBottom: "8px",
                                letterSpacing: 0.5, textTransform: "uppercase",
                                transition: "color 0.3s ease",
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocused("password")}
                                onBlur={() => setFocused(null)}
                                placeholder="••••••••"
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: `1px solid ${focused === "password" ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)"}`,
                                    borderRadius: "14px",
                                    color: "#FFFFFF",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "all 0.3s ease",
                                    boxShadow: focused === "password" ? "0 0 20px rgba(139,92,246,0.1)" : "none",
                                }}
                            />
                        </div>

                        {/* Remember + Create */}
                        <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div
                                onClick={() => setRememberMe(!rememberMe)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                                    userSelect: "none",
                                }}
                            >
                                <div style={{
                                    width: 20, height: 20, borderRadius: 7,
                                    border: rememberMe ? "none" : "2px solid rgba(255,255,255,0.15)",
                                    background: rememberMe ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.25s ease",
                                    boxShadow: rememberMe ? "0 2px 8px rgba(139,92,246,0.3)" : "none",
                                }}>
                                    {rememberMe && <span style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>✓</span>}
                                </div>
                                <span style={{ fontSize: "13px", color: "#9CA3AF", }}>
                                    Remember me
                                </span>
                            </div>
                            <Link href="/signup" style={{
                                fontSize: "13px", fontWeight: 600, textDecoration: "none",
                                background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                Create Account
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            style={{
                                width: "100%",
                                padding: "15px",
                                background: loginMutation.isPending
                                    ? "rgba(139,92,246,0.5)"
                                    : "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                color: "#FFFFFF",
                                fontSize: "15px",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: "14px",
                                cursor: loginMutation.isPending ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: loginMutation.isPending
                                    ? "none"
                                    : "0 8px 24px rgba(139,92,246,0.3)",
                                letterSpacing: 0.3,
                            }}
                        >
                            {loginMutation.isPending ? (
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                    <span className="animate-spin-slow" style={{ display: "inline-block" }}>⚡</span>
                                    Signing In...
                                </span>
                            ) : "Sign In →"}
                        </button>

                        {/* Or divider */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 12,
                            margin: "20px 0",
                        }}>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                            <span style={{ fontSize: "12px", color: "#4B5563", fontWeight: 500 }}>or</span>
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={() => window.location.href = "/api/auth/google"}
                            style={{
                                width: "100%",
                                padding: "14px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "14px",
                                color: "#FFFFFF",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign in with Google
                        </button>
                    </form>
                </div>

                {/* Bottom text */}
                <div style={{
                    textAlign: "center", marginTop: 20,
                    fontSize: 12, color: "#4B5563",
                }}>
                    Powered by AI • Built for ICSE Class 10
                </div>
            </div>
        </div>
    );
}
