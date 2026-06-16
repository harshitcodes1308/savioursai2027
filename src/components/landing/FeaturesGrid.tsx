"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";
import ShaderAnimation from "./ShaderAnimation";
import GooeyText from "./GooeyText";

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
        {/* Shader-backed header banner with gooey morphing title */}
        <div
          style={{
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid var(--bg-border)",
            background: "var(--bg-base)",
            padding: "clamp(48px, 8vw, 88px) 24px",
            marginBottom: 56,
            minHeight: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Three.js cyan shader */}
          <ShaderAnimation opacity={0.5} />
          {/* radial fade so the shader sits behind the text cleanly */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(13,13,26,0.6) 60%, var(--bg-base) 100%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            <div className="sa-eyebrow" style={{ marginBottom: 26, justifyContent: "center", display: "inline-flex" }}>
              The toolkit
            </div>

            {/* Gooey morphing headline */}
            <GooeyText
              texts={["Nine Tools", "One Platform", "Zero Fluff", "Built to Win"]}
              morphTime={1}
              cooldownTime={1.6}
              style={{ height: "clamp(56px, 11vw, 110px)", marginBottom: 22, width: "100%" }}
              textStyle={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(40px, 8vw, 92px)",
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-tagline)",
                fontStyle: "italic",
                fontSize: "clamp(16px, 2.6vw, 24px)",
                color: "var(--text-secondary)",
                margin: 0,
                maxWidth: 600,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.45,
              }}
            >
              Every great board result starts with one decision.
            </p>
          </div>
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
