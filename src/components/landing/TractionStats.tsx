"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ElegantShapes from "./ElegantShapes";

type DemoPlan = "PRO";

const plans: Array<{ plan: DemoPlan; eyebrow: string; title: string; price: string; details: string[]; color: string }> = [
  { plan: "PRO", eyebrow: "Pro tour", title: "Try the Pro plan", price: "₹99 one-time", color: "var(--accent-gold)", details: ["AI tools, practice and simulators", "One complete Pro experience", "No card or sign-up required"] },
];

export default function TractionStats() {
  const router = useRouter();
  const [loading, setLoading] = useState<DemoPlan | null>(null);
  const [error, setError] = useState("");

  const startDemo = async (plan: DemoPlan) => {
    setLoading(plan); setError("");
    try {
      const response = await fetch("/api/auth/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "signin", plan }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not start the live demo.");
      router.push(data.redirectTo || "/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not start the live demo.");
      setLoading(null);
    }
  };

  return <section style={{ position: "relative", zIndex: 1, padding: "clamp(80px, 12vw, 140px) 24px", overflow: "hidden" }}>
    <ElegantShapes />
    <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
      <div style={{ marginBottom: 44, maxWidth: 720 }}>
        <div className="sa-eyebrow" style={{ marginBottom: 20 }}>Try it live now</div>
        <h2 className="sa-grad-text" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 64px)", letterSpacing: "-.035em", margin: "0 0 14px", lineHeight: 1.02, fontWeight: 800 }}>Don&apos;t just read about it.<br />Use it.</h2>
        <p style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: "clamp(16px, 2.4vw, 21px)", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>Enter a guided product tour in seconds. No account, payment, or setup needed.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))", gap: 18 }}>
        {plans.map(item => <article key={item.plan} className="sa-bento" style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
          <div style={{ color: item.color, fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase" }}>{item.eyebrow}</div>
          <h3 style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 27, letterSpacing: "-.025em", margin: "14px 0 8px" }}>{item.title}</h3>
          <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, marginBottom: 22 }}>{item.price}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 26px", display: "grid", gap: 10, flex: 1 }}>{item.details.map(detail => <li key={detail} style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: 13, display: "flex", gap: 9 }}><span style={{ color: item.color }}>✦</span>{detail}</li>)}</ul>
          <button onClick={() => void startDemo(item.plan)} disabled={loading !== null} style={{ cursor: loading ? "wait" : "pointer", border: "1px solid var(--accent-gold-border)", borderRadius: 10, padding: "13px 16px", background: "var(--accent-gold-glow)", color: item.color, fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700 }}>{loading === item.plan ? "Opening your Pro tour…" : item.title + " →"}</button>
        </article>)}
      </div>
      {error && <p role="alert" style={{ color: "#FB7185", fontFamily: "var(--font-body)", fontSize: 13, marginTop: 16 }}>{error}</p>}
    </div>
    {loading && <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", padding: 24, background: "rgba(7,7,13,.96)", backdropFilter: "blur(18px)" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 48, animation: "try-live-pulse 1s ease-in-out infinite" }}>◈</div><div style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: "clamp(26px,5vw,42px)", marginTop: 18 }}>Opening your Pro tour…</div><p style={{ color: "var(--text-muted)", fontFamily: "var(--font-tagline)", fontStyle: "italic" }}>Loading your complete Pro experience</p></div>
    </div>}
    <style>{`@keyframes try-live-pulse { 50% { transform: scale(1.22); color: #F59E0B; } }`}</style>
  </section>;
}
