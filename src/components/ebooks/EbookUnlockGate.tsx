"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { RazorpayButton } from "@/components/RazorpayButton";

type ReferralDetails = {
  referralLink: string;
  signedUpCount: number;
  qualifiedCount: number;
  ebooksUnlocked: boolean;
};

export function EbookUnlockGate({ name, email }: { name: string; email: string }) {
  const [details, setDetails] = useState<ReferralDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/referrals/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load your referral link");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        if (data.ebooksUnlocked) {
          window.location.reload();
          return;
        }
        setDetails(data);
      })
      .catch((cause) => active && setError(cause.message));
    return () => { active = false; };
  }, []);

  const copyLink = async () => {
    if (!details?.referralLink) return;
    await navigator.clipboard.writeText(details.referralLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const card = {
    background: "rgba(16, 18, 26, 0.86)",
    border: "1px solid var(--bg-border)",
    borderRadius: 16,
    padding: 24,
  } as const;

  return (
    <div style={{ minHeight: "100vh", padding: "clamp(24px, 5vw, 56px)", display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 920 }}>
        <div style={{ textAlign: "center", maxWidth: 650, margin: "0 auto 28px" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 12, display: "grid", placeItems: "center", background: "var(--accent-gold-glow)", border: "1px solid var(--accent-gold-border)", color: "var(--accent-gold)" }}>
            <AppIcon name="book" size={23} />
          </div>
          <div style={{ color: "var(--accent-gold)", font: "700 11px var(--font-body)", letterSpacing: ".14em", marginBottom: 10 }}>SIDEKICK EBOOKS</div>
          <h1 style={{ margin: 0, color: "var(--text-primary)", font: "700 clamp(28px, 4vw, 40px) var(--font-display)", letterSpacing: "-.03em" }}>Choose how you unlock the library</h1>
          <p style={{ margin: "12px auto 0", color: "var(--text-muted)", font: "400 14px/1.7 var(--font-body)" }}>Sidekick Ebooks are a separate add-on and are not included automatically with the Free or Pro plan.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 16 }}>
          <section style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", color: "var(--accent-gold)", background: "var(--accent-gold-glow)" }}><AppIcon name="users" size={20} /></div>
              <div>
                <div style={{ color: "var(--text-primary)", font: "700 18px var(--font-display)" }}>Refer one friend</div>
                <div style={{ color: "var(--text-muted)", font: "400 12px var(--font-body)", marginTop: 3 }}>Unlock without paying</div>
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", font: "400 13px/1.65 var(--font-body)", margin: "0 0 16px" }}>Share your personal link. When one friend signs up through it and buys the ₹99 Pro plan, your Sidekick Ebooks unlock automatically.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 44, padding: "7px 7px 7px 12px", border: "1px solid var(--bg-border)", background: "var(--bg-base)", borderRadius: 10 }}>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: details ? "var(--text-secondary)" : "var(--text-muted)", font: "400 12px var(--font-body)" }}>{details?.referralLink || (error || "Preparing your link...")}</span>
              <button onClick={copyLink} disabled={!details} style={{ minWidth: 84, height: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 7, border: "1px solid var(--accent-gold-border)", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", cursor: details ? "pointer" : "wait", font: "600 12px var(--font-body)" }}>
                <AppIcon name={copied ? "check" : "copy"} size={14} /> {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--bg-border)", display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", font: "400 12px var(--font-body)" }}>
              <AppIcon name={details?.qualifiedCount ? "check-circle" : "clock"} size={15} color={details?.qualifiedCount ? "var(--status-green)" : "var(--text-muted)"} />
              {details?.qualifiedCount ? "Referral completed — access is being refreshed" : `${details?.signedUpCount ?? 0} signed up · 1 Pro purchase required`}
            </div>
          </section>

          <section style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", color: "var(--accent-gold)", background: "var(--accent-gold-glow)" }}><AppIcon name="lock" size={20} /></div>
              <div>
                <div style={{ color: "var(--text-primary)", font: "700 18px var(--font-display)" }}>Buy direct access</div>
                <div style={{ color: "var(--text-muted)", font: "400 12px var(--font-body)", marginTop: 3 }}>One payment, full library</div>
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", font: "400 13px/1.65 var(--font-body)", margin: "0 0 18px" }}>Get all ten Sidekick subject ebooks in the in-platform reader. This purchase unlocks the ebook library only.</p>
            <div style={{ padding: "16px 0", marginBottom: 14, borderTop: "1px solid var(--bg-border)", borderBottom: "1px solid var(--bg-border)" }}>
              <strong style={{ color: "var(--text-primary)", font: "700 34px var(--font-display)" }}>₹79</strong>
              <span style={{ marginLeft: 8, color: "var(--text-muted)", font: "400 12px var(--font-body)" }}>one-time</span>
            </div>
            <RazorpayButton amount={79} type="EBOOKS" email={email} name={name} buttonText="Unlock Sidekick Ebooks — ₹79" successRedirect="/dashboard/ebooks" onSuccess={() => window.location.assign("/dashboard/ebooks")} />
          </section>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", font: "400 11px/1.6 var(--font-body)", margin: "18px 0 0" }}>Referral rewards unlock Sidekick Ebooks only. They do not unlock Pro plan features.</p>
      </div>
    </div>
  );
}
