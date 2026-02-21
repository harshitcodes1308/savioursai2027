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
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 50%), #030303" }}>
                {/* Header with Progress */}
                <div style={{ background: "linear-gradient(180deg, rgba(14,14,20,0.98), rgba(14,14,20,0.95))", padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📅</div>
                            <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #FFF, #34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -0.5 }}>
                                Your Study Timeline
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm("Create a new timeline? This will clear your current plan.")) {
                                    clearPlans.mutate();
                                }
                            }}
                            style={{
                                padding: "10px 20px",
                                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 4px 16px rgba(139,92,246,0.3)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            ➕ Create New Timeline
                        </button>
                    </div>

                    {/* Progress Meter */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>
                                {completedCount} / {totalPlans} chapters completed
                            </span>
                            <span style={{ fontSize: "14px", fontWeight: 700, background: "linear-gradient(135deg, #10B981, #34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {progressPercent}%
                            </span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.04)", borderRadius: "3px", overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${progressPercent}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #10B981, #34D399, #10B981)",
                                    backgroundSize: "200% 100%",
                                    transition: "width 0.8s ease",
                                    boxShadow: "0 0 12px rgba(16,185,129,0.3)",
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
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.04) 0%, transparent 50%), #030303", padding: "40px" }}>
            <div className="animate-fadeIn" style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "#A78BFA", letterSpacing: 1, textTransform: "uppercase" }}>🎯 AI-Powered</div>
                </div>
                <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "10px", textAlign: "center", letterSpacing: -0.5, background: "linear-gradient(135deg, #FFF, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Smart Study Planner
                </h1>
                <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "36px", textAlign: "center" }}>
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
                            width: "100%",
                            padding: "16px",
                            background: generatePlan.isPending ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "14px",
                            fontSize: "16px",
                            fontWeight: 700,
                            cursor: generatePlan.isPending ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 8px 24px rgba(139,92,246,0.3)",
                            letterSpacing: 0.3,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(139,92,246,0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(139,92,246,0.3)";
                        }}
                    >
                        {generatePlan.isPending ? "⚡ Generating..." : "🎯 Generate Full Plan →"}
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
        <div style={{ marginBottom: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", overflow: "hidden" }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "transparent",
                    color: "#FFFFFF",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {subject.icon} {subject.name} {selectedCount > 0 && <span style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA", padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{selectedCount}</span>}
                </span>
                <span style={{ fontSize: 14, color: "#6B7280", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none" }}>▶</span>
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
