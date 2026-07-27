"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type PlanAction = "FREE" | "PRO" | "BUNDLE";

/**
 * Admin-only action: Update a user's subscription plan.
 */
export async function adminUpdateUserPlan(userId: string, plan: PlanAction) {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        if (plan === "FREE") {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isPaid: false,
                    planType: "FREE",
                    subscriptionStatus: "ACTIVE",
                    subscriptionExpiry: null,
                },
            });
        } else if (plan === "PRO") {
            const expiry = new Date("2027-03-31T23:59:59+05:30");

            await prisma.user.update({
                where: { id: userId },
                data: {
                    isPaid: true,
                    planType: "PRO",
                    subscriptionStatus: "ACTIVE",
                    subscriptionExpiry: expiry,
                },
            });
        } else if (plan === "BUNDLE") {
            const expiry = new Date("2027-03-31T23:59:59+05:30");

            await prisma.user.update({
                where: { id: userId },
                data: {
                    isPaid: true,
                    planType: "BUNDLE",
                    subscriptionStatus: "ACTIVE",
                    subscriptionExpiry: expiry,
                },
            });
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Admin plan update error:", error);
        return { success: false, error: "Failed to update plan" };
    }
}
