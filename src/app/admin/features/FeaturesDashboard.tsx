"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FEATURE_LABELS: Record<string, { label: string; icon: string }> = {
  DOUBT_SOLVING: { label: "AI Assistant", icon: "🤖" },
  FLIP_THE_QUESTION: { label: "Flip the Question", icon: "🔁" },
  STUDY_PLANNER: { label: "Study Planner", icon: "📅" },
  CONTENT_SUMMARY: { label: "Content Summary", icon: "📝" },
  NOTE_SIMPLIFICATION: { label: "Note Simplifier", icon: "✨" },
  FLASHCARD_GENERATION: { label: "Flashcards", icon: "🃏" },
  REVISION_SHEET: { label: "Revision Sheets", icon: "📄" },
  PERFORMANCE_ANALYSIS: { label: "Performance AI", icon: "📊" },
  PLAN_ADJUSTMENT: { label: "Plan Adjustment", icon: "🔄" },
};

const TOOLTIP_STYLE = {
  background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
  borderRadius: 10, color: "var(--text-primary)", fontSize: 12, fontFamily: "var(--font-body)",
};

interface Props {
  data: {
    totalAiCalls: number; totalTokens: number; totalTests: number;
    focusSessions: number; focusHours: number; totalNotes: number;
    totalDoubts: number; avgFlipStreak: number;
    featureBreakdown: { feature: string; calls: number; tokens: number; pct: number }[];
    aiTrend: { date: string; count: number }[];
  };
}

export default function FeaturesDashboard({ data }: Props) {
  const [w, setW] = useState(1200);
  useEffect(() => {
    const u = () => setW(window.innerWidth);
    u(); window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  const mob = w < 768;
  const tab = w >= 768 && w < 1024;
  const pad = mob ? "14px" : tab ? "20px" : "28px 32px";
  const maxCalls = Math.max(...data.featureBreakdown.map(f => f.calls), 1);

  const miniCards = [
    { label: "AI Calls", value: data.totalAiCalls.toLocaleString(), icon: "🤖", color: "#00D4FF" },
    { label: "Tokens", value: `${(data.totalTokens / 1000).toFixed(0)}K`, icon: "🔤", color: "#A78BFA" },
    { label: "Tests", value: data.totalTests, icon: "📝", color: "#3ECF8E" },
    { label: "Focus Hrs", value: data.focusHours, icon: "🧘", color: "#FB923C" },
    { label: "Notes", value: data.totalNotes, icon: "📒", color: "#60A5FA" },
    { label: "Doubts", value: data.totalDoubts, icon: "❓", color: "#F87171" },
  ];

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: "0 auto" }}>
      <h1 style={{
        fontFamily: "var(--font-display)", fontSize: mob ? 20 : 28,
        color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: mob ? 16 : 24,
      }}>Feature Usage</h1>

      {/* Mini stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "repeat(3, 1fr)" : tab ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
        gap: mob ? 6 : 8, marginBottom: mob ? 14 : 20,
      }}>
        {miniCards.map(c => (
          <div key={c.label} style={{
            background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
            borderRadius: "var(--radius-md)", padding: mob ? "10px 6px" : "14px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: mob ? 16 : 20, marginBottom: mob ? 2 : 6 }}>{c.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: mob ? 14 : 18, fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: mob ? 8 : 10, color: "var(--text-muted)", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
        gap: mob ? 10 : 14, marginBottom: mob ? 10 : 14,
      }}>
        {/* Feature rankings */}
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", padding: mob ? "12px" : "20px 24px",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: mob ? 10 : 16,
          }}>AI Feature Rankings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: mob ? 8 : 10 }}>
            {data.featureBreakdown.map((f) => {
              const meta = FEATURE_LABELS[f.feature] ?? { label: f.feature, icon: "⚙️" };
              return (
                <div key={f.feature} style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 10 }}>
                  <span style={{ fontSize: mob ? 14 : 16, width: mob ? 20 : 24, textAlign: "center", flexShrink: 0 }}>{meta.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: mob ? 11 : 12, fontWeight: 500,
                        color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{meta.label}</span>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: mob ? 9 : 10, fontWeight: 700,
                        color: "var(--accent-gold)", flexShrink: 0, marginLeft: 6,
                      }}>{f.calls} · {f.pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "var(--bg-elevated)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 2, width: `${(f.calls / maxCalls) * 100}%`,
                        background: "var(--accent-gold)", transition: "width 0.5s ease",
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Trend */}
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", padding: mob ? "12px" : "20px 24px",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: mob ? 10 : 16,
          }}>30-Day AI Usage Trend</div>
          <div style={{ height: mob ? 200 : 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.aiTrend}>
                <defs>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#252538" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#6B6B80" fontSize={mob ? 8 : 10} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#6B6B80" fontSize={mob ? 8 : 10} allowDecimals={false} width={mob ? 25 : 35} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="count" stroke="#00D4FF" fill="url(#aiGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail table — on mobile, show as a simple stacked card list instead */}
      {mob ? (
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", padding: "12px",
        }}>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
            fontWeight: 700, color: "var(--text-primary)", marginBottom: 12,
          }}>Feature Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.featureBreakdown.map((f) => {
              const meta = FEATURE_LABELS[f.feature] ?? { label: f.feature, icon: "⚙️" };
              return (
                <div key={f.feature} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0", borderBottom: "1px solid var(--bg-border)",
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{meta.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{meta.label}</div>
                    <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--accent-gold)" }}>{f.calls} calls</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>{f.tokens.toLocaleString()} tokens</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)" }}>{f.pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{
          background: "var(--bg-surface)", border: "1.5px solid var(--bg-border)",
          borderRadius: "var(--radius-lg)", overflowX: "auto",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                {["Feature", "Calls", "Tokens", "% of Total", ""].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "10px 14px",
                    fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--text-muted)", borderBottom: "1px solid var(--bg-border)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.featureBreakdown.map((f) => {
                const meta = FEATURE_LABELS[f.feature] ?? { label: f.feature, icon: "⚙️" };
                const td: React.CSSProperties = {
                  padding: "10px 14px", fontFamily: "var(--font-body)", fontSize: 12,
                  borderBottom: "1px solid var(--bg-border)",
                };
                return (
                  <tr key={f.feature}>
                    <td style={{ ...td, fontWeight: 600, color: "var(--text-primary)" }}>{meta.icon} {meta.label}</td>
                    <td style={{ ...td, color: "var(--accent-gold)", fontWeight: 600 }}>{f.calls.toLocaleString()}</td>
                    <td style={{ ...td, color: "var(--text-secondary)" }}>{f.tokens.toLocaleString()}</td>
                    <td style={{ ...td, color: "var(--text-muted)" }}>{f.pct}%</td>
                    <td style={{ ...td, width: 120 }}>
                      <div style={{ height: 4, borderRadius: 2, background: "var(--bg-elevated)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${f.pct}%`, background: "var(--accent-gold)" }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
