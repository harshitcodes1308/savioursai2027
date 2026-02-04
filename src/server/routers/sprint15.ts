import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { generate15DaySprintPlan } from "@/lib/sprint-ai";

export const sprint15Router = createTRPCRouter({
  // List user's sprints
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.sprint15Day.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subjects: true,
        status: true,
        currentDay: true,
        dailyPlans: true,
        diagnosticCompleted: true,
        predictedScoreRange: true,
        dailyStudyHours: true,
        examDate: true,
        createdAt: true,
      },
    });
  }),

  // Get diagnostic test
  getDiagnostic: protectedProcedure
    .input(z.object({ sprintId: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("[getDiagnostic] Fetching sprint:", {
        sprintId: input.sprintId,
        userId: ctx.user.id,
      });
      
      const sprint = await ctx.prisma.sprint15Day.findUnique({
        where: { id: input.sprintId, userId: ctx.user.id },
        select: {
          id: true,
          diagnosticTest: true,
          status: true,
        },
      });
      
      console.log("[getDiagnostic] Result:", {
        found: !!sprint,
        hasTest: !!sprint?.diagnosticTest,
      });
      
      return sprint;
    }),

  // Create new 15-day sprint
  create: protectedProcedure
    .input(
      z.object({
        subjects: z.array(z.string()),
        dailyStudyHours: z.number().min(1).max(8),
        examDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch real chapters for selected subjects
      const subjectsWithChapters = await ctx.prisma.subject.findMany({
        where: {
          name: { in: input.subjects },
        },
        include: {
          chapters: {
            select: {
              name: true,
              order: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      // Build chapters map for AI
      const chaptersMap: Record<string, string[]> = {};
      
      // First, add chapters from database
      subjectsWithChapters.forEach(subject => {
        chaptersMap[subject.name] = subject.chapters.map(ch => ch.name);
      });
      
      // CRITICAL: Ensure ALL selected subjects have chapters (fallback if not in DB)
      input.subjects.forEach(subjectName => {
        if (!chaptersMap[subjectName] || chaptersMap[subjectName].length === 0) {
          console.log(`[Sprint] No chapters found for ${subjectName}, using syllabus defaults`);
          
          // Use ICSE syllabus defaults
          if (subjectName === "English Language") {
            chaptersMap[subjectName] = ["Composition", "Letter writing", "Notice & email writing", "Comprehension", "Grammar & usage"];
          } else if (subjectName === "English Literature") {
            chaptersMap[subjectName] = ["Julius Caesar", "With the Photographer", "The Elevator", "Haunted Houses", "The Glove and the Lions"];
          } else if (subjectName === "Mathematics") {
            chaptersMap[subjectName] = ["Quadratic equations", "Linear inequations", "Similarity", "Circles", "Trigonometry"];
          } else if (subjectName === "Physics") {
            chaptersMap[subjectName] = ["Force & Motion", "Work, Energy & Power", "Light", "Sound", "Electricity & Magnetism"];
          } else if (subjectName === "Chemistry") {
            chaptersMap[subjectName] = ["Periodic Properties", "Chemical Bonding", "Acids, Bases & Salts", "Organic Chemistry"];
          } else if (subjectName === "Biology") {
            chaptersMap[subjectName] = ["Basic Biology", "Flowering Plants", "Plant Physiology", "Human Anatomy", "Health & Hygiene"];
          } else {
            // Generic fallback for any other subject
            chaptersMap[subjectName] = [`${subjectName} - Chapter 1`, `${subjectName} - Chapter 2`, `${subjectName} - Chapter 3`];
          }
        }
      });
      
      console.log(`[Sprint] Final chapters map:`, Object.keys(chaptersMap).map(s => `${s}: ${chaptersMap[s].length} chapters`));

      // Generate AI plan with REAL chapters
      const plan = await generate15DaySprintPlan({
        subjects: input.subjects,
        daily_study_hours: input.dailyStudyHours,
        exam_date: input.examDate,
        chapters: chaptersMap, // Pass real chapters!
      });

      // DEBUG: Log what AI returned
      console.log("[Sprint Creation] AI Plan Generated:");
      console.log("- Subjects:", input.subjects);
      console.log("- Chapters Map:", JSON.stringify(chaptersMap, null, 2));
      console.log("- Diagnostic Test Keys:", Object.keys(plan.diagnostic_test || {}));
      console.log("- Sample Question Count:", 
        Object.values(plan.diagnostic_test || {}).reduce((total: number, subj: any) => 
          total + (subj?.questions?.length || 0), 0
        )
      );
      
      // Check if diagnostic test has questions
      const hasQuestions = Object.values(plan.diagnostic_test || {}).some((subj: any) => 
        subj?.questions && subj.questions.length > 0
      );
      
      if (!hasQuestions) {
        console.error("[Sprint Creation] WARNING: No questions in diagnostic test!");
        console.error("Full diagnostic test:", JSON.stringify(plan.diagnostic_test, null, 2));
      }

      // Save to database with adaptive mode ENABLED for new sprints
      const sprint = await ctx.prisma.sprint15Day.create({
        data: {
          userId: ctx.user.id,
          subjects: input.subjects,
          dailyStudyHours: input.dailyStudyHours,
          examDate: new Date(input.examDate),
          
          // Store AI-generated plan (legacy)
          diagnosticTest: plan.diagnostic_test as any,
          chapterAnalysis: plan.chapter_strength_analysis as any,
          predictedScoreRange: plan.predicted_score_range,
          dailyPlans: plan.fifteen_day_plan as any,
          
          currentDay: 0, // Day 0 = diagnostic pending
          status: "DIAGNOSTIC_PENDING",
          
          // NEW: Enable adaptive architecture for this sprint
          useAdaptivePlan: true,
        },
      });

      console.log(`[Sprint Creation] Created sprint ${sprint.id} with ADAPTIVE mode enabled`);

      return { sprintId: sprint.id, plan };
    }),

  // Submit diagnostic test results
  submitDiagnostic: protectedProcedure
    .input(
      z.object({
        sprintId: z.string(),
        results: z.any(), // Frontend sends 'results', not 'answers'
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sprint = await ctx.prisma.sprint15Day.findUnique({
        where: { id: input.sprintId, userId: ctx.user.id },
      });

      if (!sprint) {
        throw new Error("Sprint not found");
      }

      // Update sprint status
      await ctx.prisma.sprint15Day.update({
        where: { id: input.sprintId },
        data: {
          diagnosticCompleted: true,
          status: "ACTIVE",
          currentDay: 1,
        },
      });

      // If adaptive mode, initialize chapter performance
      if (sprint.useAdaptivePlan) {
        console.log(`[submitDiagnostic] Initializing chapter performance for ADAPTIVE sprint`);
        
        const { DayPlanGenerator } = await import("@/lib/sprint");
        const planGen = new DayPlanGenerator(ctx.prisma);
        
        // Extract chapter analysis from diagnostic
        const chapterAnalysis = sprint.chapterAnalysis as any;
        
        if (chapterAnalysis) {
          await planGen.initializeFromDiagnostic(input.sprintId, chapterAnalysis);
          console.log(`[submitDiagnostic] Chapter performance initialized successfully`);
        } else {
          console.warn(`[submitDiagnostic] No chapter analysis found, skipping initialization`);
        }
      }

      return { success: true };
    }),

  // Get current day plan
  getDayPlan: protectedProcedure
    .input(z.object({ sprintId: z.string(), dayNumber: z.number() }))
    .query(async ({ ctx, input }) => {
      const sprint = await ctx.prisma.sprint15Day.findUnique({
        where: { id: input.sprintId, userId: ctx.user.id },
      });

      if (!sprint) {
        throw new Error("Sprint not found");
      }

      // Feature flag: use adaptive architecture if enabled
      if (sprint.useAdaptivePlan) {
        console.log(`[getDayPlan] Using ADAPTIVE architecture for Day ${input.dayNumber}`);
        
        const { DayPlanGenerator, QuestionGenerator } = await import("@/lib/sprint");
        
        const planGen = new DayPlanGenerator(ctx.prisma);
        const questionGen = new QuestionGenerator();
        
        // Compute plan from performance data
        const plan = await planGen.computeDayPlan(input.sprintId, input.dayNumber);
        
        // Generate questions for each subject's assigned chapter
        const subjectsWithQuestions = await Promise.all(
          plan.subjects.map(async (subject) => {
            const questions = await questionGen.generateForChapter(
              subject.name,
              subject.chapters[0],
              5 // 5 questions per subject
            );
            
            return {
              ...subject,
              test: {
                duration_minutes: 30,
                total_marks: questions.length * 3,
                questions
              }
            };
          })
        );
        
        return {
          day: plan.day,
          subjects: subjectsWithQuestions
        };
      } else {
        // LEGACY: Return from JSON blob
        console.log(`[getDayPlan] Using LEGACY JSON-based plan for Day ${input.dayNumber}`);
        const plans = sprint.dailyPlans as any[];
        
        const plan = plans[input.dayNumber - 1];

        if (!plan) {
          throw new Error(`Day ${input.dayNumber} plan not found`);
        }

        // LOG: Show what chapters are in this day's plan
        console.log(`[getDayPlan] Day ${input.dayNumber} chapters:`, 
          plan.subjects?.map((s: any) => `${s.name}: [${s.chapters?.join(", ") || "NO CHAPTERS"}]`).join(" | ")
        );
        
        return {
          day: input.dayNumber,
          plan: plan,
          parentReport: sprint.parentReport,
        };
      }
    }),

  // Submit daily test
  submitDailyTest: protectedProcedure
    .input(
      z.object({
        sprintId: z.string(),
        dayNumber: z.number(),
        answers: z.any(),
        timeSpent: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Calculate score
      // Update parent report
      // Advance to next day if passed
      
      await ctx.prisma.sprint15Day.update({
        where: { id: input.sprintId },
        data: {
          currentDay: input.dayNumber + 1,
          // Update parent report stats
        },
      });

      return { success: true, nextDay: input.dayNumber + 1 };
    }),

  // Get completion report
  getReport: protectedProcedure
    .input(z.object({ sprintId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sprint = await ctx.prisma.sprint15Day.findUnique({
        where: { id: input.sprintId },
      });

      if (!sprint) throw new Error("Sprint not found");

      // Calculate diagnostic score
      const diagnosticTest = sprint.diagnosticTest as any;
      let diagnosticCorrect = 0;
      let diagnosticTotal = 0;
      
      if (diagnosticTest) {
        Object.values(diagnosticTest).forEach((subj: any) => {
          if (subj.questions) {
            diagnosticTotal += subj.questions.length;
          }
        });
      }
      
      // Calculate average daily score from submitted tests
      const dailyPlans = (sprint.dailyPlans as any[]) || [];
      let totalDailyScore = 0;
      let dailyTestCount = 0;
      
      // Mock calculation - in real implementation, track submitted test scores
      const diagnosticScore = Math.floor(Math.random() * 20) + 60; // 60-80%
      const averageDailyScore = diagnosticScore + Math.floor(Math.random() * 15) + 5; // +5-20%
      
      const improvement = averageDailyScore - diagnosticScore;
      
      // Subject performance
      const subjectPerformance = sprint.subjects.map((subject: string) => ({
        subject,
        chaptersCompleted: 15, // All covered
        totalChapters: 15,
        averageScore: averageDailyScore + Math.floor(Math.random() * 10) - 5,
        strongTopics: ["Topic 1", "Topic 2"],
        weakTopics: improvement < 10 ? ["Topic 3"] : []
      }));

      return {
        subjects: sprint.subjects,
        diagnosticScore,
        averageDailyScore,
        improvement,
        predictedBoardScore: sprint.predictedScoreRange,
        currentPerformance: `${averageDailyScore}%`,
        message: improvement >= 15 
          ? "Excellent progress! Your child has shown significant improvement and is well-prepared for the boards."
          : improvement >= 10
          ? "Good progress! Your child is showing steady improvement."
          : "Your child completed the sprint. Continue practicing for better results.",
        subjectPerformance
      };
    }),
});
