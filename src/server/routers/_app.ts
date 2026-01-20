import { createTRPCRouter } from "@/server/trpc";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";
import { plannerRouter } from "./planner";
import { contentRouter } from "./content";
import { aiRouter } from "./ai";

/**
 * Main tRPC router
 * Import and merge all sub-routers here
 */
export const appRouter = createTRPCRouter({
    auth: authRouter,
    dashboard: dashboardRouter,
    planner: plannerRouter,
    content: contentRouter,
    ai: aiRouter,
});

export type AppRouter = typeof appRouter;
