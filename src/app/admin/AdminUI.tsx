"use client";
import type { ReactNode } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
export const number = (n: number) => n.toLocaleString("en-IN");
export const money = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
export const dateTime = (value: string) => new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export function PageHeading({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: ReactNode }) {
  return <div className="admin-page-heading"><div>{eyebrow && <div className="admin-eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>{children}</div>;
}
export function Metric({ label, value, detail, icon, live }: { label: string; value: string | number; detail: string; icon?: ReactNode; live?: boolean }) {
  return <section className="admin-metric"><div className="admin-metric-label">{label}<span>{icon}</span></div><div className="admin-metric-value">{live && <i className="admin-online-dot"/>}{typeof value === "number" ? number(value) : value}</div><p>{detail}</p></section>;
}
export function Panel({ title, caption, href, children, className = "" }: { title: string; caption?: string; href?: string; children: ReactNode; className?: string }) {
  return <section className={`admin-panel ${className}`}><div className="admin-panel-heading"><div><h2>{title}</h2>{caption && <p>{caption}</p>}</div>{href && <Link href={href} className="admin-text-link">View all<ArrowUpRight size={14}/></Link>}</div>{children}</section>;
}
export function Empty({ children }: { children: ReactNode }) { return <div className="admin-empty">{children}</div>; }
export function TrendChart({ data, currency = false }: { data: { date: string; count: number }[]; currency?: boolean }) {
  return <div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ left: -15, top: 12, right: 12, bottom: 0 }}><CartesianGrid stroke="#1b2c40" vertical={false}/><XAxis dataKey="date" tickFormatter={v => v.slice(5)} stroke="#8193a9" fontSize={10} axisLine={false} tickLine={false} minTickGap={30}/><YAxis allowDecimals={false} stroke="#8193a9" fontSize={10} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ background: "#101e30", border: "1px solid #2a3b50", borderRadius: 8, color: "#edf4fc", fontSize: 12 }} formatter={v => [currency ? money(Number(v)) : number(Number(v)), currency ? "Captured" : "Count"]}/><Line type="monotone" dataKey="count" stroke="#00d4ff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false}/></LineChart></ResponsiveContainer></div>;
}
export function FeatureRanking({ rows }: { rows: { feature: string; label: string; opens: number; users: number }[] }) {
  return rows.length ? <div className="admin-rankings">{rows.map((row, index) => <div className="admin-ranking" key={row.feature}><span className="admin-rank">{String(index + 1).padStart(2, "0")}</span><div className="admin-ranking-body"><div><strong>{row.label}</strong><span>{number(row.opens)} {row.opens === 1 ? "open" : "opens"}</span></div><div className="admin-bar"><i style={{ width: `${row.opens / rows[0].opens * 100}%` }}/></div><small>{number(row.users)} unique {row.users === 1 ? "user" : "users"}</small></div></div>)}</div> : <Empty>No feature opens recorded yet. Rankings will appear as students use the dashboard.</Empty>;
}
