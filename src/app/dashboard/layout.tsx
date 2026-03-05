"use client";

import { trpc } from "@/lib/trpc/client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemedDashboardContent } from "@/components/providers/themed-dashboard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: profile } = trpc.dashboard.getProfile.useQuery();
    const { data: session } = trpc.auth.getSession.useQuery();

    // isPaid from JWT session payload (no extra DB call)
    const isPaid = !!(session?.user as any)?.isPaid;

    return (
        <ThemeProvider>
            <ThemedDashboardContent
                userName={profile?.name}
                userEmail={profile?.email}
                isPaid={isPaid}
            >
                {children}
            </ThemedDashboardContent>
        </ThemeProvider>
    );
}
