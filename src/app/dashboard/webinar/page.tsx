"use client";

import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";

// ── Update this URL when Pranay Bhaiya sets up the Calendly link ─────────────
const CALENDLY_URL = "https://calendly.com/saviours-ai";

const WEBINAR = {
  title: "ICSE Board Exam Masterclass",
  subtitle: "Strategy, shortcuts & last-minute secrets — straight from Pranay Bhaiya",
  date: "Every Saturday",
  time: "7:00 PM – 8:30 PM IST",
  duration: "90 minutes",
  seats: "Limited to 30 students",
  topics: [
    "Exam strategy for all 10 subjects — what to attempt first",
    "How to score 95+ in Maths: PYQ patterns Pranay has cracked",
    "Physics numericals — the 3-step method that saves time in exams",
    "Last-night revision plan that actually works",
    "Live doubt-solving — bring your hardest questions",
    "Board examiner psychology: how papers are evaluated",
  ],
  outcomes: [
    { icon: "◈", text: "A personalised exam strategy for your weak subjects" },
    { icon: "◉", text: "A revision schedule that fits your remaining time" },
    { icon: "○", text: "Answers to your specific doubts, live" },
    { icon: "◎", text: "Confidence — because you'll know exactly what to do" },
  ],
};

export default function WebinarPage() {
  const { isMobile } = useResponsive();
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCTA = () => {
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      padding: isMobile ? "24px 16px 80px" : "44px 48px",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes wbPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.35); }
          50%       { box-shadow: 0 0 0 10px rgba(0,212,255,0); }
        }
        @keyframes wbFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes wbSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wbGlow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── LIVE BADGE ── */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 100,
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          marginBottom: 28,
          animation: "wbSlideUp 0.4s ease-out both",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#EF4444",
            animation: "wbPulse 2s ease-in-out infinite",
            display: "inline-block",
          }} />
          <span style={{
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.16em", textTransform: "uppercase", color: "#EF4444",
          }}>Free · Open to All Students</span>
        </div>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 40, animation: "wbSlideUp 0.45s ease-out 0.05s both" }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--accent-gold)", opacity: 0.8, marginBottom: 12,
          }}>
            Live Webinar · Saviours AI 2027
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 34 : 52, fontWeight: 400,
            color: "var(--text-primary)", letterSpacing: "-0.03em",
            lineHeight: 1.05, margin: "0 0 12px",
          }}>
            {WEBINAR.title}
          </h1>
          <div style={{
            fontFamily: "var(--font-tagline)",
            fontSize: isMobile ? 15 : 18, fontStyle: "italic",
            color: "var(--text-secondary)", lineHeight: 1.5,
            maxWidth: 600,
          }}>
            {WEBINAR.subtitle}
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
          gap: 20,
          alignItems: "start",
        }}>

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Host card */}
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--accent-gold-border)",
              borderRadius: 20,
              padding: "28px 26px",
              position: "relative", overflow: "hidden",
              animation: "wbSlideUp 0.5s ease-out 0.1s both",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)" }} />
              <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-gold-glow), transparent 70%)", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Avatar */}
                <div style={{
                  width: isMobile ? 64 : 76, height: isMobile ? 64 : 76,
                  minWidth: isMobile ? 64 : 76,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, var(--accent-gold-glow), rgba(0,212,255,0.05))",
                  border: "1.5px solid var(--accent-gold-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column", gap: 2,
                  animation: "wbFloat 4s ease-in-out infinite",
                }}>
                  <span style={{ fontSize: isMobile ? 26 : 30 }}>🎓</span>
                </div>

                <div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "var(--accent-gold)", marginBottom: 6,
                  }}>Your Host</div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: isMobile ? 20 : 24,
                    color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 6,
                  }}>Pranay Bhaiya</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 13,
                    color: "var(--text-secondary)", lineHeight: 1.6,
                  }}>
                    ICSE board mentor with years of experience helping students crack 90+ scores. Pranay Bhaiya breaks down complex topics into strategies that actually work — no fluff, only results.
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {["ICSE Specialist", "Board Strategy Expert", "Doubt Solver"].map(tag => (
                      <span key={tag} style={{
                        fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: "var(--text-muted)",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--bg-border)",
                        padding: "3px 10px", borderRadius: 100,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 20,
              padding: "24px 26px",
              animation: "wbSlideUp 0.5s ease-out 0.15s both",
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--accent-gold)", marginBottom: 16,
              }}>What We Cover</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {WEBINAR.topics.map((topic, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 22, height: 22, minWidth: 22, borderRadius: 7, marginTop: 1,
                      background: "var(--accent-gold-glow)",
                      border: "1px solid var(--accent-gold-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                      color: "var(--accent-gold)",
                    }}>{i + 1}</div>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 13,
                      color: "var(--text-secondary)", lineHeight: 1.6,
                    }}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What you'll walk away with */}
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 20,
              padding: "24px 26px",
              animation: "wbSlideUp 0.5s ease-out 0.2s both",
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--accent-gold)", marginBottom: 16,
              }}>You Walk Away With</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {WEBINAR.outcomes.map((o, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: 16,
                      color: "var(--accent-gold)", flexShrink: 0, marginTop: 1,
                    }}>{o.icon}</span>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 13,
                      color: "var(--text-secondary)", lineHeight: 1.6,
                    }}>{o.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — sticky booking card */}
          <div style={{
            position: isMobile ? "static" : "sticky",
            top: 24,
            display: "flex", flexDirection: "column", gap: 14,
            animation: "wbSlideUp 0.5s ease-out 0.2s both",
          }}>

            {/* Session details */}
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 20,
              padding: "24px 22px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.04), transparent 60%)", pointerEvents: "none" }} />

              <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: 16, position: "relative",
              }}>Session Details</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
                {[
                  { label: "📅 Schedule", value: WEBINAR.date },
                  { label: "🕖 Time", value: WEBINAR.time },
                  { label: "⏱ Duration", value: WEBINAR.duration },
                  { label: "🎯 Format", value: "Live Q&A + Taught Session" },
                  { label: "💸 Cost", value: "Completely Free" },
                  { label: "🪑 Seats", value: WEBINAR.seats },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{label}</span>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                      color: value === "Completely Free" ? "var(--status-green)" : "var(--text-primary)",
                      textAlign: "right",
                    }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--bg-border)", margin: "20px 0" }} />

              {/* CTA */}
              <button
                onClick={handleCTA}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: hovered
                    ? "var(--accent-gold)"
                    : "linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,212,255,0.10))",
                  border: "1.5px solid var(--accent-gold)",
                  borderRadius: 14,
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow: hovered
                    ? "0 0 32px rgba(0,212,255,0.4), 0 8px 24px rgba(0,0,0,0.3)"
                    : "0 0 16px rgba(0,212,255,0.2)",
                  transform: hovered ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 800,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: hovered ? "#0A0A0F" : "var(--accent-gold)",
                  marginBottom: 4,
                  transition: "color 0.25s ease",
                }}>
                  Get Your Seat Now
                </div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
                  color: hovered ? "rgba(10,10,15,0.7)" : "var(--text-muted)",
                  transition: "color 0.25s ease",
                }}>
                  It&apos;s completely free — no catch →
                </div>
              </button>

              <div style={{
                fontFamily: "var(--font-body)", fontSize: 11,
                color: "var(--text-muted)", textAlign: "center",
                marginTop: 12, lineHeight: 1.5,
              }}>
                Powered by Calendly · Instant confirmation sent to your email
              </div>
            </div>

            {/* Social proof / urgency */}
            <div style={{
              background: "rgba(62,207,142,0.06)",
              border: "1px solid rgba(62,207,142,0.2)",
              borderRadius: 14,
              padding: "14px 18px",
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔥</span>
              <div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700,
                  color: "var(--status-green)", marginBottom: 3,
                }}>Seats fill up fast</div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 11,
                  color: "var(--text-muted)", lineHeight: 1.5,
                }}>
                  Each session is capped at 30 students so every question gets answered. Book early.
                </div>
              </div>
            </div>

            {/* Reassurance */}
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 14,
              padding: "14px 18px",
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: 10,
              }}>Why This Works</div>
              {[
                "Real questions from real students — not scripted",
                "Pranay has mentored 500+ ICSE students personally",
                "You leave with actionable tasks, not just motivation",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < 2 ? 8 : 0 }}>
                  <span style={{ color: "var(--accent-gold)", fontFamily: "var(--font-display)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>◈</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA (mobile sticky) ── */}
        {isMobile && (
          <div style={{
            position: "fixed", bottom: 70, left: 16, right: 16,
            zIndex: 50,
          }}>
            <button
              onClick={handleCTA}
              style={{
                width: "100%", padding: "16px",
                background: "var(--accent-gold)",
                border: "none", borderRadius: 14,
                cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 800,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#0A0A0F",
                boxShadow: "0 0 32px rgba(0,212,255,0.5), 0 8px 24px rgba(0,0,0,0.4)",
              }}
            >
              Get Your Seat — It&apos;s Free →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
