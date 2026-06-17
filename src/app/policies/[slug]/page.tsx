import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { POLICIES } from "@/lib/policies";

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES.find((p) => p.slug === slug);
  return { title: policy ? `${policy.title} — Saviours AI` : "Policy — Saviours AI" };
}

export default async function PublicPolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES.find((p) => p.slug === slug);
  if (!policy) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "clamp(60px, 10vw, 110px) 24px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Top nav: home + diamond */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            marginBottom: 36,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M24 4L44 18L24 44L4 18L24 4Z" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />
            <path d="M24 4L44 18L24 32L4 18L24 4Z" fill="rgba(0,212,255,0.12)" />
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.22em", color: "var(--text-secondary)", textTransform: "uppercase" }}>
            ← Back to Saviours AI
          </span>
        </Link>

        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--bg-border)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(24px, 5vw, 44px)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 5vw, 40px)",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 24px",
              paddingBottom: 18,
              borderBottom: "1px solid var(--bg-border)",
              fontWeight: 700,
            }}
          >
            {policy.title}
          </h1>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
            }}
          >
            {policy.content}
          </div>
        </div>

        {/* Other policies */}
        <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {POLICIES.filter((p) => p.slug !== slug).map((p) => (
            <Link
              key={p.slug}
              href={`/policies/${p.slug}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12.5,
                color: "var(--text-muted)",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 100,
                border: "1px solid var(--bg-border)",
                background: "var(--bg-surface)",
              }}
            >
              {p.title}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
