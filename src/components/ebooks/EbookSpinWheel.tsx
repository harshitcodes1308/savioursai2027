"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { trpc } from "@/lib/trpc/client";
import { EBOOK_SUBJECTS } from "@/data/ebooks-config";
import { EBOOK_BUNDLE_PRICE } from "@/lib/ebook-access";
import { AppIcon } from "@/components/ui/AppIcon";

const N = EBOOK_SUBJECTS.length;
const SEG = 360 / N;
const R = 190;
const SPIN_MS = 5200;
const DISMISS_KEY = "saviours-ebook-spin-dismissed";
export const EBOOK_SPIN_VISIBILITY_EVENT = "saviours:ebook-spin-visibility";

type Phase = "idle" | "spinning" | "won" | "error";

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: r * Math.sin(a), y: -r * Math.cos(a) };
}

function wedge(i: number) {
  const a = polar(R, i * SEG);
  const b = polar(R, (i + 1) * SEG);
  return `M0 0 L${a.x} ${a.y} A${R} ${R} 0 0 1 ${b.x} ${b.y} Z`;
}

/**
 * Spin-the-wheel: one free Sidekick ebook per free account. The server picks
 * the prize; the wheel animates to it.
 *
 * - `autoOpen`: opens itself once per browser session (used in the dashboard layout).
 * - `inline`: renders a banner that opens the wheel (used on the ebook library).
 */
