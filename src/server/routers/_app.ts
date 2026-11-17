import { createTRPCRouter } from "@/server/trpc";
import { authRouter } from "./auth";
import { dashboardRouter } from "./dashboard";
import { plannerRouter } from "./planner";
import { contentRouter } from "./content";
import { aiRouter } from "./ai";
import { testRouter } from "./test";
import { profileRouter } from "./profile";
import { strategyRouter } from "./strategy";
import { focusRouter } from "./focus";
import { precisionRouter } from "./precision";
import { flipRouter } from "./flip";
import { creatorRouter } from "./creator";
import { preBoard90Router } from "./preBoard90";
import { previewRouter } from "./preview";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    dashboard: dashboardRouter,
    planner: plannerRouter,
    content: contentRouter,
    ai: aiRouter,
    test: testRouter,
    profile: profileRouter,
    strategy: strategyRouter,
    focus: focusRouter,
    precision: precisionRouter,
    flip: flipRouter,
    creator: creatorRouter,
    preBoard90: preBoard90Router,
    preview: previewRouter,
});

export type AppRouter = typeof appRouter;
