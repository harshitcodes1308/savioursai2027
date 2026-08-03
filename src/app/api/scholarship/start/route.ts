import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findScholarshipQuestion, pickScholarshipQuestions, publicScholarshipQuestion, questionRefsFor, type ScholarshipQuestionRef } from "@/lib/scholarship";
import type { PrecisionQuestion } from "@/data/precision-config";

export async function POST() {
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
}
