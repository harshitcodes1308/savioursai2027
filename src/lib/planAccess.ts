export type Plan = 'free' | 'monthly' | 'yearly';

export const PLAN_FEATURES: Record<string, Plan[]> = {
  aiDoubtSolver:   ['free', 'monthly', 'yearly'], // free gets 3/day limit
  smartPlanner:    ['monthly', 'yearly'],
  competencyTest:  ['monthly', 'yearly'],
  customiseTest:   ['monthly', 'yearly'],
  flipTheQuestion: ['monthly', 'yearly'],
  focusMode:       ['monthly', 'yearly'],
  todoList:        ['free', 'monthly', 'yearly'],
};

export const AI_DOUBT_FREE_LIMIT = 3; // queries per day for free users

export function canAccess(feature: string, plan: Plan): boolean {
  const allowed = PLAN_FEATURES[feature];
  if (!allowed) return false;
  return allowed.includes(plan);
}

export function getUserPlan(isPaid: boolean, planType?: string): Plan {
  if (!isPaid && planType !== 'MONTHLY' && planType !== 'YEARLY') return 'free';
  if (planType === 'MONTHLY') return 'monthly';
  if (planType === 'YEARLY') return 'yearly';
  if (isPaid) return 'yearly'; // grandfathered
  return 'free';
}
