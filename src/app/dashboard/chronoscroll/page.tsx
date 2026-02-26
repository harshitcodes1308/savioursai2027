"use client";

import { useState, useRef, useEffect, UIEvent } from "react";
import { typography } from "@/lib/typography";
import { useIsMobile } from "@/hooks/useIsMobile";

import { CHRONO_DATA } from "@/data/chrono-config";


export default function ChronoScrollPage() {
    const isMobile = useIsMobile();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showRecall, setShowRecall] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [recallFeedback, setRecallFeedback] = useState<"correct" | "wrong" | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    
    const sliderRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const activeData = CHRONO_DATA[activeIndex];

    // Play subtle tick sound (optional/muted by default to avoid annoyance, but implementing the audio object)
    const playTick = () => {
        try {
            const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
            audio.volume = 0.05;
            audio.play().catch(() => {});
        } catch (e) {}
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        // The center of the scroll container
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
        if (recallFeedback === "correct") return; // Already solved
        
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
            background: `radial-gradient(circle at 70% 50%, ${activeData.eraColor} 0%, rgba(10,10,15,1) 60%)`,
            backgroundColor: "#0A0A0F",
            transition: "background 0.8s ease",
            overflow: "hidden",
            color: "#FFF"
        }}>
            {/* Global animations for this page */}
            <style dangerouslySetInnerHTML={{ __html: `
                .chrono-slider::-webkit-scrollbar { display: none; }
                .chrono-slider { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: ${isMobile ? "x" : "y"} mandatory; }
                .chrono-item { scroll-snap-align: center; }
                
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .content-transition {
                    animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-6px); }
                    50% { transform: translateX(6px); }
                    75% { transform: translateX(-6px); }
                }
                .shake-anim { animation: shake 0.4s ease-in-out; }
            `}} />

            {/* Header */}
            <div style={{
                padding: "24px 32px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                zIndex: 10
            }}>
                <h1 style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: -0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <span style={{ color: "#FFF" }}>ChronoScroll</span>
                    <span style={{ fontSize: "16px", color: "#6B7280", fontWeight: 500 }}>by Clarify Knowledge</span>
                </h1>
                <p style={{
                    fontSize: "12px",
                    color: "#0EA5E9",
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginTop: "6px"
                }}>
                    Scroll. Snap. Remember.
                </p>
            </div>

            {/* Main Layout */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                overflow: "hidden"
            }}>
                {/* TIMELINE (Left side / Top on mobile) */}
                <div 
                    ref={sliderRef}
                    onScroll={handleScroll}
                    className="chrono-slider"
                    style={{
                        width: isMobile ? "100%" : "30%",
                        height: isMobile ? "120px" : "100%",
                        borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.05)",
                        borderBottom: isMobile ? "1px solid rgba(255,255,255,0.05)" : "none",
                        overflowY: isMobile ? "hidden" : "auto",
                        overflowX: isMobile ? "auto" : "hidden",
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        alignItems: "center",
                        padding: isMobile ? "0 50vw" : "40vh 0", // Padding to allow first/last items to center
                        position: "relative",
                        zIndex: 5
                    }}
                >
                    {CHRONO_DATA.map((item, index) => {
                        const isActive = index === activeIndex;
                        const dist = Math.abs(index - activeIndex);
                        
                        // Status dot color
                        const getDotColor = (status: string) => {
                            if (status === "mastered") return "#10B981";
                            if (status === "viewed") return "#F59E0B";
                            return "#4B5563";
                        };

                        return (
                            <div
                                key={item.id}
                                ref={(el) => { itemRefs.current[index] = el; }}
                                className="chrono-item"
                                onClick={() => scrollToDate(index)}
                                style={{
                                    padding: isMobile ? "0 24px" : "24px 0",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    opacity: isActive ? 1 : Math.max(0.2, 1 - dist * 0.3),
                                    transform: isActive ? "scale(1)" : `scale(${Math.max(0.6, 1 - dist * 0.15)})`,
                                    filter: isActive ? "none" : `blur(${dist}px)`,
                                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                {!isMobile && (
                                    <div style={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        backgroundColor: getDotColor(item.status),
                                        boxShadow: isActive ? `0 0 10px ${getDotColor(item.status)}` : "none",
                                        transition: "all 0.4s ease"
                                    }} />
                                )}
                                <div style={{
                                    fontSize: isActive ? "42px" : "28px",
                                    fontWeight: 800,
                                    color: isActive ? "#0EA5E9" : "#FFF",
                                    textShadow: isActive ? "0 0 24px rgba(14, 165, 233, 0.6)" : "none",
                                    letterSpacing: isActive ? 2 : 0,
                                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                                }}>
                                    {item.year}
                                </div>
                                {isMobile && (
                                    <div style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        backgroundColor: getDotColor(item.status),
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* DYNAMIC CONTENT BOX (Right side / Bottom on mobile) */}
                <div style={{
                    width: isMobile ? "100%" : "70%",
                    height: isMobile ? "calc(100% - 120px)" : "100%",
                    padding: isMobile ? "24px" : "48px",
                    overflowY: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 5
                }}>
                    <div 
                        key={activeData.id} // Forces re-render and animation inside this div
                        className="content-transition"
                        style={{
                            width: "100%",
                            maxWidth: "700px",
                            background: "rgba(20, 20, 25, 0.6)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "24px",
                            padding: isMobile ? "24px" : "40px",
                            boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >
                        {/* Huge background year water mark */}
                        <div style={{
                            position: "absolute",
                            top: -20,
                            right: -20,
                            fontSize: "180px",
                            fontWeight: 900,
                            color: "rgba(255,255,255,0.02)",
                            lineHeight: 1,
                            pointerEvents: "none",
                            userSelect: "none"
                        }}>
                            {activeData.year}
                        </div>

                        {/* Event Content Container - Blurs when Recall is active */}
                        <div style={{ 
                            position: "relative", 
                            zIndex: 10,
                            filter: showRecall ? "blur(8px)" : "none",
                            transition: "filter 0.4s ease",
                            pointerEvents: showRecall ? "none" : "auto"
                        }}>
                            <div style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#0EA5E9",
                                letterSpacing: 2,
                                textTransform: "uppercase",
                                marginBottom: "12px"
                            }}>
                                Event of {activeData.year}
                            </div>
                            <h2 style={{
                                fontSize: isMobile ? "28px" : "40px",
                                fontWeight: 800,
                                color: "#FFF",
                                marginBottom: "24px",
                                lineHeight: 1.2,
                                textShadow: "0 4px 12px rgba(0,0,0,0.5)"
                            }}>
                                {activeData.title}
                            </h2>

                            <div style={{
                                background: "rgba(0,0,0,0.3)",
                                padding: "20px 24px",
                                borderRadius: "16px",
                                marginBottom: "24px",
                                border: "1px solid rgba(255,255,255,0.03)"
                            }}>
                                <ul style={{ 
                                    margin: 0, 
                                    paddingLeft: "20px", 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    gap: "12px" 
                                }}>
                                    {activeData.bullets.map((bullet, idx) => (
                                        <li key={idx} style={{ 
                                            color: "#E5E7EB", 
                                            fontSize: "15px", 
                                            lineHeight: 1.5 
                                        }}>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ marginBottom: "32px" }}>
                                <h3 style={{ 
                                    fontSize: "16px", 
                                    color: "#A78BFA", 
                                    fontWeight: 700, 
                                    marginBottom: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                }}>
                                    <span style={{ fontSize: 18 }}>💡</span> Why This Matters
                                </h3>
                                <p style={{ 
                                    color: "#9CA3AF", 
                                    fontSize: "15px", 
                                    lineHeight: 1.6 
                                }}>
                                    {activeData.importance}
                                </p>
                            </div>
                        </div>

                        {/* Micro Recall Section - Elevated z-index so it doesn't blur */}
                        <div style={{
                            position: showRecall ? "absolute" : "relative",
                            inset: showRecall ? "0" : "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 20,
                            padding: showRecall ? "24px" : "0",
                            background: showRecall ? "rgba(10,10,15,0.75)" : "transparent",
                            backdropFilter: showRecall ? "blur(16px)" : "none",
                            borderRadius: showRecall ? "24px" : "0",
                            pointerEvents: "auto"
                        }}>
                            {!showRecall ? (
                                <button
                                    onClick={() => setShowRecall(true)}
                                    style={{
                                        background: "linear-gradient(135deg, #0EA5E9, #3B82F6)",
                                        color: "#FFF",
                                        border: "none",
                                        borderRadius: "12px",
                                        padding: "14px 24px",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        boxShadow: "0 8px 16px rgba(14, 165, 233, 0.3)",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 12px 20px rgba(14, 165, 233, 0.4)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(14, 165, 233, 0.3)";
                                    }}
                                >
                                    <span>🧠</span> Quick Recall
                                </button>
                            ) : (
                                <div className={isShaking ? "shake-anim" : ""} style={{
                                    background: "rgba(20,20,25,0.8)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "16px",
                                    padding: "24px",
                                    width: "100%",
                                    maxWidth: "500px",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                                }}>
                                    <div style={{ 
                                        fontSize: "13px", 
                                        color: "#0EA5E9", 
                                        fontWeight: 700, 
                                        marginBottom: "8px",
                                        textTransform: "uppercase",
                                        letterSpacing: 1
                                    }}>
                                        Recall Check
                                    </div>
                                    <h4 style={{ 
                                        fontSize: "16px", 
                                        color: "#FFF", 
                                        fontWeight: 600, 
                                        marginBottom: "20px",
                                        lineHeight: 1.4
                                    }}>
                                        {activeData.recall_question.question}
                                    </h4>
                                    
                                    <div style={{ display: "grid", gap: "10px" }}>
                                        {activeData.recall_question.options.map((opt, idx) => {
                                            const isSelected = selectedOption === idx;
                                            const isCorrect = idx === activeData.recall_question.correct_index;
                                            
                                            // Determine styling based on state
                                            let bg = "rgba(255,255,255,0.05)";
                                            let border = "1px solid rgba(255,255,255,0.1)";
                                            let color = "#D1D5DB";
                                            let icon = "";
                                            
                                            if (recallFeedback === "correct") {
                                                if (isCorrect) {
                                                    bg = "rgba(16,185,129,0.15)";
                                                    border = "1px solid #10B981";
                                                    color = "#10B981";
                                                    icon = "✅";
                                                }
                                            } else if (recallFeedback === "wrong" && isSelected) {
                                                bg = "rgba(239,68,68,0.15)";
                                                border = "1px solid #EF4444";
                                                color = "#EF4444";
                                                icon = "❌";
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionSelect(idx)}
                                                    style={{
                                                        background: bg,
                                                        border: border,
                                                        color: color,
                                                        padding: "12px 16px",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        textAlign: "left",
                                                        cursor: recallFeedback === "correct" ? "default" : "pointer",
                                                        transition: "all 0.2s",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (!recallFeedback) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!recallFeedback) e.currentTarget.style.background = bg;
                                                    }}
                                                >
                                                    {opt} {icon && <span>{icon}</span>}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    
                                    {recallFeedback === "correct" && (
                                        <div style={{
                                            marginTop: "24px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "16px",
                                            animation: "slideUpFade 0.3s ease forwards"
                                        }}>
                                            <div style={{ 
                                                color: "#10B981", 
                                                fontSize: "15px", 
                                                fontWeight: 600,
                                            }}>
                                                Brilliant! That's correct.
                                            </div>
                                            
                                            <button
                                                onClick={() => {
                                                    setShowRecall(false);
                                                    setRecallFeedback(null);
                                                    setSelectedOption(null);
                                                }}
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    color: "#A78BFA",
                                                    padding: "10px 20px",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    transition: "all 0.2s"
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background = "rgba(167, 139, 250, 0.1)";
                                                    e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.3)";
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                                                }}
                                            >
                                                <span>←</span> Read Event Again
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
