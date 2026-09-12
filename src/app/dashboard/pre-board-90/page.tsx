"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";

// Design system vars — true to the project's electric-cyan theme
const ACCENT = "var(--accent-gold)";           // #00D4FF
const ACCENT_DIM = "var(--accent-gold-glow)";  // rgba(0,212,255,0.15)
const ACCENT_BORDER = "var(--accent-gold-border)"; // rgba(0,212,255,0.35)

const PHASE_COLORS = ["#5B8AF5", "#F5A623", "#E5534B"] as const;
const PHASE_BG = ["rgba(91,138,245,0.12)", "rgba(245,166,35,0.12)", "rgba(229,83,75,0.12)"] as const;
const PHASE_LABELS = ["Phase 1 · Study", "Phase 2 · Practice", "Phase 3 · Test"];
const PHASE_DESC = [
    "Daily topic-wise revision using the Watch → Revise → Practice loop. AI Doubt Solver on call.",
    "Targeted question drills on weak areas — Numerical Mastery, Flip the Question, Competency Tests.",
    "Full-length timed board-pattern mock papers with GPT-4o-mini partial-marking evaluation.",
];

const SUBJECTS = [
    "Physics", "Chemistry", "Mathematics", "Biology",
    "History & Civics", "Geography", "English Literature", "English Language",
];

function suggestStartDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function PhaseCard({ phase, active, locked }: { phase: number; active?: boolean; locked?: boolean }) {
    const color = PHASE_COLORS[phase - 1];
    const bg = PHASE_BG[phase - 1];
    return (
        <div style={{
            flex: 1, minWidth: 180,
            background: active ? bg : "rgba(255,255,255,0.025)",
            border: `1px solid ${active ? `${color}50` : "rgba(255,255,255,0.06)"}`,
            borderRadius: 14, padding: "18px 18px",
            transition: "all 0.3s ease",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: active ? `0 0 8px ${color}` : "none" }} />
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color }}>
                    {PHASE_LABELS[phase - 1]}
                </div>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: locked ? "var(--text-disabled)" : "var(--text-muted)", lineHeight: 1.6 }}>
                {PHASE_DESC[phase - 1]}
            </div>
            {locked && (
                <div style={{ marginTop: 10, fontFamily: "var(--font-body)", fontSize: 10, color: ACCENT, fontWeight: 600 }}>
                    🔒 Requires Pro →
                </div>
            )}
        </div>
    );
}

