"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { GenerationLoader } from "@/components/ui/GenerationLoader";
import { useResponsive } from "@/hooks/useResponsive";

interface SelectedChapter {
    chapterId: string;
    chapterName: string;
    subjectId: string;
    subjectName: string;
}

const SUBJECT_COLORS: Record<string, string> = {
    Mathematics: "#C9A84C",
    Physics: "#60a5fa",
    Chemistry: "#33DFFF",
    Biology: "#22c55e",
    English: "#f472b6",
    "History & Civics": "#fb923c",
    Geography: "#34d399",
};

export default function SmartPlannerPage() {
    const router = useRouter();
    const { isMobile } = useResponsive();
    const [selectedChapters, setSelectedChapters] = useState<SelectedChapter[]>([]);
    const [startDate, setStartDate] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [dailyHours, setDailyHours] = useState(2);

    const { data: subjects } = trpc.content.getSubjects.useQuery();
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
            alert("Please select chapters and dates");
            return;
        }
        const chaptersBySubject = selectedChapters.reduce((acc, ch) => {
            if (!acc[ch.subjectId]) acc[ch.subjectId] = [];
            acc[ch.subjectId].push(ch.chapterId);
            return acc;
        }, {} as Record<string, string[]>);

        for (const [subjectId, chapterIds] of Object.entries(chaptersBySubject)) {
            try {
                await generatePlan.mutateAsync({ subjectId, chapterIds, startDate, targetDate, dailyHours });
            } catch (err: any) {
                alert(`Error: ${err.message}`);
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

    const plansByDate = (plans || []).reduce((acc, plan: any) => {
        const key = new Date(plan.planDate).toDateString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(plan);
        return acc;
    }, {} as Record<string, any[]>);

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
                                    {dayPlans.map((plan: any) => {
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
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <div style={{ marginBottom: 32, animation: "pageEnter 0.4s ease-out both" }}>
                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: isMobile ? 32 : 44,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.03em",
                        margin: "0 0 8px",
                    }}>
                        Smart Planner
                    </h1>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                        Select chapters and dates — AI builds a day-by-day revision timeline.
                    </p>
                </div>

                <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 20,
                    padding: isMobile ? "20px 16px" : "36px",
                }}>
                    {/* Chapter selector */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginBottom: 14,
                        }}>
                            Chapters{" "}
                            {selectedChapters.length > 0 && (
                                <span style={{ color: "var(--accent-gold)", fontFamily: "var(--font-body)" }}>
                                    — {selectedChapters.length} selected
                                </span>
                            )}
                        </div>
                        <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                            {subjects?.map(subject => (
                                <SubjectChapterSelector
                                    key={subject.id}
                                    subject={subject}
                                    selectedChapters={selectedChapters}
                                    onToggleChapter={toggleChapter}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Date inputs */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                        {[
                            { label: "Start Date", val: startDate, set: setStartDate },
                            { label: "Target Date", val: targetDate, set: setTargetDate },
                        ].map(({ label, val, set }) => (
                            <div key={label}>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                                    {label}
                                </div>
                                <input
                                    type="date"
                                    value={val}
                                    onChange={e => set(e.target.value)}
                                    className="sa-input"
                                    style={{ width: "100%", boxSizing: "border-box" }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Daily hours slider */}
                    <div style={{ marginBottom: 32 }}>
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

                    <button
                        onClick={handleGeneratePlan}
                        disabled={generatePlan.isPending}
                        className="btn-gold"
                        style={{
                            width: "100%",
                            padding: "15px",
                            fontSize: 15,
                            borderRadius: 12,
                            opacity: generatePlan.isPending ? 0.6 : 1,
                            cursor: generatePlan.isPending ? "not-allowed" : "pointer",
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

function SubjectChapterSelector({
    subject,
    selectedChapters,
    onToggleChapter,
}: {
    subject: any;
    selectedChapters: SelectedChapter[];
    onToggleChapter: (chapter: SelectedChapter) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: chapters } = trpc.content.getChaptersBySubject.useQuery(
        { subjectId: subject.id },
        { enabled: isExpanded }
    );
    const selectedCount = selectedChapters.filter(c => c.subjectId === subject.id).length;
    const color = SUBJECT_COLORS[subject.name] || "var(--accent-gold)";

    return (
        <div style={{
            background: "var(--bg-base)",
            border: "1px solid var(--bg-border)",
            borderRadius: 10,
            overflow: "hidden",
        }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "transparent",
                    color: "var(--text-primary)",
                    border: "none",
                    fontFamily: "var(--font-body)",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color }}>{subject.icon}</span>
                    {subject.name}
                    {selectedCount > 0 && (
                        <span style={{
                            background: "rgba(0,212,255,0.12)",
                            color: "var(--accent-gold)",
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 10, fontWeight: 700,
                        }}>
                            {selectedCount}
                        </span>
                    )}
                </span>
                <span style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    transform: isExpanded ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s ease",
                }}>
                    ▶
                </span>
            </button>

            {isExpanded && (
                <div style={{ borderTop: "1px solid var(--bg-border)", padding: "8px 12px", maxHeight: 200, overflowY: "auto" }}>
                    {chapters?.map(chapter => {
                        const isSelected = selectedChapters.some(c => c.chapterId === chapter.id);
                        return (
                            <label
                                key={chapter.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "8px 10px",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    background: isSelected ? "rgba(0,212,255,0.06)" : "transparent",
                                    marginBottom: 2,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onToggleChapter({ chapterId: chapter.id, chapterName: chapter.name, subjectId: subject.id, subjectName: subject.name })}
                                    style={{ width: 16, height: 16, accentColor: "var(--accent-gold)", cursor: "pointer" }}
                                />
                                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: isSelected ? "var(--text-primary)" : "var(--text-secondary)" }}>
                                    Ch {chapter.order}: {chapter.name}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
