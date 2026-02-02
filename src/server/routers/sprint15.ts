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
      // Generate AI plan
      const plan = await generate15DaySprintPlan({
        subjects: input.subjects,
        daily_study_hours: input.dailyStudyHours,
        exam_date: input.examDate,
      });

      // Save to database
      const sprint = await ctx.prisma.sprint15Day.create({
        data: {
          userId: ctx.user.id,
          subjects: input.subjects,
          dailyStudyHours: input.dailyStudyHours,
          examDate: new Date(input.examDate),
          
          // Store AI-generated plan
          diagnosticTest: plan.diagnostic_test as any,
          chapterAnalysis: plan.chapter_strength_analysis as any,
          predictedScoreRange: plan.predicted_score_range,
          dailyPlans: plan.fifteen_day_plan as any,
          
          currentDay: 0, // Day 0 = diagnostic pending
          status: "DIAGNOSTIC_PENDING",
        },
      });

      return { sprintId: sprint.id, plan };
    }),

  // Submit diagnostic test results
  submitDiagnostic: protectedProcedure
    .input(
      z.object({
        sprintId: z.string(),
        results: z.any(), // Test answers
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Calculate score and update chapter analysis
      // This would need rule-based scoring logic
      
      await ctx.prisma.sprint15Day.update({
        where: { id: input.sprintId },
        data: {
          diagnosticCompleted: true,
          currentDay: 1,
          status: "ACTIVE",
        },
      });

      return { success: true };
    }),

  // Get current day plan
  getDayPlan: protectedProcedure
    .input(
      z.object({
        sprintId: z.string(),
        dayNumber: z.number().min(1).max(15),
      })
    )
    .query(async ({ ctx, input }) => {
      const sprint = await ctx.prisma.sprint15Day.findUnique({
        where: { id: input.sprintId },
      });

      if (!sprint) {
        throw new Error("Sprint not found");
      }

      const dayPlan = (sprint.dailyPlans as any[])[input.dayNumber - 1];
      
      return {
        day: input.dayNumber,
        plan: dayPlan,
        parentReport: sprint.parentReport,
      };
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

  // Get parent report
  getParentReport: protectedProcedure
    .input(z.object({ sprintId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sprint = await ctx.prisma.sprint15Day.findUnique({
        where: { id: input.sprintId },
        select: {
          parentReport: true,
          currentDay: true,
          predictedScoreRange: true,
        },
      });

      return sprint?.parentReport || null;
    }),
});
