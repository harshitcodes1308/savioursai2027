"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        // Also store token in localStorage so API calls can read it
        // regardless of cookie Path scope
        if (data.token) localStorage.setItem("admin-token", data.token);
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "var(--bg-base)",
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--bg-surface)",
        border: "1.5px solid rgba(0,212,255,0.15)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "0 0 60px rgba(0,212,255,0.06), var(--shadow-card)",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #00D4FF 0%, #00A3CC 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 900, color: "#0D0D1A",
            boxShadow: "0 0 30px rgba(0,212,255,0.3)",
          }}>
            S
          </div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 22, fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}>
              Admin Panel
            </h1>
            <p style={{
              fontFamily: "var(--font-tagline)",
              fontSize: 11, fontWeight: 400, fontStyle: "italic",
              color: "rgba(180,175,200,0.6)",
              marginTop: 4,
            }}>
              Saviours AI — Restricted Access
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 12, textAlign: "center",
            padding: "8px 14px", borderRadius: 10,
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.15)",
            color: "var(--status-red)",
          }}>
            {error}
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sa-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sa-input"
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-gold" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Authenticating..." : "Access Admin Panel"}
        </button>

        {/* Footer */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: 11, textAlign: "center",
          color: "var(--text-muted)",
        }}>
          🔒 This panel is restricted to authorized admins only
        </p>
      </form>
    </div>
  );
}
