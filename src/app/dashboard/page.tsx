"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useMemo } from "react";
import { typography } from "@/lib/typography";
import { LazyCard } from "@/components/ui/LazyCard";

export default function DashboardPage() {
    const router = useRouter();

    // Auto-refetch every 30 seconds + on window focus (Fix #1)
    const { data: profile, isLoading: profileLoading } = trpc.dashboard.getProfile.useQuery(undefined, {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const { data: stats } = trpc.dashboard.getStudyStats.useQuery(undefined, {
        refetchInterval: 30000, // 30 seconds
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

    // Memoized values (Fix #3 - Performance)
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

    // Auto-refresh at midnight (Fix #5 - Date-Aware)
    useEffect(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilMidnight = tomorrow.getTime() - now.getTime();

        const timer = setTimeout(() => {
            window.location.reload();
        }, msUntilMidnight);

        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    // Loading skeleton (Fix #3 - Prevent layout shift)
    if (profileLoading || !stats) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1A1D24"
            }}>
                <div style={{ color: "#FFFFFF", fontSize: "18px" }}>Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#030303",
            padding: "24px",
            transition: "all 0.2s ease-in-out"
        }}>
            {/* Header with User Info + Date */}
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{
                        ...typography.display,
                        fontSize: "32px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginBottom: "8px"
                    }}>
                        Welcome back, {profile?.name}! 👋
                    </h1>
                    <p style={{
                        ...typography.text,
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#A78BFA" /* Lavender Highlight */
                    }}>
                        {todayDate} • {profile?.role === "STUDENT" ? "Let's make today productive" : "Manage your classes"}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-primary/50"
                    style={{
                        backgroundColor: "#0E0E10",
                        color: "#FFFFFF",
                        padding: "12px 24px",
                        borderRadius: "12px",
                        border: "1px solid #1F1F22",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: logoutMutation.isPending ? "not-allowed" : "pointer",
                        opacity: logoutMutation.isPending ? 0.5 : 1,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
            </div>

            <div style={{ maxWidth: "1400px", margin: "0 auto", overflow: "visible" }}>
                {/* 3×2 Grid - 5 cards */}
                <div className="dashboard-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                    overflow: "visible"
                }}>

                    {/* Row 1, Col 1: Today's Study Plan - Now Dark Graphite with Purple Accent */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        height: "260px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxSizing: "border-box",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        position: "relative"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", maxWidth: "100%", position: "relative", zIndex: 1 }}>
                            <h3 style={{
                                ...typography.display,
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#FFFFFF",
                                maxWidth: "70%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>Today's Study Plan</h3>
                            <button
                                onClick={() => router.push('/dashboard/planner')}
                                style={{
                                    color: "#A78BFA",
                                    fontSize: "14px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    flexShrink: 0
                                }}
                            >
                                View All
                            </button>
                        </div>

                        {/* Circular Progress */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                            <div style={{ position: "relative", width: "112px", height: "112px" }}>
                                <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                                    <circle cx="56" cy="56" r="50" stroke="#1F1F22" strokeWidth="10" fill="none" />
                                    <circle cx="56" cy="56" r="50" stroke="#8B5CF6" strokeWidth="10" fill="none"
                                        strokeDasharray="314" strokeDashoffset={314 - (314 * todayProgress / 100)} strokeLinecap="round"
                                        style={{ filter: "drop-shadow(0 0 4px rgba(139, 92, 246, 0.5))" }} />
                                </svg>
                                <div style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    right: "0",
                                    bottom: "0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    maxWidth: "100%",
                                    overflow: "hidden"
                                }}>
                                    <span style={{
                                        ...typography.display,
                                        fontSize: "32px",
                                        fontWeight: 700,
                                        color: "#FFFFFF",
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                        textAlign: "center"
                                    }}>
                                        {todayProgress}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 1, Col 2: Exam Readiness */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        height: "260px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        wordBreak: "break-word"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", maxWidth: "100%" }}>
                            <h3 style={{
                                ...typography.display,
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#FFFFFF",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>Exam Readiness</h3>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 1fr)",
                            gridTemplateRows: "repeat(4, 1fr)",
                            gap: "6px",
                            height: "128px",
                            marginBottom: "16px"
                        }}>
                            {Array.from({ length: 24 }).map((_, i) => {
                                const isComplete = i < Math.floor(24 * ((stats?.examReadiness || 0) / 100));
                                return (
                                    <div key={i} style={{
                                        backgroundColor: isComplete ? "#8B5CF6" : "#1F1F22",
                                        border: isComplete ? "none" : "1px solid #2D2D30",
                                        borderRadius: "4px",
                                        transition: "all 0.3s ease-in-out",
                                        boxShadow: isComplete ? "0 0 8px rgba(139, 92, 246, 0.4)" : "none"
                                    }}></div>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: "auto", maxWidth: "100%", overflow: "hidden" }}>
                            <div style={{
                                ...typography.display,
                                fontSize: "40px",
                                fontWeight: 700,
                                color: "#8B5CF6",
                                marginBottom: "4px",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textAlign: "left",
                                textShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
                            }}>
                                {stats?.examReadiness}%
                            </div>
                            <p style={{
                                ...typography.text,
                                color: "#9CA3AF",
                                fontSize: "13px",
                                fontWeight: 400,
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>Syllabus coverage</p>
                        </div>
                    </div>

                    {/* Row 1, Col 3: Learning Streak */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        height: "260px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxSizing: "border-box",
                        wordBreak: "break-word"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                            <h3 style={{
                                ...typography.display,
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#FFFFFF"
                            }}>Learning Streak</h3>
                            <span style={{ fontSize: "20px", filter: "drop-shadow(0 0 10px rgba(255, 100, 0, 0.3))" }}>🔥</span>
                        </div>

                        <div style={{ textAlign: "center", marginTop: "auto" }}>
                            <div style={{
                                ...typography.display,
                                fontSize: "48px",
                                fontWeight: 700,
                                color: "#FFFFFF",
                                marginBottom: "4px",
                                textShadow: "0 0 20px rgba(255, 255, 255, 0.1)"
                            }}>
                                {stats?.currentStreak || 0}
                            </div>
                            <p style={{
                                ...typography.text,
                                color: "#A78BFA",
                                fontSize: "14px",
                                fontWeight: 400
                            }}>Day Streak</p>
                            <p style={{
                                ...typography.text,
                                color: "#9CA3AF",
                                fontSize: "12px",
                                marginTop: "4px",
                                fontWeight: 400
                            }}>{stats?.avgHoursPerDay}h avg/day</p>
                        </div>
                    </div>

                    {/* Row 2, Col 1: Empty State */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        height: "260px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <div style={{ textAlign: "center", color: "#9CA3AF" }}>
                            <div style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.5 }}>📊</div>
                            <div style={{ fontSize: "14px" }}>More insights coming soon</div>
                        </div>
                    </div>

                    {/* Row 2, Col 2: Weekly Progress */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        height: "260px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxSizing: "border-box",
                        wordBreak: "break-word"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "18px", color: "#8B5CF6" }}>📈</span>
                                <h3 style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "14px" }}>Weekly Progress</h3>
                            </div>
                        </div>

                        <div style={{
                            ...typography.display,
                            fontSize: "40px",
                            fontWeight: 700,
                            color: "#8B5CF6",
                            marginBottom: "4px",
                            textShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
                        }}>
                            {stats?.weeklyProgress}%
                        </div>
                        <p style={{
                            ...typography.text,
                            color: "#9CA3AF",
                            fontSize: "13px",
                            fontWeight: 400
                        }}>Completed this week</p>

                        <div style={{ height: "80px", position: "relative" }}>
                            <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 280 60" preserveAspectRatio="none">
                                <path d="M 0 45 Q 50 35, 100 40 T 200 25 T 280 20" stroke="#8B5CF6" strokeWidth="2" fill="none" style={{ filter: "drop-shadow(0 0 4px rgba(139, 92, 246, 0.5))" }} />
                                <circle cx="270" cy="20" r="3" fill="#8B5CF6" style={{ filter: "drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))" }} />
                            </svg>
                        </div>
                    </div>

                    {/* Row 2, Col 3: Quick Actions */}
                    <div className="dashboard-card" style={{
                        padding: "24px",
                        height: "260px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}>
                        <h3 style={{
                            ...typography.display,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            marginBottom: "8px"
                        }}>Quick Actions</h3>

                        {['Planner', 'Subjects', 'AI Assistant'].map((action, i) => {
                            const paths = ['/dashboard/planner', '/dashboard/subjects', '/dashboard/ai-assistant'];
                            const icons = ['📅', '📚', '🤖'];
                            return (
                                <button
                                    key={action}
                                    onClick={() => router.push(paths[i])}
                                    className="bg-[#1A1D24] hover:bg-[#2D2D30] hover:translate-x-1"
                                    style={{
                                        color: "#FFFFFF",
                                        padding: "16px",
                                        borderRadius: "12px",
                                        border: "none",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                        textAlign: "left"
                                    }}
                                >
                                    {icons[i]} {action}
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}
