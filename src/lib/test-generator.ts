import type { PrecisionQuestion } from "@/data/precision-config";
import { physicsQuestions } from "@/data/precision-physics";
import { mathsQuestions } from "@/data/precision-maths";
import { chemistryQuestions } from "@/data/precision-chemistry";
import { PRECISION_BIOLOGY } from "@/data/precision-biology";
import { computerQuestions } from "@/data/precision-computers";
import { getAnswerKey, getPaper } from "@/data/tyq-papers";
import type { MCQ, CustomTestCatalogSubject } from "@/lib/custom-test-types";

const COMPETENCY_BANKS: Record<string, PrecisionQuestion[]> = {
    Physics: physicsQuestions,
    Mathematics: mathsQuestions,
    Chemistry: chemistryQuestions,
    Biology: PRECISION_BIOLOGY,
    "Computer Applications": computerQuestions,
};

const GUESS_PAPER_SUBJECTS: Record<string, string> = {
    "English Language": "english-language",
    "English Literature": "english-literature",
    "History & Civics": "history-civics",
    Geography: "geography",
};

const SUBJECT_ORDER = [
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "History & Civics",
    "Geography",
    "English Language",
    "English Literature",
    "Computer Applications",
];

const FULL_SYLLABUS = "Full Syllabus · Guess Paper Bank";
const ENGLISH_GRAMMAR = "Grammar · Guess Paper Bank";

function shuffle<T>(values: T[]): T[] {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapWith = Math.floor(Math.random() * (index + 1));
        [result[index], result[swapWith]] = [result[swapWith], result[index]];
    }
    return result;
}

function chapterName(chapter: string): string {
    if (chapter !== chapter.toUpperCase()) return chapter;
    return chapter
        .toLowerCase()
        .replace(/\band\b/g, "&")
        .replace(/\b\w/g, character => character.toUpperCase())
        .replace(/\bOop\b/g, "OOP")
        .replace(/\bGst\b/g, "GST");
}

function competencyQuestions(subject: string): MCQ[] {
    return (COMPETENCY_BANKS[subject] || []).map(question => ({
        id: `competency-${question.id}`,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: `From the ICSE ${question.year} competency bank. Correct answer: ${question.options[question.correctAnswer]}.`,
        chapter: question.chapter,
        difficulty: question.marks >= 3 ? "hard" : "medium",
    }));
}

function answerIndex(answer: string | undefined): number | null {
    const match = answer?.match(/^\s*\(([a-d])\)/i);
    return match ? match[1].toLowerCase().charCodeAt(0) - 97 : null;
}

function guessPaperQuestions(subjectId: string): MCQ[] {
    const questions: MCQ[] = [];
    for (const paperNumber of [1, 2]) {
        const paper = getPaper(subjectId, paperNumber);
        const answerKey = getAnswerKey(subjectId, paperNumber);
        if (!paper || !answerKey) continue;
        const answers = new Map(answerKey.answers.map(answer => [answer.questionNumber, answer]));

        for (const section of paper.sections) {
            for (const question of section.questions) {
                const candidates = [
                    ...(question.options?.length === 4 ? [{ number: question.number, text: question.text, options: question.options }] : []),
                    ...(question.subQuestions || [])
                        .filter(item => item.options?.length === 4)
                        .map(item => ({ number: `${question.number}${item.number}`, text: item.text, options: item.options! })),
                ];

                for (const candidate of candidates) {
                    const answer = answers.get(candidate.number);
                    const correctAnswer = answerIndex(answer?.answer);
                    if (correctAnswer === null || correctAnswer >= candidate.options.length) continue;
                    questions.push({
                        id: `guess-${subjectId}-${paperNumber}-${candidate.number.replace(/[^a-z0-9]/gi, "-")}`,
                        question: candidate.text,
                        options: candidate.options,
                        correctAnswer,
                        explanation: answer?.explanation || `From the ${paper.year} Guess Paper bank. Correct answer: ${candidate.options[correctAnswer]}.`,
                        chapter: FULL_SYLLABUS,
                        difficulty: "medium",
                    });
                }
            }
        }
    }
    return questions;
}

