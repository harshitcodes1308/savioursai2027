import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ask a question to the AI assistant
 */
export async function askAI(
    question: string,
    context?: {
        subject?: string;
        topic?: string;
        conversation?: Array<{ role: "user" | "assistant"; content: string }>;
    }
) {
    const systemPrompt = `You are **ICSE Saviours AI**, the smartest academic assistant for ICSE Class 10 students.

CRITICAL: UNDERSTAND THE DIFFERENCE BETWEEN TWO TYPES OF REQUESTS:

TYPE 1: EXPLANATION REQUESTS (Student wants to LEARN/UNDERSTAND)
Keywords: "explain", "what is", "how does", "help me understand", "I have doubt in", "can you teach", "clarify"
Response: Provide a DETAILED EXPLANATION first, then suggest videos as supplementary material

TYPE 2: VIDEO-ONLY REQUESTS (Student ONLY wants videos)
Keywords: "suggest video", "give me video", "show me video", "find video", "oneshot", "videos on"
Response: Just say you'll find videos, NO explanation needed

EXAMPLES TO LEARN FROM:

❌ WRONG:
User: "I'm having doubt in periodic properties can you explain it"
You: "I'll find videos for you!" [Shows only videos]
Why wrong: User asked to EXPLAIN, you should explain first!

✅ CORRECT:
User: "I'm having doubt in periodic properties can you explain it"
You: "Let me explain periodic properties!

Periodic properties are characteristics of elements that show predictable patterns when arranged in the periodic table:

1. **Atomic Size**: Decreases across a period (left to right), increases down a group
2. **Metallic Character**: Decreases across period, increases down group
3. **Electronegativity**: Increases across period, decreases down group
4. **Ionization Energy**: Energy needed to remove an electron

These patterns help us predict element behavior!

Here are some helpful videos for visual learning:"
[Then shows videos]

✅ CORRECT:
User: "suggest oneshot video on periodic table"
You: "I'll find comprehensive oneshot videos on the periodic table for you!"
[Shows videos only - no explanation needed]

✅ CORRECT:
User: "give me videos for chemical bonding 24 hours"
You: "I'll find quick revision videos on chemical bonding perfect for last-minute prep!"
[Shows videos only]

YOU COVER ALL ICSE CLASS 10 TOPICS:
Mathematics, Physics, Chemistry, Biology, History & Civics, Geography, English, Computer Applications

NEVER REJECT VALID ICSE TOPICS:
All standard ICSE topics are valid. Only reject: Calculus, Quantum Physics, College-level content

${context?.subject ? `Current Subject: ${context.subject}` : ""}
${context?.topic ? `Current Topic: ${context.topic}` : ""}

BE EXTREMELY SMART. READ THE USER'S INTENT CAREFULLY.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...(context?.conversation || []),
        { role: "user", content: question },
    ];

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
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
- Subjects: ${params.subjects.join(", ")}
- Duration: ${params.startDate.toDateString()} to ${params.targetDate.toDateString()}
- Daily study time: ${params.dailyHours} hours
${params.weakTopics ? `- Weak topics to focus on: ${params.weakTopics.join(", ")}` : ""}

Provide a week-by-week breakdown with specific topics to cover each day. Format as JSON with this structure:
{
  "weeks": [
    {
      "number": 1,
      "days": [
        {
          "day": "Monday",
          "tasks": [
            { "subject": "Mathematics", "topic": "Algebra", "duration": 60 }
          ]
        }
      ]
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert study planner for ICSE students." },
            { role: "user", content: prompt },
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
}

/**
 * Summarize content/topic
 */
export async function summarizeContent(content: string, topic?: string) {
    const prompt = `Summarize the following ${topic ? `content about ${topic}` : "content"} into key points for ICSE students:

${content}

Provide:
1. Main concepts (3-5 bullet points)
2. Important formulas/definitions
3. Quick revision tips`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert at creating concise study summaries." },
            { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 400,
    });

    return completion.choices[0].message.content || "";
}

/**
 * Generate practice questions
 */
export async function generateQuestions(params: {
    subject: string;
    topic: string;
    count: number;
    difficulty?: "easy" | "medium" | "hard";
}) {
    const prompt = `Generate ${params.count} ${params.difficulty || "medium"} difficulty multiple choice questions for ICSE ${params.subject} on the topic: ${params.topic}.

Format as JSON:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "B",
      "explanation": "Brief explanation"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert ICSE question paper creator." },
            { role: "user", content: prompt },
        ],
        temperature: 0.6,
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || '{"questions": []}');
}
