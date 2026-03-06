"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemedDashboardContent } from "@/components/providers/themed-dashboard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { data: profile, isLoading: profileLoading } = trpc.dashboard.getProfile.useQuery();
    const { data: session } = trpc.auth.getSession.useQuery();

    // isPaid from JWT session payload (no extra DB call)
    const isPaid = !!(session?.user as any)?.isPaid;

    // Phone check: redirect to onboarding if user has no phone number
    // This replaces the unreliable middleware Prisma query (Edge runtime)
    useEffect(() => {
        if (!profileLoading && profile && !profile.phone) {
            router.replace("/onboarding");
        }
    }, [profile, profileLoading, router]);

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
