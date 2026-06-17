"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";

/** A faithful, design-system-accurate dashboard mockup rendered in a browser frame.
 *  Parallaxes and tilts subtly in 3D as it scrolls through the viewport. */
export default function ProductPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Enter: rise + untilt
      gsap.fromTo(
        frameRef.current,
        { opacity: 0, y: 60, rotateX: 12 },
        {
          opacity: 1,
          y: 0,
          rotateX: 6,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
      // Scrub: gentle parallax drift + tilt resolve
      gsap.to(frameRef.current, {
        rotateX: 0,
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const card = (title: string, glyph: string, accent: string) => (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--bg-border)",
        borderRadius: 10,
        padding: "14px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: accent,
        }}
      >
        {glyph}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "var(--bg-border)", width: "80%" }} />
      <div style={{ height: 5, borderRadius: 3, background: "var(--bg-border)", width: "55%" }} />
    </div>
  );

  return (
    <section ref={sectionRef} style={{ padding: "clamp(60px, 10vw, 120px) 24px", position: "relative", zIndex: 1, perspective: 1400 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ marginBottom: 48, maxWidth: 720 }}>
          <div className="sa-eyebrow" style={{ marginBottom: 20 }}>The product</div>
          <h2
            className="sa-grad-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 6vw, 64px)",
              letterSpacing: "-0.035em",
              margin: "0 0 14px",
              lineHeight: 1.02,
              fontWeight: 800,
            }}
          >
            See it in action.
          </h2>
          <p style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: "clamp(16px, 2.4vw, 21px)", color: "var(--text-muted)", margin: 0 }}>
            This is the real dashboard. No mockups, no &quot;coming soon.&quot;
          </p>
        </div>

        <div ref={frameRef} className="sa-browser-frame" style={{ transformStyle: "preserve-3d" }}>
          {/* chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 16px",
              borderBottom: "1px solid var(--bg-border)",
              background: "var(--bg-base)",
            }}
          >
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FB5C53" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FDBC40" }} />
            <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#34C749" }} />
            <div
              style={{
                marginLeft: 14,
                flex: 1,
                maxWidth: 320,
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 7,
                padding: "5px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              saviours.pro/dashboard
            </div>
          </div>

          {/* body */}
          <div style={{ display: "flex", minHeight: 360, background: "var(--bg-base)" }}>
            {/* sidebar */}
            <div
              className="sa-pp-sidebar"
              style={{
                width: 168,
                borderRight: "1px solid var(--bg-border)",
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingLeft: 4 }}>
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
                </svg>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.14em", color: "var(--text-primary)" }}>
                  SAVIOURS
                </span>
              </div>
              {["Dashboard", "AI Doubt Solver", "Smart Planner", "Competency Test", "Focus Mode", "ChronoScroll"].map((item, i) => (
                <div
                  key={item}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: i === 0 ? "var(--accent-gold)" : "var(--text-muted)",
                    background: i === 0 ? "var(--accent-gold-glow)" : "transparent",
                    borderLeft: i === 0 ? "2px solid var(--accent-gold)" : "2px solid transparent",
                    padding: "7px 8px",
                    borderRadius: 6,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* main */}
            <div style={{ flex: 1, padding: "20px 22px" }}>
              <div style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
                Burning the midnight oil
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 18, fontWeight: 700 }}>
                Good evening, Aarav
              </div>

              {/* stats strip */}
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                {[["Streak", "12 days"], ["Plans done", "47"], ["Focus hrs", "31.5"]].map(([l, v]) => (
                  <div key={l} style={{ flex: 1, background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 9, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--accent-gold)", fontWeight: 700 }}>{v}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* tool cards */}
              <div className="sa-pp-tools" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {card("AI Doubt Solver", "◆", "#00D4FF")}
                {card("Smart Planner", "◎", "#00D4FF")}
                {card("Competency Test", "▣", "#00D4FF")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .sa-pp-sidebar { display: none !important; }
          .sa-pp-tools { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
