"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isPaid: boolean;
  planType: string;
  subscriptionExpiry: string | null;
  purchaseDate: string | null;
  saleAmount: number;
  revenueShare: number;
}

interface Creator {
  id: string;
  creatorName: string;
  creatorCode: string;
  discountPercentage: number;
  revenueSharePercentage: number;
}

interface Stats {
  totalSignups: number;
  monthlyCount: number;
  yearlyCount: number;
  totalRevenueShare: number;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [data, setData] = useState<{ creator: Creator; stats: Stats; students: Student[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchCreatorData = async (fromDate = "", toDate = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("creator-token") || "";
      let url = "/api/creator/students";
      const params = new URLSearchParams();
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("creator-token");
          router.push("/creator/login");
          return;
        }
        throw new Error("Failed to fetch data");
      }

      const json = await res.json();
      setData(json);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const handleFilter = () => {
    fetchCreatorData(from, to);
  };

  const handleReset = () => {
    setFrom("");
    setTo("");
    fetchCreatorData("", "");
  };

  const handleLogout = () => {
    localStorage.removeItem("creator-token");
    // Clear cookies
    document.cookie = "creator-token=; Path=/; Max-Age=0; SameSite=Lax";
    router.push("/creator/login");
    router.refresh();
  };

  if (loading && !data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base, #0A0A0F)",
          color: "var(--text-muted, #9CA3AF)",
          fontFamily: "var(--font-body, sans-serif)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8, animation: "pulse 1.5s infinite" }}>⚡ Loading Portal...</div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>Fetching your dashboard & student stats</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base, #0A0A0F)",
          color: "#f87171",
          fontFamily: "var(--font-body, sans-serif)",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "var(--bg-surface, #11111A)",
            border: "1.5px solid rgba(239, 68, 68, 0.15)",
            padding: "30px 40px",
            borderRadius: 16,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontSize: 18, color: "#fff", marginBottom: 8 }}>Error Loading Portal</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted, #9CA3AF)", marginBottom: 20 }}>{error}</p>
          <button
            onClick={() => fetchCreatorData()}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "var(--accent-gold, #D4AF37)",
              color: "#000",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { creator, stats, students } = data;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base, #0A0A0F)",
        color: "var(--text-primary, #F3F4F6)",
        fontFamily: "var(--font-body, sans-serif)",
        padding: "32px 32px 80px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Navigation Bar / Top Bar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 24,
            borderBottom: "1px solid var(--bg-border, #1E1E2A)",
            marginBottom: 32,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display, inherit)",
                fontSize: 28,
                fontWeight: 700,
                color: "#FFF",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              👋 Welcome, {creator.creatorName}
            </h1>
            <div
              style={{
                fontFamily: "var(--font-tagline, inherit)",
                fontSize: 13,
                fontStyle: "italic",
                color: "var(--text-muted, #9CA3AF)",
                marginTop: 4,
              }}
            >
              Affiliate Code:{" "}
              <span
                style={{
                  color: "var(--accent-gold, #D4AF37)",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {creator.creatorCode.toUpperCase()}
              </span>{" "}
              · Discount: {creator.discountPercentage}% · Revenue Share: {creator.revenueSharePercentage}%
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)")}
          >
            Logout
          </button>
        </header>

        {/* Stats Row */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "var(--bg-surface, #11111A)",
              border: "1px solid var(--bg-border, #1E1E2A)",
              borderRadius: 14,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Total Signups
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#FFF" }}>{stats.totalSignups}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", marginTop: 4 }}>
              Students used code
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-surface, #11111A)",
              border: "1px solid var(--bg-border, #1E1E2A)",
              borderRadius: 14,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Monthly Subscribers
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#D4AF37" }}>{stats.monthlyCount}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", marginTop: 4 }}>
              ₹199 plan subscribers
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-surface, #11111A)",
              border: "1px solid var(--bg-border, #1E1E2A)",
              borderRadius: 14,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Yearly Subscribers
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#D4AF37" }}>{stats.yearlyCount}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", marginTop: 4 }}>
              ₹599 plan subscribers
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-surface, #11111A)",
              border: "1.5px solid rgba(212, 175, 55, 0.25)",
              borderRadius: 14,
              padding: "20px 24px",
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.02)",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              Revenue Share Earned
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#22c55e" }}>₹{stats.totalRevenueShare}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", marginTop: 4 }}>
              Calculated at {creator.revenueSharePercentage}% share
            </div>
          </div>
        </section>

        {/* Date Filter Bar */}
        <section
          style={{
            background: "var(--bg-surface, #11111A)",
            border: "1px solid var(--bg-border, #1E1E2A)",
            borderRadius: 14,
            padding: 20,
            marginBottom: 24,
            display: "flex",
            gap: 14,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", fontWeight: 600 }}>From Date</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{
                background: "var(--bg-elevated, #1A1A26)",
                border: "1px solid var(--bg-border, #2E2E3A)",
                padding: "8px 12px",
                borderRadius: 8,
                color: "#FFF",
                outline: "none",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted, #9CA3AF)", fontWeight: 600 }}>To Date</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{
                background: "var(--bg-elevated, #1A1A26)",
                border: "1px solid var(--bg-border, #2E2E3A)",
                padding: "8px 12px",
                borderRadius: 8,
                color: "#FFF",
                outline: "none",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleFilter}
              disabled={loading}
              style={{
                padding: "9px 18px",
                background: "var(--accent-gold, #D4AF37)",
                color: "#000",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                padding: "9px 18px",
                background: "var(--bg-elevated, #1A1A26)",
                border: "1px solid var(--bg-border, #2E2E3A)",
                color: "var(--text-muted, #9CA3AF)",
                fontSize: 13,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>

          {loading && (
            <span style={{ fontSize: 12, color: "var(--accent-gold, #D4AF37)", marginLeft: "auto", alignSelf: "center" }}>
              Refreshing details...
            </span>
          )}
        </section>

        {/* Students List Table */}
        <section
          style={{
            background: "var(--bg-surface, #11111A)",
            border: "1px solid var(--bg-border, #1E1E2A)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--bg-border, #1E1E2A)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#FFF", margin: 0 }}>Registered Students & Sales</h3>
          </div>

          {students.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted, #9CA3AF)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#FFF", marginBottom: 4 }}>No students found</div>
              <div style={{ fontSize: 12 }}>Try adjusting your date filters or check back later.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--bg-border, #1E1E2A)",
                      background: "rgba(255,255,255,0.01)",
                    }}
                  >
                    <th style={{ padding: "12px 24px", color: "var(--text-muted, #9CA3AF)", fontWeight: 600 }}>Student</th>
                    <th style={{ padding: "12px 24px", color: "var(--text-muted, #9CA3AF)", fontWeight: 600 }}>Email</th>
                    <th style={{ padding: "12px 24px", color: "var(--text-muted, #9CA3AF)", fontWeight: 600 }}>Registered On</th>
                    <th style={{ padding: "12px 24px", color: "var(--text-muted, #9CA3AF)", fontWeight: 600 }}>Subscription Plan</th>
                    <th style={{ padding: "12px 24px", color: "var(--text-muted, #9CA3AF)", fontWeight: 600 }}>Purchase Date</th>
                    <th style={{ padding: "12px 24px", color: "var(--text-muted, #9CA3AF)", fontWeight: 600, textAlign: "right" }}>Revenue Share</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      style={{
                        borderBottom: "1px solid var(--bg-border, #1E1E2A)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "16px 24px", fontWeight: 600, color: "#FFF" }}>{student.name}</td>
                      <td style={{ padding: "16px 24px", color: "var(--text-muted, #9CA3AF)" }}>{student.email}</td>
                      <td style={{ padding: "16px 24px", color: "var(--text-muted, #9CA3AF)" }}>
                        {new Date(student.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              student.planType === "FREE"
                                ? "rgba(156,163,175,0.1)"
                                : "rgba(212,175,55,0.15)",
                            color: student.planType === "FREE" ? "#9CA3AF" : "#D4AF37",
                            border:
                              student.planType === "FREE"
                                ? "1px solid rgba(156,163,175,0.2)"
                                : "1px solid rgba(212,175,55,0.3)",
                          }}
                        >
                          {student.planType}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--text-muted, #9CA3AF)" }}>
                        {student.purchaseDate
                          ? new Date(student.purchaseDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "right",
                          fontWeight: 700,
                          color: student.revenueShare > 0 ? "#22c55e" : "var(--text-muted, #9CA3AF)",
                        }}
                      >
                        {student.revenueShare > 0 ? `₹${student.revenueShare}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