export default function PreBoard90Page() {
    const router = useRouter();
    const utils = trpc.useUtils();
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Physics", "Chemistry", "Mathematics"]);
    const [startDate, setStartDate] = useState(suggestStartDate);
    const [enrollError, setEnrollError] = useState<string | null>(null);
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);
    const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
    const [abandonError, setAbandonError] = useState<string | null>(null);

    const { data: profile } = trpc.dashboard.getProfile.useQuery();
    const { data: pb90, refetch: refetchPb90, isLoading } = trpc.preBoard90.getPhaseProgress.useQuery();
    const { data: todayTask, refetch: refetchTask } = trpc.preBoard90.getTodayTask.useQuery(undefined, { enabled: !!pb90 });

    const enrollMutation = trpc.preBoard90.enrollPlan.useMutation({
        onSuccess: () => { refetchPb90(); refetchTask(); setEnrollError(null); },
        onError: (e) => {
            if (e.message.includes("does not exist") || e.message.includes("invocation")) {
                setEnrollError("Setting up your study plan database... Please tap Start Pre-Board 90 again.");
            } else {
                setEnrollError(e.message);
            }
        },
    });
    const abandonMutation = trpc.preBoard90.abandonPlan.useMutation({
        onSuccess: async () => {
            setShowAbandonConfirm(false);
            setAbandonError(null);
            utils.preBoard90.getPhaseProgress.setData(undefined, null);
            utils.preBoard90.getTodayTask.setData(undefined, null);
            await utils.preBoard90.invalidate();
            await refetchPb90();
            await refetchTask();
            router.refresh();
        },
        onError: (e) => {
            setAbandonError(e?.message || "Failed to abandon programme. Please try again.");
        },
    });

    const rawPlanType = (profile as any)?.planType ?? "FREE";
    const isPaid = !!((profile as any)?.isPaid || ((rawPlanType === "PRO" || rawPlanType === "BUNDLE") && (profile as any)?.subscriptionStatus === "ACTIVE"));

    const phaseEndDates = useMemo(() => {
        if (!pb90) return null;
        const fmt = (d: Date | string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        return { phase1: fmt(pb90.phase1End), phase2: fmt(pb90.phase2End), phase3: fmt(pb90.phase3End) };
    }, [pb90]);

    const toggleSubject = (s: string) => {
        setSelectedSubjects(prev => prev.includes(s) ? (prev.length > 1 ? prev.filter(x => x !== s) : prev) : [...prev, s]);
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--bg-border)", borderTopColor: ACCENT, animation: "spin360 0.7s linear infinite" }} />
            </div>
        );
    }

    // ── ACTIVE PLAN VIEW ──────────────────────────────────────────────────────
    if (pb90 && (pb90.status === "ACTIVE" || pb90.status === "COMPLETED")) {
        const currentDay = pb90.currentDay;
        const currentPhase = currentDay <= 30 ? 1 : currentDay <= 60 ? 2 : 3;
        const phaseColor = PHASE_COLORS[currentPhase - 1];
        const taskRequiresUpgrade = todayTask?.requiresUpgrade && !isPaid;

        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "32px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
                {/* Back */}
                <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)", padding: 0, marginBottom: 28 }}>← Dashboard</button>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>Pre-Board 90 · ICSE</div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 6px", lineHeight: 1.15 }}>
                        Day {currentDay} of 90
                    </h1>
                    <div style={{ fontFamily: "var(--font-tagline)", fontSize: 14, fontStyle: "italic", color: "var(--text-muted)", marginTop: 4 }}>
                        {pb90.status === "COMPLETED" ? "Programme complete. Outstanding." : `${90 - currentDay} days to December pre-boards.`}
                    </div>
                </div>

                {/* Phase pills + View Plan */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
                    {[1, 2, 3].map(p => (
                        <div key={p} style={{
                            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                            color: p === currentPhase ? PHASE_COLORS[p - 1] : "var(--text-disabled)",
                            background: p === currentPhase ? PHASE_BG[p - 1] : "transparent",
                            border: `1px solid ${p === currentPhase ? `${PHASE_COLORS[p - 1]}40` : "var(--bg-border)"}`,
                            borderRadius: 100, padding: "5px 14px",
                        }}>
                            {p <= currentPhase ? PHASE_LABELS[p - 1] : `🔒 ${PHASE_LABELS[p - 1]}`}
                        </div>
                    ))}
                    <button
                        onClick={() => router.push("/dashboard/pre-board-90/plan")}
                        style={{
                            marginLeft: "auto", background: "transparent",
                            border: `1px solid ${ACCENT_BORDER}`,
                            borderRadius: 100, padding: "5px 16px",
                            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: ACCENT, cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = ACCENT_DIM}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        View Full Plan ↗
                    </button>
                </div>

                {/* 90-day tracker */}
                <div style={{ background: "var(--bg-surface)", border: `1px solid ${ACCENT_BORDER}`, borderRadius: 18, padding: "20px 22px", marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.6 }}>Progress Tracker</div>
                        {phaseEndDates && (
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                {[
                                    { label: "Study ends", date: phaseEndDates.phase1, color: PHASE_COLORS[0] },
                                    { label: "Practice ends", date: phaseEndDates.phase2, color: PHASE_COLORS[1] },
                                    { label: "Pre-boards", date: phaseEndDates.phase3, color: ACCENT },
                                ].map(({ label, date, color }) => (
                                    <div key={label} style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>
                                        <span style={{ color, fontWeight: 700 }}>{label}: </span>{date}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Day bars */}
                    <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
                        {pb90.days.map((d) => {
                            const isDone = d.status === "DONE";
                            const isMissed = d.status === "MISSED";
                            const isActive = d.status === "ACTIVE";
                            const isHov = hoveredDay === d.day;
                            const pc = PHASE_COLORS[d.phase - 1];
                            return (
                                <div
                                    key={d.day}
                                    title={`Day ${d.day} · ${d.subject || d.taskType} · ${d.status}`}
                                    onMouseEnter={() => setHoveredDay(d.day)}
                                    onMouseLeave={() => setHoveredDay(null)}
                                    style={{
                                        flex: "0 0 auto", width: 9,
                                        height: isHov ? 38 : 32, borderRadius: 4,
                                        background: isDone ? "var(--accent-gold)" : isMissed ? "rgba(229,83,75,0.4)" : isActive ? pc : "rgba(255,255,255,0.05)",
                                        border: isActive ? `1px solid ${pc}` : `1px solid ${isDone ? "var(--accent-gold-border)" : "transparent"}`,
                                        boxShadow: isActive ? `0 0 8px ${pc}60` : isDone ? "0 0 4px var(--accent-gold-glow)" : "none",
                                        transition: "all 0.15s ease",
                                        cursor: (isDone || isActive) ? "pointer" : "default",
                                    }}
                                    onClick={() => (isDone || isActive) && router.push("/dashboard/pre-board-90/task")}
                                />
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                        {[
                            { color: "var(--accent-gold)", label: "Done" },
                            { color: PHASE_COLORS[0], label: "Phase 1 Study" },
                            { color: PHASE_COLORS[1], label: "Phase 2 Practice" },
                            { color: PHASE_COLORS[2], label: "Phase 3 Test" },
                            { color: "rgba(229,83,75,0.4)", label: "Missed" },
                        ].map(({ color, label }) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div style={{ width: 9, height: 14, borderRadius: 3, background: color, flexShrink: 0 }} />
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's task */}
                {pb90.status === "ACTIVE" && (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12, opacity: 0.6 }}>Today</div>

                        {taskRequiresUpgrade ? (
                            <div style={{ background: "var(--bg-surface)", border: `1px solid ${ACCENT_BORDER}`, borderRadius: 18, padding: "28px", textAlign: "center" }}>
                                <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)", marginBottom: 8 }}>
                                    Phase {todayTask?.task?.phase} Requires Pro
                                </div>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.6, maxWidth: 360, margin: "0 auto 24px" }}>
                                    You've completed Phase 1. Upgrade to Pro to unlock Phase 2 (Practice Drills) and Phase 3 (Full Mock Papers).
                                </div>
                                <div style={{ maxWidth: 260, margin: "0 auto" }}>
                                    <RazorpayButton amount={169} type="PRO" email={(profile as any)?.email ?? ""} name={(profile as any)?.name ?? ""} buttonText="Unlock Phases 2 & 3 — ₹169 →" onSuccess={() => { refetchPb90(); refetchTask(); }} />
                                </div>
                            </div>
                        ) : todayTask?.task ? (
                            <div
                                onClick={() => router.push("/dashboard/pre-board-90/task")}
                                style={{ background: "var(--bg-surface)", border: `1px solid ${PHASE_COLORS[(todayTask.task.phase as number) - 1]}40`, borderRadius: 18, padding: "22px 26px", cursor: "pointer", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${PHASE_COLORS[(todayTask.task.phase as number) - 1]}, transparent)` }} />
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PHASE_COLORS[(todayTask.task.phase as number) - 1], background: PHASE_BG[(todayTask.task.phase as number) - 1], border: `1px solid ${PHASE_COLORS[(todayTask.task.phase as number) - 1]}35`, borderRadius: 100, padding: "4px 10px" }}>
                                        {todayTask.task.taskType}
                                    </div>
                                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>{todayTask.task.subject}</div>
                                    {todayTask.task.status === "MISSED" && <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, color: "#E5534B", background: "rgba(229,83,75,0.1)", border: "1px solid rgba(229,83,75,0.25)", borderRadius: 100, padding: "3px 9px" }}>CATCH-UP</div>}
                                </div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-primary)", marginBottom: 4, letterSpacing: "-0.01em" }}>{todayTask.task.topicRef}</div>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Day {todayTask.task.day} · Phase {todayTask.task.phase} of 3</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ fontFamily: "var(--font-tagline)", fontSize: 12, fontStyle: "italic", color: "var(--text-muted)" }}>
                                        {todayTask.task.contentJson ? "Content ready — tap to open" : "Generating content..."}
                                    </div>
                                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: ACCENT, fontWeight: 600 }}>Open →</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 18, padding: "24px", textAlign: "center" }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)", marginBottom: 6 }}>All caught up today 🎉</div>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>Tomorrow's task unlocks at midnight. Keep the streak going.</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
                    {[
                        { label: "Completed", value: pb90.doneDays, color: ACCENT },
                        { label: "Missed", value: pb90.missedDays, color: "#E5534B" },
                        { label: "Remaining", value: 90 - pb90.doneDays - pb90.missedDays, color: "var(--text-secondary)" },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 14, padding: "16px", textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color, letterSpacing: "-0.03em", marginBottom: 3 }}>{value}</div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Abandon */}
                <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: 24, marginTop: 12 }}>
                    {!showAbandonConfirm ? (
                        <button
                            type="button"
                            onClick={() => {
                                setAbandonError(null);
                                setShowAbandonConfirm(true);
                            }}
                            disabled={abandonMutation.isPending}
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(229,83,75,0.35)",
                                borderRadius: 8,
                                padding: "9px 18px",
                                fontFamily: "var(--font-body)",
                                fontSize: 12,
                                color: "rgba(229,83,75,0.7)",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(229,83,75,0.7)";
                                e.currentTarget.style.color = "#E5534B";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "rgba(229,83,75,0.35)";
                                e.currentTarget.style.color = "rgba(229,83,75,0.7)";
                            }}
                        >
                            Abandon Programme
                        </button>
                    ) : (
                        <div style={{
                            background: "rgba(229, 83, 75, 0.08)",
                            border: "1px solid rgba(229, 83, 75, 0.28)",
                            borderRadius: 12,
                            padding: "18px 20px",
                            maxWidth: 460,
                        }}>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#E5534B", fontWeight: 600, marginBottom: 6 }}>
                                Abandon this programme?
                            </div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 14 }}>
                                Your current 90-day countdown will end and today's schedule will be closed. You can enroll in a brand new programme anytime.
                            </div>
                            {abandonError && (
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#E5534B", marginBottom: 12, background: "rgba(229,83,75,0.12)", padding: "6px 10px", borderRadius: 6 }}>
                                    {abandonError}
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <button
                                    type="button"
                                    onClick={() => abandonMutation.mutate()}
                                    disabled={abandonMutation.isPending}
                                    style={{
                                        background: "#E5534B",
                                        border: "none",
                                        borderRadius: 8,
                                        padding: "8px 16px",
                                        fontFamily: "var(--font-body)",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        cursor: abandonMutation.isPending ? "not-allowed" : "pointer",
                                        opacity: abandonMutation.isPending ? 0.7 : 1,
                                    }}
                                >
                                    {abandonMutation.isPending ? "Abandoning..." : "Yes, Abandon Programme"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAbandonConfirm(false);
                                        setAbandonError(null);
                                    }}
                                    disabled={abandonMutation.isPending}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid var(--bg-border)",
                                        borderRadius: 8,
                                        padding: "8px 16px",
                                        fontFamily: "var(--font-body)",
                                        fontSize: 12,
                                        color: "var(--text-muted)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── ENROLLMENT VIEW ───────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "32px 24px 80px", maxWidth: 760, margin: "0 auto" }}>
            <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)", padding: 0, marginBottom: 32 }}>← Dashboard</button>

            <div style={{ marginBottom: 40 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ACCENT, marginBottom: 10 }}>Pre-Board 90 · ICSE</div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 12px", lineHeight: 1.1 }}>
                    90 Days to<br />December.
                </h1>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
                    A structured 90-day countdown split into three phases. One task per day — study, drill, then test under real board conditions. No overwhelm.
                </p>
            </div>

            {/* Phase cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
                <PhaseCard phase={1} active />
                <PhaseCard phase={2} locked={!isPaid} />
                <PhaseCard phase={3} locked={!isPaid} />
            </div>

            {/* Free notice */}
            {!isPaid && (
                <div style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 14, padding: "14px 18px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>◈</div>
                    <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 3 }}>Free Plan — Phase 1 Preview</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>
                            All 30 Study days free. Upgrade to Pro (₹169) anytime to unlock Phase 2 Practice and Phase 3 Mock Papers.
                        </div>
                    </div>
                </div>
            )}

            {/* Enrolment form */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 20, padding: "26px 26px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 22, opacity: 0.6 }}>
                    Enrol in Pre-Board 90
                </div>

                {/* Subject picker */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                        Subjects <span style={{ opacity: 0.5 }}>({selectedSubjects.length} selected)</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {SUBJECTS.map(s => {
                            const sel = selectedSubjects.includes(s);
                            return (
                                <button key={s} onClick={() => toggleSubject(s)} style={{ padding: "7px 16px", border: sel ? `1px solid ${ACCENT_BORDER}` : "1px solid var(--bg-border)", borderRadius: 100, background: sel ? ACCENT_DIM : "transparent", color: sel ? ACCENT : "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: sel ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
                                    {s}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Start date */}
                <div style={{ marginBottom: 26 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                        Start Date
                        <span style={{ opacity: 0.5, marginLeft: 8, fontSize: 11 }}>Defaults to today — your 90-day countdown begins immediately</span>
                    </div>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: 8, padding: "10px 14px", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-primary)", outline: "none", colorScheme: "dark" }} />
                    {startDate && (
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 6, opacity: 0.7 }}>
                            Day 90 completion: {(() => {
                                const d = new Date(startDate + "T00:00:00");
                                d.setDate(d.getDate() + 89);
                                return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
                            })()}
                        </div>
                    )}
                </div>

                {enrollError && (
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#E5534B", background: "rgba(229,83,75,0.08)", border: "1px solid rgba(229,83,75,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                        {enrollError}
                    </div>
                )}

                <button
                    onClick={() => enrollMutation.mutate({ subjects: selectedSubjects, startDate })}
                    disabled={enrollMutation.isPending || selectedSubjects.length === 0}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, background: enrollMutation.isPending ? "rgba(0,212,255,0.3)" : "var(--accent-gold)", border: "none", color: "#0A0A0F", fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, cursor: enrollMutation.isPending ? "wait" : "pointer", transition: "all 0.2s", letterSpacing: "0.02em" }}
                    onMouseEnter={e => { if (!enrollMutation.isPending) e.currentTarget.style.filter = "brightness(1.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                >
                    {enrollMutation.isPending ? "Setting up your 90-day programme..." : "Start Pre-Board 90 →"}
                </button>
            </div>
        </div>
    );
}
