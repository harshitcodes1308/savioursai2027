"use client";

import { trpc } from "@/lib/trpc/client";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemedDashboardContent } from "@/components/providers/themed-dashboard";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { isLockedRoute, isBundleLockedRoute, getFeatureInfo } from "@/lib/tier-config";
import type { SessionUser } from "@/lib/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: profile } = trpc.dashboard.getProfile.useQuery();
    const { data: session } = trpc.auth.getSession.useQuery();
    const pathname = usePathname();

    const user = session?.user as SessionUser | undefined;

    const paidSource = profile ?? user;
    const planType = (paidSource?.planType as string) ?? "FREE";
    const isPaid = !!(
        paidSource?.isPaid ||
        ((planType === "PRO" || planType === "BUNDLE") &&
            paidSource?.subscriptionStatus === "ACTIVE")
    );

    const isBundleUser = planType === "BUNDLE";
    const isProUser = planType === "PRO";

    let showUpgrade = false;
    let upgradeType: "PRO" | "BUNDLE" = "PRO";

    if (!isPaid && isLockedRoute(pathname)) {
        showUpgrade = true;
        upgradeType = "PRO";
    } else if (isPaid && isProUser && isBundleLockedRoute(pathname)) {
        showUpgrade = true;
        upgradeType = "BUNDLE";
    }

    const featureInfo = showUpgrade ? getFeatureInfo(pathname) : null;

    return (
        <ThemeProvider>
            <ThemedDashboardContent
                userName={profile?.name}
                userEmail={profile?.email}
                isPaid={isPaid}
                planType={planType}
            >
                {showUpgrade ? (
                    <UpgradePrompt
                        featureName={featureInfo?.name ?? "Premium Feature"}
                        description={featureInfo?.description ?? "This feature requires an upgrade."}
                        type={upgradeType}
                    />
                ) : children}
            </ThemedDashboardContent>
        </ThemeProvider>
    );
}
