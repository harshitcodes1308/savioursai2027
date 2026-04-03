export const FEATURE_FLAGS = {
  // Currently live
  aiDoubtSolver:   true,
  smartPlanner:    true,
  competencyTest:  true,
  customiseTest:   true,
  flipTheQuestion: true,
  focusMode:       true,
  todoList:        true,

  // Hidden — activate later by flipping to true
  numericalMastery:  false,
  chronoScroll:      false,
  guessPapers:       false,
  dateBattleArena:   false,
  strategyAI:        false,
  lastNightBefore:   false,
  notesFlashcards:   false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => FEATURE_FLAGS[flag];
