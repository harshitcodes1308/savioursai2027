"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

export default function SignupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // Phone number stored in database
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const signupMutation = trpc.auth.signup.useMutation({
        onSuccess: () => {
            // Updated Flow: Signup -> Pricing (to Pay)
            router.push("/pricing");
        },
        onError: (err) => {
            setError(err.message || "Failed to create account");
        },
    });

    // We use the 'login' mutation for auto-signup in the backend currently, 
    // but the task requested a dedicated Signup Page. 
    // We'll reuse the `auth.login` (which handles auto-signup) OR `auth.signup` if it exists.
    // Looking at auth.ts, `signup` exists but `login` has the auto-creation logic with the new relaxed password rule.
    // However, `signup` is cleaner for explicit creation. Let's use `signup`.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!firstName || !lastName || !email || !password || !phone) {
            setError("Please fill in all fields");
            return;
        }

        const name = `${firstName} ${lastName}`.trim();

        signupMutation.mutate({
            email,
            password,
            name,
            phone, // Phone number now saved to database
            role: "STUDENT"
        });
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
                maxWidth: "480px",
                backgroundColor: "#0E0E10",
                border: "1px solid #1F1F22",
                borderRadius: "16px",
                padding: "40px"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                         <Image 
                            src="/logo.png" 
                            alt="ICSE Saviours" 
                            width={100} 
                            height={100} 
                            style={{ objectFit: "contain" }}
                         />
                    </div>
                    <h1 style={{
                        ...typography.display,
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginBottom: "8px"
                    }}>
                        Create Account
                    </h1>
                    <p style={{ ...typography.text, color: "#9CA3AF" }}>
                        Join the waiting list of toppers
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                        <div>
                            <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#E5E7EB", marginBottom: "8px" }}>First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                style={{ ...typography.text, width: "100%", padding: "12px", backgroundColor: "#1A1A1D", border: "1px solid #333", borderRadius: "8px", color: "#FFF", fontSize: "14px", outline: "none" }}
                            />
                        </div>
                        <div>
                            <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#E5E7EB", marginBottom: "8px" }}>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                style={{ ...typography.text, width: "100%", padding: "12px", backgroundColor: "#1A1A1D", border: "1px solid #333", borderRadius: "8px", color: "#FFF", fontSize: "14px", outline: "none" }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#E5E7EB", marginBottom: "8px" }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ ...typography.text, width: "100%", padding: "12px", backgroundColor: "#1A1A1D", border: "1px solid #333", borderRadius: "8px", color: "#FFF", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#E5E7EB", marginBottom: "8px" }}>Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ ...typography.text, width: "100%", padding: "12px", backgroundColor: "#1A1A1D", border: "1px solid #333", borderRadius: "8px", color: "#FFF", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#E5E7EB", marginBottom: "8px" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...typography.text, width: "100%", padding: "12px", backgroundColor: "#1A1A1D", border: "1px solid #333", borderRadius: "8px", color: "#FFF", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={signupMutation.isPending}
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
                            cursor: signupMutation.isPending ? "not-allowed" : "pointer",
                            opacity: signupMutation.isPending ? 0.7 : 1,
                            transition: "all 0.2s"
                        }}
                    >
                        {signupMutation.isPending ? "Creating Account..." : "Create Account & Proceed"}
                    </button>
                </form>

                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <p style={{ ...typography.text, fontSize: "14px", color: "#9CA3AF" }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{ color: "#8B5CF6", fontWeight: 600, textDecoration: "none" }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
