"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { matchStudyFlowChapter } from "@/lib/studyFlowMatcher";

const ACCENT = "var(--accent-gold)";
const ACCENT_DIM = "var(--accent-gold-glow)";
const ACCENT_BORDER = "var(--accent-gold-border)";
const PHASE_COLORS = ["#5B8AF5", "#F5A623", "#E5534B"] as const;
const PHASE_BG = ["rgba(91,138,245,0.12)", "rgba(245,166,35,0.12)", "rgba(229,83,75,0.12)"] as const;

// ── Study task renderer ───────────────────────────────────────────────────────
function StudyTaskView({
    task,
    content,
    onComplete,
    submitting,
}: {
    task: any;
    content: any;
    onComplete: () => void;
    submitting: boolean;
}) {
    const router = useRouter();
    const storageKey = `pb90-study-checked-${task.id}`;

    // Match exact chapter from Study Flow
    const studyFlowMatch = matchStudyFlowChapter(task.subject, task.topicRef);
    const { chapter, directUrl, subjectMeta } = studyFlowMatch;

    // Checkbox items (from AI checklist, or fallback from chapter bullets)
    const items: string[] =
        content?.revisionChecklist?.length > 0
            ? content.revisionChecklist
            : chapter?.revise?.bullets?.slice(0, 5) || [
                  "Review core definitions and SI units",
                  "Understand key formulas and their derivations",
                  "Solve at least 2 practice numericals",
                  "Review common board exam traps and mistakes",
                  "Self-test without looking at notes",
              ];

    const [checked, setChecked] = useState<Record<number, boolean>>({});
    const [activeTab, setActiveTab] = useState<"flow" | "revise" | "practice">("flow");
    const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

    // Load saved checklist state
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                setChecked(JSON.parse(saved));
            }
        } catch {
            // ignore localStorage error
        }
    }, [storageKey]);

    const toggleCheck = (index: number) => {
        setChecked((prev) => {
            const next = { ...prev, [index]: !prev[index] };
            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

    const handleTickAll = () => {
        const allChecked: Record<number, boolean> = {};
        items.forEach((_, i) => {
            allChecked[i] = true;
        });
        setChecked(allChecked);
        try {
            localStorage.setItem(storageKey, JSON.stringify(allChecked));
        } catch {
            // ignore
        }
    };

    const doneCount = Object.values(checked).filter(Boolean).length;
    const progressPct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;
    const allDone = items.length > 0 && doneCount >= items.length;

    // Video URL to open or display
    const videoUrl =
        chapter?.watch?.videoUrl ||
        (content?.watchQuery
            ? `https://www.youtube.com/results?search_query=${encodeURIComponent(content.watchQuery)}`
            : null);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* ── 1. Featured Study Flow Chapter Card ── */}
            <div
                style={{
                    background: "linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(91, 138, 245, 0.04) 100%)",
                    border: "1px solid var(--accent-gold-border)",
                    borderRadius: 16,
                    padding: "22px 24px",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0, 212, 255, 0.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 14,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{subjectMeta?.icon || "▶"}</span>
                        <span
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: ACCENT,
                            }}
                        >
                            STUDY FLOW · {subjectMeta?.label || task.subject}
                        </span>
                        {chapter && (
                            <span
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "var(--text-muted)",
                                    background: "var(--bg-elevated)",
                                    padding: "2px 8px",
                                    borderRadius: 6,
                                }}
                            >
                                {chapter.id.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => router.push(directUrl)}
                        style={{
                            background: ACCENT,
                            color: "#0A0A0F",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px 16px",
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 12px rgba(0, 212, 255, 0.25)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 4px 18px rgba(0, 212, 255, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 212, 255, 0.25)";
                        }}
                    >
                        <span>Open Exact Chapter in Study Flow</span>
                        <span>↗</span>
                    </button>
                </div>

                <div
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 8,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {chapter?.title || task.topicRef}
                </div>

                <div
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        marginBottom: 16,
                    }}
                >
                    {chapter?.revise?.summary ||
                        content?.summary ||
                        "Master this ICSE topic with the full Watch → Revise → Practice loop designed for top exam performance."}
                </div>

                {/* Study Flow 3-Step Pill Bar */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: 10,
                    }}
                >
                    <div
                        onClick={() => setActiveTab("flow")}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            background:
                                activeTab === "flow" ? "rgba(0, 212, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                            border: `1px solid ${activeTab === "flow" ? ACCENT_BORDER : "var(--bg-border)"}`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 2 }}>
                            1. WATCH
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                            {chapter?.watch?.title ? "One-Shot Lecture" : "Topic Video"}
                        </div>
                    </div>

                    <div
                        onClick={() => setActiveTab("revise")}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            background:
                                activeTab === "revise" ? "rgba(0, 212, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                            border: `1px solid ${activeTab === "revise" ? ACCENT_BORDER : "var(--bg-border)"}`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#3ECF8E", marginBottom: 2 }}>
                            2. REVISE
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                            Key Concepts & Formulas
                        </div>
                    </div>

                    <div
                        onClick={() => setActiveTab("practice")}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 10,
                            background:
                                activeTab === "practice" ? "rgba(0, 212, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                            border: `1px solid ${activeTab === "practice" ? ACCENT_BORDER : "var(--bg-border)"}`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#F5A623", marginBottom: 2 }}>
                            3. PRACTICE
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                            {chapter?.practice?.length || 5} Questions & Answers
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 2. Active Tab Content Deck ── */}
            {activeTab === "flow" && (
                <div
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 14,
                        padding: "18px 20px",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            marginBottom: 10,
                        }}
                    >
                        Step 1: Watch Concept Lecture
                    </div>
                    {videoUrl ? (
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                background: "rgba(255, 60, 60, 0.08)",
                                border: "1px solid rgba(255, 60, 60, 0.2)",
                                borderRadius: 12,
                                padding: "14px 18px",
                                textDecoration: "none",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 60, 60, 0.14)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 60, 60, 0.08)")}
                        >
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 10,
                                    background: "#FF4444",
                                    color: "#FFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 18,
                                    flexShrink: 0,
                                }}
                            >
                                ▶
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "#FF6B6B" }}>
                                    {chapter?.watch?.title || content?.watchQuery || "Watch ICSE One-Shot Lecture"}
                                </div>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                                    Curated high-yield video lecture for ICSE Class 10
                                </div>
                            </div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#FF6B6B", fontWeight: 600 }}>
                                Watch ↗
                            </div>
                        </a>
                    ) : (
                        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                            No lecture link configured. Continue to Revise and Practice below.
                        </div>
                    )}
                </div>
            )}

            {activeTab === "revise" && (
                <div
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 14,
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#3ECF8E",
                            marginBottom: 12,
                        }}
                    >
                        Step 2: Key Concepts & High-Yield Bullets
                    </div>

                    {chapter?.revise?.bullets && chapter.revise.bullets.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {chapter.revise.bullets.map((b, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        background: "var(--bg-elevated)",
                                        border: "1px solid var(--bg-border)",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: "#3ECF8E",
                                            marginTop: 6,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                        {b}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : content?.keyPoints?.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {content.keyPoints.map((pt: string, i: number) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                    <div
                                        style={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: "50%",
                                            background: "#3ECF8E",
                                            marginTop: 7,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                                        {pt}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            )}

            {activeTab === "practice" && (
                <div
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 14,
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#F5A623",
                            marginBottom: 12,
                        }}
                    >
                        Step 3: Chapter Practice Questions
                    </div>

                    {chapter?.practice && chapter.practice.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {chapter.practice.map((q, i) => {
                                const isRevealed = revealedAnswers[i] || false;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            background: "var(--bg-elevated)",
                                            border: "1px solid var(--bg-border)",
                                            borderRadius: 12,
                                            padding: "14px 16px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "var(--text-primary)",
                                                marginBottom: 8,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            Q{i + 1}. {q.question}
                                        </div>
                                        {isRevealed ? (
                                            <div
                                                style={{
                                                    marginTop: 8,
                                                    padding: "10px 14px",
                                                    background: "rgba(62, 207, 142, 0.08)",
                                                    border: "1px solid rgba(62, 207, 142, 0.25)",
                                                    borderRadius: 8,
                                                    fontSize: 13,
                                                    color: "#3ECF8E",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                <strong>Answer: </strong>
                                                {q.answer}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setRevealedAnswers((p) => ({ ...p, [i]: true }))}
                                                style={{
                                                    background: "transparent",
                                                    border: "1px dashed var(--accent-gold-border)",
                                                    borderRadius: 8,
                                                    padding: "6px 14px",
                                                    fontSize: 12,
                                                    color: ACCENT,
                                                    cursor: "pointer",
                                                    marginTop: 4,
                                                }}
                                            >
                                                Reveal Model Answer →
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                            Practice questions are in the Study Flow module. Click above to view.
                        </div>
                    )}
                </div>
            )}

            {/* ── 3. Interactive Revision Checklist with Big Ticks ── */}
            <div
                style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 16,
                    padding: "22px 24px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "var(--text-muted)",
                                marginBottom: 4,
                            }}
                        >
                            Daily Revision Checklist
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)" }}>
                            Tick items as you finish your revision today:
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 12,
                                fontWeight: 700,
                                color: allDone ? "#3ECF8E" : ACCENT,
                                background: allDone ? "rgba(62, 207, 142, 0.12)" : ACCENT_DIM,
                                border: `1px solid ${allDone ? "rgba(62, 207, 142, 0.3)" : ACCENT_BORDER}`,
                                padding: "4px 10px",
                                borderRadius: 100,
                            }}
                        >
                            {doneCount} / {items.length} Done ({progressPct}%)
                        </span>
                        {doneCount < items.length && (
                            <button
                                onClick={handleTickAll}
                                style={{
                                    background: "transparent",
                                    border: "1px solid var(--bg-border)",
                                    borderRadius: 8,
                                    padding: "4px 10px",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                            >
                                Tick All ✓
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    style={{
                        width: "100%",
                        height: 6,
                        background: "var(--bg-elevated)",
                        borderRadius: 99,
                        overflow: "hidden",
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            width: `${progressPct}%`,
                            height: "100%",
                            background: allDone
                                ? "linear-gradient(90deg, #3ECF8E, #10B981)"
                                : `linear-gradient(90deg, ${ACCENT}, #5B8AF5)`,
                            borderRadius: 99,
                            transition: "width 0.3s ease",
                        }}
                    />
                </div>

                {/* Checklist Cards with BIG visible TICK checkboxes */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map((item, i) => {
                        const isChecked = checked[i] ?? false;
                        return (
                            <div
                                key={i}
                                onClick={() => toggleCheck(i)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    cursor: "pointer",
                                    padding: "13px 16px",
                                    borderRadius: 12,
                                    background: isChecked
                                        ? "rgba(62, 207, 142, 0.08)"
                                        : "var(--bg-elevated)",
                                    border: `1.5px solid ${
                                        isChecked ? "rgba(62, 207, 142, 0.4)" : "var(--bg-border)"
                                    }`,
                                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isChecked) {
                                        e.currentTarget.style.borderColor = "var(--accent-gold-border)";
                                        e.currentTarget.style.background = "rgba(0, 212, 255, 0.03)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isChecked) {
                                        e.currentTarget.style.borderColor = "var(--bg-border)";
                                        e.currentTarget.style.background = "var(--bg-elevated)";
                                    }
                                }}
                            >
                                {/* BIG tactile tick box */}
                                <div
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 7,
                                        border: `2px solid ${
                                            isChecked ? "#3ECF8E" : "var(--text-muted)"
                                        }`,
                                        background: isChecked ? "#3ECF8E" : "transparent",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.18s ease",
                                        boxShadow: isChecked
                                            ? "0 0 10px rgba(62, 207, 142, 0.35)"
                                            : "none",
                                    }}
                                >
                                    {isChecked && (
                                        <span
                                            style={{
                                                color: "#0A0A0F",
                                                fontSize: 14,
                                                fontWeight: 900,
                                                lineHeight: 1,
                                            }}
                                        >
                                            ✓
                                        </span>
                                    )}
                                </div>

                                <div
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 14,
                                        color: isChecked ? "var(--text-muted)" : "var(--text-primary)",
                                        textDecoration: isChecked ? "line-through" : "none",
                                        lineHeight: 1.5,
                                        opacity: isChecked ? 0.6 : 1,
                                        transition: "all 0.2s",
                                        flex: 1,
                                    }}
                                >
                                    {item}
                                </div>

                                <span
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: isChecked ? "#3ECF8E" : "var(--text-muted)",
                                        opacity: isChecked ? 0.9 : 0.4,
                                    }}
                                >
                                    {isChecked ? "Done" : "Tap to tick"}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Practice Tip */}
                {content?.practiceHint && (
                    <div
                        style={{
                            background: ACCENT_DIM,
                            border: `1px solid ${ACCENT_BORDER}`,
                            borderRadius: 12,
                            padding: "13px 17px",
                            marginTop: 18,
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: ACCENT,
                                marginBottom: 4,
                            }}
                        >
                            Pro Tip for this topic
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                            {content.practiceHint}
                        </div>
                    </div>
                )}

                {/* ── Prominent Complete Button ── */}
                <div style={{ marginTop: 22 }}>
                    <button
                        onClick={() => {
                            if (doneCount === 0) {
                                handleTickAll();
                            }
                            onComplete();
                        }}
                        disabled={submitting}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: 14,
                            background: allDone
                                ? "#3ECF8E"
                                : doneCount > 0
                                ? ACCENT
                                : "linear-gradient(135deg, var(--accent-gold), #5B8AF5)",
                            border: "none",
                            color: "#0A0A0F",
                            fontFamily: "var(--font-body)",
                            fontSize: 15,
                            fontWeight: 800,
                            letterSpacing: "0.02em",
                            cursor: submitting ? "wait" : "pointer",
                            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                            boxShadow: "0 4px 20px rgba(0, 212, 255, 0.25)",
                        }}
                        onMouseEnter={(e) => {
                            if (!submitting) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 212, 255, 0.4)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 212, 255, 0.25)";
                        }}
                    >
                        {submitting
                            ? "Saving progress..."
                            : allDone
                            ? "Mark Study Complete ✓ (Advance to Next Task)"
                            : doneCount > 0
                            ? `Mark Study Complete with ${doneCount}/${items.length} items ✓`
                            : "Mark Day Complete & Move to Next Task →"}
                    </button>
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginTop: 8,
                        }}
                    >
                        Ticking items records your daily streak and updates your Pre-Board 90 progress.
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Practice task renderer ────────────────────────────────────────────────────
function PracticeTaskView({
    task,
    content,
    onComplete,
    submitting,
}: {
    task: any;
    content: any;
    onComplete: (perf?: any) => void;
    submitting: boolean;
}) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const questions: any[] = content?.questions ?? [];
    const totalMarks: number = content?.totalMarks ?? 0;
    const answeredCount = questions.filter((q) => (answers[q.id] ?? "") !== "").length;

    const score = submitted
        ? questions.reduce(
              (acc, q) => (q.type === "MCQ" && answers[q.id] === q.answer ? acc + (q.marks ?? 1) : acc),
              0
          )
        : 0;
    const weakTopicsIdentified = submitted
        ? questions
              .filter((q) => q.type === "MCQ" && answers[q.id] !== q.answer)
              .map((q) => q.text?.slice(0, 40) ?? "")
        : [];
    const pct = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    return (
        <div>
            {content?.instructions && (
                <div
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--text-muted)",
                        marginBottom: 18,
                        lineHeight: 1.55,
                    }}
                >
                    {content.instructions}
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                {questions.map((q: any, i: number) => {
                    const isCorrect = submitted && q.type === "MCQ" && answers[q.id] === q.answer;
                    const isWrong =
                        submitted && q.type === "MCQ" && answers[q.id] !== undefined && answers[q.id] !== q.answer;
                    return (
                        <div
                            key={q.id}
                            style={{
                                background: "var(--bg-surface)",
                                border: `1px solid ${
                                    submitted
                                        ? isCorrect
                                            ? "rgba(62,207,142,0.28)"
                                            : isWrong
                                            ? "rgba(229,83,75,0.28)"
                                            : "var(--bg-border)"
                                        : "var(--bg-border)"
                                }`,
                                borderRadius: 14,
                                padding: "16px 18px",
                                transition: "border-color 0.3s",
                            }}
                        >
                            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                                <div
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: PHASE_COLORS[1],
                                        background: PHASE_BG[1],
                                        border: `1px solid rgba(245,166,35,0.2)`,
                                        borderRadius: 100,
                                        padding: "3px 9px",
                                    }}
                                >
                                    {q.marks}M · {q.difficulty}
                                </div>
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: 15,
                                    color: "var(--text-primary)",
                                    marginBottom: 12,
                                    lineHeight: 1.55,
                                    fontWeight: 500,
                                }}
                            >
                                Q{i + 1}. {q.text}
                            </div>
                            {q.type === "MCQ" && q.options?.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    {(q.options as string[]).map((opt, oi) => {
                                        const isSel = answers[q.id] === opt;
                                        const showOk = submitted && opt === q.answer;
                                        const showBad = submitted && isSel && opt !== q.answer;
                                        return (
                                            <button
                                                key={oi}
                                                onClick={() => !submitted && setAnswers((p) => ({ ...p, [q.id]: opt }))}
                                                disabled={submitted}
                                                style={{
                                                    padding: "9px 13px",
                                                    textAlign: "left",
                                                    borderRadius: 8,
                                                    border: showOk
                                                        ? "1px solid #3ECF8E"
                                                        : showBad
                                                        ? "1px solid #E5534B"
                                                        : isSel
                                                        ? `1px solid ${PHASE_COLORS[1]}`
                                                        : "1px solid var(--bg-border)",
                                                    background: showOk
                                                        ? "rgba(62,207,142,0.08)"
                                                        : showBad
                                                        ? "rgba(229,83,75,0.08)"
                                                        : isSel
                                                        ? PHASE_BG[1]
                                                        : "transparent",
                                                    color: showOk
                                                        ? "#3ECF8E"
                                                        : showBad
                                                        ? "#E5534B"
                                                        : isSel
                                                        ? PHASE_COLORS[1]
                                                        : "var(--text-secondary)",
                                                    fontFamily: "var(--font-body)",
                                                    fontSize: 14,
                                                    cursor: submitted ? "default" : "pointer",
                                                    transition: "all 0.14s",
                                                }}
                                            >
                                                {String.fromCharCode(65 + oi)}. {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <textarea
                                    placeholder="Your answer..."
                                    value={answers[q.id] ?? ""}
                                    onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                    disabled={submitted}
                                    style={{
                                        width: "100%",
                                        minHeight: 72,
                                        padding: "10px 13px",
                                        background: "var(--bg-elevated)",
                                        border: "1px solid var(--bg-border)",
                                        borderRadius: 8,
                                        color: "var(--text-primary)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: 14,
                                        resize: "vertical",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            )}
                            {submitted && (
                                <div
                                    style={{
                                        marginTop: 9,
                                        padding: "7px 11px",
                                        background: "rgba(62,207,142,0.06)",
                                        borderRadius: 8,
                                        fontFamily: "var(--font-body)",
                                        fontSize: 12,
                                        color: "#3ECF8E",
                                    }}
                                >
                                    Answer: {q.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!submitted ? (
                <button
                    onClick={() => setSubmitted(true)}
                    disabled={answeredCount === 0}
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: 12,
                        background: answeredCount > 0 ? PHASE_COLORS[1] : "rgba(245,166,35,0.12)",
                        border: "none",
                        color: answeredCount > 0 ? "#0A0A0F" : "rgba(245,166,35,0.35)",
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: answeredCount > 0 ? "pointer" : "not-allowed",
                        transition: "all 0.2s",
                    }}
                >
                    {answeredCount > 0 ? `Submit Answers (${answeredCount}/${questions.length})` : "Answer at least 1 question first"}
                </button>
            ) : (
                <div>
                    <div
                        style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--bg-border)",
                            borderRadius: 14,
                            padding: "20px",
                            marginBottom: 14,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 34,
                                color: pct >= 70 ? "#3ECF8E" : "#F5A623",
                                letterSpacing: "-0.03em",
                                marginBottom: 3,
                            }}
                        >
                            {score}/{totalMarks}
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                            {pct}% · {pct >= 80 ? "Excellent" : pct >= 50 ? "Good effort" : "Needs review"}
                        </div>
                    </div>
                    <button
                        onClick={() => onComplete({ score, totalMarks, weakTopicsIdentified })}
                        disabled={submitting}
                        style={{
                            width: "100%",
                            padding: "14px",
                            borderRadius: 12,
                            background: ACCENT,
                            border: "none",
                            color: "#0A0A0F",
                            fontFamily: "var(--font-body)",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: submitting ? "wait" : "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        {submitting ? "Saving..." : "Mark Practice Complete →"}
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Test task renderer ────────────────────────────────────────────────────────
function TestTaskView({
    task,
    content,
    onComplete,
    submitting,
}: {
    task: any;
    content: any;
    onComplete: (perf?: any) => void;
    submitting: boolean;
}) {
    const router = useRouter();
    const createTestMutation = trpc.test.createTest.useMutation({
        onSuccess: (data) => router.push(`/dashboard/tests?attemptId=${data.attemptId}`),
    });

    return (
        <div>
            <div
                style={{
                    background: "rgba(229,83,75,0.06)",
                    border: "1px solid rgba(229,83,75,0.18)",
                    borderRadius: 14,
                    padding: "18px 20px",
                    marginBottom: 20,
                }}
            >
                <div
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#E5534B",
                        marginBottom: 10,
                    }}
                >
                    Full Mock Paper
                </div>
                <div
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        color: "var(--text-primary)",
                        marginBottom: 8,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {content?.paperTitle ?? `${task.subject} Mock Paper`}
                </div>
                <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                            {content?.totalMarks ?? 80}
                        </span>{" "}
                        marks
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                            {content?.duration ?? 120}
                        </span>{" "}
                        min
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>
                        {task.subject}
                    </div>
                </div>
            </div>
            {content?.partialMarkingRules && (
                <div
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                        marginBottom: 20,
                        padding: "13px 17px",
                        background: "var(--bg-surface)",
                        borderRadius: 10,
                        border: "1px solid var(--bg-border)",
                    }}
                >
                    <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Marking: </span>
                    {content.partialMarkingRules}
                </div>
            )}
            <div
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                    marginBottom: 26,
                }}
            >
                Board-pattern paper evaluated by GPT-4o-mini with partial marking. Results link to your Pre-Board 90
                progress and update your weak-topic profile.
            </div>
            <button
                onClick={() =>
                    createTestMutation.mutate({
                        subject: task.subject,
                        chapters: [task.topicRef],
                        totalQuestions: 20,
                        duration: content?.duration ?? 120,
                    })
                }
                disabled={createTestMutation.isPending || submitting}
                style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: 12,
                    background: createTestMutation.isPending ? "rgba(229,83,75,0.4)" : "#E5534B",
                    border: "none",
                    color: "#FFF",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: createTestMutation.isPending ? "wait" : "pointer",
                    transition: "all 0.2s",
                    letterSpacing: "0.02em",
                }}
            >
                {createTestMutation.isPending ? "Generating paper..." : "Start Mock Paper →"}
            </button>
        </div>
    );
}