function englishLanguageQuestions(): MCQ[] {
    const result: MCQ[] = [];
    const fallbackWords = ["in", "on", "at", "to", "from", "with", "by", "for", "of", "into", "across", "among"];

    for (const paperNumber of [1, 2]) {
        const paper = getPaper("english-language", paperNumber);
        const key = getAnswerKey("english-language", paperNumber);
        const grammar = paper?.sections.flatMap(section => section.questions).find(question => question.number === "5");
        const answer = key?.answers.find(item => item.questionNumber === "5(b)")?.answer;
        if (!grammar || !answer) continue;

        const segment = grammar.text.match(/\(b\)[\s\S]*?(?=\n\n\(c\))/)?.[0] || "";
        const prompts = [...segment.matchAll(/\(([ivx]+)\)\s*([^\n]+)/gi)];
        const correctWords = new Map([...answer.matchAll(/\(([ivx]+)\)\s*([a-z]+)/gi)].map(match => [match[1].toLowerCase(), match[2]]));

        prompts.forEach((match, index) => {
            const number = match[1].toLowerCase();
            const correct = correctWords.get(number);
            if (!correct) return;
            const wordPool = [...new Set([...correctWords.values(), ...fallbackWords])].filter(word => word !== correct);
            const distractors = Array.from({ length: 3 }, (_, offset) => wordPool[(index + offset) % wordPool.length]);
            const rawOptions = [correct, ...distractors];
            const shift = index % rawOptions.length;
            const options = [...rawOptions.slice(shift), ...rawOptions.slice(0, shift)];
            result.push({
                id: `guess-english-language-${paperNumber}-${number}`,
                question: match[2].trim(),
                options,
                correctAnswer: options.indexOf(correct),
                explanation: `From the English Language Guess Paper grammar bank. The correct word is “${correct}”.`,
                chapter: ENGLISH_GRAMMAR,
                difficulty: "medium",
            });
        });
    }
    return result;
}

function subjectQuestions(subject: string): MCQ[] {
    if (COMPETENCY_BANKS[subject]) return competencyQuestions(subject);
    if (subject === "English Language") return englishLanguageQuestions();
    const subjectId = GUESS_PAPER_SUBJECTS[subject];
    return subjectId ? guessPaperQuestions(subjectId) : [];
}

export function getCustomTestCatalog(): CustomTestCatalogSubject[] {
    return SUBJECT_ORDER.map(subject => {
        const questions = subjectQuestions(subject);
        const source = COMPETENCY_BANKS[subject] ? "Competency Bank" as const : "Guess Paper Bank" as const;
        const counts = new Map<string, number>();
        questions.forEach(question => counts.set(question.chapter, (counts.get(question.chapter) || 0) + 1));
        return {
            id: subject,
            name: subject,
            questionCount: questions.length,
            chapters: [...counts.entries()].map(([id, questionCount]) => ({ id, name: chapterName(id), questionCount, source })),
        };
    }).filter(subject => subject.questionCount > 0);
}

/** Select unique local questions, balanced across all selected chapters. */
export async function generateMCQs(params: { subject: string; chapters: string[]; count: number }): Promise<MCQ[]> {
    const available = subjectQuestions(params.subject);
    const buckets = params.chapters.map(chapter => shuffle(available.filter(question => question.chapter === chapter)));
    const result: MCQ[] = [];

    while (result.length < params.count) {
        let found = false;
        for (const bucket of buckets) {
            const question = bucket.shift();
            if (!question) continue;
            result.push(question);
            found = true;
            if (result.length === params.count) break;
        }
        if (!found) break;
    }

    if (result.length === 0) throw new Error("No question-bank questions are available for this selection.");
    return result;
}

export function evaluateTest(questions: MCQ[], answers: Record<string, number>) {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const chapterPerformance: Record<string, { correct: number; total: number }> = {};

    questions.forEach(question => {
        const userAnswer = answers[question.id];
        chapterPerformance[question.chapter] ||= { correct: 0, total: 0 };
        chapterPerformance[question.chapter].total += 1;
        if (userAnswer === undefined || userAnswer === null) unattempted += 1;
        else if (userAnswer === question.correctAnswer) {
            correct += 1;
            chapterPerformance[question.chapter].correct += 1;
        } else incorrect += 1;
    });

    const attempted = correct + incorrect;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    return {
        correct,
        incorrect,
        unattempted,
        attempted,
        accuracy,
        strongChapters: Object.entries(chapterPerformance).filter(([, value]) => value.correct / value.total >= 0.7).map(([chapter]) => chapter),
        weakChapters: Object.entries(chapterPerformance).filter(([, value]) => value.correct / value.total < 0.5).map(([chapter]) => chapter),
        chapterPerformance,
    };
}
