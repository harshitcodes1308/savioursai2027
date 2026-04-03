"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Dynamically import CodeMirror (client-only, no SSR)
const CodeMirrorEditor = dynamic(
  () => import("@uiw/react-codemirror").then((mod) => mod.default),
  { ssr: false }
);

function EditorWrapper({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [extensions, setExtensions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      import("@codemirror/lang-java"),
      import("@codemirror/theme-one-dark"),
    ]).then(([javaModule, themeModule]) => {
      setExtensions([javaModule.java(), themeModule.oneDark]);
    });
  }, []);

  if (extensions.length === 0) {
    return (
      <div
        style={{
          background: "#282c34",
          color: "#abb2bf",
          padding: "16px",
          borderRadius: "12px",
          fontFamily: "monospace",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading editor...
      </div>
    );
  }

  return (
    <CodeMirrorEditor
      value={value}
      height="400px"
      extensions={extensions}
      onChange={onChange}
      style={{ borderRadius: "12px", overflow: "hidden", fontSize: "14px" }}
    />
  );
}

// =============================================
// DESIGN TOKENS
// =============================================
const C = {
  bg: "var(--bg-base)",
  card: "var(--bg-surface)",
  cardBorder: "var(--bg-border)",
  surface: "var(--bg-elevated, #1A1A24)",
  accent: "#00D4FF",
  accentGlow: "rgba(139,92,246,0.25)",
  green: "#10b981",
  greenGlow: "rgba(16,185,129,0.2)",
  red: "#ef4444",
  redGlow: "rgba(239,68,68,0.2)",
  yellow: "var(--accent-gold)",
  yellowGlow: "var(--accent-gold-glow)",
  blue: "#3b82f6",
  blueGlow: "rgba(59,130,246,0.15)",
  pink: "#ec4899",
  text: "var(--text-primary)",
  textMid: "var(--text-secondary)",
  textDim: "var(--text-muted)",
  codeBlock: "#0f0f1a",
  codeBorder: "#1a1a30",
};

type Phase = "idle" | "challenge" | "evaluating" | "result";

const STARTER_CODE = `class FlipChallenge {
    public static void main(String args[]) {
        // Write your code here

    }
}`;

// =============================================
// Score Parsing
// =============================================
interface ParsedScores {
  output: number;
  outputMax: number;
  structure: number;
  structureMax: number;
  logic: number;
  logicMax: number;
  quality: number;
  qualityMax: number;
  bonus: number;
  bonusMax: number;
  hintPenalty: number;
  total: number;
}

function parseScoresFromText(text: string): ParsedScores | null {
  const scores: ParsedScores = {
    output: 0, outputMax: 40,
    structure: 0, structureMax: 25,
    logic: 0, logicMax: 20,
    quality: 0, qualityMax: 10,
    bonus: 0, bonusMax: 5,
    hintPenalty: 0,
    total: 0,
  };

  // Match score lines like "✅ Output Correctness | 0/40" or "Output Correctness: 0/40"
  const outputMatch = text.match(/Output\s*(?:Correctness|Match)?\s*[|:]\s*(\d+)\s*\/\s*(\d+)/i);
  const structureMatch = text.match(/Class\s*Structure\s*[|:]\s*(\d+)\s*\/\s*(\d+)/i);
  const logicMatch = text.match(/Logic\s*(?:Correctness|Quality)?\s*[|:]\s*(\d+)\s*\/\s*(\d+)/i);
  const qualityMatch = text.match(/(?:ICSE\s*)?Code\s*(?:Quality|Hygiene)\s*[|:]\s*(\d+)\s*\/\s*(\d+)/i);
  const bonusMatch = text.match(/(?:Creativity\s*)?Bonus\s*[|:]\s*(\d+)\s*\/\s*(\d+)/i);
  const hintMatch = text.match(/Hint\s*Penalty\s*[|:]\s*-?(\d+)/i);
  const totalMatch = text.match(/TOTAL:\s*(\d+)\s*\/\s*100/i);

  if (!totalMatch) return null;

  if (outputMatch) { scores.output = parseInt(outputMatch[1]); scores.outputMax = parseInt(outputMatch[2]); }
  if (structureMatch) { scores.structure = parseInt(structureMatch[1]); scores.structureMax = parseInt(structureMatch[2]); }
  if (logicMatch) { scores.logic = parseInt(logicMatch[1]); scores.logicMax = parseInt(logicMatch[2]); }
  if (qualityMatch) { scores.quality = parseInt(qualityMatch[1]); scores.qualityMax = parseInt(qualityMatch[2]); }
  if (bonusMatch) { scores.bonus = parseInt(bonusMatch[1]); scores.bonusMax = parseInt(bonusMatch[2]); }
  if (hintMatch) { scores.hintPenalty = parseInt(hintMatch[1]); }
  scores.total = parseInt(totalMatch[1]);

  return scores;
}

function stripScoreTable(text: string): string {
  // Remove the score table and total line to avoid double rendering
  let cleaned = text;
  // Remove markdown table
  cleaned = cleaned.replace(/\|[^\n]*Axis[^\n]*\|[\s\S]*?\|\s*📉[^\n]*\|\n?/gi, "");
  // Remove TOTAL line
  cleaned = cleaned.replace(/🎯\s*\*?\*?TOTAL:\s*\d+\/100\*?\*?\s*/gi, "");
  // Remove verdict lines like [90-100]: 🔥 ...
  cleaned = cleaned.replace(/\[(?:\d+-\d+|<\d+)\]:\s*[^\n]+\n?/g, "");
  // Remove FLIP THE QUESTION — RESULT header (we render our own)
  cleaned = cleaned.replace(/━+\n?📊\s*\*?\*?FLIP THE QUESTION — RESULT\*?\*?\n?━+\n?/gi, "");
  return cleaned.trim();
}

// =============================================
// Score Card Component
// =============================================
function ScoreCard({
  icon,
  label,
  score,
  maxScore,
  color,
  glow,
}: {
  icon: string;
  label: string;
  score: number;
  maxScore: number;
  color: string;
  glow: string;
}) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: "14px",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow}, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", color: C.textMid, fontWeight: 600 }}>
          {icon} {label}
        </span>
        <span style={{ fontSize: "18px", fontWeight: 800, color }}>
          {score}/{maxScore}
        </span>
      </div>
      {/* Progress Bar */}
      <div
        style={{
          height: "6px",
          borderRadius: "3px",
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "3px",
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 10px ${glow}`,
            transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}

// =============================================
// Shared Markdown renderer
// =============================================
function FlipMarkdown({ children }: { children: string }) {
  return (
    <div className="flip-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code: ({ className, children: codeChildren, ...props }: any) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre
                  style={{
                    background: C.codeBlock,
                    border: `1px solid ${C.codeBorder}`,
                    borderRadius: "12px",
                    padding: "18px 20px",
                    overflow: "auto",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    margin: "12px 0",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  }}
                >
                  <code style={{ color: "#c4b5fd" }} {...props}>
                    {codeChildren}
                  </code>
                </pre>
              );
            }
            return (
              <code
                style={{
                  background: "rgba(139,92,246,0.12)",
                  color: "#c4b5fd",
                  padding: "2px 7px",
                  borderRadius: "5px",
                  fontSize: "0.9em",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
                {...props}
              >
                {codeChildren}
              </code>
            );
          },
          table: ({ children: tChildren }) => (
            <div style={{ overflowX: "auto", margin: "16px 0" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: `1px solid ${C.cardBorder}`,
                }}
              >
                {tChildren}
              </table>
            </div>
          ),
          thead: ({ children: thChildren }) => (
            <thead style={{ background: C.surface }}>{thChildren}</thead>
          ),
          th: ({ children: thChildren }) => (
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontWeight: 700,
                fontSize: "13px",
                color: C.accent,
                borderBottom: `1px solid ${C.cardBorder}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {thChildren}
            </th>
          ),
          td: ({ children: tdChildren }) => (
            <td
              style={{
                padding: "11px 16px",
                fontSize: "14px",
                borderBottom: `1px solid ${C.cardBorder}`,
                color: C.text,
              }}
            >
              {tdChildren}
            </td>
          ),
          tr: ({ children: trChildren }) => (
            <tr style={{ transition: "background 0.2s" }}>{trChildren}</tr>
          ),
          h1: ({ children: h }) => (
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: C.accent,
                margin: "24px 0 10px",
                letterSpacing: "-0.3px",
              }}
            >
              {h}
            </h1>
          ),
          h2: ({ children: h }) => (
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: C.text,
                margin: "20px 0 8px",
              }}
            >
              {h}
            </h2>
          ),
          h3: ({ children: h }) => (
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: C.textMid,
                margin: "16px 0 6px",
              }}
            >
              {h}
            </h3>
          ),
          p: ({ children: p }) => (
            <p style={{ margin: "8px 0", lineHeight: "1.75", fontSize: "14px" }}>{p}</p>
          ),
          strong: ({ children: s }) => (
            <strong style={{ color: "#c4b5fd", fontWeight: 700 }}>{s}</strong>
          ),
          ul: ({ children: u }) => (
            <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>{u}</ul>
          ),
          ol: ({ children: o }) => (
            <ol style={{ paddingLeft: "20px", margin: "8px 0" }}>{o}</ol>
          ),
          li: ({ children: l }) => (
            <li style={{ marginBottom: "4px", fontSize: "14px", lineHeight: "1.65" }}>{l}</li>
          ),
          hr: () => (
            <hr
              style={{
                border: "none",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${C.cardBorder}, transparent)`,
                margin: "24px 0",
              }}
            />
          ),
          blockquote: ({ children: bq }) => (
            <blockquote
              style={{
                borderLeft: `3px solid ${C.accent}`,
                paddingLeft: "16px",
                margin: "12px 0",
                color: C.textMid,
                fontStyle: "italic",
              }}
            >
              {bq}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

// =============================================
// MAIN PAGE
// =============================================
export default function FlipTheQuestionPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [challengeText, setChallengeText] = useState("");
  const [code, setCode] = useState(STARTER_CODE);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintText, setHintText] = useState("");
  const [evaluationText, setEvaluationText] = useState("");
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastPassed, setLastPassed] = useState(false);
  const [lastTopic, setLastTopic] = useState<string | undefined>();
  const [giveUpText, setGiveUpText] = useState("");

  const statsQuery = trpc.flip.getStats.useQuery();
  const generateMutation = trpc.flip.generateChallenge.useMutation();
  const evaluateMutation = trpc.flip.evaluateSubmission.useMutation();
  const hintMutation = trpc.flip.getHint.useMutation();
  const giveUpMutation = trpc.flip.giveUp.useMutation();

  const streak = statsQuery.data?.streak ?? 0;
  const bestStreak = statsQuery.data?.bestStreak ?? 0;

  // Parse scores from evaluation text
  const parsedScores = useMemo(
    () => (evaluationText ? parseScoresFromText(evaluationText) : null),
    [evaluationText]
  );
  // Strip the table from result text so we render our own cards
  const cleanedEvaluation = useMemo(
    () => (evaluationText ? stripScoreTable(evaluationText) : ""),
    [evaluationText]
  );

  // =============================================
  // HANDLERS
  // =============================================
  const handleNewChallenge = useCallback(async () => {
    setPhase("challenge");
    setChallengeText("");
    setCode(STARTER_CODE);
    setHintsUsed(0);
    setHintText("");
    setEvaluationText("");
    setGiveUpText("");
    setLastScore(null);

    try {
      const result = await generateMutation.mutateAsync({ lastTopic });
      setChallengeText(result.challenge);
      const topicMatch = result.challenge.match(/Topic:\s*(.+)/i);
      if (topicMatch) setLastTopic(topicMatch[1].trim());
    } catch {
      setChallengeText("Failed to generate challenge. Please try again.");
    }
  }, [generateMutation, lastTopic]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim() || code.trim() === STARTER_CODE.trim()) return;
    setPhase("evaluating");

    try {
      const result = await evaluateMutation.mutateAsync({
        challengeText,
        studentCode: code,
        hintsUsed,
      });
      setEvaluationText(result.evaluation);
      setLastScore(result.score);
      setLastPassed(result.passed);
      setPhase("result");
      statsQuery.refetch();
    } catch {
      setEvaluationText("Failed to evaluate. Please try again.");
      setPhase("result");
    }
  }, [code, challengeText, hintsUsed, evaluateMutation, statsQuery]);

  const handleHint = useCallback(async () => {
    const level = hintsUsed + 1;
    setHintsUsed(level);
    try {
      const result = await hintMutation.mutateAsync({ challengeText, hintLevel: level });
      setHintText(result.hint);
    } catch {
      setHintText("Failed to get hint.");
    }
  }, [hintsUsed, challengeText, hintMutation]);

  const handleGiveUp = useCallback(async () => {
    try {
      const result = await giveUpMutation.mutateAsync({ challengeText });
      setGiveUpText(result.solution);
      setPhase("result");
      statsQuery.refetch();
    } catch {
      setGiveUpText("Failed to load solution.");
      setPhase("result");
    }
  }, [challengeText, giveUpMutation, statsQuery]);

  // Verdict text
  const getVerdict = (score: number) => {
    if (score >= 90) return { text: "Board exam ready. Examiner would give full marks.", emoji: "🔥", color: C.green };
    if (score >= 75) return { text: "Strong attempt. Minor fixes needed.", emoji: "👍", color: C.blue };
    if (score >= 50) return { text: "Core logic works but structure needs improvement.", emoji: "😬", color: C.yellow };
    return { text: "Study the reference solution and retry.", emoji: "📚", color: C.red };
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: "20px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* ════════ HEADER ════════ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 800,
                background: "linear-gradient(135deg, #00D4FF, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              🔁 Flip the Question
            </h1>
            <p style={{ color: C.textDim, margin: "4px 0 0", fontSize: "13px" }}>
              Reverse-engineer Java programs from output snippets
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { val: streak, icon: "🔥", label: "Streak", color: C.accent },
              { val: bestStreak, icon: "⭐", label: "Best", color: C.yellow },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: C.card,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: "14px",
                  padding: "10px 22px",
                  textAlign: "center",
                  minWidth: "80px",
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: 800, color: s.color }}>
                  {s.icon} {s.val}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: C.textDim,
                    textTransform: "uppercase",
                    letterSpacing: "1.2px",
                    fontWeight: 600,
                    marginTop: "2px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════ IDLE ════════ */}
        {phase === "idle" && (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: "20px",
              padding: "60px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -100,
                left: "50%",
                transform: "translateX(-50%)",
                width: 400,
                height: 400,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${C.accentGlow}, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <div style={{ fontSize: "64px", marginBottom: "16px", position: "relative" }}>🧩</div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px", position: "relative" }}>
              Ready to Flip?
            </h2>
            <p
              style={{
                color: C.textMid,
                maxWidth: "520px",
                margin: "0 auto 32px",
                lineHeight: "1.7",
                fontSize: "15px",
                position: "relative",
              }}
            >
              We show you the <strong style={{ color: "#c4b5fd" }}>output</strong> of a Java program.
              Your job? Write the complete class that produces it. AI evaluates your code on{" "}
              <strong style={{ color: "#c4b5fd" }}>5 axes</strong> — output match, class structure,
              logic, code quality, and creativity.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                maxWidth: "560px",
                margin: "0 auto 36px",
                position: "relative",
              }}
            >
              {[
                "Slab Billing",
                "Arrays",
                "Strings",
                "Matrix Ops",
                "Number Theory",
                "Overloading",
                "Inheritance",
                "Recursion",
              ].map((t) => (
                <div
                  key={t}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    color: C.textMid,
                    fontWeight: 600,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            <button
              onClick={handleNewChallenge}
              disabled={generateMutation.isPending}
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "16px 52px",
                fontSize: "17px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 0 40px ${C.accentGlow}`,
                transition: "transform 0.2s, box-shadow 0.2s",
                opacity: generateMutation.isPending ? 0.7 : 1,
                position: "relative",
              }}
            >
              {generateMutation.isPending ? "⏳ Generating..." : "⚡ Start Challenge"}
            </button>
          </div>
        )}

        {/* ════════ CHALLENGE PHASE ════════ */}
        {phase === "challenge" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* LEFT: Challenge */}
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: "16px",
                padding: "24px",
                maxHeight: "82vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: `1px solid ${C.cardBorder}`,
                }}
              >
                <span style={{ fontSize: "18px" }}>📋</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: C.accent }}>
                  CHALLENGE
                </span>
              </div>

              {generateMutation.isPending ? (
                <div style={{ textAlign: "center", padding: "80px 0", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "16px",
                      animation: "flip-spin 1.5s linear infinite",
                    }}
                  >
                    ⚙️
                  </div>
                  <p style={{ color: C.textDim, fontSize: "14px" }}>
                    Crafting your challenge...
                  </p>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <FlipMarkdown>{challengeText}</FlipMarkdown>
                </div>
              )}

              {/* Hint Display */}
              {hintText && (
                <div
                  style={{
                    background: C.yellowGlow,
                    border: `1px solid rgba(245,158,11,0.25)`,
                    borderRadius: "12px",
                    padding: "14px 18px",
                    marginTop: "16px",
                  }}
                >
                  <FlipMarkdown>{hintText}</FlipMarkdown>
                </div>
              )}

              {/* Action Buttons */}
              {!generateMutation.isPending && challengeText && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                  <button
                    onClick={handleHint}
                    disabled={hintMutation.isPending || hintsUsed >= 4}
                    style={{
                      background: C.yellowGlow,
                      color: C.yellow,
                      border: `1px solid rgba(245,158,11,0.25)`,
                      borderRadius: "10px",
                      padding: "10px 18px",
                      cursor: hintsUsed >= 4 ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                      opacity: hintsUsed >= 4 ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    💡 Hint {hintsUsed}/3 {hintsUsed < 3 ? "(-5 pts)" : ""}
                  </button>
                  <button
                    onClick={handleGiveUp}
                    disabled={giveUpMutation.isPending}
                    style={{
                      background: C.redGlow,
                      color: C.red,
                      border: `1px solid rgba(239,68,68,0.25)`,
                      borderRadius: "10px",
                      padding: "10px 18px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                      transition: "all 0.2s",
                    }}
                  >
                    🏳️ Give Up
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: Code Editor */}
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                maxHeight: "82vh",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: `1px solid ${C.cardBorder}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>✏️</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.green }}>
                    YOUR SOLUTION
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: C.textDim,
                    background: C.surface,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  JAVA (BLUEJ)
                </span>
              </div>

              <div style={{ flex: 1, minHeight: 0 }}>
                <EditorWrapper value={code} onChange={setCode} />
              </div>

              <button
                onClick={handleSubmit}
                disabled={evaluateMutation.isPending || !code.trim()}
                style={{
                  marginTop: "16px",
                  background: `linear-gradient(135deg, ${C.green}, #059669)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 0 25px ${C.greenGlow}`,
                  width: "100%",
                  transition: "all 0.2s",
                  opacity: evaluateMutation.isPending ? 0.7 : 1,
                }}
              >
                {evaluateMutation.isPending ? "⏳ Evaluating..." : "🚀 Submit Solution"}
              </button>
            </div>
          </div>
        )}

        {/* ════════ EVALUATING ════════ */}
        {phase === "evaluating" && (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: "20px",
              padding: "80px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${C.accentGlow}, transparent 70%)`,
                animation: "flip-pulse 2s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                fontSize: "64px",
                marginBottom: "16px",
                animation: "flip-pulse 1.5s ease-in-out infinite",
                position: "relative",
              }}
            >
              🧠
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px", position: "relative" }}>
              AI is evaluating your code...
            </h2>
            <p style={{ color: C.textDim, position: "relative" }}>
              Tracing logic, checking OOP structure, and scoring on 5 axes.
            </p>
          </div>
        )}

        {/* ════════ RESULT PHASE ════════ */}
        {phase === "result" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Score Header Card */}
            {lastScore !== null && (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: "20px",
                  padding: "36px 32px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Background glow */}
                <div
                  style={{
                    position: "absolute",
                    top: -60,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 400,
                    height: 200,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${lastPassed ? C.greenGlow : C.redGlow}, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    fontSize: "60px",
                    fontWeight: 900,
                    background: lastPassed
                      ? `linear-gradient(135deg, ${C.green}, #34d399)`
                      : `linear-gradient(135deg, ${C.red}, #f87171)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    position: "relative",
                    lineHeight: 1,
                  }}
                >
                  {lastScore}/100
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: getVerdict(lastScore).color,
                    marginTop: "12px",
                    fontWeight: 600,
                    position: "relative",
                  }}
                >
                  {getVerdict(lastScore).emoji} {getVerdict(lastScore).text}
                </div>
              </div>
            )}

            {/* Give Up Header */}
            {giveUpText && lastScore === null && (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.cardBorder}`,
                  borderRadius: "20px",
                  padding: "40px 32px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📖</div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>
                  Solution Revealed
                </h2>
                <p style={{ color: C.textDim, fontSize: "14px" }}>
                  No shame — study this carefully, then try again!
                </p>
              </div>
            )}

            {/* Score Cards Grid */}
            {parsedScores && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                <ScoreCard
                  icon="✅"
                  label="Output Match"
                  score={parsedScores.output}
                  maxScore={parsedScores.outputMax}
                  color={C.green}
                  glow={C.greenGlow}
                />
                <ScoreCard
                  icon="🏗️"
                  label="Class Structure"
                  score={parsedScores.structure}
                  maxScore={parsedScores.structureMax}
                  color={C.blue}
                  glow={C.blueGlow}
                />
                <ScoreCard
                  icon="⚙️"
                  label="Logic Correctness"
                  score={parsedScores.logic}
                  maxScore={parsedScores.logicMax}
                  color={C.accent}
                  glow={C.accentGlow}
                />
                <ScoreCard
                  icon="📐"
                  label="ICSE Quality"
                  score={parsedScores.quality}
                  maxScore={parsedScores.qualityMax}
                  color={C.yellow}
                  glow={C.yellowGlow}
                />
                <ScoreCard
                  icon="⭐"
                  label="Creativity"
                  score={parsedScores.bonus}
                  maxScore={parsedScores.bonusMax}
                  color={C.pink}
                  glow="rgba(236,72,153,0.2)"
                />
                {parsedScores.hintPenalty > 0 && (
                  <div
                    style={{
                      background: C.surface,
                      border: `1px solid rgba(239,68,68,0.2)`,
                      borderRadius: "14px",
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: C.textMid, fontWeight: 600 }}>
                      📉 Hint Penalty
                    </span>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: C.red }}>
                      -{parsedScores.hintPenalty}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Feedback + Reference Solution */}
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: "16px",
                padding: "28px",
              }}
            >
              <FlipMarkdown>{cleanedEvaluation || giveUpText}</FlipMarkdown>
            </div>

            {/* New Challenge button */}
            <div style={{ textAlign: "center", paddingTop: "8px" }}>
              <button
                onClick={handleNewChallenge}
                disabled={generateMutation.isPending}
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, ${C.pink})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px 44px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 0 30px ${C.accentGlow}`,
                  transition: "all 0.2s",
                }}
              >
                🔁 New Challenge
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes flip-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes flip-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .flip-md pre::-webkit-scrollbar {
          height: 6px;
        }
        .flip-md pre::-webkit-scrollbar-track {
          background: transparent;
        }
        .flip-md pre::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
        @media (max-width: 768px) {
          .flip-md { font-size: 13px; }
        }
      `}</style>
    </div>
  );
}
