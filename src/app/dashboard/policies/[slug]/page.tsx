"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { typography } from "@/lib/typography";
import { POLICIES } from "@/lib/policies";
import { ChevronLeft } from "lucide-react";

export default function PolicyViewerPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const policy = POLICIES.find((p) => p.slug === slug);

    if (!policy) {
        return (
            <div style={{ padding: "32px", textAlign: "center", color: "#FFF" }}>
                <h2>Policy not found</h2>
                <button onClick={() => router.back()} style={{ color: "#00D4FF", marginTop: "16px", background: "none", border: "none", cursor: "pointer" }}>Go Back</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "32px", maxWidth: "800px", margin: "0 auto", color: "#FFF" }}>
            <button
                onClick={() => router.back()}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    color: "#9CA3AF",
                    cursor: "pointer",
                    marginBottom: "24px",
                    fontWeight: 500
                }}
            >
                <ChevronLeft size={20} />
                Back to Policies
            </button>

            <div className="dashboard-card" style={{ padding: "32px", backgroundColor: "#0E0E10", border: "1px solid #1F1F22" }}>
                <h1 style={{ ...typography.display, fontSize: "28px", marginBottom: "24px", borderBottom: "1px solid #333", paddingBottom: "16px" }}>
                    {policy.title}
                </h1>
                
                <div style={{ 
                    ...typography.text, 
                    fontSize: "16px", 
                    lineHeight: "1.8", 
                    color: "#D1D5DB", 
                    whiteSpace: "pre-wrap" // Preserves formatting from the raw text
                }}>
                    {policy.content}
                </div>
            </div>
        </div>
    );
}
