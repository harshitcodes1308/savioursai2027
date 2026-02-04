"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function Sprint15Page() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Fetch existing sprints
  const { data: sprints, isLoading, refetch } = trpc.sprint15.list.useQuery(undefined, {
    enabled: !showCreateForm,
  });
  
  const activeSprint = sprints?.find((s: any) => s.status === "ACTIVE" || s.status === "DIAGNOSTIC_PENDING");
  
  if (showCreateForm) {
    return <CreateSprintForm onClose={() => {
      setShowCreateForm(false);
      refetch();
    }} />;
  }
  
  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#9CA3AF" }}>Loading your sprints...</div>
      </div>
    );
  }
  
  // Show active sprint if exists
  if (activeSprint) {
    return <ActiveSprintDashboard sprint={activeSprint} onCreateNew={() => setShowCreateForm(true)} />;
  }
  
  // Empty state - create new sprint
  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ 
          fontSize: "2rem", 
          fontWeight: 700, 
          color: "#FFF", 
          marginBottom: "0.5rem" 
        }}>
          🚀 15-Day ICSE Sprint
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: "1rem" }}>
          Your personalized 15-day study marathon for board exams
        </p>
      </div>
      
      {/* Empty State Card */}
      <div style={{
        background: "rgba(31,31,34,0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "1rem",
        padding: "3rem 2rem",
        textAlign: "center",
        marginBottom: "2rem"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎯</div>
        <h2 style={{ 
          fontSize: "1.75rem", 
          fontWeight: 700, 
          color: "#FFF", 
          marginBottom: "1rem" 
        }}>
          Ready to Start Your Sprint?
        </h2>
        <p style={{ 
          color: "#9CA3AF", 
          marginBottom: "2rem",
          maxWidth: "500px",
          margin: "0 auto 2rem"
        }}>
          Get a personalized 15-day study plan with AI-powered diagnostics, daily targets, and score predictions.
        </p>
        
        {/* Feature Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
          textAlign: "left"
        }}>
          <div style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "0.75rem",
            padding: "1.25rem"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📝</div>
            <div style={{ color: "#FFF", fontWeight: 600, marginBottom: "0.25rem" }}>Diagnostic Test</div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Find your weak areas</div>
          </div>
          
          <div style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "0.75rem",
            padding: "1.25rem"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
            <div style={{ color: "#FFF", fontWeight: 600, marginBottom: "0.25rem" }}>Daily Study Plans</div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Personalized targets</div>
          </div>
          
          <div style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "0.75rem",
            padding: "1.25rem"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
            <div style={{ color: "#FFF", fontWeight: 600, marginBottom: "0.25rem" }}>Score Prediction</div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Know your expected marks</div>
          </div>
          
          <div style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "0.75rem",
            padding: "1.25rem"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👨‍👩‍👦</div>
            <div style={{ color: "#FFF", fontWeight: 600, marginBottom: "0.25rem" }}>Parent Reports</div>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Track progress together</div>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: "1rem 2.5rem",
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            color: "#FFF",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            borderRadius: "0.75rem",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(139,92,246,0.3)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(139,92,246,0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139,92,246,0.3)";
          }}
        >
          Start New Sprint →
        </button>
      </div>
      
      {/* Past Sprints */}
      {sprints && sprints.length > 0 && (
        <div>
          <h3 style={{ 
            fontSize: "1.25rem", 
            fontWeight: 600, 
            color: "#FFF", 
            marginBottom: "1rem" 
          }}>
            Past Sprints
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sprints.map((sprint: any) => (
              <div
                key={sprint.id}
                onClick={() => router.push(`/dashboard/sprint/${sprint.id}`)}
                style={{
                  background: "rgba(31,31,34,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                  e.currentTarget.style.background = "rgba(31,31,34,0.8)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(31,31,34,0.6)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "#FFF", fontWeight: 500, marginBottom: "0.25rem" }}>
                      {sprint.subjects.join(", ")}
                    </div>
                    <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                      {new Date(sprint.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    padding: "0.25rem 0.75rem",
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: "9999px",
                    color: "#A78BFA",
                    fontSize: "0.75rem",
                    fontWeight: 500
                  }}>
                    {sprint.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateSprintForm({ onClose }: { onClose: () => void }) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [dailyHours, setDailyHours] = useState(3);
  // Auto-calculate exam date as 10 days from now
  
  // ICSE Class 10 subjects
  const availableSubjects = [
    "Mathematics",
    "English Language", 
    "English Literature",
    "Physics",
    "Chemistry",
    "Biology",
    "History & Civics",
    "Geography",
    "Computer Applications",
    "Commercial Studies",
    "Economics",
    "Hindi",
    "Sanskrit"
  ];
  
  const createSprint = trpc.sprint15.create.useMutation({
    onSuccess: () => {
      onClose();
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (subjects.length === 0) {
      alert("Please select at least one subject");
      return;
    }
    
    // Auto-calculate exam date as 10 days from now
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 10);
    
    createSprint.mutate({
      subjects,
      dailyStudyHours: dailyHours,
      examDate: examDate.toISOString().split('T')[0], // YYYY-MM-DD format
    });
  };
  
  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={onClose}
          style={{
            color: "#9CA3AF",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ← Back
        </button>
        <h1 style={{ 
          fontSize: "2rem", 
          fontWeight: 700, 
          color: "#FFF", 
          marginBottom: "0.5rem" 
        }}>
          Create Your Sprint
        </h1>
        <p style={{ color: "#9CA3AF" }}>
          Tell us about your exam prep
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Subjects */}
        <div style={{
          background: "rgba(31,31,34,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "0.75rem",
          padding: "1.5rem"
        }}>
          <label style={{ 
            display: "block", 
            color: "#FFF", 
            fontWeight: 600, 
            marginBottom: "1rem" 
          }}>
            Select Subjects
          </label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.75rem"
          }}>
            {availableSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => {
                  if (subjects.includes(subject)) {
                    setSubjects(subjects.filter(s => s !== subject));
                  } else {
                    setSubjects([...subjects, subject]);
                  }
                }}
                style={{
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: subjects.includes(subject) 
                    ? "2px solid #8B5CF6" 
                    : "2px solid rgba(255,255,255,0.08)",
                  background: subjects.includes(subject)
                    ? "rgba(139,92,246,0.15)"
                    : "rgba(255,255,255,0.03)",
                  color: subjects.includes(subject) ? "#FFF" : "#9CA3AF",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  minHeight: "44px"
                }}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
        
        {/* Daily Study Hours */}
        <div style={{
          background: "rgba(31,31,34,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "0.75rem",
          padding: "1.5rem"
        }}>
          <label style={{ 
            display: "block", 
            color: "#FFF", 
            fontWeight: 600, 
            marginBottom: "1rem" 
          }}>
            Daily Study Hours
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              type="range"
              min="1"
              max="8"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              style={{
                flex: 1,
                height: "8px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "4px",
                outline: "none",
                cursor: "pointer"
              }}
            />
            <div style={{ 
              color: "#8B5CF6", 
              fontSize: "2rem", 
              fontWeight: 700,
              minWidth: "60px",
              textAlign: "center"
            }}>
              {dailyHours}h
            </div>
          </div>
        </div>
        
        {/* Auto-calculated: 10-day sprint */}
        <div style={{
          background: "rgba(31,31,34,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          textAlign: "center"
        }}>
          <div style={{ 
            color: "#A78BFA", 
            fontWeight: 600, 
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Sprint Duration
          </div>
          <div style={{ 
            color: "#FFF", 
            fontSize: "2rem", 
            fontWeight: 700,
            marginBottom: "0.25rem"
          }}>
            10 Days
          </div>
          <div style={{ 
            color: "rgba(255,255,255,0.5)", 
            fontSize: "0.875rem"
          }}>
            Starts immediately upon creation
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={createSprint.isPending}
          style={{
            width: "100%",
            padding: "1rem",
            background: createSprint.isPending 
              ? "rgba(156,163,175,0.3)" 
              : "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            color: "#FFF",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            borderRadius: "0.75rem",
            cursor: createSprint.isPending ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            boxShadow: createSprint.isPending ? "none" : "0 4px 12px rgba(139,92,246,0.3)",
            minHeight: "50px"
          }}
        >
          {createSprint.isPending ? "Creating Sprint..." : "Create Sprint →"}
        </button>
      </form>
    </div>
  );
}

function ActiveSprintDashboard({ sprint, onCreateNew }: { sprint: any; onCreateNew: () => void }) {
  const router = useRouter();
  
  // Get current day's plan
  const dailyPlans = sprint.dailyPlans as any[];
  const currentPlan = dailyPlans?.[sprint.currentDay - 1];
  
  // Safety check
  if (!currentPlan || !currentPlan.subjects) {
    console.warn("[Sprint UI] No current plan or subjects found for day", sprint.currentDay);
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header with New Sprint button */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#FFF" }}>
            🚀 15-Day Sprint
          </h1>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{
              padding: "0.5rem 1rem",
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "9999px",
              color: "#A78BFA",
              fontWeight: 600
            }}>
              Day {sprint.currentDay}/15
            </div>
            <button
              onClick={onCreateNew}
              style={{
                padding: "0.5rem 1rem",
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                border: "none",
                borderRadius: "0.5rem",
                color: "#FFF",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: "36px"
              }}
            >
              + New Sprint
            </button>
            <button
              onClick={() => router.push("/dashboard/sprint")}
              style={{
                padding: "0.5rem 1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.5rem",
                color: "#9CA3AF",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: "36px"
              }}
            >
              ← Back
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          height: "12px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "9999px",
          overflow: "hidden"
        }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)",
              width: `${((sprint.currentDay) / 15) * 100}%`,
              transition: "width 0.5s ease"
            }}
          />
        </div>
      </div>
      
      {/* Diagnostic Pending */}
      {sprint.status === "DIAGNOSTIC_PENDING" && (
        <div style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.15) 100%)",
          border: "1px solid rgba(249,115,22,0.3)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1.5rem"
        }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
            <div style={{ fontSize: "3rem" }}>⚡</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: "1.5rem", 
                fontWeight: 700, 
                color: "#FFF", 
                marginBottom: "0.5rem" 
              }}>
                Start with Diagnostic Test
              </h3>
              <p style={{ color: "#D1D5DB", marginBottom: "1rem" }}>
                Complete a quick assessment to personalize your study plan
              </p>
              <button
                onClick={() => router.push(`/dashboard/sprint/${sprint.id}/diagnostic`)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                  color: "#FFF",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  minHeight: "44px"
                }}
              >
                Start Diagnostic →
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Active Sprint - Today's Plan */}
      {sprint.status === "ACTIVE" && currentPlan && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Today's Plan */}
        <div style={{
          background: "rgba(31,31,34,0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
          padding: "2rem",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#FFF",
            marginBottom: "1.5rem"
          }}>
            📅 Today's Plan - Day {sprint.currentDay}
          </h2>
          
          {currentPlan?.subjects?.length > 0 ? (
            currentPlan.subjects.map((subj: any, idx: number) => (
              <div key={idx} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#FFF" }}>{subj.name}</h3>
                  <span style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>{subj.time_minutes} mins</span>
                </div>
                <div style={{ color: "#D1D5DB", fontSize: "0.875rem" }}>
                  {subj.chapters?.join(", ") || "No chapters"}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#9CA3AF", textAlign: "center", padding: "2rem" }}>
              No plan data available for Day {sprint.currentDay}
            </div>
          )}
            
            <button
              onClick={() => router.push(`/dashboard/sprint/${sprint.id}/day/${sprint.currentDay}`)}
              style={{
                width: "100%",
                marginTop: "1rem",
                padding: "0.75rem",
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                color: "#FFF",
                fontWeight: 600,
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                minHeight: "44px"
              }}
            >
              View Full Plan →
            </button>
          </div>
          
          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              background: "rgba(31,31,34,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.75rem",
              padding: "1.25rem"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.25rem" }}>
                {sprint.predictedScoreRange}
              </div>
              <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Predicted Score</div>
            </div>
            
            <div style={{
              background: "rgba(31,31,34,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.75rem",
              padding: "1.25rem"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔥</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.25rem" }}>
                {sprint.currentDay - 1}
              </div>
              <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Days Completed</div>
            </div>
            
            <div style={{
              background: "rgba(31,31,34,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.75rem",
              padding: "1.25rem"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏰</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.25rem" }}>
                {sprint.dailyStudyHours}h
              </div>
              <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Study/Day</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
