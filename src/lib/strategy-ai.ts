import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy", // Fallback to avoid crash on init, checked later
});

export interface StrategyInput {
    subjects: string[];
    strengths: string[];
    weaknesses: string[];
    goals: {
        examName: string;
        targetScore: string;
        examDate: string;
    };
    schedule: {
        schoolHours: string;
        tuitionHours: string;
        selfStudyHours: string;
        wakeUpTime: string;
        sleepTime: string;
    };
    mode: "SURVIVAL" | "BALANCED" | "TOPPER";
}

export async function generateStrategy(input: StrategyInput): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY is missing. Strategy generation will fail.");
        throw new Error("OpenAI API key is configured. Please add it to your environment variables.");
    }

    const systemPrompt = `You are a strict but encouraging academic mentor for an ICSE Class 10 student. 
Your goal is to create a realistic, personalized, and sustainable study strategy based on the student's profile.

**Tone & Style:**
- **Mentor-like:** Authoritative yet supportive.
- **No Fluff:** structured, actionable instructions.
- **ICSE Specific:** Use relevant terms (Boards, Top 5, Internal Assessment, etc.).
- **No Emojis:** Keep it professional and clean.
- **Structured:** Use clear formatting with Markdown headings.

**Strategy Modes:**
- **SURVIVAL:** Focus on passing/average marks. High-yield topics only. Panic mode management.
- **BALANCED:** Healthy mix of study and rest. maintain consistency.
- **TOPPER:** Intense, detail-oriented, aiming for 95%+. Optimization and margin of error reduction.

**Output Structure:**
# Your Personal Battle Plan: [Mode Name] Protocol

## 1. Reality Check
- Brief analysis of their situation (time left, current strengths/weaknesses).
- Honest assessment of the goal feasibility.

## 2. Daily Routine (The Blueprint)
- A specific daily timetable accounting for their school/tuition hours.
- Explicit slots for deep work (subjects from weakness list) and revision (strengths).
- Include realistic breaks.

## 3. Subject-Specific Tactics
- **[Weakness Subject]:** How to tackle it (e.g., specific resources, approach).
- **[Strength Subject]:** Maintenance mode to ensure it stays strong without wasting time.

## 4. The Rules of Engagement
- 3-5 non-negotiable rules for this student (e.g., "Phone in another room," "No new topics after 9 PM").

## 5. Contingency Plan
- What to do if they miss a day (Bounce back protocol).`;

    const userPrompt = `
    Student Profile:
    - **Subjects:** ${input.subjects.join(", ")}
    - **Strengths:** ${input.strengths.join(", ")}
    - **Weaknesses:** ${input.weaknesses.join(", ")}
    
    Goals:
    - **Target:** ${input.goals.examName} (${input.goals.targetScore}) by ${input.goals.examDate}
    
    Schedule:
    - **School:** ${input.schedule.schoolHours}
    - **Tuition:** ${input.schedule.tuitionHours}
    - **Self Study:** ${input.schedule.selfStudyHours}
    - **Sleep:** ${input.schedule.sleepTime} to ${input.schedule.wakeUpTime}
    
    **Requested Mode:** ${input.mode}
    
    Generate the strategy now.
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Using a capable model for complex reasoning
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("AI returned empty response.");
        }
        return content;
    } catch (error) {
        console.error("Error generating strategy:", error);
        throw new Error("Failed to generate strategy. Please try again later.");
    }
}
