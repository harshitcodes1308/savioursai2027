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

    const prompt = `You are an ICSE Class 10 board exam question paper setter with 20+ years of experience.

Generate ${count} HIGH-QUALITY multiple-choice questions for ${subject}.

Chapters: ${chapters.join(", ")}

CRITICAL REQUIREMENTS:
1. ❌ NO basic recall questions (e.g., "What is...", "Define...")
2. ✅ ONLY application, analysis, and problem-solving questions
3. ✅ Questions must require 2-3 steps to solve
4. ✅ Include numerical problems with calculations where applicable
5. ✅ Use ICSE board exam terminology and format
6. ✅ All 4 options must be plausible (avoid obvious wrong answers)
7. ✅ Questions must be DIRECTLY related to the specified chapters
8. ✅ Each question should be exam-standard difficulty

DIFFICULTY DISTRIBUTION:
- Easy questions: 0% (DO NOT GENERATE)
- Medium questions: 40% (simple application, 1-2 steps)
- Hard questions: 60% (multi-step problem solving, 3+ steps)

QUESTION TYPES MIX:
- Numerical/Calculation: 50%
- Conceptual Application: 30%
- Analysis/Reasoning: 20%

Return STRICT JSON array format (NO markdown, NO code blocks, NO extra text):
[
  {
    "question": "A detailed question with all necessary data and context. For numerical questions, include all given values and units.",
    "options": [
      "Option with proper units and format",
      "Another plausible option",
      "Third plausible option",
      "Fourth plausible option"
    ],
    "correctAnswer": 1,
    "explanation": "Step-by-step solution: Step 1: ... Step 2: ... Step 3: ... Therefore, the answer is [option]. Other options are incorrect because...",
    "chapter": "Exact chapter name from the list",
    "difficulty": "medium"
  }
]

EXAMPLE - Chemistry (Periodic Properties):
[
  {
    "question": "An element X has atomic number 17. When it forms an ion, what will be its ionic radius compared to its atomic radius, and why?",
    "options": [
      "Larger, because it gains an electron and electron-electron repulsion increases",
      "Smaller, because it loses an electron and nuclear attraction increases",
      "Larger, because it loses an electron and shielding decreases",
      "Same, because number of protons remains constant"
    ],
    "correctAnswer": 0,
    "explanation": "Element with atomic number 17 is Chlorine (Cl). It gains 1 electron to form Cl⁻ ion. With 18 electrons and 17 protons, electron-electron repulsion increases while nuclear charge remains same, causing ionic radius to be larger than atomic radius. Option B is wrong as Cl gains electron, not loses. Option C has wrong reasoning. Option D is incorrect as radius changes.",
    "chapter": "Periodic Properties",
    "difficulty": "hard"
  }
]

EXAMPLE - Physics (Force and Motion):
[
  {
    "question": "A ball is thrown vertically upward with an initial velocity of 30 m/s. Taking g = 10 m/s², what is the maximum height reached by the ball?",
    "options": [
      "45 m",
      "90 m",
      "30 m",
      "60 m"
    ],
    "correctAnswer": 0,
    "explanation": "At maximum height, final velocity v = 0. Using v² = u² - 2gh: 0 = (30)² - 2(10)h. Solving: 900 = 20h, h = 45 m. Option B (90m) would be if we used wrong formula. Option C (30m) is just the initial velocity value. Option D (60m) is incorrect calculation.",
    "chapter": "Force and Motion",
    "difficulty": "medium"
  }
]

NOW GENERATE exactly ${count} HARD, APPLICATION-BASED questions for the specified chapters:`;

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
            temperature: 0.6, // Lower for more focused, relevant questions
            max_tokens: 3000, // Increased for detailed explanations
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
