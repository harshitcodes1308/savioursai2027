import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface MCQ {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // 0-3 index
    explanation: string;
    chapter: string;
    difficulty: "easy" | "medium" | "hard";
}

/**
 * Generate ICSE Class 10 MCQs using AI
 */
export async function generateMCQs(params: {
    subject: string;
    chapters: string[];
    count: number;
    perChapter?: Record<string, number>;
}): Promise<MCQ[]> {
    const { subject, chapters, count } = params;

    const prompt = `Generate ${count} ICSE Class 10 multiple-choice questions for ${subject}.

Chapters: ${chapters.join(", ")}

CRITICAL REQUIREMENTS:
- ICSE board syllabus only (no CBSE content)
- Exam-standard difficulty
- 4 options per question (A, B, C, D)
- Only ONE correct answer
- Clear, unambiguous questions
- Mix of difficulty: easy (30%), medium (50%), hard (20%)
- Mix of types: conceptual, application-based, numerical

Return STRICT JSON array format (NO markdown, NO extra text):
[
  {
    "question": "Which property of periodic table increases across a period?",
    "options": [
      "Atomic radius",
      "Electronegativity", 
      "Metallic character",
      "Number of shells"
    ],
    "correctAnswer": 1,
    "explanation": "Electronegativity increases across a period because nuclear charge increases while shielding remains constant. Option A is wrong because atomic radius decreases. Option C is wrong because metallic character decreases. Option D is wrong because number of shells remains the same.",
    "chapter": "Periodic Properties",
    "difficulty": "medium"
  }
]

Generate exactly ${count} questions total.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an ICSE Class 10 exam expert. Generate only valid JSON arrays of MCQs. NO markdown formatting, NO extra text."
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000, // Optimized from 4000 (50% cost reduction)
        });

        const content = completion.choices[0].message.content || "[]";

        // Strip markdown if present
        const cleanedContent = content
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

        const questions = JSON.parse(cleanedContent);

        // Add unique IDs
        return questions.map((q: any, i: number) => ({
            ...q,
            id: `q${i + 1}`,
        }));
    } catch (error) {
        console.error("MCQ generation error:", error);

        // Fallback mock questions
        return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
            id: `q${i + 1}`,
            question: `Sample ICSE ${subject} question ${i + 1} from ${chapters[0]}`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: i % 4,
            explanation: "This is a sample question. AI generation failed.",
            chapter: chapters[0],
            difficulty: "medium" as const,
        }));
    }
}

/**
 * Evaluate test answers and calculate analytics
 */
export function evaluateTest(
    questions: MCQ[],
    answers: Record<string, number>
) {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const chapterPerformance: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
        const userAnswer = answers[q.id];

        // Initialize chapter tracking
        if (!chapterPerformance[q.chapter]) {
            chapterPerformance[q.chapter] = { correct: 0, total: 0 };
        }
        chapterPerformance[q.chapter].total++;

        if (userAnswer === undefined || userAnswer === null) {
            unattempted++;
        } else if (userAnswer === q.correctAnswer) {
            correct++;
            chapterPerformance[q.chapter].correct++;
        } else {
            incorrect++;
        }
    });

    const attempted = correct + incorrect;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

    // Identify strong chapters (>=70% accuracy)
    const strongChapters = Object.entries(chapterPerformance)
        .filter(([_, perf]) => perf.total > 0 && perf.correct / perf.total >= 0.7)
        .map(([chapter]) => chapter);

    // Identify weak chapters (<50% accuracy)
    const weakChapters = Object.entries(chapterPerformance)
        .filter(([_, perf]) => perf.total > 0 && perf.correct / perf.total < 0.5)
        .map(([chapter]) => chapter);

    return {
        correct,
        incorrect,
        unattempted,
        attempted,
        accuracy,
        strongChapters,
        weakChapters,
        chapterPerformance,
    };
}
