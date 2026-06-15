"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";
import MagneticButton from "./MagneticButton";
import PixelCanvas from "./PixelCanvas";

const META = [
  { label: "Built for", value: "ICSE Class X" },
  { label: "Target", value: "2027 Boards" },
  { label: "Tools", value: "Nine, end to end" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const diamondRef = useRef<SVGSVGElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const targets = [eyebrowRef.current, headlineRef.current, subRef.current, metaRef.current, ctaRef.current];

    if (reduced) {
      targets.forEach((el) => { if (el) { el.style.opacity = "1"; el.style.transform = "none"; } });
      return;
    }

    const ctx = gsap.context(() => {
      const paths = diamondRef.current?.querySelectorAll("path");
      if (paths) {
        paths.forEach((p) => {
          const len = (p as SVGPathElement).getTotalLength?.() ?? 200;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        });
        gsap.to(paths, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.18 });
      }

      gsap.timeline({ delay: 0.3 })
        .from(eyebrowRef.current, { opacity: 0, y: 14, duration: 0.6, ease: "power3.out" })
        .from(headlineRef.current, { opacity: 0, y: 40, scale: 0.96, duration: 1.1, ease: "power4.out" }, "-=0.2")
        .from(subRef.current, { opacity: 0, y: 22, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .from(metaRef.current, { opacity: 0, y: 22, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(ctaRef.current, { opacity: 0, y: 22, duration: 0.7, ease: "power3.out" }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 24px 72px",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Pixel ripple canvas backdrop */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <PixelCanvas
          baseColor="rgba(120, 120, 145, 0.45)"
          accentColor="#00D4FF"
          accentRatio={0.13}
          gap={6}
          speed={30}
        />
        {/* radial fade into the page background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, transparent 0%, var(--bg-base) 78%)",
            opacity: 0.85,
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, width: "100%" }}>
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 32 }}
        >
          <svg ref={diamondRef} width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
            <path d="M4 18L24 32L44 18" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.6" />
          </svg>
          <span className="sa-eyebrow">Saviours AI · ICSE Prep, Reimagined</span>
        </div>

        {/* Glass-shimmer headline: ScotchDisplay italic + display sans */}
        <h1
          ref={headlineRef}
          className="sa-glass-text"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.18em",
            margin: "0 0 26px",
            fontSize: "clamp(46px, 11vw, 132px)",
            lineHeight: 0.95,
          }}
        >
          <span style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontWeight: 500 }}>
            Preparation,
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.04em" }}>
            Perfected.
          </span>
        </h1>

        {/* Sub line */}
        <div
          ref={subRef}
          style={{
            fontFamily: "var(--font-tagline)",
            fontStyle: "italic",
            fontSize: "clamp(17px, 2.6vw, 26px)",
            color: "var(--text-secondary)",
            maxWidth: 580,
            margin: "0 auto 44px",
            lineHeight: 1.45,
          }}
        >
          Nine AI tools, built end to end for the ICSE Class 10 syllabus. Every great board result starts with one decision.
        </div>

        {/* Metadata row */}
        <div
          ref={metaRef}
          style={{
            display: "flex",
            gap: "clamp(24px, 5vw, 56px)",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          {META.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                {m.label}
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text-primary)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <MagneticButton
            href="/signup"
            className="btn-gold"
            style={{ fontSize: 15, padding: "15px 32px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            ariaLabel="Start free"
          >
            Start Free →
          </MagneticButton>
          <MagneticButton
            href="#features"
            className="btn-ghost"
            style={{ fontSize: 15, padding: "15px 26px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            strength={0.2}
            ariaLabel="See features"
          >
            See what&apos;s inside ↓
          </MagneticButton>
        </div>
      </div>

      {/* scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          width: 1,
          height: 34,
          background: "linear-gradient(to bottom, transparent, var(--accent-gold))",
          animation: "float 2s ease-in-out infinite",
        }}
      />
    </section>
  );
}
