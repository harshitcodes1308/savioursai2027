"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { STUDY_FLOW_DATA, SUBJECT_META, SUBJECT_KEYS, COMING_SOON_SUBJECTS } from "@/data/studyFlowData";
import type { SubjectKey } from "@/data/studyFlowData";

const PROGRESS_KEY = "study-flow-progress";

function getProgress(): Record<string, { step: number; completed: boolean }> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

function getSubjectCompletion(subject: SubjectKey) {
  const progress = getProgress();
  const chapters = STUDY_FLOW_DATA[subject].chapters;
  if (chapters.length === 0) return { completed: 0, total: 0, pct: 0 };
  const completed = chapters.filter(ch => progress[`${subject}:${ch.id}`]?.completed).length;
  return { completed, total: chapters.length, pct: Math.round((completed / chapters.length) * 100) };
}

export default function StudyFlowSubjectsPage() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)", flexDirection: "column", gap: 16,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid var(--bg-border)", borderTopColor: "var(--accent-gold)",
        animation: "spin360 0.7s linear infinite",
      }} />
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-base)",
      padding: isMobile ? "20px 16px 100px" : isTablet ? "32px 28px" : "44px 48px",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes sfFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sfPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes sfGlow { 0%,100% { box-shadow: 0 0 0 rgba(0,212,255,0); } 50% { box-shadow: 0 0 20px rgba(0,212,255,0.1); } }
      `}</style>

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? 24 : 36, animation: "sfFadeIn 0.4s ease-out both" }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--accent-gold)", marginBottom: 8, opacity: 0.7,
          }}>Study Flow</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: isMobile ? 28 : 42,
            color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
          }}>Choose your subject</h1>
          <div style={{
            fontFamily: "var(--font-tagline)", fontSize: isMobile ? 13 : 15,
            fontStyle: "italic", color: "rgba(180,175,200,0.7)", marginTop: 10,
            textShadow: "0 0 16px rgba(0,212,255,0.1)",
          }}>Watch. Revise. Practice. Repeat until mastery.</div>
        </div>

        {/* Subject Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? 10 : 16,
        }}>
          {SUBJECT_KEYS.map((key, i) => {
            const meta = SUBJECT_META[key];
            const { completed, total, pct } = getSubjectCompletion(key);
            const isHovered = hovered === key;

            return (
              <div
                key={key}
                onClick={() => router.push(`/dashboard/study-flow/${key}`)}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered
                    ? "linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))"
                    : "var(--bg-surface)",
                  border: `1.5px solid ${isHovered ? meta.color + "50" : "var(--bg-border)"}`,
                  borderRadius: 18, padding: isMobile ? "20px 16px" : "28px 24px",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  animation: `sfFadeIn 0.5s ease-out ${150 + i * 80}ms both`,
                  position: "relative", overflow: "hidden",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? `0 12px 40px -8px ${meta.color}15` : "none",
                }}
              >
                {/* Glow orb */}
                <div style={{
                  position: "absolute", top: -20, right: -20,
                  width: 80, height: 80, borderRadius: "50%",
                  background: meta.color, opacity: isHovered ? 0.1 : 0.04,
                  filter: "blur(24px)", transition: "opacity 0.3s ease",
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Icon */}
                  <div style={{
                    fontSize: isMobile ? 28 : 36, marginBottom: isMobile ? 10 : 16, lineHeight: 1,
                  }}>{meta.icon}</div>

                  {/* Subject name */}
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: isMobile ? 16 : 19,
                    color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 6,
                  }}>{meta.label}</div>

                  {/* Chapter count */}
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: isMobile ? 11 : 12,
                    color: "var(--text-muted)", marginBottom: 14,
                  }}>
                    {total} chapter{total !== 1 ? "s" : ""}
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 3, borderRadius: 2, background: "var(--bg-elevated)",
                    overflow: "hidden", marginBottom: 6,
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 2, width: `${pct}%`,
                      background: `linear-gradient(90deg, ${meta.color}, ${meta.color}CC)`,
                      transition: "width 0.6s ease",
                    }} />
                  </div>

                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 10, color: meta.color,
                    fontWeight: 600,
                  }}>
                    {completed === 0 ? "Not started" : pct === 100 ? "✓ Complete" : `${completed}/${total} done`}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: isHovered ? 2 : 0, background: meta.color,
                  transition: "height 0.3s ease",
                }} />
              </div>
            );
          })}

          {/* Coming Soon subjects */}
          {COMING_SOON_SUBJECTS.map((key, i) => {
            const meta = SUBJECT_META[key];
            return (
              <div
                key={key}
                style={{
                  background: "var(--bg-surface)",
                  border: "1.5px solid var(--bg-border)",
                  borderRadius: 18, padding: isMobile ? "20px 16px" : "28px 24px",
                  cursor: "not-allowed", position: "relative", overflow: "hidden",
                  opacity: 0.5, filter: "grayscale(0.6)",
                  animation: `sfFadeIn 0.5s ease-out ${150 + (SUBJECT_KEYS.length + i) * 80}ms both`,
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: isMobile ? 28 : 36, marginBottom: isMobile ? 10 : 16, lineHeight: 1 }}>{meta.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: isMobile ? 16 : 19,
                    color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 6,
                  }}>{meta.label}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: isMobile ? 11 : 12,
                    color: "var(--text-muted)", marginBottom: 14,
                  }}>— chapters</div>
                </div>
                <div style={{
                  position: "absolute", top: isMobile ? 12 : 16, right: isMobile ? 12 : 16,
                  fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--status-orange)", background: "rgba(251,146,60,0.1)",
                  border: "1px solid rgba(251,146,60,0.25)",
                  borderRadius: 100, padding: "3px 10px",
                }}>Coming Soon</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
