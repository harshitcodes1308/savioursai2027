"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { STUDY_FLOW_DATA, SUBJECT_META } from "@/data/studyFlowData";
import type { SubjectKey, StudyFlowQuestion } from "@/data/studyFlowData";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

const PROGRESS_KEY = "study-flow-progress";
const STEPS = ["Watch", "Revise", "Practice"] as const;
const STEP_ICONS = ["▶", "📖", "✏️"];

function getProgress(): Record<string, { step: number; completed: boolean }> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

function saveProgress(key: string, step: number, completed: boolean) {
  const p = getProgress();
  p[key] = { step, completed };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function extractVideoId(url: string): string {
  const m = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/) ||
    url.match(/youtube\.com\/live\/([A-Za-z0-9_-]+)/) ||
    url.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/);
  return m ? m[1] : "";
}

/* ── Step Progress Bar ── */
function StepBar({ current, isMobile }: { current: number; isMobile: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: isMobile ? 4 : 8, padding: isMobile ? "14px 16px" : "18px 24px",
      background: "var(--bg-surface)", borderBottom: "1px solid var(--bg-border)",
      position: "sticky", top: 0, zIndex: 20,
    }}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8 }}>
            {i > 0 && (
              <div style={{
                width: isMobile ? 20 : 40, height: 2, borderRadius: 1,
                background: done ? "var(--accent-gold)" : "var(--bg-border)",
                transition: "background 0.4s ease",
              }} />
            )}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: isMobile ? "5px 10px" : "6px 16px",
              borderRadius: 100,
              background: active ? "var(--accent-gold-glow)" : done ? "rgba(0,212,255,0.06)" : "transparent",
              border: `1.5px solid ${active ? "var(--accent-gold-border)" : done ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
              transition: "all 0.3s ease",
            }}>
              <span style={{
                fontSize: isMobile ? 12 : 14,
                filter: done || active ? "none" : "grayscale(1) opacity(0.4)",
              }}>{done ? "✓" : STEP_ICONS[i]}</span>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: isMobile ? 10 : 12,
                fontWeight: active ? 700 : 500,
                color: active ? "var(--accent-gold)" : done ? "var(--accent-gold-dim)" : "var(--text-muted)",
                letterSpacing: "0.02em",
              }}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Q&A Card ── */
function QACard({ q, idx, isMobile }: { q: StudyFlowQuestion; idx: number; isMobile: boolean }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      onClick={() => setRevealed(v => !v)}
      style={{
        background: revealed ? "rgba(62,207,142,0.06)" : "var(--bg-surface)",
        border: `1.5px solid ${revealed ? "rgba(62,207,142,0.25)" : "var(--bg-border)"}`,
        borderRadius: 14, padding: isMobile ? "16px" : "20px 24px",
        cursor: "pointer", transition: "all 0.3s ease",
        animation: `sfSlideUp 0.4s ease-out ${idx * 80}ms both`,
      }}
    >
      <div style={{
        fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
        color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 8, opacity: 0.6,
      }}>Q{idx + 1}</div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: isMobile ? 14 : 15,
        color: "var(--text-primary)", lineHeight: 1.6, marginBottom: revealed ? 14 : 0,
      }}>{q.question}</div>

      {revealed ? (
        <div style={{
          borderTop: "1px solid rgba(62,207,142,0.15)", paddingTop: 14,
          animation: "sfSlideUp 0.3s ease-out both",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
            color: "#3ECF8E", letterSpacing: "0.1em", marginBottom: 6,
          }}>ANSWER</div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: isMobile ? 13 : 14,
            color: "var(--text-secondary)", lineHeight: 1.65,
          }}>{q.answer}</div>
        </div>
      ) : (
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent-gold)",
          marginTop: 10, opacity: 0.7,
        }}>Tap to reveal answer →</div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function ChapterFlowPage() {
  const router = useRouter();
  const params = useParams();
  const { isMobile, isTablet } = useResponsive();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [allRevealed, setAllRevealed] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // YouTube discovery state (new Watch step)
  const [ytQuery, setYtQuery] = useState("");
  const [ytResults, setYtResults] = useState<Array<{
    videoId: string; title: string; channelId: string;
    channelTitle: string; thumbnail: string;
  }>>([]);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState("");
  const [ytCreatorChannelId, setYtCreatorChannelId] = useState<string | null>(null);
  const [ytCreatorName, setYtCreatorName] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const ytFetchedRef = useRef(false);

  const subject = params.subject as SubjectKey;
  const chapterId = params.chapterId as string;

  const meta = SUBJECT_META[subject];
  const subjectData = STUDY_FLOW_DATA[subject];
  const chapter = subjectData?.chapters.find(c => c.id === chapterId);
  const chapterIdx = subjectData?.chapters.findIndex(c => c.id === chapterId) ?? -1;
  const nextChapter = subjectData?.chapters[chapterIdx + 1];
  const progressKey = `${subject}:${chapterId}`;

  useEffect(() => {
    setMounted(true);
    const p = getProgress();
    const saved = p[progressKey];
    if (saved) setStep(saved.completed ? 3 : saved.step - 1);
  }, [progressKey]);

  const videoId = useMemo(() => chapter ? extractVideoId(chapter.watch.videoUrl) : "", [chapter]);

  // Auto-search YouTube when entering Watch step, if feature enabled
  useEffect(() => {
    if (!FEATURE_FLAGS.youtubeDiscovery || !chapter || !mounted) return;
    if (step !== 0 || ytFetchedRef.current) return;
    const q = `${chapter.title} Class 10 ICSE`;
    setYtQuery(q);
    setYtLoading(true);
    fetch(`/api/youtube-search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(d => {
        setYtResults(d.videos ?? []);
        setYtCreatorChannelId(d.creatorChannelId ?? null);
        setYtCreatorName(d.creatorName ?? null);
        ytFetchedRef.current = true;
      })
      .catch(() => setYtError("Search failed. Try again."))
      .finally(() => setYtLoading(false));
  }, [chapter, mounted, step]);

  async function searchYouTube(q: string) {
    if (!q.trim()) return;
    setYtLoading(true);
    setYtError("");
    setActiveVideoId(null);
    try {
      const res = await fetch(`/api/youtube-search?q=${encodeURIComponent(q)}`);
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setYtResults(d.videos ?? []);
      setYtCreatorChannelId(d.creatorChannelId ?? null);
      setYtCreatorName(d.creatorName ?? null);
    } catch (e: any) {
      setYtError(e.message || "Search failed");
    } finally {
      setYtLoading(false);
    }
  }

  if (!mounted) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid var(--bg-border)", borderTopColor: "var(--accent-gold)",
        animation: "spin360 0.7s linear infinite",
      }} />
    </div>
  );

  if (!meta || !chapter) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-base)", flexDirection: "column", gap: 16,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)" }}>
          Chapter not found
        </div>
        <button
          onClick={() => router.push(`/dashboard/study-flow/${subject}`)}
          style={{
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
            color: "var(--accent-gold)", background: "var(--accent-gold-glow)",
            border: "1px solid var(--accent-gold-border)", borderRadius: 10,
            padding: "10px 24px", cursor: "pointer",
          }}
        >← Back to chapters</button>
      </div>
    );
  }

  const goToStep = (s: number) => {
    setStep(s);
    saveProgress(progressKey, s + 1, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeChapter = () => {
    saveProgress(progressKey, 3, true);
    setShowComplete(true);
  };

  const pad = isMobile ? "20px 16px" : isTablet ? "28px" : "36px 48px";

  // ── CHAPTER COMPLETE STATE ──
  if (showComplete) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-base)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, boxSizing: "border-box",
      }}>
        <style>{`
          @keyframes sfCheckPop { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.3); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes sfConfetti1 { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-80px) rotate(360deg); opacity: 0; } }
          @keyframes sfConfetti2 { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-60px) translateX(40px) rotate(180deg); opacity: 0; } }
          @keyframes sfConfetti3 { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-70px) translateX(-35px) rotate(270deg); opacity: 0; } }
          @keyframes sfSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes sfGoldPulse { 0%,100% { box-shadow: 0 0 0 rgba(0,212,255,0); } 50% { box-shadow: 0 0 40px rgba(0,212,255,0.2); } }
        `}</style>

        <div style={{ textAlign: "center", maxWidth: 480, position: "relative" }}>
          {/* Confetti particles */}
          {["#00D4FF", "#3ECF8E", "#FB923C", "#A78BFA", "#F87171", "#60A5FA"].map((c, i) => (
            <div key={i} style={{
              position: "absolute",
              top: "40%", left: `${20 + i * 12}%`,
              width: 8, height: 8, borderRadius: i % 2 === 0 ? "50%" : 2,
              background: c,
              animation: `sfConfetti${(i % 3) + 1} 1.5s ease-out ${i * 0.1}s both`,
            }} />
          ))}

          {/* Gold checkmark */}
          <div style={{
            width: 90, height: 90, borderRadius: "50%", margin: "0 auto 24px",
            background: "var(--accent-gold-glow)",
            border: "2px solid var(--accent-gold)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "sfCheckPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both, sfGoldPulse 2s ease-in-out infinite",
          }}>
            <span style={{ fontSize: 40, color: "var(--accent-gold)" }}>✓</span>
          </div>

          <div style={{
            fontFamily: "var(--font-display)", fontSize: isMobile ? 26 : 34,
            color: "var(--text-primary)", letterSpacing: "-0.03em",
            marginBottom: 8, animation: "sfSlideUp 0.5s ease-out 0.3s both",
          }}>Chapter Complete!</div>

          <div style={{
            fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)",
            marginBottom: 8, animation: "sfSlideUp 0.5s ease-out 0.4s both",
          }}>{chapter.title}</div>

          <div style={{
            fontFamily: "var(--font-tagline)", fontSize: 14, fontStyle: "italic",
            color: "rgba(180,175,200,0.7)", marginBottom: 32,
            animation: "sfSlideUp 0.5s ease-out 0.5s both",
            textShadow: "0 0 12px rgba(0,212,255,0.1)",
          }}>One more chapter conquered. Keep going.</div>

          <div style={{
            display: "flex", gap: 12, justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            animation: "sfSlideUp 0.5s ease-out 0.6s both",
          }}>
            <button
              onClick={() => router.push(`/dashboard/study-flow/${subject}`)}
              style={{
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                color: "var(--text-muted)", background: "var(--bg-surface)",
                border: "1.5px solid var(--bg-border)", borderRadius: 10,
                padding: "12px 24px", cursor: "pointer", transition: "all 0.2s ease",
              }}
            >← Back to Chapters</button>

            {nextChapter && (
              <button
                onClick={() => {
                  setShowComplete(false);
                  setStep(0);
                  setAllRevealed(false);
                  router.push(`/dashboard/study-flow/${subject}/${nextChapter.id}`);
                }}
                style={{
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                  color: "#0A0A0F", background: "var(--accent-gold)",
                  border: "none", borderRadius: 10,
                  padding: "12px 24px", cursor: "pointer", transition: "all 0.2s ease",
                  letterSpacing: "0.02em",
                }}
              >Next Chapter →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN FLOW ──
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <style>{`
        @keyframes sfSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <StepBar current={step} isMobile={isMobile} />

      {/* Chapter title bar */}
      <div style={{
        padding: isMobile ? "14px 16px" : "16px 48px",
        borderBottom: "1px solid var(--bg-border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button
          onClick={() => router.push(`/dashboard/study-flow/${subject}`)}
          style={{
            fontFamily: "var(--font-body)", fontSize: 18, color: "var(--text-muted)",
            background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1,
          }}
        >←</button>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: isMobile ? 14 : 17,
            color: "var(--text-primary)", letterSpacing: "-0.01em",
          }}>{chapter.title}</div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 11, color: meta.color,
          }}>{meta.icon} {meta.label} · Chapter {chapterIdx + 1}</div>
        </div>
      </div>

      {/* Step content */}
      <div style={{ padding: pad, maxWidth: 800, margin: "0 auto" }}>

        {/* ── STEP 1: WATCH (YouTube Discovery) ── */}
        {step === 0 && (
          <div style={{ animation: "sfSlideUp 0.4s ease-out both" }}>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--accent-gold)", marginBottom: 12, opacity: 0.7,
            }}>Step 1 · Watch</div>

            <div style={{
              fontFamily: "var(--font-display)", fontSize: isMobile ? 20 : 26,
              color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 16,
            }}>{chapter.title}</div>

            {FEATURE_FLAGS.youtubeDiscovery ? (
              <>
                {/* Active player */}
                {activeVideoId && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{
                      position: "relative", paddingBottom: "56.25%", height: 0,
                      borderRadius: 14, overflow: "hidden",
                      border: "1.5px solid var(--accent-gold-border)",
                      boxShadow: "0 0 32px rgba(0,212,255,0.15)",
                    }}>
                      <iframe
                        key={activeVideoId}
                        src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                        title="Lecture"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                      />
                    </div>
                    <button
                      onClick={() => setActiveVideoId(null)}
                      style={{
                        fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)",
                        background: "none", border: "none", cursor: "pointer", marginTop: 10,
                        padding: 0, letterSpacing: "0.02em",
                      }}
                    >✕ Close player</button>
                  </div>
                )}

                {/* Search bar */}
                <div style={{
                  display: "flex", gap: 8, marginBottom: 16,
                }}>
                  <input
                    value={ytQuery}
                    onChange={e => setYtQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") searchYouTube(ytQuery); }}
                    placeholder="Search a different angle…"
                    style={{
                      flex: 1, padding: "10px 14px",
                      background: "var(--bg-surface)",
                      border: "1.5px solid var(--bg-border)",
                      borderRadius: 10,
                      fontFamily: "var(--font-body)", fontSize: 13,
                      color: "var(--text-primary)", outline: "none",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--accent-gold-border)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--bg-border)"}
                  />
                  <button
                    onClick={() => searchYouTube(ytQuery)}
                    disabled={ytLoading}
                    style={{
                      padding: "10px 16px",
                      background: "var(--accent-gold-glow)",
                      border: "1px solid var(--accent-gold-border)",
                      borderRadius: 10, cursor: ytLoading ? "wait" : "pointer",
                      fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                      color: "var(--accent-gold)", transition: "all 0.15s ease",
                    }}
                  >{ytLoading ? "…" : "Search"}</button>
                </div>

                {ytError && (
                  <div style={{
                    padding: "10px 14px", marginBottom: 12,
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 12,
                    color: "#f87171",
                  }}>{ytError}</div>
                )}

                {ytLoading && ytResults.length === 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{
                        height: 72, borderRadius: 12,
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        animation: "sfSlideUp 0.4s ease-out both",
                        opacity: 0.5,
                      }} />
                    ))}
                  </div>
                )}

                {ytResults.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {/* Sort: creator-boosted first */}
                    {[
                      ...ytResults.filter(v => ytCreatorChannelId && v.channelId === ytCreatorChannelId),
                      ...ytResults.filter(v => !ytCreatorChannelId || v.channelId !== ytCreatorChannelId),
                    ].map(video => {
                      const isBoosted = !!(ytCreatorChannelId && video.channelId === ytCreatorChannelId);
                      const isPlaying = activeVideoId === video.videoId;
                      return (
                        <button
                          key={video.videoId}
                          onClick={() => setActiveVideoId(isPlaying ? null : video.videoId)}
                          style={{
                            display: "flex", gap: 12, alignItems: "center",
                            padding: "12px 14px",
                            background: isPlaying ? "rgba(0,212,255,0.06)" : "var(--bg-surface)",
                            border: `1.5px solid ${isPlaying ? "var(--accent-gold-border)" : isBoosted ? "rgba(34,197,94,0.25)" : "var(--bg-border)"}`,
                            borderRadius: 12, cursor: "pointer", textAlign: "left",
                            transition: "all 0.15s ease", width: "100%",
                          }}
                        >
                          {/* Thumbnail */}
                          <div style={{
                            width: isMobile ? 80 : 96, minWidth: isMobile ? 80 : 96,
                            height: isMobile ? 50 : 58, borderRadius: 8, overflow: "hidden",
                            background: "var(--bg-border)", flexShrink: 0, position: "relative",
                          }}>
                            <img src={video.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            {isPlaying && (
                              <div style={{
                                position: "absolute", inset: 0,
                                background: "rgba(0,212,255,0.4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <span style={{ fontSize: 18, color: "#fff" }}>▶</span>
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {isBoosted && (
                              <div style={{
                                fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
                                color: "#22c55e", letterSpacing: "0.08em", textTransform: "uppercase",
                                marginBottom: 4,
                              }}>
                                ★ Recommended by {ytCreatorName}
                              </div>
                            )}
                            <div style={{
                              fontFamily: "var(--font-body)", fontSize: isMobile ? 12 : 13,
                              fontWeight: 500, color: isPlaying ? "var(--accent-gold)" : "var(--text-primary)",
                              lineHeight: 1.4, marginBottom: 4,
                              overflow: "hidden", textOverflow: "ellipsis",
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
                            }}>
                              {video.title}
                            </div>
                            <div style={{
                              fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)",
                            }}>{video.channelTitle}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Fallback: original static embed */
              <div style={{
                position: "relative", paddingBottom: "56.25%", height: 0,
                borderRadius: 14, overflow: "hidden",
                border: "1.5px solid var(--bg-border)", marginBottom: 24,
              }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={chapter.watch.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            )}

            <button
              onClick={() => goToStep(1)}
              style={{
                width: "100%", padding: "14px 24px",
                fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                color: "#0A0A0F", background: "var(--accent-gold)",
                border: "none", borderRadius: 12, cursor: "pointer",
                letterSpacing: "0.02em", transition: "all 0.2s ease",
                marginTop: FEATURE_FLAGS.youtubeDiscovery ? 0 : 24,
              }}
            >I&apos;ve watched this → Next: Revise</button>
          </div>
        )}

        {/* ── STEP 2: REVISE ── */}
        {step === 1 && (
          <div style={{ animation: "sfSlideUp 0.4s ease-out both" }}>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--accent-gold)", marginBottom: 12, opacity: 0.7,
            }}>Step 2 · Revise</div>

            <div style={{
              fontFamily: "var(--font-display)", fontSize: isMobile ? 20 : 26,
              color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 20,
            }}>Quick Revision</div>

            {/* Summary */}
            <div style={{
              background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
              borderRadius: 14, padding: isMobile ? "18px" : "24px 28px", marginBottom: 20,
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: isMobile ? 14 : 15,
                color: "var(--text-secondary)", lineHeight: 1.7,
              }}>{chapter.revise.summary}</div>
            </div>

            {/* Bullet points */}
            <div style={{
              background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
              borderRadius: 14, padding: isMobile ? "18px" : "24px 28px", marginBottom: 28,
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: 14, opacity: 0.6,
              }}>Key Points</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {chapter.revise.bullets.map((b, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 10, alignItems: "flex-start",
                    animation: `sfSlideUp 0.3s ease-out ${i * 60}ms both`,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--accent-gold)", marginTop: 7, flexShrink: 0,
                    }} />
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: isMobile ? 13 : 14,
                      color: "var(--text-primary)", lineHeight: 1.6,
                    }}>{b}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => goToStep(0)}
                style={{
                  padding: "12px 20px",
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                  color: "var(--text-muted)", background: "var(--bg-surface)",
                  border: "1.5px solid var(--bg-border)", borderRadius: 10,
                  cursor: "pointer",
                }}
              >← Watch again</button>
              <button
                onClick={() => goToStep(2)}
                style={{
                  flex: 1, padding: "14px 24px",
                  fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                  color: "#0A0A0F", background: "var(--accent-gold)",
                  border: "none", borderRadius: 12, cursor: "pointer",
                  letterSpacing: "0.02em",
                }}
              >Done Revising → Next: Practice</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PRACTICE ── */}
        {step === 2 && (
          <div style={{ animation: "sfSlideUp 0.4s ease-out both" }}>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--accent-gold)", marginBottom: 12, opacity: 0.7,
            }}>Step 3 · Practice</div>

            <div style={{
              fontFamily: "var(--font-display)", fontSize: isMobile ? 20 : 26,
              color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 6,
            }}>Test Yourself</div>

            <div style={{
              fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)",
              marginBottom: 24,
            }}>Tap each card to reveal the answer · {chapter.practice.length} questions</div>

            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 10 : 12 }}>
              {chapter.practice.map((q, i) => (
                <QACard key={i} q={q} idx={i} isMobile={isMobile} />
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button
                onClick={() => goToStep(1)}
                style={{
                  padding: "12px 20px",
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                  color: "var(--text-muted)", background: "var(--bg-surface)",
                  border: "1.5px solid var(--bg-border)", borderRadius: 10,
                  cursor: "pointer",
                }}
              >← Revise again</button>
              <button
                onClick={completeChapter}
                style={{
                  flex: 1, padding: "14px 24px",
                  fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                  color: "#0A0A0F", background: "#3ECF8E",
                  border: "none", borderRadius: 12, cursor: "pointer",
                  letterSpacing: "0.02em",
                }}
              >✓ Complete Chapter</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
