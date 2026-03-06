"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LNB_SETS, type LNBSet } from "@/data/lnb-mock-data";
import { useResponsive } from "@/hooks/useResponsive";

type TabKey = "numericals" | "formulas" | "definitions";

const TABS: { key: TabKey; icon: string; label: string; countKey: keyof LNBSet }[] = [
  { key: "numericals", icon: "🔢", label: "Numericals", countKey: "numericals" },
  { key: "formulas", icon: "📐", label: "Formulas", countKey: "formulas" },
  { key: "definitions", icon: "📖", label: "Definitions", countKey: "definitions" },
];

function getMotivation(pct: number): string {
  if (pct >= 100) return "You're ready. Sleep well. 😴";
  if (pct >= 75) return "Almost there, legend 🌙";
  if (pct >= 50) return "More than halfway there! 🚀";
  if (pct >= 25) return "You're warming up 🔥";
  return "Let's get started 💪";
}

export default function LastNightBeforePage() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const [phase, setPhase] = useState<"reveal" | "revise">("reveal");
  const [currentSet, setCurrentSet] = useState<LNBSet | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("numericals");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showReroll, setShowReroll] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Assign set on mount
  useEffect(() => {
    let setId: number;
    const stored = sessionStorage.getItem("lnb_setId");
    if (stored) {
      setId = parseInt(stored, 10);
    } else {
      setId = Math.floor(Math.random() * 5) + 1;
      sessionStorage.setItem("lnb_setId", String(setId));
    }
    const found = LNB_SETS.find((s) => s.setId === setId) || LNB_SETS[0];
    setCurrentSet(found);
    // Restore progress
    const savedDone = sessionStorage.getItem("lnb_done");
    if (savedDone) {
      try { setDone(JSON.parse(savedDone)); } catch { /* ignore */ }
    }
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  // Save progress
  useEffect(() => {
    if (Object.keys(done).length > 0) {
      sessionStorage.setItem("lnb_done", JSON.stringify(done));
    }
  }, [done]);

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleRevealed = useCallback((id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleReroll = () => {
    const newSetId = Math.floor(Math.random() * 5) + 1;
    sessionStorage.setItem("lnb_setId", String(newSetId));
    sessionStorage.removeItem("lnb_done");
    setDone({});
    setRevealed({});
    setCurrentSet(LNB_SETS.find((s) => s.setId === newSetId) || LNB_SETS[0]);
    setShowReroll(false);
    setPhase("reveal");
  };

  if (!currentSet) return null;

  // Progress counts
  const numDone = currentSet.numericals.filter((n) => done[n.id]).length;
  const frmDone = currentSet.formulas.filter((f) => done[f.id]).length;
  const defDone = currentSet.definitions.filter((d) => done[d.id]).length;
  const totalDone = numDone + frmDone + defDone;
  const totalItems = 60;
  const pct = Math.round((totalDone / totalItems) * 100);

  // ═══════════════ REVEAL SCREEN ═══════════════
  if (phase === "reveal") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.06) 0%, transparent 50%), #0D1117",
        padding: isMobile ? "24px 16px" : "48px",
        position: "relative", overflow: "hidden",
        opacity: animateIn ? 1 : 0, transition: "opacity 0.8s ease",
      }}>
        {/* Floating orbs */}
        <div style={{ position:"absolute", top:"10%", left:"10%", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,158,11,0.06),transparent 70%)", pointerEvents:"none", animation:"float 8s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"15%", right:"15%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,0.05),transparent 70%)", pointerEvents:"none", animation:"float 8s ease-in-out infinite 3s" }} />

        {/* Clock icon */}
        <div style={{
          fontSize: isMobile ? 56 : 72, marginBottom: 24,
          animation: "pulse 2s ease-in-out infinite",
        }}>⏰</div>

        {/* Set number */}
        <div style={{
          fontSize: isMobile ? 14 : 16, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
          color: "#F59E0B", marginBottom: 12,
        }}>
          LAST NIGHT BEFORE
        </div>

        <h1 style={{
          fontSize: isMobile ? 32 : 48, fontWeight: 900, textAlign: "center",
          background: "linear-gradient(135deg, #FFF 30%, #F59E0B)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 8, lineHeight: 1.2,
        }}>
          Set #{currentSet.setId} Assigned
        </h1>

        <p style={{
          fontSize: isMobile ? 18 : 22, color: "#9CA3AF", marginBottom: 8,
          textAlign: "center",
        }}>
          You&apos;ve got this. 🔥
        </p>

        <p style={{
          fontSize: 14, color: "#6B7280", marginBottom: 32, textAlign: "center",
        }}>
          {currentSet.subject} · 60 items to revise
        </p>

        {/* Stats cards */}
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 12, marginBottom: 36, width: "100%", maxWidth: 440,
        }}>
          {[
            { icon: "🔢", count: 30, label: "Numericals" },
            { icon: "📐", count: 20, label: "Formulas" },
            { icon: "📖", count: 10, label: "Definitions" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "14px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5" }}>{s.count}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={() => setPhase("revise")} style={{
          padding: "16px 48px", fontSize: 16, fontWeight: 700,
          background: "linear-gradient(135deg, #F59E0B, #D97706)",
          color: "#000", border: "none", borderRadius: 14, cursor: "pointer",
          boxShadow: "0 8px 32px rgba(245,158,11,0.3)",
          transition: "all 0.3s ease", letterSpacing: 0.3, marginBottom: 16,
        }}>
          Start Revising →
        </button>

        {/* Reroll link */}
        <button onClick={() => setShowReroll(true)} style={{
          background: "none", border: "none", color: "#6B7280", fontSize: 13,
          cursor: "pointer", textDecoration: "underline", padding: 8,
        }}>
          Re-roll Set
        </button>

        {/* Reroll confirmation */}
        {showReroll && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 24,
          }}>
            <div style={{
              background: "#161B22", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 20, padding: 32, maxWidth: 380, width: "100%", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🎲</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F5F5F5", marginBottom: 8 }}>
                Get a different set?
              </h3>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>
                Your current progress will be reset.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowReroll(false)} style={{
                  flex: 1, padding: 12, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                  color: "#9CA3AF", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>Cancel</button>
                <button onClick={handleReroll} style={{
                  flex: 1, padding: 12, background: "linear-gradient(135deg,#F59E0B,#D97706)",
                  border: "none", borderRadius: 12, color: "#000", fontSize: 14,
                  fontWeight: 700, cursor: "pointer",
                }}>Re-roll 🎲</button>
              </div>
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        `}} />
      </div>
    );
  }

  // ═══════════════ REVISION SCREEN ═══════════════
  return (
    <div style={{
      minHeight: "100vh", background: "#0D1117",
      paddingBottom: isMobile ? 100 : 80,
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? "16px" : "20px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
        position: "sticky", top: 0, background: "rgba(13,17,23,0.95)",
        backdropFilter: "blur(12px)", zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push("/dashboard")} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "8px 12px", color: "#9CA3AF", fontSize: 13,
            cursor: "pointer", fontWeight: 600,
          }}>
            ← Back
          </button>
          <div>
            <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: "#F5F5F5" }}>
              🌙 Last Night Before
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              Set #{currentSet.setId} · {currentSet.subject}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: pct >= 75 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#6B7280",
          }}>
            {pct}% done
          </div>
          <button onClick={() => { setPhase("reveal"); setShowReroll(true); }} style={{
            background: "none", border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 8, padding: "6px 12px", color: "#F59E0B",
            fontSize: 12, cursor: "pointer", fontWeight: 600,
          }}>🎲 Re-roll</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: isMobile ? 4 : 8,
        padding: isMobile ? "12px 12px" : "16px 32px",
        position: "sticky", top: isMobile ? 62 : 66,
        background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)",
        zIndex: 49, borderBottom: "1px solid rgba(255,255,255,0.04)",
        overflowX: "auto",
      }}>
        {TABS.map((tab) => {
          const count = (currentSet[tab.countKey] as unknown[]).length;
          const tabDone = (currentSet[tab.countKey] as { id: string }[]).filter((i) => done[i.id]).length;
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: isMobile ? 1 : "none",
              padding: isMobile ? "10px 8px" : "10px 18px",
              borderRadius: 12, border: "none", cursor: "pointer",
              fontSize: isMobile ? 11 : 13, fontWeight: 700, whiteSpace: "nowrap",
              background: isActive ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)",
              color: isActive ? "#F59E0B" : "#6B7280",
              borderBottom: isActive ? "2px solid #F59E0B" : "2px solid transparent",
              transition: "all 0.2s ease",
            }}>
              {tab.icon} {isMobile ? "" : tab.label} {tabDone}/{count}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{
        padding: isMobile ? "16px 12px" : "24px 32px",
        maxWidth: 900, margin: "0 auto",
      }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 3, transition: "width 0.5s ease",
              width: `${pct}%`,
              background: pct >= 75 ? "linear-gradient(90deg,#10B981,#34D399)" :
                          pct >= 50 ? "linear-gradient(90deg,#F59E0B,#FBBF24)" :
                                      "linear-gradient(90deg,#3B82F6,#60A5FA)",
              boxShadow: pct > 0 ? `0 0 12px ${pct >= 75 ? "rgba(16,185,129,0.4)" : pct >= 50 ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.4)"}` : "none",
            }} />
          </div>
        </div>

        {/* ══ NUMERICALS TAB ══ */}
        {activeTab === "numericals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentSet.numericals.map((n, idx) => (
              <div key={n.id} style={{
                background: done[n.id] ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${done[n.id] ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16, padding: isMobile ? 16 : 20,
                transition: "all 0.3s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#6B7280" }}>#{idx + 1}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                        background: "rgba(59,130,246,0.1)", color: "#60A5FA",
                      }}>{n.topic}</span>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#E5E7EB", marginBottom: 8 }}>{n.title}</h4>
                    <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 12 }}>{n.question}</p>
                    <button onClick={() => toggleRevealed(n.id)} style={{
                      background: revealed[n.id] ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
                      border: `1px solid ${revealed[n.id] ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`,
                      borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600,
                      color: revealed[n.id] ? "#34D399" : "#FBBF24", cursor: "pointer",
                    }}>
                      {revealed[n.id] ? "Hide Answer ▲" : "Show Answer ▼"}
                    </button>
                    {revealed[n.id] && (
                      <div style={{
                        marginTop: 12, padding: 14, borderRadius: 12,
                        background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)",
                      }}>
                        <p style={{ fontSize: 14, color: "#34D399", fontWeight: 600, margin: 0, lineHeight: 1.6 }}>{n.answer}</p>
                      </div>
                    )}
                  </div>
                  <button onClick={() => toggleDone(n.id)} style={{
                    width: 36, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                    background: done[n.id] ? "#10B981" : "rgba(255,255,255,0.05)",
                    color: done[n.id] ? "#FFF" : "#6B7280", fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s ease",
                    boxShadow: done[n.id] ? "0 4px 12px rgba(16,185,129,0.3)" : "none",
                  }}>
                    {done[n.id] ? "✓" : "○"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ FORMULAS TAB ══ */}
        {activeTab === "formulas" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {currentSet.formulas.map((f) => (
              <div key={f.id} style={{
                background: done[f.id] ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${done[f.id] ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16, padding: isMobile ? 16 : 20,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                    background: "rgba(139,92,246,0.1)", color: "#A78BFA",
                  }}>{f.topic}</span>
                  <div style={{
                    fontSize: isMobile ? 20 : 24, fontWeight: 900, color: "#F5F5F5",
                    marginTop: 14, marginBottom: 8, fontFamily: "monospace", letterSpacing: 0.5,
                  }}>
                    {f.formula}
                  </div>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>{f.name}</p>
                </div>
                <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => toggleDone(f.id)} style={{
                    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: done[f.id] ? "#10B981" : "rgba(255,255,255,0.05)",
                    color: done[f.id] ? "#FFF" : "#6B7280", fontSize: 12, fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}>
                    {done[f.id] ? "✓ Done" : "Mark Done"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ DEFINITIONS TAB ══ */}
        {activeTab === "definitions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentSet.definitions.map((d) => (
              <div key={d.id} style={{
                background: done[d.id] ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${done[d.id] ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16, padding: isMobile ? 16 : 20,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 17, fontWeight: 800, color: "#F5F5F5", marginBottom: 8 }}>{d.term}</h4>
                    <button onClick={() => toggleRevealed(d.id)} style={{
                      background: revealed[d.id] ? "rgba(139,92,246,0.08)" : "rgba(245,158,11,0.08)",
                      border: `1px solid ${revealed[d.id] ? "rgba(139,92,246,0.2)" : "rgba(245,158,11,0.2)"}`,
                      borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600,
                      color: revealed[d.id] ? "#A78BFA" : "#FBBF24", cursor: "pointer",
                      marginBottom: revealed[d.id] ? 12 : 0,
                    }}>
                      {revealed[d.id] ? "Hide Definition ▲" : "Reveal Definition ▼"}
                    </button>
                    {revealed[d.id] && (
                      <p style={{ fontSize: 14, color: "#D1D5DB", lineHeight: 1.7, margin: 0 }}>{d.definition}</p>
                    )}
                  </div>
                  <button onClick={() => toggleDone(d.id)} style={{
                    width: 36, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                    background: done[d.id] ? "#10B981" : "rgba(255,255,255,0.05)",
                    color: done[d.id] ? "#FFF" : "#6B7280", fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s ease",
                  }}>
                    {done[d.id] ? "✓" : "○"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ STICKY FOOTER ══ */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: isMobile ? "10px 12px" : "12px 32px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          maxWidth: 900, margin: "0 auto", flexWrap: "wrap", gap: 6,
        }}>
          <div style={{
            display: "flex", gap: isMobile ? 8 : 16, fontSize: isMobile ? 11 : 13,
            color: "#9CA3AF", flexWrap: "wrap",
          }}>
            <span>✅ <strong style={{ color: numDone === 30 ? "#10B981" : "#E5E7EB" }}>{numDone}/30</strong> Num</span>
            <span>✅ <strong style={{ color: frmDone === 20 ? "#10B981" : "#E5E7EB" }}>{frmDone}/20</strong> Form</span>
            <span>✅ <strong style={{ color: defDone === 10 ? "#10B981" : "#E5E7EB" }}>{defDone}/10</strong> Def</span>
          </div>
          <div style={{
            fontSize: isMobile ? 12 : 13, fontWeight: 700,
            color: pct >= 100 ? "#10B981" : pct >= 75 ? "#FBBF24" : pct >= 50 ? "#F59E0B" : "#6B7280",
          }}>
            {getMotivation(pct)}
          </div>
        </div>
      </div>
    </div>
  );
}
