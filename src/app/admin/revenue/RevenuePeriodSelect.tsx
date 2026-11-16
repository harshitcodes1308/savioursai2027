"use client";
import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import type { RevenuePeriod, RevenueRange } from "@/lib/admin-period";

const choices: { value: RevenueRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "This month" },
  { value: "total", label: "Total period" },
  { value: "custom", label: "Custom" },
];

export default function RevenuePeriodSelect({ period }: { period: RevenuePeriod }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [from, setFrom] = useState(period.from);
  const [to, setTo] = useState(period.to);
  const navigate = (range: RevenueRange, customFrom?: string, customTo?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (range === "today") params.delete("range"); else params.set("range", range);
    params.delete("from"); params.delete("to");
    if (range === "custom" && customFrom && customTo) { params.set("from", customFrom); params.set("to", customTo); }
    startTransition(() => router.replace(`${pathname}?${params}`));
  };
  return <section className="admin-revenue-period" aria-label="Revenue date range">
    <div className="admin-period-heading"><div><CalendarDays size={17}/><span>Revenue window<strong>{period.label}</strong></span></div><small>Cards and transactions update instantly</small></div>
    <div className="admin-period-controls">{choices.map(choice => <button key={choice.value} type="button" className={`admin-period-pill ${period.range === choice.value ? "active" : ""}`} disabled={pending} onClick={() => navigate(choice.value)}>{choice.label}</button>)}</div>
    {period.range === "custom" && <form className="admin-custom-dates" onSubmit={event => { event.preventDefault(); navigate("custom", from, to); }}><label>From<input type="date" value={from} max={to} onChange={event => setFrom(event.target.value)}/></label><span>→</span><label>To<input type="date" value={to} min={from} onChange={event => setTo(event.target.value)}/></label><button className="admin-button primary" disabled={pending || !from || !to}>Apply dates</button></form>}
  </section>;
}
