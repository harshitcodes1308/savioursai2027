export const ADMIN_TRACKING_START = new Date("2026-11-01T00:00:00+05:30");
export const ADMIN_TRACKING_START_LABEL = "1 Nov 2026";

export function adminTrackingDays(now = new Date()) {
  const startDay = Date.UTC(2026, 10, 1);
  const istNow = new Date(now.getTime() + 330 * 60_000);
  const currentDay = Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate());
  return Math.max(1, Math.floor((currentDay - startDay) / 86400_000) + 1);
}
