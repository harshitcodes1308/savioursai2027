"use client";

import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";

function DiamondMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
      <path d="M24 4L44 18L24 32L4 18L24 4Z" fill="rgba(0,212,255,0.12)" />
      <path d="M4 18L24 32L44 18" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sa-nav ${scrolled ? "scrolled" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scrolled ? "12px 24px" : "20px 24px",
      }}
    >
      <a
        href="#top"
        style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
      >
        <DiamondMark />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            letterSpacing: "0.22em",
            color: "var(--text-primary)",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Saviours AI
        </span>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <a
          href="/login"
          className="btn-ghost"
          style={{
            fontSize: 13,
            padding: "9px 18px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Sign In
        </a>
        <MagneticButton
          href="/signup"
          className="btn-gold"
          style={{
            fontSize: 13,
            padding: "9px 20px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
          ariaLabel="Start free"
        >
          Start Free
        </MagneticButton>
      </div>
    </nav>
  );
}
