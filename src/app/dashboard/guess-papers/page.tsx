"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TYQ_SUBJECTS, READING_TIME_MINUTES } from "@/data/tyq-config";
import { trpc } from "@/lib/trpc/client";
import { UpgradePrompt } from "@/components/UpgradePrompt";

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
          <span style={{ fontSize: 32 }}>📄</span>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#FFF",
            margin: 0,
            background: "linear-gradient(135deg, #00D4FF, #EC4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Guess Papers
          </h1>
        </div>
        <p style={{ color: "#9CA3AF", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
          Practice with ICSE 2026 specimen papers under real exam conditions.
          Select a subject to begin your timed practice session.
        </p>
      </div>

      {/* Free tier banner */}
      {!isPaid && (
        <div style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.05))",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 13,
          color: "#9CA3AF",
        }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span>
            <strong style={{ color: "#60A5FA" }}>Free Tier:</strong> Physics guess papers are available for free.{" "}
            <button
              onClick={() => setShowUpgrade(true)}
              style={{
                background: "none", border: "none", color: "#3B82F6",
                fontWeight: 700, cursor: "pointer", textDecoration: "underline",
                fontSize: 13, padding: 0,
              }}
            >Upgrade to Pro</button> to unlock all 10 subjects.
          </span>
        </div>
      )}

      {/* How It Works */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.05))",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 36,
      }}>
        <h3 style={{ color: "#00D4FF", fontSize: 14, fontWeight: 700, margin: "0 0 16px", letterSpacing: 1, textTransform: "uppercase" }}>
          📋 How It Works
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { step: "1", icon: "📚", title: "Select Subject", desc: "Choose from 10 ICSE subjects" },
            { step: "2", icon: "👀", title: "Reading Time", desc: `${READING_TIME_MINUTES} minutes to read questions` },
            { step: "3", icon: "✍️", title: "Exam Mode", desc: "Timed exam (2h 30m / 3h for Maths)" },
            { step: "4", icon: "✅", title: "Answer Key", desc: "Review answers after time ends" },
          ].map((item) => (
            <div key={item.step} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(139,92,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#E5E7EB", marginBottom: 2 }}>
                  Step {item.step}: {item.title}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{item.desc}</div>
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
                background: isHovered
                  ? `linear-gradient(135deg, ${subject.color}15, ${subject.color}08)`
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${isHovered ? subject.color + "40" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16,
                padding: "24px 20px",
                cursor: isLocked ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.3s ease",
                transform: isHovered && !isLocked ? "translateY(-2px)" : "none",
                boxShadow: isHovered && !isLocked ? `0 8px 24px ${subject.color}15` : "none",
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
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#60A5FA",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    🔒 Unlock with Pro
                  </div>
                </div>
              )}

              {/* Icon + Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${subject.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24,
                }}>
                  {subject.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>
                    {subject.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                    {subject.papers} Specimen Papers
                  </div>
                </div>
              </div>

              {/* Info */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: 10,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Exam Duration</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: subject.color }}>
                    {subject.examDuration === 180 ? "3 Hours" : "2h 30m"}
                  </div>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${subject.color}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: subject.color,
                }}>
                  {isLocked ? "🔒" : "→"}
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
