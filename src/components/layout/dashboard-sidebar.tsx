"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { isLockedRoute, getFeatureInfo } from "@/lib/tier-config";
import { UpgradePrompt } from "@/components/UpgradePrompt";

const ROUTE_FLAG_MAP: Partial<Record<string, keyof typeof FEATURE_FLAGS>> = {
  "/dashboard/ai-assistant": "aiDoubtSolver",
  "/dashboard/planner": "smartPlanner",
  "/dashboard/tests": "customiseTest",
  "/dashboard/precision-practice": "competencyTest",
  "/dashboard/flip-the-question": "flipTheQuestion",
  "/dashboard/focus": "focusMode",
  "/dashboard/numerical-mastery": "numericalMastery",
  "/dashboard/guess-papers": "guessPapers",
  "/dashboard/strategy": "strategyAI",
  "/dashboard/last-night-before": "lastNightBefore",
  "/dashboard/chronoscroll": "chronoScroll",
  "/dashboard/date-battle": "dateBattleArena",
  "/dashboard/notes": "notesFlashcards",
};

function isVisible(href: string): boolean {
  const flag = ROUTE_FLAG_MAP[href];
  if (!flag) return true;
  return FEATURE_FLAGS[flag] === true;
}

const DiamondLogo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5"/>
    <path d="M24 4L44 18L24 32L4 18L24 4Z" fill="var(--accent-gold-glow)"/>
    <path d="M4 18L24 32L44 18" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5"/>
  </svg>
);

