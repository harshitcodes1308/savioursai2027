"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

const menuItems = [
    { icon: "📊", label: "Dashboard", href: "/dashboard" },
    { icon: "📚", label: "Subjects", href: "/dashboard/subjects" },
    { icon: "📅", label: "Planner", href: "/dashboard/planner" },
    { icon: "🤖", label: "AI Assistant", href: "/dashboard/ai-assistant" },
    { icon: "📝", label: "Customise Test", href: "/dashboard/tests" },
    { icon: "🎯", label: "Customise Strategy", href: "/dashboard/strategy" },
    { icon: "🧘", label: "Focus Mode", href: "/dashboard/focus" },
    { icon: "🚀", label: "10-Day Sprint", href: "/dashboard/sprint" },
    { icon: "📄", label: "TYQ", href: "/dashboard/tyq" },
    { icon: "📖", label: "Notes", href: "/dashboard/notes" },
    { icon: "👤", label: "Profile", href: "/dashboard/profile" },
    { icon: "📜", label: "Policies", href: "/dashboard/policies" },
];

export default function DashboardSidebar({ userName, userEmail }: { userName?: string; userEmail?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile(); // Check for mobile state
    
    // We can rely on CSS for mobile detection for the hamburger visibility
    // to avoid hydration mismatch, but we still need state for the drawer itself.
    
    const initials = userName
        ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const handleNavigation = (href: string) => {
        setIsOpen(false); // Close sidebar on nav
        router.push(href);
    };

    return (
        <>
            {/* HAMBURGER - Visible ONLY on Mobile via CSS class 'mobile-only' */}
            <button
                className="mobile-only"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    top: 16,
                    left: 16,
                    zIndex: 200,
                    width: 44,
                    height: 44,
                    backgroundColor: isOpen ? "#8B5CF6" : "#1A1A1D",
                    border: "1px solid #333",
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: isOpen ? "#FFF" : "#8B5CF6",
                    fontSize: 24,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                    // display property is handled by globals.css classes: mobile-only / desktop-only
                }}
            >
                {isOpen ? "✕" : "☰"}
            </button>

            {/* OVERLAY - Visible only when open on mobile */}
            <div
                className={isOpen ? "mobile-only" : ""}
                onClick={() => setIsOpen(false)}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(4px)",
                    zIndex: 140,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                    transition: "opacity 0.3s ease",
                    display: isOpen ? "block" : "none" // Force hide when closed to prevent interactions
                }}
            />

            {/* SIDEBAR CONTAINER */}
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "280px",
                    height: "100vh",
                    backgroundColor: "#0E0E10",
                    borderRight: "1px solid #1F1F22",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 150,
                    // REMOVED inline transform to prevent conflicts. Relies purely on CSS.
                    boxShadow: isOpen ? "10px 0 30px rgba(0,0,0,0.5)" : "none",
                }}
                // LOGIC FIX: On desktop (!isMobile), ALWAYS show sidebar (translate-x-0).
                // On mobile, rely on isOpen state.
                className={`sidebar-transition ${!isMobile || isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo Section */}
                <div style={{ padding: "24px 20px", borderBottom: "1px solid #1F1F22", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 60,
                            height: 60,
                            position: "relative",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                             <Image 
                                src="/logo.png" 
                                alt="Logo" 
                                width={60} 
                                height={60} 
                                style={{ objectFit: "contain" }}
                             />
                        </div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>
                                ICSE Saviours
                            </div>
                            <div style={{ fontSize: 11, color: "#666" }}>v1.0.0 Alpha</div>
                        </div>
                    </div>
                </div>

                {/* User Profile Section - FIXED */}
                <div style={{ 
                    padding: 20, 
                    borderBottom: "1px solid #1F1F22", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12,
                    flexShrink: 0,
                    backgroundColor: '#0E0E10' 
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        minWidth: 40, 
                        maxWidth: 40,
                        borderRadius: "50%",
                        backgroundColor: "#8B5CF6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#FFF",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}>
                        {/* We use a div background or img if available, here just text */}
                        <span style={{ transform: 'translateY(1px)' }}>{initials}</span>
                    </div>
                    <div style={{ 
                        flex: 1, 
                        overflow: "hidden", 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center' 
                    }}>
                        <div style={{ 
                            fontSize: 14, 
                            fontWeight: 600, 
                            color: "#FFF", 
                            whiteSpace: "nowrap", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis" 
                        }}>
                            {userName || "User"}
                        </div>
                        <div style={{ 
                            fontSize: 12, 
                            color: "#9CA3AF", 
                            whiteSpace: "nowrap", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis" 
                        }}>
                            {userEmail || "user@example.com"}
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav style={{ padding: 12, flex: 1, overflowY: 'auto' }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => handleNavigation(item.href)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    width: "100%",
                                    padding: "12px 16px",
                                    marginBottom: 4,
                                    borderRadius: 12,
                                    backgroundColor: isActive ? "rgba(139,92,246,0.15)" : "transparent",
                                    color: isActive ? "#8B5CF6" : "#9CA3AF",
                                    border: isActive ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 500,
                                    transition: "all 0.2s"
                                }}
                            >
                                <span style={{ fontSize: 20, minWidth: 24, textAlign: 'center' }}>{item.icon}</span>
                                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: 16, borderTop: "1px solid #1F1F22", textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: "#555" }}>© 2026 ICSE Saviours</div>
                </div>
            </aside>
            
            {/* Styles moved to globals.css for reliability */}
        </>
    );
}
