export type Plan = 'free' | 'pro';

export const PLAN_FEATURES: Record<string, Plan[]> = {
  aiDoubtSolver:       ['pro'],
  smartPlanner:        ['free', 'pro'],
  competencyTest:      ['pro'],
  customiseTest:       ['pro'],
  flipTheQuestion:     ['pro'],
  focusMode:           ['pro'],
  todoList:            ['free', 'pro'],
  chronoScroll:        ['pro'],
  numericalMastery:    ['pro'],
  dateBattleArena:     ['pro'],
  ebooks:              ['pro'],
  guessPapers:         ['pro'],
  halfYearlySimulator: ['pro'],
  preBoard90Phase1:    ['free', 'pro'],
  preBoard90Full:      ['pro'],
};

export const AI_DOUBT_FREE_LIMIT = 3; // queries per day for free users

export function canAccess(feature: string, plan: Plan): boolean {
  const allowed = PLAN_FEATURES[feature];
  if (!allowed) return false;
  return allowed.includes(plan);
}

export function getUserPlan(isPaid: boolean, planType?: string): Plan {
  if (planType === 'PRO') return 'pro';
  if (isPaid || planType === 'BUNDLE') return 'pro';
  return 'free';
}
