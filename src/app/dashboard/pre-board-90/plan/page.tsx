"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

const ACCENT = "var(--accent-gold)";
const ACCENT_DIM = "var(--accent-gold-glow)";
const ACCENT_BORDER = "var(--accent-gold-border)";
const PHASE_COLORS = ["#5B8AF5", "#F5A623", "#E5534B"] as const;
const PHASE_BG = ["rgba(91,138,245,0.10)", "rgba(245,166,35,0.10)", "rgba(229,83,75,0.10)"] as const;
const PHASE_NAMES = ["Study", "Practice", "Test"];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    DONE:    { label: "Done",    color: "var(--accent-gold)",       bg: "var(--accent-gold-glow)" },
    ACTIVE:  { label: "Today",   color: "#3ECF8E",                  bg: "rgba(62,207,142,0.1)" },
    MISSED:  { label: "Missed",  color: "#E5534B",                  bg: "rgba(229,83,75,0.1)" },
    LOCKED:  { label: "Locked",  color: "var(--text-disabled)",     bg: "rgba(255,255,255,0.03)" },
};

export default function PreBoard90PlanPage() {
    const router = useRouter();
    const [phaseFilter, setPhaseFilter] = useState<0 | 1 | 2 | 3>(0); // 0 = all
    const [subjectFilter, setSubjectFilter] = useState<string>("all");
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const { data: schedule, isLoading } = trpc.preBoard90.getPlanSchedule.useQuery();

    // All unique subjects
    const subjects = useMemo(() => {
        if (!schedule) return [];
        return ["all", ...Array.from(new Set(schedule.tasks.map(t => t.subject)))];
    }, [schedule]);

    // Filtered task list
    const filtered = useMemo(() => {
        if (!schedule) return [];
        return schedule.tasks.filter(t => {
            const phaseOk = phaseFilter === 0 || t.phase === phaseFilter;
            const subjOk = subjectFilter === "all" || t.subject === subjectFilter;
            return phaseOk && subjOk;
        });
    }, [schedule, phaseFilter, subjectFilter]);

    // Stats per phase
    const phaseStats = useMemo(() => {
        if (!schedule) return [];
        return [1, 2, 3].map(p => {
            const tasks = schedule.tasks.filter(t => t.phase === p);
            const done = tasks.filter(t => t.status === "DONE").length;
            return { phase: p, total: tasks.length, done };
        });
    }, [schedule]);

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--bg-border)", borderTopColor: ACCENT, animation: "spin360 0.7s linear infinite" }} />
            </div>
        );
    }

    if (!schedule) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)" }}>No active plan found.</div>
                <button onClick={() => router.push("/dashboard/pre-board-90")} style={{ background: ACCENT, border: "none", borderRadius: 10, padding: "10px 24px", color: "#0A0A0F", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Start Pre-Board 90</button>
            </div>
        );
    }

    const startDateStr = new Date(schedule.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "32px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
            {/* Back */}
            <button onClick={() => router.push("/dashboard/pre-board-90")} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)", padding: 0, marginBottom: 28 }}>← Pre-Board 90</button>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>Full Programme Plan</div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 6px" }}>90 Days · {schedule.board}</h1>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                    Starting {startDateStr} · {schedule.subjects.join(", ")}
                </div>
            </div>

            {/* Phase summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
                {phaseStats.map(({ phase, total, done }) => (
                    <div
                        key={phase}
                        onClick={() => setPhaseFilter(phaseFilter === phase ? 0 : phase as 1 | 2 | 3)}
                        style={{
                            background: phaseFilter === phase ? PHASE_BG[phase - 1] : "var(--bg-surface)",
                            border: `1px solid ${phaseFilter === phase ? `${PHASE_COLORS[phase - 1]}45` : "var(--bg-border)"}`,
                            borderRadius: 14, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { if (phaseFilter !== phase) e.currentTarget.style.borderColor = `${PHASE_COLORS[phase - 1]}30`; }}
                        onMouseLeave={e => { if (phaseFilter !== phase) e.currentTarget.style.borderColor = "var(--bg-border)"; }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: PHASE_COLORS[phase - 1] }} />
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: PHASE_COLORS[phase - 1] }}>Phase {phase} · {PHASE_NAMES[phase - 1]}</div>
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>Days {(phase - 1) * 30 + 1}–{phase * 30}</div>

                        {/* Progress bar */}
                        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.round((done / total) * 100)}%`, background: PHASE_COLORS[phase - 1], borderRadius: 2, transition: "width 0.6s ease" }} />
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{done}/{total} done</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                {/* Phase filter */}
                <div style={{ display: "flex", gap: 6, background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 100, padding: "4px" }}>
                    {([0, 1, 2, 3] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPhaseFilter(p)}
                            style={{
                                padding: "5px 14px", borderRadius: 100, border: "none",
                                background: phaseFilter === p ? (p === 0 ? ACCENT_DIM : PHASE_BG[p - 1]) : "transparent",
                                color: phaseFilter === p ? (p === 0 ? ACCENT : PHASE_COLORS[p - 1]) : "var(--text-muted)",
                                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                                cursor: "pointer", transition: "all 0.18s",
                            }}
                        >
                            {p === 0 ? "All Phases" : `P${p} ${PHASE_NAMES[p - 1]}`}
                        </button>
                    ))}
                </div>

                {/* Subject filter */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {subjects.map(s => (
                        <button
                            key={s}
                            onClick={() => setSubjectFilter(s)}
                            style={{
                                padding: "5px 14px", borderRadius: 100,
                                border: `1px solid ${subjectFilter === s ? ACCENT_BORDER : "var(--bg-border)"}`,
                                background: subjectFilter === s ? ACCENT_DIM : "transparent",
                                color: subjectFilter === s ? ACCENT : "var(--text-muted)",
                                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: subjectFilter === s ? 700 : 400,
                                cursor: "pointer", transition: "all 0.18s",
                            }}
                        >
                            {s === "all" ? "All Subjects" : s}
                        </button>
                    ))}
                </div>

                <div style={{ marginLeft: "auto", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", opacity: 0.6 }}>
                    {filtered.length} task{filtered.length !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 18, overflow: "hidden" }}>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "60px 80px 120px 1fr 90px", gap: 0, borderBottom: "1px solid var(--bg-border)", padding: "12px 20px" }}>
                    {["Day", "Phase", "Subject", "Topic / Chapter", "Status"].map(h => (
                        <div key={h} style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.5 }}>{h}</div>
                    ))}
                </div>

                {/* Rows */}
                <div style={{ maxHeight: 600, overflowY: "auto" }}>
                    {filtered.map((t, idx) => {
                        const sc = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.LOCKED;
                        const isHov = hoveredRow === idx;
                        const phaseColor = PHASE_COLORS[t.phase - 1];
                        return (
                            <div
                                key={t.id}
                                onMouseEnter={() => setHoveredRow(idx)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "60px 80px 120px 1fr 90px",
                                    gap: 0,
                                    padding: "12px 20px",
                                    borderBottom: idx < filtered.length - 1 ? "1px solid var(--bg-border)" : "none",
                                    background: isHov ? "var(--bg-elevated)" : "transparent",
                                    transition: "background 0.15s",
                                    alignItems: "center",
                                }}
                            >
                                {/* Day */}
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: t.status === "ACTIVE" ? "var(--accent-gold)" : "var(--text-muted)", opacity: t.status === "LOCKED" ? 0.4 : 1 }}>
                                    {t.day}
                                </div>

                                {/* Phase pill */}
                                <div>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: phaseColor, opacity: t.status === "LOCKED" ? 0.3 : 1 }} />
                                        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: t.status === "LOCKED" ? "var(--text-disabled)" : phaseColor, fontWeight: 600 }}>P{t.phase}</div>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: t.status === "LOCKED" ? "var(--text-disabled)" : "var(--text-muted)", paddingRight: 8 }}>
                                    {t.subject}
                                </div>

                                {/* Topic */}
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: t.status === "LOCKED" ? "var(--text-disabled)" : "var(--text-primary)", paddingRight: 16, opacity: t.status === "LOCKED" ? 0.4 : 1 }}>
                                    {t.topicRef}
                                    {t.taskType !== "STUDY" && (
                                        <span style={{ marginLeft: 8, fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: phaseColor, opacity: 0.7 }}>
                                            · {t.taskType}
                                        </span>
                                    )}
                                </div>

                                {/* Status badge */}
                                <div>
                                    <div style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 100, background: sc.bg, fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sc.color }}>
                                        {sc.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>
                            No tasks match the current filters.
                        </div>
                    )}
                </div>
            </div>

            {/* Footer note */}
            <div style={{ marginTop: 20, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", opacity: 0.55, lineHeight: 1.6 }}>
                Topics rotate across subjects each day. Phase 1 (Days 1–30) focuses on study and revision. Phase 2 (Days 31–60) drills practice questions on the same topics. Phase 3 (Days 61–90) runs full mock papers under board-exam conditions.
            </div>
        </div>
    );
}
