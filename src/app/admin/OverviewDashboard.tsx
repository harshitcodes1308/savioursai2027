"use client";
import Link from "next/link";
import { Users, CreditCard, BookOpen, Radio, ArrowUpRight, Instagram } from "lucide-react";
import type { OverviewStats } from "@/lib/admin";
import type { AdminScope } from "@/lib/admin-period";
import { PageHeading, ScopeSelect, Metric, Panel, Empty, TrendChart, FeatureRanking, number, dateTime } from "./AdminUI";
export default function OverviewDashboard({ data, scope }: { data: OverviewStats; scope: AdminScope }) {
  const period = scope === "all" ? "All time" : "Since 1 Nov 2026";
  return <div className="admin-page">
    <PageHeading eyebrow={`Business analytics · ${period}`} title="Overview" description={`Students, Sidekick and product activity · ${period.toLowerCase()}.`}><div className="admin-heading-actions"><span className="admin-updated">Updated {dateTime(data.updatedAt)} IST</span><ScopeSelect scope={scope}/></div></PageHeading>
    <div className="admin-metrics admin-metrics-five">
      <Metric label={scope === "all" ? "Total signups" : "Standalone signups"} value={data.totalUsers} detail={`${number(data.usersToday)} joined today · IST`} icon={<Users size={17}/>}/>
      <Metric label="Paid users" value={data.paidUsers} detail={`${data.conversionRate}% have current paid access`} icon={<CreditCard size={17}/>}/>
      <Metric label="Free ebooks claimed" value={data.claims} detail={`${number(data.claimsToday)} claimed today`} icon={<BookOpen size={17}/>}/>
      <Metric label="Online now" value={data.onlineUsers} detail="Visible dashboard in the last 2 minutes" icon={<Radio size={17}/>} live/>
      <Metric label="Instagram followers" value={data.instagram.followers ?? "—"} detail={data.instagram.followers !== null ? `@${data.instagram.username} · Live from Meta` : data.instagram.configured ? (data.instagram.error ?? "Temporarily unavailable") : "Connect Meta API to show the live count"} icon={<Instagram size={17}/>}/>
    </div>
    <div className="admin-summary-strip"><span>New signups <strong>{number(data.usersWeek)}</strong><small>last 7 days</small></span><span>New signups <strong>{number(data.usersMonth)}</strong><small>{period.toLowerCase()}</small></span><span>Active today <strong>{number(data.activeToday)}</strong><small>dashboard visitors</small></span><span>Bundle owners <strong>{number(data.bundleOwners)}</strong><small>{period.toLowerCase()}</small></span></div>
    <div className="admin-grid-main"><Panel title="Signup growth" caption={`Daily signups · ${period} · IST`}><TrendChart data={data.signupTrend}/></Panel>
      <Panel title="Current access" caption="Paid access excludes expired plans"><div className="admin-plan-total">{number(data.totalUsers)}<span>registered users</span></div>{data.planBreakdown.map(p => <div className="admin-plan-row" key={p.plan}><span><i className={p.plan === "Free" ? "muted" : ""}/>{p.plan}</span><strong>{number(p.count)}</strong></div>)}<Link className="admin-text-link admin-panel-footer" href="/admin/users">Manage users<ArrowUpRight size={14}/></Link></Panel></div>
    <div className="admin-grid-equal"><Panel title="Most opened features" caption={`${period} · Unique user/feature/minute`} href={`/admin/features${scope === "all" ? "?scope=all" : ""}`}><FeatureRanking rows={data.featureRanking.slice(0, 5)}/></Panel>
      <Panel title="Sidekick claims" caption={`${data.claimRate}% of registered users have claimed a free ebook`} href="/admin/users?filter=claimed">{data.claimBreakdown.length ? <div className="admin-claims">{data.claimBreakdown.map(b => <div key={b.subject}><span>{b.subject}</span><strong>{number(b.count)}</strong></div>)}</div> : <Empty>No free ebooks claimed yet.</Empty>}</Panel></div>
    <div className="admin-grid-main"><Panel title="Recent signups" caption="The latest students joining Saviours" href="/admin/users"><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Student</th><th>Plan</th><th>Joined · IST</th></tr></thead><tbody>{data.recentUsers.map(u => <tr key={u.id}><td><strong>{u.name}</strong><small>{u.email}</small></td><td><span className={`admin-badge ${u.planType !== "FREE" ? "cyan" : ""}`}>{u.planType}</span></td><td>{dateTime(u.createdAt)}</td></tr>)}</tbody></table></div>{!data.recentUsers.length && <Empty>No signups yet.</Empty>}</Panel>
      <Panel title="Latest free ebooks" caption="Successful spinwheel claims">{data.recentClaims.length ? data.recentClaims.map(c => <div className="admin-activity-row" key={c.id}><BookOpen size={16}/><div><strong>{c.name}</strong><p>{c.subject}</p><small>{dateTime(c.claimedAt)} IST</small></div></div>) : <Empty>Claims will appear here.</Empty>}</Panel></div>
    <p className="admin-footnote">{scope === "all" ? "All historical business data is included." : "Pre-November creator-partnership data is excluded."} Demo accounts are always excluded. Paid access can include administrative grants.</p>
  </div>;
}
