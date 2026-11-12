"use client";

import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { GenerationLoader } from "@/components/ui/GenerationLoader";
import { useResponsive } from "@/hooks/useResponsive";
import { AppIcon } from "@/components/ui/AppIcon";

interface SelectedChapter {
    chapterId: string;
    chapterName: string;
    subjectId: string;
    subjectName: string;
}

const SUBJECT_COLORS: Record<string, string> = {
    Mathematics: "#00D4FF",
    Physics: "#38BDF8",
    Chemistry: "#22D3EE",
    Biology: "#67E8F9",
    English: "#7DD3FC",
    "History & Civics": "#5EE7F2",
    Geography: "#60A5FA",
};

export default function SmartPlannerPage() {
    const router = useRouter();
    const { isMobile } = useResponsive();
    const [selectedChapters, setSelectedChapters] = useState<SelectedChapter[]>([]);
    const [startDate, setStartDate] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [dailyHours, setDailyHours] = useState(2);
    const [activeSubjectId, setActiveSubjectId] = useState("");
    const [formError, setFormError] = useState("");

    const { data: subjects } = trpc.content.getSubjects.useQuery();
    const resolvedSubjectId = activeSubjectId || subjects?.[0]?.id || "";
    const activeSubject = subjects?.find(subject => subject.id === resolvedSubjectId);
    const { data: activeChapters, isLoading: chaptersLoading } = trpc.content.getChaptersBySubject.useQuery(
        { subjectId: resolvedSubjectId },
        { enabled: Boolean(resolvedSubjectId) }
    );
    const { data: plans, refetch: refetchPlans } = trpc.planner.getMyPlans.useQuery({});

    const generatePlan = trpc.planner.generateSmartPlan.useMutation();
    const toggleComplete = trpc.planner.togglePlanComplete.useMutation({ onSuccess: () => refetchPlans() });
    const clearPlans = trpc.planner.clearAllPlans.useMutation({
        onSuccess: () => {
            setSelectedChapters([]);
            setStartDate("");
            setTargetDate("");
            refetchPlans();
        },
    });

    const handleGeneratePlan = async () => {
        if (selectedChapters.length === 0 || !startDate || !targetDate) {
            setFormError("Choose at least one chapter and both dates to continue.");
            return;
        }
        if (new Date(targetDate) < new Date(startDate)) {
            setFormError("Target date must be after the start date.");
            return;
        }
        setFormError("");
        const chaptersBySubject = selectedChapters.reduce((acc, ch) => {
            if (!acc[ch.subjectId]) acc[ch.subjectId] = [];
            acc[ch.subjectId].push(ch.chapterId);
            return acc;
        }, {} as Record<string, string[]>);

        for (const [subjectId, chapterIds] of Object.entries(chaptersBySubject)) {
            try {
                await generatePlan.mutateAsync({ subjectId, chapterIds, startDate, targetDate, dailyHours });
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Could not generate the plan";
                setFormError(message);
                return;
            }
        }
        refetchPlans();
    };

    const toggleChapter = (chapter: SelectedChapter) => {
        setSelectedChapters(prev => {
            const exists = prev.find(c => c.chapterId === chapter.chapterId);
            return exists ? prev.filter(c => c.chapterId !== chapter.chapterId) : [...prev, chapter];
        });
    };

    const completedCount = plans?.filter(p => p.completed).length || 0;
    const totalPlans = plans?.length || 0;
    const progressPercent = totalPlans > 0 ? Math.round((completedCount / totalPlans) * 100) : 0;
    const selectedChapterIds = useMemo(
        () => new Set(selectedChapters.map(chapter => chapter.chapterId)),
        [selectedChapters]
    );

    type PlannerPlan = NonNullable<typeof plans>[number];
    const plansByDate = (plans || []).reduce((acc, plan) => {
        const key = new Date(plan.planDate).toDateString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(plan);
        return acc;
    }, {} as Record<string, PlannerPlan[]>);

    // ── Timeline view ──
    if (plans && plans.length > 0) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "var(--bg-base)",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Header */}
                <div style={{
                    padding: isMobile ? "16px" : "24px 32px",
                    borderBottom: "1px solid var(--bg-border)",
                    background: "var(--bg-surface)",
                    flexShrink: 0,
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "flex-start" : "center",
                        flexDirection: isMobile ? "column" : "row",
                        gap: 14,
                        marginBottom: 16,
                    }}>
                        <div>
                            <h1 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: isMobile ? 22 : 28,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                letterSpacing: "-0.02em",
                                margin: 0,
                                marginBottom: 4,
                            }}>
                                Study Timeline
                            </h1>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                                {completedCount} of {totalPlans} chapters completed
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm("Create a new timeline? This will clear your current plan.")) {
                                    clearPlans.mutate();
                                }
                            }}
                            className="btn-gold"
                            style={{ fontSize: 13, padding: "10px 20px", borderRadius: 10 }}
                        >
                            + New Timeline
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>
                                Overall progress
                            </span>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--accent-gold)" }}>
                                {progressPercent}%
                            </span>
                        </div>
                        <div style={{ height: 4, background: "var(--bg-border)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{
                                width: `${progressPercent}%`,
                                height: "100%",
                                background: "var(--accent-gold)",
                                transition: "width 0.8s ease",
                            }} />
                        </div>
                    </div>
                </div>

                {/* Timeline content */}
                <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "32px" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        {Object.entries(plansByDate).map(([dateStr, dayPlans]) => (
                            <div key={dateStr} style={{ marginBottom: 36 }}>
                                <div style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    letterSpacing: "-0.01em",
                                    marginBottom: 12,
                                }}>
                                    {new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
                                    gap: 12,
                                }}>
                                    {dayPlans.map((plan) => {
                                        const color = SUBJECT_COLORS[plan.subject?.name] || "var(--accent-gold)";
                                        return (
                                            <div
                                                key={plan.id}
                                                style={{
                                                    background: "var(--bg-surface)",
                                                    border: `1px solid ${plan.completed ? "rgba(34,197,94,0.3)" : "var(--bg-border)"}`,
                                                    borderLeft: `3px solid ${plan.completed ? "#22c55e" : color}`,
                                                    borderRadius: 12,
                                                    padding: "16px 18px",
                                                    opacity: plan.completed ? 0.65 : 1,
                                                    transition: "opacity 0.2s ease",
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            fontFamily: "var(--font-body)",
                                                            fontSize: 14, fontWeight: 600,
                                                            color: plan.completed ? "var(--text-muted)" : "var(--text-primary)",
                                                            marginBottom: 4,
                                                            textDecoration: plan.completed ? "line-through" : "none",
                                                            letterSpacing: "-0.01em",
                                                        }}>
                                                            {plan.topicName || plan.chapter?.name}
                                                        </div>
                                                        <div style={{
                                                            fontFamily: "var(--font-body)",
                                                            fontSize: 12,
                                                            color: color,
                                                            marginBottom: 10,
                                                        }}>
                                                            {plan.subject?.name || "Subject"}
                                                        </div>
                                                        <button
                                                            onClick={() => router.push(`/dashboard/ai-assistant?topic=${encodeURIComponent(plan.topicName || plan.chapter?.name)}&subject=${plan.subject?.name}`)}
                                                            style={{
                                                                fontFamily: "var(--font-body)",
                                                                fontSize: 11,
                                                                color: "var(--text-muted)",
                                                                background: "none",
                                                                border: "1px solid var(--bg-border)",
                                                                borderRadius: 6,
                                                                padding: "4px 10px",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            Ask AI →
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={plan.completed}
                                                        onChange={e => {
                                                            e.stopPropagation();
                                                            toggleComplete.mutate({ planId: plan.id, completed: !plan.completed });
                                                        }}
                                                        style={{
                                                            width: 20, height: 20,
                                                            accentColor: "#22c55e",
                                                            cursor: "pointer",
                                                            flexShrink: 0,
                                                            marginTop: 2,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── Plan creation form ──
    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--bg-base)",
            padding: isMobile ? "24px 16px" : "48px",
            overflowY: "auto",
        }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
                <div style={{ marginBottom: isMobile ? 24 : 30 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                        <AppIcon name="map" size={15} /> Personal study route
                    </div>
                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: isMobile ? 32 : 42,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.03em",
                        margin: "0 0 8px",
                    }}>
                        Smart Planner
                    </h1>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                        Pick what you need to finish. We will arrange it into a realistic day-by-day timeline.
                    </p>
                </div>

                <div style={{
                    background: "rgba(19, 19, 31, 0.92)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 18,
                    padding: isMobile ? "18px 14px" : "28px",
                    boxShadow: "0 18px 48px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.035)",
                }}>
                    <div style={{ marginBottom: 26 }}>
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                            <div>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>
                                    1 · Choose a subject
                                </div>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>Switch subjects without losing your chapter selections.</div>
                            </div>
                            <div style={{ flexShrink: 0, padding: "5px 9px", borderRadius: 7, border: "1px solid var(--accent-gold-border)", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700 }}>
                                {selectedChapters.length} selected
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))", gap: 8 }}>
                            {subjects?.map(subject => {
                                const active = subject.id === resolvedSubjectId;
                                const selectedCount = selectedChapters.filter(chapter => chapter.subjectId === subject.id).length;
                                return (
                                    <button
                                        key={subject.id}
                                        onClick={() => setActiveSubjectId(subject.id)}
                                        aria-pressed={active}
                                        style={{
                                            minHeight: 62,
                                            padding: "10px 11px",
                                            borderRadius: 11,
                                            border: active ? "1px solid var(--accent-gold-border)" : "1px solid var(--bg-border)",
                                            borderBottomColor: active ? "rgba(0,212,255,0.5)" : "rgba(0,0,0,0.55)",
                                            background: active ? "rgba(0,212,255,0.09)" : "var(--bg-base)",
                                            boxShadow: active ? "0 4px 0 rgba(0,107,128,0.32), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 3px 0 rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.025)",
                                            color: active ? "var(--text-primary)" : "var(--text-secondary)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            fontFamily: "var(--font-body)",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            gap: 7,
                                            transition: "border-color 120ms ease, background 120ms ease, color 120ms ease",
                                        }}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                                            <AppIcon name="book" size={14} color={active ? "var(--accent-gold)" : "var(--text-muted)"} />
                                            <span style={{ fontSize: 12, fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subject.name}</span>
                                        </span>
                                        <span style={{ color: selectedCount ? "var(--accent-gold)" : "var(--text-muted)", fontSize: 10, fontWeight: 600 }}>
                                            {selectedCount ? `${selectedCount} chosen` : "Select chapters"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: 12, border: "1px solid var(--bg-border)", borderRadius: 12, background: "var(--bg-base)", overflow: "hidden" }}>
                            <div style={{ padding: "11px 13px", borderBottom: "1px solid var(--bg-border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 650, color: "var(--text-primary)" }}>{activeSubject?.name || "Select a subject"} chapters</span>
                                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>{activeChapters?.length || 0} available</span>
                            </div>
                            <div style={{ maxHeight: 230, overflowY: "auto", padding: 8, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: 5 }}>
                                {chaptersLoading ? (
                                    <div style={{ gridColumn: "1 / -1", padding: 18, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12, textAlign: "center" }}>Loading chapters...</div>
                                ) : activeChapters?.map(chapter => {
                                    const selected = selectedChapterIds.has(chapter.id);
                                    return (
                                        <button
                                            key={chapter.id}
                                            onClick={() => activeSubject && toggleChapter({ chapterId: chapter.id, chapterName: chapter.name, subjectId: activeSubject.id, subjectName: activeSubject.name })}
                                            aria-pressed={selected}
                                            style={{
                                                minHeight: 42,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                padding: "8px 10px",
                                                borderRadius: 8,
                                                border: selected ? "1px solid rgba(0,212,255,0.24)" : "1px solid transparent",
                                                background: selected ? "rgba(0,212,255,0.07)" : "transparent",
                                                color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                                                cursor: "pointer",
                                                textAlign: "left",
                                                fontFamily: "var(--font-body)",
                                            }}
                                        >
                                            <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, display: "grid", placeItems: "center", border: selected ? "1px solid var(--accent-gold)" : "1px solid var(--bg-border-light)", background: selected ? "var(--accent-gold-glow)" : "var(--bg-surface)", color: "var(--accent-gold)" }}>
                                                {selected && <AppIcon name="check" size={12} strokeWidth={2.4} />}
                                            </span>
                                            <span style={{ fontSize: 12, lineHeight: 1.35 }}><span style={{ color: "var(--text-muted)", marginRight: 5 }}>{chapter.order}.</span>{chapter.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 12, fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>2 · Set your study window</div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 22 }}>
                        {[
                            { label: "Start date", hint: "When the plan begins", val: startDate, set: setStartDate },
                            { label: "Target date", hint: "When you want to finish", val: targetDate, set: setTargetDate },
                        ].map(({ label, hint, val, set }) => (
                            <label key={label} className="planner-date-card" style={{
                                display: "block",
                                padding: "13px 14px 11px",
                                borderRadius: 12,
                                border: "1px solid var(--bg-border)",
                                borderBottomColor: "rgba(0,0,0,0.62)",
                                background: "var(--bg-base)",
                                boxShadow: "0 5px 0 rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.035)",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", background: "var(--accent-gold-glow)", border: "1px solid var(--accent-gold-border)", color: "var(--accent-gold)" }}><AppIcon name="calendar" size={15} /></div>
                                    <div>
                                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                                        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{hint}</div>
                                    </div>
                                </div>
                                <input
                                    type="date"
                                    value={val}
                                    min={label === "Target date" ? startDate || undefined : undefined}
                                    onChange={e => { set(e.target.value); setFormError(""); }}
                                    style={{ width: "100%", boxSizing: "border-box", height: 38, borderRadius: 8, border: "1px solid var(--bg-border)", background: "var(--bg-surface)", color: val ? "var(--text-primary)" : "var(--text-muted)", padding: "0 10px", colorScheme: "dark", fontFamily: "var(--font-body)", fontSize: 12, outline: "none" }}
                                />
                            </label>
                        ))}
                    </div>

                    {/* Daily hours slider */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11, fontWeight: 700,
                            color: "var(--text-muted)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 12,
                        }}>
                            Daily study hours:{" "}
                            <span style={{ color: "var(--accent-gold)" }}>{dailyHours}h</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="8"
                            value={dailyHours}
                            onChange={e => setDailyHours(parseInt(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--accent-gold)", height: 4 }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>
                            <span>1h</span><span>8h</span>
                        </div>
                    </div>

                    {formError && (
                        <div role="alert" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", marginBottom: 12, borderRadius: 9, border: "1px solid rgba(248,113,113,0.24)", background: "rgba(248,113,113,0.07)", color: "var(--status-red)", fontFamily: "var(--font-body)", fontSize: 12 }}>
                            <AppIcon name="alert" size={15} /> {formError}
                        </div>
                    )}

                    <button
                        onClick={handleGeneratePlan}
                        disabled={generatePlan.isPending}
                        className="btn-gold"
                        style={{
                            width: "100%",
                            padding: "15px",
                            fontSize: 15,
                            borderRadius: 10,
                            opacity: generatePlan.isPending ? 0.6 : 1,
                            cursor: generatePlan.isPending ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 0 rgba(0,107,128,0.38)",
                        }}
                    >
                        {generatePlan.isPending ? "Generating..." : "Generate Plan →"}
                    </button>
                </div>
            </div>

            <GenerationLoader
                isVisible={generatePlan.isPending}
                label="Building Your Plan..."
                subLabel="Optimizing timeline based on difficulty..."
            />
        </div>
    );
}
