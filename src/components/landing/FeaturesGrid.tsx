"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./useScrollReveal";

interface Tool {
  glyph: string;
  name: string;
  desc: string;
  color: string;
}

const TOOLS: Tool[] = [
  { glyph: "◆", name: "AI Doubt Solver", desc: "Ask any ICSE question, get a clear, syllabus-accurate answer. Available 24/7.", color: "#00D4FF" },
  { glyph: "◎", name: "Smart Planner", desc: "Maps your remaining syllabus against your exam date and builds a real daily schedule, not just a list.", color: "#00D4FF" },
  { glyph: "▣", name: "Competency Test", desc: "Timed PYQ-based tests from 2007 to 2025. Simulates real board exam pressure.", color: "#00D4FF" },
  { glyph: "◫", name: "Customise Test", desc: "Build a test from specific chapters. Drill exactly where you're weak.", color: "#00D4FF" },
  { glyph: "⟲", name: "Flip the Question", desc: "Give it an answer. It reverse-engineers the question. Built for ICSE Computer Applications students.", color: "#F97316" },
  { glyph: "◉", name: "Focus Mode", desc: "A distraction-free Pomodoro environment with a session tracker, so you see how long you actually studied.", color: "#00D4FF" },
  { glyph: "∑", name: "Numerical Mastery", desc: "Step-by-step Physics numericals with worked solutions and 50+ PYQs from the last 18 years, the section most students lose marks on.", color: "#F59E0B" },
  { glyph: "◷", name: "ChronoScroll", desc: "A rapid-revision card stack for History & Civics: concepts, formulas, and key dates, built for the final days.", color: "#FB923C" },
  { glyph: "◍", name: "Monthly Mission", desc: "33 weeks of structured study broken into monthly goals, with syllabus coverage you can actually track.", color: "#00D4FF" },
];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <div
      className="sa-card sa-tool-card"
      data-cursor="hover"
      style={{
        padding: "30px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
        minHeight: 200,
      }}
    >
      {/* index marker */}
      <span
        style={{
          position: "absolute",
          top: 18,
          right: 22,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-muted)",
          opacity: 0.4,
        }}
      >
        0{index + 1}
      </span>

      {/* glyph */}
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: `${tool.color}14`,
          border: `1px solid ${tool.color}38`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: tool.color,
          flexShrink: 0,
        }}
      >
        {tool.glyph}
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 19,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "-0.01em",
          fontWeight: 600,
        }}
      >
        {tool.name}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13.5,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {tool.desc}
      </p>
    </div>
  );
}

export default function FeaturesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".sa-tool-card"));
      cards.forEach((card, i) => {
        const fromX = i % 3 === 0 ? -36 : i % 3 === 2 ? 36 : 0;
        gsap.from(card, {
          opacity: 0,
          y: 40,
          x: fromX,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{ position: "relative", padding: "clamp(80px, 12vw, 130px) 24px" }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, maxWidth: 680 }}>
          <span className="chip-gold" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18, display: "inline-flex" }}>
            Nine tools
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 5.5vw, 56px)",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 14px",
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            Every tool a student needs. <span style={{ color: "var(--accent-gold)" }}>Nothing extra.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: "clamp(15px, 2.2vw, 19px)", color: "var(--text-muted)", margin: 0 }}>
            One platform. Built end to end for the ICSE Class 10 syllabus.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: 18,
          }}
        >
          {TOOLS.map((t, i) => (
            <ToolCard key={t.name} tool={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
