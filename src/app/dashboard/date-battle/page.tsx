"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { CHRONO_DATA } from "@/data/chrono-config";
import { BATTLE_CONFIG, PERFECT_SCORE, calculateScore, getRankObj } from "@/data/battle-config";

type GameState = "idle" | "countdown" | "playing" | "ended";

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateOptions(correctYearStr: string): string[] {
    const match = correctYearStr.match(/\d{4}/);
    if (!match) return shuffleArray([correctYearStr, "1820", "1942", "1757"]);
    const correctYear = parseInt(match[0], 10);
    const options = new Set<number>();
    options.add(correctYear);
    while (options.size < 4) {
        const offset = Math.floor(Math.random() * 100) - 50;
        const fakeYear = correctYear + offset;
        if (fakeYear !== correctYear && fakeYear > 1000 && fakeYear <= new Date().getFullYear()) {
            options.add(fakeYear);
        }
    }
    const optionStrings = Array.from(options).map(y => correctYearStr.replace(/\d{4}/, y.toString()));
    return shuffleArray(optionStrings);
}

function getDetailedTitle(event: typeof CHRONO_DATA[0]): string {
    const firstBullet = event.bullets?.[0];
    if (firstBullet && firstBullet.length > 15) {
        return `${event.title} — ${firstBullet}`;
    }
    return event.title;
}

const INITIAL_LEADERBOARD = [
    { rank: 1, name: "—", score: 0, badge: "◆" },
    { rank: 2, name: "—", score: 0, badge: "◇" },
    { rank: 3, name: "—", score: 0, badge: "◈" },
    { rank: 4, name: "—", score: 0, badge: "○" },
    { rank: 5, name: "—", score: 0, badge: "·" },
];

function getLeaderboardWithPlayer(playerScore: number) {
    const board = INITIAL_LEADERBOARD.map(e => ({ ...e, isMe: false }));
    const player = { rank: 0, name: "You", score: playerScore, badge: "◉", isMe: true };
    const combined = [...board, player]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((p, i) => ({ ...p, rank: i + 1 }));

    const allSorted = [...board, player].sort((a, b) => b.score - a.score);
    const globalRank = allSorted.findIndex(p => p.isMe) + 1;

    return { top5: combined, globalRank };
}

