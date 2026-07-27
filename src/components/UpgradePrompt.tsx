"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";

interface UpgradePromptProps {
    featureName: string;
    description: string;
    onClose?: () => void;
    type?: "PRO" | "BUNDLE" | "LNB_CHEMISTRY" | "CHOICE";
}

const PRO_FEATURES = [
    "Unlimited AI Doubt Solver",
    "Smart Study Planner",
    "Customise Test builder",
    "Flip the Question",
    "Focus Mode with Pomodoro",
    "ChronoScroll — History Timeline",
    "Numerical Mastery",
    "Date Battle Arena",
    "Exam Strategy Builder",
];

const BUNDLE_HIGHLIGHTS = [
    "E-Books Library — All 10 Subjects",
    "Question Banks for Every Subject",
    "Competency Test (PYQ-based)",
    "Guess Papers — AI-predicted",
];

const BUNDLE_AI_FEATURES = [
    "All Pro AI features included",
    "Priority access to new features",
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
    const user = session?.user;
    const isDemo = user?.isDemo === true;

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
                maxWidth: type === "LNB_CHEMISTRY" ? 440 : type === "CHOICE" ? 720 : 560,
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
            }}>
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

                <div style={{
                    height: 2,
                    background: type === "BUNDLE" || type === "CHOICE"
                        ? "linear-gradient(90deg, transparent, #F59E0B, #EF4444, transparent)"
                        : "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
                }} />

                <div style={{ padding: "32px 32px 28px" }}>
                    <div style={{ marginBottom: 24, paddingRight: 32 }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 12px",
                            background: type === "BUNDLE" || type === "CHOICE" ? "rgba(245,158,11,0.1)" : "rgba(0,212,255,0.1)",
                            border: `1px solid ${type === "BUNDLE" || type === "CHOICE" ? "rgba(245,158,11,0.2)" : "rgba(0,212,255,0.2)"}`,
                            borderRadius: 100,
                            marginBottom: 14,
                        }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: type === "BUNDLE" || type === "CHOICE" ? "#F59E0B" : "var(--accent-gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                {type === "LNB_CHEMISTRY" ? "Chemistry Unlock" : type === "CHOICE" ? "Choose your plan" : type === "BUNDLE" ? "Ultimate Bundle Required" : "Upgrade Required"}
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

                    {isDemo ? (
                        <div style={{ textAlign: "center", padding: "12px 4px 4px" }}>
                            <div style={{ fontSize: 38, marginBottom: 12 }}>🚀</div>
                            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: 22, margin: "0 0 9px" }}>Ready to make this yours?</h3>
                            <p style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, margin: "0 0 22px" }}>This is a shared product tour. Create your own account to save work and unlock the real experience.</p>
                            <button onClick={() => router.push("/signup?from=demo")} style={{ width: "100%", padding: 15, cursor: "pointer", border: "1px solid var(--accent-gold-border)", borderRadius: 12, background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontWeight: 700 }}>Create a real account →</button>
                        </div>
                    ) : type === "LNB_CHEMISTRY" ? (
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
                                email={user?.email || ""}
                                name={user?.name || ""}
                                buttonText="Pay ₹19 & Unlock →"
                                onSuccess={() => { if (onClose) onClose(); router.refresh(); }}
                            />
                        </>
                    ) : type === "CHOICE" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
                            <div style={{ background: "var(--bg-base)", border: "1px solid var(--bg-border)", borderRadius: 14, padding: "20px" }}>
                                <div style={{ color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>PRO</div>
                                <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 24, marginTop: 8 }}>₹199</div>
                                <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, margin: "3px 0 16px" }}>one-time · AI study tools</div>
                                <div style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.7, minHeight: 84 }}>AI Doubt Solver, custom tests, Smart Planner, Focus Mode, ChronoScroll, and more.</div>
                                <RazorpayButton amount={199} type="PRO" email={user?.email || ""} name={user?.name || ""} buttonText="Get Pro — ₹199 →" onSuccess={() => { if (onClose) onClose(); router.refresh(); }} />
                            </div>
                            <div style={{ background: "var(--bg-base)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: "20px", boxShadow: "0 0 24px rgba(245,158,11,0.07)" }}>
                                <div style={{ color: "#F59E0B", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>ULTIMATE BUNDLE</div>
                                <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 24, marginTop: 8 }}>₹699</div>
                                <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, margin: "3px 0 16px" }}>one-time · everything included</div>
                                <div style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.7, minHeight: 84 }}>Everything in Pro, plus Half Yearly Simulator, e-books, question banks, competency tests, and Guess Papers.</div>
                                <RazorpayButton amount={699} type="BUNDLE" email={user?.email || ""} name={user?.name || ""} buttonText="Get Bundle — ₹699 →" onSuccess={() => { if (onClose) onClose(); router.refresh(); }} />
                            </div>
                        </div>
                    ) : type === "BUNDLE" ? (
                        <>
                            <div style={{
                                background: "var(--bg-base)",
                                border: "1px solid rgba(245,158,11,0.2)",
                                borderRadius: 14,
                                padding: "20px",
                                marginBottom: 20,
                            }}>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#F59E0B", marginBottom: 12 }}>
                                    EXCLUSIVE TO BUNDLE
                                </div>
                                {BUNDLE_HIGHLIGHTS.map((f, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                                        <span style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#F59E0B", flexShrink: 0 }}>✓</span>
                                        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-primary)", fontWeight: 600 }}>{f}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--bg-border)" }}>
                                    {BUNDLE_AI_FEATURES.map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
                                            <span style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(0,212,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--accent-gold)", flexShrink: 0 }}>✓</span>
                                            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ paddingTop: 14, borderTop: "1px solid var(--bg-border)", marginTop: 12 }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text-primary)" }}>₹699</span>
                                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", marginLeft: 6 }}>one-time</span>
                                </div>
                            </div>
                            <RazorpayButton
                                amount={699}
                                type="BUNDLE"
                                email={user?.email || ""}
                                name={user?.name || ""}
                                buttonText="Get Ultimate Bundle — ₹699 →"
                                onSuccess={() => { if (onClose) onClose(); router.refresh(); }}
                            />
                        </>
                    ) : (
                        <>
                            <div style={{
                                background: "var(--bg-base)",
                                border: "1px solid var(--bg-border)",
                                borderRadius: 14,
                                padding: "20px",
                                marginBottom: 20,
                            }}>
                                {PRO_FEATURES.map((f, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                                        <span style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "var(--accent-gold)", flexShrink: 0 }}>✓</span>
                                        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>{f}</span>
                                    </div>
                                ))}
                                <div style={{ paddingTop: 14, borderTop: "1px solid var(--bg-border)", marginTop: 8 }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text-primary)" }}>₹199</span>
                                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", marginLeft: 6 }}>one-time</span>
                                </div>
                            </div>
                            <RazorpayButton
                                amount={199}
                                type="PRO"
                                email={user?.email || ""}
                                name={user?.name || ""}
                                buttonText="Get Pro — ₹199 →"
                                onSuccess={() => { if (onClose) onClose(); router.refresh(); }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
