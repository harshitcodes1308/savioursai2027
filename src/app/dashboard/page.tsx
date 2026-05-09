"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useMemo, useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import ShimmerText from "@/components/ui/shimmer-text";
import { MONTHLY_MISSION, getCurrentMonthIndex, getMonthTaskCounts } from "@/data/monthly-mission";

const MM_KEY = "saviours-monthly-mission-v2";
const MODE_KEY = "saviours-stats-mode";

function calcMMStats(checked: Record<string, boolean>) {
    const mi = getCurrentMonthIndex();
    const month = MONTHLY_MISSION[mi];

    // Current week: approximate by day-of-month (1-7→w1, 8-14→w2, etc.)
    const day = new Date().getDate();
    const weekIdx = Math.min(Math.floor((day - 1) / 7), month.weeks.length - 1);
    const curWeek = month.weeks[weekIdx];
    const wkTotal = curWeek.tasks.length + curWeek.addons.length;
    const wkDone = curWeek.tasks.filter(t => checked[`${mi}:${curWeek.id}:${t.id}`]).length
        + curWeek.addons.filter((_, i) => checked[`${mi}:${curWeek.id}:a${i}`]).length;
    const weekPct = wkTotal > 0 ? Math.round((wkDone / wkTotal) * 100) : 0;

    // Current month
    const { done: mDone, total: mTotal } = getMonthTaskCounts(mi, checked);
    const monthPct = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : 0;

    // Completed weeks across all months
    let completedWeeks = 0, totalWeeks = 0;
    MONTHLY_MISSION.forEach((m, idx) => {
        m.weeks.forEach(w => {
            totalWeeks++;
            const count = w.tasks.length + w.addons.length;
            if (count === 0) return;
            const done = w.tasks.filter(t => checked[`${idx}:${w.id}:${t.id}`]).length
                + w.addons.filter((_, i) => checked[`${idx}:${w.id}:a${i}`]).length;
            if (done === count) completedWeeks++;
        });
    });

    // All-time readiness
    let allDone = 0, allTotal = 0;
    MONTHLY_MISSION.forEach((_, idx) => {
        const { done, total } = getMonthTaskCounts(idx, checked);
        allDone += done; allTotal += total;
    });
    const readiness = allTotal > 0 ? Math.round((allDone / allTotal) * 100) : 0;

    return { weekPct, monthPct, completedWeeks, totalWeeks, readiness };
}

const PLAN_LABELS: Record<string, string> = {
    FREE: "Free",
    PRO: "Pro",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 5) return "Burning the midnight oil,";
    if (h < 12) return "Good morning,";
    if (h < 17) return "Good afternoon,";
    if (h < 21) return "Good evening,";
    return "Still going strong,";
}

function getMotivationalTagline(): string {
    const h = new Date().getHours();
    if (h < 5) return "The quiet hours build the loudest results.";
    if (h < 12) return "A fresh start, a new chapter of progress.";
    if (h < 17) return "Stay sharp. The afternoon push matters.";
    if (h < 21) return "Consistency is your quiet superpower.";
    return "Great things happen when the world sleeps.";
}

