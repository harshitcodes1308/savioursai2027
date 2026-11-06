"use client";

import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";

function BrandMark({ size = 24 }: { size?: number }) { return <img src="/brand/logo-mark.svg" width={size} height={size} alt="" aria-hidden="true" style={{ display: "block", objectFit: "contain" }} />; }

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: scrolled ? "12px 24px" : "22px 24px",
          transition: "padding 0.3s ease",
        }}
      >
        {/* Wordmark */}
        <a
          href="#top"
          style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}
        >
          <BrandMark size={26} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              letterSpacing: "0.26em",
              color: "var(--text-primary)",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Saviours
          </span>
        </a>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <a
            href="/login"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--text-secondary)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
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
            strength={0.25}
            ariaLabel="Start free"
          >
            Start Free
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
}
