"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

const menuSections = [
  {
    title: "Primary",
    items: [
      { icon: "📊", label: "Dashboard", href: "/dashboard", accent: "#8B5CF6" },
      { icon: "📚", label: "Subjects", href: "/dashboard/subjects", accent: "#3B82F6" },
      { icon: "📅", label: "Planner", href: "/dashboard/planner", accent: "#10B981" },
      { icon: "🤖", label: "AI Assistant", href: "/dashboard/ai-assistant", accent: "#F59E0B" },
    ]
  },
  {
    title: "Practice & Test",
    items: [
      { icon: "📝", label: "Customise Test", href: "/dashboard/tests", accent: "#EC4899" },
      { icon: "⚡", label: "Competency Test", href: "/dashboard/precision-practice", accent: "#F97316" },
      { icon: "🧮", label: "Numerical Mastery", href: "/dashboard/numerical-mastery", accent: "#3B82F6" },
      { icon: "📄", label: "Guess Papers", href: "/dashboard/guess-papers", accent: "#6366F1" },
      { icon: "🎯", label: "Customise Strategy", href: "/dashboard/strategy", accent: "#EF4444" },
    ]
  },
  {
    title: "History",
    items: [
      { icon: "⏳", label: "ChronoScroll", href: "/dashboard/chronoscroll", accent: "#0EA5E9" },
      { icon: "⚔️", label: "Date Battle Arena", href: "/dashboard/date-battle", accent: "#D946EF" },
    ]
  },
  {
    title: "Library",
    items: [
      { icon: "📖", label: "Notes", href: "/dashboard/notes", accent: "#14B8A6" },
      { icon: "🧘", label: "Focus Mode", href: "/dashboard/focus", accent: "#06B6D4" },
    ]
  },
  {
    title: "Account",
    items: [
      { icon: "👤", label: "Profile", href: "/dashboard/profile", accent: "#A78BFA" },
      { icon: "📜", label: "Policies", href: "/dashboard/policies", accent: "#6B7280" },
    ]
  }
];

