"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CHRONO_DATA } from "@/data/chrono-config";
import { BATTLE_CONFIG, PERFECT_SCORE, calculateScore, getRankObj } from "@/data/battle-config";

type GameState = "idle" | "countdown" | "playing" | "ended";

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Generate plausible year options
function generateOptions(correctYearStr: string): string[] {
    const match = correctYearStr.match(/\d{4}/);
    if (!match) {
        return shuffleArray([correctYearStr, "1820", "1942", "1757"]);
    }
    const correctYear = parseInt(match[0], 10);
    const options = new Set<number>();
    options.add(correctYear);
    while(options.size < 4) {
        const offset = Math.floor(Math.random() * 100) - 50;
        const fakeYear = correctYear + offset;
        if (fakeYear !== correctYear && fakeYear > 1000 && fakeYear <= new Date().getFullYear()) {
            options.add(fakeYear);
        }
    }
    const optionStrings = Array.from(options).map(y => correctYearStr.replace(/\d{4}/, y.toString()));
    return shuffleArray(optionStrings);
}

// Build a more descriptive question title from the chrono data
function getDetailedTitle(event: typeof CHRONO_DATA[0]): string {
    // Combine title with first bullet to give context
    const firstBullet = event.bullets?.[0];
    if (firstBullet && firstBullet.length > 15) {
        return `${event.title} — ${firstBullet}`;
    }
    return event.title;
}

// ---- Floating Particles Component ----
function FloatingParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Create particles
        const particles: { x: number; y: number; r: number; dx: number; dy: number; o: number; color: string }[] = [];
        const colors = ["rgba(14,165,233,", "rgba(59,130,246,", "rgba(99,102,241,", "rgba(168,85,247,"];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                o: Math.random() * 0.5 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
                if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.o + ")";
                ctx.fill();
            }
            // Draw faint connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(14,165,233,${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0
            }}
        />
    );
}

// ---- Mock Leaderboard Data ----
// In production these would be all zeros. Simulating with zeros for realism.
const INITIAL_LEADERBOARD = [
    { rank: 1, name: "—", score: 0, badge: "🥇" },
    { rank: 2, name: "—", score: 0, badge: "🥈" },
    { rank: 3, name: "—", score: 0, badge: "🥉" },
    { rank: 4, name: "—", score: 0, badge: "⚔️" },
    { rank: 5, name: "—", score: 0, badge: "⭐" },
];

function getLeaderboardWithPlayer(playerScore: number) {
    const board = INITIAL_LEADERBOARD.map(e => ({ ...e, isMe: false }));
    // Insert the player
    const player = { rank: 0, name: "You", score: playerScore, badge: "🔥", isMe: true };
    const combined = [...board, player]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((p, i) => ({ ...p, rank: i + 1 }));
    
    // Calculate the player's global rank
    const allSorted = [...board, player].sort((a, b) => b.score - a.score);
    const globalRank = allSorted.findIndex(p => p.isMe) + 1;

    return { top5: combined, globalRank };
}


