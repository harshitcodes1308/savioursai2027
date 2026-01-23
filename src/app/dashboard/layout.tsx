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

    return (
        <ThemeProvider>
            <ThemedDashboardContent
                userName={profile?.name}
                userEmail={profile?.email}
            >
                {children}
            </ThemedDashboardContent>
        </ThemeProvider>
    );
}
