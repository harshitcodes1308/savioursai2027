"use client";

import { trpc } from "@/lib/trpc/client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemedDashboardContent } from "@/components/providers/themed-dashboard";
import type { SessionUser } from "@/lib/auth";
import { DashboardActivity } from "@/components/providers/DashboardActivity";
import { EbookBundleOffer } from "@/components/ebooks/EbookBundleOffer";
import { FeaturePreviewGate } from "@/components/FeaturePreviewGate";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: profile } = trpc.dashboard.getProfile.useQuery();
    const { data: session } = trpc.auth.getSession.useQuery();
    const user = session?.user as SessionUser | undefined;
    const isDemo = user?.isDemo === true;

    const paidSource = profile ?? user;
    const planType = (paidSource?.planType as string) ?? "FREE";
    const isPaid = !!(
        paidSource?.isPaid ||
        ((planType === "PRO" || planType === "BUNDLE") &&
            paidSource?.subscriptionStatus === "ACTIVE")
    );

    return (
        <ThemeProvider>
            <ThemedDashboardContent
                userName={profile?.name}
                userEmail={profile?.email}
                isPaid={isPaid}
                planType={planType}
                ebooksUnlocked={profile?.ebooksUnlocked === true}
            >
                {profile && !isDemo && <DashboardActivity />}
                {isDemo && (
                    <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 180, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(14,14,23,.94)", border: "1px solid rgba(245,158,11,.38)", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>
                        <span style={{ color: "#F59E0B", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700 }}>LIVE DEMO</span>
                        <button onClick={() => window.location.href = "/signup?from=demo"} style={{ cursor: "pointer", border: "1px solid var(--accent-gold-border)", borderRadius: 7, padding: "6px 9px", background: "var(--accent-gold-glow)", color: "var(--accent-gold)", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700 }}>Create account →</button>
                    </div>
                )}
                {profile && user && !isDemo && !isPaid && !profile.ebooksUnlocked && (
                    <EbookBundleOffer
                        key={`${profile.id}:${user.signInId ?? "legacy"}`}
                        userId={profile.id}
                        signInId={user.signInId}
                        canSpin={profile.canSpinForEbook}
                        name={profile.name}
                        email={profile.email}
                    />
                )}
                <FeaturePreviewGate isPaid={isPaid} isDemo={isDemo}>{children}</FeaturePreviewGate>
            </ThemedDashboardContent>
        </ThemeProvider>
    );
}
