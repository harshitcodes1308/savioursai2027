"use client";

import { useState, useEffect, useMemo, useCallback, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { trpc } from "@/lib/trpc/client";
import { useResponsive } from "@/hooks/useResponsive";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import {
  READY_SUBJECTS,
  READY_TOTAL_QUESTIONS,
  READY_TIME_LIMIT_SECONDS,
  buildReadinessTest,
  getVerdict,
  readReadyHistoryRaw,
  saveReadyResult,
  type ReadySubject,
  type ReadyQuestion,
} from "@/data/preboard-ready";

const ACCENT = "var(--accent-gold)";
const ACCENT_DIM = "var(--accent-gold-glow)";
const ACCENT_BORDER = "var(--accent-gold-border)";

const SUBJECT_ICONS: Record<string, AppIconName> = {
  physics: "zap",
  chemistry: "flask",
  mathematics: "calculator",
  biology: "brain",
  "computer-applications": "code",
};

type Phase = "pick" | "test" | "result";

const noopSubscribe = () => () => {};

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function titleCase(chapter: string): string {
  if (chapter !== chapter.toUpperCase()) return chapter;
  return chapter.toLowerCase().replace(/\b([a-z])/g, (c) => c.toUpperCase());
}

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
  textTransform: "uppercase", color: ACCENT,
};