export function EbookSpinWheel({ autoOpen = false, inline = false, dismissalKey = DISMISS_KEY }: { autoOpen?: boolean; inline?: boolean; dismissalKey?: string }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<string | null>(null);
  const [error, setError] = useState("");
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoOpen) return;
    const t = setTimeout(() => {
      let dismissed = false;
      try { dismissed = sessionStorage.getItem(dismissalKey) === "1"; } catch { /* ignore */ }
      if (!dismissed) {
        setOpen(true);
        track("ebook_spin_shown", { source: "auto" });
      } else {
        window.dispatchEvent(new CustomEvent(EBOOK_SPIN_VISIBILITY_EVENT, { detail: false }));
      }
    }, 900);
    return () => clearTimeout(t);
  }, [autoOpen, dismissalKey]);

  useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent(EBOOK_SPIN_VISIBILITY_EVENT, { detail: true }));
    return () => {
      window.dispatchEvent(new CustomEvent(EBOOK_SPIN_VISIBILITY_EVENT, { detail: false }));
    };
  }, [open]);

  useEffect(() => () => { if (doneTimer.current) clearTimeout(doneTimer.current); }, []);

  const prizeBook = EBOOK_SUBJECTS.find((s) => s.id === prize);

  const spin = async () => {
    if (phase !== "idle") return;
    setPhase("spinning");
    setError("");
    track("ebook_spin_start");
    try {
      const res = await fetch("/api/ebooks/spin", { method: "POST" });
      const data = await res.json();
      const won: string | undefined = data.prize;
      if (!won || (!res.ok && res.status !== 409)) throw new Error(data.error || "Spin failed");
      const index = EBOOK_SUBJECTS.findIndex((s) => s.id === won);
      const center = index * SEG + SEG / 2;
      // Land the prize's centre under the pointer after several full turns.
      const target = rotation + 360 * 6 + ((360 - center - (rotation % 360)) % 360 + 360) % 360;
      setPrize(won);
      setRotation(target);
      doneTimer.current = setTimeout(() => {
        setPhase("won");
        track("ebook_spin_won", { ebook: won });
      }, SPIN_MS + 150);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPhase("error");
    }
  };

  const close = () => {
    setOpen(false);
    if (phase === "won" || phase === "error") {
      void utils.dashboard.getProfile.invalidate();
    } else {
      try { sessionStorage.setItem(dismissalKey, "1"); } catch { /* ignore */ }
    }
  };

  const go = (href: string) => {
    setOpen(false);
    void utils.dashboard.getProfile.invalidate();
    router.push(href);
  };

  return (
    <>
      {inline && (
        <button
          onClick={() => { setOpen(true); track("ebook_spin_shown", { source: "banner" }); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left", cursor: "pointer",
            padding: "16px 18px", borderRadius: 16, border: "1px solid var(--accent-gold-border)",
            background: "linear-gradient(120deg, rgba(0,212,255,0.12), rgba(245,166,35,0.08))",
          }}
        >
          <span style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", flexShrink: 0 }}>
            <AppIcon name="gift" size={21} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", color: "var(--text-primary)", font: "700 16px var(--font-display)" }}>Spin the wheel, win a free e-book</span>
            <span style={{ display: "block", color: "var(--text-muted)", font: "400 12px var(--font-body)", marginTop: 2 }}>One free spin on your account. Whatever it lands on is yours to keep.</span>
          </span>
          <span style={{ color: "var(--accent-gold)", font: "700 13px var(--font-body)" }}>Spin →</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Spin to win a free Sidekick e-book"
          style={{ position: "fixed", inset: 0, zIndex: 400, display: "grid", placeItems: "center", padding: 16, background: "rgba(5,6,12,0.78)", backdropFilter: "blur(8px)", overflowY: "auto" }}
        >
          <div style={{ width: "100%", maxWidth: 460, background: "var(--bg-surface)", border: "1px solid var(--accent-gold-border)", borderRadius: 22, padding: "22px 20px 22px", position: "relative", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", textAlign: "center" }}>
            <button onClick={close} aria-label="Close" disabled={phase === "spinning"} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "var(--text-muted)", cursor: phase === "spinning" ? "not-allowed" : "pointer", padding: 6 }}>
              <AppIcon name="x" size={18} />
            </button>

            {phase !== "won" ? (
              <>
                <div style={{ color: "var(--accent-gold)", font: "700 10px var(--font-body)", letterSpacing: ".16em", textTransform: "uppercase" }}>Welcome gift</div>
                <h2 style={{ margin: "6px 0 4px", color: "var(--text-primary)", font: "700 26px/1.15 var(--font-display)", letterSpacing: "-.02em" }}>Spin for a free Sidekick e-book</h2>
                <p style={{ margin: "0 0 16px", color: "var(--text-muted)", font: "400 13px/1.55 var(--font-body)" }}>One spin per account. Whichever e-book it lands on is yours, free.</p>

                <div style={{ position: "relative", width: "min(100%, 340px)", margin: "0 auto", aspectRatio: "1" }}>
                  {/* Pointer */}
                  <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", zIndex: 2, width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderTop: "24px solid var(--accent-gold)", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.5))" }} />
                  <svg
                    viewBox="-200 -200 400 400"
                    style={{
                      width: "100%", height: "100%", display: "block",
                      transform: `rotate(${rotation}deg)`,
                      transition: phase === "spinning" ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.1, 1)` : "none",
                    }}
                  >
                    <defs>
                      {EBOOK_SUBJECTS.map((_, i) => (
                        <clipPath key={i} id={`spin-seg-${i}`}><path d={wedge(i)} /></clipPath>
                      ))}
                    </defs>
                    <circle r={R + 6} fill="var(--bg-elevated)" stroke="var(--accent-gold-border)" strokeWidth="3" />
                    {EBOOK_SUBJECTS.map((book, i) => (
                      <g key={book.id} clipPath={`url(#spin-seg-${i})`}>
                        <path d={wedge(i)} fill={i % 2 === 0 ? "#10131f" : "#161a2a"} />
                        <g transform={`rotate(${i * SEG + SEG / 2})`}>
                          <image href={`/ebook-covers/${book.id}.webp`} x={-34} y={-R + 10} width={68} height={96} preserveAspectRatio="xMidYMid slice">
                            <title>{book.name}</title>
                          </image>
                        </g>
                        <path d={wedge(i)} fill="none" stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" />
                      </g>
                    ))}
                    <circle r={30} fill="var(--bg-surface)" stroke="var(--accent-gold)" strokeWidth="3" />
                  </svg>
                  <button
                    onClick={spin}
                    disabled={phase !== "idle"}
                    style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, borderRadius: "50%", border: "none", background: "var(--accent-gold)", color: "#000", font: "800 13px var(--font-body)", cursor: phase === "idle" ? "pointer" : "default", boxShadow: "0 0 24px var(--accent-gold-glow)" }}
                  >
                    {phase === "spinning" ? "…" : "SPIN"}
                  </button>
                </div>

                {phase === "error" ? (
                  <p style={{ margin: "14px 0 0", color: "#E5534B", font: "400 13px var(--font-body)" }}>{error}</p>
                ) : (
                  <button className="btn-gold" onClick={spin} disabled={phase !== "idle"} style={{ marginTop: 18, width: "100%", opacity: phase === "idle" ? 1 : 0.6 }}>
                    {phase === "spinning" ? "Spinning…" : "Spin the wheel"}
                  </button>
                )}
                {phase === "idle" && (
                  <button onClick={close} style={{ marginTop: 10, background: "transparent", border: "none", color: "var(--text-muted)", font: "400 12px var(--font-body)", cursor: "pointer" }}>Maybe later</button>
                )}
              </>
            ) : prizeBook ? (
              <>
                <div style={{ color: "#22c55e", font: "700 10px var(--font-body)", letterSpacing: ".16em", textTransform: "uppercase" }}>You won</div>
                <h2 style={{ margin: "6px 0 14px", color: "var(--text-primary)", font: "700 26px/1.15 var(--font-display)", letterSpacing: "-.02em" }}>{prizeBook.name} Sidekick is yours</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/ebook-covers/${prizeBook.id}.webp`} alt={`${prizeBook.name} Sidekick cover`} width={150} height={212} style={{ borderRadius: 10, boxShadow: "0 16px 40px rgba(0,0,0,.5)", border: "1px solid var(--bg-border)" }} />
                <p style={{ margin: "14px 0 16px", color: "var(--text-muted)", font: "400 13px/1.55 var(--font-body)" }}>It&apos;s unlocked on your account. Start reading now.</p>
                <button className="btn-gold" style={{ width: "100%" }} onClick={() => go(`/dashboard/ebooks/${prizeBook.id}`)}>Read {prizeBook.name} now →</button>
                <button className="btn-ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => go("/dashboard/ebooks")}>
                  Get all 10 e-books + Pro for ₹{EBOOK_BUNDLE_PRICE}
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
