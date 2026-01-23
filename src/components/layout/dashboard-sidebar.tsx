"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { typography } from "@/lib/typography";
import { useTheme } from "@/components/providers/theme-provider";

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
    const pathname = usePathname(); // Track current page
    const { theme, toggleTheme } = useTheme(); // Theme management
    const initials = userName
        ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    // Theme colors
    const colors = {
        sidebarBg: theme === 'dark' ? '#0E0E10' : '#FFFFFF',
        border: theme === 'dark' ? '#1F1F22' : '#E5E7EB',
        text: theme === 'dark' ? '#FFFFFF' : '#111827',
        textMuted: theme === 'dark' ? '#9CA3AF' : '#6B7280',
        hoverBg: theme === 'dark' ? '#1A1A1D' : '#F3F4F6',
        activeBg: theme === 'dark' ? '#8B5CF6' : '#8B5CF6',
    };

    return (
        <aside style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "240px",
            height: "100vh",
            backgroundColor: colors.sidebarBg,
            borderRight: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            overflow: "hidden"
        }}>

            {/* Logo */}
            <div style={{
                padding: "24px",
                borderBottom: `1px solid ${colors.border}`
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "#8B5CF6", /* Purple */
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 0 10px rgba(139, 92, 246, 0.4)"
                    }}>
                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF" }}>✨</span>
                    </div>
                    <span style={{
                        ...typography.display,
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
                        ICSE Saviours
                    </span>
                </div>
            </div>

            {/* User Profile */}
            <div style={{
                padding: "24px",
                borderBottom: "1px solid #1F1F22"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                }}>
                    <div style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        backgroundColor: "#1F1F22",
                        marginBottom: "12px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #333"
                    }}>
                        <span style={{
                            ...typography.display,
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#E5E7EB"
                        }}>{initials}</span>
                    </div>
                    <div style={{
                        ...typography.text,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%"
                    }}>
                        {userName || 'User'}
                    </div>
                    {userEmail && (
                        <div style={{
                            ...typography.text,
                            fontSize: "11px",
                            fontWeight: 400,
                            color: "#9CA3AF",
                            marginBottom: "8px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%"
                        }}>
                            {userEmail}
                        </div>
                    )}
                    <button className="hover:text-primary hover:border-primary/50" style={{
                        ...typography.text,
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#9CA3AF",
                        backgroundColor: "#1F1F22",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}>
                        Edit
                    </button>
                </div>
            </div>

            {/* Navigation - WITH ACTIVE STATE & PREFETCHING */}
            <nav style={{ padding: "16px", flex: 1, overflow: "auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={true} // Next.js standard prefetch
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    backgroundColor: isActive ? "rgba(139, 92, 246, 0.15)" : "transparent",
                                    color: isActive ? "#8B5CF6" : "#9CA3AF",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease-in-out",
                                    overflow: "hidden",
                                    border: isActive ? "1px solid rgba(139, 92, 246, 0.2)" : "1px solid transparent"
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

            {/* Theme Toggle - REMOVED per user request */}
            <div style={{
                padding: "24px",
                borderTop: "1px solid #1F1F22"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 8px",
                    marginBottom: "8px"
                }}>
                    <span style={{
                        ...typography.text,
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#9CA3AF"
                    }}>v1.0.0 Alpha</span>
                </div>
            </div>
        </aside>
    );
}
