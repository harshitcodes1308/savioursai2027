// Precision Practice Mode — Configuration & Types

// =============================================
// QUESTION DATA TYPE
// =============================================
export interface PrecisionQuestion {
  id: string;
  subject: string;
  chapter: string;
  year: number;        // e.g. 2024, 2023
  marks: 1 | 2 | 3 | 4;
  question: string;
  options: string[];
  correctAnswer: number; // index into options[]
}

// =============================================
// PER-QUESTION RESULT (tracked during test)
// =============================================
export interface QuestionResult {
  questionId: string;
  chapter: string;
  year: number;
  marks: number;
  allottedTime: number;   // seconds
  actualTimeTaken: number; // seconds
  timeDeviation: number;  // actual - allotted (positive = overtime)
  isCorrect: boolean;
  marksEarned: number;
  selectedAnswer: number | null;
}

// =============================================
// FULL TEST SESSION RESULT
// =============================================
export interface PrecisionTestResult {
  subject: string;
  chapter: string;
  totalQuestions: number;
  totalMarks: number;
  totalAllottedTime: number;   // seconds
  totalTimeTaken: number;      // seconds
  totalOvertime: number;       // seconds (TTT - TAT)
  marksScored: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;            // percentage
  rawScore: number;            // percentage
  timeEfficiencyScore: number; // 0–100
  predictedScore: number;      // (RS × 0.75) + (TES × 0.25)
  classification: PerformanceClass;
  questionResults: QuestionResult[];
  insights: string[];
  markBreakdown: MarkBreakdown[];
  timeBehavior: TimeBehavior;
  completedAt: string;         // ISO timestamp
}

// =============================================
// ANALYTICS TYPES
// =============================================
export interface MarkBreakdown {
  marks: number;
  total: number;
  correct: number;
  accuracy: number; // percentage
}

export interface TimeBehavior {
  avgTimePerMarkType: Record<number, number>; // marks → avg seconds
  longestQuestionTime: number;
  longestQuestionId: string;
  mostOvertimedMarkCategory: number;
  underTimeEfficiency: number; // how much under-time (seconds saved)
}

export type PerformanceClass = 'Elite Performer' | 'Strong Performer' | 'Developing' | 'Needs Structured Practice';

// =============================================
// TIME ALLOCATION RULES
// =============================================
export const TIME_PER_MARK: Record<number, number> = {
  1: 60,   // 1 mark → 1 minute
  2: 150,  // 2 marks → 2.5 minutes
  3: 240,  // 3 marks → 4 minutes
  4: 330,  // 4 marks → 5.5 minutes
};

// Auto-submit grace period after allotted time expires
export const OVERTIME_GRACE_SECONDS = 30;

// =============================================
// SUBJECT DEFINITIONS (PCMB)
// =============================================
export interface PrecisionSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: PrecisionChapter[];
}

export interface PrecisionChapter {
  id: string;
  name: string;
}

// =============================================
// PERFORMANCE CLASSIFICATION
// =============================================
export function classifyPerformance(predictedScore: number): PerformanceClass {
  if (predictedScore >= 90) return 'Elite Performer';
  if (predictedScore >= 75) return 'Strong Performer';
  if (predictedScore >= 60) return 'Developing';
  return 'Needs Structured Practice';
}

