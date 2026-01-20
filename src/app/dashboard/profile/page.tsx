"use client";

import { useState } from "react";
import { typography } from "@/lib/typography";

export default function ProfilePage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
            {/* Header */}
            <div>
                <h1 style={{
                    ...typography.display,
                    fontSize: "30px", // text-3xl approx
                    fontWeight: 700,
                    color: "#FFFFFF",
                    marginBottom: "4px"
                }}>
                    My Profile
                </h1>
                <p style={{
                    ...typography.text,
                    color: "#9CA3AF",
                    fontSize: "16px"
                }}>
                    Manage your account and study preferences
                </p>
            </div>

            {/* Profile Card */}
            <div className="dashboard-card" style={{
                padding: "24px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    {/* Avatar */}
                    <div style={{
                        width: "96px",
                        height: "96px",
                        borderRadius: "50%",
                        backgroundColor: "#8B5CF6", // primary
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                    }}>
                        <span style={{
                            ...typography.display,
                            fontSize: "36px",
                            fontWeight: 700,
                            color: "#FFFFFF" // text-white
                        }}>JD</span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            ...typography.display,
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#FFFFFF"
                        }}>John Doe</h2>
                        <p style={{
                            ...typography.text,
                            color: "#9CA3AF",
                            marginBottom: "16px"
                        }}>student@example.com</p>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <div style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(59, 130, 246, 0.2)",
                                border: "1px solid rgba(59, 130, 246, 0.3)"
                            }}>
                                <span style={{ ...typography.text, fontSize: "14px", fontWeight: 500, color: "#93C5FD" }}>
                                    🎓 Student
                                </span>
                            </div>
                            <div style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(34, 197, 94, 0.2)",
                                border: "1px solid rgba(34, 197, 94, 0.3)"
                            }}>
                                <span style={{ ...typography.text, fontSize: "14px", fontWeight: 500, color: "#86EFAC" }}>
                                    Class 10 ICSE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <button style={{
                        ...typography.text,
                        padding: "8px 24px",
                        borderRadius: "8px",
                        backgroundColor: "#374151",
                        border: "1px solid #4B5563",
                        color: "#FFFFFF",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}>
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Study Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                {[
                    { icon: "🔥", label: "Study Streak", value: "7 days", sub: "+2 from last week", subColor: "#4ADE80" },
                    { icon: "📚", label: "Active Subjects", value: "5", sub: "Mathematics, Science...", subColor: "#9CA3AF" },
                    { icon: "⏱️", label: "Total Study Hours", value: "42h", sub: "This month", subColor: "#60A5FA" }
                ].map((stat, i) => (
                    <div key={i} className="dashboard-card" style={{
                        padding: "24px"
                    }}>
                        <div style={{ fontSize: "30px", marginBottom: "8px" }}>{stat.icon}</div>
                        <p style={{ ...typography.text, color: "#9CA3AF", fontSize: "14px", marginBottom: "8px" }}>{stat.label}</p>
                        <p style={{ ...typography.display, fontSize: "36px", fontWeight: 700, color: "#FFFFFF" }}>{stat.value}</p>
                        <p style={{ ...typography.text, color: stat.subColor, fontSize: "14px", marginTop: "8px" }}>{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Preferences */}
            <div className="dashboard-card" style={{
                padding: "24px"
            }}>
                <h3 style={{
                    ...typography.display,
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    marginBottom: "24px"
                }}>
                    Study Preferences
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                        <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#D1D5DB", marginBottom: "8px" }}>
                            Daily Study Goal (hours)
                        </label>
                        <input
                            type="number"
                            defaultValue={3}
                            min={1}
                            max={12}
                            style={{
                                ...typography.text,
                                width: "100%",
                                maxWidth: "320px",
                                borderRadius: "8px",
                                border: "1px solid #374151",
                                backgroundColor: "#111827",
                                padding: "10px 16px",
                                color: "#FFFFFF"
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#D1D5DB", marginBottom: "8px" }}>
                            Target Exam Date
                        </label>
                        <input
                            type="date"
                            defaultValue="2026-03-01"
                            style={{
                                ...typography.text,
                                width: "100%",
                                maxWidth: "320px",
                                borderRadius: "8px",
                                border: "1px solid #374151",
                                backgroundColor: "#111827",
                                padding: "10px 16px",
                                color: "#FFFFFF"
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ ...typography.text, display: "block", fontSize: "14px", fontWeight: 500, color: "#D1D5DB", marginBottom: "8px" }}>
                            Preferred Study Time
                        </label>
                        <select style={{
                            ...typography.text,
                            width: "100%",
                            maxWidth: "320px",
                            borderRadius: "8px",
                            border: "1px solid #374151",
                            backgroundColor: "#111827",
                            padding: "10px 16px",
                            color: "#FFFFFF"
                        }}>
                            <option>Morning (6 AM - 12 PM)</option>
                            <option>Afternoon (12 PM - 5 PM)</option>
                            <option>Evening (5 PM - 9 PM)</option>
                            <option>Night (9 PM - 12 AM)</option>
                        </select>
                    </div>
                </div>
                <button style={{
                    ...typography.text,
                    marginTop: "24px",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    backgroundColor: "#8B5CF6",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 0 10px rgba(139, 92, 246, 0.3)"
                }}>
                    Save Changes
                </button>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-card" style={{
                padding: "24px"
            }}>
                <h3 style={{
                    ...typography.display,
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    marginBottom: "16px"
                }}>
                    Recent Activity
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                        { action: "Completed", item: "Quadratic Equations test", time: "2 hours ago", icon: "✅" },
                        { action: "Created", item: "Physics notes on Motion", time: "5 hours ago", icon: "📝" },
                        { action: "Studied", item: "Chemistry - Acids & Bases", time: "1 day ago", icon: "📚" },
                    ].map((activity, i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            padding: "12px",
                            borderRadius: "8px",
                            backgroundColor: "#111827",
                            border: "1px solid #374151"
                        }}>
                            <span style={{ fontSize: "24px" }}>{activity.icon}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ ...typography.text, color: "#FFFFFF" }}>
                                    <span style={{ color: "#9CA3AF" }}>{activity.action}</span> {activity.item}
                                </p>
                                <p style={{ ...typography.text, color: "#6B7280", fontSize: "14px" }}>{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
