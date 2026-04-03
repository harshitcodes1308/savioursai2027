"use client";

import { useRouter } from "next/navigation";
import { typography } from "@/lib/typography";
import { POLICIES } from "@/lib/policies";

export default function PoliciesPage() {
    const router = useRouter();

    return (
        <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto", color: "#FFF" }}>
            <h1 style={{ ...typography.display, fontSize: "32px", marginBottom: "16px" }}>
                Legal & Policies
            </h1>
            <p style={{ ...typography.text, color: "#9CA3AF", marginBottom: "32px" }}>
                Review our terms, policies, and guidelines below.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {POLICIES.map((policy) => (
                    <div
                        key={policy.slug}
                        onClick={() => router.push(`/dashboard/policies/${policy.slug}`)}
                        className="dashboard-card"
                        style={{
                            padding: "24px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            border: "1px solid #1F1F22",
                            backgroundColor: "#0E0E10"
                        }}
                    >
                        <h2 style={{ ...typography.display, fontSize: "18px", marginBottom: "8px", color: "#F3F4F6" }}>
                            {policy.title}
                        </h2>
                        <span style={{ fontSize: "14px", color: "#00D4FF", fontWeight: "600" }}>Read Policy →</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
