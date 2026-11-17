"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";
import { AppIcon } from "@/components/ui/AppIcon";

interface UpgradePromptProps {
  featureName: string;
  description: string;
  onClose?: () => void;
  type?: "PRO" | "BUNDLE" | "LNB_CHEMISTRY" | "CHOICE";
}

const PRO_FEATURES = [
  "Unlimited AI Doubt Solver",
  "Custom tests and competency practice",
  "Guess Papers and Half Yearly Simulator",
  "Focus Mode, Smart Notes and study tools",
];

export function UpgradePrompt({ featureName, description, onClose, type = "PRO" }: UpgradePromptProps) {
  const router = useRouter();
  const { data: session } = trpc.auth.getSession.useQuery();
  const user = session?.user;
  const [checkoutOpening, setCheckoutOpening] = useState(false);
  const close = () => onClose ? onClose() : router.push("/dashboard");
  const releaseForCheckout = () => flushSync(() => setCheckoutOpening(true));

  if (checkoutOpening) return null;

  return <div role="dialog" aria-modal="true" aria-labelledby="upgrade-title" style={overlay}>
    <section style={{ width: "100%", maxWidth: type === "CHOICE" ? 720 : 520, maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 20, padding: 30, position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,.5)" }}>
      <button aria-label="Close" onClick={close} style={closeButton}><AppIcon name="x" size={18} /></button>

      {user?.isDemo ? <div style={{ textAlign: "center", padding: "10px 0" }}>
        <AppIcon name="rocket" size={31} color="var(--accent-gold)" />
        <h2 id="upgrade-title" style={title}>Create your account to continue</h2>
        <p style={copy}>Save your work and unlock the full student experience.</p>
        <button onClick={() => router.push("/signup?from=demo")} style={buttonStyle}>Create account</button>
      </div> : type === "LNB_CHEMISTRY" ? <div>
        <h2 id="upgrade-title" style={title}>Unlock Chemistry Sets</h2>
        <p style={copy}>{description}</p>
        <div style={priceCard}><strong style={{ fontSize: 28 }}>₹19</strong><span style={{ color: "var(--text-muted)", marginLeft: 6 }}>one-time</span></div>
        <RazorpayButton amount={19} type="LNB_CHEMISTRY" email={user?.email || ""} name={user?.name || ""} buttonText="Pay ₹19 & unlock" onCheckoutOpen={releaseForCheckout} onSuccess={close} />
      </div> : type === "CHOICE" ? <div>
        <div style={eyebrow}>FREE PREVIEW COMPLETE</div>
        <h2 id="upgrade-title" style={{ ...title, fontSize: 28 }}>{featureName}</h2>
        <p style={copy}>{description}</p>
        <div className="upgrade-choice-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
          <article style={choiceCard}>
            <div style={eyebrow}>SAVIOURS AI PRO</div>
            <div style={priceLine}><strong style={{ fontSize: 31 }}>₹99</strong><span style={{ color: "var(--text-muted)", fontSize: 11 }}>one-time</span></div>
            <p style={smallCopy}>Every premium AI, practice and productivity feature through 31 March 2027.</p>
            <ul style={featureList}>{PRO_FEATURES.slice(0, 3).map(feature => <li key={feature} style={featureItem}><AppIcon name="check" size={14} color="var(--accent-gold)" />{feature}</li>)}</ul>
            <RazorpayButton type="PRO" variant="outline" email={user?.email || ""} name={user?.name || ""} buttonText="Get Pro · ₹99" onCheckoutOpen={releaseForCheckout} onSuccess={close} />
          </article>
          <article style={{ ...choiceCard, border: "1px solid var(--accent-gold-border)", background: "linear-gradient(145deg, rgba(0,212,255,.09), var(--bg-base))" }}>
            <div style={eyebrow}>BEST VALUE · SIDEKICK BUNDLE</div>
            <div style={priceLine}><strong style={{ fontSize: 31 }}>₹299</strong><span style={{ color: "var(--text-muted)", fontSize: 11 }}><s>₹490</s> one-time</span></div>
            <p style={smallCopy}>All 10 Sidekick e-books, every upcoming Sidekick and Saviours AI Pro included.</p>
            <ul style={featureList}>
              <li style={featureItem}><AppIcon name="check" size={14} color="var(--accent-gold)" />All 10 subject e-books</li>
              <li style={featureItem}><AppIcon name="check" size={14} color="var(--accent-gold)" />Every upcoming Sidekick</li>
              <li style={featureItem}><AppIcon name="check" size={14} color="var(--accent-gold)" />Complete Pro access included</li>
            </ul>
            <RazorpayButton type="EBOOK_BUNDLE" email={user?.email || ""} name={user?.name || ""} buttonText="Get bundle + Pro · ₹299" onCheckoutOpen={releaseForCheckout} onSuccess={close} />
          </article>
        </div>
        <style>{`@media (max-width: 620px) { .upgrade-choice-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div> : <div>
        <div style={eyebrow}>PRO ACCESS</div>
        <h2 id="upgrade-title" style={title}>{featureName}</h2>
        <p style={copy}>{description}</p>
        <div style={{ ...priceCard, display: "grid", gap: 9 }}>
          {PRO_FEATURES.map(feature => <div key={feature} style={{ display: "flex", gap: 8, color: "var(--text-secondary)", fontSize: 13 }}><AppIcon name="check" size={15} color="var(--accent-gold)" />{feature}</div>)}
          <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: 14, marginTop: 5 }}><strong style={{ fontSize: 30 }}>₹99</strong><span style={{ color: "var(--text-muted)", marginLeft: 6 }}>one-time</span></div>
        </div>
        <RazorpayButton type="PRO" email={user?.email || ""} name={user?.name || ""} buttonText="Get Pro — ₹99" onCheckoutOpen={releaseForCheckout} onSuccess={close} />
      </div>}
    </section>
  </div>;
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(2,8,16,.96)", backdropFilter: "blur(20px)", display: "grid", placeItems: "center", padding: 16 };
const closeButton: React.CSSProperties = { position: "absolute", right: 14, top: 14, border: 0, background: "transparent", color: "var(--text-muted)", cursor: "pointer", zIndex: 2 };
const title: React.CSSProperties = { fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: 25, margin: "10px 0 8px" };
const copy: React.CSSProperties = { color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" };
const smallCopy: React.CSSProperties = { ...copy, fontSize: 12, marginBottom: 14, minHeight: 58 };
const priceCard: React.CSSProperties = { background: "var(--bg-base)", border: "1px solid var(--bg-border)", borderRadius: 13, padding: 18, marginBottom: 18, fontFamily: "var(--font-body)" };
const choiceCard: React.CSSProperties = { ...priceCard, marginBottom: 0, display: "flex", flexDirection: "column", minWidth: 0 };
const eyebrow: React.CSSProperties = { color: "var(--accent-gold)", fontSize: 10, letterSpacing: ".12em", fontWeight: 800 };
const priceLine: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: 8, margin: "12px 0 8px", color: "var(--text-primary)", fontFamily: "var(--font-body)" };
const featureList: React.CSSProperties = { listStyle: "none", padding: 0, margin: "0 0 18px", display: "grid", gap: 8, color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: 12, flex: 1 };
const featureItem: React.CSSProperties = { display: "flex", gap: 7, alignItems: "flex-start" };
const buttonStyle: React.CSSProperties = { width: "100%", padding: 13, borderRadius: 10, border: "1px solid var(--accent-gold-border)", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", cursor: "pointer", fontWeight: 700 };
