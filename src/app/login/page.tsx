"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

export default function LoginPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

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

        if (!firstName || !lastName || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        // Auto-Signup Logic: We send the name so the backend can create the user if they don't exist
        const name = `${firstName} ${lastName}`.trim();
        loginMutation.mutate({ email, password, name, rememberMe });
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
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                        <div style={{
                            width: "160px",
                            height: "160px",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                             <Image 
                                src="/logo.png" 
                                alt="ICSE Saviours" 
                                width={160} 
                                height={160} 
                                style={{ objectFit: "contain" }}
                                priority
                             />
                        </div>
                    </div>
                    <h1 style={{
                        ...typography.display,
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginBottom: "8px"
                    }}>
                        Sign In
                    </h1>
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
                    {/* First Name */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            ...typography.text,
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#E5E7EB",
                            marginBottom: "8px"
                        }}>
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
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
                        />
                    </div>

                    {/* Last Name */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            ...typography.text,
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#E5E7EB",
                            marginBottom: "8px"
                        }}>
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            ...typography.text,
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#E5E7EB",
                            marginBottom: "8px"
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        />
                    </div>

                    {/* Password */}
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
                        />
                    </div>

                    {/* Remember Me */}
                    <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div 
                            onClick={() => setRememberMe(!rememberMe)}
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "6px",
                                border: rememberMe ? "none" : "2px solid #333",
                                backgroundColor: rememberMe ? "#8B5CF6" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            {rememberMe && <span style={{ color: "#FFF", fontSize: "14px", fontWeight: "bold" }}>✓</span>}
                        </div>
                        <span 
                            onClick={() => setRememberMe(!rememberMe)}
                            style={{ 
                                ...typography.text, 
                                fontSize: "14px", 
                                color: "#9CA3AF",
                                cursor: "pointer",
                                userSelect: "none"
                            }}
                        >
                            Remember me
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
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
                        {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* Instructional Text */}
                <div style={{
                    marginTop: "32px",
                    padding: "20px",
                    backgroundColor: "#1A1D24", // Darker distinguishing box
                    borderRadius: "12px",
                    border: "1px solid #2D2D30"
                }}>
                    <h3 style={{
                        ...typography.text,
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginBottom: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    }}>
                        Login Details
                    </h3>
                    <ul style={{
                        margin: 0,
                        paddingLeft: "20px",
                        color: "#9CA3AF",
                        fontSize: "13px",
                        lineHeight: "1.6"
                    }}>
                        <li style={{ marginBottom: "8px" }}>Use the email address on which you received access credentials</li>
                        <li style={{ marginBottom: "8px" }}>Your password has been sent to you via email after successful payment</li>
                        <li>Please enter the same email and password to sign in</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
