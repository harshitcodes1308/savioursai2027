export type Plan = 'free' | 'pro' | 'bundle';

export const PLAN_FEATURES: Record<string, Plan[]> = {
  aiDoubtSolver:   ['pro', 'bundle'],
  smartPlanner:    ['free', 'pro', 'bundle'],
  competencyTest:  ['bundle'],
  customiseTest:   ['pro', 'bundle'],
  flipTheQuestion: ['pro', 'bundle'],
  focusMode:       ['pro', 'bundle'],
  todoList:        ['free', 'pro', 'bundle'],
  chronoScroll:    ['pro', 'bundle'],
  numericalMastery:['pro', 'bundle'],
  dateBattleArena: ['pro', 'bundle'],
  ebooks:          ['bundle'],
  guessPapers:     ['bundle'],
};

export const AI_DOUBT_FREE_LIMIT = 3; // queries per day for free users

export function canAccess(feature: string, plan: Plan): boolean {
  const allowed = PLAN_FEATURES[feature];
  if (!allowed) return false;
  return allowed.includes(plan);
}

export function getUserPlan(isPaid: boolean, planType?: string): Plan {
  if (planType === 'PRO') return 'pro';
  if (planType === 'BUNDLE') return 'bundle';
  if (isPaid) return 'bundle'; // grandfathered users get full access
  return 'free';
}
