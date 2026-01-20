"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { typography } from "@/lib/typography";

export default function SubjectsPage() {
    const { data: subjects, isLoading } = trpc.content.getSubjects.useQuery();

    if (isLoading) {
        return (
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ ...typography.text, color: "#9CA3AF", textAlign: "center", padding: "64px" }}>
                    Loading subjects...
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{
                    ...typography.display,
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    marginBottom: "8px"
                }}>
                    📚 ICSE Subjects
                </h1>
                <p style={{
                    ...typography.text,
                    color: "#9CA3AF",
                    fontSize: "14px"
                }}>
                    Browse topics, take notes, and master your ICSE syllabus
                </p>
            </div>

            {/* Subjects Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px"
            }}>
                {subjects?.map((subject) => (
                    <Link
                        key={subject.id}
                        href={`/dashboard/subjects/${subject.id}`}
                        style={{
                            textDecoration: "none",
                            display: "block"
                        }}
                    >
                        <div
                            className="dashboard-card"
                            style={{
                                padding: "24px",
                                cursor: "pointer",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                fontSize: "48px",
                                marginBottom: "16px"
                            }}>
                                {subject.icon || "📖"}
                            </div>

                            {/* Subject Name */}
                            <h3 style={{
                                ...typography.display,
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "#FFFFFF",
                                marginBottom: "8px"
                            }}>
                                {subject.name}
                            </h3>

                            {/* Description */}
                            <p style={{
                                ...typography.text,
                                fontSize: "13px",
                                color: "#9CA3AF",
                                lineHeight: "1.5",
                                flex: 1
                            }}>
                                {subject.description || `Study ${subject.name} for ICSE exams`}
                            </p>

                            {/* Footer */}
                            <div style={{
                                marginTop: "16px",
                                paddingTop: "16px",
                                borderTop: "1px solid #374151",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                                <span style={{
                                    ...typography.text,
                                    fontSize: "12px",
                                    color: "#8B5CF6",
                                    fontWeight: 600
                                }}>
                                    View Chapters →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {subjects && subjects.length === 0 && (
                <div className="dashboard-card" style={{
                    padding: "64px",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>📚</div>
                    <h3 style={{
                        ...typography.display,
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        marginBottom: "8px"
                    }}>
                        No Subjects Available
                    </h3>
                    <p style={{
                        ...typography.text,
                        color: "#9CA3AF",
                        fontSize: "14px"
                    }}>
                        Run the database seed script to add ICSE subjects
                    </p>
                </div>
            )}
        </div>
    );
}
