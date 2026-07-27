"use client";

import { trpc } from "@/lib/trpc/client";
import { useCallback, useEffect, useState } from "react";

/** The demo entitlement is encoded in a signed session cookie, never in a visitor-created DB record. */
export function useDemoMode() {
  const { data: session } = trpc.auth.getSession.useQuery();
  return {
    isDemo: session?.user?.isDemo === true,
    plan: session?.user?.isDemo ? session.user.planType : null,
  } as const;
}

/** Persisted product-tour quota. Returns false once the demo allowance is spent. */
export function useDemoLimit(key: string, limit: number) {
  const { isDemo } = useDemoMode();
  const storageKey = `saviours-demo-limit:${key}`;
  const [used, setUsed] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setUsed(isDemo ? Number(window.localStorage.getItem(storageKey) || "0") : 0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isDemo, storageKey]);

  const consume = useCallback(() => {
    if (!isDemo) return true;
    if (used >= limit) return false;
    const next = used + 1;
    setUsed(next);
    window.localStorage.setItem(storageKey, String(next));
    return true;
  }, [isDemo, limit, storageKey, used]);

  return { isDemo, used, remaining: Math.max(0, limit - used), consume, exhausted: isDemo && used >= limit };
}
