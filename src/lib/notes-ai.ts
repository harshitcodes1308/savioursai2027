import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Refine raw notes with AI formatting and structure
 */
export async function refineNotes(params: {
    rawContent: string;
    subject?: string;
    topic?: string;
}): Promise<string> {
    const { rawContent, subject, topic } = params;

    const prompt = `You are an ICSE Class 10 study notes expert.

Refine these student notes into well-formatted, exam-ready notes:

Raw Notes:
${rawContent}

Subject: ${subject || 'General'}
Topic: ${topic || 'Various'}

REQUIREMENTS:
1. Use markdown formatting (# ## ### ** * -)
2. Add proper headings and subheadings
3. Use bullet points and numbered lists
4. Bold important terms, formulas, and definitions
5. Add emojis for visual markers:
   - 📌 for key points
   - 💡 for tips and tricks
   - ⚠️ for important warnings
   - ✅ for examples
   - 🔍 for definitions
6. Fix grammar and spelling errors
7. Structure logically:
   - Definitions/Overview
   - Key Concepts
   - Formulas (if applicable)
   - Examples
   - Exam Tips
8. Keep it concise and exam-focused
9. Add "## 📝 Key Takeaways" section at end with 3-5 bullet points

Return ONLY the refined markdown notes. No extra commentary.`;

    if (!process.env.OPENAI_API_KEY) {
        console.warn("⚠️ OPENAI_API_KEY is missing. Skipping AI refinement.");
        return rawContent;
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert ICSE Class 10 notes formatter. Return only formatted markdown."
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1200, // Optimized from 2000
        });

        return completion.choices[0].message.content || rawContent;
    } catch (error) {
        console.error("Note refinement error:", error);
        return rawContent; // Fallback to original
    }
}

/**
 * Generate flashcards from refined notes
 */
export async function generateFlashcards(
    content: string
): Promise<{ question: string; answer: string; difficulty: string }[]> {
    const prompt = `Extract 5-10 key concepts from these notes and create flashcards for studying:

${content}

REQUIREMENTS:
- Focus on important facts, definitions, formulas, and concepts
- Mix difficulty levels (easy, medium, hard)
- Questions should be clear and specific
- Answers should be concise but complete
- Good for exam preparation

Format as JSON array:
[
  {
    "question": "What is the SI unit of force?",
    "answer": "Newton (N)",
    "difficulty": "easy"
  },
  {
    "question": "State Newton's Second Law of Motion.",
    "answer": "Force = Mass × Acceleration (F = ma)",
    "difficulty": "medium"
  }
]

Return ONLY valid JSON array. No markdown, no extra text.`;

    if (!process.env.OPENAI_API_KEY) {
        console.warn("⚠️ OPENAI_API_KEY is missing. Skipping flashcard generation.");
        return [];
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an ICSE flashcard expert. Return only valid JSON arrays."
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
            max_tokens: 1000, // Optimized from 1500
        });

        const responseContent = completion.choices[0].message.content || "[]";
        const cleaned = responseContent
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();

        const flashcards = JSON.parse(cleaned);
        return flashcards;
    } catch (error) {
        console.error("Flashcard generation error:", error);
        return []; // Return empty array on error
    }
}