export default function DateBattleArenaPage() {
    const isMobile = useIsMobile();
    
    // Game State
    const [gameState, setGameState] = useState<GameState>("idle");
    const [timeLeft, setTimeLeft] = useState(BATTLE_CONFIG.GAME_DURATION_SEC);
    const [countdown, setCountdown] = useState(3);
    
    // Player Stats
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    
    // Question State
    const [questionPool, setQuestionPool] = useState(CHRONO_DATA);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    
    // Timing Ref
    const questionStartTimeRef = useRef(Date.now());

    // Start game loop after countdown
    const startGameLoop = useCallback(() => {
        setGameState("playing");
        questionStartTimeRef.current = Date.now();
    }, []);
    
    // Timer Effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === "playing" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState("ended");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (gameState === "countdown") {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        startGameLoop();
                        return 0;
                    }
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

    // --- Leaderboard Component ---
    const LeaderboardCard = ({ title, compact }: { title: string; compact?: boolean }) => (
        <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            padding: compact ? "16px" : "20px",
            maxWidth: "560px",
            width: "100%",
            margin: "0 auto",
            textAlign: "left",
            backdropFilter: "blur(10px)",
        }}>
            {/* Global rank badge */}
            <div style={{
                textAlign: "center",
                marginBottom: 12,
                padding: "8px 16px",
                background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.1))",
                borderRadius: "12px",
                border: "1px solid rgba(14,165,233,0.15)"
            }}>
                <span style={{ color: "#9CA3AF", fontSize: "12px", letterSpacing: 1 }}>YOU ARE </span>
                <span style={{ color: "#0EA5E9", fontSize: "16px", fontWeight: 800 }}>GLOBAL #{globalRank}</span>
            </div>
            
            <div style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, textAlign: "center", fontWeight: 700 }}>
                {title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {top5.map((p, i) => {
                    const playerRank = getRankObj(p.score);
                    return (
                        <div key={i} style={{
                            padding: compact ? "8px 14px" : "10px 16px",
                            background: p.isMe ? "rgba(14,165,233,0.1)" : "transparent",
                            border: p.isMe ? "1px solid rgba(14,165,233,0.2)" : "1px solid transparent",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            transition: "all 0.3s ease"
                        }}>
                            <span style={{ color: p.isMe ? "#0EA5E9" : "#6B7280", fontWeight: 800, width: "28px", fontSize: "13px" }}>#{p.rank}</span>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ color: p.isMe ? "#FFF" : "#D1D5DB", fontWeight: p.isMe ? 700 : 500, fontSize: "13px" }}>{p.name} {p.badge}</span>
                                {p.score > 0 && <span style={{ color: playerRank.color, fontSize: "10px", fontWeight: 700 }}>{playerRank.title}</span>}
                            </div>
                            <span style={{ color: p.isMe ? "#0EA5E9" : "#6B7280", fontFamily: "monospace", fontSize: "14px", fontWeight: 700 }}>{p.score}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // --- RENDERERS ---

    const renderIdle = () => (
        <div style={{ textAlign: "center", animation: "slideInUp 0.6s ease-out", padding: "20px", position: "relative", zIndex: 1, maxWidth: "700px", width: "100%" }}>
            <h1 style={{
                fontSize: isMobile ? "36px" : "56px",
                fontWeight: 900,
                background: "linear-gradient(135deg, #0EA5E9 0%, #3B82F6 50%, #6366F1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.3,
                padding: "10px 0",
                marginBottom: 8
            }}>
                Date Battle Arena
            </h1>
            <p style={{
                fontSize: isMobile ? "14px" : "18px",
                color: "#6366F1",
                marginBottom: 8,
                fontWeight: 600,
                letterSpacing: 1
            }}>
                by Clarify Knowledge
            </p>
            <p style={{
                fontSize: "14px",
                color: "#94A3B8",
                marginBottom: 8,
                fontWeight: 500,
                fontStyle: "italic"
            }}>
                &quot;Guess as many dates as possible in 60 seconds.&quot;
            </p>
            <p style={{
                color: "#D1D5DB",
                fontSize: "13px",
                maxWidth: 500,
                margin: "0 auto 24px",
                lineHeight: 1.6
            }}>
                Speed and accuracy multiply your score. Answer under 2 seconds for a speed bonus, and build your combo for massive multipliers!
            </p>

            {/* MERCH BANNER */}
            <div style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(234,88,12,0.08))",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "16px",
                padding: "14px 20px",
                maxWidth: "500px",
                margin: "0 auto 28px",
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}>
                <span style={{ fontSize: "28px" }}>🏆</span>
                <div style={{ textAlign: "left" }}>
                    <div style={{ color: "#FCD34D", fontSize: "13px", fontWeight: 800, marginBottom: 2 }}>
                        Score {PERFECT_SCORE.toLocaleString()} = FREE Clarify Knowledge Merch!
                    </div>
                    <div style={{ color: "#D1A054", fontSize: "11px", fontWeight: 500 }}>
                        Achieve a perfect score to claim the title of Chrono King 👑 and earn exclusive merch.
                    </div>
                </div>
            </div>

            <button
                onClick={startCountdown}
                style={{
                    background: "linear-gradient(135deg, #0EA5E9, #3B82F6)",
                    color: "white",
                    border: "none",
                    padding: "14px 44px",
                    fontSize: "16px",
                    fontWeight: 800,
                    borderRadius: "100px",
                    cursor: "pointer",
                    boxShadow: "0 0 30px rgba(14,165,233,0.3)",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    marginBottom: 32
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 0 50px rgba(14,165,233,0.5)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(14,165,233,0.3)";
                }}
            >
                Enter Arena ⚡
            </button>

            {/* RANK TIERS CARD */}
            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "20px",
                padding: "20px",
                maxWidth: "560px",
                width: "100%",
                margin: "0 auto 20px",
                backdropFilter: "blur(10px)",
            }}>
                <div style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, textAlign: "center", fontWeight: 700 }}>
                    🏅 Rank Tiers
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {BATTLE_CONFIG.RANKS.map((r, i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            background: i === 0 ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.02)",
                            border: i === 0 ? "1px solid rgba(245,158,11,0.15)" : "1px solid rgba(255,255,255,0.03)",
                            gap: 12
                        }}>
                            <span style={{ color: r.color, fontWeight: 800, fontSize: "14px", flex: 1, textAlign: "left" }}>{r.title}</span>
                            <span style={{ color: "#6B7280", fontSize: "12px", fontFamily: "monospace", fontWeight: 600 }}>
                                {r.minScore === PERFECT_SCORE ? `${r.minScore.toLocaleString()} (Perfect)` : `${r.minScore.toLocaleString()}+`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <LeaderboardCard title="🌐 Top 5 Global" />
        </div>
    );

    const renderCountdown = () => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <div key={countdown} style={{
                fontSize: "120px",
                fontWeight: 900,
                color: "#FFF",
                textShadow: "0 0 60px rgba(14,165,233,0.8)",
                animation: "scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}>
                {countdown}
            </div>
            <div style={{
                fontSize: "18px",
                color: "#0EA5E9",
                marginTop: 20,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase"
            }}>
                Get Ready
            </div>
        </div>
    );

    const renderPlaying = () => (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flex: 1, padding: isMobile ? "16px" : "24px", gap: "24px", flexDirection: isMobile ? "column" : "row" }}>
                
                {/* LEFT: MAIN BATTLE ZONE */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    
                    {/* TIMER */}
                    <div style={{ marginBottom: "24px", position: "relative", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="90" height="90" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                            <circle cx="45" cy="45" r="41" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                            <circle 
                                cx="45" cy="45" r="41" fill="none" 
                                stroke={isCriticalTime ? "#EF4444" : "#10B981"} 
                                strokeWidth="5"
                                strokeDasharray="257.61"
                                strokeDashoffset={257.61 - (257.61 * progressPerc) / 100}
                                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
                            />
                        </svg>
                        <span 
                            className={isCriticalTime ? "pulse-anim" : ""}
                            style={{
                                fontSize: "28px",
                                fontWeight: 900,
                                color: isCriticalTime ? "#EF4444" : "#FFF",
                                fontVariantNumeric: "tabular-nums"
                            }}
                        >
                            {timeLeft}
                        </span>
                    </div>

                    {/* QUESTION CARD */}
                    <div className={isShaking ? "shake-anim" : ""} style={{
                        width: "100%",
                        maxWidth: "600px",
                        background: feedback === "correct" ? "rgba(16,185,129,0.08)" : feedback === "wrong" ? "rgba(239,68,68,0.08)" : "rgba(15,15,20,0.7)",
                        border: "1px solid",
                        borderColor: feedback === "correct" ? "rgba(16,185,129,0.3)" : feedback === "wrong" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)",
                        borderRadius: "20px",
                        padding: isMobile ? "24px" : "32px",
                        textAlign: "center",
                        boxShadow: feedback === "correct" ? "0 0 40px rgba(16,185,129,0.15)" : feedback === "wrong" ? "0 0 40px rgba(239,68,68,0.15)" : "0 12px 30px rgba(0,0,0,0.4)",
                        transition: "all 0.2s ease",
                        backdropFilter: "blur(12px)"
                    }}>
                        <h2 style={{
                            fontSize: isMobile ? "18px" : "22px",
                            fontWeight: 700,
                            color: "#FFF",
                            marginBottom: 24,
                            lineHeight: 1.4
                        }}>
                            {getDetailedTitle(currentQ)}
                        </h2>

                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                            {options.map((opt, i) => {
                                const isCorrectTarget = feedback && opt === currentQ.year;
                                
                                return (
                                    <button
                                        key={opt + i}
                                        onClick={() => handleAnswer(opt)}
                                        style={{
                                            background: isCorrectTarget ? "#10B981" : "rgba(255,255,255,0.04)",
                                            border: "1px solid",
                                            borderColor: isCorrectTarget ? "#10B981" : "rgba(255,255,255,0.08)",
                                            color: isCorrectTarget ? "#000" : "#FFF",
                                            padding: "14px",
                                            fontSize: "16px",
                                            fontWeight: 700,
                                            borderRadius: "14px",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            transform: isCorrectTarget ? "scale(1.05)" : "scale(1)",
                                            boxShadow: isCorrectTarget ? "0 0 20px rgba(16,185,129,0.4)" : "none",
                                            opacity: feedback && !isCorrectTarget ? 0.3 : 1
                                        }}
                                        onMouseEnter={e => {
                                            if(!feedback) {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                                e.currentTarget.style.borderColor = "rgba(14,165,233,0.4)";
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if(!feedback) {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                            }
                                        }}
                                    >
                                        {opt}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: LIVE STATS */}
                <div style={{
                    width: isMobile ? "100%" : "260px",
                    background: "rgba(15,15,20,0.5)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "20px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    backdropFilter: "blur(10px)"
                }}>
                    <div>
                        <div style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Current Score</div>
                        <div style={{ fontSize: "32px", fontWeight: 900, color: "#0EA5E9", fontVariantNumeric: "tabular-nums" }}>{score}</div>
                    </div>

                    <div style={{
                        background: streak >= 3 ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(14,165,233,0.15))" : "rgba(255,255,255,0.02)",
                        border: streak >= 3 ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(255,255,255,0.04)",
                        borderRadius: "14px",
                        padding: "14px",
                        transition: "all 0.3s ease"
                    }}>
                        <div style={{ color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Combo Streak</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: "28px", fontWeight: 900, color: streak >= 3 ? "#F59E0B" : "#FFF" }}>{streak}</span>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: currentMultiplier > 1 ? "#10B981" : "#6B7280" }}>x{currentMultiplier}</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                            <div style={{ color: "#6B7280", fontSize: "10px", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Accuracy</div>
                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFF" }}>{accuracy}%</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                            <div style={{ color: "#6B7280", fontSize: "10px", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Correct</div>
                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFF" }}>{correctCount}/{totalAnswered}</div>
                        </div>
                    </div>

                    {/* Global rank live */}
                    <div style={{
                        background: "rgba(14,165,233,0.06)",
                        border: "1px solid rgba(14,165,233,0.1)",
                        borderRadius: "12px",
                        padding: "10px",
                        textAlign: "center"
                    }}>
                        <div style={{ color: "#6B7280", fontSize: "10px", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Global Rank</div>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#0EA5E9" }}>#{globalRank}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEnded = () => (
        <div style={{ textAlign: "center", animation: "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)", padding: "20px", position: "relative", zIndex: 1, maxWidth: "600px", width: "100%" }}>
            <div style={{
                color: rankObj.color,
                fontSize: "16px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 4,
                marginBottom: 12
            }}>
                Time&apos;s Up!
            </div>
            
            <div style={{
                fontSize: isMobile ? "64px" : "72px",
                fontWeight: 900,
                color: "#FFF",
                lineHeight: 1,
                padding: "10px 0",
                marginBottom: 4,
                textShadow: `0 0 30px ${rankObj.color}60`
            }}>
                {score}
            </div>
            <div style={{ color: "#6B7280", fontSize: "14px", marginBottom: 28, textTransform: "uppercase", letterSpacing: 2 }}>
                Final Score
            </div>

            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px",
                padding: "20px",
                maxWidth: "480px",
                margin: "0 auto 20px"
            }}>
                <div style={{ color: "#6B7280", fontSize: "12px", marginBottom: 6 }}>Rank Achieved</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: rankObj.color, marginBottom: 16 }}>
                    {rankObj.title}
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-around", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                    <div>
                        <div style={{ color: "#6B7280", fontSize: "11px", marginBottom: 4 }}>Accuracy</div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFF" }}>{accuracy}%</div>
                    </div>
                    <div>
                        <div style={{ color: "#6B7280", fontSize: "11px", marginBottom: 4 }}>Questions</div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFF" }}>{correctCount}/{totalAnswered}</div>
                    </div>
                    <div>
                        <div style={{ color: "#6B7280", fontSize: "11px", marginBottom: 4 }}>XP Earned</div>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: "#10B981" }}>+{Math.floor(score / 10)}</div>
                    </div>
                </div>
            </div>

            {/* LEADERBOARD ON END SCREEN */}
            <LeaderboardCard title="🏆 Final Leaderboard Standings" compact />

            {/* Perfect score hint */}
            {score < PERFECT_SCORE && (
                <div style={{
                    marginTop: 16,
                    padding: "10px 16px",
                    background: "rgba(245,158,11,0.06)",
                    border: "1px solid rgba(245,158,11,0.12)",
                    borderRadius: "12px",
                    maxWidth: "480px",
                    margin: "16px auto 0"
                }}>
                    <span style={{ color: "#D1A054", fontSize: "12px" }}>
                        🎯 Perfect Score: {PERFECT_SCORE.toLocaleString()} — Score it to become <span style={{ fontWeight: 800, color: "#FCD34D" }}>Chrono King 👑</span> and win free Clarify Knowledge merch!
                    </span>
                </div>
            )}
            {score >= PERFECT_SCORE && (
                <div style={{
                    marginTop: 16,
                    padding: "14px 20px",
                    background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(234,88,12,0.15))",
                    border: "2px solid rgba(245,158,11,0.4)",
                    borderRadius: "16px",
                    maxWidth: "480px",
                    margin: "16px auto 0",
                    animation: "scaleIn 0.6s ease-out"
                }}>
                    <div style={{ fontSize: "24px", marginBottom: 4 }}>👑</div>
                    <span style={{ color: "#FCD34D", fontSize: "14px", fontWeight: 800 }}>
                        CHRONO KING ACHIEVED — YOU JUST EARNED FREE MERCH!
                    </span>
                </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", padding: "20px" }}>
                <button
                    onClick={() => setGameState("idle")}
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#FFF",
                        padding: "14px 28px",
                        fontSize: "14px",
                        fontWeight: 700,
                        borderRadius: "100px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    ← Go Back
                </button>
                
                <button
                    onClick={startCountdown}
                    style={{
                        background: rankObj.color,
                        color: "#000",
                        border: "none",
                        padding: "14px 36px",
                        fontSize: "16px",
                        fontWeight: 800,
                        borderRadius: "100px",
                        cursor: "pointer",
                        boxShadow: `0 0 24px ${rankObj.color}50`,
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    Play Again 🔄
                </button>
            </div>
        </div>
    );

    return (
        <div style={{
            width: "100%",
            minHeight: "calc(100vh - 84px)",
            background: "#050508",
            backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(14, 165, 233, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.03) 0%, transparent 50%)",
            position: "relative",
            overflowX: "hidden",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            padding: "40px 0"
        }}>
            {/* Interactive particle background */}
            <FloatingParticles />

            {/* Subtle grid overlay */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
                pointerEvents: "none",
                opacity: 0.4,
                zIndex: 0
            }} />

            {/* Render Context based on GameState */}
            {gameState === "idle" && renderIdle()}
            {gameState === "countdown" && renderCountdown()}
            {gameState === "playing" && renderPlaying()}
            {gameState === "ended" && renderEnded()}
            
            {/* Dynamic Global Animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scaleIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes slideInUp {
                    0% { transform: translateY(30px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .pulse-anim {
                    animation: pulseAnim 1s ease-in-out infinite;
                }
                @keyframes pulseAnim {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .shake-anim {
                    animation: shakeAnim 0.5s ease-in-out;
                }
                @keyframes shakeAnim {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
            `}} />
        </div>
    );
}
