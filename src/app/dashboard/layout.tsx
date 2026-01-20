"use client";

import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { trpc } from "@/lib/trpc/client";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: profile } = trpc.dashboard.getProfile.useQuery();

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#030303" }}>
            <DashboardSidebar
                userName={profile?.name}
                userEmail={profile?.email}
            />

            {/* Header - Fixed, positioned after sidebar */}
            <div style={{
                position: "fixed",
                top: 0,
                left: "240px",
                right: 0,
                height: "64px",
                backgroundColor: "#0E0E10",
                borderBottom: "1px solid #1F1F22",
                zIndex: 40
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    padding: "0 32px"
                }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#FFFFFF" }}>Statistics</h2>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Search something..."
                                style={{
                                    width: "256px",
                                    padding: "8px 16px 8px 40px",
                                    borderRadius: "8px",
                                    backgroundColor: "#1A1A1D",
                                    border: "1px solid #333",
                                    color: "#FFFFFF",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            />
                            <span style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9CA3AF",
                                fontSize: "14px"
                            }}>
                                🔍
                            </span>
                        </div>

                        {/* Upgrade Button */}
                        <button style={{
                            padding: "8px 20px",
                            borderRadius: "8px",
                            backgroundColor: "#8B5CF6",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 0 10px rgba(139, 92, 246, 0.3)"
                        }}>
                            Upgrade
                        </button>

                        {/* Notifications */}
                        <button style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            backgroundColor: "#1A1A1D",
                            border: "1px solid #333",
                            color: "#9CA3AF",
                            fontSize: "16px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            🔔
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Offset from sidebar and header */}
            <main style={{
                marginLeft: "240px",
                paddingTop: "64px",
                padding: "32px",
                minHeight: "100vh"
            }}>
                {children}
            </main>
        </div>
    );
}
