import fs from 'fs';
import path from 'path';

// Read ICSE syllabus content
let ICSE_SYLLABUS = "";
try {
  const syllabusPath = path.join(process.cwd(), 'docs', 'syllabus.md');
  ICSE_SYLLABUS = fs.readFileSync(syllabusPath, 'utf-8');
} catch (error) {
  console.error('[AI Prompt] Could not load syllabus.md:', error);
}

// ICSE Sprint Prompt with syllabus integration
export const ICSE_15DAY_SPRINT_PROMPT_MINIMAL = `You are an expert ICSE Class 10 exam preparation AI.

ICSE SYLLABUS REFERENCE:
${ICSE_SYLLABUS}

---

Generate a 15-day sprint plan in STRICT JSON format using the syllabus above.

CRITICAL RULES:
1. Use ONLY topics from the syllabus above for the selected subjects
2. EVERY question MUST have EXACTLY 4 options (A, B, C, D)
3. Questions should be ICSE board-level difficulty (hard/application-based)
4. Generate diagnostic test with 2-3 questions PER CHAPTER from syllabus
5. YouTube queries MUST end with " Clarify Knowledge"

INPUT FORMAT:
{
  "subjects": ["Mathematics", "Physics"],
  "chapters": {
    "Mathematics": ["Quadratic equations", "Linear inequations", "Similarity", ...],
    "Physics": ["Force & Motion", "Light", "Sound", ...]
  },
  "daily_study_hours": 3
}

CHAPTER DISTRIBUTION STRATEGY:
- Divide all chapters evenly across days
- Day 1: First chapters from each subject
- Day 2-3: Next chapters
- ...
- Day 15: Final chapters
- NO chapter repetition until all are covered
- Example: 15 Math chapters → 1 chapter per day
- Example: 5 English chapters → 3 days per chapter

OUTPUT FORMAT (strict JSON, no markdown):
{
  "diagnostic_test": {
    "Mathematics": {
      "questions": [
        {
          "question": "Solve the quadratic equation x² - 5x + 6 = 0 using factorization method.",
          "options": [
            "A. x = 2 or x = 3",
            "B. x = 1 or x = 6", 
            "C. x = -2 or x = -3",
            "D. x = 0 or x = 5"
          ],
          "correct_answer": "A. x = 2 or x = 3",
          "marks": 2,
          "chapter": "Quadratic equations"
        }
      ]
    }
  },
  "predicted_score_range": "75%",
  "chapter_strength_analysis": {"weak": {}, "medium": {}, "strong": {}},
  "daily_targets_system": {
    "progress_bar_example": "Day 1: 0% → 7%",
    "streak_logic": "Track consecutive days",
    "delay_warning_example": "Behind schedule"
  },
  "fifteen_day_plan": [
    {
      "day": 1,
      "subjects": [{
        "name": "Mathematics",
        "chapters": ["Quadratic equations"],
        "time_minutes": 90,
        "youtube_queries": [
          "Quadratic Equations ICSE Clarify Knowledge",
          "Factorization Method Clarify Knowledge"
        ],
        "daily_targets": [
          "Solve 10 quadratic equations",
          "Master factorization method",
          "Practice word problems"
        ],
        "test": {
          "questions": [
            {
              "question": "Find the roots of x² + 7x + 12 = 0",
              "options": [
                "A. x = -3 or x = -4",
                "B. x = 3 or x = 4",
                "C. x = -2 or x = -6",
                "D. x = 2 or x = 6"
              ],
              "correct_answer": "A. x = -3 or x = -4",
              "marks": 2,
              "chapter": "Quadratic equations"
            },
            {
              "question": "Solve using quadratic formula: 2x² - 5x + 2 = 0",
              "options": ["A. x = 2 or 0.5", "B. x = 1 or 2", "C. x = -2 or -0.5", "D. x = 3 or 1"],
              "correct_answer": "A. x = 2 or 0.5",
              "marks": 2,
              "chapter": "Quadratic equations"
            },
            {
              "question": "Find discriminant of x² - 4x + 4 = 0",
              "options": ["A. 0", "B. 4", "C. 16", "D. -16"],
              "correct_answer": "A. 0",
              "marks": 2,
              "chapter": "Quadratic equations"
            },
            {
              "question": "A quadratic equation has roots 3 and -2. Find the equation.",
              "options": ["A. x² - x - 6 = 0", "B. x² + x - 6 = 0", "C. x² - x + 6 = 0", "D. x² + x + 6 = 0"],
              "correct_answer": "A. x² - x - 6 = 0",
              "marks": 2,
              "chapter": "Quadratic equations"
            },
            {
              "question": "If α and β are roots of x² + 3x + 2 = 0, find α + β",
              "options": ["A. -3", "B. 3", "C. -2", "D. 2"],
              "correct_answer": "A. -3",
              "marks": 2,
              "chapter": "Quadratic equations"
            }
          ]
        },
        "flashcards": [
          {"front": "Quadratic formula", "back": "x = (-b ± √(b²-4ac)) / 2a"}
        ],
        "smart_notes_topics": [{
          "topic": "Discriminant (b² - 4ac)",
          "formulas": ["b² - 4ac > 0: two distinct real roots"],
          "exam_tips": ["Always check discriminant first"]
        }],
        "rapid_revision": ["Formula sheet", "Common factorization patterns"]
      }]
    }
  ],
  "parent_report_section": {
    "hours_studied": "0h",
    "tests_taken": "0",
    "completion_percent": "0%",
    "strong_areas": [],
    "weak_areas": [],
    "predicted_score": "75%",
    "on_track": true
  }
}

MANDATORY REQUIREMENTS:
- Generate 8-10 HARD ICSE questions PER SUBJECT in diagnostic test
- **CRITICAL: DAILY tests MUST have EXACTLY 5 questions PER SUBJECT**
- Example: 2 subjects → 10 daily test questions total (5 + 5)
- Example: 3 subjects → 15 daily test questions total (5 + 5 + 5)
- Use EXACT chapter names from syllabus above
- ALL youtube_queries MUST end with " Clarify Knowledge"
- Generate only 5 days initially (will be extended to 15)
- EVERY question needs 4 options array
- Questions should test understanding, not just recall
- Cover multiple chapters from each subject
- **Each day should focus on DIFFERENT chapters (progressive coverage)**

Return ONLY valid JSON. No explanations.`;