// =============================================
// ANALYTICS CALCULATOR
// =============================================
export function calculateAnalytics(
  questionResults: QuestionResult[],
  subject: string,
  chapter: string,
): PrecisionTestResult {
  const totalQuestions = questionResults.length;
  const totalMarks = questionResults.reduce((sum, q) => sum + q.marks, 0);
  const totalAllottedTime = questionResults.reduce((sum, q) => sum + q.allottedTime, 0);
  const totalTimeTaken = questionResults.reduce((sum, q) => sum + q.actualTimeTaken, 0);
  const totalOvertime = totalTimeTaken - totalAllottedTime;
  const marksScored = questionResults.reduce((sum, q) => sum + q.marksEarned, 0);
  const correctCount = questionResults.filter(q => q.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;

  const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const rawScore = totalMarks > 0 ? (marksScored / totalMarks) * 100 : 0;

  // Time Efficiency Score
  let timeEfficiencyScore = 100;
  if (totalOvertime > 0 && totalAllottedTime > 0) {
    timeEfficiencyScore = 100 - ((totalOvertime / totalAllottedTime) * 100);
    timeEfficiencyScore = Math.max(0, timeEfficiencyScore);
  }

  // Predicted Score = (RS × 0.75) + (TES × 0.25)
  const predictedScore = Math.round((rawScore * 0.75) + (timeEfficiencyScore * 0.25));
  const classification = classifyPerformance(predictedScore);

  // Mark-type breakdown
  const markGroups: Record<number, { total: number; correct: number }> = {};
  for (const q of questionResults) {
    if (!markGroups[q.marks]) markGroups[q.marks] = { total: 0, correct: 0 };
    markGroups[q.marks].total++;
    if (q.isCorrect) markGroups[q.marks].correct++;
  }
  const markBreakdown: MarkBreakdown[] = Object.entries(markGroups)
    .map(([marks, data]) => ({
      marks: Number(marks),
      total: data.total,
      correct: data.correct,
      accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
    }))
    .sort((a, b) => a.marks - b.marks);

  // Time behavior
  const timeByMark: Record<number, number[]> = {};
  let longestTime = 0;
  let longestId = '';
  for (const q of questionResults) {
    if (!timeByMark[q.marks]) timeByMark[q.marks] = [];
    timeByMark[q.marks].push(q.actualTimeTaken);
    if (q.actualTimeTaken > longestTime) {
      longestTime = q.actualTimeTaken;
      longestId = q.questionId;
    }
  }
  const avgTimePerMarkType: Record<number, number> = {};
  let mostOvertimedMark = 1;
  let maxAvgOvertime = -Infinity;
  for (const [marks, times] of Object.entries(timeByMark)) {
    const avg = times.reduce((s, t) => s + t, 0) / times.length;
    const markNum = Number(marks);
    avgTimePerMarkType[markNum] = Math.round(avg);
    const allotted = TIME_PER_MARK[markNum] || 60;
    const avgOvertime = avg - allotted;
    if (avgOvertime > maxAvgOvertime) {
      maxAvgOvertime = avgOvertime;
      mostOvertimedMark = markNum;
    }
  }

  const underTimeEfficiency = totalOvertime < 0 ? Math.abs(totalOvertime) : 0;

  const timeBehavior: TimeBehavior = {
    avgTimePerMarkType,
    longestQuestionTime: longestTime,
    longestQuestionId: longestId,
    mostOvertimedMarkCategory: mostOvertimedMark,
    underTimeEfficiency,
  };

  // AI Insights (rule-based)
  const insights = generateInsights(questionResults, markBreakdown, timeBehavior, accuracy);

  return {
    subject,
    chapter,
    totalQuestions,
    totalMarks,
    totalAllottedTime,
    totalTimeTaken,
    totalOvertime,
    marksScored,
    correctCount,
    incorrectCount,
    accuracy: Math.round(accuracy * 10) / 10,
    rawScore: Math.round(rawScore * 10) / 10,
    timeEfficiencyScore: Math.round(timeEfficiencyScore * 10) / 10,
    predictedScore,
    classification,
    questionResults,
    insights,
    markBreakdown,
    timeBehavior,
    completedAt: new Date().toISOString(),
  };
}

// =============================================
// INSIGHT GENERATOR (rule-based, no API cost)
// =============================================
function generateInsights(
  results: QuestionResult[],
  markBreakdown: MarkBreakdown[],
  timeBehavior: TimeBehavior,
  accuracy: number,
): string[] {
  const insights: string[] = [];

  // Check for overthinking on specific mark types
  for (const mb of markBreakdown) {
    const allotted = TIME_PER_MARK[mb.marks] || 60;
    const avg = timeBehavior.avgTimePerMarkType[mb.marks] || 0;
    if (avg > allotted * 1.3 && mb.total >= 2) {
      insights.push(`You tend to overthink ${mb.marks}-mark questions — averaging ${Math.round(avg)}s vs ${allotted}s allotted.`);
    }
  }

  // Check for accuracy drop in later questions
  const half = Math.floor(results.length / 2);
  if (results.length >= 6) {
    const firstHalfCorrect = results.slice(0, half).filter(q => q.isCorrect).length / half;
    const secondHalfCorrect = results.slice(half).filter(q => q.isCorrect).length / (results.length - half);
    if (firstHalfCorrect - secondHalfCorrect > 0.2) {
      insights.push(`Your accuracy drops significantly after question ${half} — consider pacing yourself better.`);
    }
  }

  // Check weak mark category
  const weakest = markBreakdown.filter(m => m.total >= 2).sort((a, b) => a.accuracy - b.accuracy)[0];
  if (weakest && weakest.accuracy < 50) {
    insights.push(`${weakest.marks}-mark questions are your weakest area (${Math.round(weakest.accuracy)}% accuracy) — focus on these.`);
  }

  // Time management on higher-weightage questions
  const highMarks = markBreakdown.filter(m => m.marks >= 3);
  if (highMarks.length > 0) {
    const highAccuracy = highMarks.reduce((s, m) => s + m.correct, 0) / highMarks.reduce((s, m) => s + m.total, 0);
    if (highAccuracy < 0.5) {
      insights.push('Time management appears weak on higher-weightage questions (3+ marks).');
    }
  }

  // Speed insight
  const totalOvertime = results.reduce((s, q) => s + Math.max(0, q.timeDeviation), 0);
  if (totalOvertime === 0 && accuracy > 70) {
    insights.push('Excellent time management — you completed within allotted time with solid accuracy!');
  }

  // Ensure at least 3 insights
  if (insights.length === 0) {
    insights.push('Consistent performance across all question types. Keep it up!');
  }
  if (insights.length < 2) {
    insights.push(`Overall accuracy: ${Math.round(accuracy)}% — ${accuracy >= 75 ? 'strong foundation' : 'room for improvement'}.`);
  }
  if (insights.length < 3) {
    insights.push(`You averaged ${Math.round(results.reduce((s, q) => s + q.actualTimeTaken, 0) / results.length)}s per question.`);
  }

  return insights.slice(0, 3);
}