// ── "More for today" contextual widget ─────────────────────────────────────────
function MoreForToday({
    task,
    taskType,
    phase,
}: {
    task: any;
    taskType: "STUDY" | "PRACTICE" | "TEST";
    phase: number;
}) {
    const router = useRouter();
    if (phase === 3 && taskType === "TEST") return null;

    const studyFlowMatch = matchStudyFlowChapter(task.subject, task.topicRef);

    const tools = [
        {
            icon: "▶",
            label: "Study Flow Module",
            desc: `Watch → Revise → Practice for ${studyFlowMatch.chapter?.title || task.subject}`,
            href: studyFlowMatch.directUrl,
        },
        {
            icon: "◈",
            label: "AI Doubt Solver",
            desc: `Ask doubts about ${task.topicRef}`,
            href: `/dashboard/ai-assistant?topic=${encodeURIComponent(task.topicRef)}`,
        },
        {
            icon: "◎",
            label: "Focus Mode",
            desc: `Timed study session for ${task.subject}`,
            href: "/dashboard/focus",
        },
        {
            icon: "◉",
            label: "Competency PYQ Test",
            desc: "Board questions practice",
            href: "/dashboard/precision-practice",
        },
    ];

    return (
        <div style={{ marginTop: 36 }}>
            <div style={{ height: 1, background: "var(--bg-border)", marginBottom: 24 }} />
            <div
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: 14,
                    opacity: 0.55,
                }}
            >
                Also available for this topic today
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tools.map((tool) => (
                    <div
                        key={tool.href}
                        onClick={() => router.push(tool.href)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "13px 16px",
                            background: "var(--bg-surface)",
                            border: "1px solid var(--bg-border)",
                            borderRadius: 12,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--accent-gold-border)";
                            e.currentTarget.style.background = "var(--bg-elevated)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--bg-border)";
                            e.currentTarget.style.background = "var(--bg-surface)";
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 18,
                                color: ACCENT,
                                opacity: 0.7,
                                flexShrink: 0,
                                width: 24,
                            }}
                        >
                            {tool.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                    marginBottom: 2,
                                }}
                            >
                                {tool.label}
                            </div>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>
                                {tool.desc}
                            </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", opacity: 0.5 }}>
                            →
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main task page ────────────────────────────────────────────────────────────
export default function PreBoard90TaskPage() {
    const router = useRouter();
    const { data: todayData, refetch } = trpc.preBoard90.getTodayTask.useQuery();

    const submitMutation = trpc.preBoard90.submitTask.useMutation({
        onSuccess: () => {
            refetch();
            router.push("/dashboard/pre-board-90");
        },
    });

    if (!todayData) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-base)",
                }}
            >
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "2px solid var(--bg-border)",
                        borderTopColor: ACCENT,
                        animation: "spin360 0.7s linear infinite",
                    }}
                />
            </div>
        );
    }

    const { task, plan } = todayData;

    if (!task || !plan) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "var(--bg-base)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)" }}>
                    All done for today 🎉
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>
                    Next task unlocks tomorrow morning.
                </div>
                <button
                    onClick={() => router.push("/dashboard/pre-board-90")}
                    style={{
                        background: ACCENT,
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 24px",
                        color: "#0A0A0F",
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        marginTop: 8,
                    }}
                >
                    Back to Programme
                </button>
            </div>
        );
    }

    const phase = task.phase as number;
    const phaseColor = PHASE_COLORS[phase - 1];
    const phaseBg = PHASE_BG[phase - 1];
    const content = task.contentJson as any;
    const taskType = task.taskType as "STUDY" | "PRACTICE" | "TEST";

    const handleComplete = (performance?: any) => {
        submitMutation.mutate({ taskId: task.id, planId: plan.id, performance });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--bg-base)",
                padding: "32px 24px 80px",
                maxWidth: 720,
                margin: "0 auto",
            }}
        >
            {/* Back & Full Plan */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <button
                    onClick={() => router.push("/dashboard/pre-board-90")}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: 13,
                        fontFamily: "var(--font-body)",
                        padding: 0,
                    }}
                >
                    ← Pre-Board 90
                </button>
                <button
                    onClick={() => router.push("/dashboard/pre-board-90/plan")}
                    style={{
                        background: "transparent",
                        border: `1px solid ${ACCENT_BORDER}`,
                        borderRadius: 100,
                        padding: "4px 14px",
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: ACCENT,
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = ACCENT_DIM)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                    View Full Plan ↗
                </button>
            </div>

            {/* Task header */}
            <div style={{ marginBottom: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: phaseColor,
                            background: phaseBg,
                            border: `1px solid ${phaseColor}35`,
                            borderRadius: 100,
                            padding: "4px 12px",
                        }}
                    >
                        Day {task.day} · Phase {phase} · {taskType}
                    </div>
                    {task.status === "MISSED" && (
                        <div
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 9,
                                fontWeight: 700,
                                color: "#E5534B",
                                background: "rgba(229,83,75,0.1)",
                                border: "1px solid rgba(229,83,75,0.25)",
                                borderRadius: 100,
                                padding: "4px 10px",
                            }}
                        >
                            CATCH-UP
                        </div>
                    )}
                </div>
                <h1
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 28,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.02em",
                        margin: "0 0 5px",
                        lineHeight: 1.2,
                    }}
                >
                    {task.topicRef}
                </h1>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>
                    {task.subject}
                </div>
            </div>

            {/* Phase accent line */}
            <div
                style={{
                    height: 2,
                    background: `linear-gradient(90deg, ${phaseColor}, transparent)`,
                    borderRadius: 2,
                    marginBottom: 26,
                    opacity: 0.55,
                }}
            />

            {/* Content loading fallback */}
            {!content && (
                <div
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--bg-border)",
                        borderRadius: 14,
                        padding: "28px",
                        textAlign: "center",
                        marginBottom: 20,
                    }}
                >
                    <div style={{ fontSize: 22, marginBottom: 10 }}>⏳</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                        AI is preparing your personalised curriculum. You can still open the Study Flow chapter below.
                    </div>
                </div>
            )}

            {/* Task renderers */}
            {taskType === "STUDY" && (
                <StudyTaskView
                    task={task}
                    content={content}
                    onComplete={handleComplete}
                    submitting={submitMutation.isPending}
                />
            )}
            {taskType === "PRACTICE" && (
                <PracticeTaskView
                    task={task}
                    content={content}
                    onComplete={handleComplete}
                    submitting={submitMutation.isPending}
                />
            )}
            {taskType === "TEST" && (
                <TestTaskView
                    task={task}
                    content={content}
                    onComplete={handleComplete}
                    submitting={submitMutation.isPending}
                />
            )}

            {/* Contextual tools */}
            <MoreForToday task={task} taskType={taskType} phase={phase} />
        </div>
    );
}
