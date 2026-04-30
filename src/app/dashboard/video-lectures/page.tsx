"use client";

import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { VIDEO_LECTURES } from "@/data/video-lectures";

export default function VideoLecturesPage() {
  const { isMobile } = useResponsive();
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subject = VIDEO_LECTURES[activeSubjectIdx];
  const chapter = subject.chapters[activeChapterIdx] ?? null;

  const handleSubjectChange = (idx: number) => {
    setActiveSubjectIdx(idx);
    setActiveChapterIdx(0);
  };

  const embedSrc = chapter
    ? `https://www.youtube.com/embed/${chapter.videoId}?rel=0&modestbranding=1`
    : "";

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes vlFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .vl-chapter-item:hover { background: var(--bg-elevated) !important; }
      `}</style>

      {/* ── TOP HEADER ── */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--bg-border)",
        padding: isMobile ? "16px 16px 0" : "20px 32px 0",
        flexShrink: 0,
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: isMobile ? 20 : 26,
              color: "var(--text-primary)", letterSpacing: "-0.02em", margin: 0, marginBottom: 2,
            }}>
              Video Lectures
            </h1>
            <div style={{ fontFamily: "var(--font-tagline)", fontSize: 12, fontStyle: "italic", color: "var(--text-muted)" }}>
              Subject-wise ICSE Class 10 · Free for all students
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
            color: "var(--accent-gold)", background: "var(--accent-gold-glow)",
            border: "1px solid var(--accent-gold-border)",
            padding: "3px 12px", borderRadius: 100, letterSpacing: "0.04em",
          }}>
            {VIDEO_LECTURES.reduce((s, sub) => s + sub.chapters.length, 0)} lectures
          </div>
        </div>

        {/* Subject tabs */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 0, scrollbarWidth: "none" }}>
          {VIDEO_LECTURES.map((sub, i) => {
            const active = i === activeSubjectIdx;
            return (
              <button
                key={sub.subject}
                onClick={() => handleSubjectChange(i)}
                style={{
                  flexShrink: 0,
                  padding: isMobile ? "8px 12px" : "10px 18px",
                  borderRadius: "10px 10px 0 0",
                  border: `1px solid ${active ? sub.color + "50" : "var(--bg-border)"}`,
                  borderBottom: active ? `1px solid var(--bg-surface)` : "1px solid var(--bg-border)",
                  background: active ? "var(--bg-surface)" : "transparent",
                  color: active ? sub.color : "var(--text-muted)",
                  fontFamily: "var(--font-body)", fontSize: isMobile ? 11 : 12,
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex", alignItems: "center", gap: 5,
                  marginBottom: active ? -1 : 0,
                  position: "relative", zIndex: active ? 1 : 0,
                }}
              >
                <span style={{ fontSize: 14 }}>{sub.icon}</span>
                {!isMobile && (
                  <span style={{ whiteSpace: "nowrap" }}>
                    {sub.subject.length > 14 ? sub.subject.split(" ")[0] : sub.subject}
                  </span>
                )}
                {sub.comingSoon && (
                  <span style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: sub.color, opacity: 0.6,
                  }}>soon</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      {subject.comingSoon ? (
        /* Coming soon state */
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 24px", textAlign: "center",
          animation: "vlFadeIn 0.35s ease-out both",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 22,
            background: `${subject.color}12`,
            border: `1px solid ${subject.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 38, marginBottom: 22,
          }}>{subject.icon}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 28,
            color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 8,
          }}>
            {subject.subject}
          </div>
          <div style={{
            fontFamily: "var(--font-tagline)", fontSize: 15, fontStyle: "italic",
            color: "var(--text-muted)", marginBottom: 22,
          }}>
            Lectures coming soon — stay tuned
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "7px 18px", borderRadius: 100,
            background: `${subject.color}10`,
            border: `1px solid ${subject.color}28`,
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: subject.color,
          }}>
            Coming Soon
          </div>
        </div>
      ) : (
        /* Playlist layout */
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: isMobile ? "auto" : "hidden",
          animation: "vlFadeIn 0.3s ease-out both",
        }}>

          {/* ── LEFT: Chapter list ── */}
          <div style={{
            width: isMobile ? "100%" : 300,
            flexShrink: 0,
            borderRight: isMobile ? "none" : "1px solid var(--bg-border)",
            borderBottom: isMobile ? "1px solid var(--bg-border)" : "none",
            overflowY: isMobile ? "visible" : "auto",
            background: "var(--bg-surface)",
          }}>
            {/* List header */}
            <div style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid var(--bg-border)",
              display: "flex", alignItems: "center", gap: 10,
              position: isMobile ? "static" : "sticky", top: 0,
              background: "var(--bg-surface)", zIndex: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: `${subject.color}14`,
                border: `1px solid ${subject.color}28`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, flexShrink: 0,
              }}>{subject.icon}</div>
              <div>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 13,
                  color: "var(--text-primary)", letterSpacing: "-0.01em",
                }}>{subject.subject}</div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 10,
                  color: "var(--text-muted)",
                }}>
                  {subject.chapters.length} lectures
                </div>
              </div>
            </div>

            {/* Chapter rows */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {subject.chapters.map((ch, i) => {
                const isActive = i === activeChapterIdx;
                return (
                  <button
                    key={ch.videoId + i}
                    className="vl-chapter-item"
                    onClick={() => setActiveChapterIdx(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px",
                      background: isActive ? `${subject.color}0E` : "transparent",
                      border: "none",
                      borderLeft: isActive ? `3px solid ${subject.color}` : "3px solid transparent",
                      borderBottom: "1px solid var(--bg-border)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      width: "100%",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 56, height: 36, minWidth: 56,
                      borderRadius: 6, overflow: "hidden",
                      background: "var(--bg-border)",
                      position: "relative", flexShrink: 0,
                    }}>
                      <img
                        src={`https://img.youtube.com/vi/${ch.videoId}/default.jpg`}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      {isActive && (
                        <div style={{
                          position: "absolute", inset: 0,
                          background: `${subject.color}55`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: 12, color: "#fff" }}>▶</span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: 12,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? subject.color : "var(--text-primary)",
                        lineHeight: 1.4,
                        overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                      }}>{ch.title}</div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: 10,
                        color: "var(--text-muted)", marginTop: 3,
                      }}>
                        {i + 1} / {subject.chapters.length}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Player ── */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: isMobile ? "visible" : "auto",
            padding: isMobile ? "16px" : "28px",
          }}>
            {chapter && (
              <div style={{
                maxWidth: 860,
                width: "100%",
                margin: "0 auto",
                position: isMobile ? "static" : "sticky",
                top: 28,
              }}>
                {/* Player */}
                <div style={{
                  position: "relative", paddingTop: "56.25%",
                  borderRadius: 16, overflow: "hidden",
                  background: "#000",
                  boxShadow: `0 0 0 1px ${subject.color}25, 0 24px 48px rgba(0,0,0,0.5)`,
                }}>
                  <iframe
                    key={chapter.videoId}
                    src={embedSrc}
                    title={chapter.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      border: "none",
                    }}
                  />
                </div>

                {/* Chapter info */}
                <div style={{
                  marginTop: 16,
                  padding: "16px 20px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 12,
                  display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                  gap: 12, flexWrap: "wrap",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: subject.color, marginBottom: 5, opacity: 0.8,
                    }}>
                      {subject.icon} {subject.subject}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontSize: isMobile ? 16 : 20,
                      color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.3,
                    }}>
                      {chapter.title}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    {activeChapterIdx > 0 && (
                      <button
                        onClick={() => setActiveChapterIdx(i => i - 1)}
                        style={{
                          padding: "7px 14px", borderRadius: 8,
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--bg-border)",
                          color: "var(--text-muted)", fontFamily: "var(--font-body)",
                          fontSize: 12, cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                      >
                        ← Prev
                      </button>
                    )}
                    {activeChapterIdx < subject.chapters.length - 1 && (
                      <button
                        onClick={() => setActiveChapterIdx(i => i + 1)}
                        style={{
                          padding: "7px 14px", borderRadius: 8,
                          background: `${subject.color}14`,
                          border: `1px solid ${subject.color}35`,
                          color: subject.color, fontFamily: "var(--font-body)",
                          fontSize: 12, fontWeight: 600, cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${subject.color}22`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${subject.color}14`; }}
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress strip */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>
                      Chapter {activeChapterIdx + 1} of {subject.chapters.length}
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, color: subject.color }}>
                      {Math.round(((activeChapterIdx + 1) / subject.chapters.length) * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 3, background: "var(--bg-border)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${((activeChapterIdx + 1) / subject.chapters.length) * 100}%`,
                      background: subject.color,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
