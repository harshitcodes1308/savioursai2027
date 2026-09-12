import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { openai } from "@/lib/ai";
import { Prisma } from "@prisma/client";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Add `days` calendar days to a Date, returning the result at midnight UTC */
function addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
}

/** Determine phase from day number (1-indexed) */
function phaseForDay(day: number): number {
    if (day <= 30) return 1;
    if (day <= 60) return 2;
    return 3;
}

/** Task type rotation within each phase */
function taskTypeForDay(day: number): "STUDY" | "PRACTICE" | "TEST" {
    const phase = phaseForDay(day);
    if (phase === 1) return "STUDY";
    if (phase === 2) return "PRACTICE";
    return "TEST";
}

/** Check if user has PRO or BUNDLE access */
async function assertPaidAccess(
    prisma: any,
    userId: string,
    phase: number
): Promise<void> {
    if (phase <= 1) return; // Phase 1 is free

    const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            isPaid: true,
            planType: true,
            subscriptionStatus: true,
            subscriptionExpiry: true,
            createdAt: true,
        },
    });

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const isGrandfathered = user.createdAt < CUTOFF_DATE;
    const hasActiveSub =
        (user.planType === "PRO" || user.planType === "BUNDLE") &&
        user.subscriptionStatus === "ACTIVE";
    const isExpired =
        user.subscriptionExpiry !== null &&
        new Date(user.subscriptionExpiry) < new Date();

    if (!isGrandfathered && !user.isPaid && (!hasActiveSub || isExpired)) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "UPGRADE_REQUIRED",
        });
    }
}

// ── ICSE Syllabus mapping — topics per subject ────────────────────────────────
const ICSE_SYLLABUS: Record<string, string[]> = {
    "Physics": [
        "Force, Work, Power, Energy",
        "Light (Refraction, Lenses)",
        "Sound (Wave motion)",
        "Electricity (Ohm's Law, Circuits)",
        "Electromagnetism",
        "Modern Physics (Radioactivity)",
        "Heat (Calorimetry, Specific Heat)",
        "Machines (Levers, Pulleys)",
        "Motion (Equations, Graphs)",
        "Pressure in Fluids",
    ],
    "Chemistry": [
        "Periodic Table",
        "Chemical Bonding",
        "Acids, Bases, Salts",
        "Analytical Chemistry",
        "Mole Concept",
        "Electrolysis",
        "Metallurgy",
        "Study of Compounds (HCl, HNO3, H2SO4, NH3)",
        "Organic Chemistry",
        "Atmospheric Pollution",
    ],
    "Mathematics": [
        "Commercial Mathematics (GST, Banking)",
        "Algebra (Polynomials, Linear Equations)",
        "Geometry (Circles, Tangents)",
        "Mensuration (Cone, Cylinder, Sphere)",
        "Trigonometry",
        "Statistics (Mean, Median, Mode, Histogram)",
        "Probability",
        "Matrices",
        "Coordinate Geometry",
        "Quadratic Equations",
    ],
    "Biology": [
        "Cell Biology",
        "Genetics",
        "Human Anatomy (Circulatory System)",
        "Human Anatomy (Nervous System)",
        "Human Anatomy (Excretory System)",
        "Plant Physiology",
        "Ecology",
        "Reproduction in Plants",
        "Human Reproduction",
        "Health and Hygiene",
    ],
    "History & Civics": [
        "The Union Legislature",
        "The Union Executive",
        "The Judiciary",
        "Local Self-Government",
        "Nationalism in India (1857-1917)",
        "The Gandhian Era",
        "Towards Independence",
        "World War I and Treaty of Versailles",
        "Rise of Dictatorships",
        "World War II and After",
    ],
    "Geography": [
        "Resources",
        "Agriculture in India",
        "Soils of India",
        "Natural Vegetation",
        "Water Resources",
        "Mineral Resources",
        "Power Resources",
        "Industry in India",
        "Transport and Communication",
        "Map Work",
    ],
};

