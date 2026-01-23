"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { typography } from "@/lib/typography";

const menuItems = [
    { icon: "📊", label: "Dashboard", href: "/dashboard" },
    { icon: "📚", label: "Subjects", href: "/dashboard/subjects" },
    { icon: "📅", label: "Planner", href: "/dashboard/planner" },
    { icon: "🤖", label: "AI Assistant", href: "/dashboard/ai-assistant" },
    { icon: "📝", label: "Customise Test", href: "/dashboard/tests" },
    { icon: "🎯", label: "Customise Strategy", href: "/dashboard/strategy" },
    { icon: "🧘", label: "Focus Mode", href: "/dashboard/focus" },
    { icon: "📖", label: "Notes", href: "/dashboard/notes" },
    { icon: "👤", label: "Profile", href: "/dashboard/profile" },
];

export default function DashboardSidebar({ userName, userEmail }: { userName?: string; userEmail?: string }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const initials = userName
        ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <>
            {/* Hamburger Button - Mobile Only */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mobile-visible"
                style={{
                    position: "fixed",
                    top: "16px",
                    left: "16px",
                    zIndex: 100,
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#0E0E10",
                    border: "1px solid #1F1F22",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#FFF",
                }}
            >
                {isMobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 60,
                    }}
                    className="mobile-visible"
                />
            )}

            {/* Sidebar */}
            <aside style={{
                position: "fixed",
                left: isMobileMenuOpen ? 0 : "-100%",
                top: 0,
                width: "280px",
                maxWidth: "85vw",
                height: "100vh",
                backgroundColor: "#0E0E10",
                borderRight: "1px solid #1F1F22",
                display: "flex",
                flexDirection: "column",
                zIndex: 70,
                overflow: "hidden",
                transition: "left 0.3s ease-in-out",
            }}
            className="mobile-menu-sidebar">
                {/* Logo/Brand */}
                <div style={{ padding: "24px 20px", borderBottom: "1px solid #1F1F22" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            backgroundColor: "#8B5CF6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                        }}>
                            ✨
                        </div>
                        <div>
                            <div style={{ ...typography.display, fontSize: "16px", fontWeight: 700, color: "#FFF" }}>
                                ICSE Saviours
                            </div>
                            <div style={{ ...typography.text, fontSize: "11px", color: "#666", marginTop: "2px" }}>
                                v1.0.0 Alpha
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div style={{
                    padding: "20px",
                    borderBottom: "1px solid #1F1F22",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#8B5CF6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...typography.display,
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#FFF"
                    }}>
                        {initials}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ ...typography.text, fontSize: "14px", fontWeight: 600, color: "#FFF", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {userName || "User"}
                        </div>
                        <div style={{ ...typography.text, fontSize: "12px", color: "#9CA3AF", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {userEmail || "student@example.com"}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ padding: "16px", flex: 1, overflow: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    prefetch={true}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "14px 16px",
                                        borderRadius: "8px",
                                        backgroundColor: isActive ? "rgba(139, 92, 246, 0.15)" : "transparent",
                                        color: isActive ? "#8B5CF6" : "#9CA3AF",
                                        textDecoration: "none",
                                        transition: "all 0.2s ease-in-out",
                                        overflow: "hidden",
                                        border: isActive ? "1px solid rgba(139, 92, 246, 0.2)" : "1px solid transparent",
                                        minHeight: "48px",
                                    }}
                                >
                                    <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                                    <span style={{
                                        ...typography.text,
                                        fontSize: "14px",
                                        fontWeight: isActive ? 600 : 500,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div style={{ padding: "16px", borderTop: "1px solid #1F1F22" }}>
                    <div style={{ ...typography.text, fontSize: "11px", color: "#666", textAlign: "center" }}>
                        © 2026 ICSE Saviours
                    </div>
                </div>
            </aside>

            {/* Desktop Sidebar Styles */}
            <style jsx>{`
                @media (min-width: 768px) {
                    .mobile-menu-sidebar {
                        left: 0 !important;
                        width: 240px !important;
                    }
                }
            `}</style>
        </>
    );
}
