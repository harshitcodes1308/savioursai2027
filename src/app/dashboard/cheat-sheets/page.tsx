"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";

const SHEETS: Array<{
  subject: string;
  description: string;
  topics: string;
  file: string;
  icon: AppIconName;
  color: string;
}> = [
  {
    subject: "Mathematics",
    description: "Every formula, identity and theorem in one revision-ready guide.",
    topics: "GST, quadratics, matrices, trigonometry, statistics and probability",
    file: "/cheat-sheets/mathematics-cheat-sheet.pdf",
    icon: "calculator",
    color: "#60A5FA",
  },
  {
    subject: "Chemistry",
    description: "Key reactions, equations and tests for fast revision before an exam.",
    topics: "Periodic table, bonding, acids and salts, electrolysis and organic chemistry",
    file: "/cheat-sheets/chemistry-cheat-sheet.pdf",
    icon: "flask",
    color: "#3ECF8E",
  },
  {
    subject: "Physics",
    description: "Laws, formulas, units and must-know concepts in a concise reference.",
    topics: "Moments, light, sound, electricity, magnetism, heat and radioactivity",
    file: "/cheat-sheets/physics-cheat-sheet.pdf",
    icon: "gauge",
    color: "#60A5FA",
  },
];

export default function CheatSheetsPage() {
  const { isMobile } = useResponsive();

  return <main style={{ minHeight: "100vh", padding: isMobile ? "28px 16px 100px" : "48px", background: "var(--bg-base)" }}>
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <header style={{ maxWidth: 650, marginBottom: isMobile ? 28 : 38 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 10px", borderRadius: 99, color: "var(--accent-gold)", background: "var(--accent-gold-glow)", border: "1px solid var(--accent-gold-border)", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: ".1em" }}><AppIcon name="file-check" size={13} />FREE REVISION RESOURCES</div>
        <h1 style={{ margin: "15px 0 8px", color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: isMobile ? 31 : 42, letterSpacing: "-.035em" }}>Cheat Sheets</h1>
        <p style={{ margin: 0, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65 }}>Quick, printable ICSE Class 10 revision sheets. Open one to revise online or download it to keep before your exam.</p>
      </header>

      <section aria-label="Free cheat sheets" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {SHEETS.map((sheet) => <article key={sheet.subject} style={{ minWidth: 0, display: "flex", flexDirection: "column", padding: isMobile ? 20 : 22, borderRadius: 16, background: "var(--bg-surface)", border: "1px solid var(--bg-border)" }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, display: "grid", placeItems: "center", color: sheet.color, background: `${sheet.color}12`, border: `1px solid ${sheet.color}30` }}><AppIcon name={sheet.icon} size={23} /></div>
          <h2 style={{ margin: "17px 0 7px", color: "var(--text-primary)", fontFamily: "var(--font-display)", fontSize: 21 }}>{sheet.subject}</h2>
          <p style={{ margin: "0 0 12px", color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.6 }}>{sheet.description}</p>
          <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 11, lineHeight: 1.55, flex: 1 }}>{sheet.topics}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 8 }}>
            <a href={sheet.file} target="_blank" rel="noreferrer" style={secondaryButton}><AppIcon name="eye" size={15} />Preview</a>
            <a href={sheet.file} download={`${sheet.subject.toLowerCase()}-cheat-sheet.pdf`} style={primaryButton}><AppIcon name="download" size={16} />Download PDF</a>
          </div>
        </article>)}
      </section>

      <p style={{ margin: "20px 0 0", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12 }}>All cheat sheets are free for every Saviours AI student.</p>
    </div>
  </main>;
}

const primaryButton = { display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 7, padding: "11px 10px", borderRadius: 9, background: "var(--accent-gold-glow)", border: "1px solid var(--accent-gold-border)", color: "var(--accent-gold)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" };
const secondaryButton = { display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 6, padding: "11px 9px", borderRadius: 9, background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", color: "var(--text-secondary)", textDecoration: "none", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600 };
