"use client";

import { use, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function DayPlanPage({ params }: { params: Promise<{ id: string; dayNumber: string }> }) {
  const router = useRouter();
  const { id, dayNumber: dayNumberStr } = use(params);
  const sprintId = id;
  const dayNumber = parseInt(dayNumberStr);
  
  // Fetch day plan
  const { data, isLoading } = trpc.sprint15.getDayPlan.useQuery({ 
    sprintId, 
    dayNumber 
  });
  
  const [showTest, setShowTest] = useState(false);
  
  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#9CA3AF" }}>Loading Day {dayNumber} plan...</div>
      </div>
    );
  }
  
  if (!data || !data.plan) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#EF4444" }}>Plan not found</div>
      </div>
    );
  }
  
  const plan = data.plan;
  
  if (showTest) {
    return <DailyTest sprintId={sprintId} dayNumber={dayNumber} plan={plan} onBack={() => setShowTest(false)} />;
  }
  
  return (
    <div style={{ padding: "1.5rem", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => router.push("/dashboard/sprint")}
          style={{
            color: "#9CA3AF",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            marginBottom: "1rem"
          }}
        >
          ← Back to Sprint
        </button>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#FFF" }}>
            📅 Day {dayNumber} Plan
          </h1>
          <div style={{
            padding: "0.5rem 1rem",
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "9999px",
            color: "#A78BFA",
            fontWeight: 600
          }}>
            Day {dayNumber}/15
          </div>
        </div>
      </div>
      
      {/* Subjects */}
      {plan.subjects?.map((subject: any, idx: number) => (
        <div
          key={idx}
          style={{
            background: "rgba(31,31,34,0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "1.5rem"
          }}
        >
          {/* Subject Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF" }}>
              {subject.name}
            </h2>
            <div style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
              ⏱ {subject.time_minutes} mins
            </div>
          </div>
          
          {/* Chapters */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#A78BFA", marginBottom: "0.75rem" }}>
              📚 Chapters to Study
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {subject.chapters?.map((chapter: string, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: "0.5rem",
                    color: "#D1D5DB",
                    fontSize: "0.875rem"
                  }}
                >
                  {chapter}
                </div>
              ))}
            </div>
          </div>
          
          {/* YouTube Queries */}
          {subject.youtube_queries && subject.youtube_queries.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#A78BFA", marginBottom: "0.75rem" }}>
                📺 Watch These Videos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {subject.youtube_queries.map((query: string, i: number) => (
                  <a
                    key={i}
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(255,0,0,0.08)",
                      border: "1px solid rgba(255,0,0,0.2)",
                      borderRadius: "0.5rem",
                      color: "#FF6B6B",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "all 0.2s",
                      display: "block"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(255,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(255,0,0,0.08)";
                    }}
                  >
                    ▶ {query}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Smart Notes */}
          {subject.smart_notes_topics && subject.smart_notes_topics.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#A78BFA", marginBottom: "0.75rem" }}>
                🧠 Smart Notes
              </h3>
              {subject.smart_notes_topics.map((note: any, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: "1rem",
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: "0.5rem",
                    marginBottom: "0.75rem"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#FFF", marginBottom: "0.5rem" }}>
                    {note.topic}
                  </div>
                  {note.formulas && note.formulas.length > 0 && (
                    <div style={{ color: "#D1D5DB", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                      <strong>Formulas:</strong> {note.formulas.join(", ")}
                    </div>
                  )}
                  {note.exam_tips && note.exam_tips.length > 0 && (
                    <div style={{ color: "#10B981", fontSize: "0.875rem" }}>
                      <strong>💡 Tip:</strong> {note.exam_tips[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Daily Targets */}
          {subject.daily_targets && subject.daily_targets.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#A78BFA", marginBottom: "0.75rem" }}>
                🎯 Daily Targets
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {subject.daily_targets.map((target: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      padding: "0.5rem 0",
                      color: "#D1D5DB",
                      fontSize: "0.875rem",
                      borderBottom: i < subject.daily_targets.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                    }}
                  >
                    ✓ {target}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      
      {/* Daily Test Button */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(124,58,237,0.15) 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
        borderRadius: "1rem",
        padding: "2rem",
        textAlign: "center"
      }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFF", marginBottom: "0.5rem" }}>
          📝 Daily Test
        </h3>
        <p style={{ color: "#D1D5DB", marginBottom: "1.5rem" }}>
          Complete today's test to track your progress
        </p>
        <button
          onClick={() => setShowTest(true)}
          style={{
            padding: "1rem 2.5rem",
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            color: "#FFF",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            borderRadius: "0.75rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
            minHeight: "50px"
          }}
        >
          Start Daily Test →
        </button>
      </div>
    </div>
  );
}

function DailyTest({ sprintId, dayNumber, plan, onBack }: any) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });
  
  const submitTest = trpc.sprint15.submitDailyTest.useMutation({
    onSuccess: () => {
      // If day 15 completed, show parent report
      if (dayNumber === 15) {
        router.push(`/dashboard/sprint/${sprintId}/report`);
      } else {
        router.push("/dashboard/sprint");
      }
    },
  });
  
  // Generate test questions based on plan
  const testQuestions = plan.subjects?.flatMap((subj: any) => 
    subj.test?.questions || []
  ) || [];
  
  const handleFinish = () => {
    // Calculate score
    let correct = 0;
    testQuestions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correct_answer) {
        correct++;
      }
    });
    
    const percentage = Math.round((correct / testQuestions.length) * 100);
    setScore({ correct, total: testQuestions.length, percentage });
    setShowResults(true);
  };
  
  const handleSubmitAfterReview = () => {
    submitTest.mutate({
      sprintId,
      dayNumber,
      answers: { answers, questions: testQuestions },
      timeSpent: 0
    });
  };
  
  // Show results screen
  if (showResults) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.2) 100%)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#FFF", marginBottom: "1rem" }}>
            {score.percentage >= 80 ? "🎉 Excellent!" : score.percentage >= 60 ? "👍 Good Job!" : "📚 Keep Practicing!"}
          </h1>
          
          <div style={{ fontSize: "4rem", fontWeight: 700, color: "#10B981", marginBottom: "1rem" }}>
            {score.percentage}%
          </div>
          
          <div style={{ color: "#D1D5DB", fontSize: "1.25rem", marginBottom: "2rem" }}>
            You scored {score.correct} out of {score.total} questions correctly
          </div>
          
          <div style={{
            padding: "1.5rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "0.75rem",
            marginBottom: "2rem"
          }}>
            <div style={{ color: "#9CA3AF", marginBottom: "0.5rem" }}>Chapter Covered Today</div>
            <div style={{ color: "#FFF", fontSize: "1.1rem" }}>
              {plan.subjects?.map((s: any) => `${s.name}: ${s.chapters.join(", ")}`).join(" | ")}
            </div>
          </div>
          
          {score.percentage < 60 && (
            <div style={{
              padding: "1rem",
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.3)",
              borderRadius: "0.5rem",
              color: "#FCD34D",
              marginBottom: "1.5rem"
            }}>
              💡 Tip: Review the chapter again and practice more questions!
            </div>
          )}
          
          <button
            onClick={handleSubmitAfterReview}
            disabled={submitTest.isPending}
            style={{
              padding: "1rem 3rem",
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              border: "none",
              borderRadius: "0.75rem",
              color: "#FFF",
              fontWeight: 600,
              fontSize: "1.1rem",
              cursor: submitTest.isPending ? "not-allowed" : "pointer",
              opacity: submitTest.isPending ? 0.5 : 1
            }}
          >
            {submitTest.isPending ? "Submitting..." : dayNumber === 15 ? "View Report →" : "Continue to Next Day →"}
          </button>
        </div>
      </div>
    );
  }
  
  if (testQuestions.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#9CA3AF", marginBottom: "1.5rem" }}>
          No test questions available for this day
        </div>
        <button
          onClick={onBack}
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.75rem",
            color: "#FFF",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          ← Back to Plan
        </button>
      </div>
    );
  }
  
  const currentQ = testQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
  
  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };
  
  const handleNext = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handleSubmit = () => {
    submitTest.mutate({
      sprintId,
      dayNumber,
      answers: { answers, questions: testQuestions },
      timeSpent: 0,
    });
  };
  
  const isAnswered = answers[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === testQuestions.length - 1;
  
  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* Similar structure to diagnostic test */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={onBack}
          style={{
            color: "#9CA3AF",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            marginBottom: "1rem"
          }}
        >
          ← Back to Plan
        </button>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#FFF" }}>
            📝 Day {dayNumber} Test
          </h1>
          <div style={{
            padding: "0.5rem 1rem",
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "9999px",
            color: "#A78BFA",
            fontSize: "0.875rem",
            fontWeight: 600
          }}>
            {currentQuestion + 1}/{testQuestions.length}
          </div>
        </div>
        
        <div style={{
          height: "8px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "9999px",
          overflow: "hidden"
        }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)",
              width: `${progress}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>
      
      {/* Question Card - Same as diagnostic */}
      <div style={{
        background: "rgba(31,31,34,0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem",
        padding: "2rem",
        marginBottom: "1.5rem"
      }}>
        <h2 style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#FFF",
          marginBottom: "1.5rem",
          lineHeight: "1.6"
        }}>
          {currentQ.question}
        </h2>
        
        {currentQ.options && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {currentQ.options.map((option: string, idx: number) => {
              const isSelected = answers[currentQuestion] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  style={{
                    padding: "1rem 1.25rem",
                    border: isSelected ? "2px solid #8B5CF6" : "2px solid rgba(255,255,255,0.08)",
                    background: isSelected ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                    borderRadius: "0.75rem",
                    color: isSelected ? "#FFF" : "#D1D5DB",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: isSelected ? 600 : 400,
                    transition: "all 0.2s",
                    minHeight: "44px"
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
        <button
          onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          style={{
            padding: "0.75rem 1.5rem",
            background: currentQuestion === 0 ? "rgba(156,163,175,0.1)" : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.75rem",
            color: currentQuestion === 0 ? "#6B7280" : "#FFF",
            cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
            fontWeight: 600,
            minHeight: "44px"
          }}
        >
          ← Previous
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitTest.isPending}
            style={{
              padding: "0.75rem 2rem",
              background: submitTest.isPending ? "rgba(156,163,175,0.3)" : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              border: "none",
              borderRadius: "0.75rem",
              color: "#FFF",
              cursor: submitTest.isPending ? "not-allowed" : "pointer",
              fontWeight: 600,
              boxShadow: submitTest.isPending ? "none" : "0 4px 12px rgba(16,185,129,0.3)",
              minHeight: "44px"
            }}
          >
            {submitTest.isPending ? "Submitting..." : "Submit Test ✓"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            style={{
              padding: "0.75rem 2rem",
              background: !isAnswered ? "rgba(156,163,175,0.3)" : "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              border: "none",
              borderRadius: "0.75rem",
              color: "#FFF",
              cursor: !isAnswered ? "not-allowed" : "pointer",
              fontWeight: 600,
              boxShadow: !isAnswered ? "none" : "0 4px 12px rgba(139,92,246,0.3)",
              minHeight: "44px"
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
