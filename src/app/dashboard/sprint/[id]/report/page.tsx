"use client";

import { use } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function ParentReportPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: report, isLoading } = trpc.sprint15.getReport.useQuery({ sprintId: id });
  
  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#9CA3AF" }}>Generating report...</div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#EF4444" }}>Report not found</div>
      </div>
    );
  }
  
  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#FFF", marginBottom: "1rem" }}>
          🎓 15-Day Sprint Complete!
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>
          Parent Progress Report
        </p>
      </div>
      
      {/* Score Summary */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(124,58,237,0.2) 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
        borderRadius: "1rem",
        padding: "2rem",
        marginBottom: "2rem"
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "1.5rem" }}>
          📊 Overall Performance
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Subjects Completed</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10B981" }}>{report.subjects.length}</div>
          </div>
          
          <div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Diagnostic Score</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#8B5CF6" }}>{report.diagnosticScore}%</div>
          </div>
          
          <div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Average Daily Score</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10B981" }}>{report.averageDailyScore}%</div>
          </div>
          
          <div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Improvement</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: report.improvement >= 0 ? "#10B981" : "#EF4444" }}>
              {report.improvement >= 0 ? "+" : ""}{report.improvement}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Predicted vs Actual */}
      <div style={{
        background: "rgba(31,31,34,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem",
        padding: "2rem",
        marginBottom: "2rem"
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "1.5rem" }}>
          🎯 Board Exam Prediction
        </h2>
        
        <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ color: "#9CA3AF", marginBottom: "0.5rem" }}>Predicted (Day 1)</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#8B5CF6" }}>{report.predictedBoardScore}</div>
          </div>
          
          <div style={{ fontSize: "2rem", color: "#4B5563" }}>→</div>
          
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ color: "#9CA3AF", marginBottom: "0.5rem" }}>Current Performance</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10B981" }}>{report.currentPerformance}</div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1rem", 
          background: "rgba(16,185,129,0.1)", 
          borderRadius: "0.5rem",
          color: "#10B981"
        }}>
          ✨ {report.message}
        </div>
      </div>
      
      {/* Subject-wise Performance */}
      <div style={{
        background: "rgba(31,31,34,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem",
        padding: "2rem",
        marginBottom: "2rem"
      }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "1.5rem" }}>
          📚 Subject-wise Breakdown
        </h2>
        
        {report.subjectPerformance.map((subj: any, idx: number) => (
          <div key={idx} style={{
            padding: "1.5rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "0.75rem",
            marginBottom: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#FFF" }}>{subj.subject}</h3>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#10B981" }}>{subj.averageScore}%</div>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Chapters Completed</div>
              <div style={{ color: "#FFF" }}>{subj.chaptersCompleted} / {subj.totalChapters}</div>
            </div>
            
            {subj.strongTopics.length > 0 && (
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "#10B981", marginRight: "0.5rem" }}>✓ Strong:</span>
                <span style={{ color: "#D1D5DB" }}>{subj.strongTopics.join(", ")}</span>
              </div>
            )}
            
            {subj.weakTopics.length > 0 && (
              <div>
                <span style={{ color: "#F59E0B", marginRight: "0.5rem" }}>⚠ Needs Work:</span>
                <span style={{ color: "#D1D5DB" }}>{subj.weakTopics.join(", ")}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          onClick={() => router.push("/dashboard/sprint")}
          style={{
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            border: "none",
            borderRadius: "0.75rem",
            color: "#FFF",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(139,92,246,0.3)"
          }}
        >
          Start New Sprint
        </button>
        
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "1rem 2rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.75rem",
            color: "#9CA3AF",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
