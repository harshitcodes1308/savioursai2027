"use client";

import { useScrollReveal } from "./useScrollReveal";
import MagneticButton from "./MagneticButton";

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  href: string;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    href: "/signup",
    features: ["Dashboard", "Smart Planner", "Monthly Mission", "Video Lectures", "Study Flow", "Subjects", "Webinar"],
  },
  {
    name: "Monthly",
    price: "₹199",
    period: "/month",
    href: "/signup",
    features: ["Everything in Free", "AI Doubt Solver", "Competency Test", "Customise Test", "Flip the Question", "Focus Mode", "Numerical Mastery", "ChronoScroll", "Date Battle Arena"],
  },
  {
    name: "Yearly",
    price: "₹599",
    period: "/year",
    popular: true,
    href: "/signup",
    features: ["Everything in Monthly", "Priority support", "Best value for boards"],
  },
];

export default function Pricing() {
  const ref = useScrollReveal<HTMLElement>(".sa-reveal", { y: 36, stagger: 0.1 });

  return (
    <section ref={ref} style={{ padding: "clamp(80px, 12vw, 130px) 24px", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs as the "shader-like" background, cheaper and on-brand */}
      <div className="sa-orb" style={{ width: 500, height: 500, background: "rgba(0,212,255,0.1)", top: "-8%", left: "8%", animation: "saOrbDrift 20s ease-in-out infinite" }} />
      <div className="sa-orb" style={{ width: 440, height: 440, background: "rgba(139,92,246,0.08)", bottom: "-6%", right: "10%", animation: "saOrbDrift 24s ease-in-out infinite reverse" }} />

      <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2
            className="sa-reveal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 5.5vw, 56px)",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 12px",
              fontWeight: 700,
            }}
          >
            Proven. <span style={{ color: "var(--accent-gold)" }}>Affordable.</span>
          </h2>
          <p className="sa-reveal" style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: "clamp(15px, 2.2vw, 19px)", color: "var(--text-muted)", margin: 0 }}>
            Start free. Upgrade when you&apos;re ready to go all in.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="sa-card sa-reveal"
              style={{
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                border: plan.popular ? "1.5px solid var(--accent-gold-border)" : "1px solid var(--bg-border)",
                boxShadow: plan.popular ? "0 0 40px rgba(0,212,255,0.1)" : undefined,
                transform: plan.popular ? "translateY(-8px)" : undefined,
              }}
            >
              {plan.popular && (
                <span
                  className="chip-gold"
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Best value
                </span>
              )}

              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>
                {plan.name}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 22 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 46, color: "var(--text-primary)", fontWeight: 700, lineHeight: 1 }}>
                  {plan.price}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>{plan.period}</span>
              </div>

              <div style={{ borderTop: "1px solid var(--bg-border)", margin: "0 0 18px" }} />

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--accent-gold)", flexShrink: 0, marginTop: 1 }}>✦</span>
                    {f}
                  </li>
                ))}
              </ul>

              <MagneticButton
                href={plan.href}
                className={plan.popular ? "btn-gold" : "btn-ghost"}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: 14,
                  padding: "13px 24px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                ariaLabel={`Choose ${plan.name}`}
              >
                {plan.name === "Free" ? "Start Free" : `Get ${plan.name}`} →
              </MagneticButton>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 28, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", opacity: 0.6 }}>
          Secure payment via Razorpay. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