// ── GPT-4o-mini content generator ─────────────────────────────────────────────
async function generateTaskContent(
    phase: number,
    taskType: "STUDY" | "PRACTICE" | "TEST",
    subject: string,
    topicRef: string,
    weakTopics: Record<string, number>,
    board: string
): Promise<object> {
    const weakContext =
        Object.keys(weakTopics).length > 0
            ? `Student's known weak topics: ${Object.entries(weakTopics)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([t, s]) => `${t} (weakness score: ${s})`)
                  .join(", ")}.`
            : "No weak topic history yet.";

    const prompts: Record<"STUDY" | "PRACTICE" | "TEST", string> = {
        STUDY: `You are a ${board} board exam prep engine. Generate a structured STUDY task for:
Subject: ${subject} | Topic: ${topicRef}
${weakContext}

Return a JSON object with keys:
- "summary": 2-sentence topic overview (string)
- "keyPoints": array of 6-8 important bullet points (string[])
- "watchQuery": YouTube search query for best lecture (string)
- "revisionChecklist": array of 5 revision checkpoints (string[])
- "practiceHint": one actionable practice tip (string)
- "estimatedMinutes": estimated study time in minutes (number)

Return only valid JSON, no markdown.`,

        PRACTICE: `You are a ${board} board exam prep engine. Generate a PRACTICE Q-set for:
Subject: ${subject} | Topic: ${topicRef}
${weakContext}

Return a JSON object with keys:
- "instructions": 1-sentence instruction for the student (string)
- "questions": array of 6 questions, each with:
  - "id": string (q1..q6)
  - "text": question text (string)
  - "type": "MCQ" | "SHORT" (string)
  - "options": array of 4 strings for MCQ, empty array for SHORT
  - "answer": correct answer string (option text for MCQ, expected answer for SHORT)
  - "marks": 1 for MCQ, 2-4 for SHORT (number)
  - "difficulty": "EASY" | "MEDIUM" | "HARD"
- "totalMarks": total marks (number)
- "estimatedMinutes": number

Return only valid JSON, no markdown.`,

        TEST: `You are a ${board} board exam prep engine. Generate a FULL MOCK PAPER config for:
Subject: ${subject} | Focus weak topics: ${topicRef}
${weakContext}

Return a JSON object with keys:
- "paperTitle": e.g. "Physics Mock Paper 3 — Mixed Topics" (string)
- "totalMarks": 80 (number)
- "duration": 120 (minutes, number)
- "sections": array of sections, each with:
  - "name": section name (string)
  - "instructions": instructions (string)
  - "questions": array of question configs, each with:
    - "id": string
    - "text": full question text
    - "type": "MCQ" | "SHORT" | "LONG"
    - "options": string[] for MCQ
    - "answer": model answer string
    - "marks": number
    - "topic": topic name
- "partialMarkingRules": "Each correct MCQ: 1 mark. Short answer: awarded 0, 1, or full marks based on concept coverage. Long answer: concept-by-concept rubric." (string)

Return only valid JSON, no markdown.`,
    };

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: prompts[taskType] },
                {
                    role: "user",
                    content: `Generate the ${taskType} task for ${subject}: ${topicRef}`,
                },
            ],
            temperature: 0.7,
            max_tokens: taskType === "TEST" ? 3000 : 1500,
            response_format: { type: "json_object" },
        });

        const raw = response.choices[0]?.message?.content ?? "{}";
        return JSON.parse(raw);
    } catch {
        // Fallback stub so the task is never broken
        return {
            error: "Content generation temporarily unavailable. Please retry.",
            summary: `Study ${topicRef} from your ${board} ${subject} textbook.`,
            estimatedMinutes: 45,
        };
    }
}

let tablesReady = false;

