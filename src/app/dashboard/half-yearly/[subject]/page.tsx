"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { HALF_YEARLY_DATA, type HalfYearlySubjectKey } from "@/data/halfYearlyData";

const PROGRESS_KEY = "half-yearly-progress";
type Progress = Record<string, { step: number; completed: boolean }>;
const getProgress = (): Progress => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; } };

export default function HalfYearlyChaptersPage() {
  const router = useRouter();
  const params = useParams();
  const { isMobile, isTablet } = useResponsive();
  const [mounted, setMounted] = useState(false);
  const [savedProgress, setSavedProgress] = useState<Progress>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const subjectKey = params.subject as HalfYearlySubjectKey;
  const subject = HALF_YEARLY_DATA[subjectKey];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { setSavedProgress(getProgress()); setMounted(true); });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!mounted) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-base)", color: "var(--accent-gold)" }}>Loading simulator…</div>;
  if (!subject) return <NotFound back={() => router.push("/dashboard/half-yearly")} />;

  return <main style={{ minHeight: "100vh", background: "var(--bg-base)", padding: isMobile ? "22px 16px 100px" : isTablet ? "36px 28px" : "48px", boxSizing: "border-box" }}>
    <style>{`@keyframes hy-list { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <button onClick={() => router.push("/dashboard/half-yearly")} style={backStyle}>← All subjects</button>
      <header style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 0 30px" }}>
        <span style={{ fontSize: isMobile ? 34 : 42 }}>{subject.icon}</span><div><h1 style={{ margin: 0, color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: isMobile ? 27 : 36, letterSpacing: "-.03em" }}>{subject.label}</h1><p style={{ color: "var(--text-muted)", margin: "5px 0 0", fontSize: 12, fontFamily: "var(--font-body)" }}>{subject.chapters.length} half-yearly chapters · Watch → Read → Test</p></div>
      </header>
      <div style={{ display: "grid", gap: 10 }}>
        {subject.chapters.map((chapter, index) => {
          const entry = savedProgress[`${subjectKey}:${chapter.id}`];
          const complete = entry?.completed;
          const inProgress = entry && !entry.completed;
          const active = hovered === chapter.id;
          return <button key={chapter.id} onClick={() => router.push(`/dashboard/half-yearly/${subjectKey}/${chapter.id}`)} onMouseEnter={() => setHovered(chapter.id)} onMouseLeave={() => setHovered(null)} style={{ textAlign: "left", cursor: "pointer", color: "inherit", background: active ? "var(--bg-elevated)" : "var(--bg-surface)", border: `1px solid ${complete ? "var(--accent-gold-border)" : active ? `${subject.color}75` : "var(--bg-border)"}`, borderRadius: 14, padding: isMobile ? "14px" : "17px 20px", display: "flex", alignItems: "center", gap: 14, transform: active ? "translateX(4px)" : "none", transition: "all .2s ease", animation: `hy-list .3s ease-out ${index * 35}ms both` }}>
            <span style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: 10, background: complete ? "var(--accent-gold-glow)" : "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: complete ? "var(--accent-gold)" : subject.color, flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 700 }}>{complete ? "✓" : index + 1}</span>
            <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: "block", color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: isMobile ? 14 : 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chapter.title}</span><span style={{ display: "block", marginTop: 4, color: complete ? "var(--accent-gold)" : inProgress ? subject.color : "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 11 }}>{complete ? "Completed" : inProgress ? `Step ${entry.step} of 3` : "Not started"}{!chapter.precisionChapter && " · guided reading"}</span></span>
            <span style={{ color: active ? subject.color : "var(--text-disabled)", fontSize: 17 }}>→</span>
          </button>;
        })}
      </div>
    </div>
  </main>;
}

const backStyle = { padding: 0, border: 0, background: "none", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12 };
function NotFound({ back }: { back: () => void }) { return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-display)", gap: 12 }}><div>Subject not found</div><button onClick={back} style={backStyle}>← Back to subjects</button></div>; }
