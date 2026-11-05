"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TYQ_SUBJECTS, READING_TIME_MINUTES } from "@/data/tyq-config";
import { trpc } from "@/lib/trpc/client";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";

export default function TYQPage() {
  const router = useRouter();
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const { data: session } = trpc.auth.getSession.useQuery();
  const isPaid = !!(session?.user as any)?.isPaid;
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubjectClick = (subjectId: string) => {
    // Free users can only access Physics
    if (!isPaid && subjectId !== "physics") {
      setShowUpgrade(true);
      return;
    }
    router.push(`/dashboard/guess-papers/${subjectId}`);
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid var(--accent-gold-border)", background: "var(--accent-gold-glow)", display: "grid", placeItems: "center", color: "var(--accent-gold)" }}>
            <AppIcon name="file" size={20} />
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--text-primary)",
            margin: 0,
          }}>
            Guess Papers
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
          Practice with ICSE 2026 specimen papers under real exam conditions.
          Select a subject to begin your timed practice session.
        </p>
      </div>

      {/* Free tier banner */}
      {!isPaid && (
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--accent-gold-border)",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 13,
          color: "var(--text-muted)",
        }}>
          <AppIcon name="info" size={18} color="var(--accent-gold)" />
          <span>
            <strong style={{ color: "var(--text-primary)" }}>Free tier:</strong> Physics guess papers are available for free.{" "}
            <button
              onClick={() => setShowUpgrade(true)}
              style={{
                background: "none", border: "none", color: "var(--accent-gold)",
                fontWeight: 700, cursor: "pointer",
                fontSize: 13, padding: 0,
              }}
            >Upgrade to Pro</button> to unlock all 10 subjects.
          </span>
        </div>
      )}

      {/* How It Works */}
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--bg-border)",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 36,
      }}>
        <h3 style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 700, margin: "0 0 18px", letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
          <AppIcon name="file-check" size={16} color="var(--accent-gold)" /> How it works
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { step: "1", icon: "book" as AppIconName, title: "Select subject", desc: "Choose from 9 ICSE subjects" },
            { step: "2", icon: "eye" as AppIconName, title: "Reading time", desc: `${READING_TIME_MINUTES} minutes to read questions` },
            { step: "3", icon: "pen" as AppIconName, title: "Exam mode", desc: "Timed exam (2h 30m / 3h for Maths)" },
            { step: "4", icon: "file-check" as AppIconName, title: "Answer key", desc: "Review answers after time ends" },
          ].map((item) => (
            <div key={item.step} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent-gold)", flexShrink: 0,
              }}>
                <AppIcon name={item.icon} size={17} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                  Step {item.step}: {item.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
      }}>
        {TYQ_SUBJECTS.map((subject) => {
          const isHovered = hoveredSubject === subject.id;
          const isLocked = !isPaid && subject.id !== "physics";
          return (
            <button
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              onMouseEnter={() => setHoveredSubject(subject.id)}
              onMouseLeave={() => setHoveredSubject(null)}
              style={{
                position: "relative",
                background: isHovered && !isLocked ? "var(--bg-elevated)" : "var(--bg-surface)",
                border: `1px solid ${isHovered && !isLocked ? "var(--accent-gold-border)" : "var(--bg-border)"}`,
                borderRadius: 16,
                padding: "24px 20px",
                cursor: isLocked ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.3s ease",
                transform: isHovered && !isLocked ? "translateY(-2px)" : "none",
                boxShadow: isHovered && !isLocked ? "0 12px 30px rgba(0,0,0,.22)" : "none",
                opacity: isLocked ? 0.55 : 1,
              }}
            >
              {/* Lock overlay for non-Physics subjects */}
              {isLocked && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(3,3,5,0.5)",
                  backdropFilter: "blur(2px)",
                  zIndex: 2,
                }}>
                  <div style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    <AppIcon name="lock" size={14} /> Unlock with Pro
                  </div>
                </div>
              )}

              {/* Icon + Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "var(--accent-gold-glow)", border: "1px solid var(--accent-gold-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent-gold)",
                }}>
                  <AppIcon name={subject.icon} size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                    {subject.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {subject.papers} Specimen Papers
                  </div>
                </div>
              </div>

              {/* Info */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px",
                background: "var(--bg-elevated)", border: "1px solid var(--bg-border)",
                borderRadius: 10,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Exam duration</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {subject.examDuration === 180 ? "3 Hours" : "2h 30m"}
                  </div>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isLocked ? "var(--text-disabled)" : "var(--accent-gold)",
                }}>
                  <AppIcon name={isLocked ? "lock" : "arrow-right"} size={16} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* UpgradePrompt overlay */}
      {showUpgrade && (
        <UpgradePrompt
          featureName="All Guess Papers"
          description="Access specimen papers for all 10 ICSE subjects — Physics, Chemistry, Biology, Maths, English, History, Geography, Computer, and more."
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
