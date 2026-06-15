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
    <section ref={ref} style={{ padding: "clamp(80px, 12vw, 140px) 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div className="sa-eyebrow sa-reveal" style={{ marginBottom: 20 }}>The plans</div>
          <h2
            className="sa-reveal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 6vw, 64px)",
              letterSpacing: "-0.035em",
              color: "var(--text-primary)",
              margin: "0 0 14px",
              lineHeight: 1.02,
              fontWeight: 700,
            }}
          >
            Proven. <span style={{ color: "var(--accent-gold)" }}>Affordable.</span>
          </h2>
          <p className="sa-reveal" style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: "clamp(16px, 2.4vw, 21px)", color: "var(--text-muted)", margin: 0 }}>
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
              className="sa-bento sa-reveal"
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const r = el.getBoundingClientRect();
                el.style.setProperty("--mx", `${e.clientX - r.left}px`);
                el.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
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
