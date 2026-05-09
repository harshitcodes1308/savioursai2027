"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { STUDY_FLOW_DATA, SUBJECT_META } from "@/data/studyFlowData";
import type { SubjectKey } from "@/data/studyFlowData";

const PROGRESS_KEY = "study-flow-progress";

function getProgress(): Record<string, { step: number; completed: boolean }> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

export default function StudyFlowChaptersPage() {
  const router = useRouter();
  const params = useParams();
  const { isMobile, isTablet } = useResponsive();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const subject = params.subject as SubjectKey;
  const meta = SUBJECT_META[subject];
  const subjectData = STUDY_FLOW_DATA[subject];

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

  if (!meta || !subjectData) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-base)", flexDirection: "column", gap: 16,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)" }}>
          Subject not found
        </div>
        <button
          onClick={() => router.push("/dashboard/study-flow")}
          style={{
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
            color: "var(--accent-gold)", background: "var(--accent-gold-glow)",
            border: "1px solid var(--accent-gold-border)", borderRadius: 10,
            padding: "10px 24px", cursor: "pointer",
          }}
        >← Back to subjects</button>
      </div>
    );
  }

  const progress = getProgress();
  const chapters = subjectData.chapters;

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-base)",
      padding: isMobile ? "20px 16px 100px" : isTablet ? "32px 28px" : "44px 48px",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes sfFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sfPulseGlow { 0%,100% { box-shadow: 0 0 0 rgba(0,212,255,0); } 50% { box-shadow: 0 0 12px rgba(0,212,255,0.15); } }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Back button + Header */}
        <div style={{ marginBottom: isMobile ? 20 : 32, animation: "sfFadeIn 0.4s ease-out both" }}>
          <button
            onClick={() => router.push("/dashboard/study-flow")}
            style={{
              fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
              color: "var(--text-muted)", background: "none", border: "none",
              cursor: "pointer", padding: 0, marginBottom: 14,
              display: "flex", alignItems: "center", gap: 6,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent-gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            ← Back to subjects
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              fontSize: isMobile ? 32 : 40, lineHeight: 1,
              filter: "drop-shadow(0 0 12px " + meta.color + "30)",
            }}>{meta.icon}</div>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)", fontSize: isMobile ? 24 : 34,
                color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
              }}>{meta.label}</h1>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginTop: 4,
              }}>{chapters.length} chapter{chapters.length !== 1 ? "s" : ""} · Study Flow</div>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 8 : 10 }}>
          {chapters.map((ch, i) => {
            const key = `${subject}:${ch.id}`;
            const p = progress[key];
            const isCompleted = p?.completed;
            const isInProgress = p && !p.completed;
            const isHovered = hovered === ch.id;

            const statusColor = isCompleted ? "var(--accent-gold)" : isInProgress ? meta.color : "var(--text-disabled)";
            const statusLabel = isCompleted ? "Completed" : isInProgress ? `Step ${p.step} of 3` : "Not started";
            const statusIcon = isCompleted ? "✓" : isInProgress ? "◐" : "○";

            return (
              <div
                key={ch.id}
                onClick={() => router.push(`/dashboard/study-flow/${subject}/${ch.id}`)}
                onMouseEnter={() => setHovered(ch.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered
                    ? "linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))"
                    : "var(--bg-surface)",
                  border: `1.5px solid ${isCompleted ? "var(--accent-gold-border)" : isHovered ? meta.color + "40" : "var(--bg-border)"}`,
                  borderRadius: 14,
                  padding: isMobile ? "16px" : "18px 22px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  animation: `sfFadeIn 0.4s ease-out ${100 + i * 60}ms both`,
                  display: "flex", alignItems: "center", gap: isMobile ? 12 : 16,
                  transform: isHovered ? "translateX(4px)" : "none",
                  ...(isInProgress ? { animation: `sfFadeIn 0.4s ease-out ${100 + i * 60}ms both, sfPulseGlow 3s ease-in-out infinite` } : {}),
                }}
              >
                {/* Chapter number */}
                <div style={{
                  width: isMobile ? 36 : 42, height: isMobile ? 36 : 42,
                  borderRadius: 10, flexShrink: 0,
                  background: isCompleted ? "var(--accent-gold-glow)" : "var(--bg-elevated)",
                  border: `1.5px solid ${isCompleted ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: isCompleted ? 16 : 14,
                  fontWeight: 700, color: statusColor,
                  transition: "all 0.25s ease",
                }}>
                  {isCompleted ? "✓" : i + 1}
                </div>

                {/* Chapter info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: isMobile ? 14 : 16,
                    color: "var(--text-primary)", letterSpacing: "-0.01em",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{ch.title}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)",
                    marginTop: 3, display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ color: statusColor, fontWeight: 600 }}>{statusIcon}</span>
                    {statusLabel}
                    {isInProgress && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: meta.color,
                        background: meta.color + "15", border: `1px solid ${meta.color}30`,
                        borderRadius: 100, padding: "1px 8px", letterSpacing: "0.05em",
                      }}>IN PROGRESS</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 16, color: "var(--text-disabled)",
                  opacity: isHovered ? 1 : 0.4, transition: "opacity 0.2s ease",
                  flexShrink: 0,
                }}>→</div>
              </div>
            );
          })}
        </div>

        {chapters.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            animation: "sfFadeIn 0.4s ease-out both",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>📚</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)",
              marginBottom: 8,
            }}>Chapters coming soon</div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)",
            }}>Content for {meta.label} is being prepared. Check back soon!</div>
          </div>
        )}
      </div>
    </div>
  );
}
