"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
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

function PriceCard({
  plan,
  index,
  progress,
  fan,
}: {
  plan: Plan;
  index: number;
  progress: MotionValue<number>;
  fan: boolean;
}) {
  const isLeft = index === 0;
  const isRight = index === 2;
  const isCenter = index === 1;

  // Scroll-linked 3D fan: flat row at progress 0 → fanned at progress 1.
  // Reverses automatically when scrolling back up because it's tied to scroll.
  const x = useTransform(progress, [0, 1], [0, isLeft ? 28 : isRight ? -28 : 0]);
  const y = useTransform(progress, [0, 1], [44, isCenter ? -24 : 0]);
  const scale = useTransform(progress, [0, 1], [0.95, isCenter ? 1.05 : 0.93]);
  const rotateY = useTransform(progress, [0, 1], [0, isLeft ? 11 : isRight ? -11 : 0]);
  const opacity = useTransform(progress, [0, 0.35], [0, 1]);

  const motionStyle = fan
    ? { x, y, scale, rotateY, opacity, transformOrigin: isLeft ? "right center" : isRight ? "left center" : "center", zIndex: isCenter ? 2 : 1 }
    : { opacity };

  return (
    <motion.div
      style={{
        ...motionStyle,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-surface)",
        border: plan.popular ? "1.5px solid var(--accent-gold-border)" : "1px solid var(--bg-border)",
        boxShadow: plan.popular ? "0 0 48px rgba(0,212,255,0.12)" : "0 12px 40px rgba(0,0,0,0.3)",
        willChange: "transform",
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
    </motion.div>
  );
}

export default function Pricing() {
  const ref = useScrollReveal<HTMLElement>(".sa-reveal", { y: 36, stagger: 0.1 });
  const gridRef = useRef<HTMLDivElement>(null);
  const [fan, setFan] = useState(false);

  useEffect(() => {
    const check = () =>
      setFan(
        window.matchMedia("(min-width: 820px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "center center"],
  });
  // spring-smoothed so the fan glides instead of snapping with the scroll
  const progress = useSpring(scrollYProgress, { stiffness: 64, damping: 22, mass: 0.5 });

  return (
    <section ref={ref} style={{ padding: "clamp(80px, 12vw, 140px) 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div className="sa-eyebrow sa-reveal" style={{ marginBottom: 20 }}>The plans</div>
          <h2
            className="sa-grad-text sa-reveal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 6vw, 64px)",
              letterSpacing: "-0.035em",
              margin: "0 0 14px",
              lineHeight: 1.02,
              fontWeight: 800,
            }}
          >
            Proven. Affordable.
          </h2>
          <p className="sa-reveal" style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: "clamp(16px, 2.4vw, 21px)", color: "var(--text-muted)", margin: 0 }}>
            Start free. Upgrade when you&apos;re ready to go all in.
          </p>
        </div>

        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 18,
            alignItems: "stretch",
            perspective: 1200,
          }}
        >
          {PLANS.map((plan, i) => (
            <PriceCard key={plan.name} plan={plan} index={i} progress={progress} fan={fan} />
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 40, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", opacity: 0.6 }}>
          Secure payment via Razorpay. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
