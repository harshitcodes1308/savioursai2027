export const FEATURE_PREVIEWS = {
  "ai-assistant": { route: "/dashboard/ai-assistant", name: "AI Doubt Solver", minutes: 15 },
  "custom-tests": { route: "/dashboard/tests", name: "Customise Test", minutes: 45 },
  "exam-strategy": { route: "/dashboard/strategy", name: "Exam Strategy Builder", minutes: 20 },
  "smart-notes": { route: "/dashboard/notes", name: "Smart Notes", minutes: 20 },
  chronoscroll: { route: "/dashboard/chronoscroll", name: "ChronoScroll", minutes: 15 },
  "date-battle": { route: "/dashboard/date-battle", name: "Date Battle Arena", minutes: 15 },
  "numerical-mastery": { route: "/dashboard/numerical-mastery", name: "Numerical Mastery", minutes: 20 },
  "flip-the-question": { route: "/dashboard/flip-the-question", name: "Flip the Question", minutes: 20 },
  "focus-mode": { route: "/dashboard/focus", name: "Focus Mode", minutes: 70 },
  "competency-test": { route: "/dashboard/precision-practice", name: "Competency Test", minutes: 45 },
  "guess-papers": { route: "/dashboard/guess-papers", name: "Guess Papers", minutes: 45 },
  "half-yearly": { route: "/dashboard/half-yearly", name: "Half Yearly Simulator", minutes: 30 },
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