export default function DateBattleArenaPage() {
    const { isMobile } = useResponsive();

    const [gameState, setGameState] = useState<GameState>("idle");
    const [timeLeft, setTimeLeft] = useState(BATTLE_CONFIG.GAME_DURATION_SEC);
    const [countdown, setCountdown] = useState(3);

    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);

    const [questionPool, setQuestionPool] = useState(CHRONO_DATA);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [isShaking, setIsShaking] = useState(false);

    const questionStartTimeRef = useRef(Date.now());

    const startGameLoop = useCallback(() => {
        setGameState("playing");
        questionStartTimeRef.current = Date.now();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === "playing" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { setGameState("ended"); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } else if (gameState === "countdown") {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) { startGameLoop(); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, startGameLoop]);

    const startCountdown = () => {
        setGameState("countdown");
        setCountdown(3);
        setScore(0);
        setStreak(0);
        setCorrectCount(0);
        setTotalAnswered(0);
        setTimeLeft(BATTLE_CONFIG.GAME_DURATION_SEC);

        const shuffled = shuffleArray(CHRONO_DATA);
        setQuestionPool(shuffled);
        setCurrentQuestionIndex(0);
        setOptions(generateOptions(shuffled[0].year));
    };

    const handleAnswer = (selectedYear: string) => {
        if (feedback !== null || gameState !== "playing") return;

        const currentData = questionPool[currentQuestionIndex];
        const isCorrect = selectedYear === currentData.year;
        const timeTakenMs = Date.now() - questionStartTimeRef.current;
        setTotalAnswered(prev => prev + 1);

        if (isCorrect) {
            setFeedback("correct");
            setCorrectCount(prev => prev + 1);
            const pointsGained = calculateScore(BATTLE_CONFIG.BASE_POINTS, timeTakenMs, streak);
            setScore(prev => prev + pointsGained);
            setStreak(prev => prev + 1);
        } else {
            setFeedback("wrong");
            setIsShaking(true);
            setStreak(0);
            setTimeout(() => setIsShaking(false), 500);
        }

        setTimeout(() => {
            setFeedback(null);
            const nextIdx = (currentQuestionIndex + 1) % questionPool.length;
            if (nextIdx === 0) {
                const refreshedPool = shuffleArray(CHRONO_DATA);
                setQuestionPool(refreshedPool);
                setOptions(generateOptions(refreshedPool[0].year));
            } else {
                setOptions(generateOptions(questionPool[nextIdx].year));
            }
            setCurrentQuestionIndex(nextIdx);
            questionStartTimeRef.current = Date.now();
        }, 400);
    };

    const currentQ = questionPool[currentQuestionIndex];
    const progressPerc = (timeLeft / BATTLE_CONFIG.GAME_DURATION_SEC) * 100;
    const isCriticalTime = timeLeft <= 15;

    const rankObj = getRankObj(score);
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const currentMultiplier = (BATTLE_CONFIG.COMBO_MULTIPLIERS.find(m => streak >= m.minStreak) || BATTLE_CONFIG.COMBO_MULTIPLIERS[BATTLE_CONFIG.COMBO_MULTIPLIERS.length - 1]).multiplier;
    const { top5, globalRank } = getLeaderboardWithPlayer(score);

    // ── Leaderboard ──
    const LeaderboardCard = ({ title, compact }: { title: string; compact?: boolean }) => (
        <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--bg-border)",
            borderRadius: 16,
            padding: compact ? "16px" : "20px",
            maxWidth: 560, width: "100%", margin: "0 auto", textAlign: "left",
        }}>
            <div style={{
                textAlign: "center", marginBottom: 12, padding: "8px 16px",
                background: "var(--accent-gold-glow)",
                borderRadius: 10,
                border: "1px solid var(--accent-gold-border)",
            }}>
                <span style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.1em" }}>YOU ARE </span>
                <span style={{ fontFamily: "var(--font-display)", color: "var(--accent-gold)", fontSize: 15, letterSpacing: "-0.01em" }}>GLOBAL #{globalRank}</span>
            </div>

            <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--text-muted)", opacity: 0.6,
                marginBottom: 10, textAlign: "center",
            }}>
                {title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {top5.map((p, i) => {
                    const pr = getRankObj(p.score);
                    return (
                        <div key={i} style={{
                            padding: compact ? "8px 12px" : "10px 14px",
                            background: p.isMe ? "var(--accent-gold-glow)" : "transparent",
                            border: p.isMe ? "1px solid var(--accent-gold-border)" : "1px solid transparent",
                            borderRadius: 10,
                            display: "flex", alignItems: "center", gap: 10,
                        }}>
                            <span style={{
                                fontFamily: "var(--font-display)", fontWeight: 600, width: 28,
                                color: p.isMe ? "var(--accent-gold)" : "var(--text-muted)",
                                fontSize: 13, letterSpacing: "-0.01em",
                            }}>#{p.rank}</span>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{
                                    fontFamily: "var(--font-body)", fontSize: 13,
                                    fontWeight: p.isMe ? 600 : 400,
                                    color: p.isMe ? "var(--text-primary)" : "var(--text-secondary)",
                                }}>{p.name} {p.badge}</span>
                                {p.score > 0 && (
                                    <span style={{
                                        fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                                        letterSpacing: "0.08em", color: pr.color,
                                    }}>{pr.title}</span>
                                )}
                            </div>
                            <span style={{
                                fontFamily: "var(--font-display)", fontSize: 14,
                                color: p.isMe ? "var(--accent-gold)" : "var(--text-muted)",
                                letterSpacing: "-0.01em",
                            }}>{p.score}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // ── Renderers ──
    const renderIdle = () => (
        <div style={{
            textAlign: "center", animation: "dbSlideUp 0.5s ease-out", padding: 24,
            position: "relative", zIndex: 1, maxWidth: 720, width: "100%",
        }}>
            <div style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--accent-gold)", opacity: 0.8, marginBottom: 12,
            }}>
                History · Paid Feature
            </div>
            <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 42 : 64, fontWeight: 400,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em", lineHeight: 1.05,
                margin: "0 0 10px",
            }}>
                Date Battle Arena
            </h1>
            <div style={{
                fontFamily: "var(--font-tagline)", fontSize: isMobile ? 14 : 17,
                fontStyle: "italic", color: "var(--text-secondary)",
                opacity: 0.9, marginBottom: 18,
            }}>
                Guess as many dates as possible in 60 seconds.
            </div>
            <div style={{
                fontFamily: "var(--font-body)", fontSize: 13,
                color: "var(--text-muted)", maxWidth: 480,
                margin: "0 auto 28px", lineHeight: 1.65,
            }}>
                Speed and accuracy multiply your score. Answer under 2 seconds for a speed bonus, and build your combo for massive multipliers.
            </div>

            {/* Merch banner */}
            <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--accent-gold-border)",
                borderRadius: 14, padding: "14px 20px",
                maxWidth: 520, margin: "0 auto 28px",
                display: "flex", alignItems: "center", gap: 14,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "var(--accent-gold-glow)",
                    border: "1px solid var(--accent-gold-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", color: "var(--accent-gold)", fontSize: 18,
                    flexShrink: 0,
                }}>◆</div>
                <div style={{ textAlign: "left" }}>
                    <div style={{
                        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                        color: "var(--text-primary)", marginBottom: 3,
                        letterSpacing: "-0.005em",
                    }}>
                        Score {PERFECT_SCORE.toLocaleString()} = FREE Clarify Knowledge Merch
                    </div>
                    <div style={{
                        fontFamily: "var(--font-body)", fontSize: 11,
                        color: "var(--text-muted)", lineHeight: 1.5,
                    }}>
                        Hit a perfect score to claim the Chrono King title and earn exclusive merch.
                    </div>
                </div>
            </div>

            <button
                onClick={startCountdown}
                style={{
                    fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.18em",
                    fontSize: 13, textTransform: "uppercase",
                    color: "#0A0A0F",
                    background: "var(--accent-gold)",
                    border: "none",
                    padding: "14px 42px",
                    borderRadius: 100,
                    cursor: "pointer",
                    boxShadow: "0 0 24px var(--accent-gold-glow)",
                    transition: "all 0.25s ease",
                    marginBottom: 36,
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "scale(1)"; }}
            >
                Enter Arena →
            </button>

            {/* Rank Tiers */}
            <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 16, padding: 20,
                maxWidth: 560, width: "100%",
                margin: "0 auto 18px",
            }}>
                <div style={{
                    fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "var(--text-muted)", opacity: 0.6,
                    marginBottom: 12, textAlign: "center",
                }}>
                    Rank Tiers
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {BATTLE_CONFIG.RANKS.map((r, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center",
                            padding: "8px 14px", borderRadius: 10,
                            background: i === 0 ? "var(--accent-gold-glow)" : "var(--bg-elevated)",
                            border: `1px solid ${i === 0 ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                            gap: 12,
                        }}>
                            <span style={{
                                fontFamily: "var(--font-display)", fontSize: 14,
                                color: r.color, flex: 1, textAlign: "left",
                                letterSpacing: "-0.01em",
                            }}>{r.title}</span>
                            <span style={{
                                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                                color: "var(--text-muted)",
                            }}>
                                {r.minScore === PERFECT_SCORE ? `${r.minScore.toLocaleString()} (Perfect)` : `${r.minScore.toLocaleString()}+`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <LeaderboardCard title="Top 5 Global" />
        </div>
    );

    const renderCountdown = () => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <div key={countdown} style={{
                fontFamily: "var(--font-display)",
                fontSize: 140, fontWeight: 400,
                color: "var(--text-primary)",
                letterSpacing: "-0.04em",
                textShadow: "0 0 60px var(--accent-gold-glow)",
                animation: "dbScaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}>
                {countdown}
            </div>
            <div style={{
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.24em", textTransform: "uppercase",
                color: "var(--accent-gold)", marginTop: 18,
            }}>
                Get Ready
            </div>
        </div>
    );

    const renderPlaying = () => (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flex: 1, padding: isMobile ? 16 : 24, gap: 24, flexDirection: isMobile ? "column" : "row" }}>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    {/* Timer */}
                    <div style={{ marginBottom: 24, position: "relative", width: 92, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="92" height="92" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                            <circle cx="46" cy="46" r="42" fill="none" stroke="var(--bg-border)" strokeWidth="4" />
                            <circle
                                cx="46" cy="46" r="42" fill="none"
                                stroke={isCriticalTime ? "var(--status-red)" : "var(--accent-gold)"}
                                strokeWidth="4"
                                strokeDasharray="263.89"
                                strokeDashoffset={263.89 - (263.89 * progressPerc) / 100}
                                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
                            />
                        </svg>
                        <span
                            className={isCriticalTime ? "db-pulse" : ""}
                            style={{
                                fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 400,
                                color: isCriticalTime ? "var(--status-red)" : "var(--text-primary)",
                                letterSpacing: "-0.03em",
                            }}
                        >
                            {timeLeft}
                        </span>
                    </div>

                    {/* Question Card */}
                    <div className={isShaking ? "db-shake" : ""} style={{
                        width: "100%", maxWidth: 620,
                        background: feedback === "correct" ? "rgba(62,207,142,0.08)" : feedback === "wrong" ? "rgba(248,113,113,0.08)" : "var(--bg-surface)",
                        border: "1px solid",
                        borderColor: feedback === "correct" ? "rgba(62,207,142,0.3)" : feedback === "wrong" ? "rgba(248,113,113,0.3)" : "var(--bg-border)",
                        borderRadius: 18,
                        padding: isMobile ? 24 : 32,
                        textAlign: "center",
                        boxShadow: feedback === "correct" ? "0 0 40px rgba(62,207,142,0.15)"
                            : feedback === "wrong" ? "0 0 40px rgba(248,113,113,0.15)"
                            : "0 12px 30px rgba(0,0,0,0.3)",
                        transition: "all 0.2s ease",
                    }}>
                        <h2 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: isMobile ? 17 : 20, fontWeight: 400,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.01em", lineHeight: 1.4,
                            marginBottom: 24, margin: "0 0 24px",
                        }}>
                            {getDetailedTitle(currentQ)}
                        </h2>

                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                            {options.map((opt, i) => {
                                const isCorrectTarget = feedback && opt === currentQ.year;
                                return (
                                    <button
                                        key={opt + i}
                                        onClick={() => handleAnswer(opt)}
                                        style={{
                                            background: isCorrectTarget ? "var(--status-green)" : "var(--bg-elevated)",
                                            border: "1px solid",
                                            borderColor: isCorrectTarget ? "var(--status-green)" : "var(--bg-border)",
                                            color: isCorrectTarget ? "#0A0A0F" : "var(--text-primary)",
                                            padding: "14px",
                                            fontFamily: "var(--font-display)",
                                            fontSize: 16, fontWeight: 500,
                                            letterSpacing: "-0.01em",
                                            borderRadius: 12,
                                            cursor: "pointer",
                                            transition: "all 0.18s ease",
                                            transform: isCorrectTarget ? "scale(1.03)" : "scale(1)",
                                            boxShadow: isCorrectTarget ? "0 0 20px rgba(62,207,142,0.4)" : "none",
                                            opacity: feedback && !isCorrectTarget ? 0.3 : 1,
                                        }}
                                        onMouseEnter={e => {
                                            if (!feedback) {
                                                e.currentTarget.style.background = "var(--bg-surface)";
                                                e.currentTarget.style.borderColor = "var(--accent-gold-border)";
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!feedback) {
                                                e.currentTarget.style.background = "var(--bg-elevated)";
                                                e.currentTarget.style.borderColor = "var(--bg-border)";
                                            }
                                        }}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Stats panel */}
                <div style={{
                    width: isMobile ? "100%" : 260,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 18, padding: 20,
                    display: "flex", flexDirection: "column", gap: 14,
                }}>
                    <div>
                        <div style={{
                            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            color: "var(--text-muted)", opacity: 0.6, marginBottom: 6,
                        }}>Score</div>
                        <div style={{
                            fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 400,
                            color: "var(--accent-gold)",
                            letterSpacing: "-0.03em", lineHeight: 1,
                        }}>{score}</div>
                    </div>

                    <div style={{
                        background: streak >= 3 ? "var(--accent-gold-glow)" : "var(--bg-elevated)",
                        border: `1px solid ${streak >= 3 ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                        borderRadius: 12, padding: 14,
                        transition: "all 0.25s ease",
                    }}>
                        <div style={{
                            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            color: "var(--text-muted)", opacity: 0.6, marginBottom: 6,
                        }}>Combo Streak</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                            <span style={{
                                fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400,
                                color: streak >= 3 ? "var(--accent-gold)" : "var(--text-primary)",
                                letterSpacing: "-0.03em",
                            }}>{streak}</span>
                            <span style={{
                                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                                color: currentMultiplier > 1 ? "var(--status-green)" : "var(--text-muted)",
                            }}>×{currentMultiplier}</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.6, marginBottom: 4 }}>Accuracy</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{accuracy}%</div>
                        </div>
                        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.6, marginBottom: 4 }}>Correct</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{correctCount}/{totalAnswered}</div>
                        </div>
                    </div>

                    <div style={{
                        background: "var(--accent-gold-glow)",
                        border: "1px solid var(--accent-gold-border)",
                        borderRadius: 10, padding: 10, textAlign: "center",
                    }}>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.7, marginBottom: 2 }}>Global Rank</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--accent-gold)", letterSpacing: "-0.01em" }}>#{globalRank}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEnded = () => (
        <div style={{
            textAlign: "center", animation: "dbScaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            padding: 24, position: "relative", zIndex: 1, maxWidth: 640, width: "100%",
        }}>
            <div style={{
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: rankObj.color, marginBottom: 12,
            }}>
                Time&apos;s Up
            </div>

            <div style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 68 : 84, fontWeight: 400,
                color: "var(--text-primary)",
                letterSpacing: "-0.04em", lineHeight: 1,
                marginBottom: 6,
                textShadow: `0 0 30px ${rankObj.color}60`,
            }}>
                {score}
            </div>
            <div style={{
                fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--text-muted)", opacity: 0.6,
                marginBottom: 28,
            }}>
                Final Score
            </div>

            <div style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: 16, padding: 20,
                maxWidth: 480, margin: "0 auto 20px",
            }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Rank Achieved</div>
                <div style={{
                    fontFamily: "var(--font-display)", fontSize: 22,
                    color: rankObj.color, marginBottom: 16,
                    letterSpacing: "-0.01em",
                }}>
                    {rankObj.title}
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", borderTop: "1px solid var(--bg-border)", paddingTop: 16 }}>
                    <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Accuracy</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{accuracy}%</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Questions</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{correctCount}/{totalAnswered}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>XP</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--status-green)", letterSpacing: "-0.01em" }}>+{Math.floor(score / 10)}</div>
                    </div>
                </div>
            </div>

            <LeaderboardCard title="Final Leaderboard Standings" compact />

            {score < PERFECT_SCORE && (
                <div style={{
                    marginTop: 16, padding: "10px 16px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 12,
                    maxWidth: 480, margin: "16px auto 0",
                }}>
                    <span style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5 }}>
                        Perfect Score: <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>{PERFECT_SCORE.toLocaleString()}</span> — hit it to become <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Chrono King</span> and win free merch.
                    </span>
                </div>
            )}
            {score >= PERFECT_SCORE && (
                <div style={{
                    marginTop: 16, padding: "14px 20px",
                    background: "var(--accent-gold-glow)",
                    border: "1px solid var(--accent-gold)",
                    borderRadius: 14,
                    maxWidth: 480, margin: "16px auto 0",
                    animation: "dbScaleIn 0.5s ease-out",
                }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 4, color: "var(--accent-gold)", letterSpacing: "-0.02em" }}>◆</div>
                    <span style={{ fontFamily: "var(--font-body)", color: "var(--accent-gold)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Chrono King Achieved — Free Merch Unlocked
                    </span>
                </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: 20 }}>
                <button
                    onClick={() => setGameState("idle")}
                    style={{
                        background: "transparent",
                        border: "1px solid var(--bg-border)",
                        color: "var(--text-secondary)",
                        padding: "12px 28px",
                        fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        borderRadius: 100,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                    ← Go Back
                </button>

                <button
                    onClick={startCountdown}
                    style={{
                        background: "var(--accent-gold)",
                        color: "#0A0A0F",
                        border: "none",
                        padding: "12px 36px",
                        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                        letterSpacing: "0.14em", textTransform: "uppercase",
                        borderRadius: 100,
                        cursor: "pointer",
                        boxShadow: "0 0 20px var(--accent-gold-glow)",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                    Play Again
                </button>
            </div>
        </div>
    );

    return (
        <div style={{
            width: "100%",
            minHeight: "calc(100vh - 84px)",
            background: "var(--bg-base)",
            position: "relative",
            overflowX: "hidden", overflowY: "auto",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-body)",
            padding: "40px 0",
        }}>
            {/* Ambient background */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `radial-gradient(ellipse at 20% 50%, var(--accent-gold-glow) 0%, transparent 50%),
                                  radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.04) 0%, transparent 50%),
                                  radial-gradient(ellipse at 50% 80%, rgba(0,212,255,0.03) 0%, transparent 50%)`,
                pointerEvents: "none", zIndex: 0,
            }} />

            {/* Subtle grid */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
                pointerEvents: "none", opacity: 0.4, zIndex: 0,
            }} />

            {gameState === "idle" && renderIdle()}
            {gameState === "countdown" && renderCountdown()}
            {gameState === "playing" && renderPlaying()}
            {gameState === "ended" && renderEnded()}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes dbScaleIn { 0% { transform: scale(0.88); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes dbSlideUp { 0% { transform: translateY(24px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                .db-pulse { animation: dbPulse 1s ease-in-out infinite; }
                @keyframes dbPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
                .db-shake { animation: dbShake 0.5s ease-in-out; }
                @keyframes dbShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            `}} />
        </div>
    );
}
