/**
 * Free Tier Configuration
 * 
 * Defines which dashboard routes are locked (Pro only) vs free.
 * Used by middleware for route guarding and sidebar for lock icons.
 */

/** Routes that require Pro (isPaid = true) */
export const LOCKED_ROUTES = [
    "/dashboard/ai-assistant",
    "/dashboard/planner",
    "/dashboard/tests",
    "/dashboard/precision-practice",
    "/dashboard/strategy",
    "/dashboard/notes",
    "/dashboard/chronoscroll",
    "/dashboard/date-battle",
    "/dashboard/numerical-mastery",
    "/dashboard/last-night-before",
] as const;

/** Routes accessible to free users */
export const FREE_ROUTES = [
    "/dashboard",
    "/dashboard/subjects",
    "/dashboard/guess-papers",
    "/dashboard/focus",
    "/dashboard/profile",
    "/dashboard/policies",
    "/dashboard/activity",
    // TODO: Add Formula Chain route once built
    // TODO: Add Physics Readiness Scan route once built
] as const;

/** Feature info for UpgradePrompt — maps route to display name + description */
export const FEATURE_INFO: Record<string, { name: string; description: string }> = {
    "/dashboard/ai-assistant": {
        name: "AI Assistant",
        description: "Get instant doubt-solving with image upload, step-by-step solutions, and YouTube video recommendations powered by GPT-4o.",
    },
    "/dashboard/planner": {
        name: "Smart Study Planner",
        description: "AI-powered study planner that predicts chapter difficulty, distributes topics optimally, and creates daily plans tailored to your schedule.",
    },
    "/dashboard/tests": {
        name: "Custom Test Generator",
        description: "Generate AI-powered MCQ tests for any subject and chapter. Practice under timed exam conditions with instant results and analytics.",
    },
    "/dashboard/precision-practice": {
        name: "Competency Test",
        description: "Timed PYQ-based competency testing with detailed accuracy, time-efficiency, and performance analytics for every chapter.",
    },
    "/dashboard/strategy": {
        name: "Exam Strategy Builder",
        description: "Get a personalized exam strategy based on your strengths, weaknesses, and schedule. Choose Survival, Balanced, or Topper mode.",
    },
    "/dashboard/notes": {
        name: "Smart Notes",
        description: "Create notes that are auto-refined by AI and instantly generate flashcards for revision. Never lose a concept again.",
    },
    "/dashboard/chronoscroll": {
        name: "ChronoScroll",
        description: "Interactive History & Civics timeline with key dates, events, and context — scroll through time to master your syllabus.",
    },
    "/dashboard/date-battle": {
        name: "Date Battle Arena",
        description: "Gamified history date learning through fast-paced battles. Compete against the clock to master important dates.",
    },
    "/dashboard/numerical-mastery": {
        name: "Numerical Mastery",
        description: "Master Physics numericals with step-by-step formulas, solved examples, and 50+ Previous Year Questions from 2007–2025.",
    },
    "/dashboard/last-night-before": {
        name: "Last Night Before",
        description: "Panic-mode revision: 30 numericals, 20 formulas, 10 definitions — randomly assigned for focused last-minute cramming.",
    },
};

/** Check if a pathname is a locked route (for free users) */
export function isLockedRoute(pathname: string): boolean {
    return LOCKED_ROUTES.some(route => pathname.startsWith(route));
}

/** Get feature info for a locked route */
export function getFeatureInfo(href: string): { name: string; description: string } | null {
    return FEATURE_INFO[href] || null;
}
