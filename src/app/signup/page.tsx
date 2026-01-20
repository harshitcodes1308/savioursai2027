"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT" as "STUDENT" | "TEACHER",
        agreedToTerms: false,
    });
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);

    const signupMutation = trpc.auth.signup.useMutation({
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: (err) => {
            setError(err.message || "Failed to create account");
        },
    });

    const calculatePasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
        return strength;
    };

    const handlePasswordChange = (pwd: string) => {
        setFormData({ ...formData, password: pwd });
        setPasswordStrength(calculatePasswordStrength(pwd));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (!formData.agreedToTerms) {
            setError("Please accept the terms and conditions");
            return;
        }

        signupMutation.mutate({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        });
    };

    const strengthColors = ["#DC2626", "#F59E0B", "#3B82F6", "#10B981"];
    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

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
                        <span style={{ fontSize: "24px" }}>✨</span>
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
                    <p style={{ ...typography.text, fontSize: "14px", color: "#9CA3AF" }}>
                        Join ICSE Saviours and start your AI-powered learning journey
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
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
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
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            value={formData.password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
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
                        {formData.password && (
                            <div style={{ marginTop: "8px" }}>
                                <div style={{
                                    height: "4px",
                                    backgroundColor: "#333",
                                    borderRadius: "2px",
                                    overflow: "hidden"
                                }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${(passwordStrength / 4) * 100}%`,
                                        backgroundColor: strengthColors[passwordStrength - 1] || "#333",
                                        transition: "all 0.3s"
                                    }}></div>
                                </div>
                                <p style={{
                                    ...typography.text,
                                    fontSize: "12px",
                                    color: strengthColors[passwordStrength - 1] || "#9CA3AF",
                                    marginTop: "4px"
                                }}>
                                    {strengthLabels[passwordStrength - 1] || "Too weak"}
                                </p>
                            </div>
                        )}
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
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            ...typography.text,
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#E5E7EB",
                            marginBottom: "12px"
                        }}>
                            I am a
                        </label>
                        <div style={{ display: "flex", gap: "12px" }}>
                            {["STUDENT", "TEACHER"].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role as typeof formData.role })}
                                    style={{
                                        ...typography.text,
                                        flex: 1,
                                        padding: "12px",
                                        backgroundColor: formData.role === role ? "#8B5CF6" : "#1A1A1D",
                                        color: formData.role === role ? "#FFFFFF" : "#9CA3AF",
                                        border: `1px solid ${formData.role === role ? "#8B5CF6" : "#333"}`,
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {role === "STUDENT" ? "🎓 Student" : "👨‍🏫 Teacher"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "flex", alignItems: "start", gap: "8px", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={formData.agreedToTerms}
                                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                style={{ width: "16px", height: "16px", marginTop: "2px", cursor: "pointer", accentColor: "#8B5CF6" }}
                            />
                            <span style={{ ...typography.text, fontSize: "13px", color: "#9CA3AF" }}>
                                I agree to the{" "}
                                <a href="/terms" style={{ color: "#8B5CF6", textDecoration: "none" }}>
                                    Terms of Service
                                </a>
                                {" "}and{" "}
                                <a href="/privacy" style={{ color: "#8B5CF6", textDecoration: "none" }}>
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={signupMutation.isPending}
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
                            cursor: signupMutation.isPending ? "not-allowed" : "pointer",
                            opacity: signupMutation.isPending ? 0.7 : 1,
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        {signupMutation.isPending ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                {/* Login Link */}
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <p style={{ ...typography.text, fontSize: "14px", color: "#9CA3AF" }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{
                            color: "#8B5CF6",
                            fontWeight: 600,
                            textDecoration: "none"
                        }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
