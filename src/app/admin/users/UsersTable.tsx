"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Search } from "lucide-react";
import { adminUpdateUserPlan } from "@/actions/admin-update-plan";
import type { AdminUsers } from "@/lib/admin";
import { EBOOK_SUBJECTS } from "@/data/ebooks-config";
import { PageHeading, Panel, Empty, number, dateTime } from "../AdminUI";
const filters = [["", "All users"], ["paid", "Paid access"], ["free", "Free"], ["claimed", "Free ebook claimed"], ["bundle", "Bundle owners"], ["online", "Online now"]];
function PlanSelect({ user }: { user: AdminUsers["users"][number] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return <div><select aria-label={`Plan for ${user.name}`} value={user.planType} disabled={saving} onChange={async e => {
    const plan = e.target.value as "FREE" | "PRO" | "BUNDLE";
    setSaving(true); setError("");
    try { const result = await adminUpdateUserPlan(user.id, plan); if (result.success) router.refresh(); else setError(result.error ?? "Unable to update"); }
    catch { setError("Unable to update plan"); } finally { setSaving(false); }
  }}><option value="FREE">Free</option><option value="PRO">Pro</option><option value="BUNDLE">Bundle</option></select>{saving && <small>Saving…</small>}{error && <small role="alert" style={{ color: "#fca5a5" }}>{error}</small>}</div>;
}
export default function UsersTable({ data, search, filter }: { data: AdminUsers; search: string; filter: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(search);
  const [pending, startTransition] = useTransition();
  const navigate = (q: string, f: string, page = 1) => {
    const params = new URLSearchParams(); if (q) params.set("search", q); if (f) params.set("filter", f); if (page > 1) params.set("page", String(page));
    startTransition(() => router.push(`/admin/users?${params}`));
  };
  const exportPage = () => {
    const cell = (value: unknown) => { let text = String(value ?? ""); if (/^[=+@\-\t\r]/.test(text)) text = "'" + text; return '"' + text.replaceAll('"', '""') + '"'; };
    const rows = [["Name", "Email", "Phone", "Plan", "Status", "Free ebook", "Claimed at", "Joined"], ...data.users.map(u => [u.name,u.email,u.phone,u.planType,u.subscriptionStatus,u.ebookSpinPrize,u.ebookSpinAt,u.createdAt])];
    const url = URL.createObjectURL(new Blob([rows.map(r => r.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href=url; anchor.download=`saviours-users-page-${data.page}.csv`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="admin-page"><PageHeading eyebrow="Student directory" title="Users" description={`${number(data.total)} matching users · Real accounts only`}><button className="admin-button" onClick={exportPage}><Download size={14}/>Export this page</button></PageHeading>
    <div className="admin-toolbar"><form className="admin-search" onSubmit={e => { e.preventDefault(); navigate(query.trim(), filter); }}><input aria-label="Search users" placeholder="Search by name or email" value={query} onChange={e => setQuery(e.target.value)}/><button className="admin-button" disabled={pending}><Search size={14}/>Search</button></form></div>
    <div className="admin-filters" aria-label="Filter users">{filters.map(([key,label]) => <button key={key} className={`admin-filter ${filter === key ? "active" : ""}`} aria-pressed={filter === key} disabled={pending} onClick={() => navigate(search, key)}>{label}</button>)}</div>
    <Panel title="Registered users" caption="Manage plans and see free Sidekick claims"><div className="admin-table-scroll"><table className="admin-table" style={{ minWidth: 850 }}><thead><tr><th>Student</th><th>Plan</th><th>Access status</th><th>Free ebook</th><th>Activity</th><th>Joined · IST</th></tr></thead><tbody>{data.users.map(u => <tr key={u.id}><td><strong>{u.name}</strong><small>{u.email}</small>{u.phone && <small>{u.phone}</small>}</td><td><PlanSelect user={u}/></td><td><span className={`admin-badge ${u.ebooksUnlocked ? "cyan" : ""}`}>{u.ebooksUnlocked ? "FULL LIBRARY" : u.subscriptionExpiry && new Date(u.subscriptionExpiry) < new Date() ? "EXPIRED" : u.subscriptionStatus}</span><small>{u.onboardingComplete ? "Onboarded" : "Onboarding pending"}</small></td><td>{u.ebookSpinAt ? <><strong>{EBOOK_SUBJECTS.find(b => b.id === u.ebookSpinPrize)?.name ?? "Claimed"}</strong><small>{dateTime(u.ebookSpinAt)}</small></> : <span>Not claimed</span>}</td><td><span className={`admin-badge ${u.online ? "cyan" : ""}`}>{u.online && <i className="admin-online-dot"/>}{u.online ? "ONLINE" : "OFFLINE"}</span></td><td>{dateTime(u.createdAt)}</td></tr>)}</tbody></table></div>{!data.users.length && <Empty>No users match this search.</Empty>}</Panel>
    <div className="admin-pagination"><span>{data.total ? `${(data.page - 1) * 50 + 1}–${Math.min(data.page * 50, data.total)}` : "0"} of {number(data.total)} users</span><div><button className="admin-button" disabled={data.page <= 1 || pending} onClick={() => navigate(search, filter, data.page - 1)}>Previous</button><span>Page {data.page} of {data.pages}</span><button className="admin-button" disabled={data.page >= data.pages || pending} onClick={() => navigate(search, filter, data.page + 1)}>Next</button></div></div>
  </div>;
}
