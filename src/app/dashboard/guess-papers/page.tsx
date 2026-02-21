"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TYQ_SUBJECTS, READING_TIME_MINUTES } from "@/data/tyq-config";

export default function TYQPage() {
  const router = useRouter();
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

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
            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
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

      {/* How It Works */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.05))",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 36,
      }}>
        <h3 style={{ color: "#8B5CF6", fontSize: 14, fontWeight: 700, margin: "0 0 16px", letterSpacing: 1, textTransform: "uppercase" }}>
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
          return (
            <button
              key={subject.id}
              onClick={() => router.push(`/dashboard/guess-papers/${subject.id}`)}
              onMouseEnter={() => setHoveredSubject(subject.id)}
              onMouseLeave={() => setHoveredSubject(null)}
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${subject.color}15, ${subject.color}08)`
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${isHovered ? subject.color + "40" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16,
                padding: "24px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.3s ease",
                transform: isHovered ? "translateY(-2px)" : "none",
                boxShadow: isHovered ? `0 8px 24px ${subject.color}15` : "none",
              }}
            >
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
                  →
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
