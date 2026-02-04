import OpenAI from "openai";

// Initialize OpenAI client
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ask a question to the AI assistant with file upload support
 */
export async function askAI(
    question: string,
    context?: {
        subject?: string;
        topic?: string;
        conversation?: Array<{ role: "user" | "assistant"; content: string }>;
        file?: {
            type: 'image' | 'pdf';
            data: string; // base64 or data URL
            name: string;
        };
    }
) {
    const systemPrompt = `You are an ICSE Class 9-10 AI tutor. Be exceptionally smart, helpful, and exam-focused.

**CORE RULES:**
1. Provide detailed, ICSE-accurate explanations using proper terminology
2. Analyze uploaded images/PDFs - restate questions, solve step-by-step
3. NEVER suggest fake video titles - system handles video recommendations automatically
4. NEVER give lazy responses like "explained above" without actual explanation

**RESPONSE STRUCTURE:**

For concept questions:
- **Definition** (ICSE terminology)
- **Key Points** (4-6 bullets: formulas, rules, memory tricks)
- **Common Mistakes** (what students get wrong)
- End with: "Check recommended videos below! 📺"

For problems:
- Restate question
- **Step-by-step solution** (numbered, show formulas in **bold**)
- **Final Answer** (with units)
- **Concept recap** (2-3 key takeaways)

**MINIMUM STANDARDS:**
- 150+ words explanation for all concept questions
- Complete step-by-step for all problems
- Use **bold** for formulas/keywords, bullets for lists
- Encouraging tone ("Great question!", "You're on track!")

**CRITICAL - VIDEO HANDLING:**
When students ask for videos (e.g., "suggest videos for periodic table"):
1. Explain the concept thoroughly FIRST (150+ words)
2. Add key points (4-6 bullets)
3. THEN say: "Check recommended videos below! 📺"

Never write fake titles like "Periodic Table Song" or "Chemistry One Shot" - real videos load automatically.

**FILE UPLOADS:**
If image/PDF attached: analyze it first, restate the visible question, then solve completely.

Be smart, thorough, and ICSE exam-ready. Think like a top tutor.`;

    // Handle file uploads (images or PDFs)
    const useVisionModel = context?.file?.type === 'image';

    // Build messages array
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...(context?.conversation || []),
    ];

    // Add user message with file content
    if (useVisionModel && context?.file) {
        // Ensure data URL format
        const imageUrl = context.file.data.startsWith('data:')
            ? context.file.data
            : `data:image/jpeg;base64,${context.file.data}`;

        // Vision API message format
        messages.push({
            role: "user",
            content: [
                {
                    type: "text",
                    text: question || "Please analyze this image and explain what you see. If it contains a question, solve it step-by-step."
                },
                {
                    type: "image_url",
                    image_url: {
                        url: imageUrl,
                        detail: "high" // High detail for better text recognition
                    }
                }
            ]
        });
    } else {
        // Regular text message
        messages.push({ role: "user", content: question });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Standardized model (supports vision natively)
        messages,
        temperature: 0.5, // Optimized for speed (was 0.7)
        max_tokens: useVisionModel ? 1500 : 800, // More tokens for image analysis
    });

    return completion.choices[0].message.content || "I couldn't generate a response.";
}

/**
 * Generate a study plan based on parameters
 */
export async function generateStudyPlan(params: {
    subjects: string[];
    startDate: Date;
    targetDate: Date;
    dailyHours: number;
    weakTopics?: string[];
}) {
    const prompt = `Create a detailed study plan for an ICSE student with the following:
- Subjects: ${params.subjects.join(', ')}
- Start Date: ${params.startDate.toDateString()}
- Target Date: ${params.targetDate.toDateString()}
- Daily Study Hours: ${params.dailyHours}
${params.weakTopics ? `- Weak Topics: ${params.weakTopics.join(', ')}` : ''}

Generate a week-by-week breakdown with:
1. Daily subject rotation
2. Topic coverage
3. Revision sessions
4. Mock test schedule
5. Rest days

Format as markdown with clear structure.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return completion.choices[0].message.content || "Could not generate plan.";
}

/**
 * Summarize content
 */
export async function summarizeContent(content: string, context?: string) {
    const prompt = `Summarize this ${context || 'content'} for an ICSE Class 10 student in concise bullet points:\n\n${content}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
    });

    return completion.choices[0].message.content || "Could not summarize.";
}

/**
 * Generate MCQ questions
 */
export async function generateQuestions(params: {
    subject: string;
    topic: string;
    count?: number;
    difficulty?: string;
}) {
    const { subject, topic, count = 5, difficulty = "medium" } = params;
    
    const prompt = `Generate ${count} ICSE-style multiple choice questions on "${topic}" for Subject: ${subject} (Class 10).
Difficulty Level: ${difficulty}.

For each question provide:
- Question text
- 4 options (A, B, C, D)
- Correct answer (0-3 index)
- Brief explanation

Format as a valid JSON array of objects with keys: question, options (array of strings), correctAnswer (number), explanation.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content || "[]";
    try {
        const parsed = JSON.parse(content);
        // Handle cases where the AI might wrap the array in a key like "questions"
        if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
        if (Array.isArray(parsed)) return parsed;
        return [];
    } catch (e) {
        console.error("Failed to parse AI questions", e);
        return [];
    }
}

/**
 * Generate Flashcards
 */
export async function generateFlashcards(params: {
    topics: string;
    subject?: string;
    count?: number;
}) {
    const { topics, subject = "General", count = 5 } = params;

    const prompt = `Generate ${count} concise flashcards for the topic(s): "${topics}" in Subject: ${subject} (ICSE Class 10).
    
    For each flashcard provide:
    - Front (Question or Term)
    - Back (Answer or Definition)
    
    Format as a valid JSON array of objects with keys: "front", "back".`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content || "[]";
    try {
        const parsed = JSON.parse(content);
        if (parsed.flashcards && Array.isArray(parsed.flashcards)) return parsed.flashcards;
        if (Array.isArray(parsed)) return parsed;
        return [];
    } catch (e) {
        console.error("Failed to parse AI flashcards", e);
        return [];
    }
}
