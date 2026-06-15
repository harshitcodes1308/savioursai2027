"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./useScrollReveal";

interface Stat {
  value: number;
  display: (n: number) => string;
  label: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { value: 3064, display: (n) => Math.round(n).toLocaleString("en-IN"), label: "Total signups" },
  { value: 572, display: (n) => Math.round(n).toLocaleString("en-IN"), label: "Paid users" },
  { value: 56628, display: (n) => "₹" + Math.round(n).toLocaleString("en-IN"), label: "Revenue, under 2 months" },
  { value: 18.7, display: (n) => n.toFixed(1) + "%", label: "Free-to-paid conversion" },
];

export default function TractionStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (reduced) {
      STATS.forEach((s, i) => {
        const el = numRefs.current[i];
        if (el) el.textContent = s.display(s.value);
      });
      return;
    }

    const ctx = gsap.context(() => {
      STATS.forEach((s, i) => {
        const el = numRefs.current[i];
        if (!el) return;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: s.value,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => { el.textContent = s.display(counter.v); },
        });
      });
      // Cards rise in
      gsap.from(".sa-stat-card", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);

    // Bento border glow follows cursor
    const root = sectionRef.current;
    let onMove: ((e: MouseEvent) => void) | null = null;
    if (root && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      onMove = (e: MouseEvent) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>(".sa-bento");
        if (!card || !root.contains(card)) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      root.addEventListener("mousemove", onMove);
    }

    return () => {
      ctx.revert();
      if (root && onMove) root.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", zIndex: 1, padding: "clamp(80px, 12vw, 140px) 24px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div className="sa-eyebrow" style={{ marginBottom: 20 }}>The proof</div>
          <h2
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
            Real traction.
            <br />
            <span style={{ color: "var(--accent-gold)" }}>Zero paid ads.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-tagline)",
              fontStyle: "italic",
              fontSize: "clamp(16px, 2.4vw, 21px)",
              color: "var(--text-muted)",
              maxWidth: 620,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            We launched with one YouTube audience. This is what two months of organic growth looked like.
          </p>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 36,
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="sa-bento sa-stat-card"
              style={{ padding: "34px 28px" }}
            >
              <div
                ref={(el) => { numRefs.current[i] = el; }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(38px, 5vw, 56px)",
                  color: "var(--accent-gold)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                0
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  letterSpacing: "0.02em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison strip */}
        <div
          className="sa-bento"
          style={{
            padding: "22px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
            textAlign: "center",
          }}
        >
          <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Industry average free-to-paid sits at{" "}
            <span style={{ color: "var(--text-muted)", textDecoration: "line-through", opacity: 0.7 }}>
              2–5%
            </span>
            . We converted at{" "}
            <span className="chip-green" style={{ fontSize: 13, fontWeight: 700 }}>18.7%</span>
            {" "}— with <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>₹0</span> on ads.
          </span>
        </div>
      </div>
    </section>
  );
}
