"use client";

const POLICY_LINKS = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Terms & Conditions", href: "/policies/terms-and-conditions" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Delivery Policy", href: "/policies/delivery-policy" },
  { label: "Contact Us", href: "/policies/contact-us" },
];

const INSTAGRAM_URL =
  "https://www.instagram.com/savioursai?igsh=MTRqcGRlZWc0MmJjeg%3D%3D&utm_source=qr";

function linkStyle(): React.CSSProperties {
  return {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--text-muted)",
    textDecoration: "none",
    transition: "color 0.2s ease",
  };
}

export default function Footer() {
  const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--text-primary)");
  const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--text-muted)");

  return (
    <footer
      style={{
        padding: "52px 24px 40px",
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
        {/* Top row: brand + account links */}
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

          <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
            <a href="/login" style={linkStyle()} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>Sign In</a>
            <a href="/signup" style={linkStyle()} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>Start Free</a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...linkStyle(), display: "inline-flex", alignItems: "center", gap: 6 }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
              </svg>
              Instagram
            </a>
          </div>
        </div>

        {/* Policy links row */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", paddingTop: 22, borderTop: "1px solid var(--bg-border)" }}>
          {POLICY_LINKS.map((p) => (
            <a key={p.href} href={p.href} style={linkStyle()} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              {p.label}
            </a>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: 12, color: "var(--text-muted)", opacity: 0.7 }}>
            Saviours AI · 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
