"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";
import MagneticButton from "./MagneticButton";

const LINE1 = ["Your", "AI", "academic"];
const LINE2 = ["operating", "system"];

const META = [
  { label: "Built for", value: "ICSE Class X" },
  { label: "Target", value: "2027 Boards" },
  { label: "Tools", value: "Nine, end to end" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const diamondRef = useRef<SVGSVGElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];

    if (reduced) {
      [...words, eyebrowRef.current, subRef.current, metaRef.current, ctaRef.current].forEach((el) => {
        if (el) { el.style.opacity = "1"; el.style.transform = "none"; }
      });
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

      const tl = gsap.timeline({ delay: 0.35 });
      tl.from(eyebrowRef.current, { opacity: 0, y: 14, duration: 0.6, ease: "power3.out" })
        .from(words, {
          opacity: 0,
          y: 64,
          duration: 0.95,
          ease: "power4.out",
          stagger: 0.06,
        }, "-=0.2")
        .from(subRef.current, { opacity: 0, y: 22, duration: 0.8, ease: "power3.out" }, "-=0.45")
        .from(metaRef.current, { opacity: 0, y: 22, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(ctaRef.current, { opacity: 0, y: 22, duration: 0.7, ease: "power3.out" }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderWord = (word: string, key: number, accent = false) => (
    <span
      key={key}
      ref={(el) => { wordsRef.current[key] = el; }}
      style={{
        display: "inline-block",
        marginRight: "0.22em",
        color: accent ? "var(--accent-gold)" : "var(--text-primary)",
      }}
    >
      {word}
    </span>
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px 24px 80px",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Eyebrow row */}
      <div
        ref={eyebrowRef}
        style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}
      >
        <svg
          ref={diamondRef}
          width="30"
          height="30"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
          <path d="M4 18L24 32L44 18" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.6" />
        </svg>
        <span className="sa-eyebrow">Saviours AI · ICSE Prep, Reimagined</span>
      </div>

      {/* Headline — big, left-aligned, editorial */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(44px, 9vw, 116px)",
          lineHeight: 0.98,
          letterSpacing: "-0.04em",
          fontWeight: 700,
          margin: "0 0 28px",
          maxWidth: 1000,
        }}
      >
        <span style={{ display: "block" }}>
          {LINE1.map((w, i) => renderWord(w, i, w === "AI"))}
        </span>
        <span style={{ display: "block" }}>
          {LINE2.map((w, i) => renderWord(w, i + LINE1.length, w === "system"))}
          <span
            ref={(el) => { wordsRef.current[LINE1.length + LINE2.length] = el; }}
            style={{ display: "inline-block", color: "var(--accent-gold)" }}
          >
            .
          </span>
        </span>
      </h1>

      {/* Sub line — ScotchDisplay italic, the emotional line */}
      <div
        ref={subRef}
        style={{
          fontFamily: "var(--font-tagline)",
          fontStyle: "italic",
          fontSize: "clamp(18px, 2.6vw, 28px)",
          color: "var(--text-secondary)",
          maxWidth: 560,
          lineHeight: 1.4,
          marginBottom: 48,
        }}
      >
        Every great board result starts with one decision.
      </div>

      {/* Bottom row: metadata grid (left) + CTAs (right) */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        {/* Metadata, label/value pairs — the editorial signature */}
        <div
          ref={metaRef}
          style={{
            display: "flex",
            gap: "clamp(24px, 5vw, 56px)",
            flexWrap: "wrap",
          }}
        >
          {META.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {m.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <MagneticButton
            href="/signup"
            className="btn-gold"
            style={{
              fontSize: 15,
              padding: "15px 30px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
            ariaLabel="Start free"
          >
            Start Free →
          </MagneticButton>
          <MagneticButton
            href="#features"
            className="btn-ghost"
            style={{
              fontSize: 15,
              padding: "15px 26px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
            strength={0.2}
            ariaLabel="See features"
          >
            See what&apos;s inside ↓
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
