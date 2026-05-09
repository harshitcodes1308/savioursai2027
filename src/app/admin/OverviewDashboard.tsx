"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["#00D4FF", "#3ECF8E", "#FB923C", "#F87171", "#60A5FA", "#A78BFA"];
const TOOLTIP_STYLE = {
  background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
  borderRadius: 10, color: "var(--text-primary)", fontSize: 12, fontFamily: "var(--font-body)",
};

interface Props {
  data: {
    totalUsers: number; paidUsers: number; freeUsers: number;
    conversionRate: string; estimatedRevenue: number;
    usersToday: number; usersWeek: number; usersMonth: number;
    activeSessions: number;
    authProviders: { provider: string; count: number }[];
    planTypeBreakdown: { plan: string; count: number }[];
    signupTrend: { date: string; count: number }[];
  };
}

function StatCard({ label, value, icon, color, compact }: { label: string; value: string | number; icon: string; color: string; compact?: boolean }) {
  return (
    <div style={{
      background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
      borderRadius: "var(--radius-lg)",
      padding: compact ? "14px 12px" : "20px 18px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -10, right: -10,
        width: 60, height: 60, borderRadius: "50%",
        background: color, opacity: 0.08, filter: "blur(18px)",
      }} />
      <div style={{ fontSize: compact ? 16 : 20, marginBottom: compact ? 4 : 8 }}>{icon}</div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: compact ? 20 : 26, fontWeight: 700,
        color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.1,
      }}>{value}</div>
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: compact ? 9 : 11, fontWeight: 500,
        color: "var(--text-muted)", marginTop: compact ? 3 : 6,
        letterSpacing: "0.04em", textTransform: "uppercase",
      }}>{label}</div>
    </div>
  );
}

export default function OverviewDashboard({ data }: Props) {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const u = () => setW(window.innerWidth);
    u(); window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  const mob = w < 768;
  const tab = w >= 768 && w < 1024;
  const pad = mob ? "14px" : tab ? "20px" : "28px 32px";

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: "0 auto" }}>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: mob ? 20 : 28, color: "var(--text-primary)",
        letterSpacing: "-0.02em", marginBottom: mob ? 16 : 24,
      }}>
        Overview
      </h1>

      {/* Primary KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 8 : 14, marginBottom: mob ? 8 : 14,
      }}>
        <StatCard label="Total Users" value={data.totalUsers} icon="👥" color="#00D4FF" compact={mob} />
        <StatCard label="Paid Users" value={data.paidUsers} icon="💎" color="#3ECF8E" compact={mob} />
        <StatCard label="Revenue" value={`₹${data.estimatedRevenue.toLocaleString()}`} icon="💰" color="#FB923C" compact={mob} />
        <StatCard label="Active Sessions" value={data.activeSessions} icon="🟢" color="#60A5FA" compact={mob} />
      </div>

      {/* Secondary stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: mob ? 6 : 8, marginBottom: mob ? 14 : 20,
      }}>
        {[
          { label: "Today", value: data.usersToday, color: "#00D4FF" },
          { label: "This Week", value: data.usersWeek, color: "#3ECF8E" },
          { label: "This Month", value: data.usersMonth, color: "#FB923C" },
          { label: "Free Users", value: data.freeUsers, color: "#6B6B80" },
        ].map(c => (
          <div key={c.label} style={{
            background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
            borderRadius: "var(--radius-md)", padding: mob ? "10px 6px" : "12px 8px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: mob ? 16 : 20, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: mob ? 9 : 10, color: "var(--text-muted)", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr" : "2fr 1fr",
        gap: mob ? 10 : 14, marginBottom: mob ? 10 : 14,
      }}>
        {/* Signup trend */}
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", padding: mob ? "12px" : "20px 24px",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: mob ? 10 : 16,
          }}>30-Day Signup Trend</div>
          <div style={{ height: mob ? 160 : 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.signupTrend}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#252538" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#6B6B80" fontSize={mob ? 8 : 10} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#6B6B80" fontSize={mob ? 8 : 10} allowDecimals={false} width={mob ? 25 : 35} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="count" stroke="#00D4FF" fill="url(#cyanGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Auth providers pie */}
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", padding: mob ? "12px" : "20px 24px",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: mob ? 10 : 16,
          }}>Auth Providers</div>
          <div style={{ height: mob ? 140 : 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.authProviders} dataKey="count" nameKey="provider"
                  cx="50%" cy="50%"
                  outerRadius={mob ? 50 : 70} innerRadius={mob ? 28 : 40}
                  strokeWidth={0}
                >
                  {data.authProviders.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, justifyContent: "center" }}>
            {data.authProviders.map((p, i) => (
              <div key={p.provider} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-secondary)",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                {p.provider} ({p.count})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan breakdown */}
      <div style={{
        background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
        borderRadius: "var(--radius-lg)", padding: mob ? "12px" : "20px 24px",
      }}>
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
          fontWeight: 700, color: "var(--text-primary)", marginBottom: 12,
        }}>Plan Distribution</div>
        <div style={{ display: "flex", gap: mob ? 8 : 12, flexWrap: "wrap" }}>
          {data.planTypeBreakdown.map((p) => {
            const colors: Record<string, string> = { FREE: "#6B6B80", MONTHLY: "#00D4FF", YEARLY: "#3ECF8E" };
            const c = colors[p.plan] ?? "#60A5FA";
            return (
              <div key={p.plan} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 8,
                background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{p.plan}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: c }}>{p.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
