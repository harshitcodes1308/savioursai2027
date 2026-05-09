"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const PLAN_COLORS: Record<string, string> = { FREE: "#6B6B80", MONTHLY: "#00D4FF", YEARLY: "#3ECF8E" };
const TOOLTIP_STYLE = {
  background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
  borderRadius: 10, color: "var(--text-primary)", fontSize: 12, fontFamily: "var(--font-body)",
};

interface Props {
  data: {
    paidUsers: number; totalUsers: number; conversionRate: string;
    estimatedRevenue: number; arpu: string;
    planBreakdown: { plan: string; count: number }[];
    cumulativeTimeline: { month: string; revenue: number; users: number }[];
  };
}

function StatCard({ label, value, icon, color, compact }: { label: string; value: string | number; icon: string; color: string; compact?: boolean }) {
  return (
    <div style={{
      background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
      borderRadius: "var(--radius-lg)", padding: compact ? "14px 12px" : "20px 18px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -10, right: -10,
        width: 60, height: 60, borderRadius: "50%",
        background: color, opacity: 0.08, filter: "blur(18px)",
      }} />
      <div style={{ fontSize: compact ? 16 : 20, marginBottom: compact ? 4 : 8 }}>{icon}</div>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: compact ? 20 : 26, fontWeight: 700,
        color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.1,
      }}>{value}</div>
      <div style={{
        fontFamily: "var(--font-body)", fontSize: compact ? 9 : 11, fontWeight: 500,
        color: "var(--text-muted)", marginTop: compact ? 3 : 6,
        letterSpacing: "0.04em", textTransform: "uppercase",
      }}>{label}</div>
    </div>
  );
}

export default function RevenueDashboard({ data }: Props) {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const u = () => setW(window.innerWidth);
    u(); window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  const mob = w < 768;
  const pad = mob ? "14px" : w < 1024 ? "20px" : "28px 32px";

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: "0 auto" }}>
      <h1 style={{
        fontFamily: "var(--font-display)", fontSize: mob ? 20 : 28,
        color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: mob ? 16 : 24,
      }}>Revenue</h1>

      {/* KPIs */}
      <div style={{
        display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: mob ? 8 : 14, marginBottom: mob ? 14 : 20,
      }}>
        <StatCard label="Total Revenue" value={`₹${data.estimatedRevenue.toLocaleString()}`} icon="💰" color="#3ECF8E" compact={mob} />
        <StatCard label="Paid Users" value={data.paidUsers} icon="💎" color="#00D4FF" compact={mob} />
        <StatCard label="Conversion Rate" value={`${data.conversionRate}%`} icon="📈" color="#FB923C" compact={mob} />
        <StatCard label="ARPU" value={`₹${data.arpu}`} icon="👤" color="#60A5FA" compact={mob} />
      </div>

      {/* Charts */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : w < 1024 ? "1fr" : "2fr 1fr",
        gap: mob ? 10 : 14,
      }}>
        {/* Cumulative revenue */}
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", padding: mob ? "12px" : "20px 24px",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: mob ? 10 : 16,
          }}>Cumulative Revenue (6 mo)</div>
          <div style={{ height: mob ? 180 : 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.cumulativeTimeline}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3ECF8E" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3ECF8E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#252538" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#6B6B80" fontSize={mob ? 8 : 10} />
                <YAxis stroke="#6B6B80" fontSize={mob ? 8 : 10} tickFormatter={(v) => `₹${v}`} width={mob ? 35 : 50} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`₹${Number(v ?? 0).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#3ECF8E" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan distribution */}
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", padding: mob ? "12px" : "20px 24px",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: mob ? 10 : 16,
          }}>Plan Distribution</div>
          <div style={{ height: mob ? 180 : 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.planBreakdown} layout="vertical">
                <CartesianGrid stroke="#252538" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#6B6B80" fontSize={mob ? 8 : 10} />
                <YAxis dataKey="plan" type="category" stroke="#6B6B80" fontSize={mob ? 9 : 10} width={mob ? 55 : 70} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {data.planBreakdown.map((p) => (
                    <Cell key={p.plan} fill={PLAN_COLORS[p.plan] ?? "#60A5FA"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
