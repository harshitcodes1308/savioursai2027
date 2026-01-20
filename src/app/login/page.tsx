"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const loginMutation = trpc.auth.login.useMutation({
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: (err) => {
            setError(err.message || "Invalid email or password");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        loginMutation.mutate({ email, password });
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#030303",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "420px",
                backgroundColor: "#0E0E10",
                border: "1px solid #1F1F22",
                borderRadius: "16px",
                padding: "40px"
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "#8B5CF6",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)"
                    }}>
                        <span style={{ ...typography.display, fontSize: "24px" }}>✨</span>
                    </div>
                    <h1 style={{
                        ...typography.display,
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginBottom: "8px"
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        ...typography.text,
                        fontSize: "14px",
                        color: "#9CA3AF"
                    }}>
                        Sign in to continue your learning journey
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        backgroundColor: "#7F1D1D",
                        border: "1px solid #991B1B",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        marginBottom: "24px"
                    }}>
                        <p style={{ ...typography.text, fontSize: "14px", color: "#FCA5A5" }}>{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            ...typography.text,
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#E5E7EB",
                            marginBottom: "8px"
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@example.com"
                            style={{
                                ...typography.text,
                                width: "100%",
                                padding: "12px 16px",
                                backgroundColor: "#1A1A1D",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#FFFFFF",
                                fontSize: "14px",
                                outline: "none",
                                transition: "all 0.2s"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#8B5CF6";
                                e.target.style.boxShadow = "0 0 0 2px rgba(139, 92, 246, 0.2)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#333";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            ...typography.text,
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#E5E7EB",
                            marginBottom: "8px"
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                ...typography.text,
                                width: "100%",
                                padding: "12px 16px",
                                backgroundColor: "#1A1A1D",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#FFFFFF",
                                fontSize: "14px",
                                outline: "none",
                                transition: "all 0.2s"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#8B5CF6";
                                e.target.style.boxShadow = "0 0 0 2px rgba(139, 92, 246, 0.2)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#333";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px"
                    }}>
                        <label style={{ ...typography.text, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#8B5CF6" }}
                            />
                            <span style={{ fontSize: "14px", color: "#9CA3AF" }}>Remember me</span>
                        </label>
                        <Link href="/forgot-password" style={{
                            ...typography.text,
                            fontSize: "14px",
                            color: "#8B5CF6",
                            textDecoration: "none"
                        }}>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            ...typography.text,
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#8B5CF6",
                            color: "#FFFFFF",
                            fontSize: "16px",
                            fontWeight: 600,
                            border: "none",
                            borderRadius: "8px",
                            cursor: loginMutation.isPending ? "not-allowed" : "pointer",
                            opacity: loginMutation.isPending ? 0.7 : 1,
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <p style={{ ...typography.text, fontSize: "14px", color: "#9CA3AF" }}>
                        Don't have an account?{" "}
                        <Link href="/signup" style={{
                            color: "#8B5CF6",
                            fontWeight: 600,
                            textDecoration: "none"
                        }}>
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
