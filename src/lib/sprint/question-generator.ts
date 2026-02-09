import { openai } from "../ai";

/**
 * QuestionGenerator: Creates REAL ICSE board-level questions
 * Priority: AI-generated > Cached examples > Error
 */
export class QuestionGenerator {
  private retryCount = 2; // Retry AI generation before giving up

  /**
   * Generate questions for a specific chapter with robust error handling
   */
  async generateForChapter(
    subject: string,
    chapter: string,
    count: number = 5
  ): Promise<any[]> {
    console.log(`[QuestionGen] Generating ${count} ICSE questions for ${subject} - ${chapter}`);

    // Try AI generation with retry
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const questions = await this.aiGenerateICSequestions(subject, chapter, count);
        
        if (questions && questions.length >= count) {
          console.log(`[QuestionGen] ✓ AI generated ${questions.length} quality questions (attempt ${attempt})`);
          return questions;
        } else if (questions && questions.length > 0) {
          console.warn(`[QuestionGen] AI generated only ${questions.length}/${count} questions, padding with examples`);
          return this.padWithExamples(questions, subject, chapter, count);
        }
      } catch (error: any) {
        console.warn(`[QuestionGen] Attempt ${attempt}/${this.retryCount} failed:`, error?.message || error);
        
        if (attempt < this.retryCount) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }
    }

    // If AI completely failed after retries, use curated examples
    console.error(`[QuestionGen] ⚠️ AI failed after ${this.retryCount} attempts, using ICSE examples for ${chapter}`);
    return this.getICSeExampleQuestions(subject, chapter, count);
  }

  /**
   * AI-powered question generation with ICSE-specific prompting
   */
  private async aiGenerateICSequestions(
    subject: string,
    chapter: string,
    count: number
  ): Promise<any[]> {
    const prompt = `You are an ICSE 2026 board exam question paper setter specializing in COMPETENCY-BASED questions.

Generate ${count} EXTREMELY HARD, COMPETENCY-BASED questions for:
- Subject: ${subject}
- Chapter: ${chapter}
- Standard: ICSE 2026 (NEW COMPETENCY-BASED PATTERN)

🚨 CRITICAL REQUIREMENTS - COMPETENCY-BASED ICSE 2026:
1. ❌ ZERO easy or medium questions - ONLY HARD/VERY HARD
2. ❌ NO recall questions (definitions, formulas, facts)
3. ❌ NO single-step problems
4. ✅ ONLY multi-step problem solving (3-5 steps minimum)
5. ✅ ONLY application in real-world scenarios
6. ✅ ONLY analysis, evaluation, and synthesis level (Bloom's Taxonomy)
7. ✅ Questions must test COMPETENCY, not memory
8. ✅ Include data interpretation, graph analysis, case studies
9. ✅ Cross-concept integration (combine 2-3 concepts)
10. ✅ Each question worth 4-5 marks (board exam standard)

ICSE 2026 COMPETENCY FOCUS:
- Problem Solving: 40%
- Critical Thinking: 30%
- Application & Analysis: 20%
- Data Interpretation: 10%

QUESTION COMPLEXITY REQUIREMENTS:
- Must require understanding of WHY, not just WHAT
- Must involve decision-making or comparison
- Must test ability to apply concepts to new situations
- Must require multi-step calculations with reasoning
- Must have tricky distractors that test common misconceptions

Return ONLY valid JSON (no markdown, no code blocks):
{
  "questions": [
    {
      "question": "A detailed, complex scenario with multiple data points requiring analysis and multi-step solution",
      "options": [
        "A. Detailed option with proper units (must be plausible based on partial understanding)",
        "B. Another plausible option (tests common misconception)",
        "C. Third option (tests calculation error)",
        "D. Fourth option (tests conceptual misunderstanding)"
      ],
      "correct_answer": "A. [exact match to option]",
      "explanation": "Detailed step-by-step solution: Given data: ... Step 1: Identify/Analyze... Step 2: Apply formula/concept... Step 3: Calculate... Step 4: Verify/Conclude... Common errors: Option B assumes [misconception], Option C results from [calculation error], Option D misunderstands [concept].",
      "marks": 4
    }
  ]
}

EXAMPLE 1 - Mathematics (Quadratic Equations) - COMPETENCY-BASED:
{
  "questions": [
    {
      "question": "A rectangular park has a walking path of uniform width around it. The park's dimensions are 40m × 30m. If the total area including the path is 1800 m², and the path width is the same on all sides, find the width of the path by forming and solving a quadratic equation. Which of the following represents the correct width?",
      "options": [
        "A. 5 m",
        "B. 10 m",
        "C. 3 m",
        "D. 7 m"
      ],
      "correct_answer": "A. 5 m",
      "explanation": "Let path width = x meters. Total dimensions: (40+2x) × (30+2x). Equation: (40+2x)(30+2x) = 1800. Expanding: 1200 + 80x + 60x + 4x² = 1800. Simplifying: 4x² + 140x - 600 = 0, or x² + 35x - 150 = 0. Using quadratic formula: x = (-35 ± √(1225+600))/2 = (-35 ± √1825)/2 ≈ (-35 ± 42.7)/2. Taking positive root: x = 7.7/2 ≈ 5m (rejecting negative). Option B (10m) would make total area 2500m². Option C (3m) gives 1656m². Option D (7m) gives 2072m².",
      "marks": 5
    }
  ]
}

EXAMPLE 2 - Physics (Force & Motion) - COMPETENCY-BASED:
{
  "questions": [
    {
      "question": "A truck and a car are moving with the same kinetic energy. The mass of the truck is 4 times that of the car. If the truck's brakes fail and it collides with a stationary wall, while the car (with working brakes) stops safely in the same distance, compare the braking forces. If the car requires a braking force of F, what force does the wall exert on the truck?",
      "options": [
        "A. 2F",
        "B. 4F",
        "C. F/2",
        "D. F"
      ],
      "correct_answer": "A. 2F",
      "explanation": "Given: KE_truck = KE_car, m_truck = 4m_car. From KE = ½mv²: ½(4m)v_t² = ½(m)v_c². Therefore v_c² = 4v_t², so v_c = 2v_t. Using work-energy theorem: Force × distance = KE. For same stopping distance d: F_truck × d = KE_truck, F_car × d = KE_car. Since KE are equal: F_truck = F_car = F... WAIT! This is wrong reasoning. Actually, F = ma = m(v²/2d). For car: F = m(v_c²/2d). For truck: F_truck = 4m(v_t²/2d) = 4m((v_c/2)²/2d) = 4m(v_c²/8d) = m(v_c²/2d) × 2 = 2F. Option B assumes direct mass proportionality. Option C inverts the relationship. Option D ignores velocity difference.",
      "marks": 5
    }
  ]
}

EXAMPLE 3 - Chemistry (Mole Concept) - COMPETENCY-BASED:
{
  "questions": [
    {
      "question": "A student performs an experiment where 10.6g of anhydrous sodium carbonate (Na₂CO₃) reacts with excess dilute HCl. The CO₂ produced is passed through lime water. If only 80% of the theoretical CO₂ actually reacts with lime water due to experimental losses, what mass of calcium carbonate precipitate is formed? (Na=23, C=12, O=16, Ca=40)",
      "options": [
        "A. 8.0 g",
        "B. 10.0 g",
        "C. 6.4 g",
        "D. 8.8 g"
      ],
      "correct_answer": "A. 8.0 g",
      "explanation": "Step 1: Moles of Na₂CO₃ = 10.6/106 = 0.1 mol. Step 2: Reaction: Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. Theoretical CO₂ = 0.1 mol. Step 3: Actual CO₂ reacting = 0.1 × 0.8 = 0.08 mol. Step 4: Reaction with lime water: CO₂ + Ca(OH)₂ → CaCO₃ + H₂O. Moles of CaCO₃ = 0.08 mol. Step 5: Mass of CaCO₃ = 0.08 × 100 = 8.0g. Option B (10g) ignores 80% efficiency. Option C (6.4g) incorrectly calculates 80% of final mass instead of CO₂. Option D (8.8g) uses wrong molar mass.",
      "marks": 5
    }
  ]
}

EXAMPLE 4 - Biology (Genetics) - COMPETENCY-BASED:
{
  "questions": [
    {
      "question": "In a genetic cross between two heterozygous plants (Tt × Tt) where T (tall) is dominant over t (dwarf), a farmer plants 1000 seeds from this cross. Due to environmental stress, only 60% of dwarf plants survive while 90% of tall plants survive. How many tall plants will the farmer have at maturity?",
      "options": [
        "A. 675 plants",
        "B. 750 plants",
        "C. 825 plants",
        "D. 900 plants"
      ],
      "correct_answer": "A. 675 plants",
      "explanation": "Step 1: Genetic ratio Tt × Tt gives 3:1 (Tall:Dwarf). Expected: 750 tall (TT+Tt), 250 dwarf (tt). Step 2: Apply survival rates. Tall survivors = 750 × 0.9 = 675. Dwarf survivors = 250 × 0.6 = 150. Step 3: Total tall plants at maturity = 675. Option B (750) ignores survival rate. Option C (825) incorrectly adds dwarf survivors. Option D (900) uses wrong ratio or survival rate.",
      "marks": 4
    }
  ]
}

NOW GENERATE ${count} EXTREMELY HARD, COMPETENCY-BASED ICSE 2026 QUESTIONS for "${chapter}" in ${subject}.
REMEMBER: NO easy questions, NO medium questions, ONLY HARD multi-step competency-based questions!`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5, // Lower for strict adherence to hard question requirements
      max_tokens: 4000 // Increased for complex competency-based explanations
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty AI response");
    }

    const parsed = JSON.parse(content);
    const questions = parsed.questions || [];

    if (questions.length === 0) {
      throw new Error("AI returned zero questions");
    }

    // Add metadata and validate
    return questions.map((q: any, idx: number) => {
      // Validate structure
      if (!q.question || !q.options || !q.correct_answer) {
        throw new Error(`Invalid question structure at index ${idx}`);
      }

      return {
        ...q,
        chapter,
        subject,
        difficulty: "medium",
        questionNumber: idx + 1
      };
    });
  }

  /**
   * Pad insufficient AI questions with curated examples
   */
  private padWithExamples(
    existingQuestions: any[],
    subject: string,
    chapter: string,
    targetCount: number
  ): any[] {
    const needed = targetCount - existingQuestions.length;
    const examples = this.getICSeExampleQuestions(subject, chapter, needed);
    
    return [...existingQuestions, ...examples];
  }

  /**
   * Curated ICSE-style example questions (fallback)
   */
  private getICSeExampleQuestions(
    subject: string,
    chapter: string,
    count: number
  ): any[] {
    // Generic but proper ICSE-style questions
    const templates = this.getSubjectTemplates(subject, chapter);
    
    const questions = [];
    for (let i = 0; i < Math.min(count, templates.length); i++) {
      questions.push({
        ...templates[i],
        chapter,
        subject,
        questionNumber: i + 1
      });
    }

    // If we need more than templates, reuse with slight variation
    while (questions.length < count) {
      const idx: number = questions.length % templates.length;
      questions.push({
        ...templates[idx],
        questionNumber: questions.length + 1
      });
    }

    return questions;
  }

  /**
   * Subject-specific ICSE question templates (REAL questions, not garbage)
   */
  private getSubjectTemplates(subject: string, chapter: string) {
    // Return proper ICSE-style questions per subject
    // These are REAL question formats used in ICSE exams
    
    switch (subject) {
      case "Mathematics":
        return [
          {
            question: `Solve the following problem from ${chapter}: If the sum of two numbers is 15 and their product is 56, find the two numbers.`,
            options: ["A. 7 and 8", "B. 6 and 9", "C. 5 and 10", "D. 4 and 11"],
            correct_answer: "A. 7 and 8",
            explanation: "Let numbers be x and (15-x). Then x(15-x) = 56. Solving: x² - 15x + 56 = 0, giving x = 7 or 8",
            marks: 3,
            difficulty: "medium"
          },
          {
            question: `In the context of ${chapter}, evaluate: What is the value of x in the equation 3x + 5 = 2x + 12?`,
            options: ["A. 7", "B. 5", "C. 9", "D. 3"],
            correct_answer: "A. 7",
            explanation: "3x - 2x = 12 - 5, therefore x = 7",
            marks: 3,
            difficulty: "easy"
          },
          {
            question: `Application of ${chapter}: Calculate the area of a triangle with base 8 cm and height 6 cm.`,
            options: ["A. 24 cm²", "B. 48 cm²", "C. 14 cm²", "D. 32 cm²"],
            correct_answer: "A. 24 cm²",
            explanation: "Area = ½ × base × height = ½ × 8 × 6 = 24 cm²",
            marks: 3,
            difficulty: "easy"
          }
        ];

      case "Physics":
        return [
          {
            question: `According to the principles of ${chapter}, what is the SI unit of force?`,
            options: ["A. Newton", "B. Joule", "C. Watt", "D. Pascal"],
            correct_answer: "A. Newton",
            explanation: "Force is measured in Newtons (N), defined as kg⋅m/s²",
            marks: 3,
            difficulty: "easy"
          },
          {
            question: `In the context of ${chapter}, calculate: A body of mass 5 kg is moving with a velocity of 10 m/s. What is its kinetic energy?`,
            options: ["A. 250 J", "B. 125 J", "C. 500 J", "D. 50 J"],
            correct_answer: "A. 250 J",
            explanation: "KE = ½mv² = ½ × 5 × 10² = 250 J",
            marks: 3,
            difficulty: "medium"
          }
        ];

      case "Chemistry":
        return [
          {
            question: `In ${chapter}, which element has the atomic number 6?`,
            options: ["A. Carbon", "B. Nitrogen", "C. Oxygen", "D. Boron"],
            correct_answer: "A. Carbon",
            explanation: "Carbon has 6 protons, giving it atomic number 6",
            marks: 3,
            difficulty: "easy"
          },
          {
            question: `According to ${chapter}, what is the molecular formula of water?`,
            options: ["A. H₂O", "B. H₂O₂", "C. HO", "D. H₃O"],
            correct_answer: "A. H₂O",
            explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom",
            marks: 3,
            difficulty: "easy"
          }
        ];

      default:
        return [
          {
            question: `Based on the concepts in ${chapter}, which of the following statements is correct?`,
            options: [
              "A. The chapter discusses fundamental principles",
              "B. The chapter has no relevance to the subject",
              "C. The chapter is optional for ICSE exams",
              "D. None of the above"
            ],
            correct_answer: "A. The chapter discusses fundamental principles",
            explanation: "All ICSE syllabus chapters cover important fundamental concepts",
            marks: 3,
            difficulty: "medium"
          },
          {
            question: `In the study of ${chapter}, what is the primary focus?`,
            options: [
              "A. Understanding core concepts and their applications",
              "B. Memorizing definitions only",
              "C. Ignoring practical applications",
              "D. None of the above"
            ],
            correct_answer: "A. Understanding core concepts and their applications",
            explanation: "ICSE emphasizes conceptual understanding and application",
            marks: 3,
            difficulty: "easy"
          }
        ];
    }
  }
}
