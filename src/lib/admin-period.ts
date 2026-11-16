export const ADMIN_TRACKING_START = new Date("2026-11-01T00:00:00+05:30");
export const ADMIN_TRACKING_START_LABEL = "1 Nov 2026";
export type AdminScope = "november" | "all";
export type RevenueRange = "today" | "week" | "month" | "total" | "custom";
export type RevenuePeriod = {
  range: RevenueRange;
  label: string;
  start: string | null;
  end: string | null;
  from: string;
  to: string;
  days: number;
  lastDay: string;
};

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

const istDate = (date: Date) => new Date(date.getTime() + 330 * 60_000).toISOString().slice(0, 10);
const validDate = (value?: string) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value! : null;
const startOfIstDay = (value: string) => new Date(`${value}T00:00:00+05:30`);
const addDays = (value: string, days: number) => istDate(new Date(startOfIstDay(value).getTime() + days * 86400_000));
const labelDate = (value: string) => startOfIstDay(value).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" });

export function parseRevenuePeriod(params: { range?: string; from?: string; to?: string }, scope: AdminScope, now = new Date()): RevenuePeriod {
  const range: RevenueRange = ["today", "week", "month", "total", "custom"].includes(params.range ?? "") ? params.range as RevenueRange : "today";
  const today = istDate(now);
  const scopeStart = scope === "november" ? "2026-11-01" : null;
  let from = today;
  let to = today;
  let label = `Today · ${labelDate(today)}`;

  if (range === "week") {
    from = addDays(today, -6);
    label = "Last 7 days";
  } else if (range === "month") {
    from = `${today.slice(0, 7)}-01`;
    label = startOfIstDay(from).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", month: "long", year: "numeric" });
  } else if (range === "total") {
    from = scopeStart ?? "";
    label = scope === "all" ? "All-time revenue" : "Total since 1 Nov 2026";
  } else if (range === "custom") {
    from = validDate(params.from) ?? scopeStart ?? today;
    to = validDate(params.to) ?? today;
    if (to > today) to = today;
    if (scopeStart && from < scopeStart) from = scopeStart;
    if (from > to) from = to;
    label = from === to ? labelDate(from) : `${labelDate(from)} – ${labelDate(to)}`;
  }

  if (scopeStart && from && from < scopeStart) from = scopeStart;
  const start = from ? startOfIstDay(from).toISOString() : null;
  const end = addDays(to, 1);
  const days = from ? Math.max(1, Math.floor((startOfIstDay(to).getTime() - startOfIstDay(from).getTime()) / 86400_000) + 1) : 1;
  return { range, label, start, end: startOfIstDay(end).toISOString(), from, to, days, lastDay: to };
}
