export const ADMIN_TRACKING_START = new Date("2026-11-01T00:00:00+05:30");
export const ADMIN_TRACKING_START_LABEL = "1 Nov 2026";
export type AdminScope = "november" | "all";

export function parseAdminScope(value?: string): AdminScope {
  return value === "all" ? "all" : "november";
}

export function adminTrackingDays(now = new Date()) {
  const startDay = Date.UTC(2026, 10, 1);
  const istNow = new Date(now.getTime() + 330 * 60_000);
  const currentDay = Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate());
  return Math.max(1, Math.floor((currentDay - startDay) / 86400_000) + 1);
}

export function adminScopeDays(scope: AdminScope, firstDate?: string, now = new Date()) {
  if (scope === "november") return adminTrackingDays(now);
  if (!firstDate) return 1;
  const first = new Date(`${firstDate}T00:00:00+05:30`);
  const today = new Date(`${new Date(now.getTime() + 330 * 60_000).toISOString().slice(0, 10)}T00:00:00+05:30`);
  return Math.max(1, Math.floor((today.getTime() - first.getTime()) / 86400_000) + 1);
}