async function ensurePreBoard90Tables(prisma: any) {
    if (tablesReady) return;
    try {
        const statements = [
            `DO $$ BEGIN CREATE TYPE "PreBoard90Status" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `DO $$ BEGIN CREATE TYPE "PreBoard90TaskType" AS ENUM ('STUDY', 'PRACTICE', 'TEST'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `DO $$ BEGIN CREATE TYPE "PreBoard90TaskStatus" AS ENUM ('LOCKED', 'ACTIVE', 'DONE', 'MISSED'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
            `CREATE TABLE IF NOT EXISTS "preboard90_plans" (
                "id" TEXT NOT NULL,
                "studentId" TEXT NOT NULL,
                "board" TEXT NOT NULL DEFAULT 'ICSE',
                "grade" INTEGER NOT NULL DEFAULT 10,
                "subjects" TEXT[],
                "startDate" DATE NOT NULL,
                "phase1End" DATE NOT NULL,
                "phase2End" DATE NOT NULL,
                "phase3End" DATE NOT NULL,
                "status" "PreBoard90Status" NOT NULL DEFAULT 'ACTIVE',
                "weakTopics" JSONB NOT NULL DEFAULT '{}',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "preboard90_plans_pkey" PRIMARY KEY ("id")
            );`,
            `CREATE TABLE IF NOT EXISTS "preboard90_tasks" (
                "id" TEXT NOT NULL,
                "planId" TEXT NOT NULL,
                "day" INTEGER NOT NULL,
                "phase" INTEGER NOT NULL,
                "taskType" "PreBoard90TaskType" NOT NULL,
                "subject" TEXT NOT NULL,
                "topicRef" TEXT NOT NULL,
                "contentJson" JSONB,
                "status" "PreBoard90TaskStatus" NOT NULL DEFAULT 'LOCKED',
                "completedAt" TIMESTAMP(3),
                "testResultId" TEXT,
                CONSTRAINT "preboard90_tasks_pkey" PRIMARY KEY ("id")
            );`,
            `CREATE INDEX IF NOT EXISTS "preboard90_plans_studentId_status_idx" ON "preboard90_plans"("studentId", "status");`,
            `CREATE UNIQUE INDEX IF NOT EXISTS "preboard90_tasks_planId_day_key" ON "preboard90_tasks"("planId", "day");`,
            `CREATE INDEX IF NOT EXISTS "preboard90_tasks_planId_status_idx" ON "preboard90_tasks"("planId", "status");`
        ];
        for (const sql of statements) {
            await prisma.$executeRawUnsafe(sql);
        }
        tablesReady = true;
    } catch (e) {
        console.warn("PreBoard90 table auto-ensure:", e);
    }
}

// ── Router ────────────────────────────────────────────────────────────────────

export const preBoard90Router = createTRPCRouter({
    /**
     * Enroll student in the 90-day programme.
     * Creates the plan + inserts skeleton tasks for all 90 days.
     */
    enrollPlan: protectedProcedure
        .input(
            z.object({
                subjects: z.array(z.string()).min(1).max(8),
                startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ensurePreBoard90Tables(ctx.prisma);

            // Check for existing active plan
            let existing = null;
            try {
                existing = await ctx.prisma.preBoard90Plan.findFirst({
                    where: { studentId: ctx.user.id, status: "ACTIVE" },
                });
            } catch (e: any) {
                if (e?.message?.includes("does not exist") || e?.code === "P2021") {
                    tablesReady = false;
                    await ensurePreBoard90Tables(ctx.prisma);
                    existing = null;
                } else {
                    throw e;
                }
            }

            if (existing) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "You already have an active Pre-Board 90 plan.",
                });
            }

            const start = new Date(input.startDate + "T00:00:00Z");
            const phase1End = addDays(start, 29); // Day 30
            const phase2End = addDays(start, 59); // Day 60
            const phase3End = addDays(start, 89); // Day 90

            const plan = await ctx.prisma.preBoard90Plan.create({
                data: {
                    studentId: ctx.user.id,
                    board: "ICSE",
                    grade: 10,
                    subjects: input.subjects,
                    startDate: start,
                    phase1End,
                    phase2End,
                    phase3End,
                    status: "ACTIVE",
                    weakTopics: {},
                },
            });

            // Build 90 skeleton tasks — rotate subjects across days
            const syllabus = input.subjects.map((s) => ({
                subject: s,
                topics: [...(ICSE_SYLLABUS[s] ?? [`${s} Core Topics`])],
            }));

            const taskData = [];
            let topicCursors: Record<string, number> = {};

            for (let day = 1; day <= 90; day++) {
                const subjectIndex = (day - 1) % input.subjects.length;
                const subjectEntry = syllabus[subjectIndex];
                const subj = subjectEntry.subject;

                // Advance topic cursor per subject
                if (topicCursors[subj] === undefined) topicCursors[subj] = 0;
                const topicIdx = topicCursors[subj] % subjectEntry.topics.length;
                const topic = subjectEntry.topics[topicIdx];
                topicCursors[subj]++;

                const phase = phaseForDay(day);
                const taskType = taskTypeForDay(day);

                taskData.push({
                    planId: plan.id,
                    day,
                    phase,
                    taskType,
                    subject: subj,
                    topicRef: topic,
                    status: day === 1 ? ("ACTIVE" as const) : ("LOCKED" as const),
                });
            }

            await ctx.prisma.preBoard90Task.createMany({ data: taskData });

            return {
                planId: plan.id,
                startDate: plan.startDate,
                phase1End: plan.phase1End,
                phase2End: plan.phase2End,
                phase3End: plan.phase3End,
            };
        }),

    /**
     * Get the active plan + today's task (activate + generate content on demand).
     * Missed days roll forward — oldest unresolved task ≤ today is served.
     */
    getTodayTask: protectedProcedure.query(async ({ ctx }) => {
        await ensurePreBoard90Tables(ctx.prisma);
        let plan = null;
        try {
            plan = await ctx.prisma.preBoard90Plan.findFirst({
                where: { studentId: ctx.user.id, status: "ACTIVE" },
                orderBy: { createdAt: "desc" },
            });
        } catch (e: any) {
            if (e?.message?.includes("does not exist") || e?.code === "P2021") {
                tablesReady = false;
                await ensurePreBoard90Tables(ctx.prisma);
                return null;
            }
            throw e;
        }
        if (!plan) return null;

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const startDay = new Date(plan.startDate);
        startDay.setUTCHours(0, 0, 0, 0);

        const daysSinceStart = Math.floor(
            (today.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)
        );
        const currentDay = Math.min(Math.max(daysSinceStart + 1, 1), 90);

        // Mark any ACTIVE tasks before today as MISSED
        await ctx.prisma.preBoard90Task.updateMany({
            where: {
                planId: plan.id,
                status: "ACTIVE",
                day: { lt: currentDay },
            },
            data: { status: "MISSED" },
        });

        // Unlock today's task if still LOCKED
        await ctx.prisma.preBoard90Task.updateMany({
            where: { planId: plan.id, day: currentDay, status: "LOCKED" },
            data: { status: "ACTIVE" },
        });

        // Find oldest unresolved task (ACTIVE or MISSED) up to today
        const task = await ctx.prisma.preBoard90Task.findFirst({
            where: {
                planId: plan.id,
                status: { in: ["ACTIVE", "MISSED"] },
                day: { lte: currentDay },
            },
            orderBy: { day: "asc" },
        });

        if (!task) {
            // All tasks done — complete the plan
            await ctx.prisma.preBoard90Plan.update({
                where: { id: plan.id },
                data: { status: "COMPLETED" },
            });
            return { plan, task: null, currentDay, completed: true };
        }

        // Phase gate check (informational — actual block is in submitTask)
        const requiresUpgrade = task.phase > 1;

        // Generate content lazily if not yet generated
        if (!task.contentJson && !requiresUpgrade) {
            const weakTopics = (plan.weakTopics as Record<string, number>) ?? {};
            const content = await generateTaskContent(
                task.phase,
                task.taskType as "STUDY" | "PRACTICE" | "TEST",
                task.subject,
                task.topicRef,
                weakTopics,
                plan.board
            );
            await ctx.prisma.preBoard90Task.update({
                where: { id: task.id },
                data: { contentJson: content },
            });
            return {
                plan,
                task: { ...task, contentJson: content },
                currentDay,
                requiresUpgrade,
                completed: false,
            };
        }

        return { plan, task, currentDay, requiresUpgrade, completed: false };
    }),

    /**
     * Submit a completed task. Phase > 1 requires PRO/BUNDLE.
     * Updates weakTopics if performance data is provided.
     */
    submitTask: protectedProcedure
        .input(
            z.object({
                taskId: z.string(),
                planId: z.string(),
                performance: z
                    .object({
                        score: z.number().optional(),
                        totalMarks: z.number().optional(),
                        weakTopicsIdentified: z.array(z.string()).optional(),
                        testResultId: z.string().optional(),
                    })
                    .optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const task = await ctx.prisma.preBoard90Task.findUnique({
                where: { id: input.taskId },
                include: { plan: true },
            });

            if (!task) throw new TRPCError({ code: "NOT_FOUND" });
            if (task.plan.studentId !== ctx.user.id)
                throw new TRPCError({ code: "FORBIDDEN" });

            // Phase gate
            await assertPaidAccess(ctx.prisma, ctx.user.id, task.phase);

            // Mark done
            await ctx.prisma.preBoard90Task.update({
                where: { id: task.id },
                data: {
                    status: "DONE",
                    completedAt: new Date(),
                    testResultId: input.performance?.testResultId ?? null,
                },
            });

            // Update weakTopics if score provided
            if (
                input.performance?.weakTopicsIdentified?.length ||
                (input.performance?.score !== undefined &&
                    input.performance?.totalMarks !== undefined)
            ) {
                const current =
                    (task.plan.weakTopics as Record<string, number>) ?? {};

                if (input.performance.weakTopicsIdentified) {
                    for (const wt of input.performance.weakTopicsIdentified) {
                        current[wt] = (current[wt] ?? 0) + 1;
                    }
                }

                // Decay score-based weak detection
                if (
                    input.performance.score !== undefined &&
                    input.performance.totalMarks
                ) {
                    const pct =
                        (input.performance.score / input.performance.totalMarks) *
                        100;
                    if (pct < 50) {
                        current[task.topicRef] = (current[task.topicRef] ?? 0) + 2;
                    } else if (pct >= 80) {
                        // Good — reduce weakness score
                        if (current[task.topicRef]) {
                            current[task.topicRef] = Math.max(
                                0,
                                current[task.topicRef] - 1
                            );
                        }
                    }
                }

                await ctx.prisma.preBoard90Plan.update({
                    where: { id: input.planId },
                    data: { weakTopics: current },
                });
            }

            // Unlock next task
            const nextDay = task.day + 1;
            if (nextDay <= 90) {
                await ctx.prisma.preBoard90Task.updateMany({
                    where: {
                        planId: input.planId,
                        day: nextDay,
                        status: "LOCKED",
                    },
                    data: { status: "ACTIVE" },
                });
            }

            return { success: true, nextDay };
        }),

    /**
     * Get 90-day tracker data for the progress widget.
     */
    getPhaseProgress: protectedProcedure.query(async ({ ctx }) => {
        await ensurePreBoard90Tables(ctx.prisma);
        let plan = null;
        try {
            plan = await ctx.prisma.preBoard90Plan.findFirst({
                where: { studentId: ctx.user.id, status: { in: ["ACTIVE", "COMPLETED"] } },
                orderBy: { createdAt: "desc" },
                include: { tasks: { select: { day: true, phase: true, status: true, taskType: true, subject: true, topicRef: true } } },
            });
        } catch (e: any) {
            if (e?.message?.includes("does not exist") || e?.code === "P2021") {
                tablesReady = false;
                await ensurePreBoard90Tables(ctx.prisma);
                return null;
            }
            throw e;
        }

        if (!plan) return null;

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const startDay = new Date(plan.startDate);
        startDay.setUTCHours(0, 0, 0, 0);
        const currentDay = Math.min(
            Math.max(
                Math.floor((today.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1,
                1
            ),
            90
        );

        const taskMap = new Map(plan.tasks.map((t) => [t.day, t]));

        const days = Array.from({ length: 90 }, (_, i) => {
            const day = i + 1;
            const t = taskMap.get(day);
            return {
                day,
                phase: phaseForDay(day),
                status: t?.status ?? "LOCKED",
                taskType: t?.taskType ?? "STUDY",
                subject: t?.subject ?? "",
                topicRef: t?.topicRef ?? "",
            };
        });

        const doneDays = days.filter((d) => d.status === "DONE").length;
        const missedDays = days.filter((d) => d.status === "MISSED").length;

        return {
            planId: plan.id,
            board: plan.board,
            grade: plan.grade,
            subjects: plan.subjects,
            startDate: plan.startDate,
            phase1End: plan.phase1End,
            phase2End: plan.phase2End,
            phase3End: plan.phase3End,
            status: plan.status,
            currentDay,
            days,
            doneDays,
            missedDays,
            weakTopics: plan.weakTopics,
        };
    }),

    /**
     * Pre-generate AI content for the next N unlocked tasks.
     * Called in the background after task submission to keep content ready.
     */
    generateDailyContent: protectedProcedure
        .input(
            z.object({
                planId: z.string(),
                count: z.number().int().min(1).max(5).default(3),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const plan = await ctx.prisma.preBoard90Plan.findUnique({
                where: { id: input.planId },
            });
            if (!plan || plan.studentId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            const pending = await ctx.prisma.preBoard90Task.findMany({
                where: {
                    planId: input.planId,
                    contentJson: { equals: Prisma.JsonNull },
                    status: { in: ["ACTIVE", "LOCKED"] },
                },
                orderBy: { day: "asc" },
                take: input.count,
            });

            const weakTopics = (plan.weakTopics as Record<string, number>) ?? {};
            let generated = 0;

            for (const task of pending) {
                // Skip Phase 2/3 pre-generation for free users
                try {
                    await assertPaidAccess(ctx.prisma, ctx.user.id, task.phase);
                } catch {
                    continue; // Not paid — skip, will gate at task open time
                }

                const content = await generateTaskContent(
                    task.phase,
                    task.taskType as "STUDY" | "PRACTICE" | "TEST",
                    task.subject,
                    task.topicRef,
                    weakTopics,
                    plan.board
                );

                await ctx.prisma.preBoard90Task.update({
                    where: { id: task.id },
                    data: { contentJson: content },
                });
                generated++;
            }

            return { generated };
        }),

    /**
     * Abandon the current active plan (soft delete — sets status to ABANDONED).
     */
    abandonPlan: protectedProcedure.mutation(async ({ ctx }) => {
        await ensurePreBoard90Tables(ctx.prisma);
        const plan = await ctx.prisma.preBoard90Plan.findFirst({
            where: { studentId: ctx.user.id, status: "ACTIVE" },
        });
        if (!plan) throw new TRPCError({ code: "NOT_FOUND" });

        await ctx.prisma.preBoard90Plan.update({
            where: { id: plan.id },
            data: { status: "ABANDONED" },
        });

        return { success: true };
    }),

    /**
     * Return all 90 tasks for the active plan — used by the "View Full Plan" page.
     */
    getPlanSchedule: protectedProcedure.query(async ({ ctx }) => {
        await ensurePreBoard90Tables(ctx.prisma);
        let plan = null;
        try {
            plan = await ctx.prisma.preBoard90Plan.findFirst({
                where: { studentId: ctx.user.id, status: { in: ["ACTIVE", "COMPLETED"] } },
                orderBy: { createdAt: "desc" },
                include: {
                    tasks: {
                        select: {
                            id: true, day: true, phase: true, taskType: true,
                            subject: true, topicRef: true, status: true, completedAt: true,
                        },
                        orderBy: { day: "asc" },
                    },
                },
            });
        } catch (e: any) {
            if (e?.message?.includes("does not exist") || e?.code === "P2021") {
                tablesReady = false;
                await ensurePreBoard90Tables(ctx.prisma);
                return null;
            }
            throw e;
        }
        if (!plan) return null;
        return {
            planId: plan.id,
            subjects: plan.subjects,
            board: plan.board,
            startDate: plan.startDate,
            tasks: plan.tasks,
        };
    }),
});
