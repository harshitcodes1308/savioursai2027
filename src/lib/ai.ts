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

/**
 * Generate Flashcards (MCQs) for revision
 */
export async function generateFlashcards(params: {
    topics: string;
    subject?: string;
}) {
    const prompt = `You are an expert ICSE Class 10 question paper creator. Create 10 multiple-choice questions (MCQs) to test understanding of the following topics: "${params.topics}"${params.subject ? ` in Subject: ${params.subject}` : ""}.

CRITICAL REQUIREMENTS:
1. Questions MUST be from the official ICSE Class 10 syllabus ONLY
2. Questions should be exam-standard difficulty (similar to board exam questions)
3. Focus on conceptual understanding, not just memorization
4. Include a mix of easy (3), medium (5), and hard (2) difficulty questions
5. Cover different aspects: definitions, applications, problem-solving, and reasoning

ICSE CLASS 10 SYLLABUS COVERAGE:
- Mathematics: Algebra, Geometry, Trigonometry, Statistics, Mensuration
- Physics: Force & Motion, Light, Sound, Electricity, Magnetism, Heat
- Chemistry: Periodic Table, Chemical Bonding, Acids/Bases, Metals/Non-metals, Mole Concept
- Biology: Cell Biology, Plant & Human Systems, Genetics, Evolution
- Other subjects as per ICSE standards

Format as JSON:
{
  "flashcards": [
    {
      "id": 1,
      "question": "Question text (must be ICSE Class 10 level)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B", 
      "explanation": "Brief explanation with ICSE perspective"
    }
  ]
}

IMPORTANT: 
- 'correctAnswer' must be an EXACT string match to one of the 'options'
- Questions should be syllabus-accurate and exam-relevant
- Avoid college-level or advanced topics not in ICSE Class 10`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert ICSE Class 10 question paper creator with deep knowledge of the official ICSE syllabus. Your questions must be accurate, exam-standard, and syllabus-appropriate." },
            { role: "user", content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0].message.content || '{"flashcards": []}';
    console.log("Raw Flashcard Response:", rawContent);

    try {
        // Strip markdown if present
        const cleanContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanContent);
    } catch (e) {
        console.error("Failed to parse flashcards JSON:", e);
        // FALLBACK: Return mock data if AI fails
        return {
            flashcards: [
                {
                    id: 1,
                    question: "Newton's First Law is also known as:",
                    options: ["Law of Inertia", "Law of Momentum", "Law of Action-Reaction", "Law of Gravity"],
                    correctAnswer: "Law of Inertia",
                    explanation: "Newton's First Law states that an object remains at rest or in uniform motion unless acted upon by a force, defining Inertia."
                },
                {
                    id: 2,
                    question: "Which of the following is a scalar quantity?",
                    options: ["Velocity", "Force", "Speed", "Displacement"],
                    correctAnswer: "Speed",
                    explanation: "Speed has magnitude but no direction, making it a scalar quantity."
                },
                {
                    id: 3,
                    question: "What is the SI unit of Force?",
                    options: ["Joule", "Watt", "Newton", "Pascal"],
                    correctAnswer: "Newton",
                    explanation: "The Newton (N) is the derived unit of force in the International System of Units."
                },
                {
                    id: 4,
                    question: "The rate of change of momentum is directly proportional to:",
                    options: ["Mass", "Velocity", "Applied Force", "Time"],
                    correctAnswer: "Applied Force",
                    explanation: "According to Newton's Second Law, force equals the rate of change of momentum."
                },
                {
                    id: 5,
                    question: "Which color of light deviates the most through a prism?",
                    options: ["Red", "Green", "Yellow", "Violet"],
                    correctAnswer: "Violet",
                    explanation: "Violet light has the shortest wavelength and thus refracts (bends) the most."
                }
            ]
        };
    }
}
