"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { trpc } from "@/lib/trpc/client";
import { EBOOK_SUBJECTS } from "@/data/ebooks-config";
import { AppIcon } from "@/components/ui/AppIcon";
import { RazorpayButton } from "@/components/RazorpayButton";
import { EbookSpinWheel } from "@/components/ebooks/EbookSpinWheel";
import {
  EBOOK_BUNDLE_FEATURES,
  EBOOK_BUNDLE_PRICE,
  EBOOK_PREVIEW_PAGES,
  EBOOK_SINGLE_PRICE,
  ownedEbookCount,
  ownsEbook,
} from "@/lib/ebook-access";

export default function EbooksLibraryPage() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const { data: profile } = trpc.dashboard.getProfile.useQuery();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isDemo = profile?.isDemo === true;
  const hasAll = profile?.ebooksUnlocked === true;
  const owned = ownedEbookCount(profile);
  const name = profile?.name ?? "";
  const email = profile?.email ?? "";

  return (
    <div style={{ minHeight: "100vh", padding: isMobile ? "20px 16px 100px" : "32px 40px 60px", animation: "pageEnter 0.5s ease-out", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 20 : 28, maxWidth: 820 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-gold-glow)", border: "1px solid var(--accent-gold-border)", display: "grid", placeItems: "center" }}>
            <AppIcon name="book" size={20} color="var(--accent-gold)" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 26 : 34, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", margin: 0 }}>
            Sidekick E-books
          </h1>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", margin: "4px 0 0", lineHeight: 1.6 }}>
          Ten exam-focused ICSE companions. Preview the first {EBOOK_PREVIEW_PAGES} pages of any book free, buy one for ₹{EBOOK_SINGLE_PRICE},
          or get every e-book plus Pro for ₹{EBOOK_BUNDLE_PRICE}.
        </p>
        {profile && !isDemo && (
          <div style={{ marginTop: 10, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)" }}>
            You own <strong style={{ color: "var(--accent-gold)" }}>{owned}</strong> of {EBOOK_SUBJECTS.length}
            {hasAll ? " · Bundle unlocked, including upcoming e-books" : ""}
          </div>
        )}
      </div>

      {/* Spin to win */}
      {profile?.canSpinForEbook && (
        <div style={{ marginBottom: 16, maxWidth: 820 }}>
          <EbookSpinWheel inline />
        </div>
      )}

      {/* Bundle */}
      {profile && !hasAll && (
        <div style={{
          marginBottom: isMobile ? 22 : 30, borderRadius: 20, border: "1px solid var(--accent-gold-border)",
          background: "linear-gradient(135deg, rgba(0,212,255,0.10), var(--bg-surface) 60%)",
          padding: isMobile ? "20px 18px" : "24px 28px",
          display: "flex", gap: isMobile ? 16 : 28, alignItems: isMobile ? "stretch" : "center", flexDirection: isMobile ? "column" : "row",
        }}>
          <div style={{ display: "flex", flexShrink: 0, paddingLeft: 14 }} aria-hidden>
            {EBOOK_SUBJECTS.slice(0, 4).map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.id} src={`/ebook-covers/${s.id}.webp`} alt="" width={58} height={82}
                style={{ borderRadius: 6, marginLeft: -14, border: "1px solid var(--bg-border)", boxShadow: "0 6px 16px rgba(0,0,0,.4)", transform: `rotate(${(i - 1.5) * 5}deg)` }} />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "var(--accent-gold)", font: "700 10px var(--font-body)", letterSpacing: ".14em", textTransform: "uppercase" }}>Sidekick bundle · best value</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "4px 0 6px", flexWrap: "wrap" }}>
              <span style={{ color: "var(--text-primary)", font: "700 30px var(--font-display)", lineHeight: 1 }}>₹{EBOOK_BUNDLE_PRICE}</span>
              <span style={{ color: "var(--text-muted)", font: "400 13px var(--font-body)" }}><s>₹{EBOOK_SINGLE_PRICE * EBOOK_SUBJECTS.length}</s> · one-time</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
              {EBOOK_BUNDLE_FEATURES.map((f) => (
                <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", font: "400 12px var(--font-body)" }}>
                  <AppIcon name="check" size={13} color="var(--accent-gold)" /> {f}
                </span>
              ))}
            </div>
          </div>
          <div style={{ width: isMobile ? "100%" : 230, flexShrink: 0 }}>
            {isDemo ? (
              <button className="btn-gold" style={{ width: "100%" }} onClick={() => router.push("/signup?from=demo")}>Create account →</button>
            ) : (
              <RazorpayButton type="EBOOK_BUNDLE" email={email} name={name} buttonText={`Get the bundle · ₹${EBOOK_BUNDLE_PRICE}`} successRedirect="/dashboard/ebooks" />
            )}
          </div>
        </div>
      )}

      {/* Library */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 12 : 18 }}>
        {EBOOK_SUBJECTS.map((subject, i) => {
          const isOwned = ownsEbook(profile, subject.id);
          const isHovered = hoveredId === subject.id;
          const isPrize = profile?.ebookSpinPrize === subject.id;
          return (
            <div
              key={subject.id}
              onMouseEnter={() => setHoveredId(subject.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: "flex", gap: 16, padding: isMobile ? 14 : 18, borderRadius: 18,
                background: isHovered ? "rgba(19,19,31,0.85)" : "rgba(19,19,31,0.55)",
                border: `1px solid ${isOwned ? "rgba(34,197,94,0.3)" : isHovered ? "var(--accent-gold-border)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                transform: isHovered ? "translateY(-3px)" : "none",
                animation: `slideInUp 0.5s ease-out ${i * 0.05}s both`,
              }}
            >
              <button onClick={() => router.push(`/dashboard/ebooks/${subject.id}`)} aria-label={`Open ${subject.name}`} style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/ebook-covers/${subject.id}.webp`} alt={`${subject.name} Sidekick cover`} width={88} height={124}
                  style={{ display: "block", borderRadius: 8, border: "1px solid var(--bg-border)", boxShadow: "0 8px 22px rgba(0,0,0,.4)" }} />
              </button>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{subject.name}</h3>
                  <span style={{
                    font: "700 9px var(--font-body)", letterSpacing: ".1em", textTransform: "uppercase", borderRadius: 100, padding: "3px 8px",
                    color: isOwned ? "#22c55e" : "var(--text-muted)",
                    background: isOwned ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isOwned ? "rgba(34,197,94,0.3)" : "var(--bg-border)"}`,
                  }}>{isOwned ? (isPrize ? "Won · owned" : "Owned") : "Free preview"}</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.45, flex: 1 }}>{subject.description}</p>
                {isOwned ? (
                  <button className="btn-gold" style={{ padding: "9px 14px", fontSize: 13 }} onClick={() => router.push(`/dashboard/ebooks/${subject.id}`)}>Read →</button>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button className="btn-ghost" style={{ padding: "9px 10px", fontSize: 12 }} onClick={() => router.push(`/dashboard/ebooks/${subject.id}`)}>Preview</button>
                    {isDemo ? (
                      <button className="btn-ghost" style={{ padding: "9px 10px", fontSize: 12 }} onClick={() => router.push("/signup?from=demo")}>₹{EBOOK_SINGLE_PRICE}</button>
                    ) : (
                      <RazorpayButton type="EBOOK_SINGLE" size="sm" ebookId={subject.id} email={email} name={name} buttonText={`Buy ₹${EBOOK_SINGLE_PRICE}`} successRedirect={`/dashboard/ebooks/${subject.id}`} />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
