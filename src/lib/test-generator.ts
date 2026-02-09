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

    const prompt = `You are an ICSE 2026 board exam question paper setter specializing in COMPETENCY-BASED questions.

Generate ${count} EXTREMELY HARD, COMPETENCY-BASED questions for ${subject}.

Chapters: ${chapters.join(", ")}

🚨 CRITICAL REQUIREMENTS - ICSE 2026 COMPETENCY-BASED PATTERN:
1. ❌ ZERO easy or medium questions - ONLY HARD/VERY HARD
2. ❌ NO recall/memory questions (definitions, formulas, facts)
3. ❌ NO single-step or two-step problems
4. ✅ ONLY multi-step problem solving (3-5 steps minimum)
5. ✅ ONLY real-world application scenarios
6. ✅ ONLY analysis, evaluation, synthesis level (Bloom's Taxonomy)
7. ✅ Questions must test COMPETENCY and CRITICAL THINKING
8. ✅ Include data interpretation, comparison, decision-making
9. ✅ Cross-concept integration (combine 2-3 concepts)
10. ✅ Tricky distractors testing common misconceptions

ICSE 2026 COMPETENCY DISTRIBUTION:
- Problem Solving: 40%
- Critical Thinking & Analysis: 30%
- Application to New Situations: 20%
- Data Interpretation: 10%

QUESTION COMPLEXITY REQUIREMENTS:
- Must require understanding of WHY, not just WHAT
- Must involve decision-making or comparison between options
- Must test ability to apply concepts to unfamiliar situations
- Must require multi-step calculations WITH conceptual reasoning
- All 4 options must be plausible (test partial understanding/misconceptions)

Return STRICT JSON array (NO markdown, NO code blocks, NO extra text):
[
  {
    "question": "Detailed scenario with multiple data points requiring analysis and multi-step solution. Include all necessary values, units, and context.",
    "options": [
      "Option testing correct multi-step solution",
      "Option testing common misconception",
      "Option testing calculation error",
      "Option testing conceptual misunderstanding"
    ],
    "correctAnswer": 0,
    "explanation": "Step-by-step solution: Given: ... Step 1: Analyze/Identify... Step 2: Apply concept/formula... Step 3: Calculate... Step 4: Verify/Conclude... Common errors: Option 1 assumes [misconception], Option 2 results from [error], Option 3 misunderstands [concept].",
    "chapter": "Exact chapter name",
    "difficulty": "hard"
  }
]

EXAMPLE 1 - Chemistry (Mole Concept) - COMPETENCY-BASED:
[
  {
    "question": "A student performs an experiment where 10.6g of anhydrous sodium carbonate (Na₂CO₃) reacts with excess dilute HCl. The CO₂ produced is passed through lime water. If only 80% of the theoretical CO₂ actually reacts with lime water due to experimental losses, what mass of calcium carbonate precipitate is formed? (Na=23, C=12, O=16, Ca=40)",
    "options": [
      "8.0 g",
      "10.0 g",
      "6.4 g",
      "8.8 g"
    ],
    "correctAnswer": 0,
    "explanation": "Step 1: Moles of Na₂CO₃ = 10.6/106 = 0.1 mol. Step 2: Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. Theoretical CO₂ = 0.1 mol. Step 3: Actual CO₂ reacting = 0.1 × 0.8 = 0.08 mol. Step 4: CO₂ + Ca(OH)₂ → CaCO₃ + H₂O. Moles CaCO₃ = 0.08 mol. Step 5: Mass = 0.08 × 100 = 8.0g. Option 1 (10g) ignores 80% efficiency. Option 2 (6.4g) incorrectly applies 80% to final mass. Option 3 (8.8g) uses wrong molar mass.",
    "chapter": "Mole Concept",
    "difficulty": "hard"
  }
]

EXAMPLE 2 - Physics (Energy) - COMPETENCY-BASED:
[
  {
    "question": "A truck and a car are moving with the same kinetic energy. The mass of the truck is 4 times that of the car. If both vehicles stop in the same distance using brakes, compare the braking forces. If the car requires a braking force of F, what force is required to stop the truck?",
    "options": [
      "2F",
      "4F",
      "F/2",
      "F"
    ],
    "correctAnswer": 0,
    "explanation": "Given: KE_truck = KE_car, m_truck = 4m_car. From KE = ½mv²: ½(4m)v_t² = ½(m)v_c², so v_c = 2v_t. Using work-energy: F×d = KE. For same distance d and equal KE, forces should be equal... BUT this ignores that F = ma = m(v²/2d). For car: F = m(v_c²/2d). For truck: F_truck = 4m(v_t²/2d) = 4m((v_c/2)²/2d) = m(v_c²/2d) × 2 = 2F. Option 1 (4F) assumes direct mass proportionality. Option 2 (F/2) inverts relationship. Option 3 (F) ignores velocity difference.",
    "chapter": "Work, Energy and Power",
    "difficulty": "hard"
  }
]

EXAMPLE 3 - Mathematics (Quadratic Equations) - COMPETENCY-BASED:
[
  {
    "question": "A rectangular park has a walking path of uniform width around it. The park's dimensions are 40m × 30m. If the total area including the path is 1800 m², find the width of the path by forming and solving a quadratic equation.",
    "options": [
      "5 m",
      "10 m",
      "3 m",
      "7 m"
    ],
    "correctAnswer": 0,
    "explanation": "Let path width = x. Total dimensions: (40+2x) × (30+2x). Equation: (40+2x)(30+2x) = 1800. Expanding: 1200 + 80x + 60x + 4x² = 1800. Simplifying: 4x² + 140x - 600 = 0, or x² + 35x - 150 = 0. Using quadratic formula: x = (-35 ± √(1225+600))/2 = (-35 ± 42.7)/2. Positive root: x ≈ 5m. Option 1 (10m) gives area 2500m². Option 2 (3m) gives 1656m². Option 3 (7m) gives 2072m².",
    "chapter": "Quadratic Equations",
    "difficulty": "hard"
  }
]

NOW GENERATE exactly ${count} EXTREMELY HARD, COMPETENCY-BASED ICSE 2026 questions.
REMEMBER: NO easy, NO medium - ONLY HARD multi-step competency-based questions!`;

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
            temperature: 0.5, // Lower for strict adherence to hard competency-based requirements
            max_tokens: 4000, // Increased for complex multi-step explanations
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
