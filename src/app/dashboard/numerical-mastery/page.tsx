"use client";

import { useState, useEffect } from "react";
import {
  numericalMasteryData,
  type NumericalChapter,
  type NumericalTopic,
} from "@/data/numerical-mastery-data";

// ═══════════════════════════════════════
// State & Types
// ═══════════════════════════════════════
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

  const togglePYQ = (idx: number) => {
    setRevealedPYQs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleMastered = (topicId: string) => {
    setMasteredTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const getChapterCompletion = (chapter: NumericalChapter) => {
    const mastered = chapter.topics.filter((t) => masteredTopics[t.id]).length;
    return Math.round((mastered / chapter.topics.length) * 100);
  };

  const selectChapter = (ch: NumericalChapter) => {
    setSelectedChapter(ch);
    setPhase("topics");
  };

  const selectTopic = (topic: NumericalTopic, idx: number) => {
    setSelectedTopic(topic);
    setTopicIndex(idx);
    setRevealedPYQs({});
    setPhase("numerical");
  };

  const goBack = () => {
    if (phase === "numerical") { setPhase("topics"); setShowFormulaRecap(false); }
    else if (phase === "topics") { setPhase("chapters"); setSelectedChapter(null); }
  };

  const goToNextTopic = () => {
    if (!selectedChapter) return;
    const isLast = topicIndex >= selectedChapter.topics.length - 1;
    if (isLast) {
      // Last topic — go back to topic selection
      setPhase("topics");
      setShowFormulaRecap(false);
    } else {
      // Move to next topic
      const nextIdx = topicIndex + 1;
      const nextTopic = selectedChapter.topics[nextIdx];
      setSelectedTopic(nextTopic);
      setTopicIndex(nextIdx);
      setRevealedPYQs({});
      setShowFormulaRecap(false);
      // Scroll to top — covers both window and scrollable container
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Also scroll the nearest scrollable parent (dashboard layout)
      const scrollable = document.querySelector("[data-dashboard-content], main, [class*='overflow']");
      if (scrollable) scrollable.scrollTop = 0;
    }
  };

  if (!mounted) return null;

  // ═══════════════════════════════════════
  // CSS Keyframes (injected once)
  // ═══════════════════════════════════════
  const keyframes = `
    @keyframes glowPulse {
      0%, 100% { text-shadow: 0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.2); }
      50% { text-shadow: 0 0 30px rgba(59,130,246,0.6), 0 0 60px rgba(59,130,246,0.3), 0 0 80px rgba(6,182,212,0.2); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes expandIn {
      from { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
      to { opacity: 1; max-height: 600px; padding-top: 20px; padding-bottom: 20px; }
    }
    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(10px, -15px) scale(1.05); }
      66% { transform: translate(-8px, 8px) scale(0.95); }
    }
    @keyframes cardEntry {
      from { opacity: 0; transform: translateY(24px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;

  // ═══════════════════════════════════════
  // PHASE 1: Chapter Selection
  // ═══════════════════════════════════════
  if (phase === "chapters") {
    return (
      <div style={{ padding: "32px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <style>{keyframes}</style>

        {/* Hero Banner */}
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.05), rgba(139,92,246,0.06))",
          border: "1px solid rgba(59,130,246,0.18)",
          borderRadius: 28,
          padding: "52px 40px",
          marginBottom: 40,
          overflow: "hidden",
        }}>
          {/* Animated orbs */}
          <div style={{ position: "absolute", top: -80, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)", pointerEvents: "none", animation: "orbFloat 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: -50, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)", pointerEvents: "none", animation: "orbFloat 10s ease-in-out infinite 2s" }} />
          <div style={{ position: "absolute", top: "40%", left: "60%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)", pointerEvents: "none", animation: "orbFloat 12s ease-in-out infinite 4s" }} />

          {/* Top gradient line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #3B82F6, #06B6D4, transparent)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, boxShadow: "0 8px 32px rgba(59,130,246,0.35)",
                animation: "float 3s ease-in-out infinite",
              }}>⚡</div>
              <div>
                <h1 style={{
                  fontSize: 34, fontWeight: 900, margin: 0, letterSpacing: -0.5,
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4, #8B5CF6)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}>
                  Physics Numerical Mastery
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: 14, margin: "6px 0 0", letterSpacing: 0.3 }}>
                  Master every formula. Solve every numerical. Ace your exam.
                </p>
              </div>
            </div>

            {/* Info banner */}
            <div style={{
              background: "rgba(0,0,0,0.35)",
              borderRadius: 16,
              padding: "22px 26px",
              marginTop: 24,
              borderLeft: "4px solid #3B82F6",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>🧮</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>
                    Formula → Solved Example → Practice PYQs
                  </div>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.8 }}>
                    Each topic gives you the <span style={{ color: "#3B82F6", fontWeight: 600 }}>key formula</span>,
                    a fully worked-out solved example, and real <span style={{ color: "#06B6D4", fontWeight: 600 }}>Previous Year Questions</span> with
                    step-by-step solutions you can reveal when ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Grid */}
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#FFF", marginBottom: 20, letterSpacing: 0.3, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 4, height: 20, borderRadius: 4, background: "linear-gradient(180deg, #3B82F6, #06B6D4)" }} />
          Select Chapter
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
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
                  background: isHovered
                    ? `linear-gradient(135deg, ${ch.color}14, ${ch.color}08)`
                    : "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                  border: `1px solid ${isHovered ? ch.color + "40" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 22,
                  padding: "30px 26px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "translateY(-5px)" : "none",
                  boxShadow: isHovered
                    ? `0 16px 40px ${ch.color}20, 0 0 0 1px ${ch.color}15`
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  animation: `cardEntry 0.5s ease-out ${idx * 0.08}s both`,
                }}
              >
                {/* Corner glow */}
                {isHovered && (
                  <div style={{
                    position: "absolute", top: -30, right: -30,
                    width: 120, height: 120, borderRadius: "50%",
                    background: `radial-gradient(circle, ${ch.color}25, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                )}

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                    <div style={{
                      width: 58, height: 58, borderRadius: 18,
                      background: `linear-gradient(135deg, ${ch.color}20, ${ch.color}08)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28, border: `1px solid ${ch.color}25`,
                      boxShadow: isHovered ? `0 4px 16px ${ch.color}20` : "none",
                      transition: "all 0.3s ease",
                    }}>{ch.icon}</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#FFF", lineHeight: 1.3 }}>{ch.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                        {ch.topics.length} Topics • {ch.topics.reduce((sum, t) => sum + t.pyqs.length, 0)} PYQs
                      </div>
                    </div>
                  </div>

                  {/* Completion bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Mastery</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: completion > 0 ? ch.color : "#4B5563" }}>{completion}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4, width: `${completion}%`,
                        background: `linear-gradient(90deg, ${ch.color}, ${ch.color}CC)`,
                        transition: "width 0.5s ease",
                        boxShadow: completion > 0 ? `0 0 8px ${ch.color}40` : "none",
                      }} />
                    </div>
                  </div>

                  <div style={{
                    fontSize: 12, fontWeight: 600, color: ch.color,
                    padding: "10px 18px", background: `${ch.color}0D`, borderRadius: 12,
                    textAlign: "center", border: `1px solid ${ch.color}18`,
                    transition: "all 0.3s ease",
                  }}>
                    Explore Chapter →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // PHASE 2: Topic Selection
  // ═══════════════════════════════════════
  if (phase === "topics" && selectedChapter) {
    const completion = getChapterCompletion(selectedChapter);
    return (
      <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
        <style>{keyframes}</style>

        {/* Back button */}
        <button onClick={goBack} style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          color: "#9CA3AF", cursor: "pointer", fontSize: 13, fontWeight: 600,
          marginBottom: 30, display: "flex", alignItems: "center", gap: 8,
          padding: "10px 18px", borderRadius: 12,
          transition: "all 0.2s ease",
        }}>← Back to Chapters</button>

        {/* Chapter header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 36, flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: `linear-gradient(135deg, ${selectedChapter.color}25, ${selectedChapter.color}10)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, border: `1px solid ${selectedChapter.color}25`,
              boxShadow: `0 8px 28px ${selectedChapter.color}18`,
            }}>{selectedChapter.icon}</div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFF", margin: 0 }}>
                {selectedChapter.name}
              </h1>
              <p style={{ color: "#9CA3AF", fontSize: 14, margin: "4px 0 0" }}>
                Select a topic to start mastering numericals
              </p>
            </div>
          </div>
          {/* Chapter completion pill */}
          <div style={{
            background: `${selectedChapter.color}12`, border: `1px solid ${selectedChapter.color}25`,
            borderRadius: 100, padding: "8px 20px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Chapter Mastery</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: selectedChapter.color }}>{completion}%</span>
          </div>
        </div>

        {/* Topic cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {selectedChapter.topics.map((topic, idx) => {
            const isHovered = hoveredTopic === topic.id;
            const isMastered = masteredTopics[topic.id];
            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic, idx)}
                onMouseEnter={() => setHoveredTopic(topic.id)}
                onMouseLeave={() => setHoveredTopic(null)}
                style={{
                  position: "relative",
                  background: isHovered
                    ? `linear-gradient(135deg, ${selectedChapter.color}0A, ${selectedChapter.color}05)`
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isHovered ? selectedChapter.color + "35" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 18,
                  padding: "24px 26px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transform: isHovered ? "translateX(6px)" : "none",
                  boxShadow: isHovered ? `0 8px 24px ${selectedChapter.color}12` : "none",
                  animation: `slideUp 0.4s ease-out ${idx * 0.06}s both`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: isMastered
                        ? "linear-gradient(135deg, #10B981, #059669)"
                        : `linear-gradient(135deg, ${selectedChapter.color}20, ${selectedChapter.color}08)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, color: isMastered ? "#FFF" : selectedChapter.color,
                      border: `1px solid ${isMastered ? "#10B981" : selectedChapter.color}20`,
                      transition: "all 0.3s ease",
                    }}>{isMastered ? "✓" : idx + 1}</span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>{topic.name}</div>
                    {isMastered && <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981", background: "rgba(16,185,129,0.12)", padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(16,185,129,0.2)" }}>MASTERED</span>}
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6B7280" }}>
                    <span>🧮 {topic.formula.split("|")[0].trim()}</span>
                    <span>📝 {topic.pyqs.length} PYQ{topic.pyqs.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: `linear-gradient(135deg, ${selectedChapter.color}20, ${selectedChapter.color}0A)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: selectedChapter.color, fontWeight: 700,
                  border: `1px solid ${selectedChapter.color}20`,
                  transition: "all 0.3s ease",
                  transform: isHovered ? "translateX(4px)" : "none",
                }}>→</div>
              </button>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div style={{
          marginTop: 32, padding: "16px 20px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, textAlign: "center",
          fontSize: 13, color: "#6B7280",
        }}>
          Topic {selectedChapter.topics.filter(t => masteredTopics[t.id]).length} / {selectedChapter.topics.length} mastered
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // PHASE 3: Interactive Numerical Card
  // ═══════════════════════════════════════
  if (phase === "numerical" && selectedTopic && selectedChapter) {
    const isMastered = masteredTopics[selectedTopic.id];

    return (
      <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto", position: "relative" }}>
        <style>{keyframes}</style>

        {/* Back button */}
        <button onClick={goBack} style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          color: "#9CA3AF", cursor: "pointer", fontSize: 13, fontWeight: 600,
          marginBottom: 24, display: "flex", alignItems: "center", gap: 8,
          padding: "10px 18px", borderRadius: 12,
          transition: "all 0.2s ease",
        }}>← Back to Topics</button>

        {/* Topic header with progress */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 32, flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: selectedChapter.color, fontWeight: 600, opacity: 0.8 }}>
                {selectedChapter.name}
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#FFF", margin: 0 }}>
              {selectedTopic.name}
            </h1>
          </div>
          <div style={{
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 100, padding: "8px 18px",
            fontSize: 13, fontWeight: 700, color: "#3B82F6",
          }}>
            Topic {topicIndex + 1} / {selectedChapter.topics.length}
          </div>
        </div>

        {/* ═══ FORMULA SECTION ═══ */}
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.05))",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 24,
          padding: "36px 32px",
          marginBottom: 28,
          overflow: "hidden",
          animation: "slideUp 0.5s ease-out",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🧮</span> Formula
          </div>

          <div style={{
            fontSize: 36, fontWeight: 900, color: "#FFF",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: 2,
            animation: "glowPulse 3s ease-in-out infinite",
            marginBottom: 14,
            lineHeight: 1.4,
          }}>
            {selectedTopic.formula}
          </div>

          <p style={{ fontSize: 14, color: "#9CA3AF", margin: 0, lineHeight: 1.6 }}>
            {selectedTopic.formulaDescription}
          </p>
        </div>

        {/* ═══ SOLVED EXAMPLE ═══ */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 22,
          padding: "32px 28px",
          marginBottom: 28,
          animation: "slideUp 0.5s ease-out 0.1s both",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: 2, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📘</span> Solved Example
          </div>

          {/* Question */}
          <div style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 22,
          }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", margin: 0, lineHeight: 1.7 }}>
              {selectedTopic.solvedExample.question}
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {selectedTopic.solvedExample.steps.map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: 12,
                borderLeft: "3px solid rgba(16,185,129,0.3)",
              }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#10B981",
                }}>{i + 1}</span>
                <span style={{ fontSize: 14, color: "#D1D5DB", lineHeight: 1.6 }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Final Answer */}
          <div style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))",
            border: "2px solid rgba(16,185,129,0.3)",
            borderRadius: 16,
            padding: "18px 24px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Final Answer</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#FFF" }}>{selectedTopic.solvedExample.finalAnswer}</div>
            </div>
          </div>
        </div>

        {/* ═══ PYQ SECTION ═══ */}
        {selectedTopic.pyqs.map((pyq, idx) => (
          <div key={idx} style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 22,
            padding: "28px 28px",
            marginBottom: 20,
            animation: `slideUp 0.5s ease-out ${0.2 + idx * 0.08}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 2, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🎯</span> Previous Year Question
              </div>
              <span style={{
                background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)",
                padding: "4px 14px", borderRadius: 100,
                fontSize: 12, fontWeight: 700, color: "#F59E0B",
              }}>📅 {pyq.year}</span>
            </div>

            {/* PYQ Question */}
            <div style={{
              background: "rgba(245,158,11,0.05)",
              border: "1px solid rgba(245,158,11,0.12)",
              borderRadius: 14,
              padding: "18px 22px",
              marginBottom: 18,
            }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", margin: 0, lineHeight: 1.7 }}>
                {pyq.question}
              </p>
            </div>

            {/* Reveal Button */}
            <button
              onClick={() => togglePYQ(idx)}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: revealedPYQs[idx]
                  ? "rgba(245,158,11,0.08)"
                  : "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.06))",
                border: `1px solid rgba(245,158,11,${revealedPYQs[idx] ? "0.15" : "0.25"})`,
                borderRadius: 14,
                cursor: "pointer",
                fontSize: 14, fontWeight: 700,
                color: "#F59E0B",
                transition: "all 0.3s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {revealedPYQs[idx] ? "▲ Hide Solution" : "▼ Reveal Answer"}
            </button>

            {/* Revealed solution with smooth expand */}
            {revealedPYQs[idx] && (
              <div style={{
                marginTop: 16,
                animation: "expandIn 0.4s ease-out",
                overflow: "hidden",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {pyq.steps.map((step, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 12, alignItems: "flex-start",
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 10,
                      borderLeft: "3px solid rgba(245,158,11,0.25)",
                    }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                        background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: "#F59E0B",
                      }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.6 }}>{step}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))",
                  border: "2px solid rgba(245,158,11,0.25)",
                  borderRadius: 14,
                  padding: "14px 20px",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>⚡</span>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Answer</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#FFF" }}>{pyq.finalAnswer}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ═══ AI TIP BOX ═══ */}
        <div style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.04))",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 18,
          padding: "22px 24px",
          marginBottom: 24,
          display: "flex", alignItems: "flex-start", gap: 14,
          animation: "slideUp 0.5s ease-out 0.4s both",
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Pro Tip</div>
            <p style={{ fontSize: 13, color: "#C4B5FD", margin: 0, lineHeight: 1.7 }}>
              {selectedTopic.aiTip}
            </p>
          </div>
        </div>

        {/* ═══ MARK AS MASTERED ═══ */}
        <button
          onClick={() => toggleMastered(selectedTopic.id)}
          style={{
            width: "100%",
            padding: "18px 24px",
            background: isMastered
              ? "linear-gradient(135deg, #10B981, #059669)"
              : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            border: `2px solid ${isMastered ? "#10B981" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 18,
            cursor: "pointer",
            fontSize: 16, fontWeight: 700,
            color: isMastered ? "#FFF" : "#9CA3AF",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: isMastered ? "0 8px 24px rgba(16,185,129,0.25)" : "none",
            marginBottom: 14,
          }}
        >
          {isMastered ? "✓ Mastered!" : "☐ Mark as Mastered"}
        </button>

        {/* ═══ NEXT TOPIC / CHAPTER MASTERED BUTTON ═══ */}
        {(() => {
          const isLastTopic = topicIndex >= selectedChapter.topics.length - 1;
          return (
            <button
              onClick={goToNextTopic}
              disabled={!isMastered}
              style={{
                width: "100%",
                padding: "18px 24px",
                background: !isMastered
                  ? "rgba(255,255,255,0.02)"
                  : isLastTopic
                  ? "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.08))"
                  : "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.08))",
                border: `2px solid ${
                  !isMastered
                    ? "rgba(255,255,255,0.06)"
                    : isLastTopic
                    ? "rgba(139,92,246,0.35)"
                    : "rgba(59,130,246,0.35)"
                }`,
                borderRadius: 18,
                cursor: isMastered ? "pointer" : "not-allowed",
                fontSize: 16, fontWeight: 700,
                color: !isMastered
                  ? "#4B5563"
                  : isLastTopic
                  ? "#A78BFA"
                  : "#60A5FA",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: isMastered
                  ? isLastTopic
                    ? "0 6px 20px rgba(139,92,246,0.2)"
                    : "0 6px 20px rgba(59,130,246,0.2)"
                  : "none",
                opacity: isMastered ? 1 : 0.5,
                marginBottom: 20,
              }}
            >
              {!isMastered
                ? "🔒 Master this topic to continue"
                : isLastTopic
                ? "🏆 Chapter Mastered — Back to Topics"
                : `Next Topic → ${selectedChapter.topics[topicIndex + 1]?.name}`}
            </button>
          );
        })()}

        {/* ═══ QUICK FORMULA RECAP (Floating) ═══ */}
        <button
          onClick={() => setShowFormulaRecap(!showFormulaRecap)}
          style={{
            position: "fixed", bottom: 28, right: 28,
            width: 56, height: 56, borderRadius: 18,
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, color: "#FFF",
            boxShadow: "0 8px 28px rgba(59,130,246,0.4)",
            zIndex: 100,
            transition: "all 0.3s ease",
            animation: "float 3s ease-in-out infinite",
          }}
          title="Quick Formula Recap"
        >
          🧮
        </button>

        {showFormulaRecap && (
          <div style={{
            position: "fixed", bottom: 96, right: 28,
            width: 320, maxWidth: "calc(100vw - 56px)",
            background: "rgba(15,15,25,0.97)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 20,
            padding: "24px 22px",
            zIndex: 100,
            boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)",
            backdropFilter: "blur(20px)",
            animation: "slideUp 0.3s ease-out",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
              📋 All Formulas — {selectedChapter.name}
            </div>
            {selectedChapter.topics.map((t) => (
              <div key={t.id} style={{
                padding: "10px 14px", marginBottom: 8,
                background: t.id === selectedTopic.id ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${t.id === selectedTopic.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)"}`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{t.name}</div>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: "#FFF",
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                }}>{t.formula.split("|")[0].trim()}</div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ STICKY FORMULA BANNER ═══ */}
        <div style={{
          position: "sticky", bottom: 0,
          background: "linear-gradient(135deg, rgba(10,10,18,0.95), rgba(15,15,28,0.95))",
          borderTop: "1px solid rgba(59,130,246,0.15)",
          backdropFilter: "blur(16px)",
          padding: "14px 24px",
          borderRadius: "18px 18px 0 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          zIndex: 50,
          marginLeft: -24, marginRight: -24,
        }}>
          <div>
            <div style={{ fontSize: 10, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1 }}>Current Formula</div>
            <div style={{
              fontSize: 18, fontWeight: 800, color: "#FFF",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              textShadow: "0 0 15px rgba(59,130,246,0.3)",
            }}>{selectedTopic.formula.split("|")[0].trim()}</div>
          </div>
          <div style={{
            background: isMastered ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.12)",
            border: `1px solid ${isMastered ? "rgba(16,185,129,0.25)" : "rgba(59,130,246,0.2)"}`,
            padding: "6px 14px", borderRadius: 100,
            fontSize: 11, fontWeight: 700,
            color: isMastered ? "#10B981" : "#3B82F6",
          }}>
            {isMastered ? "✓ Mastered" : `Topic ${topicIndex + 1}/${selectedChapter.topics.length}`}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
