"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";

interface Tool {
  glyph: string;
  name: string;
  desc: string;
  color: string;
  span: string;   // grid-column span
  tall?: boolean; // grid-row span 2
}

/* Bento layout: a 6-column grid on desktop. Cells vary in width/height to break
   the uniform-grid "template" feel. The hero tool (AI Doubt Solver) is the
   feature cell; others fill around it. */
const TOOLS: Tool[] = [
  { glyph: "◆", name: "AI Doubt Solver", desc: "Ask any ICSE question, get a clear, syllabus-accurate answer. Available 24/7, with image and PDF support for the problems you can't type out.", color: "#00D4FF", span: "span 4", tall: true },
  { glyph: "◎", name: "Smart Planner", desc: "Maps your remaining syllabus against your exam date and builds a real daily schedule, not just a list.", color: "#00D4FF", span: "span 2" },
  { glyph: "◉", name: "Focus Mode", desc: "A distraction-free Pomodoro environment with a session tracker, so you see how long you actually studied.", color: "#00D4FF", span: "span 2" },
  { glyph: "▣", name: "Competency Test", desc: "Timed PYQ-based tests from 2007 to 2025. Simulates real board exam pressure.", color: "#00D4FF", span: "span 3" },
  { glyph: "◫", name: "Customise Test", desc: "Build a test from specific chapters. Drill exactly where you're weak.", color: "#00D4FF", span: "span 3" },
  { glyph: "∑", name: "Numerical Mastery", desc: "Step-by-step Physics numericals with worked solutions and 50+ PYQs from the last 18 years.", color: "#F59E0B", span: "span 2" },
  { glyph: "◷", name: "ChronoScroll", desc: "A rapid-revision card stack for History & Civics: concepts, formulas, and key dates.", color: "#FB923C", span: "span 2" },
  { glyph: "⟲", name: "Flip the Question", desc: "Give it an answer. It reverse-engineers the question. Built for Computer Applications.", color: "#F97316", span: "span 2" },
  { glyph: "◍", name: "Monthly Mission", desc: "33 weeks of structured study broken into monthly goals, with coverage you can actually track.", color: "#00D4FF", span: "span 6" },
];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
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
      className="sa-bento sa-tool-card"
      data-cursor="hover"
      style={{
        gridColumn: tool.span,
        gridRow: tool.tall ? "span 2" : "span 1",
        padding: tool.tall ? "34px 32px" : "26px 26px",
        display: "flex",
        flexDirection: "column",
        justifyContent: tool.tall ? "space-between" : "flex-start",
        gap: tool.tall ? 0 : 14,
        minHeight: tool.tall ? 320 : 168,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            width: tool.tall ? 52 : 44,
            height: tool.tall ? 52 : 44,
            borderRadius: 13,
            background: `${tool.color}14`,
            border: `1px solid ${tool.color}38`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: tool.tall ? 25 : 21,
            color: tool.color,
            flexShrink: 0,
          }}
        >
          {tool.glyph}
        </div>
        {!tool.tall && (
          <>
            <h3 style={headingStyle(false)}>{tool.name}</h3>
            <p style={descStyle}>{tool.desc}</p>
          </>
        )}
      </div>

      {tool.tall && (
        <div>
          <span className="sa-eyebrow" style={{ marginBottom: 14 }}>The core</span>
          <h3 style={headingStyle(true)}>{tool.name}</h3>
          <p style={{ ...descStyle, fontSize: 15, maxWidth: 420, marginTop: 12 }}>{tool.desc}</p>
        </div>
      )}

      <span
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-muted)",
          opacity: 0.35,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

const headingStyle = (large: boolean): React.CSSProperties => ({
  fontFamily: "var(--font-display)",
  fontSize: large ? 28 : 18,
  color: "var(--text-primary)",
  margin: 0,
  letterSpacing: "-0.02em",
  fontWeight: 600,
  lineHeight: 1.1,
});

const descStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 13.5,
  color: "var(--text-secondary)",
  lineHeight: 1.6,
  margin: 0,
};

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
        scrollTrigger: { trigger: root.querySelector(".sa-bento-grid"), start: "top 82%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" style={{ position: "relative", zIndex: 1, padding: "clamp(80px, 12vw, 140px) 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div className="sa-eyebrow" style={{ marginBottom: 20 }}>The toolkit</div>
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
            Every tool a student needs.
            <br />
            <span style={{ color: "var(--accent-gold)" }}>Nothing extra.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: "clamp(16px, 2.4vw, 21px)", color: "var(--text-muted)", margin: 0 }}>
            One platform, built end to end for the ICSE Class 10 syllabus.
          </p>
        </div>

        <div
          className="sa-bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridAutoRows: "minmax(150px, auto)",
            gap: 16,
          }}
        >
          {TOOLS.map((t, i) => (
            <ToolCard key={t.name} tool={t} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sa-bento-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sa-bento-grid > * { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 170px !important; }
        }
        @media (max-width: 540px) {
          .sa-bento-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