const NAV_GROUPS = [
  {
    label: "HOME",
    items: [
      { icon: "⊞", label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "STUDY",
    items: [
      { icon: "◈", label: "AI Doubt Solver", href: "/dashboard/ai-assistant" },
      { icon: "◎", label: "Smart Planner", href: "/dashboard/planner" },
      { icon: "◉", label: "Focus Mode", href: "/dashboard/focus" },
    ],
  },
  {
    label: "PRACTICE",
    items: [
      { icon: "◉", label: "Competency Test", href: "/dashboard/precision-practice" },
      { icon: "◈", label: "Customise Test", href: "/dashboard/tests" },
      { icon: "⇌", label: "Flip the Question", href: "/dashboard/flip-the-question" },
      { icon: "◎", label: "Numerical Mastery", href: "/dashboard/numerical-mastery" },
      { icon: "◈", label: "Guess Papers", href: "/dashboard/guess-papers" },
      { icon: "◉", label: "Strategy AI", href: "/dashboard/strategy" },
      { icon: "◎", label: "Last Night Before", href: "/dashboard/last-night-before" },
    ],
  },
  {
    label: "FREE TOOLS",
    items: [
      { icon: "○", label: "To-do List", href: "/dashboard/planner?tab=todo" },
      { icon: "◎", label: "ChronoScroll", href: "/dashboard/chronoscroll" },
      { icon: "◉", label: "Date Battle Arena", href: "/dashboard/date-battle" },
      { icon: "◈", label: "Notes & Flashcards", href: "/dashboard/notes" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { icon: "○", label: "Profile", href: "/dashboard/profile" },
      { icon: "○", label: "Policies", href: "/dashboard/policies" },
    ],
  },
];

// Mobile bottom tab bar items
const MOBILE_TABS = [
  { icon: "⊞", label: "Home", href: "/dashboard" },
  { icon: "◈", label: "Study", href: "/dashboard/ai-assistant" },
  { icon: "◉", label: "Practice", href: "/dashboard/precision-practice" },
  { icon: "◎", label: "Focus", href: "/dashboard/focus" },
  { icon: "○", label: "Account", href: "/dashboard/profile" },
];

export default function DashboardSidebar({
  userName,
  userEmail,
  isPaid = true,
  planType = "FREE",
}: {
  userName?: string;
  userEmail?: string;
  isPaid?: boolean;
  planType?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [upgradeFeature, setUpgradeFeature] = useState<{ name: string; description: string } | null>(null);

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const planLabel =
    planType === "MONTHLY" ? "Monthly Plan" :
    planType === "YEARLY" ? "Yearly Plan" :
    "Free Plan";

  const handleNavigation = (href: string) => {
    if (!isPaid && isLockedRoute(href)) {
      const info = getFeatureInfo(href);
      if (info) {
        setUpgradeFeature(info);
        setIsOpen(false);
        return;
      }
    }
    setIsOpen(false);
    router.push(href);
  };

  const SidebarContent = () => (
    <aside style={{
      width: 240,
      height: "100vh",
      background: "rgba(10,10,18,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid var(--bg-border)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <DiamondLogo size={28} />
        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            color: "var(--text-primary)",
            letterSpacing: "0.08em",
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}>
            Saviours AI
          </div>
          <div style={{
            fontFamily: "var(--font-tagline)",
            fontSize: 9,
            fontWeight: 400,
            fontStyle: "italic",
            color: "rgba(180, 175, 200, 0.6)",
            marginTop: 3,
          }}>
            Class X · 2027 Edition
          </div>
        </div>
      </div>

      {/* User section */}
      <div style={{
        padding: "12px 14px",
        margin: "10px 10px 0",
        borderRadius: 10,
        background: "var(--bg-base)",
        border: "1px solid var(--bg-border)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, minWidth: 36,
          borderRadius: 8,
          background: "rgba(0,212,255,0.12)",
          border: "1px solid rgba(0,212,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-body)",
          fontSize: 12, fontWeight: 700,
          color: "var(--accent-gold)",
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 13, fontWeight: 600,
            color: "var(--text-primary)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            letterSpacing: "-0.01em",
          }}>
            {userName || "Student"}
          </div>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--text-muted)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {userEmail || ""}
          </div>
        </div>
        {/* Pulsing online dot */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#22c55e",
          }} />
          <div style={{
            position: "absolute", inset: -3,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.25)",
            animation: "pulse 2s ease-in-out infinite",
          }} />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px 12px" }}>
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(item => isVisible(item.href));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <div style={{
                padding: "10px 10px 4px",
                fontFamily: "var(--font-body)",
                fontSize: 9, fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                opacity: 0.5,
              }}>
                {group.label}
              </div>
              {visibleItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard" && item.href.split("?")[0] !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]));
                const isHovered = hoveredItem === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%",
                      padding: "8px 10px",
                      marginBottom: 1,
                      borderRadius: 8,
                      background: isActive
                        ? "var(--accent-gold-glow)"
                        : isHovered
                        ? "rgba(255,255,255,0.03)"
                        : "transparent",
                      color: isActive ? "var(--accent-gold)" : isHovered ? "var(--text-primary)" : "var(--text-muted)",
                      border: "none",
                      borderLeft: isActive ? "2px solid var(--accent-gold)" : "2px solid transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: "-0.01em",
                      transition: "all 0.15s ease",
                      paddingLeft: isActive ? 8 : 10,
                    }}
                  >
                    <span style={{
                      fontSize: 13,
                      color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                      minWidth: 16,
                      textAlign: "center",
                      opacity: isActive ? 1 : 0.5,
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.label}
                    </span>
                    {!isPaid && isLockedRoute(item.href) && (
                      <span style={{ fontSize: 10, opacity: 0.35, flexShrink: 0 }}>⌁</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom plan badge */}
      <div style={{
        padding: "12px 14px",
        borderTop: "1px solid var(--bg-border)",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderRadius: 8,
          background: isPaid
            ? "rgba(0,212,255,0.06)"
            : "var(--bg-base)",
          border: isPaid
            ? "1px solid rgba(0,212,255,0.15)"
            : "1px solid var(--bg-border)",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: 11, fontWeight: 600,
              color: isPaid ? "var(--accent-gold)" : "var(--text-muted)",
              letterSpacing: "0.02em",
            }}>
              {planLabel}
            </div>
            {!isPaid && (
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                color: "var(--text-muted)",
                marginTop: 1,
              }}>
                Upgrade for full access
              </div>
            )}
          </div>
          {isPaid ? (
            <span style={{ fontSize: 14 }}>◈</span>
          ) : (
            <button
              onClick={() => router.push("/dashboard/profile")}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10, fontWeight: 600,
                color: "var(--accent-gold)",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.2)",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              Upgrade
            </button>
          )}
        </div>
        {/* Premium tagline */}
        <div style={{
          fontFamily: "var(--font-tagline)",
          fontSize: 9,
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(180, 175, 200, 0.45)",
          textAlign: "center",
          marginTop: 10,
          letterSpacing: "0.02em",
        }}>
          Where preparation meets precision.
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <div
        className="desktop-only"
        style={{
          position: "fixed",
          top: 0, left: 0,
          height: "100vh",
          zIndex: 150,
        }}
      >
        <SidebarContent />
      </div>

      {/* ── MOBILE HAMBURGER ── */}
      <button
        className="mobile-only"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: 14, left: 14, zIndex: 200,
          width: 42, height: 42,
          background: isOpen ? "var(--accent-gold)" : "rgba(17,17,24,0.9)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${isOpen ? "var(--accent-gold)" : "var(--bg-border)"}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          color: isOpen ? "var(--bg-base)" : "var(--text-primary)",
          fontSize: 16,
          transition: "all 0.2s ease",
        }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* ── MOBILE OVERLAY ── */}
      {isOpen && (
        <div
          className="mobile-only"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 140,
          }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        className="mobile-only"
        style={{
          position: "fixed",
          top: 0, left: 0,
          height: "100vh",
          zIndex: 150,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <SidebarContent />
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav
        className="mobile-only"
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          height: 64,
          background: "rgba(10,10,18,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--bg-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 130,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {MOBILE_TABS.map((tab) => {
          const isActive = pathname === tab.href ||
            (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
          return (
            <button
              key={tab.href}
              onClick={() => handleNavigation(tab.href)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                transition: "color 0.15s ease",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.04em",
              }}>
                {tab.label}
              </span>
              {isActive && (
                <div style={{
                  position: "absolute",
                  bottom: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 4, height: 4,
                  borderRadius: "50%",
                  background: "var(--accent-gold)",
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {upgradeFeature && (
        <UpgradePrompt
          featureName={upgradeFeature.name}
          description={upgradeFeature.description}
          onClose={() => setUpgradeFeature(null)}
        />
      )}
    </>
  );
}
