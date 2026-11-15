"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { RazorpayButton } from "@/components/RazorpayButton";
import { AppIcon } from "@/components/ui/AppIcon";
import { EBOOK_BUNDLE_FEATURES, EBOOK_BUNDLE_PRICE, EBOOK_SINGLE_PRICE } from "@/lib/ebook-access";

/** Buy options for one ebook: ₹49 single, or the ₹299 bundle (all ebooks + Pro). */
export function EbookBuyPanel({ ebookId, ebookName, compact = false }: { ebookId: string; ebookName: string; compact?: boolean }) {
  const router = useRouter();
  const { data: profile } = trpc.dashboard.getProfile.useQuery();
  const isDemo = profile?.isDemo === true;
  const name = profile?.name ?? "";
  const email = profile?.email ?? "";
  const hasBundle = profile?.ebooksUnlocked === true;

  if (isDemo) {
    return (
      <div style={{ display: "grid", gap: 10, textAlign: "center" }}>
        <p style={{ margin: 0, color: "var(--text-muted)", font: "400 13px/1.6 var(--font-body)" }}>
          Create a free account to buy {ebookName} for ₹{EBOOK_SINGLE_PRICE}, or get every Sidekick e-book plus Pro for ₹{EBOOK_BUNDLE_PRICE}.
        </p>
        <button className="btn-gold" onClick={() => router.push("/signup?from=demo")}>Create account →</button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
      <div style={card}>
        <div style={eyebrow}>This e-book</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0 4px" }}>
          <span style={price}>₹{EBOOK_SINGLE_PRICE}</span>
          <span style={{ color: "var(--text-muted)", font: "400 12px var(--font-body)" }}>one-time</span>
        </div>
        <p style={note}>Full {ebookName} Sidekick, yours to keep.</p>
        <RazorpayButton
          type="EBOOK_SINGLE"
          ebookId={ebookId}
          email={email}
          name={name}
          buttonText={`Buy ${ebookName} · ₹${EBOOK_SINGLE_PRICE}`}
          successRedirect={`/dashboard/ebooks/${ebookId}`}
        />
      </div>

      {!hasBundle && (
        <div style={{ ...card, border: "1px solid var(--accent-gold-border)", background: "linear-gradient(145deg, rgba(0,212,255,0.08), var(--bg-surface))" }}>
          <div style={{ ...eyebrow, color: "var(--accent-gold)" }}>Best value · Sidekick bundle</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0 4px" }}>
            <span style={price}>₹{EBOOK_BUNDLE_PRICE}</span>
            <span style={{ color: "var(--text-muted)", font: "400 12px var(--font-body)" }}>
              <s>₹{EBOOK_SINGLE_PRICE * 10}</s> one-time
            </span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 12px", display: "grid", gap: 5 }}>
            {EBOOK_BUNDLE_FEATURES.map((f) => (
              <li key={f} style={{ display: "flex", gap: 7, alignItems: "center", color: "var(--text-secondary)", font: "400 12px var(--font-body)" }}>
                <AppIcon name="check" size={13} color="var(--accent-gold)" /> {f}
              </li>
            ))}
          </ul>
          <RazorpayButton
            type="EBOOK_BUNDLE"
            email={email}
            name={name}
            buttonText={`Get all e-books + Pro · ₹${EBOOK_BUNDLE_PRICE}`}
            successRedirect="/dashboard/ebooks"
          />
        </div>
      )}
    </div>
  );
}

const card: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--bg-border)",
  borderRadius: 14,
  padding: 18,
  display: "flex",
  flexDirection: "column",
};
const eyebrow: React.CSSProperties = {
  color: "var(--text-muted)", font: "700 10px var(--font-body)", letterSpacing: ".12em", textTransform: "uppercase",
};
const price: React.CSSProperties = {
  color: "var(--text-primary)", font: "700 30px var(--font-display)", lineHeight: 1,
};
const note: React.CSSProperties = {
  margin: "0 0 12px", color: "var(--text-muted)", font: "400 12px/1.55 var(--font-body)", flex: 1,
};
