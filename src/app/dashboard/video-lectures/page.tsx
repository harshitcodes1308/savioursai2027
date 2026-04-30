"use client";

import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { VIDEO_LECTURES, type VideoChapter, type SubjectVideos } from "@/data/video-lectures";

// ── Video card with click-to-load iframe ─────────────────────────────────────
function VideoCard({
  chapter,
  subjectColor,
  isMobile,
}: {
  chapter: VideoChapter;
  subjectColor: string;
  isMobile: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${chapter.videoId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${chapter.videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--bg-border)",
      borderRadius: 14,
      overflow: "hidden",
      transition: "border-color 0.2s ease, transform 0.2s ease",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${subjectColor}40`;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bg-border)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* 16:9 video area */}
      <div style={{ position: "relative", paddingTop: "56.25%", background: "#000", cursor: "pointer" }}
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            src={embedSrc}
            title={chapter.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              border: "none",
            }}
          />
        ) : (
          <>
            {/* Thumbnail */}
            <img
              src={thumb}
              alt={chapter.title}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8)",
              }}
              onError={e => {
                // fallback to a dark bg if thumbnail 404s
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Play button */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: isMobile ? 48 : 56, height: isMobile ? 48 : 56,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.7)",
                border: "2px solid rgba(255,255,255,0.85)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}>
                <span style={{
                  fontSize: isMobile ? 18 : 22,
                  color: "#fff",
                  marginLeft: 3, // optical centering for play icon
                }}>▶</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Title */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: isMobile ? 12 : 13,
          fontWeight: 500,
          color: "var(--text-primary)",
          lineHeight: 1.45,
        }}>
          {chapter.title}
        </div>
      </div>
    </div>
  );
}

// ── Coming Soon card ─────────────────────────────────────────────────────────
function ComingSoonSection({ subject }: { subject: SubjectVideos }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
      textAlign: "center",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `${subject.color}14`,
        border: `1px solid ${subject.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 34, marginBottom: 20,
      }}>{subject.icon}</div>

      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 24, color: "var(--text-primary)",
        letterSpacing: "-0.02em", marginBottom: 8,
      }}>
        {subject.subject}
      </div>

      <div style={{
        fontFamily: "var(--font-tagline)",
        fontSize: 15, fontStyle: "italic",
        color: "var(--text-muted)", marginBottom: 20,
      }}>
        Lectures coming soon
      </div>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 16px", borderRadius: 100,
        background: `${subject.color}0F`,
        border: `1px solid ${subject.color}28`,
        fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: subject.color,
      }}>
        Coming Soon
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VideoLecturesPage() {
  const { isMobile } = useResponsive();
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);

  const activeSubject = VIDEO_LECTURES[activeSubjectIdx];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── Sticky header ── */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--bg-border)",
        padding: isMobile ? "16px 16px 0" : "20px 32px 0",
        flexShrink: 0,
        position: "sticky", top: 0, zIndex: 20,
      }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 20 : 26,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              margin: 0, marginBottom: 2,
            }}>Video Lectures</h1>
            <div style={{
              fontFamily: "var(--font-tagline)",
              fontSize: 12, fontStyle: "italic",
              color: "var(--text-muted)",
            }}>
              Subject-wise ICSE Class 10 lectures · Free for everyone
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
            color: "var(--accent-gold)",
            background: "var(--accent-gold-glow)",
            border: "1px solid var(--accent-gold-border)",
            padding: "3px 10px", borderRadius: 100,
            letterSpacing: "0.04em",
          }}>
            {VIDEO_LECTURES.reduce((s, sub) => s + sub.chapters.length, 0)} videos
          </div>
        </div>

        {/* Subject pills */}
        <div style={{
          display: "flex", gap: 5, overflowX: "auto", paddingBottom: 12,
          scrollbarWidth: "none",
        }}>
          {VIDEO_LECTURES.map((sub, i) => {
            const isActive = i === activeSubjectIdx;
            return (
              <button
                key={sub.subject}
                onClick={() => setActiveSubjectIdx(i)}
                style={{
                  flexShrink: 0,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", borderRadius: 100,
                  border: isActive ? `1.5px solid ${sub.color}` : "1.5px solid var(--bg-border)",
                  background: isActive ? `${sub.color}14` : "transparent",
                  color: isActive ? sub.color : "var(--text-muted)",
                  fontFamily: "var(--font-body)", fontSize: 12,
                  fontWeight: isActive ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? `0 0 12px ${sub.color}20` : "none",
                }}
              >
                <span style={{ fontSize: 13 }}>{sub.icon}</span>
                <span style={{
                  maxWidth: isMobile ? 70 : 120,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {isMobile ? sub.subject.split(' ')[0] : sub.subject}
                </span>
                {sub.comingSoon && (
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: isActive ? sub.color : "var(--text-muted)",
                    opacity: 0.7,
                  }}>soon</span>
                )}
                {!sub.comingSoon && (
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 600,
                    color: isActive ? sub.color : "var(--text-muted)",
                    opacity: 0.7,
                  }}>{sub.chapters.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {activeSubject.comingSoon ? (
            <ComingSoonSection subject={activeSubject} />
          ) : (
            <>
              {/* Subject hero strip */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: 20,
                padding: "14px 18px",
                background: "var(--bg-surface)",
                border: `1px solid ${activeSubject.color}25`,
                borderLeft: `3px solid ${activeSubject.color}`,
                borderRadius: "0 12px 12px 0",
              }}>
                <span style={{ fontSize: 24 }}>{activeSubject.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: isMobile ? 16 : 18,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}>
                    {activeSubject.subject}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 11,
                    color: "var(--text-muted)", marginTop: 2,
                  }}>
                    {activeSubject.chapters.length} chapter{activeSubject.chapters.length !== 1 ? 's' : ''} · Click any video to play
                  </div>
                </div>
              </div>

              {/* Video grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 14,
              }}>
                {activeSubject.chapters.map((chapter) => (
                  <VideoCard
                    key={chapter.videoId + chapter.title}
                    chapter={chapter}
                    subjectColor={activeSubject.color}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </>
          )}

          <div style={{ height: 32 }} />
        </div>
      </div>
    </div>
  );
}
