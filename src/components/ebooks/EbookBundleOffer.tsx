"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { trpc } from "@/lib/trpc/client";
import { EBOOK_SUBJECTS } from "@/data/ebooks-config";
import { EBOOK_BUNDLE_PRICE, EBOOK_SINGLE_PRICE } from "@/lib/ebook-access";
import { RazorpayButton } from "@/components/RazorpayButton";
import { EbookSpinWheel, EBOOK_SPIN_VISIBILITY_EVENT } from "./EbookSpinWheel";
import styles from "./EbookBundleOffer.module.css";

export const BUNDLE_OFFER_DELAY_MS = 45_000;

/** Mounted only for real free accounts without full-library access. */
export function EbookBundleOffer({ userId, signInId, canSpin, name, email }: {
  userId: string; signInId?: string; canSpin: boolean; name: string; email: string;
}) {
  const storageKey = `saviours-bundle-offer:${userId}:${signInId ?? "legacy"}`;
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  // Keep the initial eligibility: completing a spin must not shortcut the delay.
  const firstNeedsSpin = useRef(canSpin);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let wheelOpen = false;
    let memoryState: string | null = null;
    const read = () => { try { return sessionStorage.getItem(storageKey); } catch { return memoryState; } };
    const write = (value: string) => {
      memoryState = value;
      try { sessionStorage.setItem(storageKey, value); } catch { /* In-memory fallback. */ }
    };
    const schedule = (delay: number) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (wheelOpen || read() === "shown") return;
        write("shown");
        setOpen(true);
        track("ebook_bundle_offer_shown");
      }, delay);
    };
    const onWheelVisibility = (event: Event) => {
      wheelOpen = (event as CustomEvent<boolean>).detail;
      clearTimeout(timer);
      if (wheelOpen) {
        setOpen(false);
      } else if (read() !== "shown") {
        const due = Date.now() + BUNDLE_OFFER_DELAY_MS;
        write(String(due));
        schedule(BUNDLE_OFFER_DELAY_MS);
      }
    };
    window.addEventListener(EBOOK_SPIN_VISIBILITY_EVENT, onWheelVisibility);
    const saved = read();
    if (saved !== "shown") {
      if (saved && Number.isFinite(Number(saved))) schedule(Math.max(0, Number(saved) - Date.now()));
      else if (!firstNeedsSpin.current) schedule(0);
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener(EBOOK_SPIN_VISIBILITY_EVENT, onWheelVisibility);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  const dismiss = () => { setOpen(false); track("ebook_bundle_offer_dismissed"); };

  return <>
    {canSpin && <EbookSpinWheel autoOpen dismissalKey={`${storageKey}:spin-dismissed`} />}
    {open && <dialog ref={dialog} className={styles.dialog} aria-labelledby="bundle-offer-title" aria-describedby="bundle-offer-description" onCancel={(event) => { event.preventDefault(); dismiss(); }} onClick={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
      <div className={styles.content}>
        <button autoFocus className={styles.close} onClick={dismiss} aria-label="Close bundle offer">×</button>
        <div className={styles.eyebrow}>Saviours AI · Sidekick collection</div>
        <h2 id="bundle-offer-title">Your complete<br />exam sidekick.</h2>
        <p id="bundle-offer-description" className={styles.description}>All {EBOOK_SUBJECTS.length} e-books. Every upcoming Sidekick.<br />And Pro to bring it all together.</p>
        <div className={styles.books} aria-label="All ten Sidekick ebooks">
          {EBOOK_SUBJECTS.map((book, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={book.id} src={`/ebook-covers/${book.id}.webp`} alt={`${book.name} Sidekick`} width={86} height={122} style={{ transform: `rotate(${(i % 5 - 2) * 2}deg)` }} />
          ))}
        </div>
        <div className={styles.price}><s>₹{EBOOK_SINGLE_PRICE * EBOOK_SUBJECTS.length}</s><strong>₹{EBOOK_BUNDLE_PRICE}</strong><span>One-time payment<br />No recurring charges</span></div>
        <div className={styles.bonus}><span className={styles.check}>✓</span><div><strong>Saviours AI Pro included</strong><span>Worth ₹99 · At no extra cost</span></div><span className={styles.included}>INCLUDED</span></div>
        <p className={styles.detail}>AI study tools, practice and premium features.<br />Pro access through 31 March 2027.</p>
        <RazorpayButton type="EBOOK_BUNDLE" name={name} email={email} buttonText={`Get the complete bundle · ₹${EBOOK_BUNDLE_PRICE}`} successRedirect="/dashboard/ebooks" onSuccess={() => {
          setOpen(false);
          void utils.dashboard.getProfile.invalidate();
          void utils.auth.getSession.invalidate();
        }} />
        <button className={styles.later} onClick={dismiss}>Maybe later</button>
      </div>
    </dialog>}
  </>;
}
