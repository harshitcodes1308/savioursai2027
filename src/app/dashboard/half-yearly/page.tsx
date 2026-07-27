"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { HALF_YEARLY_DATA, HALF_YEARLY_SUBJECT_KEYS, type HalfYearlySubjectKey } from "@/data/halfYearlyData";

const PROGRESS_KEY = "half-yearly-progress";
type Progress = Record<string, { step: number; completed: boolean }>;

function progress(): Progress {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}

export default function HalfYearlySubjectsPage() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const [mounted, setMounted] = useState(false);
  const [savedProgress, setSavedProgress] = useState<Progress>({});

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { setSavedProgress(progress()); setMounted(true); });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return <Loading />;

  const completion = (subject: HalfYearlySubjectKey) => {
    const chapters = HALF_YEARLY_DATA[subject].chapters;
    const complete = chapters.filter(({ id }) => savedProgress[`${subject}:${id}`]?.completed).length;
    return { complete, total: chapters.length, percent: Math.round((complete / chapters.length) * 100) };
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", padding: isMobile ? "22px 16px 100px" : isTablet ? "36px 28px" : "48px", boxSizing: "border-box" }}>
      <style>{`@keyframes hy-in { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <header style={{ marginBottom: isMobile ? 26 : 40, animation: "hy-in .35s ease-out" }}>
          <div style={{ color: "var(--accent-gold)", fontSize: 10, fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>Guided revision programme</div>
          <h1 style={{ margin: 0, color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: isMobile ? 30 : 44, letterSpacing: "-.035em" }}>Half Yearly Simulator</h1>
          <p style={{ margin: "11px 0 0", color: "var(--text-muted)", fontFamily: "var(--font-tagline)", fontStyle: "italic", fontSize: isMobile ? 14 : 16 }}>Watch. Read. Test. Master half the syllabus.</p>
        </header>

        <section aria-label="Subjects" style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : isTablet ? "repeat(3, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 10 : 16 }}>
          {HALF_YEARLY_SUBJECT_KEYS.map((key, index) => {
            const subject = HALF_YEARLY_DATA[key];
            const done = completion(key);
            return <button key={key} onClick={() => router.push(`/dashboard/half-yearly/${key}`)} style={{ textAlign: "left", cursor: "pointer", borderRadius: 16, padding: isMobile ? 15 : 20, minHeight: isMobile ? 164 : 185, background: "var(--bg-surface)", border: "1px solid var(--bg-border)", color: "inherit", transition: "transform .2s ease, border-color .2s ease", animation: `hy-in .35s ease-out ${index * 45}ms both` }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${subject.color}70`; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--bg-border)"; }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: isMobile ? 28 : 34 }}>{subject.icon}</span><span style={{ color: subject.color, fontFamily: "var(--font-body)", fontSize: 11 }}>{done.percent}%</span></div>
              <div style={{ marginTop: 20, color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: isMobile ? 14 : 17, lineHeight: 1.15 }}>{subject.label}</div>
              <div style={{ marginTop: 7, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 11 }}>{done.complete}/{done.total} chapters complete</div>
              <div style={{ height: 4, marginTop: 14, background: "var(--bg-elevated)", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${done.percent}%`, height: "100%", background: subject.color, borderRadius: 10, transition: "width .3s" }} /></div>
            </button>;
          })}
        </section>
      </div>
    </main>
  );
}

function Loading() { return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-base)", color: "var(--accent-gold)", fontFamily: "var(--font-body)" }}>Loading simulator…</div>; }
