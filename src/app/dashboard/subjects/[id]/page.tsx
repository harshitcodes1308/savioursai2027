"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function SubjectChaptersPage() {
    const params = useParams();
    const subjectId = params.id as string;

    const { data: chapters, isLoading } = trpc.content.getChaptersBySubject.useQuery({
        subjectId,
    });

    if (isLoading) {
        return (
            <div style={{ padding: "24px" }}>
                <div style={{ color: "#9CA3AF" }}>Loading chapters...</div>
            </div>
        );
    }

    // Get subject name from the first chapter if available, otherwise show "Subject"
    const subjectName = chapters && chapters.length > 0 ? chapters[0].subject.name : "Subject";

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: "24px", fontSize: "13px" }}>
                <Link href="/dashboard/subjects" style={{ color: "#9CA3AF", textDecoration: "none" }}>
                    Subjects
                </Link>
                <span style={{ color: "#6B7280", margin: "0 8px" }}>/</span>
                <span style={{ color: "#FFFFFF" }}>{subjectName}</span>
            </div>

            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#FFFFFF", marginBottom: "8px" }}>
                    {subjectName} - Chapters
                </h1>
                <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
                    Select a chapter to view topics and start learning
                </p>
            </div>

            {/* Chapters List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {chapters?.map((chapter) => (
                    <div
                        key={chapter.id}
                        style={{
                            backgroundColor: "#0E0E10",
                            borderRadius: "12px",
                            padding: "20px 24px",
                            border: "2px solid #374151",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#FFFFFF",
                                marginBottom: "8px"
                            }}>
                                Chapter {chapter.order}: {chapter.name}
                            </h3>
                            {chapter.description && (
                                <p style={{
                                    fontSize: "13px",
                                    color: "#9CA3AF",
                                    marginBottom: "8px"
                                }}>
                                    {chapter.description}
                                </p>
                            )}
                            <div style={{
                                display: "inline-block",
                                backgroundColor: "#1F2937",
                                padding: "4px 12px",
                                borderRadius: "16px",
                                fontSize: "12px",
                                color: "#00D4FF",
                                fontWeight: "600"
                            }}>
                                📝 Notes coming soon
                            </div>
                        </div>

                        <div style={{
                            fontSize: "32px",
                            opacity: 0.3
                        }}>
                            📚
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {chapters && chapters.length === 0 && (
                <div style={{
                    backgroundColor: "#0E0E10",
                    borderRadius: "16px",
                    padding: "64px",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>📖</div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#FFFFFF", marginBottom: "8px" }}>
                        No Chapters Available
                    </h3>
                    <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
                        Chapters for this subject will be added soon
                    </p>
                </div>
            )}
        </div>
    );
}
