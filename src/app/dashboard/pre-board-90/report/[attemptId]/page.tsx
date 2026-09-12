"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

const ACCENT = "var(--accent-gold)";

function predictGrade(pct: number): { grade: string; band: string; color: string } {
    if (pct >= 90) return { grade: "A1", band: "Distinction", color: "#3ECF8E" };
    if (pct >= 80) return { grade: "A2", band: "Distinction", color: "#3ECF8E" };
    if (pct >= 70) return { grade: "B1", band: "Merit",       color: "#5B8AF5" };
    if (pct >= 60) return { grade: "B2", band: "Merit",       color: "#5B8AF5" };
    if (pct >= 50) return { grade: "C1", band: "Pass",        color: "#F5A623" };
    if (pct >= 40) return { grade: "C2", band: "Pass",        color: "#F5A623" };
    return { grade: "F", band: "Fail", color: "#E5534B" };
}

function percentile(accuracy: number): number {
    if (accuracy >= 95) return 99;
    if (accuracy >= 90) return 97;
    if (accuracy >= 85) return 94;
    if (accuracy >= 80) return 90;
    if (accuracy >= 75) return 82;
    if (accuracy >= 70) return 72;
    if (accuracy >= 65) return 60;
    if (accuracy >= 60) return 48;
    if (accuracy >= 50) return 35;
    return 15;
}

function GaugeArc({ value, color }: { value: number; color: string }) {
    const r = 60;
    const circ = Math.PI * r;
    const dash = circ * Math.min(value, 100) / 100;
    return (
        <svg width={140} height={80} viewBox="0 0 140 80" style={{ display: "block", margin: "0 auto" }}>
            <path d={`M 10 70 A ${r} ${r} 0 0 1 130 70`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} strokeLinecap="round" />
            <path d={`M 10 70 A ${r} ${r} 0 0 1 130 70`} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`} style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
        </svg>
    );
}

export default function PreBoard90ReportPage({ params }: { params: Promise<{ attemptId: string }> }) {
    const { attemptId } = use(params);
    const router = useRouter();
    const { data: attempt, isLoading } = trpc.test.getAttempt.useQuery({ attemptId });

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--bg-border)", borderTopColor: ACCENT, animation: "spin360 0.7s linear infinite" }} />
            </div>
        );
    }

    if (!attempt?.result) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)" }}>Report not found.</div>
                <button onClick={() => router.back()} style={{ background: ACCENT, border: "none", borderRadius: 10, padding: "10px 24px", color: "#0A0A0F", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Go back</button>
            </div>
        );
    }

    const result = attempt.result;
    const accuracy = result.accuracy;
    const grade = predictGrade(accuracy);
    const pct = percentile(accuracy);
    const weakChapters = result.weakChapters as string[];
    const strongChapters = result.strongChapters as string[];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "32px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
            <button onClick={() => router.push("/dashboard/pre-board-90")} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)", padding: 0, marginBottom: 32 }}>← Pre-Board 90</button>

            {/* Header */}
            <div style={{ marginBottom: 30 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E5534B", marginBottom: 10 }}>Phase 3 · Mock Report</div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 6px", lineHeight: 1.15 }}>
                    {attempt.subject} — Results
                </h1>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                    {new Date(attempt.submittedAt ?? attempt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
            </div>

            {/* Score / Grade / Percentile grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 16, padding: "18px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 7, opacity: 0.55 }}>Score</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: grade.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{result.correct}/{result.totalQuestions}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{Math.round(accuracy)}% accuracy</div>
                </div>
                <div style={{ background: "var(--bg-surface)", border: `1px solid ${grade.color}28`, borderRadius: 16, padding: "18px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 7, opacity: 0.55 }}>Predicted Grade</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 34, color: grade.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{grade.grade}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{grade.band}</div>
                </div>
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 16, padding: "18px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 7, opacity: 0.55 }}>Percentile</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>{pct}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>out of 100</div>
                </div>
            </div>

            {/* Accuracy gauge */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 18, padding: "22px 26px", marginBottom: 18, textAlign: "center" }}>
                <GaugeArc value={accuracy} color={grade.color} />
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: grade.color, letterSpacing: "-0.02em", marginTop: -6 }}>{Math.round(accuracy)}%</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    {result.timeTaken} min · {result.attempted}/{result.totalQuestions} attempted
                </div>
            </div>

            {/* Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                    { label: "Correct",      value: result.correct,     color: "#3ECF8E" },
                    { label: "Incorrect",    value: result.incorrect,   color: "#E5534B" },
                    { label: "Unattempted", value: result.unattempted, color: "var(--text-muted)" },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 12, padding: "13px 14px", textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color, letterSpacing: "-0.02em" }}>{value}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3 }}>{label}</div>
                    </div>
                ))}
            </div>

            {strongChapters.length > 0 && (
                <div style={{ background: "rgba(62,207,142,0.05)", border: "1px solid rgba(62,207,142,0.18)", borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3ECF8E", marginBottom: 10 }}>Strong Areas</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {strongChapters.map((ch: string) => <div key={ch} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#3ECF8E", background: "rgba(62,207,142,0.08)", border: "1px solid rgba(62,207,142,0.2)", borderRadius: 100, padding: "5px 13px" }}>{ch}</div>)}
                    </div>
                </div>
            )}

            {weakChapters.length > 0 && (
                <div style={{ background: "rgba(229,83,75,0.05)", border: "1px solid rgba(229,83,75,0.18)", borderRadius: 14, padding: "16px 18px", marginBottom: 22 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5534B", marginBottom: 10 }}>Needs Re-Drilling</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                        {weakChapters.map((ch: string) => <div key={ch} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#E5534B", background: "rgba(229,83,75,0.08)", border: "1px solid rgba(229,83,75,0.18)", borderRadius: 100, padding: "5px 13px" }}>{ch}</div>)}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>Your next Pre-Board 90 task will prioritise these topics automatically.</div>
                </div>
            )}

            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 28, padding: "13px 17px", background: "var(--bg-surface)", borderRadius: 10, border: "1px solid var(--bg-border)" }}>
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Note: </span>
                MCQ marks are auto-calculated. Subjective answers use GPT-4o-mini partial-marking rubric. Predicted grade is indicative based on ICSE marking patterns.
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => router.push("/dashboard/pre-board-90")} style={{ flex: 1, padding: "13px", borderRadius: 12, background: ACCENT, border: "none", color: "#0A0A0F", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"} onMouseLeave={e => e.currentTarget.style.filter = "none"}>Back to Programme →</button>
                <button onClick={() => router.push("/dashboard/pre-board-90/task")} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "transparent", border: "1px solid var(--bg-border)", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>Next Task</button>
            </div>
        </div>
    );
}
