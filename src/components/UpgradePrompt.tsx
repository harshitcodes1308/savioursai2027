"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";
import { AppIcon } from "@/components/ui/AppIcon";

interface UpgradePromptProps { featureName: string; description: string; onClose?: () => void; type?: "PRO" | "BUNDLE" | "LNB_CHEMISTRY" | "CHOICE"; }
const PRO_FEATURES = ["Unlimited AI Doubt Solver", "Custom test builder", "Guess Papers and competency practice", "Half Yearly Simulator", "Focus Mode and Smart Notes", "ChronoScroll, Numerical Mastery and Date Battle Arena"];

export function UpgradePrompt({ featureName, description, onClose, type = "PRO" }: UpgradePromptProps) {
  const router = useRouter(); const { data: session } = trpc.auth.getSession.useQuery(); const user = session?.user;
  const close = () => onClose ? onClose() : router.push("/dashboard");
  return <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10,10,15,.96)", backdropFilter: "blur(20px)", display: "grid", placeItems: "center", padding: 24 }}><section style={{ width: "100%", maxWidth: 520, background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 20, padding: 30, position: "relative" }}>
    <button aria-label="Close" onClick={close} style={{ position: "absolute", right: 14, top: 14, border: 0, background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}><AppIcon name="x" size={18} /></button>
    {user?.isDemo ? <div style={{ textAlign: "center", padding: "10px 0" }}><AppIcon name="rocket" size={31} color="var(--accent-gold)" /><h2 style={title}>Create your account to continue</h2><p style={copy}>Save your work and unlock the full student experience.</p><button onClick={() => router.push("/signup?from=demo")} style={buttonStyle}>Create account</button></div> : type === "LNB_CHEMISTRY" ? <div><h2 style={title}>Unlock Chemistry Sets</h2><p style={copy}>{description}</p><div style={priceCard}><strong style={{ fontSize: 28 }}>₹19</strong><span style={{ color: "var(--text-muted)", marginLeft: 6 }}>one-time</span></div><RazorpayButton amount={19} type="LNB_CHEMISTRY" email={user?.email || ""} name={user?.name || ""} buttonText="Pay ₹19 & unlock" onSuccess={close} /></div> : <div><div style={{ color: "var(--accent-gold)", fontSize: 11, letterSpacing: ".12em", fontWeight: 700 }}>PRO ACCESS</div><h2 style={title}>{featureName}</h2><p style={copy}>{description}</p><div style={{ ...priceCard, display: "grid", gap: 9 }}>{PRO_FEATURES.map(feature => <div key={feature} style={{ display: "flex", gap: 8, color: "var(--text-secondary)", fontSize: 13 }}><AppIcon name="check" size={15} color="var(--accent-gold)" />{feature}</div>)}<div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: 14, marginTop: 5 }}><strong style={{ fontSize: 30 }}>₹99</strong><span style={{ color: "var(--text-muted)", marginLeft: 6 }}>one-time</span></div></div><RazorpayButton amount={99} type="PRO" email={user?.email || ""} name={user?.name || ""} buttonText="Get Pro — ₹99" onSuccess={close} /></div>}
  </section></div>;
}
const title = { fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: 25, margin: "10px 0 8px" }; const copy = { color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }; const priceCard = { background: "var(--bg-base)", border: "1px solid var(--bg-border)", borderRadius: 13, padding: 18, marginBottom: 18, fontFamily: "var(--font-body)" }; const buttonStyle = { width: "100%", padding: 13, borderRadius: 10, border: "1px solid var(--accent-gold-border)", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", cursor: "pointer", fontWeight: 700 };
