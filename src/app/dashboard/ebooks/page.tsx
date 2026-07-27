"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { EBOOK_SUBJECTS, EBOOK_PUBLISHER } from "@/data/ebooks-config";

function getStoredPage(subjectId: string): number {
  if (typeof window === "undefined") return 0;
  const v = localStorage.getItem(`saviours-ebook-${subjectId}-tab0-page`);
  return v ? parseInt(v, 10) : 0;
}

export default function EbooksLibraryPage() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
    const p: Record<string, number> = {};
    EBOOK_SUBJECTS.forEach((s) => {
      p[s.id] = getStoredPage(s.id);
    });
    setProgress(p);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: isMobile ? "20px 16px" : "32px 40px",
        animation: "pageEnter 0.5s ease-out",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .eb-card:hover .eb-accent-bar {
              height: 100% !important;
              opacity: 1 !important;
            }
            .eb-card:hover .eb-icon {
              transform: scale(1.15) !important;
            }
            .eb-card:hover .eb-arrow {
              opacity: 1 !important;
              transform: translateX(0) !important;
            }
          `,
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: isMobile ? 28 : 40, maxWidth: 800 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "var(--accent-gold-glow)",
              border: "1px solid var(--accent-gold-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            ◈
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? 26 : 34,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            E-Books
          </h1>
        </div>
        <p
          style={{
            fontFamily: "var(--font-tagline)",
            fontSize: 14,
            fontStyle: "italic",
            color: "var(--text-muted)",
            margin: "4px 0 0 0",
          }}
        >
          Premium ICSE textbooks by {EBOOK_PUBLISHER} — your entire syllabus, one tap away.
        </p>
      </div>

      {/* Subject Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "repeat(2, 1fr)"
            : "repeat(3, 1fr)",
          gap: isMobile ? 14 : 20,
        }}
      >
        {EBOOK_SUBJECTS.map((subject, i) => {
          const isHovered = hoveredId === subject.id;
          const savedPage = progress[subject.id] || 0;

          return (
            <div
              key={subject.id}
              className="eb-card"
              onClick={() => router.push(`/dashboard/ebooks/${subject.id}`)}
              onMouseEnter={() => setHoveredId(subject.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: "relative",
                overflow: "hidden",
                background: isHovered
                  ? "rgba(19, 19, 31, 0.85)"
                  : "rgba(19, 19, 31, 0.55)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${
                  isHovered
                    ? `${subject.color}44`
                    : "rgba(255,255,255,0.06)"
                }`,
                borderRadius: 18,
                padding: isMobile ? "20px 18px" : "24px 24px",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered
                  ? `0 12px 40px ${subject.color}15, 0 0 0 1px ${subject.color}22`
                  : "0 2px 8px rgba(0,0,0,0.2)",
                animation: mounted
                  ? `slideInUp 0.5s ease-out ${i * 0.06}s both`
                  : "none",
              }}
            >
              {/* Left accent bar */}
              <div
                className="eb-accent-bar"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 4,
                  height: "30%",
                  background: `linear-gradient(180deg, ${subject.color}, ${subject.color}00)`,
                  borderRadius: "0 4px 4px 0",
                  opacity: 0.7,
                  transition: "all 0.4s ease",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                {/* Icon */}
                <div
                  className="eb-icon"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${subject.color}15`,
                    border: `1px solid ${subject.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {subject.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: isMobile ? 17 : 18,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: "0 0 4px 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {subject.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {subject.description}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="eb-arrow"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? "translateX(0)"
                      : "translateX(-8px)",
                    transition: "all 0.3s ease",
                    color: subject.color,
                    fontSize: 18,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
              </div>

              {/* Bottom info row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-tagline)",
                    fontSize: 11,
                    fontStyle: "italic",
                    color: "var(--text-muted)",
                    opacity: 0.7,
                  }}
                >
                  by {EBOOK_PUBLISHER}
                </span>

                {savedPage > 1 && (
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: subject.color,
                      background: `${subject.color}12`,
                      padding: "3px 10px",
                      borderRadius: 20,
                      border: `1px solid ${subject.color}25`,
                    }}
                  >
                    Page {savedPage}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
