"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminUpdateUserPlan } from "@/actions/admin-update-plan";

const FILTERS = [
  { key: "", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "free", label: "Free" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
  { key: "phone", label: "Phone" },
];

const PLAN_OPTIONS = [
  { key: "FREE", label: "Free", color: "#6B6B80" },
  { key: "MONTHLY", label: "Monthly", color: "#00D4FF" },
  { key: "YEARLY", label: "Yearly", color: "#3ECF8E" },
] as const;

interface UserRow {
  id: string; name: string; email: string; phone: string | null;
  isPaid: boolean; planType: string; subscriptionStatus: string;
  authProvider: string; createdAt: string; flipBestStreak: number;
  onboardingComplete: boolean;
  _count: { testAttempts: number; aiUsageLogs: number; focusSessions: number; notes: number };
}

function PlanSwitcher({ user, onUpdated }: { user: UserRow; onUpdated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const currentPlan = user.planType;

  const handleChange = async (plan: "FREE" | "MONTHLY" | "YEARLY") => {
    if (plan === currentPlan) { setIsOpen(false); return; }
    setLoading(true);
    setFeedback(null);
    const result = await adminUpdateUserPlan(user.id, plan);
    setLoading(false);
    if (result.success) {
      setFeedback("✓");
      setIsOpen(false);
      setTimeout(() => { setFeedback(null); onUpdated(); }, 600);
    } else {
      setFeedback("✗ " + (result.error || "Failed"));
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const pc = planColor(currentPlan);

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        style={{
          fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 100,
          background: pc.bg, color: pc.fg,
          border: `1px solid ${pc.fg}30`,
          letterSpacing: "0.06em", textTransform: "uppercase",
          cursor: loading ? "wait" : "pointer",
          display: "inline-flex", alignItems: "center", gap: 5,
          transition: "all 0.15s ease",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "..." : currentPlan}
        <span style={{ fontSize: 7, opacity: 0.6 }}>▼</span>
      </button>

      {feedback && (
        <span style={{
          fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600,
          color: feedback.startsWith("✓") ? "var(--status-green)" : "var(--status-red)",
        }}>{feedback}</span>
      )}

      {isOpen && !loading && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100,
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: 10, padding: 4, minWidth: 120,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {PLAN_OPTIONS.map(p => (
            <button
              key={p.key}
              onClick={() => handleChange(p.key)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "7px 10px", borderRadius: 6,
                background: currentPlan === p.key ? "var(--bg-elevated)" : "transparent",
                border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                color: currentPlan === p.key ? p.color : "var(--text-secondary)",
                textAlign: "left",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; }}
              onMouseLeave={e => { if (currentPlan !== p.key) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: p.color, flexShrink: 0,
              }} />
              {p.label}
              {currentPlan === p.key && <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.5 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function planColor(plan: string) {
  const map: Record<string, { bg: string; fg: string }> = {
    FREE: { bg: "rgba(107,107,128,0.12)", fg: "#6B6B80" },
    MONTHLY: { bg: "rgba(0,212,255,0.10)", fg: "#00D4FF" },
    YEARLY: { bg: "rgba(62,207,142,0.10)", fg: "#3ECF8E" },
  };
  return map[plan] ?? map.FREE;
}

export default function UsersTable({ users, search, filter }: { users: UserRow[]; search: string; filter: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(search);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [w, setW] = useState(1200);

  useEffect(() => {
    const u = () => setW(window.innerWidth);
    u(); window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);

  const mob = w < 768;
  const pad = mob ? "14px" : w < 1024 ? "20px" : "28px 32px";

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("search", q); else params.delete("search");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleFilter = (f: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (f) params.set("filter", f); else params.delete("filter");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleRefresh = () => router.refresh();

  const exportCSV = () => {
    const headers = ["Name","Email","Phone","Plan","Status","Auth","Joined","Tests","AI","Focus","Notes","Flip"];
    const rows = users.map(u => [
      u.name, u.email, u.phone ?? "", u.planType, u.subscriptionStatus, u.authProvider,
      new Date(u.createdAt).toLocaleDateString(),
      u._count.testAttempts, u._count.aiUsageLogs, u._count.focusSessions, u._count.notes, u.flipBestStreak,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `saviours-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  /* ── Mobile card layout ── */
  if (mob) {
    return (
      <div style={{ padding: pad, maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 20,
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}>
            Users <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 400, color: "var(--text-muted)" }}>({users.length})</span>
          </h1>
          <button onClick={exportCSV} style={{
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
            padding: "6px 12px", borderRadius: 8,
            background: "rgba(62,207,142,0.08)", border: "1px solid rgba(62,207,142,0.2)",
            color: "var(--status-green)", cursor: "pointer",
          }}>📥 CSV</button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <input
            type="text" placeholder="Search..." value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="sa-input"
            style={{ flex: 1, fontSize: 13, padding: "10px 12px" }}
          />
          <button onClick={handleSearch} className="btn-ghost" style={{ fontSize: 11, padding: "10px 12px" }}>Go</button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => handleFilter(f.key)} style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600,
              padding: "5px 10px", borderRadius: 6,
              background: filter === f.key ? "var(--accent-gold-glow)" : "var(--bg-elevated)",
              color: filter === f.key ? "var(--accent-gold)" : "var(--text-muted)",
              border: `1px solid ${filter === f.key ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
              cursor: "pointer",
            }}>{f.label}</button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.map(u => (
            <div key={u.id} style={{
              background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
              borderRadius: "var(--radius-md)", padding: "14px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{u.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{u.email}</div>
                </div>
                <PlanSwitcher user={u} onUpdated={handleRefresh} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
                {[
                  { l: "Tests", v: u._count.testAttempts },
                  { l: "AI", v: u._count.aiUsageLogs },
                  { l: "Focus", v: u._count.focusSessions },
                  { l: "Flip", v: u.flipBestStreak },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{s.v}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "var(--text-muted)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>{u.authProvider}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>
                  {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </span>
                {u.phone && <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>📱 {u.phone}</span>}
              </div>
            </div>
          ))}
        </div>
        {users.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>
            No users found
          </div>
        )}
      </div>
    );
  }

  /* ── Desktop / Tablet table layout ── */
  const thStyle: React.CSSProperties = {
    textAlign: "left", padding: "10px 12px",
    fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: "var(--text-muted)", borderBottom: "1px solid var(--bg-border)",
  };
  const tdStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontFamily: "var(--font-body)", fontSize: 12,
    borderBottom: "1px solid var(--bg-border)",
  };

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: 28,
          color: "var(--text-primary)", letterSpacing: "-0.02em",
        }}>
          Users <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>({users.length})</span>
        </h1>
        <button onClick={exportCSV} style={{
          fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
          padding: "8px 16px", borderRadius: 10,
          background: "rgba(62,207,142,0.08)", border: "1px solid rgba(62,207,142,0.2)",
          color: "var(--status-green)", cursor: "pointer",
        }}>📥 Export CSV</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, flex: 1, minWidth: 200 }}>
          <input type="text" placeholder="Search name or email..." value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="sa-input" style={{ flex: 1, fontSize: 13, padding: "10px 14px" }}
          />
          <button onClick={handleSearch} className="btn-ghost" style={{ fontSize: 12, padding: "10px 16px" }}>Search</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => handleFilter(f.key)} style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
              padding: "6px 12px", borderRadius: 8,
              background: filter === f.key ? "var(--accent-gold-glow)" : "var(--bg-elevated)",
              color: filter === f.key ? "var(--accent-gold)" : "var(--text-muted)",
              border: `1px solid ${filter === f.key ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
              cursor: "pointer",
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{
        background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
        borderRadius: "var(--radius-lg)", overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr>
              {["Name","Email","Phone","Plan","Status","Auth","Joined","Tests","AI","Focus","Flip"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}
                onMouseEnter={() => setHoveredRow(u.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ background: hoveredRow === u.id ? "var(--bg-elevated)" : "transparent", transition: "background 0.15s" }}
              >
                <td style={{ ...tdStyle, fontWeight: 600, color: "var(--text-primary)" }}>{u.name}</td>
                <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>{u.email}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{u.phone || "—"}</td>
                <td style={tdStyle}>
                  <PlanSwitcher user={u} onUpdated={handleRefresh} />
                </td>
                <td style={{ ...tdStyle, color: u.subscriptionStatus === "ACTIVE" ? "var(--status-green)" : "var(--status-red)", fontWeight: 600, fontSize: 11 }}>{u.subscriptionStatus}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: 11 }}>{u.authProvider}</td>
                <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: 11 }}>{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                <td style={{ ...tdStyle, color: "var(--text-secondary)", textAlign: "center" }}>{u._count.testAttempts}</td>
                <td style={{ ...tdStyle, color: "var(--text-secondary)", textAlign: "center" }}>{u._count.aiUsageLogs}</td>
                <td style={{ ...tdStyle, color: "var(--text-secondary)", textAlign: "center" }}>{u._count.focusSessions}</td>
                <td style={{ ...tdStyle, color: "var(--status-orange)", textAlign: "center", fontWeight: 600 }}>{u.flipBestStreak}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)" }}>No users found</div>
        )}
      </div>
    </div>
  );
}
