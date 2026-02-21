"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { physicsQuestions } from "@/data/precision-physics";
import { mathsQuestions } from "@/data/precision-maths";
import {
  PrecisionQuestion,
  PrecisionSubject,
  PrecisionTestResult,
  QuestionResult,
  TIME_PER_MARK,
  OVERTIME_GRACE_SECONDS,
  calculateAnalytics,
} from "@/data/precision-config";

// =============================================
// SUBJECT + QUESTION INDEX
// =============================================
const ALL_QUESTIONS: Record<string, PrecisionQuestion[]> = {
  Physics: physicsQuestions,
  Mathematics: mathsQuestions,
};

const SUBJECTS: PrecisionSubject[] = [
  {
    id: "Physics",
    name: "Physics",
    icon: "⚡",
    color: "#F59E0B",
    chapters: [
      { id: "Force, Work, Power & Energy", name: "Force, Work, Power & Energy" },
      { id: "Light", name: "Light" },
      { id: "Electricity", name: "Electricity" },
    ],
  },
  {
    id: "Mathematics",
    name: "Mathematics",
    icon: "🔢",
    color: "#3B82F6",
    chapters: [
      { id: "GST", name: "GST" },
      { id: "Banking", name: "Banking" },
      { id: "Shares and Dividends", name: "Shares and Dividends" },
      { id: "Linear Inequations", name: "Linear Inequations" },
      { id: "Quadratic Equations", name: "Quadratic Equations" },
      { id: "Factorisation", name: "Factorisation" },
      { id: "Matrices", name: "Matrices" },
      { id: "Arithmetic Progression", name: "Arithmetic Progression" },
      { id: "Geometric Progression", name: "Geometric Progression" },
      { id: "Ratio and Proportion", name: "Ratio and Proportion" },
      { id: "Coordinate Geometry", name: "Coordinate Geometry" },
      { id: "Coordinate Geometry (Slope & Equation)", name: "Slope & Equation of Line" },
      { id: "Similarity", name: "Similarity" },
      { id: "Circles", name: "Circles" },
      { id: "Trigonometry", name: "Trigonometry" },
      { id: "Heights and Distances", name: "Heights and Distances" },
      { id: "Mensuration", name: "Mensuration" },
      { id: "Statistics", name: "Statistics" },
      { id: "Probability", name: "Probability" },
      { id: "Direct and Inverse Variation", name: "Direct and Inverse Variation" },
    ],
  },
  {
    id: "Chemistry",
    name: "Chemistry",
    icon: "🧪",
    color: "#10B981",
    chapters: [],
  },
  {
    id: "Biology",
    name: "Biology",
    icon: "🧬",
    color: "#EC4899",
    chapters: [],
  },
];

function getChapterQuestions(subject: string, chapter: string): PrecisionQuestion[] {
  return (ALL_QUESTIONS[subject] || []).filter((q) => q.chapter === chapter);
}

function getChapterStats(subject: string, chapter: string) {
  const questions = getChapterQuestions(subject, chapter);
  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);
  const totalTime = questions.reduce((s, q) => s + (TIME_PER_MARK[q.marks] || 60), 0);
  return { count: questions.length, totalMarks, totalTime };
}

