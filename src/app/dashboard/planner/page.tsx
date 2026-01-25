"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { typography } from "@/lib/typography";
import { GenerationLoader } from "@/components/ui/GenerationLoader";

interface SelectedChapter {
    chapterId: string;
    chapterName: string;
    subjectId: string;
    subjectName: string;
}

export default function SmartPlannerPage() {
    const router = useRouter();
    const [selectedChapters, setSelectedChapters] = useState<SelectedChapter[]>([]);
    const [startDate, setStartDate] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [dailyHours, setDailyHours] = useState(2);

    const { data: subjects } = trpc.content.getSubjects.useQuery();
    const { data: plans, refetch: refetchPlans } = trpc.planner.getMyPlans.useQuery({});

    const generatePlan = trpc.planner.generateSmartPlan.useMutation();
    const toggleComplete = trpc.planner.togglePlanComplete.useMutation({
        onSuccess: () => refetchPlans(),
    });
    const clearPlans = trpc.planner.clearAllPlans.useMutation({
        onSuccess: () => {
            setSelectedChapters([]);
            setStartDate("");
            setTargetDate("");
            refetchPlans();
        },
    });

    const handleGeneratePlan = async () => {
        if (selectedChapters.length === 0 || !startDate || !targetDate) {
            alert("Please select chapters and dates");
            return;
        }

        const chaptersBySubject = selectedChapters.reduce((acc, ch) => {
            if (!acc[ch.subjectId]) acc[ch.subjectId] = [];
            acc[ch.subjectId].push(ch.chapterId);
            return acc;
        }, {} as Record<string, string[]>);

        let totalPlansCreated = 0;
        for (const [subjectId, chapterIds] of Object.entries(chaptersBySubject)) {
            try {
                const result = await generatePlan.mutateAsync({
                    subjectId,
                    chapterIds,
                    startDate,
                    targetDate,
                    dailyHours,
                });
                totalPlansCreated += result.plansCreated;
            } catch (error: any) {
                alert(`Error: ${error.message}`);
                return;
            }
        }

        refetchPlans();
    };

    const toggleChapter = (chapter: SelectedChapter) => {
        setSelectedChapters((prev) => {
            const exists = prev.find((c) => c.chapterId === chapter.chapterId);
            if (exists) {
                return prev.filter((c) => c.chapterId !== chapter.chapterId);
            } else {
                return [...prev, chapter];
            }
        });
    };

    const getDifficultyStars = (difficulty: number) => "⭐️".repeat(difficulty);

    // Calculate progress
    const completedCount = plans?.filter((p) => p.completed).length || 0;
    const totalPlans = plans?.length || 0;
    const progressPercent = totalPlans > 0 ? Math.round((completedCount / totalPlans) * 100) : 0;

    // Group plans by date
    const plansByDate = (plans || []).reduce((acc, plan: any) => {
        const dateKey = new Date(plan.planDate).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(plan);
        return acc;
    }, {} as Record<string, any[]>);

    // Show timeline if there are plans
    if (plans && plans.length > 0) {
        return (
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#030303" }}>
                {/* Header with Progress */}
                <div style={{ backgroundColor: "#0E0E10", padding: "24px 32px", borderBottom: "2px solid #1F1F22" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h1 style={{
                            ...typography.display,
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            margin: 0
                        }}>
                            📅 Your Study Timeline
                        </h1>
                        <button
                            onClick={() => {
                                if (confirm("Create a new timeline? This will clear your current plan.")) {
                                    clearPlans.mutate();
                                }
                            }}
                            style={{
                                ...typography.text,
                                padding: "12px 24px",
                                backgroundColor: "#8B5CF6",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            ➕ Create New Timeline
                        </button>
                    </div>

                    {/* Progress Meter */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ ...typography.text, fontSize: "14px", color: "#9CA3AF" }}>
                                {completedCount} / {totalPlans} chapters completed
                            </span>
                            <span style={{ ...typography.display, fontSize: "16px", fontWeight: 700, color: "#10B981" }}>
                                {progressPercent}%
                            </span>
                        </div>
                        <div style={{ height: "12px", backgroundColor: "#374151", borderRadius: "6px", overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${progressPercent}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
                                    transition: "width 0.5s ease",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Timeline Content */}
                <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>
                    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                        {Object.entries(plansByDate).map(([dateStr, dayPlans]) => (
                            <div key={dateStr} style={{ marginBottom: "40px" }}>
                                <h3 style={{
                                    ...typography.display,
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    color: "#FFFFFF",
                                    marginBottom: "16px"
                                }}>
                                    {new Date(dateStr).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </h3>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                                    {dayPlans.map((plan: any) => (
                                        <div
                                            key={plan.id}
                                            className="dashboard-card"
                                            style={{
                                                padding: "20px",
                                                border: plan.completed ? "3px solid #10B981" : undefined,
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                                <div style={{ flex: 1 }}>
                                                    {/* TOPIC NAME - not chapter repetition */}
                                                    <div style={{
                                                        ...typography.display,
                                                        fontSize: "16px",
                                                        fontWeight: 700,
                                                        color: "#FFFFFF",
                                                        marginBottom: "6px"
                                                    }}>
                                                        {plan.topicName || plan.chapter?.name}
                                                    </div>
                                                    <div style={{ ...typography.text, fontSize: "13px", color: "#9CA3AF", marginBottom: "8px" }}>
                                                        {plan.subject?.icon} {plan.subject?.name || "Subject"}
                                                    </div>
                                                    <div style={{ ...typography.text, fontSize: "13px", color: "#8B5CF6", fontWeight: 600 }}>
                                                        {getDifficultyStars(plan.difficulty || 3)} Difficulty
                                                    </div>
                                                </div>
                                                {/* CHECKBOX - updates state, NO navigation */}
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
                                                    style={{ width: "24px", height: "24px", accentColor: "#10B981", cursor: "pointer" }}
                                                />
                                            </div>

                                            {/* OPTIONAL AI Review Button - user-initiated, not forced */}
                                            <button
                                                onClick={() => router.push(`/dashboard/ai-assistant?topic=${encodeURIComponent(plan.topicName || plan.chapter?.name)}&subject=${plan.subject?.name}`)}
                                                style={{
                                                    ...typography.text,
                                                    width: "100%",
                                                    padding: "10px 16px",
                                                    backgroundColor: "#374151",
                                                    borderRadius: "8px",
                                                    fontSize: "13px",
                                                    color: "#8B5CF6",
                                                    textAlign: "center",
                                                    fontWeight: 600,
                                                    border: "1px solid #4B5563",
                                                    cursor: "pointer",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#4B5563";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#374151";
                                                }}
                                            >
                                                🤖 Review with AI Assistant
                                            </button>
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

    // Show plan creation form
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#030303", padding: "40px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                <h1 style={{
                    ...typography.display,
                    fontSize: "36px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    marginBottom: "12px",
                    textAlign: "center"
                }}>
                    🎯 AI-Powered Study Planner
                </h1>
                <p style={{
                    ...typography.text,
                    color: "#9CA3AF",
                    fontSize: "16px",
                    marginBottom: "40px",
                    textAlign: "center"
                }}>
                    Select subjects and chapters, AI will create a smart timeline with difficulty prediction
                </p>

                <div className="dashboard-card" style={{ padding: "32px" }}>
                    {/* Subjects and Chapters */}
                    <div style={{ marginBottom: "28px" }}>
                        <label style={{
                            ...typography.display,
                            display: "block",
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            marginBottom: "16px"
                        }}>
                            Select Subjects & Chapters ({selectedChapters.length} chapters selected)
                        </label>

                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {subjects?.map((subject) => (
                                <SubjectChapterSelector
                                    key={subject.id}
                                    subject={subject}
                                    selectedChapters={selectedChapters}
                                    onToggleChapter={toggleChapter}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Date Inputs */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                        <div>
                            <label style={{ ...typography.display, display: "block", fontSize: "14px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                    ...typography.text,
                                    width: "100%",
                                    padding: "14px",
                                    backgroundColor: "#1F2937",
                                    color: "#FFFFFF",
                                    border: "2px solid #374151",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ ...typography.display, display: "block", fontSize: "14px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                                Target Date
                            </label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                style={{
                                    ...typography.text,
                                    width: "100%",
                                    padding: "14px",
                                    backgroundColor: "#1F2937",
                                    color: "#FFFFFF",
                                    border: "2px solid #374151",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                }}
                            />
                        </div>
                    </div>

                    {/* Daily Hours Slider */}
                    <div style={{ marginBottom: "32px" }}>
                        <label style={{ ...typography.display, display: "block", fontSize: "14px", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px" }}>
                            Daily Study Hours: <span style={{ color: "#8B5CF6" }}>{dailyHours}h</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="8"
                            value={dailyHours}
                            onChange={(e) => setDailyHours(parseInt(e.target.value))}
                            style={{ width: "100%", height: "8px", accentColor: "#8B5CF6" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
                            <span>1h</span>
                            <span>8h</span>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGeneratePlan}
                        disabled={generatePlan.isPending}
                        style={{
                            ...typography.text,
                            width: "100%",
                            padding: "18px",
                            backgroundColor: "#8B5CF6",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "18px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(139, 92, 246, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {generatePlan.isPending ? "Generating..." : "🎯 Generate Full Plan"}
                    </button>
                </div>
            </div>
            
            <GenerationLoader 
                isVisible={generatePlan.isPending} 
                label="Building Your Plan..." 
                subLabel="Optimizing timeline based on difficulty..." 
            />
        </div>
    );
}

// Subject Chapter Selector Component
function SubjectChapterSelector({
    subject,
    selectedChapters,
    onToggleChapter,
}: {
    subject: any;
    selectedChapters: SelectedChapter[];
    onToggleChapter: (chapter: SelectedChapter) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: chapters } = trpc.content.getChaptersBySubject.useQuery(
        { subjectId: subject.id },
        { enabled: isExpanded }
    );

    const selectedCount = selectedChapters.filter((c) => c.subjectId === subject.id).length;

    return (
        <div style={{ marginBottom: "12px", backgroundColor: "#1F2937", borderRadius: "12px", overflow: "hidden" }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: "100%",
                    padding: "16px 20px",
                    backgroundColor: "#1F2937",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span>
                    {subject.icon} {subject.name} {selectedCount > 0 && `(${selectedCount})`}
                </span>
                <span style={{ fontSize: "18px" }}>{isExpanded ? "▼" : "▶"}</span>
            </button>

            {isExpanded && (
                <div style={{ padding: "16px", maxHeight: "200px", overflowY: "auto", backgroundColor: "#111827" }}>
                    {chapters?.map((chapter) => {
                        const isSelected = selectedChapters.some((c) => c.chapterId === chapter.id);
                        return (
                            <label
                                key={chapter.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "10px",
                                    cursor: "pointer",
                                    borderRadius: "8px",
                                    marginBottom: "6px",
                                    backgroundColor: isSelected ? "#374151" : "transparent",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                        onToggleChapter({
                                            chapterId: chapter.id,
                                            chapterName: chapter.name,
                                            subjectId: subject.id,
                                            subjectName: subject.name,
                                        })
                                    }
                                    style={{ marginRight: "12px", width: "18px", height: "18px" }}
                                />
                                <span style={{ fontSize: "14px", color: "#FFFFFF" }}>
                                    Ch {chapter.order}: {chapter.name}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
