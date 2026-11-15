"use client";
import Link from "next/link";
import { Users, CreditCard, BookOpen, Radio, ArrowUpRight } from "lucide-react";
import type { OverviewStats } from "@/lib/admin";
import { PageHeading, Metric, Panel, Empty, TrendChart, FeatureRanking, number, dateTime } from "./AdminUI";
export default function OverviewDashboard({ data }: { data: OverviewStats }) {
  return <div className="admin-page">
    <PageHeading eyebrow="Your workspace, at a glance" title="Overview" description="Students, Sidekick and product activity in one place."><span className="admin-updated">Updated {dateTime(data.updatedAt)} IST</span></PageHeading>
    <div className="admin-metrics">
      <Metric label="Total signups" value={data.totalUsers} detail={`${number(data.usersToday)} joined today · IST`} icon={<Users size={17}/>}/>
      <Metric label="Paid users" value={data.paidUsers} detail={`${data.conversionRate}% have current paid access`} icon={<CreditCard size={17}/>}/>
      <Metric label="Free ebooks claimed" value={data.claims} detail={`${number(data.claimsToday)} claimed today`} icon={<BookOpen size={17}/>}/>
      <Metric label="Online now" value={data.onlineUsers} detail="Visible dashboard in the last 2 minutes" icon={<Radio size={17}/>} live/>
    </div>
    <div className="admin-summary-strip"><span>New signups <strong>{number(data.usersWeek)}</strong><small>last 7 days</small></span><span>New signups <strong>{number(data.usersMonth)}</strong><small>last 30 days</small></span><span>Active today <strong>{number(data.activeToday)}</strong><small>dashboard visitors</small></span><span>Bundle owners <strong>{number(data.bundleOwners)}</strong><small>purchased bundle access</small></span></div>
    <div className="admin-grid-main"><Panel title="Signup growth" caption="Daily signups · Last 30 calendar days · IST"><TrendChart data={data.signupTrend}/></Panel>
      <Panel title="Current access" caption="Paid access excludes expired plans"><div className="admin-plan-total">{number(data.totalUsers)}<span>registered users</span></div>{data.planBreakdown.map(p => <div className="admin-plan-row" key={p.plan}><span><i className={p.plan === "Free" ? "muted" : ""}/>{p.plan}</span><strong>{number(p.count)}</strong></div>)}<Link className="admin-text-link admin-panel-footer" href="/admin/users">Manage users<ArrowUpRight size={14}/></Link></Panel></div>
    <div className="admin-grid-equal"><Panel title="Most opened features" caption="Last 30 days · Unique user/feature/minute" href="/admin/features"><FeatureRanking rows={data.featureRanking.slice(0, 5)}/></Panel>
      <Panel title="Sidekick claims" caption={`${data.claimRate}% of registered users have claimed a free ebook`} href="/admin/users?filter=claimed">{data.claimBreakdown.length ? <div className="admin-claims">{data.claimBreakdown.map(b => <div key={b.subject}><span>{b.subject}</span><strong>{number(b.count)}</strong></div>)}</div> : <Empty>No free ebooks claimed yet.</Empty>}</Panel></div>
    <div className="admin-grid-main"><Panel title="Recent signups" caption="The latest students joining Saviours" href="/admin/users"><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Student</th><th>Plan</th><th>Joined · IST</th></tr></thead><tbody>{data.recentUsers.map(u => <tr key={u.id}><td><strong>{u.name}</strong><small>{u.email}</small></td><td><span className={`admin-badge ${u.planType !== "FREE" ? "cyan" : ""}`}>{u.planType}</span></td><td>{dateTime(u.createdAt)}</td></tr>)}</tbody></table></div>{!data.recentUsers.length && <Empty>No signups yet.</Empty>}</Panel>
      <Panel title="Latest free ebooks" caption="Successful spinwheel claims">{data.recentClaims.length ? data.recentClaims.map(c => <div className="admin-activity-row" key={c.id}><BookOpen size={16}/><div><strong>{c.name}</strong><p>{c.subject}</p><small>{dateTime(c.claimedAt)} IST</small></div></div>) : <Empty>Claims will appear here.</Empty>}</Panel></div>
    <p className="admin-footnote">Demo accounts are excluded. Online counts start with the new activity tracker. Feature opens measure navigation, not completed tasks. Paid access can include administrative grants.</p>
  </div>;
}
