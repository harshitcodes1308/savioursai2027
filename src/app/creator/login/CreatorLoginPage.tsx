"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatorLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/creator/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem("creator-token", data.token);
        }
        router.push("/creator/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "var(--bg-base, #0A0A0F)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--bg-surface, #11111A)",
          border: "1.5px solid rgba(212, 175, 55, 0.15)", // Gold tint border
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(212, 175, 55, 0.03), 0 20px 40px rgba(0,0,0,0.5)",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)", // Gold gradient
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 900,
              color: "#0A0A0F",
              boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)",
            }}
          >
            C
          </div>
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "var(--font-display, inherit)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary, #F3F4F6)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Creator Portal
            </h1>
            <p
              style={{
                fontFamily: "var(--font-tagline, inherit)",
                fontSize: 11,
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(180, 175, 200, 0.6)",
                marginTop: 6,
                lineHeight: 1.4,
              }}
            >
              Saviours AI — Creator Dashboard login
            </p>
          </div>
        </div>

        {/* Credentials reminder banner */}
        <div
          style={{
            background: "rgba(212, 175, 55, 0.05)",
            border: "1px dashed rgba(212, 175, 55, 0.25)",
            borderRadius: 10,
            padding: "10px 14px",
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: 12,
            color: "rgba(212, 175, 55, 0.9)",
            lineHeight: 1.4,
          }}
        >
          🔑 <strong>Username</strong>: Your channel/creator name as registered.<br />
          🔒 <strong>Password</strong>: <code>creator@123</code>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 12,
              textAlign: "center",
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              color: "#f87171",
            }}
          >
            ✕ {error}
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted, #9CA3AF)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Username (Channel Name)
            </label>
            <input
              type="text"
              placeholder="e.g. Beast Learners"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                background: "var(--bg-elevated, #1A1A26)",
                border: "1.5px solid var(--bg-border, #2E2E3A)",
                color: "#FFF",
                fontSize: 14,
                outline: "none",
                fontFamily: "var(--font-body, sans-serif)",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-gold, #D4AF37)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--bg-border, #2E2E3A)")}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted, #9CA3AF)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                background: "var(--bg-elevated, #1A1A26)",
                border: "1.5px solid var(--bg-border, #2E2E3A)",
                color: "#FFF",
                fontSize: 14,
                outline: "none",
                fontFamily: "var(--font-body, sans-serif)",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-gold, #D4AF37)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--bg-border, #2E2E3A)")}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px 24px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)",
            color: "#0A0A0F",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            boxShadow: "0 4px 15px rgba(212, 175, 55, 0.15)",
            fontFamily: "var(--font-body, sans-serif)",
            transition: "all 0.15s ease",
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.transform = "none";
          }}
        >
          {loading ? "Verifying..." : "Access Dashboard"}
        </button>

        {/* Back to student site links */}
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: 11,
            textAlign: "center",
            color: "var(--text-muted, #9CA3AF)",
            margin: 0,
          }}
        >
          🔒 Restricted access. For affiliate creators only.
        </p>
      </form>
    </div>
  );
}
