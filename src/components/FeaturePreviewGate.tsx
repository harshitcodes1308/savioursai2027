"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { getFeaturePreview } from "@/lib/feature-preview";
import { getFeatureInfo } from "@/lib/tier-config";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { AppIcon } from "@/components/ui/AppIcon";

type PreviewContextValue = { isPreview: boolean; expiresAt: Date | null };
const FeaturePreviewContext = createContext<PreviewContextValue>({ isPreview: false, expiresAt: null });

export function useFeaturePreviewAccess() {
  return useContext(FeaturePreviewContext);
}

export function FeaturePreviewGate({ children, isPaid, isDemo }: {
  children: React.ReactNode;
  isPaid: boolean;
  isDemo: boolean;
}) {
  const pathname = usePathname();
  const previewEntry = useMemo(() => getFeaturePreview(pathname), [pathname]);
  const [access, setAccess] = useState<null | { allowed: boolean; expiresAt: Date | null; name: string; error?: boolean }>(null);
  const [now, setNow] = useState(() => Date.now());
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [retry, setRetry] = useState(0);
  const startPreview = trpc.preview.start.useMutation();

  useEffect(() => {
    setShowUpgrade(false);
    setAccess(null);
    if (!previewEntry || isPaid || isDemo) return;

    let active = true;
    startPreview.mutateAsync({ feature: previewEntry[0] })
      .then((result) => {
        if (!active) return;
        setAccess({
          allowed: result.allowed,
          expiresAt: result.expiresAt ? new Date(result.expiresAt) : null,
          name: result.name,
        });
      })
      .catch(() => {
        if (active) setAccess({ allowed: false, expiresAt: null, name: previewEntry[1].name, error: true });
      });

    return () => { active = false; };
    // The mutation object is intentionally excluded; its identity is not route state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewEntry, isPaid, isDemo, retry]);

  useEffect(() => {
    if (!access?.allowed || !access.expiresAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [access]);

  if (!previewEntry || isPaid || isDemo) {
    return <FeaturePreviewContext.Provider value={{ isPreview: false, expiresAt: null }}>{children}</FeaturePreviewContext.Provider>;
  }

  if (!access) {
    return <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
      <div style={{ textAlign: "center" }}><AppIcon name="sparkles" size={28} color="var(--accent-gold)" /><p>Opening your free preview…</p></div>
    </div>;
  }

  if (access.error) {
    return <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: 420, textAlign: "center", padding: 24, borderRadius: 16, background: "var(--bg-surface)", border: "1px solid var(--bg-border)" }}>
        <AppIcon name="refresh" size={26} color="var(--accent-gold)" />
        <h2 style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Couldn&apos;t open the preview</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>Your preview has not been consumed. Check your connection and try again.</p>
        <button onClick={() => { setAccess(null); setRetry(value => value + 1); }} style={{ border: "1px solid var(--accent-gold-border)", borderRadius: 9, padding: "10px 14px", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontWeight: 700, cursor: "pointer" }}>Try again</button>
      </div>
    </div>;
  }

  const remainingMs = access.expiresAt ? access.expiresAt.getTime() - now : 0;
  const expired = !access.allowed || remainingMs <= 0;
  const info = getFeatureInfo(previewEntry[1].route);

  if (expired) {
    return <UpgradePrompt
      featureName={`${access.name} preview complete`}
      description={`You have explored your free ${access.name} preview. Choose Pro for every premium study tool, or get the Sidekick bundle with all 10 e-books and Pro included.`}
      type="CHOICE"
    />;
  }

  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1_000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return <FeaturePreviewContext.Provider value={{ isPreview: true, expiresAt: access.expiresAt }}>
    <div style={{ position: "sticky", top: 0, zIndex: 125, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto", width: "min(100% - 24px, 760px)", margin: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(4,18,30,.96)", border: "1px solid rgba(0,212,255,.28)", boxShadow: "0 12px 34px rgba(0,0,0,.35)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontFamily: "var(--font-body)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent-gold)", fontSize: 11, fontWeight: 800, letterSpacing: ".08em" }}><AppIcon name="sparkles" size={14} /> FREE PREVIEW</span>
        <span style={{ color: "var(--text-secondary)", fontSize: 12, flex: 1, minWidth: 150 }}>{access.name} · full functionality</span>
        <strong aria-label={`${minutes} minutes ${seconds} seconds remaining`} style={{ color: "var(--text-primary)", fontFamily: "monospace", fontSize: 13 }}>{minutes}:{String(seconds).padStart(2, "0")}</strong>
        <button onClick={() => setShowUpgrade(true)} style={{ border: "1px solid var(--accent-gold-border)", borderRadius: 8, padding: "7px 10px", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Unlock forever</button>
      </div>
    </div>
    {children}
    {showUpgrade && <UpgradePrompt featureName={info?.name ?? access.name} description={info?.description ?? "Unlock the complete feature without preview limits."} type="CHOICE" onClose={() => setShowUpgrade(false)} />}
  </FeaturePreviewContext.Provider>;
}
