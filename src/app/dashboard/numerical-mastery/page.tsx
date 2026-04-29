"use client";

import { useState, useEffect } from "react";
import {
  numericalMasteryData,
  type NumericalChapter,
  type NumericalTopic,
} from "@/data/numerical-mastery-data";

type Phase = "chapters" | "topics" | "numerical";

export default function NumericalMasteryPage() {
  const [phase, setPhase] = useState<Phase>("chapters");
  const [selectedChapter, setSelectedChapter] = useState<NumericalChapter | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<NumericalTopic | null>(null);
  const [topicIndex, setTopicIndex] = useState(0);
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [revealedPYQs, setRevealedPYQs] = useState<Record<number, boolean>>({});
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>({});
  const [showFormulaRecap, setShowFormulaRecap] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const togglePYQ = (idx: number) => setRevealedPYQs(p => ({ ...p, [idx]: !p[idx] }));
  const toggleMastered = (id: string) => setMasteredTopics(p => ({ ...p, [id]: !p[id] }));

  const getChapterCompletion = (ch: NumericalChapter) => {
    const mastered = ch.topics.filter(t => masteredTopics[t.id]).length;
    return Math.round((mastered / ch.topics.length) * 100);
  };

  const selectChapter = (ch: NumericalChapter) => { setSelectedChapter(ch); setPhase("topics"); };
  const selectTopic = (t: NumericalTopic, idx: number) => {
    setSelectedTopic(t); setTopicIndex(idx); setRevealedPYQs({}); setPhase("numerical");
  };
  const goBack = () => {
    if (phase === "numerical") { setPhase("topics"); setShowFormulaRecap(false); }
    else if (phase === "topics") { setPhase("chapters"); setSelectedChapter(null); }
  };
  const goToNextTopic = () => {
    if (!selectedChapter) return;
    const isLast = topicIndex >= selectedChapter.topics.length - 1;
    if (isLast) { setPhase("topics"); setShowFormulaRecap(false); return; }
    const nextIdx = topicIndex + 1;
    setSelectedTopic(selectedChapter.topics[nextIdx]);
    setTopicIndex(nextIdx);
    setRevealedPYQs({});
    setShowFormulaRecap(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (!mounted) return null;

  const keyframes = `
    @keyframes nmSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes nmExpand { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 800px; } }
    @keyframes nmGlow { 0%,100% { box-shadow: 0 0 0 1px var(--accent-gold-border), 0 0 20px var(--accent-gold-glow); } 50% { box-shadow: 0 0 0 1px var(--accent-gold-border), 0 0 32px var(--accent-gold-glow); } }
  `;

  // ═══════════════ PHASE 1: Chapters ═══════════════
  if (phase === "chapters") {
    return (
      <div style={{ padding: "36px 24px", maxWidth: 1080, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
        <style>{keyframes}</style>

        {/* Hero */}
        <div style={{
          position: "relative",
          background: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          borderRadius: 20,
          padding: "40px 36px",
          marginBottom: 36,
          overflow: "hidden",
          animation: "nmSlideUp 0.5s ease-out both",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)" }} />
          <div style={{ position: "absolute", top: -80, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-gold-glow), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent-gold)", opacity: 0.8, marginBottom: 10 }}>
              Physics · Paid Feature
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 42, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.05,
              color: "var(--text-primary)",
            }}>
              Numerical Mastery
            </h1>
            <div style={{
              fontFamily: "var(--font-tagline)",
              fontSize: 15, fontStyle: "italic", color: "var(--text-secondary)",
              marginTop: 8, opacity: 0.85,
            }}>
              Every formula. Every numerical. Until it&apos;s muscle memory.
            </div>

            <div style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--bg-border)",
              borderRadius: 14,
              padding: "18px 22px",
              marginTop: 24,
              borderLeft: "2px solid var(--accent-gold)",
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                color: "var(--text-primary)", marginBottom: 6,
              }}>
                Formula → Solved Example → Practice PYQs
              </div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 12,
                color: "var(--text-muted)", lineHeight: 1.7,
              }}>
                Each topic gives you the key formula, a fully worked-out example, and real Previous Year Questions with step-by-step solutions you can reveal when ready.
              </div>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--text-muted)", opacity: 0.5, marginBottom: 14,
        }}>
          Select a Chapter
        </div>

        {/* Chapter grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {numericalMasteryData.map((ch, idx) => {
            const isHovered = hoveredChapter === ch.id;
            const completion = getChapterCompletion(ch);
            return (
              <button
                key={ch.id}
                onClick={() => selectChapter(ch)}
                onMouseEnter={() => setHoveredChapter(ch.id)}
                onMouseLeave={() => setHoveredChapter(null)}
                style={{
                  position: "relative",
                  background: isHovered ? "var(--bg-elevated)" : "var(--bg-surface)",
                  border: `1px solid ${isHovered ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                  borderRadius: 16,
                  padding: "24px 22px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "translateY(-3px)" : "none",
                  boxShadow: isHovered ? "0 0 0 1px var(--accent-gold-glow), 0 20px 48px -8px rgba(0,0,0,0.45)" : "none",
                  overflow: "hidden",
                  animation: `nmSlideUp 0.45s ease-out ${idx * 0.06}s both`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "var(--accent-gold-glow)",
                    border: "1px solid var(--accent-gold-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>{ch.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                      {ch.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                      {ch.topics.length} topics · {ch.topics.reduce((s, t) => s + t.pyqs.length, 0)} PYQs
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.6 }}>Mastery</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: completion > 0 ? "var(--accent-gold)" : "var(--text-muted)" }}>{completion}%</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 4, background: "var(--bg-border)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${completion}%`,
                      background: "var(--accent-gold)",
                      transition: "width 0.5s ease",
                      boxShadow: completion > 0 ? "0 0 8px var(--accent-gold-glow)" : "none",
                    }} />
                  </div>
                </div>

                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
                  color: isHovered ? "var(--accent-gold)" : "var(--text-muted)",
                  letterSpacing: "0.02em",
                  transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  transition: "all 0.3s ease",
                }}>
                  Explore chapter →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════ PHASE 2: Topics ═══════════════
  if (phase === "topics" && selectedChapter) {
    const completion = getChapterCompletion(selectedChapter);
    return (
      <div style={{ padding: "36px 24px", maxWidth: 820, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
        <style>{keyframes}</style>

        <button onClick={goBack} style={{
          background: "transparent",
          border: "1px solid var(--bg-border)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
          marginBottom: 28, padding: "8px 16px", borderRadius: 8,
          cursor: "pointer", transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >← Back to Chapters</button>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 32, flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "var(--accent-gold-glow)",
              border: "1px solid var(--accent-gold-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>{selectedChapter.icon}</div>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "-0.02em",
                color: "var(--text-primary)", margin: 0,
              }}>
                {selectedChapter.name}
              </h1>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                Select a topic to start mastering numericals
              </div>
            </div>
          </div>
          <div style={{
            background: "var(--accent-gold-glow)",
            border: "1px solid var(--accent-gold-border)",
            borderRadius: 100, padding: "6px 16px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>Mastery</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--accent-gold)", letterSpacing: "-0.01em" }}>{completion}%</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {selectedChapter.topics.map((topic, idx) => {
            const isHovered = hoveredTopic === topic.id;
            const isMastered = !!masteredTopics[topic.id];
            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic, idx)}
                onMouseEnter={() => setHoveredTopic(topic.id)}
                onMouseLeave={() => setHoveredTopic(null)}
                style={{
                  background: isHovered ? "var(--bg-elevated)" : "var(--bg-surface)",
                  border: `1px solid ${isHovered ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                  borderRadius: 14,
                  padding: "20px 22px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.25s ease",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transform: isHovered ? "translateX(4px)" : "none",
                  animation: `nmSlideUp 0.35s ease-out ${idx * 0.05}s both`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: 8,
                      background: isMastered ? "rgba(62,207,142,0.14)" : "var(--bg-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                      color: isMastered ? "var(--status-green)" : "var(--text-muted)",
                      border: `1px solid ${isMastered ? "rgba(62,207,142,0.3)" : "var(--bg-border)"}`,
                    }}>{isMastered ? "✓" : idx + 1}</span>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{topic.name}</div>
                    {isMastered && (
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                        color: "var(--status-green)", background: "rgba(62,207,142,0.1)",
                        padding: "2px 8px", borderRadius: 100,
                        border: "1px solid rgba(62,207,142,0.2)",
                        textTransform: "uppercase",
                      }}>Mastered</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 14, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>
                    <span>∫ {topic.formula.split("|")[0].trim()}</span>
                    <span>· {topic.pyqs.length} PYQ{topic.pyqs.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div style={{
                  color: isHovered ? "var(--accent-gold)" : "var(--text-muted)",
                  fontFamily: "var(--font-body)", fontSize: 18,
                  transform: isHovered ? "translateX(4px)" : "none",
                  transition: "all 0.25s ease",
                }}>→</div>
              </button>
            );
          })}
        </div>

        <div style={{
          marginTop: 28, padding: "14px 18px",
          background: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          borderRadius: 10, textAlign: "center",
          fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)",
        }}>
          {selectedChapter.topics.filter(t => masteredTopics[t.id]).length} / {selectedChapter.topics.length} topics mastered
        </div>
      </div>
    );
  }

  // ═══════════════ PHASE 3: Numerical Card ═══════════════
  if (phase === "numerical" && selectedTopic && selectedChapter) {
    const isMastered = !!masteredTopics[selectedTopic.id];
    const isLastTopic = topicIndex >= selectedChapter.topics.length - 1;

    return (
      <div style={{ padding: "36px 24px", maxWidth: 820, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh", position: "relative" }}>
        <style>{keyframes}</style>

        <button onClick={goBack} style={{
          background: "transparent",
          border: "1px solid var(--bg-border)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
          marginBottom: 20, padding: "8px 16px", borderRadius: 8,
          cursor: "pointer", transition: "all 0.2s ease",
        }}>← Back to Topics</button>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28, flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent-gold)", opacity: 0.8, marginBottom: 6 }}>
              {selectedChapter.name}
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: 28, margin: 0,
              color: "var(--text-primary)", letterSpacing: "-0.02em",
            }}>
              {selectedTopic.name}
            </h1>
          </div>
          <div style={{
            background: "var(--accent-gold-glow)",
            border: "1px solid var(--accent-gold-border)",
            borderRadius: 100, padding: "6px 14px",
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--accent-gold)",
            letterSpacing: "0.04em",
          }}>
            {topicIndex + 1} / {selectedChapter.topics.length}
          </div>
        </div>

        {/* Formula card */}
        <div style={{
          position: "relative",
          background: "var(--bg-surface)",
          border: "1px solid var(--accent-gold-border)",
          borderRadius: 18,
          padding: "30px 28px",
          marginBottom: 22,
          overflow: "hidden",
          animation: "nmSlideUp 0.45s ease-out",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)" }} />
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--accent-gold)", marginBottom: 14,
          }}>
            Formula
          </div>
          <div style={{
            fontFamily: "var(--font-tagline)",
            fontSize: 32, color: "var(--text-primary)",
            letterSpacing: "0.02em", lineHeight: 1.4, marginBottom: 12,
            textShadow: "0 0 20px var(--accent-gold-glow)",
          }}>
            {selectedTopic.formula}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>
            {selectedTopic.formulaDescription}
          </div>
        </div>

        {/* Solved Example */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          borderRadius: 18, padding: "28px 26px",
          marginBottom: 22,
          animation: "nmSlideUp 0.45s ease-out 0.08s both",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--status-green)", marginBottom: 16,
          }}>
            Solved Example
          </div>

          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--bg-border)",
            borderRadius: 12, padding: "16px 20px", marginBottom: 18,
            borderLeft: "2px solid var(--status-green)",
          }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.7 }}>
              {selectedTopic.solvedExample.question}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {selectedTopic.solvedExample.steps.map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 14px",
                background: "var(--bg-elevated)",
                borderRadius: 10,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: "rgba(62,207,142,0.1)",
                  border: "1px solid rgba(62,207,142,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--status-green)",
                }}>{i + 1}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(62,207,142,0.08)",
            border: "1px solid rgba(62,207,142,0.25)",
            borderRadius: 12, padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--status-green)", marginBottom: 4 }}>
                Final Answer
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                {selectedTopic.solvedExample.finalAnswer}
              </div>
            </div>
          </div>
        </div>

        {/* PYQs */}
        {selectedTopic.pyqs.map((pyq, idx) => (
          <div key={idx} style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--bg-border)",
            borderRadius: 18, padding: "24px 26px", marginBottom: 16,
            animation: `nmSlideUp 0.4s ease-out ${0.16 + idx * 0.06}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--status-orange)",
              }}>
                Previous Year Question
              </div>
              <span style={{
                background: "rgba(251,146,60,0.1)",
                border: "1px solid rgba(251,146,60,0.25)",
                padding: "3px 12px", borderRadius: 100,
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--status-orange)",
                letterSpacing: "0.04em",
              }}>{pyq.year}</span>
            </div>

            <div style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--bg-border)",
              borderLeft: "2px solid var(--status-orange)",
              borderRadius: 12, padding: "14px 18px", marginBottom: 16,
            }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.7 }}>
                {pyq.question}
              </div>
            </div>

            <button
              onClick={() => togglePYQ(idx)}
              style={{
                width: "100%", padding: "12px 18px",
                background: "transparent",
                border: `1px solid ${revealedPYQs[idx] ? "var(--bg-border)" : "rgba(251,146,60,0.25)"}`,
                borderRadius: 10,
                cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                color: revealedPYQs[idx] ? "var(--text-muted)" : "var(--status-orange)",
                transition: "all 0.2s ease",
              }}
            >
              {revealedPYQs[idx] ? "▲ HIDE SOLUTION" : "▼ REVEAL SOLUTION"}
            </button>

            {revealedPYQs[idx] && (
              <div style={{ marginTop: 14, animation: "nmExpand 0.35s ease-out", overflow: "hidden" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                  {pyq.steps.map((step, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 10, alignItems: "flex-start",
                      padding: "8px 12px",
                      background: "var(--bg-elevated)",
                      borderRadius: 8,
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        background: "rgba(251,146,60,0.1)",
                        border: "1px solid rgba(251,146,60,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--status-orange)",
                      }}>{i + 1}</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{step}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: "rgba(251,146,60,0.08)",
                  border: "1px solid rgba(251,146,60,0.25)",
                  borderRadius: 10, padding: "12px 18px",
                }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--status-orange)", marginBottom: 3 }}>
                    Answer
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {pyq.finalAnswer}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Pro tip */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--accent-gold-border)",
          borderRadius: 14, padding: "18px 22px", marginBottom: 22,
          animation: "nmSlideUp 0.4s ease-out 0.3s both",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--accent-gold)", marginBottom: 6,
          }}>
            Pro Tip
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {selectedTopic.aiTip}
          </div>
        </div>

        <button
          onClick={() => toggleMastered(selectedTopic.id)}
          style={{
            width: "100%", padding: "16px 24px",
            background: isMastered ? "rgba(62,207,142,0.14)" : "var(--bg-surface)",
            border: `1px solid ${isMastered ? "rgba(62,207,142,0.45)" : "var(--bg-border)"}`,
            borderRadius: 14, cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, letterSpacing: "0.04em",
            color: isMastered ? "var(--status-green)" : "var(--text-secondary)",
            transition: "all 0.25s ease",
            marginBottom: 12,
          }}
        >
          {isMastered ? "✓ MASTERED" : "MARK AS MASTERED"}
        </button>

        <button
          onClick={goToNextTopic}
          disabled={!isMastered}
          style={{
            width: "100%", padding: "16px 24px",
            background: !isMastered ? "var(--bg-surface)" : "var(--accent-gold-glow)",
            border: `1px solid ${!isMastered ? "var(--bg-border)" : "var(--accent-gold-border)"}`,
            borderRadius: 14,
            cursor: isMastered ? "pointer" : "not-allowed",
            fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, letterSpacing: "0.04em",
            color: !isMastered ? "var(--text-disabled)" : "var(--accent-gold)",
            transition: "all 0.25s ease",
            opacity: isMastered ? 1 : 0.6,
            marginBottom: 20,
          }}
        >
          {!isMastered
            ? "MASTER THIS TOPIC TO CONTINUE"
            : isLastTopic
            ? "CHAPTER COMPLETE — BACK TO TOPICS"
            : `NEXT TOPIC → ${selectedChapter.topics[topicIndex + 1]?.name}`}
        </button>

        {/* Floating formula recap button */}
        <button
          onClick={() => setShowFormulaRecap(!showFormulaRecap)}
          style={{
            position: "fixed", bottom: 28, right: 28,
            width: 52, height: 52, borderRadius: 14,
            background: "var(--accent-gold-glow)",
            border: "1px solid var(--accent-gold-border)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: 20,
            color: "var(--accent-gold)",
            boxShadow: "0 0 24px var(--accent-gold-glow)",
            zIndex: 100,
            transition: "all 0.25s ease",
          }}
          title="Quick Formula Recap"
        >
          ∫
        </button>

        {showFormulaRecap && (
          <div style={{
            position: "fixed", bottom: 92, right: 28,
            width: 320, maxWidth: "calc(100vw - 56px)",
            background: "rgba(19,19,31,0.97)",
            border: "1px solid var(--accent-gold-border)",
            borderRadius: 16, padding: "20px 18px",
            zIndex: 100,
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
            animation: "nmSlideUp 0.25s ease-out",
          }}>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "var(--accent-gold)", marginBottom: 14,
            }}>
              All Formulas · {selectedChapter.name}
            </div>
            {selectedChapter.topics.map((t) => (
              <div key={t.id} style={{
                padding: "10px 12px", marginBottom: 6,
                background: t.id === selectedTopic.id ? "var(--accent-gold-glow)" : "var(--bg-elevated)",
                border: `1px solid ${t.id === selectedTopic.id ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                borderRadius: 10,
              }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontFamily: "var(--font-tagline)", fontSize: 14, color: "var(--text-primary)" }}>
                  {t.formula.split("|")[0].trim()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
