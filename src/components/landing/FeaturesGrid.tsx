"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";
import ShaderAnimation from "./ShaderAnimation";

interface Tool {
  glyph: string;
  name: string;
  desc: string;
  meta: string;
  status: string;
  tags: string[];
  color: string;
  span: number; // 1 or 2 columns
}

const TOOLS: Tool[] = [
  { glyph: "◆", name: "AI Doubt Solver", meta: "24/7", status: "Core", desc: "Ask any ICSE question, get a clear, syllabus-accurate answer. Image and PDF support for problems you can't type out.", tags: ["AI", "Image", "PDF"], color: "#00D4FF", span: 2 },
  { glyph: "◎", name: "Smart Planner", meta: "Daily", status: "Free", desc: "Maps your remaining syllabus against your exam date and builds a real daily schedule, not just a list.", tags: ["Planning"], color: "#00D4FF", span: 1 },
  { glyph: "◉", name: "Focus Mode", meta: "Pomodoro", status: "Paid", desc: "A distraction-free environment with a session tracker, so you see how long you actually studied.", tags: ["Focus"], color: "#00D4FF", span: 1 },
  { glyph: "▣", name: "Competency Test", meta: "2007–2025", status: "Paid", desc: "Timed PYQ-based tests that simulate real board exam pressure.", tags: ["PYQ", "Timed"], color: "#00D4FF", span: 2 },
  { glyph: "∑", name: "Numerical Mastery", meta: "50+ PYQs", status: "Paid", desc: "Step-by-step Physics numericals with worked solutions from the last 18 years.", tags: ["Physics"], color: "#F59E0B", span: 1 },
  { glyph: "◷", name: "ChronoScroll", meta: "Rapid", status: "Paid", desc: "A revision card stack for History & Civics: concepts, formulas, key dates.", tags: ["History"], color: "#FB923C", span: 1 },
  { glyph: "⟲", name: "Flip the Question", meta: "Reverse", status: "Paid", desc: "Give it an answer. It reverse-engineers the question. Built for Computer Applications.", tags: ["CompApp"], color: "#F97316", span: 1 },
  { glyph: "◫", name: "Customise Test", meta: "Any chapter", status: "Paid", desc: "Build a test from specific chapters. Drill exactly where you're weak.", tags: ["Custom"], color: "#00D4FF", span: 1 },
  { glyph: "◍", name: "Monthly Mission", meta: "33 weeks", status: "Free", desc: "Structured study broken into monthly goals, with syllabus coverage you can track.", tags: ["Roadmap"], color: "#00D4FF", span: 2 },
];

function BentoCard({ tool, index }: { tool: Tool; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="sa-glass-bento sa-tool-card"
      data-cursor="hover"
      style={{
        gridColumn: `span ${tool.span}`,
        padding: "22px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 188,
      }}
    >
      <span className="sa-bento-dots" />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
        {/* top row: icon + status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: `${tool.color}16`,
              border: `1px solid ${tool.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 19,
              color: tool.color,
            }}
          >
            {tool.glyph}
          </div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: tool.status === "Free" ? "var(--status-green)" : tool.status === "Core" ? "var(--accent-gold)" : "var(--text-muted)",
              background: tool.status === "Free" ? "rgba(62,207,142,0.1)" : tool.status === "Core" ? "var(--accent-gold-glow)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${tool.status === "Free" ? "rgba(62,207,142,0.25)" : tool.status === "Core" ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
              padding: "3px 9px",
              borderRadius: 7,
            }}
          >
            {tool.status}
          </span>
        </div>

        {/* title + meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: tool.span === 2 ? 20 : 17,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.02em",
              fontWeight: 600,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {tool.name}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", fontWeight: 400, letterSpacing: 0 }}>
              {tool.meta}
            </span>
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            {tool.desc}
          </p>
        </div>

        {/* tags + cta (pinned bottom) */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tool.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--bg-border)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
          <a
            href="/login"
            className="sa-bento-cta"
            data-cursor="hover"
            aria-label={`Explore ${tool.name}`}
            style={{ fontFamily: "var(--font-body)", fontSize: 11, color: tool.color, whiteSpace: "nowrap", textDecoration: "none" }}
          >
            Explore →
          </a>
        </div>
      </div>

      {/* index marker */}
      <span
        style={{
          position: "absolute",
          top: 18,
          right: 56,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--text-muted)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function FeaturesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll<HTMLElement>(".sa-tool-card"), {
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.querySelector(".sa-bento-grid"), start: "top 84%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" style={{ position: "relative", zIndex: 1, overflow: "hidden", padding: "clamp(80px, 12vw, 140px) 24px" }}>
      {/* Shader runs behind the ENTIRE section (header + grid) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ShaderAnimation opacity={0.42} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 90% 70% at 50% 40%, rgba(13,13,26,0.35) 0%, rgba(13,13,26,0.78) 55%, var(--bg-base) 100%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        {/* Header — gradient glass text, no morph */}
        <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          <div className="sa-eyebrow" style={{ marginBottom: 22, justifyContent: "center", display: "inline-flex" }}>
            The toolkit
          </div>
          <h2
            className="sa-grad-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 7vw, 78px)",
              letterSpacing: "-0.04em",
              margin: "0 0 18px",
              lineHeight: 1.0,
              fontWeight: 800,
            }}
          >
            Every tool a student needs.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-tagline)",
              fontStyle: "italic",
              fontSize: "clamp(17px, 2.8vw, 26px)",
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Every great board result starts with one decision.
          </p>
        </div>

        {/* Glass bento grid — transparent so the shader bleeds through */}
        <div
          className="sa-bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {TOOLS.map((t, i) => (
            <BentoCard key={t.name} tool={t} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sa-bento-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .sa-bento-grid { grid-template-columns: 1fr !important; }
          .sa-bento-grid > * { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
}
