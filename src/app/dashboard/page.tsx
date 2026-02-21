"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useMemo } from "react";
import { typography } from "@/lib/typography";
import { LazyCard } from "@/components/ui/LazyCard";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function DashboardPage() {
    const router = useRouter();
    const isMobile = useIsMobile();

    const { data: profile, isLoading: profileLoading } = trpc.dashboard.getProfile.useQuery(undefined, {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const { data: stats } = trpc.dashboard.getStudyStats.useQuery(undefined, {
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const { data: todayPlans } = trpc.planner.getTodayPlans.useQuery(undefined, {
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const logoutMutation = trpc.auth.logout.useMutation({
        onSuccess: () => {
            router.push("/login");
        },
    });

    const todayDate = useMemo(() =>
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        }),
        []
    );

    const todayProgress = useMemo(() =>
        Math.round(((stats?.todayHours || 0) / (stats?.todayGoal || 1)) * 100),
        [stats?.todayHours, stats?.todayGoal]
    );

    useEffect(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        const timer = setTimeout(() => { window.location.reload(); }, msUntilMidnight);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => { logoutMutation.mutate(); };

    if (profileLoading || !stats) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#030303", flexDirection: "column", gap: 16,
            }}>
                <div className="animate-float" style={{ fontSize: 48 }}>✨</div>
                <div style={{
                    fontSize: 16, fontWeight: 600,
                    background: "linear-gradient(135deg, #A78BFA, #8B5CF6)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>Loading your dashboard...</div>
                <div style={{
                    width: 200, height: 3, borderRadius: 2,
                    background: "rgba(255,255,255,0.06)", overflow: "hidden",
                }}>
                    <div className="animate-shimmer" style={{ width: "100%", height: "100%" }} />
                </div>
            </div>
        );
    }

    const greeting = profile?.createdAt && (new Date().getTime() - new Date(profile.createdAt).getTime() < 300000)
        ? `Welcome, ${profile?.name}!`
        : `Welcome back, ${profile?.name}!`;

    const quickActions = [
        { label: "Study Planner", icon: "📅", path: "/dashboard/planner", color: "#8B5CF6", desc: "Plan your day" },
        { label: "Subjects", icon: "📚", path: "/dashboard/subjects", color: "#3B82F6", desc: "Browse syllabus" },
        { label: "AI Assistant", icon: "🤖", path: "/dashboard/ai-assistant", color: "#10B981", desc: "Ask anything" },
        { label: "Competency Test", icon: "⚡", path: "/dashboard/precision-practice", color: "#F59E0B", desc: "Test yourself" },
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: "radial-gradient(ellipse at 0% 0%, rgba(139,92,246,0.04) 0%, transparent 50%), #030303",
            padding: isMobile ? "16px" : "32px",
            transition: "all 0.2s ease-in-out",
        }}>
            {/* Header */}
            <div className="animate-fadeIn" style={{
                maxWidth: "1400px", margin: "0 auto 36px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div>
                    <h1 style={{
                        fontSize: isMobile ? "24px" : "34px", fontWeight: 800,
                        marginBottom: "6px", letterSpacing: -0.5,
                        background: "linear-gradient(135deg, #FFFFFF 0%, #A78BFA 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>
                        {greeting} 👋
                    </h1>
                    <p style={{
                        fontSize: "14px", color: "#6B7280", fontWeight: 500,
                        display: "flex", alignItems: "center", gap: 8,
                    }}>
                        <span style={{
                            display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                            background: "#8B5CF6", boxShadow: "0 0 8px rgba(139,92,246,0.5)",
                        }} />
                        {todayDate}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        color: "#9CA3AF",
                        padding: "10px 20px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: logoutMutation.isPending ? "not-allowed" : "pointer",
                        opacity: logoutMutation.isPending ? 0.5 : 1,
                        transition: "all 0.3s ease",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
            </div>

            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <div className="dashboard-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                }}>

                    {/* Today's Study Plan */}
                    <div className="dashboard-card animate-slideInUp" style={{
                        padding: "28px", minHeight: "280px",
                        display: "flex", flexDirection: "column",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 18,
                                }}>📋</div>
                                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFF" }}>Today&apos;s Progress</h3>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard/planner')}
                                style={{
                                    color: "#8B5CF6", fontSize: "12px", fontWeight: 600,
                                    background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)",
                                    borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                            >View All</button>
                        </div>

                        {/* Circular Progress */}
                        <div style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center" }}>
                            <div style={{ position: "relative", width: 130, height: 130 }}>
                                <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                                    <circle cx="65" cy="65" r="56" stroke="rgba(255,255,255,0.04)" strokeWidth="10" fill="none" />
                                    <circle cx="65" cy="65" r="56" stroke="url(#progressGrad)" strokeWidth="10" fill="none"
                                        strokeDasharray="352" strokeDashoffset={352 - (352 * Math.min(todayProgress, 100) / 100)} strokeLinecap="round"
                                        style={{
                                            filter: "drop-shadow(0 0 8px rgba(139,92,246,0.4))",
                                            transition: "stroke-dashoffset 1s ease",
                                        }} />
                                    <defs>
                                        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#EC4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style={{
                                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexDirection: "column",
                                }}>
                                    <span style={{
                                        fontSize: 36, fontWeight: 800, letterSpacing: -1,
                                        background: "linear-gradient(135deg, #FFF, #A78BFA)",
                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    }}>{todayProgress}%</span>
                                    <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>complete</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exam Readiness */}
                    <div className="dashboard-card animate-slideInUp delay-100" style={{
                        padding: "28px", height: "280px",
                        display: "flex", flexDirection: "column",
                        overflow: "hidden",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "20px" }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18,
                            }}>🎯</div>
                            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFF" }}>Exam Readiness</h3>
                        </div>

                        <div style={{
                            display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
                            gridTemplateRows: "repeat(4, 1fr)", gap: 5,
                            height: 100, marginBottom: 16,
                        }}>
                            {Array.from({ length: 24 }).map((_, i) => {
                                const isComplete = i < Math.floor(24 * ((stats?.examReadiness || 0) / 100));
                                return (
                                    <div key={i} style={{
                                        background: isComplete
                                            ? `linear-gradient(135deg, #8B5CF6, ${i % 3 === 0 ? '#EC4899' : '#7C3AED'})`
                                            : "rgba(255,255,255,0.03)",
                                        borderRadius: 4,
                                        transition: `all 0.4s ease ${i * 30}ms`,
                                        boxShadow: isComplete ? "0 0 8px rgba(139,92,246,0.3)" : "none",
                                        border: isComplete ? "none" : "1px solid rgba(255,255,255,0.04)",
                                    }} />
                                );
                            })}
                        </div>

                        <div style={{ marginTop: "auto" }}>
                            <div style={{
                                fontSize: 44, fontWeight: 800, letterSpacing: -1,
                                background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                marginBottom: 2,
                                filter: "drop-shadow(0 0 20px rgba(139,92,246,0.2))",
                            }}>
                                {stats?.examReadiness}%
                            </div>
                            <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>
                                Syllabus coverage
                            </p>
                        </div>
                    </div>

                    {/* Learning Streak */}
                    <div className="dashboard-card animate-slideInUp delay-200" style={{
                        padding: "28px", height: "280px",
                        overflow: "hidden", display: "flex", flexDirection: "column",
                        position: "relative",
                    }}>
                        {/* Background glow */}
                        <div style={{
                            position: "absolute", top: -40, right: -40,
                            width: 120, height: 120, borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)",
                            pointerEvents: "none",
                        }} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, position: "relative" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 18,
                                }}>🔥</div>
                                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFF" }}>Learning Streak</h3>
                            </div>
                        </div>

                        <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
                            <div style={{
                                fontSize: 64, fontWeight: 900, letterSpacing: -2,
                                background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                marginBottom: 4,
                                filter: "drop-shadow(0 0 20px rgba(245,158,11,0.2))",
                                lineHeight: 1,
                            }}>
                                {stats?.currentStreak || 0}
                            </div>
                            <p style={{ color: "#F59E0B", fontSize: 14, fontWeight: 600 }}>Day Streak</p>
                            <p style={{
                                color: "#6B7280", fontSize: 12, marginTop: 4,
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            }}>
                                <span style={{
                                    display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                                    background: "#10B981",
                                }} />
                                {stats?.avgHoursPerDay}h avg/day
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card animate-slideInUp delay-300" style={{
                        padding: "28px", minHeight: "280px",
                        display: "flex", flexDirection: "column",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18,
                            }}>🚀</div>
                            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFF" }}>Quick Actions</h3>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                            {quickActions.map((action, i) => (
                                <button
                                    key={action.label}
                                    onClick={() => router.push(action.path)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        padding: "12px 14px", borderRadius: 12,
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.04)",
                                        color: "#FFF", cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `${action.color}10`;
                                        e.currentTarget.style.borderColor = `${action.color}30`;
                                        e.currentTarget.style.transform = "translateX(6px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                                        e.currentTarget.style.transform = "none";
                                    }}
                                >
                                    <span style={{ fontSize: 20, minWidth: 28 }}>{action.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{action.label}</div>
                                        <div style={{ fontSize: 11, color: "#6B7280" }}>{action.desc}</div>
                                    </div>
                                    <span style={{ marginLeft: "auto", color: "#4B5563", fontSize: 14 }}>→</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Progress */}
                    <div className="dashboard-card animate-slideInUp delay-400" style={{
                        padding: "28px", height: "280px",
                        overflow: "hidden", display: "flex", flexDirection: "column",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18,
                            }}>📈</div>
                            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFF" }}>Weekly Progress</h3>
                        </div>

                        <div style={{
                            fontSize: 44, fontWeight: 800, letterSpacing: -1,
                            background: "linear-gradient(135deg, #EC4899, #8B5CF6)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            marginBottom: 4,
                        }}>
                            {stats?.weeklyProgress}%
                        </div>
                        <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
                            Completed this week
                        </p>

                        <div style={{ flex: 1, position: "relative" }}>
                            <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 280 60" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#EC4899" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="rgba(139,92,246,0.15)" />
                                        <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                                    </linearGradient>
                                </defs>
                                <path d="M 0 45 Q 50 35, 100 40 T 200 25 T 280 20 L 280 60 L 0 60 Z" fill="url(#areaGrad)" />
                                <path d="M 0 45 Q 50 35, 100 40 T 200 25 T 280 20" stroke="url(#lineGrad)" strokeWidth="2.5" fill="none"
                                    style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.4))" }} />
                                <circle cx="280" cy="20" r="4" fill="#8B5CF6" style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.8))" }} />
                            </svg>
                        </div>
                    </div>

                    {/* Insights Coming Soon */}
                    <div className="dashboard-card animate-slideInUp delay-500" style={{
                        padding: "28px", height: "280px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative", overflow: "hidden",
                    }}>
                        <div className="animate-orb" style={{
                            position: "absolute", top: "50%", left: "50%",
                            width: 200, height: 200, borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
                            transform: "translate(-50%, -50%)",
                            pointerEvents: "none",
                        }} />
                        <div style={{ textAlign: "center", position: "relative" }}>
                            <div className="animate-float" style={{ fontSize: 40, marginBottom: 12, opacity: 0.6 }}>📊</div>
                            <div style={{
                                fontSize: 14, fontWeight: 600,
                                background: "linear-gradient(135deg, #A78BFA, #8B5CF6)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                marginBottom: 4,
                            }}>More Insights</div>
                            <div style={{ fontSize: 12, color: "#4B5563" }}>Coming soon</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
