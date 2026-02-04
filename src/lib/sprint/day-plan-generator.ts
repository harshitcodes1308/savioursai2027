import { PrismaClient } from "@prisma/client";

/**
 * DayPlanGenerator: Computes which chapters to study each day based on performance
 * This is DERIVED STATE - computed from chapter performance data, not stored
 */
export class DayPlanGenerator {
  constructor(private prisma: PrismaClient) {}

  /**
   * Compute the study plan for a specific day based on chapter performance
   */
  async computeDayPlan(sprintId: string, dayNumber: number) {
    // Get sprint configuration
    const sprint = await this.prisma.sprint15Day.findUnique({
      where: { id: sprintId },
      include: {
        chapterPerformance: {
          orderBy: { priority: 'asc' }
        }
      }
    });

    if (!sprint) {
      throw new Error(`Sprint ${sprintId} not found`);
    }

    console.log(`[DayPlanGen] Computing plan for Day ${dayNumber}`, {
      sprintId: sprintId.slice(0, 8),
      totalChapters: sprint.chapterPerformance.length
    });

    // CRITICAL: If no chapter performance exists, initialize from diagnostic
    if (sprint.chapterPerformance.length === 0) {
      console.warn(`[DayPlanGen] No chapter performance found! Initializing from diagnostic...`);
      
      const chapterAnalysis = sprint.chapterAnalysis as any;
      if (chapterAnalysis) {
        await this.initializeFromDiagnostic(sprintId, chapterAnalysis);
        console.log(`[DayPlanGen] Initialized chapter performance on-demand`);
        
        // Re-fetch sprint with performance data
        const updatedSprint = await this.prisma.sprint15Day.findUnique({
          where: { id: sprintId },
          include: {
            chapterPerformance: {
              orderBy: { priority: 'asc' }
            }
          }
        });
        
        if (!updatedSprint) throw new Error('Sprint not found after initialization');
        return this.buildDayPlan(updatedSprint, dayNumber);
      } else {
        throw new Error('No chapter performance and no diagnostic analysis available');
      }
    }

    return this.buildDayPlan(sprint, dayNumber);
  }

  /**
   * Build the actual day plan from sprint data
   */
  private buildDayPlan(sprint: any, dayNumber: number) {
    // Group chapters by subject
    const bySubject = this.groupBySubject(sprint.chapterPerformance);

    // Calculate time allocation per subject
    const timePerSubject = Math.floor(
      (sprint.dailyStudyHours * 60) / sprint.subjects.length
    );

    // Assign chapters for this day
    const subjects = sprint.subjects.map((subject: string) => {
      const chapters = bySubject[subject] || [];
      
      if (chapters.length === 0) {
        console.warn(`[DayPlanGen] No chapters for ${subject}, will initialize`);
        return {
          name: subject,
          chapters: [`${subject} - Introduction`],
          time_minutes: timePerSubject,
          needsInitialization: true
        };
      }

      const selectedChapter = this.selectChapterForDay(chapters, dayNumber);
      
      console.log(`[DayPlanGen] ${subject} Day ${dayNumber}:`, {
        chapter: selectedChapter.chapter,
        strength: selectedChapter.strength.toFixed(1),
        priority: selectedChapter.priority,
        attempts: selectedChapter.attemptsCount
      });

      return {
        name: subject,
        chapters: [selectedChapter.chapter],
        time_minutes: timePerSubject,
        performance: {
          strength: selectedChapter.strength,
          needsReview: selectedChapter.needsReview
        }
      };
    });

    return {
      day: dayNumber,
      subjects,
      studyHours: sprint.dailyStudyHours
    };
  }

  /**
   * Select the optimal chapter for today based on:
   * 1. Weak chapters (low strength) get priority
   * 2. Avoid chapters tested in last 2 days
   * 3. Cycle through chapters fairly
   */
  private selectChapterForDay(chapters: any[], dayNumber: number) {
    const recentDays = 2;
    const now = new Date();
    const recentCutoff = new Date(now.getTime() - recentDays * 24 * 60 * 60 * 1000);

    // Filter out recently tested chapters
    const candidates = chapters.filter(ch => 
      !ch.lastTested || new Date(ch.lastTested) < recentCutoff
    );

    // If all recently tested, use the oldest one
    if (candidates.length === 0) {
      const oldest = chapters.sort((a, b) => {
        const aTime = a.lastTested ? new Date(a.lastTested).getTime() : 0;
        const bTime = b.lastTested ? new Date(b.lastTested).getTime() : 0;
        return aTime - bTime;
      })[0];
      
      console.log(`[DayPlanGen] All chapters recently tested, using oldest:`, oldest.chapter);
      return oldest;
    }

    // Prioritize weak chapters (low strength, high priority value means weak)
    const sortedCandidates = candidates.sort((a, b) => {
      // Primary sort: priority (1 = weak, needs review)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      // Secondary sort: strength (lower = weaker)
      return a.strength - b.strength;
    });

    return sortedCandidates[0];
  }

  /**
   * Group chapter performance records by subject
   */
  private groupBySubject(chapters: any[]) {
    return chapters.reduce((acc, ch) => {
      if (!acc[ch.subject]) {
        acc[ch.subject] = [];
      }
      acc[ch.subject].push(ch);
      return acc;
    }, {} as Record<string, any[]>);
  }

  /**
   * Initialize chapter performance for a new sprint from diagnostic results
   */
  async initializeFromDiagnostic(
    sprintId: string,
    chapterAnalysis: Record<string, { weak: string[], medium: string[], strong: string[] }>
  ) {
    const records = [];

    for (const [subject, analysis] of Object.entries(chapterAnalysis)) {
      // Weak chapters: high priority
      for (const chapter of analysis.weak || []) {
        records.push({
          sprintId,
          subject,
          chapter,
          strength: 30, // Low strength
          priority: 1,  // Highest priority
          needsReview: true,
          attemptsCount: 0
        });
      }

      // Medium chapters: medium priority
      for (const chapter of analysis.medium || []) {
        records.push({
          sprintId,
          subject,
          chapter,
          strength: 60,
          priority: 50,
          needsReview: false,
          attemptsCount: 0
        });
      }

      // Strong chapters: low priority
      for (const chapter of analysis.strong || []) {
        records.push({
          sprintId,
          subject,
          chapter,
          strength: 85,
          priority: 100,
          needsReview: false,
          attemptsCount: 0
        });
      }
    }

    console.log(`[DayPlanGen] Initializing ${records.length} chapter performance records`);

    // Batch create
    await this.prisma.chapterPerformance.createMany({
      data: records,
      skipDuplicates: true
    });

    return records.length;
  }
}
