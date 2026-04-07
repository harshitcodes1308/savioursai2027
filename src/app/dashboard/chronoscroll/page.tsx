"use client";

import { useState, useRef, useEffect, UIEvent } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { CHRONO_DATA } from "@/data/chrono-config";

export default function ChronoScrollPage() {
    const { isMobile } = useResponsive();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showRecall, setShowRecall] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [recallFeedback, setRecallFeedback] = useState<"correct" | "wrong" | null>(null);
    const [isShaking, setIsShaking] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const activeData = CHRONO_DATA[activeIndex];

    const playTick = () => {
        try {
            const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
            audio.volume = 0.05;
            audio.play().catch(() => {});
        } catch {}
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const centerPos = isMobile
            ? container.scrollLeft + container.clientWidth / 2
            : container.scrollTop + container.clientHeight / 2;

        let closestIdx = 0;
        let minDiff = Infinity;

        itemRefs.current.forEach((el, idx) => {
            if (!el) return;
            const elCenter = isMobile
                ? el.offsetLeft + el.clientWidth / 2
                : el.offsetTop + el.clientHeight / 2;
            const diff = Math.abs(elCenter - centerPos);

            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
            }
        });

        if (closestIdx !== activeIndex) {
            setActiveIndex(closestIdx);
            setShowRecall(false);
            setSelectedOption(null);
            setRecallFeedback(null);
            playTick();
        }
    };

    const scrollToDate = (index: number) => {
        const el = itemRefs.current[index];
        const container = sliderRef.current;
        if (el && container) {
            if (isMobile) {
                container.scrollTo({
                    left: el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2,
                    behavior: "smooth"
                });
            } else {
                container.scrollTo({
                    top: el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2,
                    behavior: "smooth"
                });
            }
        }
    };

    useEffect(() => {
        setTimeout(() => scrollToDate(0), 100);
    }, [isMobile]);

    const handleOptionSelect = (idx: number) => {
        if (recallFeedback === "correct") return;

        setSelectedOption(idx);
        if (idx === activeData.recall_question.correct_index) {
            setRecallFeedback("correct");
        } else {
            setRecallFeedback("wrong");
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
                setRecallFeedback(null);
                setSelectedOption(null);
            }, 600);
        }
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-base)",
            overflow: "hidden",
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .chrono-slider::-webkit-scrollbar { display: none; }
                .chrono-slider { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: ${isMobile ? "x" : "y"} mandatory; }
                .chrono-item { scroll-snap-align: center; }

                @keyframes chrono-slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .chrono-content-enter {
                    animation: chrono-slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes chrono-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-6px); }
                    50% { transform: translateX(6px); }
                    75% { transform: translateX(-6px); }
                }
                .chrono-shake { animation: chrono-shake 0.4s ease-in-out; }
            `}} />

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
                    gap: 12,
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
                            ChronoScroll
                        </h1>
                        <p style={{
                            fontFamily: "var(--font-tagline)",
                            fontSize: 13,
                            fontWeight: 400,
                            fontStyle: "italic",
                            color: "var(--text-muted)",
                            margin: 0,
                        }}>
                            Scroll. Snap. Remember.
                        </p>
                    </div>
                    <div style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontWeight: 500,
                    }}>
                        {activeIndex + 1} / {CHRONO_DATA.length} events
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 14 }}>
                    <div style={{
                        height: 3,
                        background: "var(--bg-border)",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}>
                        <div style={{
                            width: `${((activeIndex + 1) / CHRONO_DATA.length) * 100}%`,
                            height: "100%",
                            background: "var(--accent-gold)",
                            transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                        }} />
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                overflow: "hidden",
            }}>
                {/* Timeline */}
                <div
                    ref={sliderRef}
                    onScroll={handleScroll}
                    className="chrono-slider"
                    style={{
                        width: isMobile ? "100%" : "28%",
                        height: isMobile ? "110px" : "100%",
                        borderRight: isMobile ? "none" : "1px solid var(--bg-border)",
                        borderBottom: isMobile ? "1px solid var(--bg-border)" : "none",
                        overflowY: isMobile ? "hidden" : "auto",
                        overflowX: isMobile ? "auto" : "hidden",
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        alignItems: "center",
                        padding: isMobile ? "0 50vw" : "40vh 0",
                        background: "var(--bg-surface)",
                    }}
                >
                    {CHRONO_DATA.map((item, index) => {
                        const isActive = index === activeIndex;
                        const dist = Math.abs(index - activeIndex);

                        return (
                            <div
                                key={item.id}
                                ref={(el) => { itemRefs.current[index] = el; }}
                                className="chrono-item"
                                onClick={() => scrollToDate(index)}
                                style={{
                                    padding: isMobile ? "0 20px" : "20px 0",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    opacity: isActive ? 1 : Math.max(0.25, 1 - dist * 0.3),
                                    transform: isActive ? "scale(1)" : `scale(${Math.max(0.65, 1 - dist * 0.12)})`,
                                    filter: isActive ? "none" : `blur(${Math.min(dist, 3)}px)`,
                                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                {!isMobile && (
                                    <div style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        background: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                                        boxShadow: isActive ? "0 0 8px var(--accent-gold)" : "none",
                                        transition: "all 0.4s ease",
                                        flexShrink: 0,
                                    }} />
                                )}
                                <div style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: isActive ? (isMobile ? 28 : 36) : (isMobile ? 18 : 24),
                                    fontWeight: 700,
                                    color: isActive ? "var(--accent-gold)" : "var(--text-secondary)",
                                    letterSpacing: isActive ? "0.02em" : "-0.01em",
                                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                                    whiteSpace: "nowrap",
                                }}>
                                    {item.year}
                                </div>
                                {isMobile && (
                                    <div style={{
                                        width: 5, height: 5, borderRadius: "50%",
                                        background: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                                        flexShrink: 0,
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Content */}
                <div style={{
                    width: isMobile ? "100%" : "72%",
                    height: isMobile ? "calc(100% - 110px)" : "100%",
                    padding: isMobile ? "20px 16px" : "40px 48px",
                    overflowY: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <div
                        key={activeData.id}
                        className="chrono-content-enter"
                        style={{
                            width: "100%",
                            maxWidth: 720,
                            background: "var(--bg-surface)",
                            border: "1px solid var(--bg-border)",
                            borderRadius: 16,
                            padding: isMobile ? "20px 16px" : "32px 28px",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Background watermark year */}
                        <div style={{
                            position: "absolute",
                            top: -16,
                            right: -12,
                            fontFamily: "var(--font-display)",
                            fontSize: 160,
                            fontWeight: 900,
                            color: "var(--text-primary)",
                            opacity: 0.03,
                            lineHeight: 1,
                            pointerEvents: "none",
                            userSelect: "none",
                        }}>
                            {activeData.year}
                        </div>

                        {/* Event content — blurs when recall is active */}
                        <div style={{
                            position: "relative",
                            zIndex: 10,
                            filter: showRecall ? "blur(8px)" : "none",
                            transition: "filter 0.4s ease",
                            pointerEvents: showRecall ? "none" : "auto",
                        }}>
                            {/* Era label */}
                            <div style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--accent-gold)",
                                marginBottom: 10,
                            }}>
                                Event of {activeData.year}
                            </div>

                            {/* Title */}
                            <h2 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: isMobile ? 24 : 32,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                letterSpacing: "-0.02em",
                                marginBottom: 20,
                                lineHeight: 1.2,
                                margin: "0 0 20px 0",
                            }}>
                                {activeData.title}
                            </h2>

                            {/* Bullets */}
                            <div style={{
                                background: "var(--bg-base)",
                                padding: "16px 18px",
                                borderRadius: 12,
                                marginBottom: 20,
                                border: "1px solid var(--bg-border)",
                            }}>
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: 18,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}>
                                    {activeData.bullets.map((bullet, idx) => (
                                        <li key={idx} style={{
                                            fontFamily: "var(--font-body)",
                                            color: "var(--text-secondary)",
                                            fontSize: 14,
                                            lineHeight: 1.6,
                                        }}>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Why This Matters */}
                            <div style={{
                                marginBottom: 24,
                                padding: "14px 16px",
                                background: "var(--accent-gold-glow)",
                                borderRadius: 10,
                                borderLeft: "3px solid var(--accent-gold)",
                            }}>
                                <div style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "var(--accent-gold)",
                                    marginBottom: 6,
                                }}>
                                    Why This Matters
                                </div>
                                <p style={{
                                    fontFamily: "var(--font-body)",
                                    color: "var(--text-secondary)",
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}>
                                    {activeData.importance}
                                </p>
                            </div>
                        </div>

                        {/* Quick Recall */}
                        <div style={{
                            position: showRecall ? "absolute" : "relative",
                            inset: showRecall ? "0" : "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 20,
                            padding: showRecall ? "24px" : "0",
                            background: showRecall ? "var(--bg-surface-overlay, rgba(0,0,0,0.6))" : "transparent",
                            backdropFilter: showRecall ? "blur(16px)" : "none",
                            borderRadius: showRecall ? "16px" : "0",
                            pointerEvents: "auto",
                        }}>
                            {!showRecall ? (
                                <button
                                    className="btn-gold"
                                    onClick={() => setShowRecall(true)}
                                    style={{
                                        padding: "12px 22px",
                                        fontSize: 14,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    Quick Recall
                                </button>
                            ) : (
                                <div className={isShaking ? "chrono-shake" : ""} style={{
                                    background: "var(--bg-surface)",
                                    border: "1px solid var(--bg-border)",
                                    borderRadius: 14,
                                    padding: isMobile ? "20px 16px" : "24px",
                                    width: "100%",
                                    maxWidth: 480,
                                }}>
                                    <div style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: "var(--accent-gold)",
                                        marginBottom: 8,
                                    }}>
                                        Recall Check
                                    </div>
                                    <h4 style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "var(--text-primary)",
                                        marginBottom: 18,
                                        lineHeight: 1.5,
                                        margin: "0 0 18px 0",
                                    }}>
                                        {activeData.recall_question.question}
                                    </h4>

                                    <div style={{ display: "grid", gap: 8 }}>
                                        {activeData.recall_question.options.map((opt, idx) => {
                                            const isSelected = selectedOption === idx;
                                            const isCorrect = idx === activeData.recall_question.correct_index;

                                            let bg = "var(--bg-base)";
                                            let border = "1px solid var(--bg-border)";
                                            let color = "var(--text-secondary)";

                                            if (recallFeedback === "correct" && isCorrect) {
                                                bg = "rgba(62,207,142,0.08)";
                                                border = "1px solid var(--status-green)";
                                                color = "var(--status-green)";
                                            } else if (recallFeedback === "wrong" && isSelected) {
                                                bg = "rgba(239,68,68,0.08)";
                                                border = "1px solid var(--status-red)";
                                                color = "var(--status-red)";
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionSelect(idx)}
                                                    style={{
                                                        background: bg,
                                                        border,
                                                        color,
                                                        padding: "11px 14px",
                                                        borderRadius: 8,
                                                        fontFamily: "var(--font-body)",
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                        textAlign: "left",
                                                        cursor: recallFeedback === "correct" ? "default" : "pointer",
                                                        transition: "all 0.15s ease",
                                                    }}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {recallFeedback === "correct" && (
                                        <div style={{
                                            marginTop: 20,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 14,
                                            animation: "chrono-slideUp 0.3s ease forwards",
                                        }}>
                                            <div style={{
                                                fontFamily: "var(--font-body)",
                                                color: "var(--status-green)",
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}>
                                                Brilliant! That's correct.
                                            </div>

                                            <button
                                                className="btn-ghost"
                                                onClick={() => {
                                                    setShowRecall(false);
                                                    setRecallFeedback(null);
                                                    setSelectedOption(null);
                                                }}
                                                style={{
                                                    padding: "9px 18px",
                                                    fontSize: 13,
                                                }}
                                            >
                                                Read Event Again
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
