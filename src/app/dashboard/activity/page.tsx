"use client";

import { trpc } from "@/lib/trpc/client";
import { format } from "date-fns";
import { typography } from "@/lib/typography";
import { useResponsive } from "@/hooks/useResponsive";

export default function ActivityPage() {
    const { isMobile } = useResponsive();
    const { data: plans, isLoading } = trpc.planner.getMyPlans.useQuery({});

    // Group activities by recent dates
    const activityByDate = (plans || []).reduce((acc, plan: any) => {
        const dateKey = new Date(plan.planDate).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(plan);
        return acc;
    }, {} as Record<string, any[]>);

    const sortedDates = Object.keys(activityByDate).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    ).slice(0, 30); // Last 30 days

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#030303", padding: isMobile ? "12px" : "24px", boxSizing: "border-box" as const, overflowX: "hidden" as const }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#FFFFFF", marginBottom: "8px" }}>
                    📈 Study Activity
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: "16px", marginBottom: "32px" }}>
                    Track your daily study progress and completed topics
                </p>

                {sortedDates.length === 0 ? (
                    <div style={{
                        backgroundColor: "#0E0E10",
                        borderRadius: "12px",
                        padding: "48px",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
                        <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#FFFFFF", marginBottom: "8px" }}>
                            No Activity Yet
                        </h3>
                        <p style={{ color: "#9CA3AF" }}>
                            Create a study plan to start tracking your activity
                        </p>
                    </div>
                ) : (
                    <div>
                        {sortedDates.map(dateStr => {
                            const dayPlans = activityByDate[dateStr];
                            const completed = dayPlans.filter(p => p.completed).length;
                            const total = dayPlans.length;
                            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                            return (
                                <div key={dateStr} className="dashboard-card" style={{
                                    padding: "24px",
                                    marginBottom: "16px",
                                    border: percentage === 100 ? "2px solid #10B981" : undefined
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                        <div>
                                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF" }}>
                                                {new Date(dateStr).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    month: "long",
                                                    day: "numeric"
                                                })}
                                            </h3>
                                            <p style={{ fontSize: "14px", color: "#9CA3AF", marginTop: "4px" }}>
                                                {completed} / {total} topics completed
                                            </p>
                                        </div>
                                        <div style={{
                                            fontSize: "24px",
                                            fontWeight: "700",
                                            color: percentage === 100 ? "#10B981" : "#8B5CF6"
                                        }}>
                                            {percentage}%
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
                                        {dayPlans.map((plan: any) => (
                                            <div key={plan.id} style={{
                                                backgroundColor: "#1A1A1D",
                                                borderRadius: "8px",
                                                padding: "12px",
                                                borderLeft: plan.completed ? "4px solid #10B981" : "4px solid #6B7280"
                                            }}>
                                                <div style={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    color: plan.completed ? "#10B981" : "#9CA3AF",
                                                    marginBottom: "4px"
                                                }}>
                                                    {plan.completed ? "✅" : "⏳"} {plan.topicName || plan.chapter?.name}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                                    {plan.subject?.icon} {plan.subject?.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
