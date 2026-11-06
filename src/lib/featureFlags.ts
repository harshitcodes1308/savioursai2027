export const FEATURE_FLAGS = {
  // Currently live
  studyFlow:         true,
  webinar:           false,
  videoLectures:     true,
  aiDoubtSolver:     false,
  smartPlanner:      true,
  competencyTest:    true,
  customiseTest:     true,
  flipTheQuestion:   true,
  focusMode:         true,
  todoList:          true,
  youtubeDiscovery:  true,   // YouTube-powered Watch step in study flow
  halfYearlySimulator: false,

  ebooks:            true,
  scholarship:       false,
  tracker:           false,  // Class 10 board-prep tracker (interactive PDF)

  // Hidden — activate later by flipping to true
  numericalMastery:  true,
  chronoScroll:      true,
  guessPapers:       true,
  dateBattleArena:   false,
  strategyAI:        false,
  lastNightBefore:   false,
  notesFlashcards:   false,
  preBoard90:        true,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => FEATURE_FLAGS[flag];
