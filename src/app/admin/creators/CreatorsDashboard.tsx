"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Creator {
  id: string;
  creatorName: string;
  creatorCode: string;
  channelId: string | null;
  discountPercentage: number;
  revenueSharePercentage: number;
  createdAt: Date;
  userCount: number;
}

interface StudentSale {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isPaid: boolean;
  planType: string;
  purchaseDate: string | null;
  saleAmount: number;
  revenueShare: number;
}

interface SalesResponse {
  creator: Creator;
  stats: {
    totalSignups: number;
    monthlyCount: number;
    yearlyCount: number;
    totalRevenueShare: number;
  };
  students: StudentSale[];
}

const EMPTY_FORM = {
  creatorName: "",
  creatorCode: "",
  channelId: "",
  discountPercentage: "20",
  revenueSharePercentage: "20",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--bg-border)",
      borderRadius: 14, padding: "18px 22px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

export default function CreatorsDashboard({ creators }: { creators: Creator[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Drawer / Sales stats states
  const [viewingSalesCreator, setViewingSalesCreator] = useState<Creator | null>(null);
  const [salesData, setSalesData] = useState<SalesResponse | null>(null);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesError, setSalesError] = useState("");
  const [salesFrom, setSalesFrom] = useState("");
  const [salesTo, setSalesTo] = useState("");

  const totalUsers = creators.reduce((s, c) => s + c.userCount, 0);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEdit(c: Creator) {
    setForm({
      creatorName: c.creatorName,
      creatorCode: c.creatorCode,
      channelId: c.channelId ?? "",
      discountPercentage: String(c.discountPercentage),
      revenueSharePercentage: String(c.revenueSharePercentage ?? "20"),
    });
    setEditingId(c.id);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  async function handleSave() {
    setError("");
    const name = form.creatorName.trim();
    const code = form.creatorCode.trim();
    if (!name) { setError("Creator name is required."); return; }
    if (!code) { setError("Creator code is required."); return; }
    if (!/^[a-zA-Z0-9]+$/.test(code)) { setError("Creator code must be letters and numbers only (no spaces/symbols)."); return; }
    
    const discPct = Number(form.discountPercentage);
    if (!form.discountPercentage || isNaN(discPct) || discPct < 1 || discPct > 100) { setError("Discount must be between 1 and 100."); return; }

    const revShare = Number(form.revenueSharePercentage);
    if (!form.revenueSharePercentage || isNaN(revShare) || revShare < 0 || revShare > 100) { setError("Revenue share must be between 0 and 100."); return; }

    const token = localStorage.getItem("admin-token") ?? "";
    setSaving(true);
    try {
      const res = await fetch("/api/admin/creators", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          id: editingId,
          creatorName: name,
          creatorCode: code,
          channelId: form.channelId.trim() || null,
          discountPercentage: discPct,
          revenueSharePercentage: revShare,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSuccess(editingId ? "Creator updated." : "Creator added.");
      setShowForm(false);
      startTransition(() => router.refresh());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete creator "${name}"? This won't affect users who already used their code.`)) return;
    setDeleting(id);
    const token = localStorage.getItem("admin-token") ?? "";
    try {
      const res = await fetch("/api/admin/creators", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      startTransition(() => router.refresh());
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  }

  // Fetch drawer sales data
  const fetchSalesData = async (creatorCode: string, fromDate = "", toDate = "") => {
    setSalesLoading(true);
    setSalesError("");
    try {
      const token = localStorage.getItem("admin-token") ?? "";
      const params = new URLSearchParams({ code: creatorCode });
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);

      const res = await fetch(`/api/admin/creators/sales?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load sales data");
      const json = await res.json();
      setSalesData(json);
    } catch (err: any) {
      setSalesError(err.message || "Something went wrong fetching sales");
    } finally {
      setSalesLoading(false);
    }
  };

  const openSalesDrawer = (c: Creator) => {
    setViewingSalesCreator(c);
    setSalesFrom("");
    setSalesTo("");
    setSalesData(null);
    fetchSalesData(c.creatorCode, "", "");
  };

  const closeSalesDrawer = () => {
    setViewingSalesCreator(null);
    setSalesData(null);
  };

  const handleDrawerFilter = () => {
    if (viewingSalesCreator) {
      fetchSalesData(viewingSalesCreator.creatorCode, salesFrom, salesTo);
    }
  };

  const handleDrawerReset = () => {
    setSalesFrom("");
    setSalesTo("");
    if (viewingSalesCreator) {
      fetchSalesData(viewingSalesCreator.creatorCode, "", "");
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", boxSizing: "border-box",
    background: "var(--bg-elevated)", border: "1.5px solid var(--bg-border)",
    borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 14,
    color: "var(--text-primary)", outline: "none", transition: "border-color 0.15s ease",
  };

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1050, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: 0, marginBottom: 4 }}>
            Creator Onboarding
          </h1>
          <div style={{ fontFamily: "var(--font-tagline)", fontSize: 13, fontStyle: "italic", color: "var(--text-muted)" }}>
            Manage affiliate creator codes, discount rates, and track student sales revenue shares
          </div>
        </div>
        <button
          onClick={openAdd}
          style={{
            padding: "10px 22px", borderRadius: 10, cursor: "pointer",
            background: "var(--accent-gold)", color: "#0A0A0F",
            fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
            border: "none", letterSpacing: "0.02em", flexShrink: 0,
          }}
        >
          + Add Creator
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{
          padding: "12px 16px", marginBottom: 20, borderRadius: 10,
          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
          fontFamily: "var(--font-body)", fontSize: 13, color: "#22c55e",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          ✓ {success}
          <button onClick={() => setSuccess("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#22c55e", fontSize: 12 }}>✕</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Creators" value={creators.length} sub="active affiliate partners" />
        <StatCard label="Students via Creators" value={totalUsers} sub="used a creator code" />
        <StatCard label="Avg Discount" value={`${creators.length ? Math.round(creators.reduce((s, c) => s + c.discountPercentage, 0) / creators.length) : 0}%`} sub="across all creators" />
        <StatCard label="Top Creator" value={creators.sort((a, b) => b.userCount - a.userCount)[0]?.creatorName?.split(" ")[0] ?? "—"} sub={`${Math.max(...creators.map(c => c.userCount), 0)} students`} />
      </div>

      {/* Creator cards */}
      {creators.length === 0 ? (
        <div style={{
          padding: "60px 24px", textAlign: "center",
          background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: 16,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🤝</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)", marginBottom: 6 }}>No creators yet</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Add your first affiliate creator to start offering discount codes.</div>
          <button onClick={openAdd} style={{ padding: "10px 24px", borderRadius: 10, cursor: "pointer", background: "var(--accent-gold)", color: "#0A0A0F", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, border: "none" }}>
            + Add Creator
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1.8fr 1fr 80px 80px 80px 90px 170px",
            gap: 12, padding: "8px 18px",
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)",
            opacity: 0.6,
          }}>
            <span>Creator</span>
            <span>Code</span>
            <span>Discount</span>
            <span>Share</span>
            <span>Students</span>
            <span>Channel ID</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>

          {[...creators].sort((a, b) => b.userCount - a.userCount).map(c => (
            <div key={c.id} style={{
              display: "grid", gridTemplateColumns: "1.8fr 1fr 80px 80px 80px 90px 170px",
              gap: 12, padding: "16px 18px", alignItems: "center",
              background: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: 14, transition: "border-color 0.15s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-gold-border)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--bg-border)"}
            >
              {/* Name */}
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{c.creatorName}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  Added {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>

              {/* Code */}
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                color: "var(--accent-gold)",
                background: "var(--accent-gold-glow)",
                border: "1px solid var(--accent-gold-border)",
                borderRadius: 8, padding: "4px 10px",
                display: "inline-block", letterSpacing: "0.08em", width: "fit-content",
              }}>
                {c.creatorCode}
              </div>

              {/* Discount */}
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
                color: "#22c55e",
              }}>
                {c.discountPercentage}%
              </div>

              {/* Share */}
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
                color: "var(--accent-gold)",
              }}>
                {c.revenueSharePercentage ?? 20}%
              </div>

              {/* Students */}
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text-primary)" }}>{c.userCount}</div>
              </div>

              {/* Channel ID */}
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {c.channelId || <span style={{ opacity: 0.4 }}>not set</span>}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                <button
                  onClick={() => openSalesDrawer(c)}
                  style={{
                    padding: "6px 10px", borderRadius: 8,
                    background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)",
                    fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                    color: "var(--accent-gold)", cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,175,55,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; }}
                >
                  Sales
                </button>
                <button
                  onClick={() => openEdit(c)}
                  style={{
                    padding: "6px 10px", borderRadius: 8,
                    background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
                    fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
                    color: "var(--text-secondary)", cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bg-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.creatorName)}
                  disabled={deleting === c.id}
                  style={{
                    padding: "6px 10px", borderRadius: 8,
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                    fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500,
                    color: "#f87171", cursor: deleting === c.id ? "wait" : "pointer",
                    transition: "all 0.15s ease", opacity: deleting === c.id ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                >
                  {deleting === c.id ? "…" : "Del"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {showForm && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{
            background: "var(--bg-surface)",
            border: "1.5px solid var(--bg-border)",
            borderRadius: 20, padding: "32px 28px",
            maxWidth: 480, width: "100%",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            animation: "fadeIn 200ms ease-out both",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {editingId ? "Edit Creator" : "Add Creator"}
                </div>
                <div style={{ fontFamily: "var(--font-tagline)", fontSize: 12, fontStyle: "italic", color: "var(--text-muted)", marginTop: 2 }}>
                  {editingId ? "Update the creator's details below" : "Fill in the details to add a new affiliate partner"}
                </div>
              </div>
              <button onClick={closeForm} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18, padding: 4 }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Creator Name */}
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Creator / Channel Name *
                </label>
                <input
                  style={inp}
                  placeholder="e.g. Beast Learners"
                  value={form.creatorName}
                  onChange={e => setForm(f => ({ ...f, creatorName: e.target.value }))}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--accent-gold-border)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--bg-border)"}
                />
              </div>

              {/* Creator Code */}
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Creator Code * <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(lowercase, no spaces — shared with students)</span>
                </label>
                <input
                  style={{ ...inp, letterSpacing: "0.08em" }}
                  placeholder="e.g. bl2047"
                  value={form.creatorCode}
                  onChange={e => setForm(f => ({ ...f, creatorCode: e.target.value.replace(/[^a-zA-Z0-9]/g, "") }))}
                  disabled={!!editingId}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--accent-gold-border)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--bg-border)"}
                />
                {editingId && <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 4, opacity: 0.6 }}>Code cannot be changed after creation</div>}
              </div>

              {/* Discount */}
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Discount Percentage * <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(applied to paid plans)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    style={{ ...inp, paddingRight: 36 }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 20"
                    value={form.discountPercentage}
                    onChange={e => {
                      const v = e.target.value.replace(/[^0-9]/g, '');
                      setForm(f => ({ ...f, discountPercentage: v }));
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--accent-gold-border)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--bg-border)"}
                  />
                  <span style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", pointerEvents: "none",
                  }}>%</span>
                </div>
              </div>

              {/* Revenue Share */}
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Revenue Share Percentage * <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(payout from subscription sales)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    style={{ ...inp, paddingRight: 36 }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 20"
                    value={form.revenueSharePercentage}
                    onChange={e => {
                      const v = e.target.value.replace(/[^0-9]/g, '');
                      setForm(f => ({ ...f, revenueSharePercentage: v }));
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--accent-gold-border)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--bg-border)"}
                  />
                  <span style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", pointerEvents: "none",
                  }}>%</span>
                </div>
              </div>

              {/* Channel ID */}
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  YouTube Channel ID <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </label>
                <input
                  style={inp}
                  placeholder="e.g. UCxxxxxxxxxxxxxxx"
                  value={form.channelId}
                  onChange={e => setForm(f => ({ ...f, channelId: e.target.value.trim() }))}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--accent-gold-border)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--bg-border)"}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  fontFamily: "var(--font-body)", fontSize: 13, color: "#f87171",
                }}>
                  {error}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1, padding: "13px 24px", borderRadius: 10, cursor: saving ? "wait" : "pointer",
                    background: "var(--accent-gold)", color: "#0A0A0F",
                    fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                    border: "none", opacity: saving ? 0.6 : 1, transition: "opacity 0.15s ease",
                  }}
                >
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Add Creator"}
                </button>
                <button
                  onClick={closeForm}
                  style={{
                    padding: "13px 20px", borderRadius: 10, cursor: "pointer",
                    background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
                    fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SALES VIEWER DRAWER / MODAL ── */}
      {viewingSalesCreator && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeSalesDrawer(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 600,
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
            display: "flex", justifyContent: "flex-end", // Align right to make it a slide-over
          }}
        >
          <div style={{
            background: "var(--bg-surface)",
            borderLeft: "1.5px solid var(--bg-border)",
            width: "100%", maxWidth: 680, height: "100vh",
            display: "flex", flexDirection: "column",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
            animation: "slideIn 250ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}>
            {/* Header */}
            <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid var(--bg-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-primary)", margin: 0, marginBottom: 4 }}>
                  Sales & Referrals Overview
                </h2>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>
                  Creator: <strong style={{ color: "#FFF" }}>{viewingSalesCreator.creatorName}</strong> (Code: <span style={{ color: "var(--accent-gold)", fontWeight: 700 }}>{viewingSalesCreator.creatorCode}</span>)
                </div>
              </div>
              <button onClick={closeSalesDrawer} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 20, padding: 4 }}>✕</button>
            </div>

            {/* Date Filters inside Drawer */}
            <div style={{ padding: "16px 28px", background: "rgba(255,255,255,0.01)", borderBottom: "1px solid var(--bg-border)", display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>From</label>
                <input
                  type="date"
                  value={salesFrom}
                  onChange={e => setSalesFrom(e.target.value)}
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", padding: "6px 10px", borderRadius: 8, color: "#FFF", fontSize: 12, outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>To</label>
                <input
                  type="date"
                  value={salesTo}
                  onChange={e => setSalesTo(e.target.value)}
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", padding: "6px 10px", borderRadius: 8, color: "#FFF", fontSize: 12, outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={handleDrawerFilter} disabled={salesLoading} style={{ padding: "7px 14px", background: "var(--accent-gold)", color: "#000", fontWeight: 700, fontSize: 12, borderRadius: 8, border: "none", cursor: "pointer" }}>Filter</button>
                <button onClick={handleDrawerReset} disabled={salesLoading} style={{ padding: "7px 14px", background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: "var(--text-muted)", fontSize: 12, borderRadius: 8, cursor: "pointer" }}>Reset</button>
              </div>
              {salesLoading && <span style={{ fontSize: 11, color: "var(--accent-gold)", alignSelf: "center", marginLeft: "auto" }}>Loading...</span>}
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
              {salesError ? (
                <div style={{ padding: "20px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", fontSize: 13 }}>
                  ✕ {salesError}
                </div>
              ) : !salesData ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading metrics...</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  {/* Stats Row inside Drawer */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Signups</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#FFF" }}>{salesData.stats.totalSignups}</div>
                    </div>
                    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Paid Subs</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent-gold)" }}>{salesData.stats.monthlyCount + salesData.stats.yearlyCount}</div>
                    </div>
                    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Revenue Share</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#22c55e" }}>₹{salesData.stats.totalRevenueShare}</div>
                    </div>
                  </div>

                  {/* Student Table */}
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#FFF", margin: 0, marginBottom: 12 }}>Referrals & Sales List</h3>
                    {salesData.students.length === 0 ? (
                      <div style={{ padding: "30px", textAlign: "center", border: "1px dashed var(--bg-border)", borderRadius: 12, color: "var(--text-muted)", fontSize: 13 }}>
                        No referrals found matching parameters.
                      </div>
                    ) : (
                      <div style={{ border: "1px solid var(--bg-border)", borderRadius: 12, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                          <thead>
                            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--bg-border)" }}>
                              <th style={{ padding: "10px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Student</th>
                              <th style={{ padding: "10px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Registered</th>
                              <th style={{ padding: "10px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Plan</th>
                              <th style={{ padding: "10px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Purchased</th>
                              <th style={{ padding: "10px 16px", color: "var(--text-muted)", fontWeight: 600, textAlign: "right" }}>Share</th>
                            </tr>
                          </thead>
                          <tbody>
                            {salesData.students.map(s => (
                              <tr key={s.id} style={{ borderBottom: "1px solid var(--bg-border)" }}>
                                <td style={{ padding: "12px 16px" }}>
                                  <div style={{ fontWeight: 600, color: "#FFF" }}>{s.name}</div>
                                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{s.email}</div>
                                </td>
                                <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>
                                  {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </td>
                                <td style={{ padding: "12px 16px" }}>
                                  <span style={{
                                    padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                                    background: s.planType === "FREE" ? "rgba(255,255,255,0.05)" : "rgba(212,175,55,0.15)",
                                    color: s.planType === "FREE" ? "var(--text-muted)" : "var(--accent-gold)",
                                  }}>{s.planType}</span>
                                </td>
                                <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>
                                  {s.purchaseDate ? new Date(s.purchaseDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                                </td>
                                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: s.revenueShare > 0 ? "#22c55e" : "var(--text-muted)" }}>
                                  {s.revenueShare > 0 ? `₹${s.revenueShare}` : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "20px 28px", borderTop: "1px solid var(--bg-border)", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
              <button onClick={closeSalesDrawer} style={{ padding: "10px 20px", background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: "var(--text-primary)", fontSize: 13, borderRadius: 8, cursor: "pointer" }}>Close Panel</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Anim rules for slideIn */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
