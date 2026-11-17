export const FEATURE_PREVIEWS = {
  "ai-assistant": { route: "/dashboard/ai-assistant", name: "AI Doubt Solver", limit: 3, allowance: "3 AI prompts" },
  "custom-tests": { route: "/dashboard/tests", name: "Customise Test", limit: 1, allowance: "1 complete generated test" },
  "exam-strategy": { route: "/dashboard/strategy", name: "Exam Strategy Builder", limit: 1, allowance: "1 generated strategy" },
  "smart-notes": { route: "/dashboard/notes", name: "Smart Notes", limit: 2, allowance: "2 AI-refined notes" },
  chronoscroll: { route: "/dashboard/chronoscroll", name: "ChronoScroll", limit: 10, allowance: "the first 10 timeline dates" },
  "date-battle": { route: "/dashboard/date-battle", name: "Date Battle Arena", limit: 1, allowance: "1 complete battle" },
  "numerical-mastery": { route: "/dashboard/numerical-mastery", name: "Numerical Mastery", limit: 1, allowance: "the first chapter and topic" },
  "flip-the-question": { route: "/dashboard/flip-the-question", name: "Flip the Question", limit: 1, allowance: "1 complete challenge" },
  "focus-mode": { route: "/dashboard/focus", name: "Focus Mode", limit: 1, allowance: "Pomodoro mode" },
  "competency-test": { route: "/dashboard/precision-practice", name: "Competency Test", limit: 1, allowance: "the first chapter test" },
  "guess-papers": { route: "/dashboard/guess-papers", name: "Guess Papers", limit: 1, allowance: "the Physics guess paper" },
  "half-yearly": { route: "/dashboard/half-yearly", name: "Half Yearly Simulator", limit: 1, allowance: "the first chapter video preview" },
} as const;

export type FeaturePreviewId = keyof typeof FEATURE_PREVIEWS;

export function isFeaturePreviewId(value: string): value is FeaturePreviewId {
  return Object.prototype.hasOwnProperty.call(FEATURE_PREVIEWS, value);
}

export function getFeaturePreview(pathname: string) {
  return (Object.entries(FEATURE_PREVIEWS) as Array<[
    FeaturePreviewId,
    (typeof FEATURE_PREVIEWS)[FeaturePreviewId],
  ]>)
    .sort((a, b) => b[1].route.length - a[1].route.length)
    .find(([, preview]) => pathname.startsWith(preview.route));
}

export const FEATURE_PREVIEW_LIMIT_MESSAGE = "FREE_PREVIEW_LIMIT_REACHED";

export function isFeaturePreviewLimitError(error: unknown) {
  return error instanceof Error && error.message.includes(FEATURE_PREVIEW_LIMIT_MESSAGE);
}
