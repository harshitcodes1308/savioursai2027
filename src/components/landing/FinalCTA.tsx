"use client";

import { useScrollReveal } from "./useScrollReveal";
import MagneticButton from "./MagneticButton";

export default function FinalCTA() {
  const ref = useScrollReveal<HTMLElement>(".sa-reveal", { y: 24, stagger: 0.12 });

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(100px, 16vw, 180px) 24px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--bg-border)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="sa-orb" style={{ width: 560, height: 560, background: "var(--accent-gold-glow)", top: "50%", left: "50%", marginLeft: -280, marginTop: -280, animation: "saOrbDrift 18s ease-in-out infinite" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
        <p
          className="sa-reveal"
          style={{
            fontFamily: "var(--font-tagline)",
            fontStyle: "italic",
            fontSize: "clamp(24px, 5vw, 44px)",
            lineHeight: 1.25,
            color: "var(--text-primary)",
            margin: "0 0 36px",
            letterSpacing: "-0.01em",
          }}
        >
          Boards don&apos;t wait. Neither should your prep.
        </p>
        <div className="sa-reveal">
          <MagneticButton
            href="/signup"
            className="btn-gold"
            style={{
              fontSize: 16,
              padding: "17px 40px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
            strength={0.4}
            ariaLabel="Start free"
          >
            Start Free →
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
