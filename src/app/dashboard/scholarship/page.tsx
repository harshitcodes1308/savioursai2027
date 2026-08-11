"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

type ScholarshipQuestion = {
  id: string;
  subject: string;
  chapter: string;
  year: number;
  marks: number;
  question: string;
  options: string[];
  timeLimit: number;
};
type Result = { score: number; marksScored: number; totalMarks: number; discountPercentage: number; expiresAt: string };
type Phase = "intro" | "loading" | "countdown" | "test" | "submitting" | "result";
type ApiResponse = { error?: string; [key: string]: unknown };

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.max(0, seconds % 60)).padStart(2, "0")}`;
async function responseData(response: Response): Promise<ApiResponse> {
  const body = await response.text();
  if (!body) return {};
  try { return JSON.parse(body) as ApiResponse; }
  catch { return { error: `The server returned an invalid response (HTTP ${response.status}).` }; }
}

export default function ScholarshipPage() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading, refetch } = trpc.dashboard.getProfile.useQuery();
  const [phase, setPhase] = useState<Phase>("intro");
  const [attemptId, setAttemptId] = useState("");
  const [questions, setQuestions] = useState<ScholarshipQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const scholarshipOffer = profile?.scholarshipOffer;
  const alreadyUsed = !!scholarshipOffer?.completedAt;

  const startTest = async () => {
    setPhase("loading"); setError("");
    try {
      const response = await fetch("/api/scholarship/start", { method: "POST" });
      const data = await responseData(response);
      if (!response.ok) throw new Error(data.error || "Unable to start the scholarship test.");
      setAttemptId(String(data.attemptId || ""));
      setQuestions((data.questions as ScholarshipQuestion[]) || []);
      setCurrent(0); setAnswers({}); setCountdown(3); setPhase("countdown");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start the scholarship test.");
      setPhase("intro");
    }
  };

  const finishTest = useCallback(async (finalAnswers: Record<number, number>) => {
    if (!attemptId || !questions.length || phase === "submitting") return;
    setPhase("submitting"); setError("");
    try {
      const response = await fetch("/api/scholarship/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          answers: questions.map((question, index) => ({
            id: question.id,
            subject: question.subject,
            selectedAnswer: finalAnswers[index] ?? null,
          })),
        }),
      });
      const data = await responseData(response);
      if (!response.ok) throw new Error(data.error || "Unable to calculate your scholarship.");
      setResult(data as Result); setPhase("result"); void refetch();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to calculate your scholarship.");
      setPhase("test");
    }
  }, [attemptId, phase, questions, refetch]);

  const advance = useCallback((chosen?: number) => {
    const nextAnswers = chosen === undefined ? answers : { ...answers, [current]: chosen };
    if (chosen !== undefined) setAnswers(nextAnswers);
    if (current === questions.length - 1) {
      void finishTest(nextAnswers);
      return;
    }
    const nextQuestion = questions[current + 1];
    setCurrent(value => value + 1);
    setTimeLeft(nextQuestion.timeLimit);
  }, [answers, current, finishTest, questions]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("test");
      setTimeLeft(questions[0]?.timeLimit || 60);
      return;
    }
    const timer = window.setTimeout(() => setCountdown(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, phase, questions]);

  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) { advance(); return; }
    const timer = window.setTimeout(() => setTimeLeft(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [advance, phase, timeLeft]);

  if (profileLoading) return <main style={shell}><div style={card}>Loading scholarship test…</div></main>;
  if (profile?.isPaid) return <main style={shell}><section style={card}><div style={symbol}>✦</div><h1 style={title}>You already have full access</h1><p style={copy}>The scholarship test is reserved for students on the free plan.</p><button onClick={() => router.push("/dashboard")} style={primaryButton}>Back to dashboard</button></section></main>;

  if (phase === "result" || alreadyUsed) {
    const active = result ?? (scholarshipOffer?.active ? {
      score: scholarshipOffer.score || 0,
      marksScored: 0,
      totalMarks: 0,
      discountPercentage: scholarshipOffer.discountPercentage,
      expiresAt: scholarshipOffer.expiresAt?.toString() || "",
    } : null);
    return <main style={shell}><section style={{ ...card, maxWidth: 680 }}>
      <div style={symbol}>✦</div>
      <div style={eyebrow}>SCHOLARSHIP RESULT</div>
      {active ? <>
        <h1 style={title}>You earned {active.discountPercentage}% off</h1>
        <p style={copy}>Your weighted scholarship score is <strong style={{ color: "var(--text-primary)" }}>{active.score}%</strong>. This discount applies to both Pro and Ultimate Bundle.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, margin: "28px 0" }}>
          <Metric label="Score" value={`${active.score}%`} /><Metric label="Pro" value={`₹${Math.round(199 * (1 - active.discountPercentage / 100))}`} /><Metric label="Bundle" value={`₹${Math.round(699 * (1 - active.discountPercentage / 100))}`} />
        </div>
        <p style={{ ...copy, fontSize: 12 }}>Use it before {new Date(active.expiresAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}. Your discounted price is now shown wherever you upgrade.</p>
        <button onClick={() => router.push("/pricing")} style={primaryButton}>View my scholarship prices →</button>
      </> : <>
        <h1 style={title}>Scholarship test already used</h1>
        <p style={copy}>Each free account gets one scholarship attempt. Your previous offer is no longer active.</p>
        <button onClick={() => router.push("/pricing")} style={primaryButton}>View plans</button>
      </>}
    </section></main>;
  }

  if (phase === "countdown") return <main style={shell}><section style={card}><div style={eyebrow}>YOUR PAPER IS READY</div><h1 style={{ ...title, fontSize: 62, color: "var(--accent-gold)" }}>{countdown}</h1><p style={copy}>10 random ICSE competency questions. Focus, then make it count.</p></section></main>;

  if (phase === "test" || phase === "submitting") {
    const question = questions[current];
    const progress = ((current + (phase === "submitting" ? 1 : 0)) / questions.length) * 100;
    return <main style={shell}><section style={{ ...card, maxWidth: 820, textAlign: "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 20 }}>
        <div><div style={eyebrow}>SCHOLARSHIP CHALLENGE</div><div style={{ color: "var(--text-muted)", fontSize: 13 }}>Question {current + 1} of {questions.length} · {question.marks} mark{question.marks > 1 ? "s" : ""}</div></div>
        <div style={{ color: timeLeft <= 15 ? "var(--status-red)" : "var(--accent-gold)", fontSize: 24, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>⏱ {formatTime(timeLeft)}</div>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: "var(--bg-elevated)", overflow: "hidden", marginBottom: 28 }}><div style={{ width: `${progress}%`, height: "100%", background: "var(--accent-gold)", transition: "width .25s" }} /></div>
      <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>{question.subject} · {question.chapter} · ICSE {question.year}</div>
      <h1 style={{ ...title, fontSize: 23, lineHeight: 1.5, textAlign: "left", whiteSpace: "pre-wrap" }}>{question.question}</h1>
      <div style={{ display: "grid", gap: 10, marginTop: 24 }}>{question.options.map((option, index) => <button key={`${index}-${option}`} disabled={phase === "submitting"} onClick={() => advance(index)} style={{ textAlign: "left", cursor: phase === "submitting" ? "wait" : "pointer", padding: "15px 16px", borderRadius: 12, background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--bg-border)", fontSize: 14, lineHeight: 1.45 }}><strong style={{ color: "var(--accent-gold)", marginRight: 9 }}>{String.fromCharCode(65 + index)}.</strong>{option}</button>)}</div>
      <p style={{ color: "var(--text-muted)", fontSize: 12, margin: "22px 0 0", textAlign: "center" }}>Each question advances after an answer or its difficulty-based time limit.</p>
    </section></main>;
  }

  return <main style={shell}><section style={{ ...card, maxWidth: 720 }}>
    <div style={symbol}>◈</div>
    <div style={eyebrow}>FREE-PLAN EXCLUSIVE</div>
    <h1 style={title}>Earn up to 25% off your plan</h1>
    <p style={copy}>Take one 10-question ICSE Scholarship Test built from our competency question bank. Your score unlocks a personal discount on both paid plans.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 9, margin: "26px 0", textAlign: "left" }}>
      {["90%+ score · 25% off", "75%+ score · 20% off", "60%+ score · 15% off", "40%+ score · 10% off", "Below 40% · 5% off"].map(rule => <div key={rule} style={{ padding: "10px 12px", border: "1px solid var(--accent-gold-border)", background: "var(--accent-gold-glow)", borderRadius: 10, color: "var(--text-secondary)", fontSize: 12 }}>{rule}</div>)}
    </div>
    <div style={{ color: "#a8a8b8", fontSize: 12, lineHeight: 1.7, marginBottom: 25 }}>Timed by difficulty: 1 mark = 60s, 2 marks = 2m 30s, 3 marks = 4m, 4 marks = 5m 30s. The scholarship offer lasts 72 hours and can be taken once per account.</div>
    {error && <p style={{ color: "#fb7185", fontSize: 13 }}>{error}</p>}
    <button onClick={() => void startTest()} disabled={phase === "loading"} style={primaryButton}>{phase === "loading" ? "Preparing your paper…" : "Start scholarship test →"}</button>
  </section></main>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div style={{ border: "1px solid var(--accent-gold-border)", borderRadius: 12, padding: "13px 8px", background: "var(--accent-gold-glow)" }}><div style={{ color: "var(--text-primary)", fontSize: 20, fontWeight: 800 }}>{value}</div><div style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 4, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</div></div>; }
const shell = { minHeight: "100vh", boxSizing: "border-box" as const, padding: "clamp(24px,5vw,64px) 18px 100px", background: "radial-gradient(circle at 50% 0%, rgba(0,212,255,.08), transparent 42%), var(--bg-base)", display: "grid", placeItems: "start center", fontFamily: "var(--font-body)" };
const card = { width: "100%", boxSizing: "border-box" as const, marginTop: "clamp(8px,8vh,80px)", padding: "clamp(24px,5vw,46px)", textAlign: "center" as const, background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,.28)" };
const title = { margin: "10px 0 12px", color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: "clamp(30px,5vw,43px)", letterSpacing: "-.035em" };
const copy = { maxWidth: 560, margin: "0 auto", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 };
const eyebrow = { color: "var(--accent-gold)", fontWeight: 800, fontSize: 10, letterSpacing: ".14em", marginTop: 15 };
const symbol = { color: "var(--accent-gold)", fontFamily: "var(--font-display)", fontSize: 46, lineHeight: 1 };
const primaryButton = { border: "1px solid var(--accent-gold-border)", cursor: "pointer", borderRadius: 10, padding: "13px 20px", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, boxShadow: "0 8px 24px rgba(0,212,255,.1)" };
