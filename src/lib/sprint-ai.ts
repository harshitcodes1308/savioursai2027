import OpenAI from "openai";
import { ICSE_15DAY_SPRINT_PROMPT } from "./sprint-ai-prompt";
import type { Sprint15DayPlan, SprintInput } from "@/types/sprint";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generate15DaySprintPlan(
  input: SprintInput
): Promise<Sprint15DayPlan> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3, // Low temp for consistency
      messages: [
        {
          role: "system",
          content: ICSE_15DAY_SPRINT_PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 16000, // Large output needed for 15-day plan
    });

    const result = JSON.parse(
      completion.choices[0].message.content || "{}"
    ) as Sprint15DayPlan;

    // Validate that essential fields exist
    if (
      !result.fifteen_day_plan ||
      !result.diagnostic_test ||
      !result.predicted_score_range
    ) {
      throw new Error("Invalid AI response - missing required fields");
    }

    return result;
  } catch (error) {
    console.error("15-Day Sprint AI Error:", error);
    throw new Error("Failed to generate 15-day sprint plan");
  }
}

// Helper: Update sprint plan based on daily progress
export async function updateSprintPlan(
  currentPlan: Sprint15DayPlan,
  completedDays: number,
  testResults: any
): Promise<Sprint15DayPlan> {
  const input: SprintInput = {
    subjects: currentPlan.fifteen_day_plan[0].subjects.map((s) => s.name),
    daily_study_hours: 3, // Extract from current plan
    exam_date: "", // Extract from metadata
    completed_days: completedDays,
    previous_test_results: testResults,
  };

  return generate15DaySprintPlan(input);
}