export default function DashboardSidebar({
  userName,
  userEmail,
}: {
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* HAMBURGER */}
      <button
        className="mobile-only"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 200,
          width: 46,
          height: 46,
          background: isOpen
            ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
            : "rgba(14,14,16,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#FFF",
          fontSize: 22,
          boxShadow: isOpen
            ? "0 8px 32px rgba(139,92,246,0.4)"
            : "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.3s ease",
        }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* OVERLAY */}
      <div
        className={isOpen ? "mobile-only" : ""}
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 140,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
          display: isOpen ? "block" : "none",
        }}
      />

      {/* SIDEBAR */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          background: "linear-gradient(180deg, #08080D 0%, #0B0B12 40%, #0E0E16 100%)",
          borderRight: "1px solid rgba(139,92,246,0.06)",
          display: "flex",
          flexDirection: "column",
          zIndex: 150,
          boxShadow: isOpen ? "10px 0 40px rgba(0,0,0,0.6)" : "none",
          overflow: "hidden",
        }}
        className={`sidebar-transition ${!isMobile || isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Ambient glow orbs */}
        <div style={{
          position: "absolute", top: -80, left: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -100, right: -80,
          width: 250, height: 250, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.04), transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{
          padding: "22px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
          flexShrink: 0,
          position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 46, height: 46,
              position: "relative", flexShrink: 0,
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.06))",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(139,92,246,0.12)",
              overflow: "hidden",
              boxShadow: "0 0 20px rgba(139,92,246,0.08)",
            }}>
              <Image src="/logo.png" alt="Logo" width={46} height={46} style={{ objectFit: "contain" }} />
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 800, letterSpacing: -0.3,
                background: "linear-gradient(135deg, #FFFFFF 20%, #C4B5FD 50%, #818CF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                ICSE Saviours
              </div>
              <div style={{
                fontSize: 9, fontWeight: 600,
                letterSpacing: 2, textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{
                  background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Student OS</span>
                <span style={{
                  background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                  padding: "1px 6px",
                  borderRadius: 4,
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#FFF",
                  letterSpacing: 0.5,
                }}>v1.2</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div style={{
          padding: "14px 16px",
          margin: "8px 12px",
          borderRadius: 14,
          background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.03))",
          border: "1px solid rgba(139,92,246,0.08)",
          display: "flex", alignItems: "center", gap: 12,
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle shimmer overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(110deg, transparent 30%, rgba(139,92,246,0.04) 50%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            width: 38, height: 38, minWidth: 38,
            borderRadius: 11,
            background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "#FFF",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
            position: "relative",
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <div style={{
              fontSize: 13, fontWeight: 650, color: "#F3F4F6",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              letterSpacing: -0.1,
            }}>
              {userName || "User"}
            </div>
            <div style={{
              fontSize: 10, color: "#6B7280", fontWeight: 500,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {userEmail || "user@example.com"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "linear-gradient(135deg, #10B981, #34D399)",
              boxShadow: "0 0 8px rgba(16,185,129,0.5), 0 0 3px rgba(16,185,129,0.8)",
            }} />
            <span style={{ fontSize: 9, color: "#10B981", fontWeight: 600, letterSpacing: 0.3 }}>Live</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: "0 10px 20px", flex: 1, overflowY: "auto" }}>
          {menuSections.map((section, sIdx) => (
            <div key={section.title} style={{ marginBottom: sIdx === menuSections.length - 1 ? 0 : 16 }}>
              {/* Section Header */}
              <div style={{
                padding: "8px 12px 6px",
                fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                textTransform: "uppercase", color: "#4B5563",
              }}>
                {section.title}
              </div>
              
              {/* Items in section */}
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredItem === item.href;
                const activeColor = item.accent;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      width: "100%",
                      padding: "10px 12px",
                      marginBottom: 1,
                      borderRadius: 12,
                      position: "relative",
                      overflow: "hidden",
                      background: isActive
                        ? `linear-gradient(135deg, ${activeColor}14, ${activeColor}08)`
                        : isHovered
                        ? "rgba(255,255,255,0.02)"
                        : "transparent",
                      color: isActive ? activeColor : isHovered ? "#E5E7EB" : "#9CA3AF",
                      border: isActive
                        ? `1px solid ${activeColor}25`
                        : "1px solid transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 13,
                      fontWeight: isActive ? 650 : 500,
                      letterSpacing: isActive ? 0.1 : 0,
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isHovered && !isActive ? "translateX(4px)" : "none",
                    }}
                  >
                {/* Active indicator bar — colored per item */}
                {isActive && (
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: "15%",
                    bottom: "15%",
                    width: 3,
                    borderRadius: 2,
                    background: `linear-gradient(180deg, ${activeColor}, ${activeColor}AA)`,
                    boxShadow: `0 0 10px ${activeColor}60`,
                  }} />
                )}
                {/* Active background glow */}
                {isActive && (
                  <div style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0,
                    width: 80,
                    background: `linear-gradient(90deg, ${activeColor}10, transparent)`,
                    pointerEvents: "none",
                  }} />
                )}
                <div style={{
                  width: 30, height: 30, minWidth: 30,
                  borderRadius: 9,
                  background: isActive
                    ? `linear-gradient(135deg, ${activeColor}18, ${activeColor}08)`
                    : isHovered
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                  border: isActive ? `1px solid ${activeColor}20` : "1px solid transparent",
                  filter: isActive ? "none" : "grayscale(0.2)",
                  transition: "all 0.25s ease",
                }}>
                  {item.icon}
                </div>
                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                {isActive && (
                  <div style={{
                    position: "absolute",
                    right: 12,
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    <div style={{
                      width: 5, height: 5,
                      borderRadius: "50%",
                      background: activeColor,
                      boxShadow: `0 0 8px ${activeColor}80`,
                    }} />
                  </div>
                )}
              </button>
            );
          })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "14px 16px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          textAlign: "center",
          flexShrink: 0,
          position: "relative",
        }}>
          <div style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 0.8,
            background: "linear-gradient(135deg, #4B5563, #6B7280)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            © 2026 ICSE Saviours • Made with 💜
          </div>
        </div>
      </aside>
    </>
  );
}
