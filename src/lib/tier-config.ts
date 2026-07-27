/**
 * Tier Configuration
 *
 * PRO_LOCKED: unlocked by Pro (₹199) or Bundle (₹699)
 * BUNDLE_LOCKED: unlocked by Bundle (₹699) only
 */

/** Routes that require at least Pro plan */
export const PRO_LOCKED_ROUTES = [
    "/dashboard/ai-assistant",
    "/dashboard/tests",
    "/dashboard/strategy",
    "/dashboard/notes",
    "/dashboard/chronoscroll",
    "/dashboard/date-battle",
    "/dashboard/numerical-mastery",
    "/dashboard/flip-the-question",
    "/dashboard/focus",
] as const;

/** Routes that require the Ultimate Bundle plan */
export const BUNDLE_LOCKED_ROUTES = [
    "/dashboard/ebooks",
    "/dashboard/precision-practice",
    "/dashboard/guess-papers",
    "/dashboard/half-yearly",
] as const;

/** All locked routes (union of both tiers) */
export const LOCKED_ROUTES = [
    ...PRO_LOCKED_ROUTES,
    ...BUNDLE_LOCKED_ROUTES,
] as const;

/** Routes accessible to free users */
export const FREE_ROUTES = [
    "/dashboard",
    "/dashboard/planner",
    "/dashboard/todo",
    "/dashboard/webinar",
    "/dashboard/video-lectures",
    "/dashboard/study-flow",
    "/dashboard/subjects",
    "/dashboard/profile",
    "/dashboard/policies",
    "/dashboard/activity",
    "/dashboard/last-night-before",
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
        description: "Timed PYQ-based competency testing with detailed accuracy, time-efficiency, and performance analytics for every chapter. Requires the Ultimate Bundle.",
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
    "/dashboard/ebooks": {
        name: "E-Books Library",
        description: "Access premium ICSE Class 10 e-books from Clarify Knowledge — all subjects with textbooks and question banks. Requires the Ultimate Bundle.",
    },
    "/dashboard/guess-papers": {
        name: "Guess Papers",
        description: "AI-predicted guess papers for all subjects based on PYQ analysis and chapter weightage. Requires the Ultimate Bundle.",
    },
    "/dashboard/half-yearly": {
        name: "Half Yearly Simulator",
        description: "A guided half-syllabus programme with video lessons, e-books and chapter-wise competency tests. Requires the Ultimate Bundle.",
    },
    "/dashboard/last-night-before": {
        name: "Last Night Before",
        description: "Panic-mode revision: 30 numericals, 20 formulas, 10 definitions — randomly assigned for focused last-minute cramming.",
    },
};

/** Check if a pathname is locked for free users (any paid plan unlocks) */
export function isLockedRoute(pathname: string): boolean {
    return LOCKED_ROUTES.some(route => pathname.startsWith(route));
}

/** Check if a pathname requires at least the Pro plan */
export function isProLockedRoute(pathname: string): boolean {
    return PRO_LOCKED_ROUTES.some(route => pathname.startsWith(route));
}

/** Check if a pathname requires the Bundle plan specifically */
export function isBundleLockedRoute(pathname: string): boolean {
    return BUNDLE_LOCKED_ROUTES.some(route => pathname.startsWith(route));
}

/** Get feature info for a locked route */
export function getFeatureInfo(href: string): { name: string; description: string } | null {
    return FEATURE_INFO[href] || null;
}
