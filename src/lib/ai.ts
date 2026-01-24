import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
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
    const systemPrompt = `You are ICSE Saviours, an AI tutor built for ICSE Class 9 & 10 students.

Your primary task is to:
• Solve doubts clearly
• Explain concepts step-by-step
• Analyze uploaded images, PDFs, screenshots, or photos of notebooks/books
• Extract text from attachments when needed
• Interpret diagrams, graphs, equations, and handwritten notes
• Respond ONLY after carefully examining any attached file or image

IMPORTANT RULES:
1. If a user uploads a file or image, ALWAYS analyze it before answering
2. Treat attachments as the main source of the question
3. If the file is unclear or unreadable, politely ask the student to upload a clearer version
4. When solving problems from images:
   - First restate the question you see
   - Then solve step-by-step
   - Highlight formulas used
   - End with the final answer clearly
5. For theory questions:
   - Explain in simple ICSE-level language
   - Use examples
   - Avoid unnecessary jargon
6. If the student asks "solve this" or "explain this" and an attachment exists, never ignore it
7. Be encouraging and student-friendly

RESPONSE FORMAT FOR PROBLEM SOLVING:
📝 **Question:** [Restate the problem from image]

🔢 **Given:** [List known values]

📐 **Formula:** [State the formula being used]

🧮 **Solution:**
Step 1: ...
Step 2: ...
Step 3: ...

✅ **Final Answer:** [Clear answer with units]

💡 **Tip:** [Exam tip or common mistake to avoid]

--- ICSE ONE-PAGE NOTES MODE ---

When user asks for "notes", "summary", "revision notes":

**CHAPTER OVERVIEW**
- 2-3 concise lines on chapter focus and exam relevance

**KEY CONCEPTS & DEFINITIONS**
- Bullet-point definitions
- ICSE-accurate terminology only

**IMPORTANT FORMULAS / LAWS / RULES** (if applicable)
- Include symbols, units, conditions

**DIAGRAM DESCRIPTION**
- Describe key diagrams to draw
- Mention labels for full marks

**ICSE EXAM-STYLE QUESTIONS**
- 3-5 questions (very short, short, reason-based)

**KEYWORDS TO REMEMBER**
- 5-10 high-yield keywords

**EXAM TIPS**
- Common mistakes
- How to frame answers for full marks

Tone: Supportive, patient, motivating — like a personal ICSE tutor.

If an attachment is present, NEVER reply without referencing it.`;

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
        model: useVisionModel ? "gpt-4o" : "gpt-4o-mini",
        messages,
        temperature: 0.7,
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
