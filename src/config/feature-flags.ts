/**
 * Feature Flags — Saviours AI 2027
 *
 * Set a flag to `true` to show the feature in the UI.
 * Set to `false` to hide it (routes still exist in code, just not linked).
 * Toggle live without a redeploy by updating this file.
 */
export const FEATURE_FLAGS = {
  // ── LIVE on launch ──────────────────────────────────────────
  aiDoubtSolver: true,
  smartPlanner: true,
  customiseTest: true,
  competencyTest: true,
  flipTheQuestion: true,
  focusMode: true,
  todoList: true,

  // ── HIDDEN — built but not exposed in UI ────────────────────
  numericalMastery: false,
  chronoScroll: false,
  guessPapers: false,
  dateBattleArena: false,
  strategyAI: false,
  lastNightBefore: false,
  notesFlashcards: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag] === true;
}
