"use client";

import { use, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function DiagnosticTestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const sprintId = id;
  
  // Fetch sprint data
  const { data: sprint, isLoading, error } = trpc.sprint15.getDiagnostic.useQuery({ sprintId });
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  
  const submitDiagnostic = trpc.sprint15.submitDiagnostic.useMutation({
    onSuccess: () => {
      router.push(`/dashboard/sprint`);
    },
  });
  
  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#9CA3AF" }}>Loading diagnostic test...</div>
        <div style={{ color: "#6B7280", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Sprint ID: {sprintId}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#EF4444", fontSize: "1.25rem", marginBottom: "1rem" }}>Error loading diagnostic</div>
        <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error.message}
        </div>
        <button
          onClick={() => router.push("/dashboard/sprint")}
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
          ← Back to Sprint
        </button>
      </div>
    );
  }
  
  if (!sprint) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#EF4444", fontSize: "1.25rem", marginBottom: "1rem" }}>Sprint not found</div>
        <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1rem" }}>
          Sprint ID: {sprintId}
        </div>
        <button
          onClick={() => router.push("/dashboard/sprint")}
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
          ← Back to Sprint
        </button>
      </div>
    );
  }
  
  if (!sprint.diagnosticTest) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ color: "#F59E0B", fontSize: "1.25rem", marginBottom: "1rem" }}>
          Diagnostic test not generated yet
        </div>
        <div style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1rem" }}>
          The AI might still be generating your test. Please wait a moment and refresh.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            border: "none",
            borderRadius: "0.75rem",
            color: "#FFF",
            cursor: "pointer",
            fontWeight: 600,
            marginRight: "0.5rem"
          }}
        >
          Refresh
        </button>
        <button
          onClick={() => router.push("/dashboard/sprint")}
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
          Back
        </button>
      </div>
    );
  }
  
  const diagnosticTest = sprint.diagnosticTest as any;
  const allQuestions: any[] = [];
  
  // Flatten all questions from all subjects
  if (diagnosticTest && typeof diagnosticTest === 'object') {
    Object.keys(diagnosticTest).forEach(subject => {
      const subjectTest = diagnosticTest[subject];
      if (subjectTest?.questions && Array.isArray(subjectTest.questions)) {
        subjectTest.questions.forEach((q: any) => {
          allQuestions.push({ ...q, subject });
        });
      }
    });
  }
  
  // Check if diagnostic test has questions
  if (allQuestions.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ color: "#F59E0B", fontSize: "1.5rem", marginBottom: "1rem" }}>
          ⚠️ No Questions Available
        </div>
        <div style={{ color: "#D1D5DB", marginBottom: "2rem", lineHeight: "1.6" }}>
          This sprint was created before the diagnostic test was properly configured. 
          Please delete this sprint and create a new one to get the full diagnostic experience with all questions.
        </div>
        <button
          onClick={() => router.push("/dashboard/sprint")}
          style={{
            padding: "0.75rem 2rem",
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            border: "none",
            borderRadius: "0.75rem",
            color: "#FFF",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
            minHeight: "44px"
          }}
        >
          ← Back to Sprint Dashboard
        </button>
      </div>
    );
  }
  
  const currentQ = allQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;
  
  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };
  
  const handleNext = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = () => {
    submitDiagnostic.mutate({
      sprintId,
      results: { answers, timeSpent, questions: allQuestions },
    });
  };
  
  const isAnswered = answers[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === allQuestions.length - 1;
  
  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#FFF" }}>
            ⚡ Diagnostic Test
          </h1>
          <div style={{
            padding: "0.5rem 1rem",
            background: "rgba(249,115,22,0.15)",
            border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: "9999px",
            color: "#FB923C",
            fontSize: "0.875rem",
            fontWeight: 600
          }}>
            {currentQuestion + 1}/{allQuestions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          height: "8px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "9999px",
          overflow: "hidden"
        }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #F97316 0%, #EA580C 100%)",
              width: `${progress}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>
      
      {/* Question Card */}
      <div style={{
        background: "rgba(31,31,34,0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem",
        padding: "2rem",
        marginBottom: "1.5rem"
      }}>
        {/* Subject Badge */}
        <div style={{
          display: "inline-block",
          padding: "0.25rem 0.75rem",
          background: "rgba(139,92,246,0.15)",
          border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: "9999px",
          color: "#A78BFA",
          fontSize: "0.75rem",
          fontWeight: 600,
          marginBottom: "1.5rem"
        }}>
          {currentQ.subject}
        </div>
        
        {/* Question */}
        <h2 style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#FFF",
          marginBottom: "1.5rem",
          lineHeight: "1.6"
        }}>
          {currentQ.question}
        </h2>
        
        {/* Options */}
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
                    border: isSelected 
                      ? "2px solid #8B5CF6" 
                      : "2px solid rgba(255,255,255,0.08)",
                    background: isSelected
                      ? "rgba(139,92,246,0.15)"
                      : "rgba(255,255,255,0.03)",
                    borderRadius: "0.75rem",
                    color: isSelected ? "#FFF" : "#D1D5DB",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: isSelected ? 600 : 400,
                    transition: "all 0.2s",
                    minHeight: "44px"
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={{
            padding: "0.75rem 1.5rem",
            background: currentQuestion === 0 
              ? "rgba(156,163,175,0.1)" 
              : "rgba(255,255,255,0.05)",
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
            disabled={submitDiagnostic.isPending}
            style={{
              padding: "0.75rem 2rem",
              background: submitDiagnostic.isPending
                ? "rgba(156,163,175,0.3)"
                : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              border: "none",
              borderRadius: "0.75rem",
              color: "#FFF",
              cursor: submitDiagnostic.isPending ? "not-allowed" : "pointer",
              fontWeight: 600,
              boxShadow: submitDiagnostic.isPending ? "none" : "0 4px 12px rgba(16,185,129,0.3)",
              minHeight: "44px"
            }}
          >
            {submitDiagnostic.isPending ? "Submitting..." : "Submit Test ✓"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            style={{
              padding: "0.75rem 2rem",
              background: !isAnswered
                ? "rgba(156,163,175,0.3)"
                : "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
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
      
      {/* Question Navigator */}
      <div style={{ marginTop: "2rem" }}>
        <div style={{ 
          color: "#9CA3AF", 
          fontSize: "0.875rem", 
          marginBottom: "0.75rem",
          fontWeight: 600
        }}>
          Question Navigator
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
          gap: "0.5rem"
        }}>
          {allQuestions.map((_, idx) => {
            const isAnsweredQ = answers[idx] !== undefined;
            const isCurrent = idx === currentQuestion;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                style={{
                  padding: "0.5rem",
                  border: isCurrent 
                    ? "2px solid #8B5CF6" 
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isAnsweredQ
                    ? "rgba(16,185,129,0.15)"
                    : isCurrent
                    ? "rgba(139,92,246,0.15)"
                    : "rgba(255,255,255,0.03)",
                  borderRadius: "0.5rem",
                  color: isAnsweredQ ? "#10B981" : isCurrent ? "#A78BFA" : "#9CA3AF",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  minHeight: "40px"
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