export default function PreBoardReadyPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { data: profile } = trpc.dashboard.getProfile.useQuery();

  const rawPlanType = profile?.planType ?? "FREE";
  const isPaid = !!(profile?.isPaid || ((rawPlanType === "PRO" || rawPlanType === "BUNDLE") && profile?.subscriptionStatus === "ACTIVE"));
  const ebooksUnlocked = profile?.ebooksUnlocked === true;

  const [phase, setPhase] = useState<Phase>("pick");
  const [subject, setSubject] = useState<ReadySubject | null>(null);
  const [questions, setQuestions] = useState<ReadyQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const submittedRef = useRef(false);

  // Last score per subject, read from localStorage (server snapshot = empty).
  const historyRaw = useSyncExternalStore(noopSubscribe, readReadyHistoryRaw, () => "{}");
  const history = useMemo(() => {
    try { return JSON.parse(historyRaw) as Record<string, { score: number; total: number }>; } catch { return {}; }
  }, [historyRaw]);

  const start = (s: ReadySubject) => {
    const qs = buildReadinessTest(s);
    setSubject(s);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setIndex(0);
    setElapsed(0);
    setShowReview(false);
    submittedRef.current = false;
    setPhase("test");
    window.scrollTo({ top: 0 });
    track("preboard_ready_start", { subject: s.id });
  };

  const submit = useCallback(() => {
    if (submittedRef.current || !subject) return;
    submittedRef.current = true;
    const score = questions.reduce((n, q, i) => n + (answers[i] === q.correctAnswer ? 1 : 0), 0);
    const entry = { score, total: questions.length, at: new Date().toISOString() };
    saveReadyResult(subject.id, entry);
    setPhase("result");
    window.scrollTo({ top: 0 });
    track("preboard_ready_complete", { subject: subject.id, score, total: questions.length });
  }, [answers, questions, subject]);

  // Timer — auto-submits at the limit.
  const submitRef = useRef(submit);
  useEffect(() => { submitRef.current = submit; }, [submit]);
  useEffect(() => {
    if (phase !== "test") return;
    const startedAt = Date.now();
    const t = setInterval(() => {
      const secs = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(secs);
      if (secs >= READY_TIME_LIMIT_SECONDS) submitRef.current();
    }, 1000);
    return () => clearInterval(t);
  }, [phase, questions]);

  const result = useMemo(() => {
    if (phase !== "result") return null;
    const rows = questions.map((q, i) => ({ q, selected: answers[i], correct: answers[i] === q.correctAnswer }));
    const score = rows.filter((r) => r.correct).length;
    const missed = rows.filter((r) => !r.correct);
    const blindSpotMisses = missed.filter((r) => r.q.isBlindSpot).length;
    const weakChapters = [...new Set(missed.map((r) => r.q.chapter))];
    return { rows, score, blindSpotMisses, weakChapters, verdict: getVerdict(score, questions.length, blindSpotMisses) };
  }, [phase, questions, answers]);

  const cta = (name: string, href: string) => {
    track("preboard_ready_cta", { cta: name, subject: subject?.id ?? "", band: result?.verdict.band ?? "" });
    router.push(href);
  };

  const pagePad = isMobile ? "20px 16px 100px" : "36px 40px 80px";

  // ── PICK ──────────────────────────────────────────────────────────────────
  if (phase === "pick") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: pagePad, maxWidth: 920, margin: "0 auto", boxSizing: "border-box" }}>
        <button onClick={() => router.push("/dashboard")} style={backBtn}>← Dashboard</button>

        <div style={{ ...eyebrow, marginBottom: 10 }}>Free · 15 questions · 15 minutes</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 30 : 40, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.1 }}>
          Are you ready for pre-boards?
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 8px", maxWidth: 620 }}>
          15 real board-exam questions from past papers and competency sets. Most of them come from the chapters students skip
          or leave for the last week. Find your blind spots before your pre-board paper does.
        </p>
        <div style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: 13, color: "var(--text-muted)", marginBottom: isMobile ? 24 : 32 }}>
          No negative marking. Just honesty.
        </div>

        <div style={{ ...eyebrow, color: "var(--text-muted)", opacity: 0.6, marginBottom: 14 }}>Pick a subject</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {READY_SUBJECTS.map((s) => {
            const h = history[s.id];
            const isHover = hovered === s.id;
            return (
              <button
                key={s.id}
                onClick={() => start(s)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textAlign: "left", cursor: "pointer",
                  background: isHover ? "linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))" : "var(--bg-surface)",
                  border: `1px solid ${isHover ? ACCENT_BORDER : "var(--bg-border)"}`,
                  borderRadius: 16, padding: "20px 22px",
                  transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  transform: isHover ? "translateY(-2px)" : "none",
                  display: "flex", flexDirection: "column", gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <AppIcon name={SUBJECT_ICONS[s.id] ?? "target"} size={22} color="var(--accent-gold)" />
                  {h && (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>
                      Last: <strong style={{ color: "var(--text-primary)" }}>{h.score}/{h.total}</strong>
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--text-primary)" }}>{s.name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: isHover ? ACCENT : "var(--text-muted)", transition: "color 0.2s" }}>
                  {h ? "Retake with new questions →" : "Start the check →"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── TEST ──────────────────────────────────────────────────────────────────
  if (phase === "test" && subject) {
    const q = questions[index];
    const answeredCount = answers.filter((a) => a !== null).length;
    const remaining = Math.max(0, READY_TIME_LIMIT_SECONDS - elapsed);
    const lowTime = remaining <= 60;
    const isLast = index === questions.length - 1;

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: pagePad, maxWidth: 760, margin: "0 auto", boxSizing: "border-box" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
          <div>
            <div style={{ ...eyebrow, marginBottom: 4 }}>{subject.name} · Pre-Board Check</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
              Question {index + 1} of {questions.length}
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums",
            color: lowTime ? "#E5534B" : "var(--text-primary)",
            border: `1px solid ${lowTime ? "rgba(229,83,75,0.4)" : "var(--bg-border)"}`,
            borderRadius: 100, padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <AppIcon name="clock" size={14} /> {fmt(remaining)}
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {questions.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to question ${i + 1}`}
              onClick={() => setIndex(i)}
              style={{
                flex: 1, height: 6, borderRadius: 3, border: "none", padding: 0, cursor: "pointer",
                background: i === index ? ACCENT : answers[i] !== null ? "rgba(0,212,255,0.4)" : "var(--bg-border)",
              }}
            />
          ))}
        </div>

        {/* Question */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 18, padding: isMobile ? "20px 18px" : "28px 30px", marginBottom: 18 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? 16 : 18, color: "var(--text-primary)", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 22 }}>
            {q.question}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {q.options.map((opt, oi) => {
              const selected = answers[index] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers((a) => { const n = [...a]; n[index] = oi; return n; })}
                  style={{
                    textAlign: "left", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
                    background: selected ? ACCENT_DIM : "transparent",
                    border: `1px solid ${selected ? ACCENT : "var(--bg-border)"}`,
                    borderRadius: 12, padding: "13px 16px", transition: "all 0.15s",
                    fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.5,
                  }}
                >
                  <span style={{
                    flex: "0 0 auto", width: 24, height: 24, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                    background: selected ? ACCENT : "transparent", color: selected ? "var(--bg-base)" : "var(--text-muted)",
                    border: `1px solid ${selected ? ACCENT : "var(--bg-border)"}`,
                  }}>{String.fromCharCode(65 + oi)}</span>
                  <span style={{ whiteSpace: "pre-wrap" }}>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} style={{ opacity: index === 0 ? 0.4 : 1 }}>
            ← Prev
          </button>
          <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>
            {answeredCount}/{questions.length} answered
          </div>
          {isLast ? (
            <button className="btn-gold" onClick={submit}>Submit →</button>
          ) : (
            <button className="btn-gold" onClick={() => setIndex((i) => i + 1)}>Next →</button>
          )}
        </div>
        {!isLast && answeredCount === questions.length && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={submit} style={{ ...linkBtn }}>All answered. Submit now →</button>
          </div>
        )}
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (phase === "result" && subject && result) {
    const { verdict, score, rows, blindSpotMisses, weakChapters } = result;
    const total = rows.length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    const strong = verdict.band === "ready";

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: pagePad, maxWidth: 820, margin: "0 auto", boxSizing: "border-box" }}>
        <button onClick={() => setPhase("pick")} style={backBtn}>← All subjects</button>

        {/* Verdict hero */}
        <div style={{
          background: "var(--bg-surface)", border: `1px solid ${verdict.color}55`, borderRadius: 20,
          padding: isMobile ? "24px 20px" : "32px 34px", marginBottom: 18, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${verdict.color}22 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ display: "flex", gap: isMobile ? 18 : 28, alignItems: "center", flexDirection: isMobile ? "column" : "row", position: "relative" }}>
            <ScoreRing score={score} total={total} color={verdict.color} />
            <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
              <div style={{
                display: "inline-block", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                color: verdict.color, background: `${verdict.color}1f`, border: `1px solid ${verdict.color}55`, borderRadius: 100, padding: "4px 12px", marginBottom: 10,
              }}>{subject.name} · {verdict.label}</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 26 : 32, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.15 }}>
                {verdict.headline}
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                {verdict.message}
              </p>
            </div>
          </div>
        </div>

        {/* Blind spots */}
        {weakChapters.length > 0 && (
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 18, padding: isMobile ? "18px 18px" : "22px 26px", marginBottom: 18 }}>
            <div style={{ ...eyebrow, color: "var(--text-muted)", marginBottom: 12 }}>
              Chapters to fix before pre-boards · {weakChapters.length}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {weakChapters.map((c) => {
                const blind = subject.blindSpots.includes(c);
                return (
                  <span key={c} style={{
                    fontFamily: "var(--font-body)", fontSize: 12, color: blind ? "#F5A623" : "var(--text-secondary)",
                    background: blind ? "rgba(245,166,35,0.1)" : "transparent",
                    border: `1px solid ${blind ? "rgba(245,166,35,0.35)" : "var(--bg-border)"}`, borderRadius: 100, padding: "5px 12px",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}>
                    {blind && <AppIcon name="alert" size={12} />}{titleCase(c)}
                  </span>
                );
              })}
            </div>
            {blindSpotMisses > 0 && (
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
                <span style={{ color: "#F5A623" }}>Amber</span> = commonly skipped chapters. These are easy marks that most students give away.
              </div>
            )}
          </div>
        )}

        {/* Primary CTA — Pre-Board 60 */}
        <div style={{
          background: "linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))", border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: 20, padding: isMobile ? "22px 20px" : "28px 30px", marginBottom: 14,
        }}>
          <div style={{ ...eyebrow, marginBottom: 8 }}>Your next move</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 26, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.01em" }}>
            {strong ? "Lock in your score with Pre-Board 60" : `Fix ${pct < 60 ? "this" : "these gaps"} with Pre-Board 60`}
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 18px" }}>
            A 60-day, day-by-day countdown: 20 days of Study, 20 of Practice and 20 of full Mock Papers.
            It covers every chapter, including the ones you just missed.{" "}
            {isPaid ? "All three phases are unlocked on your Pro plan." : "Phase 1 is free. Start today."}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-gold" onClick={() => cta("preboard60", "/dashboard/pre-board-90")}>
              Start Pre-Board 60 →
            </button>
            {!isPaid && (
              <button className="btn-ghost" onClick={() => cta("pro", "/pricing")}>
                Unlock Pro: all 3 phases for ₹99
              </button>
            )}
          </div>
        </div>

        {/* Secondary CTA — Sidekick ebook */}
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 18,
          padding: isMobile ? "18px 18px" : "22px 26px", marginBottom: 24,
          display: "flex", gap: 16, alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row",
        }}>
          <AppIcon name="book" size={26} color="var(--accent-gold)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text-primary)", marginBottom: 4 }}>
              Revise the weak chapters from the {subject.name} Sidekick e-book
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>
              {ebooksUnlocked
                ? "You already have the library. Open it and go straight to the chapters above."
                : "Exam-focused notes for all 10 subjects. Unlock once for ₹79 or free by referring a friend."}
            </div>
          </div>
          <button className="btn-ghost" onClick={() => cta("ebook", ebooksUnlocked ? `/dashboard/ebooks/${subject.ebookId}` : "/dashboard/ebooks")}>
            {ebooksUnlocked ? "Open e-book →" : "Get Sidekick →"}
          </button>
        </div>

        {/* Review */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <button className="btn-ghost" onClick={() => setShowReview((v) => !v)}>
            {showReview ? "Hide answers" : "Review answers"}
          </button>
          <button className="btn-ghost" onClick={() => start(subject)}>Retake with new questions</button>
          <button className="btn-ghost" onClick={() => setPhase("pick")}>Try another subject</button>
        </div>

        {showReview && (
          <div style={{ display: "grid", gap: 12 }}>
            {rows.map(({ q, selected, correct }, i) => (
              <div key={q.id} style={{
                background: "var(--bg-surface)", borderRadius: 14, padding: "16px 18px",
                border: `1px solid ${correct ? "rgba(34,197,94,0.3)" : "rgba(229,83,75,0.3)"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>
                    Q{i + 1} · {titleCase(q.chapter)} · {q.year}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: correct ? "#22c55e" : "#E5534B" }}>
                    {correct ? "Correct" : selected === null ? "Skipped" : "Wrong"}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.55, whiteSpace: "pre-wrap", marginBottom: 8 }}>
                  {q.question}
                </div>
                {!correct && selected !== null && (
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#E5534B", marginBottom: 4 }}>
                    Your answer: {q.options[selected]}
                  </div>
                )}
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#22c55e" }}>
                  Correct answer: {q.options[q.correctAnswer]}
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

function ScoreRing({ score, total, color }: { score: number; total: number; color: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const pct = total ? score / total : 0;
  return (
    <div style={{ position: "relative", width: 120, height: 120, flex: "0 0 auto" }}>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-border)" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--text-primary)", lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>out of {total || READY_TOTAL_QUESTIONS}</div>
      </div>
    </div>
  );
}

const backBtn: React.CSSProperties = {
  background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer",
  fontSize: 13, fontFamily: "var(--font-body)", padding: 0, marginBottom: 24,
};

const linkBtn: React.CSSProperties = {
  background: "transparent", border: "none", color: "var(--accent-gold)", cursor: "pointer",
  fontSize: 13, fontFamily: "var(--font-body)", padding: 0,
};
