"use client";

import { trpc } from "@/lib/trpc/client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemedDashboardContent } from "@/components/providers/themed-dashboard";
import type { SessionUser } from "@/lib/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: profile } = trpc.dashboard.getProfile.useQuery();
    const { data: session } = trpc.auth.getSession.useQuery();

    const user = session?.user as SessionUser | undefined;

    // Paid if legacy isPaid flag OR active subscription
    const isPaid = !!(
        user?.isPaid ||
        ((user?.planType === "MONTHLY" || user?.planType === "YEARLY") &&
            user?.subscriptionStatus === "ACTIVE")
    );

    return (
        <ThemeProvider>
            <ThemedDashboardContent
                userName={profile?.name}
                userEmail={profile?.email}
                isPaid={isPaid}
                planType={user?.planType ?? "FREE"}
            >
                {children}
            </ThemedDashboardContent>
        </ThemeProvider>
    );
}
