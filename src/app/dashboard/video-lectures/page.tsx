"use client";

import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { VIDEO_LECTURES, ALL_SUBJECT_MARATHON, CATEGORY_META } from "@/data/video-lectures";
import type { VideoCategory, VideoChapter } from "@/data/video-lectures";

const CATEGORIES: VideoCategory[] = ['oneshot', 'marathon', 'competency'];

export default function VideoLecturesPage() {
  const { isMobile } = useResponsive();
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [category, setCategory] = useState<VideoCategory>('oneshot');
  const [videoIdx, setVideoIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showAllSubjectMarathon, setShowAllSubjectMarathon] = useState(false);

  useEffect(() => setMounted(true), []);

  const subject = VIDEO_LECTURES[subjectIdx];
  const catContent = subject[category];
  const videos = catContent.videos;
  const currentVideo: VideoChapter | null = videos[videoIdx] ?? null;
  const isComingSoon = catContent.comingSoon || videos.length === 0;

  const handleSubjectChange = (idx: number) => {
    setSubjectIdx(idx);
    setCategory('oneshot');
    setVideoIdx(0);
    setShowAllSubjectMarathon(false);
  };

  const handleCategoryChange = (cat: VideoCategory) => {
    setCategory(cat);
    setVideoIdx(0);
    setShowAllSubjectMarathon(false);
  };

  // All-subject marathon player
  const [asmIdx, setAsmIdx] = useState(0);
  const asmVideo = ALL_SUBJECT_MARATHON[asmIdx];

  const totalLectures = VIDEO_LECTURES.reduce((s, sub) =>
    s + sub.oneshot.videos.length + sub.marathon.videos.length + sub.competency.videos.length, 0
  ) + ALL_SUBJECT_MARATHON.length;

  const embedSrc = (vid: VideoChapter | null) =>
    vid ? `https://www.youtube.com/embed/${vid.videoId}?rel=0&modestbranding=1` : "";

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes vlFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes vlPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes vlShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .vl-item:hover { background: var(--bg-elevated) !important; }
        .vl-cat-btn:hover { transform: translateY(-1px); }
        .vl-sub-tab:hover { background: var(--bg-elevated) !important; }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--bg-border)",
        padding: isMobile ? "14px 14px 0" : "18px 28px 0",
        flexShrink: 0, position: "sticky", top: 0, zIndex: 30,
      }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
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
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => { setShowAllSubjectMarathon(v => !v); setAsmIdx(0); }}
              style={{
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                color: showAllSubjectMarathon ? "#000" : "var(--accent-gold)",
                background: showAllSubjectMarathon ? "var(--accent-gold)" : "var(--accent-gold-glow)",
                border: "1px solid var(--accent-gold-border)",
                padding: "4px 14px", borderRadius: 100, letterSpacing: "0.04em",
                cursor: "pointer", transition: "all 0.2s ease",
              }}
            >
              🔥 All-Subject Marathon
            </button>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
              color: "var(--text-muted)", background: "var(--bg-elevated)",
              border: "1px solid var(--bg-border)",
              padding: "4px 12px", borderRadius: 100,
            }}>
              {totalLectures} lectures
            </div>
          </div>
        </div>

        {/* Subject tabs */}
        {!showAllSubjectMarathon && (
          <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 0, scrollbarWidth: "none" }}>
            {VIDEO_LECTURES.map((sub, i) => {
              const active = i === subjectIdx;
              return (
                <button
                  key={sub.subject}
                  className="vl-sub-tab"
                  onClick={() => handleSubjectChange(i)}
                  style={{
                    flexShrink: 0,
                    padding: isMobile ? "7px 10px" : "9px 16px",
                    borderRadius: "10px 10px 0 0",
                    border: `1px solid ${active ? sub.color + "50" : "var(--bg-border)"}`,
                    borderBottom: active ? "1px solid var(--bg-surface)" : "1px solid var(--bg-border)",
                    background: active ? "var(--bg-surface)" : "transparent",
                    color: active ? sub.color : "var(--text-muted)",
                    fontFamily: "var(--font-body)", fontSize: isMobile ? 11 : 12,
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer", transition: "all 0.15s ease",
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
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ALL-SUBJECT MARATHON VIEW ── */}
      {showAllSubjectMarathon ? (
        <div style={{
          flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row",
          overflow: isMobile ? "auto" : "hidden",
          animation: "vlFadeIn 0.3s ease-out both",
        }}>
          <Sidebar
            isMobile={isMobile}
            color="#F59E0B"
            icon="🔥"
            title="All-Subject Marathon"
            subtitle={`${ALL_SUBJECT_MARATHON.length} sessions`}
            videos={ALL_SUBJECT_MARATHON}
            activeIdx={asmIdx}
            onSelect={setAsmIdx}
          />
          <PlayerPanel
            isMobile={isMobile}
            color="#F59E0B"
            icon="🔥"
            subjectName="All Subjects"
            video={asmVideo}
            embedSrc={embedSrc(asmVideo)}
            videoIdx={asmIdx}
            totalVideos={ALL_SUBJECT_MARATHON.length}
            onPrev={() => setAsmIdx(i => i - 1)}
            onNext={() => setAsmIdx(i => i + 1)}
          />
        </div>
      ) : (
        <>
          {/* ── CATEGORY SELECTOR ── */}
          <div style={{
            padding: isMobile ? "14px 14px 0" : "18px 28px 0",
            display: "flex", gap: isMobile ? 8 : 12,
            flexWrap: "wrap",
          }}>
            {CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat];
              const active = category === cat;
              const content = subject[cat];
              const count = content.videos.length;
              const soon = content.comingSoon || count === 0;
              return (
                <button
                  key={cat}
                  className="vl-cat-btn"
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    flex: isMobile ? "1 1 auto" : "0 0 auto",
                    minWidth: isMobile ? 90 : 160,
                    padding: isMobile ? "10px 12px" : "14px 20px",
                    borderRadius: 14,
                    border: `1.5px solid ${active ? subject.color + "70" : "var(--bg-border)"}`,
                    background: active
                      ? `linear-gradient(135deg, ${subject.color}15, ${subject.color}08)`
                      : "var(--bg-surface)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {active && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, ${subject.color}, ${subject.color}60)`,
                    }} />
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: isMobile ? 16 : 20 }}>{meta.icon}</span>
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: isMobile ? 12 : 14,
                      fontWeight: 700, color: active ? subject.color : "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}>
                      {meta.label}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 10,
                    color: "var(--text-muted)", lineHeight: 1.3,
                  }}>
                    {soon ? (
                      <span style={{
                        color: subject.color, fontWeight: 700,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        fontSize: 9, animation: "vlPulse 2s ease-in-out infinite",
                      }}>
                        Coming Soon
                      </span>
                    ) : (
                      `${count} ${count === 1 ? 'video' : 'videos'}`
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── MAIN CONTENT ── */}
          {isComingSoon ? (
            <ComingSoonState subject={subject} category={category} isMobile={isMobile} />
          ) : (
            <div style={{
              flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row",
              overflow: isMobile ? "auto" : "hidden",
              animation: "vlFadeIn 0.3s ease-out both",
            }}>
              <Sidebar
                isMobile={isMobile}
                color={subject.color}
                icon={subject.icon}
                title={`${subject.subject} · ${CATEGORY_META[category].label}`}
                subtitle={`${videos.length} ${videos.length === 1 ? 'video' : 'videos'}`}
                videos={videos}
                activeIdx={videoIdx}
                onSelect={setVideoIdx}
              />
              <PlayerPanel
                isMobile={isMobile}
                color={subject.color}
                icon={subject.icon}
                subjectName={subject.subject}
                video={currentVideo}
                embedSrc={embedSrc(currentVideo)}
                videoIdx={videoIdx}
                totalVideos={videos.length}
                onPrev={() => setVideoIdx(i => i - 1)}
                onNext={() => setVideoIdx(i => i + 1)}
                categoryLabel={CATEGORY_META[category].label}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   SIDEBAR COMPONENT
   ──────────────────────────────────────────── */
function Sidebar({ isMobile, color, icon, title, subtitle, videos, activeIdx, onSelect }: {
  isMobile: boolean; color: string; icon: string; title: string; subtitle: string;
  videos: VideoChapter[]; activeIdx: number; onSelect: (i: number) => void;
}) {
  return (
    <div style={{
      width: isMobile ? "100%" : 300, flexShrink: 0,
      borderRight: isMobile ? "none" : "1px solid var(--bg-border)",
      borderBottom: isMobile ? "1px solid var(--bg-border)" : "none",
      overflowY: isMobile ? "visible" : "auto",
      background: "var(--bg-surface)",
    }}>
      <div style={{
        padding: "14px 16px 10px",
        borderBottom: "1px solid var(--bg-border)",
        display: "flex", alignItems: "center", gap: 10,
        position: isMobile ? "static" : "sticky", top: 0,
        background: "var(--bg-surface)", zIndex: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: `${color}14`, border: `1px solid ${color}28`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
        }}>{icon}</div>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 12,
            color: "var(--text-primary)", letterSpacing: "-0.01em",
          }}>{title}</div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)",
          }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {videos.map((ch, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={ch.videoId + i}
              className="vl-item"
              onClick={() => onSelect(i)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px",
                background: isActive ? `${color}0E` : "transparent",
                border: "none",
                borderLeft: isActive ? `3px solid ${color}` : "3px solid transparent",
                borderBottom: "1px solid var(--bg-border)",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.15s ease", width: "100%",
              }}
            >
              <div style={{
                width: 56, height: 36, minWidth: 56,
                borderRadius: 6, overflow: "hidden",
                background: "var(--bg-border)", position: "relative", flexShrink: 0,
              }}>
                <img
                  src={`https://img.youtube.com/vi/${ch.videoId}/default.jpg`}
                  alt="" loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {isActive && (
                  <div style={{
                    position: "absolute", inset: 0, background: `${color}55`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 12, color: "#fff" }}>▶</span>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? color : "var(--text-primary)",
                  lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                }}>{ch.title}</div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 10,
                  color: "var(--text-muted)", marginTop: 3,
                }}>{i + 1} / {videos.length}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   PLAYER PANEL COMPONENT
   ──────────────────────────────────────────── */
function PlayerPanel({ isMobile, color, icon, subjectName, video, embedSrc, videoIdx, totalVideos, onPrev, onNext, categoryLabel }: {
  isMobile: boolean; color: string; icon: string; subjectName: string;
  video: VideoChapter | null; embedSrc: string;
  videoIdx: number; totalVideos: number;
  onPrev: () => void; onNext: () => void; categoryLabel?: string;
}) {
  if (!video) return null;
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      overflow: isMobile ? "visible" : "auto",
      padding: isMobile ? "16px" : "28px",
    }}>
      <div style={{
        maxWidth: 860, width: "100%", margin: "0 auto",
        position: isMobile ? "static" : "sticky", top: 28,
      }}>
        {/* Player */}
        <div style={{
          position: "relative", paddingTop: "56.25%",
          borderRadius: 16, overflow: "hidden", background: "#000",
          boxShadow: `0 0 0 1px ${color}25, 0 24px 48px rgba(0,0,0,0.5)`,
        }}>
          <iframe
            key={video.videoId}
            src={embedSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", border: "none",
            }}
          />
        </div>

        {/* Info bar */}
        <div style={{
          marginTop: 16, padding: "16px 20px",
          background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
          borderRadius: 12, display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color, marginBottom: 5, opacity: 0.8,
            }}>
              {icon} {subjectName}{categoryLabel ? ` · ${categoryLabel}` : ''}
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: isMobile ? 16 : 20,
              color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.3,
            }}>
              {video.title}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {videoIdx > 0 && (
              <NavBtn label="← Prev" color="var(--text-muted)" bg="var(--bg-elevated)" onClick={onPrev} />
            )}
            {videoIdx < totalVideos - 1 && (
              <NavBtn label="Next →" color={color} bg={`${color}14`} border={`${color}35`} bold onClick={onNext} />
            )}
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>
              Video {videoIdx + 1} of {totalVideos}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, color }}>
              {Math.round(((videoIdx + 1) / totalVideos) * 100)}%
            </span>
          </div>
          <div style={{ height: 3, background: "var(--bg-border)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${((videoIdx + 1) / totalVideos) * 100}%`,
              background: color, transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   NAV BUTTON
   ──────────────────────────────────────────── */
function NavBtn({ label, color, bg, border, bold, onClick }: {
  label: string; color: string; bg: string; border?: string; bold?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px", borderRadius: 8,
        background: bg, border: `1px solid ${border || "var(--bg-border)"}`,
        color, fontFamily: "var(--font-body)",
        fontSize: 12, fontWeight: bold ? 600 : 400,
        cursor: "pointer", transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

/* ────────────────────────────────────────────
   COMING SOON STATE
   ──────────────────────────────────────────── */
function ComingSoonState({ subject, category, isMobile }: {
  subject: { subject: string; icon: string; color: string };
  category: VideoCategory; isMobile: boolean;
}) {
  const meta = CATEGORY_META[category];
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 24px", textAlign: "center",
      animation: "vlFadeIn 0.35s ease-out both",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 22,
        background: `${subject.color}12`, border: `1px solid ${subject.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 38, marginBottom: 22,
      }}>{meta.icon}</div>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 28,
        color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 8,
      }}>
        {subject.subject} — {meta.label}
      </div>
      <div style={{
        fontFamily: "var(--font-tagline)", fontSize: 15, fontStyle: "italic",
        color: "var(--text-muted)", marginBottom: 22, maxWidth: 340,
      }}>
        {meta.description} videos are being prepared — stay tuned
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "7px 18px", borderRadius: 100,
        background: `${subject.color}10`, border: `1px solid ${subject.color}28`,
        fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: subject.color, animation: "vlPulse 2s ease-in-out infinite",
      }}>
        Coming Soon
      </div>
    </div>
  );
}
