"use client";
import type { FeatureStats } from "@/lib/admin";
import type { AdminScope } from "@/lib/admin-period";
import { PageHeading, ScopeSelect, Metric, Panel, Empty, TrendChart, FeatureRanking, number } from "../AdminUI";
export default function FeaturesDashboard({ data, scope }: { data: FeatureStats; scope: AdminScope }) {
  const period = scope === "all" ? "All time" : "Since 1 Nov 2026";
  return <div className="admin-page"><PageHeading eyebrow={`Business analytics · ${period}`} title="Feature usage" description="Understand what students open and the study activity they complete."><ScopeSelect scope={scope}/></PageHeading>
    <div className="admin-metrics"><Metric label="AI requests" value={data.totalAiCalls} detail={period}/><Metric label="Practice tests started" value={data.tests} detail={period}/><Metric label="Focus hours" value={data.focusHours} detail={`${number(data.focusSessions)} sessions · ${period}`}/><Metric label="Notes created" value={data.notes} detail={`${number(data.doubts)} doubt conversations`}/></div>
    <div className="admin-grid-equal"><Panel title="Feature opens" caption={`${period} · Unique user/feature/minute`}><FeatureRanking rows={data.featureRanking}/></Panel><Panel title="AI activity" caption={`Daily AI requests · ${period} · IST`}><TrendChart data={data.aiTrend}/><p className="admin-footnote">{number(data.tokens)} tokens used across recorded AI features.</p></Panel></div>
    <Panel title="AI requests by feature" caption={`Server-recorded requests · ${period}`}><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Feature</th><th>Requests</th><th>Tokens</th><th>Share of requests</th></tr></thead><tbody>{data.ai.map(f => <tr key={f.feature}><td style={{ textTransform: "capitalize" }}>{f.feature}</td><td>{number(f.calls)}</td><td>{number(f.tokens)}</td><td>{data.totalAiCalls ? (f.calls / data.totalAiCalls * 100).toFixed(1) : "0"}%</td></tr>)}</tbody></table></div>{!data.ai.length && <Empty>No AI requests recorded in this period.</Empty>}</Panel>
    <p className="admin-footnote">{scope === "all" ? "All historical activity is included." : "Pre-November creator-partnership users and activity are excluded."} Feature opens track navigation; AI requests, tests and focus sessions are separate server-recorded events.</p>
  </div>;
}
