import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findScholarshipQuestion, pickScholarshipQuestions, publicScholarshipQuestion, questionRefsFor, type ScholarshipQuestionRef } from "@/lib/scholarship";
import type { PrecisionQuestion } from "@/data/precision-config";

function diagnosticCode(error: unknown) {
  const details = error instanceof Error ? error.message : String(error);
  const prismaCode = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (prismaCode === "P2021" || prismaCode === "P2022") return "DATABASE_SCHEMA_OUTDATED";
  if (/Unknown (field|argument)|scholarshipAttempt/i.test(details)) return "PRISMA_CLIENT_STALE";
  if (/Can't reach database|P1001/i.test(details)) return "DATABASE_UNREACHABLE";
  return "SCHOLARSHIP_START_FAILED";
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Please sign in to take the scholarship test." }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isPaid: true, planType: true, scholarshipTestCompletedAt: true },
    });
    if (!dbUser) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (dbUser.isPaid || dbUser.planType !== "FREE") {
      return NextResponse.json({ error: "The scholarship test is available for free-plan students only." }, { status: 403 });
    }
    if (dbUser.scholarshipTestCompletedAt) {
      return NextResponse.json({ error: "This scholarship test has already been used for this account." }, { status: 409 });
    }

    // Refreshes must resume the same paper; students cannot reroll until they
    // find a favourable set of questions.
    const unfinished = await prisma.scholarshipAttempt.findFirst({
      where: { userId: user.id, completedAt: null },
      orderBy: { startedAt: "desc" },
    });
    if (unfinished && Date.now() - unfinished.startedAt.getTime() < 90 * 60 * 1000) {
      const refs = unfinished.questionRefs as unknown as ScholarshipQuestionRef[];
      const questions = refs.map(findScholarshipQuestion).filter((question): question is PrecisionQuestion => !!question);
      if (questions.length === refs.length) {
        return NextResponse.json({ attemptId: unfinished.id, questions: questions.map(publicScholarshipQuestion) });
      }
    }
    if (unfinished) await prisma.scholarshipAttempt.delete({ where: { id: unfinished.id } });

    const questions = pickScholarshipQuestions();
    const attempt = await prisma.scholarshipAttempt.create({
      data: { userId: user.id, questionRefs: questionRefsFor(questions) },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      questions: questions.map(publicScholarshipQuestion),
    });
  } catch (error) {
    const code = diagnosticCode(error);
    console.error(`[scholarship-start:${code}]`, error);
    return NextResponse.json({ error: `Unable to prepare your scholarship test (${code}).`, code }, { status: 500 });
  }
}
