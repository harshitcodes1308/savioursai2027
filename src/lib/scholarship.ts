import { physicsQuestions } from "@/data/precision-physics";
import { mathsQuestions } from "@/data/precision-maths";
import { chemistryQuestions } from "@/data/precision-chemistry";
import { PRECISION_BIOLOGY } from "@/data/precision-biology";
import { computerQuestions } from "@/data/precision-computers";
import { TIME_PER_MARK, type PrecisionQuestion } from "@/data/precision-config";

export const SCHOLARSHIP_QUESTION_COUNT = 10;
export const SCHOLARSHIP_OFFER_HOURS = 72;

export type ScholarshipQuestionRef = { subject: string; id: string };

const ALL_QUESTIONS: PrecisionQuestion[] = [
  ...physicsQuestions,
  ...mathsQuestions,
  ...chemistryQuestions,
  ...PRECISION_BIOLOGY,
  ...computerQuestions,
];

export function pickScholarshipQuestions() {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, SCHOLARSHIP_QUESTION_COUNT);
}

export function questionRefsFor(questions: PrecisionQuestion[]): ScholarshipQuestionRef[] {
  return questions.map(({ subject, id }) => ({ subject, id }));
}

export function findScholarshipQuestion({ subject, id }: ScholarshipQuestionRef) {
  return ALL_QUESTIONS.find(question => question.subject === subject && question.id === id);
}

export function getScholarshipDiscount(score: number) {
  if (score >= 90) return 50;
  if (score >= 75) return 40;
  if (score >= 60) return 30;
  if (score >= 40) return 20;
  return 10;
}

export function getQuestionTimeLimit(question: PrecisionQuestion) {
  return TIME_PER_MARK[question.marks] || 60;
}

export function publicScholarshipQuestion(question: PrecisionQuestion) {
  return {
    id: question.id,
    subject: question.subject,
    chapter: question.chapter,
    year: question.year,
    marks: question.marks,
    question: question.question,
    options: question.options,
    timeLimit: getQuestionTimeLimit(question),
  };
}

export function isScholarshipOfferActive(discount: number, expiresAt: Date | null) {
  return discount > 0 && !!expiresAt && expiresAt.getTime() > Date.now();
}

export function discountedPrice(basePrice: number, discountPercentage: number) {
  return Math.round(basePrice * (1 - discountPercentage / 100));
}
