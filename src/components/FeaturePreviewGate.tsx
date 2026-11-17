"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getFeaturePreview } from "@/lib/feature-preview";
import { getFeatureInfo } from "@/lib/tier-config";
import { UpgradePrompt } from "@/components/UpgradePrompt";

type UpgradeCopy = { featureName?: string; description?: string };
type PreviewContextValue = {
  isFreePreview: boolean;
  isDemo: boolean;
  requestUpgrade: (copy?: UpgradeCopy) => void;
};

const FeaturePreviewContext = createContext<PreviewContextValue>({
  isFreePreview: false,
  isDemo: false,
  requestUpgrade: () => undefined,
});

export function useFeaturePreviewAccess() {
  return useContext(FeaturePreviewContext);
}

export function useFeaturePreviewRestriction() {
  const context = useFeaturePreviewAccess();
  const isLimited = context.isDemo || context.isFreePreview;
  const block = useCallback(() => {
    if (context.isDemo) window.location.href = "/signup?from=demo";
    else context.requestUpgrade();
  }, [context]);
  return { isLimited, block };
}

export function FeaturePreviewGate({ children, isPaid, isDemo }: {
  children: React.ReactNode;
  isPaid: boolean;
  isDemo: boolean;
}) {
  const pathname = usePathname();

  return <FeaturePreviewRouteGate key={pathname} pathname={pathname} isPaid={isPaid} isDemo={isDemo}>
    {children}
  </FeaturePreviewRouteGate>;
}

function FeaturePreviewRouteGate({ children, pathname, isPaid, isDemo }: {
  children: React.ReactNode;
  pathname: string;
  isPaid: boolean;
  isDemo: boolean;
}) {
  const previewEntry = useMemo(() => getFeaturePreview(pathname), [pathname]);
  const featureInfo = previewEntry ? getFeatureInfo(previewEntry[1].route) : null;
  const [upgrade, setUpgrade] = useState<UpgradeCopy | null>(null);
  const isFreePreview = !isPaid && !isDemo;

  const requestUpgrade = useCallback((copy: UpgradeCopy = {}) => setUpgrade(copy), []);

  return <FeaturePreviewContext.Provider value={{ isFreePreview, isDemo, requestUpgrade }}>
    {children}
    {upgrade && <UpgradePrompt
      featureName={upgrade.featureName ?? featureInfo?.name ?? previewEntry?.[1].name ?? "Unlock full access"}
      description={upgrade.description ?? featureInfo?.description ?? "Your free preview is complete. Upgrade to keep using this feature without limits."}
      type="CHOICE"
      onClose={() => setUpgrade(null)}
    />}
  </FeaturePreviewContext.Provider>;
}
