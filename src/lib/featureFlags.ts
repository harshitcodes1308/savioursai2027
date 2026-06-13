export const FEATURE_FLAGS = {
  // Currently live
  studyFlow:         true,
  webinar:           true,
  videoLectures:     true,
  aiDoubtSolver:     true,
  smartPlanner:      true,
  competencyTest:    true,
  customiseTest:     true,
  flipTheQuestion:   true,
  focusMode:         true,
  todoList:          true,
  youtubeDiscovery:  true,   // YouTube-powered Watch step in study flow

  // Hidden — activate later by flipping to true
  numericalMastery:  true,
  chronoScroll:      true,
  guessPapers:       false,
  dateBattleArena:   true,
  strategyAI:        false,
  lastNightBefore:   false,
  notesFlashcards:   false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => FEATURE_FLAGS[flag];
