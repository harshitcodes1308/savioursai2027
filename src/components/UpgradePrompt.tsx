"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";

interface UpgradePromptProps {
    featureName: string;
    description: string;
    onClose?: () => void;
    type?: "PRO" | "LNB_CHEMISTRY";
}

const MONTHLY_FEATURES = [
    "Unlimited AI Doubt Solver",
    "Smart Study Planner",
    "Competency Test (PYQ-based)",
    "Customise Test builder",
    "Flip the Question",
    "Focus Mode with Pomodoro",
];

const YEARLY_FEATURES = [
    ...MONTHLY_FEATURES,
    "Priority support",
    "Early access to new features",
];

const LNB_FEATURES = [
    "120 vital Numericals (4 Sets)",
    "80 crucial Formulas",
    "40 important Definitions",
    "Unlimited Chemistry Re-rolls",
];

export function UpgradePrompt({ featureName, description, onClose, type = "PRO" }: UpgradePromptProps) {
    const router = useRouter();
    const { data: session } = trpc.auth.getSession.useQuery();
    const [selectedPlan, setSelectedPlan] = useState<"MONTHLY" | "YEARLY">("YEARLY");
    const user = session?.user;

    const handleClose = () => {
        if (onClose) onClose();
        else router.push("/dashboard");
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10,10,15,0.96)",
            backdropFilter: "blur(24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            animation: "pageEnter 0.3s ease-out both",
        }}>
            <div style={{
                width: "100%",
                maxWidth: type === "LNB_CHEMISTRY" ? 440 : 560,
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
            }}>
                {/* Close button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute",
                        top: 16, right: 16,
                        width: 32, height: 32,
                        borderRadius: "50%",
                        background: "var(--bg-base)",
                        border: "1px solid var(--bg-border)",
                        color: "var(--text-muted)",
                        fontSize: 14,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                    }}
                >
                    ✕
                </button>

                {/* Gold top accent line */}
                <div style={{
                    height: 2,
                    background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
                }} />

                <div style={{ padding: "32px 32px 28px" }}>
                    {/* Header */}
                    <div style={{ marginBottom: 24, paddingRight: 32 }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 12px",
                            background: "rgba(0,212,255,0.1)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            borderRadius: 100,
                            marginBottom: 14,
                        }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                {type === "LNB_CHEMISTRY" ? "Chemistry Unlock" : "Upgrade Required"}
                            </span>
                        </div>
                        <h2 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 26,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.02em",
                            margin: "0 0 8px",
                        }}>
                            {type === "LNB_CHEMISTRY" ? "Unlock Chemistry Sets" : featureName}
                        </h2>
                        <p style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            color: "var(--text-muted)",
                            lineHeight: 1.6,
                            margin: 0,
                        }}>
                            {description}
                        </p>
                    </div>

                    {type === "LNB_CHEMISTRY" ? (
                        /* ── LNB Chemistry one-time ── */
                        <>
                            <div style={{
                                background: "var(--bg-base)",
                                border: "1px solid var(--bg-border)",
                                borderRadius: 14,
                                padding: "20px",
                                marginBottom: 20,
                            }}>
                                <div style={{ marginBottom: 12 }}>
                                    {LNB_FEATURES.map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                                            <span style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--accent-gold)", flexShrink: 0 }}>✓</span>
                                            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ paddingTop: 12, borderTop: "1px solid var(--bg-border)" }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text-primary)" }}>₹19</span>
                                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", marginLeft: 6 }}>one-time</span>
                                </div>
                            </div>
                            <RazorpayButton
                                amount={19}
                                type="LNB_CHEMISTRY"
                                email={(user as any)?.email || ""}
                                name={(user as any)?.name || ""}
                                buttonText="Pay ₹19 & Unlock →"
                                onSuccess={() => { if (onClose) onClose(); router.refresh(); }}
                            />
                        </>
                    ) : (
                        /* ── Subscription plans ── */
                        <>
                            {/* Plan toggle */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                                {(["MONTHLY", "YEARLY"] as const).map(plan => {
                                    const isSelected = selectedPlan === plan;
                                    const isYearly = plan === "YEARLY";
                                    return (
                                        <button
                                            key={plan}
                                            onClick={() => setSelectedPlan(plan)}
                                            style={{
                                                padding: "14px 16px",
                                                borderRadius: 12,
                                                background: isSelected ? "rgba(0,212,255,0.08)" : "var(--bg-base)",
                                                border: `1px solid ${isSelected ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                                                cursor: "pointer",
                                                textAlign: "left",
                                                transition: "all 0.15s ease",
                                                position: "relative",
                                            }}
                                        >
                                            {isYearly && (
                                                <div style={{
                                                    position: "absolute",
                                                    top: -8, right: 8,
                                                    background: "var(--accent-gold)",
                                                    color: "var(--bg-base)",
                                                    fontFamily: "var(--font-body)",
                                                    fontSize: 8, fontWeight: 700,
                                                    letterSpacing: "0.06em",
                                                    textTransform: "uppercase",
                                                    padding: "2px 8px",
                                                    borderRadius: 100,
                                                }}>
                                                    Best Value
                                                </div>
                                            )}
                                            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: isSelected ? "var(--accent-gold)" : "var(--text-primary)", letterSpacing: "-0.02em" }}>
                                                {plan === "MONTHLY" ? "₹199" : "₹499"}
                                            </div>
                                            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                                                {plan === "MONTHLY" ? "per month" : "per year"}
                                            </div>
                                            {isYearly && (
                                                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--accent-gold)", marginTop: 4 }}>
                                                    Save ₹1,889
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feature list */}
                            <div style={{
                                background: "var(--bg-base)",
                                border: "1px solid var(--bg-border)",
                                borderRadius: 12,
                                padding: "16px",
                                marginBottom: 20,
                            }}>
                                {(selectedPlan === "YEARLY" ? YEARLY_FEATURES : MONTHLY_FEATURES).map((f, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                                        <span style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "var(--accent-gold)", flexShrink: 0 }}>✓</span>
                                        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <RazorpayButton
                                amount={selectedPlan === "MONTHLY" ? 199 : 499}
                                type="PRO"
                                email={(user as any)?.email || ""}
                                name={(user as any)?.name || ""}
                                buttonText={`Get ${selectedPlan === "MONTHLY" ? "Monthly" : "Yearly"} Plan →`}
                                onSuccess={() => { if (onClose) onClose(); router.refresh(); }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