function formatSec(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Phase = "subject" | "chapter" | "countdown" | "test" | "analytics";

export default function CompetencyTestPage() {
  const [phase, setPhase] = useState<Phase>("subject");
  const [selectedSubject, setSelectedSubject] = useState<PrecisionSubject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [questions, setQuestions] = useState<PrecisionQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // idx → option
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({}); // idx → seconds taken
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [result, setResult] = useState<PrecisionTestResult | null>(null);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ===== COUNTDOWN =====
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("test");
      setCurrentIdx(0);
      setAnswers({});
      setQuestionTimes({});
      const q = questions[0];
      setTimeLeft((TIME_PER_MARK[q.marks] || 60) + OVERTIME_GRACE_SECONDS);
      setQuestionStartTime(Date.now());
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown, questions]);

  // ===== PER-QUESTION TIMER =====
  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) {
      // Auto-advance: save current time and go next
      recordTimeAndAdvance();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  const recordTimeAndAdvance = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const elapsed = Math.round((Date.now() - questionStartTime) / 1000);
    setQuestionTimes((prev) => ({ ...prev, [currentIdx]: prev[currentIdx] ?? elapsed }));

    if (currentIdx < questions.length - 1) {
      const nextQ = questions[currentIdx + 1];
      setCurrentIdx(currentIdx + 1);
      setTimeLeft((TIME_PER_MARK[nextQ.marks] || 60) + OVERTIME_GRACE_SECONDS);
      setQuestionStartTime(Date.now());
    } else {
      finishTest(elapsed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, questions, questionStartTime, questionTimes, answers]);

  const handleNext = useCallback(() => {
    if (answers[currentIdx] === undefined) return;
    recordTimeAndAdvance();
  }, [currentIdx, answers, recordTimeAndAdvance]);

  const handleBack = useCallback(() => {
    if (currentIdx <= 0) return;
    // Save current time
    const elapsed = Math.round((Date.now() - questionStartTime) / 1000);
    setQuestionTimes((prev) => ({ ...prev, [currentIdx]: prev[currentIdx] ?? elapsed }));
    if (timerRef.current) clearTimeout(timerRef.current);

    const prevQ = questions[currentIdx - 1];
    setCurrentIdx(currentIdx - 1);
    // Give remaining or fresh time for prev question
    const prevAllotted = (TIME_PER_MARK[prevQ.marks] || 60) + OVERTIME_GRACE_SECONDS;
    const prevUsed = questionTimes[currentIdx - 1] || 0;
    setTimeLeft(Math.max(10, prevAllotted - prevUsed));
    setQuestionStartTime(Date.now());
  }, [currentIdx, questions, questionStartTime, questionTimes]);

  const finishTest = useCallback((lastElapsed?: number) => {
    const finalTimes = { ...questionTimes };
    if (lastElapsed !== undefined) finalTimes[currentIdx] = finalTimes[currentIdx] ?? lastElapsed;

    const qResults: QuestionResult[] = questions.map((q, idx) => {
      const allotted = TIME_PER_MARK[q.marks] || 60;
      const timeTaken = finalTimes[idx] || allotted;
      const selected = answers[idx] ?? null;
      const isCorrect = selected === q.correctAnswer;
      return {
        questionId: q.id,
        chapter: q.chapter,
        year: q.year,
        marks: q.marks,
        allottedTime: allotted,
        actualTimeTaken: timeTaken,
        timeDeviation: timeTaken - allotted,
        isCorrect,
        marksEarned: isCorrect ? q.marks : 0,
        selectedAnswer: selected,
      };
    });

    const analytics = calculateAnalytics(qResults, selectedSubject?.name || "", selectedChapter);
    setResult(analytics);
    setPhase("analytics");
  }, [questions, answers, questionTimes, currentIdx, selectedSubject, selectedChapter]);

  const startTest = useCallback((subject: PrecisionSubject, chapter: string) => {
    const qs = getChapterQuestions(subject.id, chapter);
    if (qs.length === 0) return;
    setSelectedSubject(subject);
    setSelectedChapter(chapter);
    setQuestions(qs);
    setCountdown(5);
    setPhase("countdown");
  }, []);

  const resetAll = () => {
    setPhase("subject");
    setSelectedSubject(null);
    setSelectedChapter("");
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setQuestionTimes({});
    setTimeLeft(0);
    setResult(null);
    setCountdown(5);
  };

  // =============================================
  // SUBJECT SELECTION — Premium Hero Screen
  // =============================================
  if (phase === "subject") {
    return (
      <div style={{ padding: "32px 24px", maxWidth: 1000, margin: "0 auto" }}>
        {/* Hero */}
        <div
          style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(239,68,68,0.04), rgba(139,92,246,0.06))",
            border: "1px solid rgba(245,158,11,0.15)",
            borderRadius: 24,
            padding: "48px 36px",
            marginBottom: 36,
            overflow: "hidden",
          }}
        >
          {/* Glow orbs */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, boxShadow: "0 8px 32px rgba(245,158,11,0.3)",
              }}>⚡</div>
              <div>
                <h1 style={{
                  fontSize: 30, fontWeight: 900, margin: 0,
                  background: "linear-gradient(135deg, #F59E0B, #EF4444, #8B5CF6)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Competency Based Test
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0 }}>Train accuracy × speed under real exam pressure</p>
              </div>
            </div>

            {/* Context Banner */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: 14,
              padding: "20px 24px",
              marginTop: 20,
              borderLeft: "4px solid #F59E0B",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>📚</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FFF", marginBottom: 6 }}>
                    20 Years of Past Papers — Handpicked & Curated
                  </div>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.7 }}>
                    Every question is handpicked from <span style={{ color: "#F59E0B", fontWeight: 600 }}>20 years of ICSE board papers</span> and 
                    mapped to specific competencies. Each question is timed based on its mark weightage — training you to 
                    think fast and answer accurately, just like the real exam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Rules — Compact Pill Bar */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {[
            { marks: "1 Mark", time: "60s", color: "#10B981" },
            { marks: "2 Marks", time: "2m 30s", color: "#3B82F6" },
            { marks: "3 Marks", time: "4m", color: "#8B5CF6" },
            { marks: "4 Marks", time: "5m 30s", color: "#F59E0B" },
          ].map((r) => (
            <div key={r.marks} style={{
              background: `${r.color}12`, border: `1px solid ${r.color}30`,
              borderRadius: 100, padding: "8px 18px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>{r.marks}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>→ {r.time}</span>
            </div>
          ))}
        </div>

        {/* Subject Grid — Premium Cards */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FFF", marginBottom: 16, letterSpacing: 0.5 }}>
          Choose Your Subject
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {SUBJECTS.map((sub) => {
            const totalQs = (ALL_QUESTIONS[sub.id] || []).length;
            const hasData = totalQs > 0;
            const isHovered = hoveredSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  if (hasData) { setSelectedSubject(sub); setPhase("chapter"); }
                }}
                onMouseEnter={() => setHoveredSubject(sub.id)}
                onMouseLeave={() => setHoveredSubject(null)}
                disabled={!hasData}
                style={{
                  position: "relative",
                  background: isHovered && hasData
                    ? `linear-gradient(135deg, ${sub.color}15, ${sub.color}08)`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isHovered && hasData ? sub.color + "40" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 18,
                  padding: "28px 22px",
                  cursor: hasData ? "pointer" : "not-allowed",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  transform: isHovered && hasData ? "translateY(-3px)" : "none",
                  boxShadow: isHovered && hasData ? `0 12px 32px ${sub.color}18` : "none",
                  opacity: hasData ? 1 : 0.35,
                  overflow: "hidden",
                }}
              >
                {/* Decorative glow */}
                {isHovered && hasData && (
                  <div style={{
                    position: "absolute", top: -20, right: -20,
                    width: 100, height: 100, borderRadius: "50%",
                    background: `radial-gradient(circle, ${sub.color}20, transparent 70%)`,
                    pointerEvents: "none",
                  }} />
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: `linear-gradient(135deg, ${sub.color}25, ${sub.color}10)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, border: `1px solid ${sub.color}20`,
                    }}>{sub.icon}</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#FFF" }}>{sub.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {hasData ? `${totalQs} Questions • ${sub.chapters.length} Chapters` : "Coming Soon"}
                      </div>
                    </div>
                  </div>
                  {hasData && (
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: sub.color,
                      padding: "10px 16px", background: `${sub.color}10`, borderRadius: 10,
                      textAlign: "center", border: `1px solid ${sub.color}15`,
                    }}>
                      Start Practice →
                    </div>
                  )}
                  {!hasData && (
                    <div style={{
                      fontSize: 12, color: "#4B5563",
                      padding: "10px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 10,
                      textAlign: "center",
                    }}>
                      🔒 Questions coming soon
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =============================================
  // CHAPTER SELECTION
  // =============================================
  if (phase === "chapter" && selectedSubject) {
    return (
      <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => setPhase("subject")} style={{
          background: "none", border: "none", color: "#9CA3AF", cursor: "pointer",
          fontSize: 14, marginBottom: 28, display: "flex", alignItems: "center", gap: 6,
          transition: "color 0.2s",
        }}>← Back to Subjects</button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: `linear-gradient(135deg, ${selectedSubject.color}25, ${selectedSubject.color}10)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, border: `1px solid ${selectedSubject.color}20`,
            boxShadow: `0 8px 24px ${selectedSubject.color}15`,
          }}>{selectedSubject.icon}</div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#FFF", margin: 0 }}>
              {selectedSubject.name}
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: 14, margin: 0 }}>
              Select a chapter to begin your timed test
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selectedSubject.chapters.map((ch) => {
            const stats = getChapterStats(selectedSubject.id, ch.id);
            const hasQ = stats.count > 0;
            const isHovered = hoveredChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => hasQ && startTest(selectedSubject, ch.id)}
                onMouseEnter={() => setHoveredChapter(ch.id)}
                onMouseLeave={() => setHoveredChapter(null)}
                disabled={!hasQ}
                style={{
                  background: isHovered && hasQ
                    ? `linear-gradient(135deg, ${selectedSubject.color}08, ${selectedSubject.color}04)`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isHovered && hasQ ? selectedSubject.color + "30" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 16, padding: "22px 24px",
                  cursor: hasQ ? "pointer" : "not-allowed",
                  textAlign: "left", transition: "all 0.3s ease",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  opacity: hasQ ? 1 : 0.35,
                  transform: isHovered && hasQ ? "translateX(4px)" : "none",
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>{ch.name}</div>
                  <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                    <span style={{ color: selectedSubject.color, fontWeight: 600 }}>📝 {stats.count} Qs</span>
                    <span style={{ color: "#9CA3AF" }}>⭐ {stats.totalMarks} Marks</span>
                    <span style={{ color: "#9CA3AF" }}>⏱ {formatSec(stats.totalTime)}</span>
                  </div>
                </div>
                {hasQ && (
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `linear-gradient(135deg, ${selectedSubject.color}20, ${selectedSubject.color}10)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: selectedSubject.color, fontWeight: 700,
                    border: `1px solid ${selectedSubject.color}20`,
                  }}>→</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =============================================
  // FOCUS COUNTDOWN
  // =============================================
  if (phase === "countdown") {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at center, #0E0E1A 0%, #030303 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}>
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          fontSize: 16, fontWeight: 700, color: "#F59E0B", letterSpacing: 6,
          textTransform: "uppercase", marginBottom: 40, opacity: 0.8,
        }}>
          Focus — Exam Mode
        </div>
        <div key={countdown} style={{
          fontSize: 180, fontWeight: 900, color: "#FFF", fontFamily: "monospace",
          lineHeight: 1, textShadow: "0 0 80px rgba(245,158,11,0.3), 0 0 160px rgba(245,158,11,0.15)",
          animation: "countPulse 1s ease-out",
        }}>{countdown}</div>
        <div style={{ fontSize: 13, color: "#4B5563", marginTop: 32, letterSpacing: 1 }}>
          {selectedSubject?.name} — {selectedChapter}
        </div>
        <style jsx>{`
          @keyframes countPulse {
            0% { transform: scale(1.5); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // =============================================
  // TIMED TEST — No answer reveal, Next/Back nav
  // =============================================
  if (phase === "test" && questions[currentIdx]) {
    const q = questions[currentIdx];
    const allotted = TIME_PER_MARK[q.marks] || 60;
    const isOvertime = timeLeft <= OVERTIME_GRACE_SECONDS;
    const isCritical = timeLeft <= 10;
    const hasAnswered = answers[currentIdx] !== undefined;
    const isLast = currentIdx === questions.length - 1;
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
      <div style={{ minHeight: "100vh", background: "#030303" }}>
        {/* Top Bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50,
          background: isCritical
            ? "linear-gradient(135deg, #1A0808, #120505)"
            : isOvertime
            ? "linear-gradient(135deg, #1A1408, #120E04)"
            : "linear-gradient(135deg, #0E0E1A, #0A0A14)",
          borderBottom: `1px solid ${isCritical ? "rgba(239,68,68,0.4)" : isOvertime ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}`,
          padding: "12px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)",
              padding: "5px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 700, color: "#F59E0B",
            }}>
              Q{currentIdx + 1} / {questions.length}
            </span>
            <span style={{
              background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)",
              padding: "5px 12px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, color: "#8B5CF6",
            }}>
              {q.marks} {q.marks === 1 ? "Mark" : "Marks"}
            </span>
            <span style={{
              background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
              padding: "5px 12px", borderRadius: 8,
              fontSize: 12, fontWeight: 600, color: "#3B82F6",
            }}>
              📅 {q.year}
            </span>
            {isOvertime && !isCritical && (
              <span style={{
                background: "rgba(245,158,11,0.15)", padding: "5px 10px",
                borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#F59E0B",
              }}>⚠ OVERTIME</span>
            )}
          </div>
          <div style={{
            fontSize: 30, fontWeight: 900, fontFamily: "monospace",
            color: isCritical ? "#EF4444" : isOvertime ? "#F59E0B" : "#FFF",
            textShadow: isCritical ? "0 0 20px rgba(239,68,68,0.5)" : "none",
            ...(isCritical ? { animation: "blink 0.6s ease-in-out infinite alternate" } : {}),
          }}>
            {formatSec(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.04)" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #F59E0B, #EF4444, #8B5CF6)",
            borderRadius: 2, transition: "width 0.5s ease",
          }} />
        </div>

        {/* Question Area */}
        <div style={{ padding: "48px 24px 32px", maxWidth: 720, margin: "0 auto" }}>
          {/* Question Text */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18, padding: "28px 28px 24px",
            marginBottom: 24,
          }}>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: "#F1F5F9",
              lineHeight: 1.7, margin: 0,
            }}>
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {q.options.map((opt, idx) => {
              const isSelected = answers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentIdx]: idx }))}
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))"
                      : "rgba(255,255,255,0.02)",
                    border: `2px solid ${isSelected ? "#F59E0B" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    color: isSelected ? "#FFF" : "#D1D5DB",
                    fontSize: 15, fontWeight: isSelected ? 600 : 400,
                    transition: "all 0.25s ease",
                    display: "flex", alignItems: "center", gap: 14,
                  }}
                >
                  <span style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: isSelected
                      ? "linear-gradient(135deg, #F59E0B, #EF4444)"
                      : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                    color: isSelected ? "#FFF" : "#9CA3AF",
                    transition: "all 0.25s ease",
                    boxShadow: isSelected ? "0 4px 12px rgba(245,158,11,0.3)" : "none",
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={handleBack}
              disabled={currentIdx === 0}
              style={{
                padding: "12px 28px",
                background: currentIdx > 0 ? "rgba(255,255,255,0.05)" : "transparent",
                border: currentIdx > 0 ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                borderRadius: 12, color: currentIdx > 0 ? "#D1D5DB" : "#4B5563",
                cursor: currentIdx > 0 ? "pointer" : "default",
                fontSize: 14, fontWeight: 600, transition: "all 0.2s",
              }}
            >
              ← Back
            </button>

            {/* Question dots */}
            <div style={{ display: "flex", gap: 5 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i === currentIdx
                    ? "#F59E0B"
                    : answers[i] !== undefined
                    ? "#10B981"
                    : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>

            <button
              onClick={isLast && hasAnswered ? () => finishTest() : handleNext}
              disabled={!hasAnswered}
              style={{
                padding: "12px 32px",
                background: hasAnswered
                  ? isLast
                    ? "linear-gradient(135deg, #10B981, #059669)"
                    : "linear-gradient(135deg, #F59E0B, #EF4444)"
                  : "rgba(255,255,255,0.04)",
                border: "none", borderRadius: 12,
                color: hasAnswered ? "#FFF" : "#4B5563",
                cursor: hasAnswered ? "pointer" : "not-allowed",
                fontSize: 14, fontWeight: 700, transition: "all 0.3s",
                boxShadow: hasAnswered ? "0 6px 20px rgba(245,158,11,0.2)" : "none",
              }}
            >
              {isLast ? "✓ Finish Test" : "Next →"}
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes blink { from { opacity: 1; } to { opacity: 0.3; } }
        `}</style>
      </div>
    );
  }

  // =============================================
  // ANALYTICS DASHBOARD — Refined
  // =============================================
  if (phase === "analytics" && result) {
    const classStyles: Record<string, { color: string; emoji: string; grad: string }> = {
      "Elite Performer": { color: "#10B981", emoji: "🏆", grad: "linear-gradient(135deg, #10B981, #059669)" },
      "Strong Performer": { color: "#3B82F6", emoji: "💪", grad: "linear-gradient(135deg, #3B82F6, #2563EB)" },
      Developing: { color: "#F59E0B", emoji: "📈", grad: "linear-gradient(135deg, #F59E0B, #D97706)" },
      "Needs Structured Practice": { color: "#EF4444", emoji: "📚", grad: "linear-gradient(135deg, #EF4444, #DC2626)" },
    };
    const cls = classStyles[result.classification] || classStyles["Developing"];

    return (
      <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
        {/* Hero Score Card */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${cls.color}08, ${cls.color}04)`,
          border: `1px solid ${cls.color}25`,
          borderRadius: 24, padding: "44px 32px", textAlign: "center",
          marginBottom: 24,
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(circle, ${cls.color}10, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${cls.color}08, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 8 }}>{cls.emoji}</div>
            <div style={{
              display: "inline-block", padding: "6px 20px", borderRadius: 100,
              background: cls.grad, fontSize: 13, fontWeight: 700, color: "#FFF",
              marginBottom: 12, letterSpacing: 0.5,
            }}>{result.classification}</div>
            <div style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 8 }}>
              {result.subject} — {result.chapter}
            </div>
            <div style={{
              fontSize: 64, fontWeight: 900, color: "#FFF", fontFamily: "monospace",
              textShadow: `0 0 40px ${cls.color}30`,
            }}>{result.predictedScore}%</div>
            <div style={{ fontSize: 12, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase" }}>
              Predicted Chapter Score
            </div>
          </div>
        </div>

        {/* Score Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20,
        }}>
          {[
            { label: "Raw Score", value: `${result.rawScore}%`, color: "#8B5CF6", icon: "📊" },
            { label: "Accuracy", value: `${result.accuracy}%`, color: "#10B981", icon: "🎯" },
            { label: "Time Efficiency", value: `${result.timeEfficiencyScore}%`, color: "#3B82F6", icon: "⏱" },
          ].map((card) => (
            <div key={card.label} style={{
              background: `${card.color}08`, border: `1px solid ${card.color}20`,
              borderRadius: 16, padding: "20px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{card.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: card.color, marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24,
        }}>
          {[
            { label: "Correct", value: `${result.correctCount}/${result.totalQuestions}`, color: "#10B981" },
            { label: "Marks Scored", value: `${result.marksScored}/${result.totalMarks}`, color: "#F59E0B" },
            { label: "Overtime", value: result.totalOvertime > 0 ? `+${formatSec(result.totalOvertime)}` : "On Time ✓", color: result.totalOvertime > 0 ? "#EF4444" : "#10B981" },
          ].map((card) => (
            <div key={card.label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "16px 14px", textAlign: "center",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Accuracy by Mark Type */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18, padding: "22px",
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#FFF", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📊</span> Accuracy by Marks
            </h3>
            {result.markBreakdown.map((mb) => (
              <div key={mb.marks} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                  <span style={{ color: "#D1D5DB" }}>{mb.marks}M ({mb.correct}/{mb.total})</span>
                  <span style={{ fontWeight: 700, color: mb.accuracy >= 75 ? "#10B981" : mb.accuracy >= 50 ? "#F59E0B" : "#EF4444" }}>
                    {Math.round(mb.accuracy)}%
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${mb.accuracy}%`, borderRadius: 3,
                    background: mb.accuracy >= 75 ? "#10B981" : mb.accuracy >= 50 ? "#F59E0B" : "#EF4444",
                    transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Time Behavior */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18, padding: "22px",
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#FFF", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⏱</span> Time Behavior
            </h3>
            {Object.entries(result.timeBehavior.avgTimePerMarkType).map(([marks, avg]) => {
              const allotted = TIME_PER_MARK[Number(marks)] || 60;
              const isOver = avg > allotted;
              return (
                <div key={marks} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "10px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>{marks}M avg</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: isOver ? "#EF4444" : "#10B981" }}>{formatSec(avg)}</span>
                    <span style={{ fontSize: 11, color: "#4B5563", marginLeft: 6 }}>/ {formatSec(allotted)}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(245,158,11,0.08)", borderRadius: 10, border: "1px solid rgba(245,158,11,0.15)" }}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Longest Question</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F59E0B" }}>{formatSec(result.timeBehavior.longestQuestionTime)}</div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(236,72,153,0.04))",
          border: "1px solid rgba(139,92,246,0.15)",
          borderRadius: 18, padding: "22px", marginBottom: 28,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#8B5CF6", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🧠</span> AI Insights
          </h3>
          {result.insights.map((insight, idx) => (
            <div key={idx} style={{
              display: "flex", gap: 10, marginBottom: 10,
              padding: "14px 16px", background: "rgba(0,0,0,0.25)",
              borderRadius: 12, borderLeft: "3px solid #8B5CF6",
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
              <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.6 }}>{insight}</span>
            </div>
          ))}
        </div>

        {/* Question Review */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18, padding: "22px", marginBottom: 28,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#FFF", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📝</span> Question Review
          </h3>
          {result.questionResults.map((qr, idx) => {
            const q = questions[idx];
            return (
              <div key={idx} style={{
                padding: "14px 16px", marginBottom: 8,
                background: qr.isCorrect ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${qr.isCorrect ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`,
                borderRadius: 12,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: qr.isCorrect ? "#10B981" : "#EF4444",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#FFF", flexShrink: 0,
                  }}>{qr.isCorrect ? "✓" : "✗"}</span>
                  <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.5 }}>
                    Q{idx + 1}. {q?.question?.substring(0, 60)}{q?.question && q.question.length > 60 ? "..." : ""}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#6B7280", padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 6 }}>
                    {formatSec(qr.actualTimeTaken)}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                    color: qr.timeDeviation > 0 ? "#EF4444" : "#10B981",
                    background: qr.timeDeviation > 0 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                  }}>
                    {qr.timeDeviation > 0 ? `+${formatSec(qr.timeDeviation)}` : formatSec(Math.abs(qr.timeDeviation)) + " saved"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", paddingBottom: 40 }}>
          <button onClick={() => startTest(selectedSubject!, selectedChapter)} style={{
            padding: "16px 36px",
            background: "linear-gradient(135deg, #F59E0B, #EF4444)",
            color: "#FFF", border: "none", borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 8px 28px rgba(245,158,11,0.25)",
            transition: "all 0.3s",
          }}>🔄 Retry Chapter</button>
          <button onClick={resetAll} style={{
            padding: "16px 36px",
            background: "rgba(139,92,246,0.1)", color: "#8B5CF6",
            border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            transition: "all 0.3s",
          }}>← Choose Another</button>
        </div>
      </div>
    );
  }

  return null;
}