// Circular ring stat card
function RingStatCard({
    label, value, sub, percent, color, size = 52,
}: {
    label: string; value: string; sub: string; percent: number; color: string; size?: number;
}) {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * Math.min(Math.max(percent, 0), 100) / 100;

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 14,
        }}>
            <svg width={size} height={size} style={{ flexShrink: 0, transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={3.5} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3.5}
                    strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
                    style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }} />
            </svg>
            <div>
                <div style={{
                    fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "var(--text-muted)", marginBottom: 3, opacity: 0.6,
                }}>{label}</div>
                <div style={{
                    fontFamily: "var(--font-display)", fontSize: 26,
                    color: "var(--text-primary)", letterSpacing: "-0.03em",
                    lineHeight: 1,
                }}>{value}</div>
                <div style={{
                    fontFamily: "var(--font-body)", fontSize: 10,
                    color: "var(--text-muted)", marginTop: 2,
                }}>{sub}</div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const { isMobile, isTablet } = useResponsive();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [statsMode, setStatsModeState] = useState<"planner" | "mission">("planner");
    const [mmChecked, setMmChecked] = useState<Record<string, boolean>>({});

    // Load saved mode + MM data from localStorage after mount
    useEffect(() => {
        const saved = localStorage.getItem(MODE_KEY);
        if (saved === "mission" || saved === "planner") setStatsModeState(saved);
        try { setMmChecked(JSON.parse(localStorage.getItem(MM_KEY) || "{}")); }
        catch { /* ignore */ }
    }, []);

    const setStatsMode = (m: "planner" | "mission") => {
        setStatsModeState(m);
        localStorage.setItem(MODE_KEY, m);
        // Refresh MM data whenever user switches to mission mode
        if (m === "mission") {
            try { setMmChecked(JSON.parse(localStorage.getItem(MM_KEY) || "{}")); }
            catch { /* ignore */ }
        }
    };

    const { data: profile, isLoading: profileLoading } = trpc.dashboard.getProfile.useQuery(undefined, {
        refetchOnWindowFocus: true, refetchOnMount: true,
    });
    const { data: stats } = trpc.dashboard.getStudyStats.useQuery(undefined, {
        refetchInterval: 30000, refetchOnWindowFocus: true, refetchOnMount: true,
    });
    const logoutMutation = trpc.auth.logout.useMutation({
        onSuccess: () => router.push("/login"),
    });

    const todayDate = useMemo(() =>
        new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }), []
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
        const ms = tomorrow.getTime() - now.getTime();
        const t = setTimeout(() => window.location.reload(), ms);
        return () => clearTimeout(t);
    }, []);

    const featureCards = [
        { flag: "studyFlow" as const, label: "Study Flow", desc: "Watch → Revise → Practice", path: "/dashboard/study-flow", icon: "▶", tagline: "Your guided learning path" },
        { flag: "aiDoubtSolver" as const, label: "AI Doubt Solver", desc: "Ask anything, get instant answers", path: "/dashboard/ai-assistant", icon: "◈", tagline: "Your 24/7 academic companion" },
        { flag: "smartPlanner" as const, label: "Smart Planner", desc: "Your day, mapped intelligently", path: "/dashboard/planner", icon: "◎", tagline: "Because time waits for no one" },
        { flag: "competencyTest" as const, label: "Competency Test", desc: "PYQ-based timed practice", path: "/dashboard/precision-practice", icon: "◉", tagline: "Practice like it's the real thing" },
        { flag: "customiseTest" as const, label: "Customise Test", desc: "Build your own MCQ set", path: "/dashboard/tests", icon: "◈", tagline: "Your test, your rules" },
        { flag: "flipTheQuestion" as const, label: "Flip the Question", desc: "Reverse-engineer from answers", path: "/dashboard/flip-the-question", icon: "⇌", tagline: "See questions from the other side" },
        { flag: "focusMode" as const, label: "Focus Mode", desc: "Distraction-free deep work", path: "/dashboard/focus", icon: "◎", tagline: "Where deep work happens" },
        { flag: "todoList" as const, label: "Monthly Mission", desc: "12-month ICSE board prep checklist", path: "/dashboard/todo", icon: "○", tagline: "One month at a time" },
        { flag: "webinar" as const, label: "Live Webinar", desc: "Free sessions with Pranay Bhaiya", path: "/dashboard/webinar", icon: "◈", tagline: "Your questions, answered live." },
        { flag: "chronoScroll" as const, label: "ChronoScroll", desc: "Scroll through history, snap dates", path: "/dashboard/chronoscroll", icon: "◎", tagline: "Scroll. Snap. Remember." },
        { flag: "numericalMastery" as const, label: "Numerical Mastery", desc: "Physics formulas, solved examples & PYQs", path: "/dashboard/numerical-mastery", icon: "◈", tagline: "Every formula, every numerical, mastered." },
        { flag: "dateBattleArena" as const, label: "Date Battle Arena", desc: "Gamified history dates, 60-second battles", path: "/dashboard/date-battle", icon: "◉", tagline: "Speed meets memory in the arena." },
    ].filter(card => FEATURE_FLAGS[card.flag]);

    if (profileLoading || !stats) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-base)", flexDirection: "column", gap: 16,
            }}>
                <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: "2px solid var(--bg-border)", borderTopColor: "var(--accent-gold)",
                    animation: "spin360 0.7s linear infinite",
                }} />
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>
                    Loading your workspace...
                </div>
            </div>
        );
    }

    const rawPlanType = (profile as any)?.planType ?? "FREE";
    const profileIsPaid = !!(
        (profile as any)?.isPaid ||
        ((rawPlanType === "MONTHLY" || rawPlanType === "YEARLY") &&
            (profile as any)?.subscriptionStatus === "ACTIVE")
    );
    // If isPaid is true but planType is FREE (manual DB change), show "Pro"
    const planType = (profileIsPaid && rawPlanType === "FREE") ? "PRO" : rawPlanType;
    const paymentWarning = (profile as any)?.paymentWarning as "CANCELLED" | "EXPIRED" | null | undefined;

    const mmStats = calcMMStats(mmChecked);

    const ringStats = statsMode === "planner" ? [
        { label: "Today",     value: `${todayProgress}%`,           sub: "of daily goal",    percent: todayProgress,                                color: "var(--accent-gold)" },
        { label: "Streak",    value: `${stats?.currentStreak ?? 0}d`, sub: "days running",  percent: Math.min((stats?.currentStreak ?? 0) * 10, 100), color: "#22c55e" },
        { label: "This week", value: `${stats?.weeklyProgress ?? 0}%`, sub: "completed",    percent: stats?.weeklyProgress ?? 0,                     color: "#60a5fa" },
        { label: "Readiness", value: `${stats?.examReadiness ?? 0}%`,  sub: "syllabus covered", percent: stats?.examReadiness ?? 0,                  color: "#33DFFF" },
    ] : [
        { label: "This Week",   value: `${mmStats.weekPct}%`,        sub: "week tasks done",  percent: mmStats.weekPct,                                                         color: "var(--accent-gold)" },
        { label: "Weeks Done",  value: `${mmStats.completedWeeks}`,   sub: `of ${mmStats.totalWeeks} weeks`, percent: mmStats.totalWeeks > 0 ? Math.round((mmStats.completedWeeks / mmStats.totalWeeks) * 100) : 0, color: "#22c55e" },
        { label: "This Month",  value: `${mmStats.monthPct}%`,        sub: "month complete",   percent: mmStats.monthPct,                                                        color: "#60a5fa" },
        { label: "Readiness",   value: `${mmStats.readiness}%`,       sub: "syllabus done",    percent: mmStats.readiness,                                                       color: "#33DFFF" },
    ];

    return (
        <div
            onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
            style={{
                minHeight: "100vh", background: "var(--bg-base)",
                padding: isMobile ? "20px 16px 100px" : isTablet ? "32px 28px" : "44px 48px",
                boxSizing: "border-box", position: "relative", overflow: "hidden",
            }}
        >
            {/* Ambient gradient orb */}
            {!isMobile && (
                <div style={{
                    position: "fixed",
                    left: mousePos.x, top: mousePos.y,
                    width: 500, height: 500, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%)",
                    transform: "translate(-50%, -50%)",
                    transition: "left 1s ease-out, top 1s ease-out",
                    pointerEvents: "none", zIndex: 0,
                }} />
            )}

            <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

                {/* ── Payment Warning Banner ── */}
                {paymentWarning && (
                    <div style={{
                        background: paymentWarning === "EXPIRED"
                            ? "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))"
                            : "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))",
                        border: `1px solid ${paymentWarning === "EXPIRED" ? "rgba(239,68,68,0.35)" : "rgba(245,158,11,0.35)"}`,
                        borderRadius: 14,
                        padding: isMobile ? "14px 16px" : "16px 22px",
                        marginBottom: 20,
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "flex-start" : "center",
                        justifyContent: "space-between",
                        gap: 14,
                        animation: "slideInUp 0.4s ease-out both",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{
                                fontSize: 22,
                                color: paymentWarning === "EXPIRED" ? "#ef4444" : "#f59e0b",
                                lineHeight: 1,
                            }}>
                                ⚠
                            </div>
                            <div>
                                <div style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: isMobile ? 14 : 15,
                                    color: "var(--text-primary)",
                                    marginBottom: 3,
                                    letterSpacing: "-0.01em",
                                }}>
                                    {paymentWarning === "EXPIRED"
                                        ? "Your last payment didn't go through"
                                        : "Autopay was cancelled"}
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: 12,
                                    color: "var(--text-muted)",
                                    lineHeight: 1.5,
                                }}>
                                    {paymentWarning === "EXPIRED"
                                        ? "You've been moved to the Free plan. Re-enroll to restore full access to all features."
                                        : "You'll keep access until your current cycle ends, after which you'll be moved to Free. Re-enroll to keep your benefits."}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/pricing")}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#0A0A0F",
                                background: "var(--accent-gold)",
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 18px",
                                cursor: "pointer",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; }}
                            onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                        >
                            Re-enroll Now
                        </button>
                    </div>
                )}

                {/* ── Hero Section ── */}
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "flex-end",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 20 : 0,
                    marginBottom: isMobile ? 28 : 40,
                    animation: "pageEnter 0.4s ease-out both",
                }}>
                    <div>
                        <div style={{
                            fontFamily: "var(--font-body)", fontSize: 13,
                            color: "var(--text-muted)", marginBottom: 6, letterSpacing: "0.01em",
                        }}>
                            {getGreeting()}
                        </div>
                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: isMobile ? 36 : 54,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.03em", lineHeight: 1,
                            margin: "0 0 8px",
                        }}>
                            <ShimmerText
                                className=""
                                duration={2.5}
                                delay={2}
                            >
                                <span style={{ color: 'var(--accent-gold)' }}>{profile?.name}</span>
                            </ShimmerText>
                        </h1>
                        {/* Premium tagline in ScotchDisplay */}
                        <div style={{
                            fontFamily: "var(--font-tagline)",
                            fontSize: isMobile ? 14 : 16,
                            fontWeight: 400,
                            fontStyle: "italic",
                            color: "rgba(180, 175, 200, 0.9)",
                            marginBottom: 12,
                            textShadow: "0 0 20px rgba(0, 212, 255, 0.15)",
                        }}>
                            {getMotivationalTagline()}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <span style={{
                                fontFamily: "var(--font-body)", fontSize: 12,
                                color: "var(--text-muted)", opacity: 0.7,
                            }}>
                                {todayDate}
                            </span>
                            <span style={{
                                fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
                                color: "var(--accent-gold)",
                                background: "rgba(0,212,255,0.08)",
                                border: "1px solid rgba(0,212,255,0.18)",
                                borderRadius: 100, padding: "3px 10px",
                                letterSpacing: "0.1em", textTransform: "uppercase",
                            }}>
                                {PLAN_LABELS[planType] ?? "Free"}
                            </span>
                            {!profileIsPaid && (
                                <button
                                    onClick={() => router.push("/pricing")}
                                    style={{
                                        fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
                                        color: "#0A0A0F",
                                        background: "var(--accent-gold)",
                                        border: "1px solid var(--accent-gold)",
                                        borderRadius: 100, padding: "3px 12px",
                                        letterSpacing: "0.1em", textTransform: "uppercase",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        display: "inline-flex", alignItems: "center", gap: 5,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                                >
                                    ✦ Upgrade
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        style={{
                            fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
                            color: "var(--text-muted)", background: "transparent",
                            border: "1px solid var(--bg-border)", borderRadius: 8,
                            padding: "8px 18px", cursor: logoutMutation.isPending ? "not-allowed" : "pointer",
                            opacity: logoutMutation.isPending ? 0.5 : 1, transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                        {logoutMutation.isPending ? "Logging out..." : "Log out"}
                    </button>
                </div>

                {/* ── Stats Mode Selector ── */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginBottom: 10,
                    animation: "slideInUp 0.4s ease-out 80ms both",
                }}>
                    <span style={{
                        fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        color: "var(--text-muted)", opacity: 0.6,
                        flexShrink: 0,
                    }}>Stats from</span>
                    {(["planner", "mission"] as const).map(mode => {
                        const active = statsMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => setStatsMode(mode)}
                                style={{
                                    padding: "4px 14px", borderRadius: 100,
                                    border: active ? "1px solid var(--accent-gold)" : "1px solid var(--bg-border)",
                                    background: active ? "var(--accent-gold-glow)" : "transparent",
                                    color: active ? "var(--accent-gold)" : "var(--text-muted)",
                                    fontFamily: "var(--font-body)", fontSize: 11,
                                    fontWeight: active ? 700 : 400,
                                    cursor: "pointer",
                                    transition: "all 0.18s ease",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                {mode === "planner" ? "Smart Planner" : "Monthly Mission"}
                            </button>
                        );
                    })}
                </div>

                {/* ── Stats Strip ── */}
                <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 18,
                    padding: isMobile ? "18px 16px" : "24px 32px",
                    marginBottom: isMobile ? 28 : 40,
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                    gap: isMobile ? 18 : 24,
                    animation: "slideInUp 0.5s ease-out 100ms both",
                }}>
                    {ringStats.map((s, i) => (
                        <RingStatCard key={s.label} {...s} />
                    ))}
                </div>

                {/* ── Feature Cards ── */}
                <div>
                    <div style={{
                        display: "flex", alignItems: "baseline", justifyContent: "space-between",
                        marginBottom: 18,
                    }}>
                        <div style={{
                            fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
                            color: "var(--text-muted)", letterSpacing: "0.14em",
                            textTransform: "uppercase", opacity: 0.5,
                        }}>
                            Your Tools
                        </div>
                        <div style={{
                            fontFamily: "var(--font-tagline)",
                            fontSize: 12, fontWeight: 400, fontStyle: "italic",
                            color: "rgba(180, 175, 200, 0.7)",
                            textShadow: "0 0 12px rgba(0, 212, 255, 0.1)",
                        }}>
                            Everything you need, nothing you don't.
                        </div>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                        gap: isMobile ? 10 : 14,
                    }}>
                        {featureCards.map((card, i) => (
                            <div
                                key={card.path}
                                onClick={() => router.push(card.path)}
                                onMouseEnter={() => setHoveredCard(card.path)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    background: hoveredCard === card.path
                                        ? "linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))"
                                        : "var(--bg-surface)",
                                    border: `1px solid ${hoveredCard === card.path ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                                    borderRadius: 16,
                                    padding: isMobile ? "20px 18px" : "26px 26px",
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                                    animation: `slideInUp 0.5s ease-out ${200 + i * 60}ms both`,
                                    position: "relative",
                                    overflow: "hidden",
                                    transform: hoveredCard === card.path ? "translateY(-3px)" : "translateY(0)",
                                    boxShadow: hoveredCard === card.path
                                        ? "0 0 0 1px rgba(0,212,255,0.06), 0 20px 48px -8px rgba(0,0,0,0.45)"
                                        : "none",
                                }}
                            >
                                {/* Hover shimmer */}
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: hoveredCard === card.path
                                        ? "linear-gradient(135deg, rgba(0,212,255,0.05) 0%, transparent 50%)"
                                        : "transparent",
                                    transition: "background 0.3s ease",
                                    pointerEvents: "none",
                                }} />

                                <div style={{ position: "relative", zIndex: 1 }}>
                                    {/* Icon */}
                                    <div style={{
                                        fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 26,
                                        color: "var(--accent-gold)", marginBottom: 14, lineHeight: 1,
                                        opacity: hoveredCard === card.path ? 0.9 : 0.5,
                                        transition: "opacity 0.3s ease",
                                    }}>
                                        {card.icon}
                                    </div>

                                    {/* Title */}
                                    <div style={{
                                        fontFamily: "var(--font-display)", fontSize: isMobile ? 16 : 18,
                                        color: "var(--text-primary)", marginBottom: 5,
                                        letterSpacing: "-0.01em",
                                    }}>
                                        {card.label}
                                    </div>

                                    {/* Description */}
                                    <div style={{
                                        fontFamily: "var(--font-body)", fontSize: 13,
                                        color: "var(--text-muted)", lineHeight: 1.55,
                                        marginBottom: 10,
                                    }}>
                                        {card.desc}
                                    </div>

                                    <div style={{
                                        fontFamily: "var(--font-tagline)",
                                        fontSize: 11, fontWeight: 400, fontStyle: "italic",
                                        color: hoveredCard === card.path ? "var(--accent-gold)" : "rgba(180, 175, 200, 0.65)",
                                        opacity: hoveredCard === card.path ? 0.9 : 1,
                                        transition: "all 0.3s ease",
                                        marginBottom: 14,
                                        textShadow: hoveredCard === card.path ? "0 0 12px rgba(0, 212, 255, 0.2)" : "none",
                                    }}>
                                        {card.tagline}
                                    </div>

                                    {/* Arrow */}
                                    <div style={{
                                        fontFamily: "var(--font-body)", fontSize: 12,
                                        color: "var(--accent-gold)",
                                        letterSpacing: "0.02em",
                                        opacity: hoveredCard === card.path ? 1 : 0.5,
                                        transform: hoveredCard === card.path ? "translateX(4px)" : "translateX(0)",
                                        transition: "all 0.3s ease",
                                    }}>
                                        Open →
                                    </div>
                                </div>

                                {/* Bottom accent line on hover */}
                                <div style={{
                                    position: "absolute", bottom: 0, left: 0, right: 0,
                                    height: hoveredCard === card.path ? 2 : 0,
                                    background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
                                    transition: "height 0.3s ease",
                                }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Bottom Tagline ── */}
                <div style={{
                    textAlign: "center",
                    marginTop: isMobile ? 40 : 56,
                    paddingBottom: 20,
                }}>
                    <div style={{
                        fontFamily: "var(--font-tagline)",
                        fontSize: 13, fontWeight: 400, fontStyle: "italic",
                        color: "rgba(180, 175, 200, 0.45)",
                        textShadow: "0 0 16px rgba(0, 212, 255, 0.08)",
                    }}>
                        Saviours AI — Where preparation meets precision.
                    </div>
                </div>
            </div>
        </div>
    );
}
