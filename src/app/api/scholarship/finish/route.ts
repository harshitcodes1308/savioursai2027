import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findScholarshipQuestion, getScholarshipDiscount, SCHOLARSHIP_OFFER_HOURS, type ScholarshipQuestionRef } from "@/lib/scholarship";
import type { PrecisionQuestion } from "@/data/precision-config";

type SubmittedAnswer = { id: string; subject: string; selectedAnswer: number | null };

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Please sign in to finish the scholarship test." }, { status: 401 });

    const body = await req.json().catch(() => null);
    const attemptId = typeof body?.attemptId === "string" ? body.attemptId : "";
    const answers = Array.isArray(body?.answers) ? body.answers as SubmittedAnswer[] : [];
    if (!attemptId) return NextResponse.json({ error: "Invalid scholarship attempt." }, { status: 400 });

    const attempt = await prisma.scholarshipAttempt.findFirst({ where: { id: attemptId, userId: user.id } });
    if (!attempt || attempt.completedAt) return NextResponse.json({ error: "This scholarship attempt is no longer available." }, { status: 409 });
    if (Date.now() - attempt.startedAt.getTime() > 90 * 60 * 1000) {
    return NextResponse.json({ error: "This scholarship attempt timed out. Please start again." }, { status: 410 });
    }

    const refs = attempt.questionRefs as unknown as ScholarshipQuestionRef[];
    const questions = refs.map(findScholarshipQuestion).filter((question): question is PrecisionQuestion => !!question);
    if (questions.length !== refs.length) return NextResponse.json({ error: "Unable to validate this scholarship attempt." }, { status: 500 });

    const answerMap = new Map(answers.map(answer => [`${answer.subject}:${answer.id}`, answer.selectedAnswer]));
    const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
    const marksScored = questions.reduce((sum, question) => (
    answerMap.get(`${question.subject}:${question.id}`) === question.correctAnswer ? sum + question.marks : sum
    ), 0);
    const score = totalMarks ? Math.round((marksScored / totalMarks) * 100) : 0;
    const discountPercentage = getScholarshipDiscount(score);
    const completedAt = new Date();
    const expiresAt = new Date(completedAt.getTime() + SCHOLARSHIP_OFFER_HOURS * 60 * 60 * 1000);

    await prisma.$transaction([
    prisma.scholarshipAttempt.update({
      where: { id: attempt.id },
      data: { completedAt, marksScored, totalMarks, discountPercentage },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { scholarshipDiscountPercentage: discountPercentage, scholarshipDiscountExpiresAt: expiresAt, scholarshipTestCompletedAt: completedAt, scholarshipScore: score },
    }),
    ]);

    return NextResponse.json({ score, marksScored, totalMarks, discountPercentage, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    console.error("[scholarship-finish]", error);
    return NextResponse.json({ error: "Unable to calculate your scholarship. Please try again." }, { status: 500 });
  }
}
