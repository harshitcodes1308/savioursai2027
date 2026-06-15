"use client";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "48px 24px 40px",
        borderTop: "1px solid var(--bg-border)",
        background: "var(--bg-base)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
              <path d="M24 4L44 18L24 32L4 18L24 4Z" fill="rgba(0,212,255,0.12)" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.18em", color: "var(--text-primary)", textTransform: "uppercase" }}>
              Saviours AI
            </span>
          </div>

          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            <a href="/login" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Sign In</a>
            <a href="/signup" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Start Free</a>
            <a href="/dashboard/policies" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Privacy</a>
            <a href="https://www.youtube.com/@ClarifyKnowledge" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>YouTube</a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>
            Built by the team behind{" "}
            <span style={{ color: "var(--text-secondary)" }}>Clarify Knowledge</span> — 180K+ students reached.
          </span>
          <span style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: 12, color: "var(--text-muted)", opacity: 0.7 }}>
            Saviours AI · 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
