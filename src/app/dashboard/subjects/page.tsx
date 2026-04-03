"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";
import { useResponsive } from "@/hooks/useResponsive";

export default function SubjectsPage() {
    const { isMobile, isTablet } = useResponsive();
    const { data: subjects, isLoading } = trpc.content.getSubjects.useQuery();

    if (isLoading) {
        return (
            <div style={{
                minHeight: "100vh", background: "#030303",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 16,
            }}>
                <div className="animate-float" style={{ fontSize: 48 }}>📚</div>
                <div style={{
                    fontSize: 15, fontWeight: 600,
                    background: "linear-gradient(135deg, #33DFFF, #00D4FF)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>Loading subjects...</div>
                <div style={{ width: 160, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div className="animate-shimmer" style={{ width: "100%", height: "100%" }} />
                </div>
            </div>
        );
    }

    const subjectColors: Record<string, string> = {
        "Mathematics": "#3B82F6",
        "Physics": "#F59E0B",
        "Chemistry": "#10B981",
        "Biology": "#EC4899",
        "English": "#00D4FF",
        "Hindi": "#EF4444",
        "History": "#F97316",
        "Geography": "#06B6D4",
        "Computer Applications": "#6366F1",
    };

    return (
        <div style={{
            minHeight: "100vh", padding: isMobile ? "12px" : isTablet ? "20px" : "32px",
            background: "radial-gradient(ellipse at 30% 0%, rgba(139,92,246,0.04) 0%, transparent 50%), #030303",
            boxSizing: "border-box" as const, overflowX: "hidden" as const,
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <div className="animate-fadeIn" style={{ marginBottom: "40px" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)",
                        borderRadius: 20, padding: "6px 14px", fontSize: 11,
                        fontWeight: 600, color: "#33DFFF", letterSpacing: 1,
                        textTransform: "uppercase", marginBottom: 16,
                    }}>
                        📚 ICSE Class 10
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? "22px" : "32px", fontWeight: 800, marginBottom: "8px",
                        letterSpacing: -0.5,
                        background: "linear-gradient(135deg, #FFFFFF 0%, #33DFFF 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>
                        Your Subjects
                    </h1>
                    <p style={{ color: "#6B7280", fontSize: "14px" }}>
                        Browse topics, take notes, and master your ICSE syllabus
                    </p>
                </div>

                {/* Subjects Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: isMobile ? "12px" : "20px",
                }}>
                    {subjects?.map((subject, idx) => {
                        const color = subjectColors[subject.name] || "#00D4FF";
                        return (
                            <Link
                                key={subject.id}
                                href={`/dashboard/subjects/${subject.id}`}
                                style={{ textDecoration: "none", display: "block" }}
                            >
                                <div
                                    className={`dashboard-card animate-slideInUp delay-${(idx % 4) * 100 + 100}`}
                                    style={{
                                        padding: isMobile ? "18px" : "28px",
                                        cursor: "pointer",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Decorative glow */}
                                    <div style={{
                                        position: "absolute", top: -30, right: -30,
                                        width: 100, height: 100, borderRadius: "50%",
                                        background: `radial-gradient(circle, ${color}10, transparent 70%)`,
                                        pointerEvents: "none",
                                    }} />

                                    {/* Icon with background */}
                                    <div style={{
                                        width: 56, height: 56, borderRadius: 16,
                                        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                                        border: `1px solid ${color}20`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "28px", marginBottom: "18px",
                                        position: "relative",
                                    }}>
                                        {subject.icon || "📖"}
                                    </div>

                                    {/* Subject Name */}
                                    <h3 style={{
                                        fontSize: "17px", fontWeight: 700,
                                        color: "#FFFFFF", marginBottom: "8px",
                                        letterSpacing: -0.3,
                                    }}>
                                        {subject.name}
                                    </h3>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: "13px", color: "#6B7280",
                                        lineHeight: "1.5", flex: 1,
                                    }}>
                                        {subject.description || `Study ${subject.name} for ICSE exams`}
                                    </p>

                                    {/* Footer */}
                                    <div style={{
                                        marginTop: "18px", paddingTop: "16px",
                                        borderTop: "1px solid rgba(255,255,255,0.04)",
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                    }}>
                                        <span style={{
                                            fontSize: "12px", fontWeight: 600,
                                            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                        }}>
                                            View Chapters →
                                        </span>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8,
                                            background: `${color}10`, border: `1px solid ${color}20`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 12, color: color,
                                        }}>→</div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Empty State */}
                {subjects && subjects.length === 0 && (
                    <div className="dashboard-card animate-fadeIn" style={{
                        padding: "64px", textAlign: "center",
                    }}>
                        <div className="animate-float" style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
                        <h3 style={{
                            fontSize: "18px", fontWeight: 700,
                            background: "linear-gradient(135deg, #FFF, #33DFFF)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            marginBottom: "8px",
                        }}>
                            No Subjects Available
                        </h3>
                        <p style={{ color: "#6B7280", fontSize: "14px" }}>
                            Run the database seed script to add ICSE subjects
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
