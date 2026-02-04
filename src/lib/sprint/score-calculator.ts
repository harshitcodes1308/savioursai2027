import { PrismaClient } from "@prisma/client";

interface Answer {
  questionId?: string;
  chapter: string;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

interface SubjectResult {
  subject: string;
  answers: Answer[];
}

/**
 * ScoreCalculator: Persists test results and updates chapter performance
 * This creates the feedback loop that makes the system adaptive
 */
export class ScoreCalculator {
  constructor(private prisma: PrismaClient) {}

  /**
   * Record daily test results and update chapter performance
   */
  async recordDailyTest(
    sprintId: string,
    dayNumber: number,
    results: SubjectResult[]
  ) {
    console.log(`[ScoreCalc] Recording Day ${dayNumber} results for sprint ${sprintId.slice(0, 8)}`);

    for (const { subject, answers } of results) {
      // Calculate aggregate scores
      const totalQuestions = answers.length;
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const score = totalQuestions > 0 
        ? (correctAnswers / totalQuestions) * 100 
        : 0;
      const timeSpent = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);

      console.log(`[ScoreCalc] ${subject}: ${correctAnswers}/${totalQuestions} = ${score.toFixed(1)}%`);

      // Store test result
      await this.prisma.dailyTestResult.upsert({
        where: {
          sprintId_dayNumber_subject: {
            sprintId,
            dayNumber,
            subject
          }
        },
        create: {
          sprintId,
          dayNumber,
          subject,
          totalQuestions,
          correctAnswers,
          score,
          timeSpent,
          questionResults: answers
        },
        update: {
          correctAnswers,
          score,
          timeSpent,
          questionResults: answers
        }
      });

      // Update chapter performance
      await this.updateChapterPerformance(sprintId, subject, answers);
    }

    console.log(`[ScoreCalc] Day ${dayNumber} results persisted successfully`);
  }

  /**
   * Update chapter-level performance metrics based on test answers
   */
  private async updateChapterPerformance(
    sprintId: string,
    subject: string,
    answers: Answer[]
  ) {
    // Group answers by chapter
    const byChapter = answers.reduce((acc, ans) => {
      const chapter = ans.chapter || "Unknown";
      if (!acc[chapter]) {
        acc[chapter] = [];
      }
      acc[chapter].push(ans);
      return acc;
    }, {} as Record<string, Answer[]>);

    for (const [chapter, chapterAnswers] of Object.entries(byChapter)) {
      const correct = chapterAnswers.filter(a => a.isCorrect).length;
      const total = chapterAnswers.length;
      const currentStrength = (correct / total) * 100;

      console.log(`[ScoreCalc] Updating ${chapter}: ${correct}/${total} = ${currentStrength.toFixed(1)}%`);

      // Get existing performance record
      const existing = await this.prisma.chapterPerformance.findUnique({
        where: {
          sprintId_subject_chapter: { sprintId, subject, chapter }
        }
      });

      if (existing) {
        // Calculate moving average of strength
        // Weight recent performance more (70% current, 30% historical)
        const newStrength = (currentStrength * 0.7) + (existing.strength * 0.3);
        
        // Adjust priority based on performance
        // Weak chapters (< 60%) get priority 1-10
        // Medium chapters (60-80%) get priority 11-50
        // Strong chapters (> 80%) get priority 51-100
        let newPriority: number;
        if (newStrength < 60) {
          newPriority = Math.max(1, Math.floor((60 - newStrength) / 6));
        } else if (newStrength < 80) {
          newPriority = Math.floor(11 + ((newStrength - 60) / 20) * 39);
        } else {
          newPriority = Math.floor(51 + ((newStrength - 80) / 20) * 49);
        }

        await this.prisma.chapterPerformance.update({
          where: { id: existing.id },
          data: {
            strength: newStrength,
            attemptsCount: { increment: 1 },
            lastTested: new Date(),
            priority: newPriority,
            needsReview: newStrength < 60
          }
        });

        console.log(`[ScoreCalc] ${chapter} updated: strength ${newStrength.toFixed(1)}%, priority ${newPriority}`);
      } else {
        // Create new performance record
        const priority = currentStrength < 60 ? 1 : 
                        currentStrength < 80 ? 50 : 100;

        await this.prisma.chapterPerformance.create({
          data: {
            sprintId,
            subject,
            chapter,
            strength: currentStrength,
            attemptsCount: 1,
            lastTested: new Date(),
            priority,
            needsReview: currentStrength < 60
          }
        });

        console.log(`[ScoreCalc] ${chapter} created: strength ${currentStrength.toFixed(1)}%, priority ${priority}`);
      }
    }
  }

  /**
   * Get performance summary for a sprint
   */
  async getPerformanceSummary(sprintId: string) {
    const results = await this.prisma.dailyTestResult.findMany({
      where: { sprintId },
      orderBy: { dayNumber: 'asc' }
    });

    const chapterPerf = await this.prisma.chapterPerformance.findMany({
      where: { sprintId },
      orderBy: { priority: 'asc' }
    });

    // Calculate overall progress
    const totalTests = results.length;
    const avgScore = totalTests > 0
      ? results.reduce((sum, r) => sum + r.score, 0) / totalTests
      : 0;

    // Identify weak chapters
    const weakChapters = chapterPerf.filter(ch => ch.needsReview);

    return {
      totalTests,
      averageScore: avgScore,
      weakChapters: weakChapters.map(ch => ({
        subject: ch.subject,
        chapter: ch.chapter,
        strength: ch.strength,
        attempts: ch.attemptsCount
      })),
      chartData: results.map(r => ({
        day: r.dayNumber,
        subject: r.subject,
        score: r.score
      }))
    };
  }
}
