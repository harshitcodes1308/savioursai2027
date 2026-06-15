"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "💰", label: "Revenue", href: "/admin/revenue" },
  { icon: "⚡", label: "Features", href: "/admin/features" },
  { icon: "🤝", label: "Creators", href: "/admin/creators" },
];

export default function AdminShell({ children, adminEmail }: { children: React.ReactNode; adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = () => {
    document.cookie = "admin-token=; Path=/; Max-Age=0; SameSite=Lax";
    document.cookie = "admin-token=; Path=/admin; Max-Age=0; SameSite=Lax";
    localStorage.removeItem("admin-token");
    window.location.href = "/admin";
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
        <div style={{
          width: 32, height: 32,
          borderRadius: 10,
          background: "linear-gradient(135deg, #00D4FF, #00A3CC)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 900, color: "#0D0D1A",
          flexShrink: 0,
        }}>
          S
        </div>
        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            color: "var(--text-primary)",
            letterSpacing: "0.08em",
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}>
            Admin Panel
          </div>
          <div style={{
            fontFamily: "var(--font-tagline)",
            fontSize: 9,
            fontWeight: 400,
            fontStyle: "italic",
            color: "rgba(180, 175, 200, 0.6)",
            marginTop: 3,
          }}>
            Saviours AI · Control Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 10px 12px" }}>
        <div style={{
          padding: "10px 10px 4px",
          fontFamily: "var(--font-body)",
          fontSize: 9, fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          opacity: 0.5,
        }}>
          NAVIGATION
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const hovered = hoveredItem === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%",
                padding: "8px 10px",
                marginBottom: 1,
                borderRadius: 8,
                background: active ? "var(--accent-gold-glow)" : hovered ? "rgba(255,255,255,0.03)" : "transparent",
                color: active ? "var(--accent-gold)" : hovered ? "var(--text-primary)" : "var(--text-muted)",
                borderLeft: active ? "2px solid var(--accent-gold)" : "2px solid transparent",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                letterSpacing: "-0.01em",
                transition: "all 0.15s ease",
                paddingLeft: active ? 8 : 10,
              }}
            >
              <span style={{
                fontSize: 15, minWidth: 16, textAlign: "center",
                opacity: active ? 1 : 0.5, flexShrink: 0,
              }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: "12px 14px",
        borderTop: "1px solid var(--bg-border)",
        flexShrink: 0,
      }}>
        <div style={{
          padding: "8px 12px", borderRadius: 8,
          background: "var(--bg-base)",
          border: "1px solid var(--bg-border)",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
            color: "var(--text-primary)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            marginBottom: 2,
          }}>
            {adminEmail}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button
              onClick={() => { setMobileOpen(false); router.push("/dashboard"); }}
              style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
                color: "var(--text-muted)", background: "transparent",
                border: "none", cursor: "pointer", padding: 0,
              }}
            >
              ← Dashboard
            </button>
            <span style={{ color: "var(--bg-border)", fontSize: 10 }}>|</span>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
                color: "var(--status-red)", background: "transparent",
                border: "none", cursor: "pointer", padding: 0,
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <div style={{
          fontFamily: "var(--font-tagline)",
          fontSize: 9, fontWeight: 400, fontStyle: "italic",
          color: "rgba(180, 175, 200, 0.45)",
          textAlign: "center", marginTop: 10, letterSpacing: "0.02em",
        }}>
          Where preparation meets precision.
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Desktop sidebar */}
      <div className="desktop-only" style={{
        position: "fixed", top: 0, left: 0,
        height: "100vh", zIndex: 150,
      }}>
        <SidebarContent />
      </div>

      {/* Mobile hamburger */}
      <button
        className="mobile-only"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: "fixed",
          top: 14, left: 14, zIndex: 200,
          width: 42, height: 42,
          background: mobileOpen ? "var(--accent-gold)" : "rgba(17,17,24,0.9)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${mobileOpen ? "var(--accent-gold)" : "var(--bg-border)"}`,
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          color: mobileOpen ? "var(--bg-base)" : "var(--text-primary)",
          fontSize: 16,
          transition: "all 0.2s ease",
        }}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="mobile-only"
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 140,
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="mobile-only"
        style={{
          position: "fixed", top: 0, left: 0,
          height: "100vh", zIndex: 150,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <SidebarContent />
      </div>

      {/* Mobile bottom tab bar */}
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
        {NAV_ITEMS.map((tab) => {
          const active = pathname === tab.href || (tab.href !== "/admin" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 3, padding: "8px 12px",
                color: active ? "var(--accent-gold)" : "var(--text-muted)",
                textDecoration: "none", position: "relative",
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 9,
                fontWeight: active ? 600 : 400, letterSpacing: "0.04em",
              }}>
                {tab.label}
              </span>
              {active && (
                <div style={{
                  position: "absolute", bottom: -1,
                  left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%",
                  background: "var(--accent-gold)",
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main style={{
        marginLeft: isMobile ? 0 : 240,
        paddingTop: isMobile ? 60 : 0,
        paddingBottom: isMobile ? 80 : 0,
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {children}
      </main>
    </div>
  );
}
