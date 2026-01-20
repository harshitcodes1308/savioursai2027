"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useState, useEffect } from "react";

export default function TimelineViewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const chapterId = searchParams.get("chapter");

    const { data: plans, refetch } = trpc.planner.getMyPlans.useQuery({});
    const toggleComplete = trpc.planner.togglePlanComplete.useMutation({
        onSuccess: () => refetch(),
    });

    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    useEffect(() => {
        if (chapterId && plans) {
            const plan = plans.find((p) => p.chapterId === chapterId);
            if (plan) setSelectedPlan(plan);
        }
    }, [chapterId, plans]);

    if (!plans || plans.length === 0) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <h2 style={{ color: "#FFFFFF", marginBottom: "16px" }}>No Study Plan Yet</h2>
                <button
                    onClick={() => router.push("/dashboard/planner")}
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#8B5CF6",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                >
                    Create Study Plan
                </button>
            </div>
        );
    }

    const completedCount = plans.filter((p) => p.completed).length;
    const progressPercent = Math.round((completedCount / plans.length) * 100);

    const getDifficultyStars = (difficulty: number) => "⭐️".repeat(difficulty);

    // Group plans by date
    const plansByDate = plans.reduce((acc, plan) => {
        const dateKey = new Date(plan.planDate).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(plan);
        return acc;
    }, {} as Record<string, typeof plans>);

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#030303" }}>
            {/* Progress Header */}
            <div style={{ backgroundColor: "#0E0E10", padding: "20px 32px", borderBottom: "2px solid #1F1F22" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>
                        📅 Your Study Timeline
                    </h1>
                    <button
                        onClick={() => router.push("/dashboard/planner")}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#374151",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        ← Back to Planner
                    </button>
                </div>

                {/* Progress Meter */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#9CA3AF" }}>
                            {completedCount} / {plans.length} chapters completed
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#10B981" }}>
                            {progressPercent}%
                        </span>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "#374151", borderRadius: "4px", overflow: "hidden" }}>
                        <div
                            style={{
                                width: `${progressPercent}%`,
                                height: "100%",
                                backgroundColor: "#10B981",
                                transition: "width 0.3s",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {Object.entries(plansByDate).map(([dateStr, dayPlans]) => (
                        <div key={dateStr} style={{ marginBottom: "32px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#9CA3AF", marginBottom: "16px" }}>
                                {new Date(dateStr).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </h3>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                                {dayPlans.map((plan: any) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            router.push(`/dashboard/ai-assistant?video=${encodeURIComponent(plan.videoUrl || "")}&chapter=${plan.chapterId}`);
                                        }}
                                        style={{
                                            backgroundColor: "#0E0E10",
                                            borderRadius: "12px",
                                            padding: "16px",
                                            border: plan.completed ? "2px solid #10B981" : "2px solid #1F1F22",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "15px", fontWeight: "600", color: "#FFFFFF", marginBottom: "4px" }}>
                                                    {plan.chapter?.name || "Chapter"}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "6px" }}>
                                                    {plan.subject?.icon} {plan.subject?.name || "Subject"}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#8B5CF6" }}>
                                                    {getDifficultyStars(plan.difficulty || 3)}
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={plan.completed}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    toggleComplete.mutate({
                                                        planId: plan.id,
                                                        completed: !plan.completed,
                                                    });
                                                }}
                                                style={{ width: "20px", height: "20px", accentColor: "#10B981" }}
                                            />
                                        </div>

                                        {plan.videoThumbnail && (
                                            <img
                                                src={plan.videoThumbnail}
                                                alt="Video thumbnail"
                                                style={{
                                                    width: "100%",
                                                    height: "120px",
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                    marginTop: "12px",
                                                }}
                                            />
                                        )}

                                        <div
                                            style={{
                                                marginTop: "12px",
                                                padding: "8px 12px",
                                                backgroundColor: "#1A1A1D",
                                                borderRadius: "6px",
                                                fontSize: "12px",
                                                color: "#9CA3AF",
                                                textAlign: "center",
                                            }}
                                        >
                                            🤖 Click to study with AI Assistant
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
