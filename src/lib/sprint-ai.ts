import OpenAI from "openai";
import { ICSE_15DAY_SPRINT_PROMPT_MINIMAL } from "./sprint-ai-prompt-minimal";
import { generateFallbackSprint } from "./sprint-fallback";
import type { Sprint15DayPlan, SprintInput } from "@/types/sprint";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout
});

export async function generate15DaySprintPlan(
  input: SprintInput
): Promise<Sprint15DayPlan> {
  console.log("[SPRINT] Generating sprint for subjects:", input.subjects);
  console.log("[SPRINT] Chapters:", Object.keys(input.chapters || {}).map(s => `${s}: ${(input.chapters?.[s] || []).length} chapters`));
  
  // Try AI first
  try {
    console.log("[AI] Attempting AI generation with MINIMAL prompt...");
    
    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1, // Very low for consistency
      messages: [
        {
          role: "system",
          content: ICSE_15DAY_SPRINT_PROMPT_MINIMAL,
        },
        {
          role: "user",
          content: JSON.stringify(input, null, 2),
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 16000, // Max allowed by gpt-4o-mini is 16384
    });
    
    const elapsed = Date.now() - startTime;
    console.log("[AI] Got response in", elapsed, "ms");

    const rawContent = completion.choices[0].message.content || "{}";
    
    console.log("[AI] Response received, length:", rawContent.length);
    console.log("[AI] First 300 chars:", rawContent.substring(0, 300));
    
    let result: Sprint15DayPlan;
    try {
      result = JSON.parse(rawContent) as Sprint15DayPlan;
    } catch (parseError) {
      console.error("[AI] JSON parse failed:", parseError);
      throw new Error("AI returned invalid JSON");
    }

    // Validate essential fields
    const hasValidFields = result.fifteen_day_plan && 
                          result.diagnostic_test && 
                          result.predicted_score_range;
    
    if (!hasValidFields) {
      console.error("[AI] Missing required fields:", {
        has_plan: !!result.fifteen_day_plan,
        has_diagnostic: !!result.diagnostic_test,
        has_score: !!result.predicted_score_range
      });
      throw new Error("AI response missing required fields");
    }

    // Validate questions exist
    const questionCount = Object.values(result.diagnostic_test).reduce(
      (total: number, subj: any) => total + (subj?.questions?.length || 0), 
      0
    );
    
    console.log("[AI] SUCCESS! Generated", questionCount, "diagnostic questions");
    
    if (questionCount === 0) {
      console.warn("[AI] No questions generated, using fallback");
      throw new Error("No questions in diagnostic test");
    }

    // CRITICAL: Validate daily test questions
    if (result.fifteen_day_plan && result.fifteen_day_plan.length > 0) {
      const day1 = result.fifteen_day_plan[0];
      console.log("[AI] Day 1 subjects:", day1.subjects?.length);
      
      day1.subjects?.forEach((subj: any) => {
        const qCount = subj.test?.questions?.length || 0;
        console.log(`[AI] ${subj.name}: ${qCount} daily test questions`);
        
        if (qCount < 5) {
          console.error(`[AI] ERROR: ${subj.name} only has ${qCount} questions, expected 5!`);
          throw new Error(`Insufficient questions for ${subj.name}`);
        }
      });
    }

    // Extend to 15 days if AI only generated 5
    if (result.fifteen_day_plan && result.fifteen_day_plan.length < 15) {
      console.log("[AI] Extending from", result.fifteen_day_plan.length, "days to 15 days");
      const dayCount = result.fifteen_day_plan.length;
      
      for (let i = dayCount; i < 15; i++) {
        // Repeat the pattern from earlier days
        const templateDay = result.fifteen_day_plan[i % dayCount];
        result.fifteen_day_plan.push({
          ...templateDay,
          day: i + 1
        });
      }
      console.log("[AI] Extended to", result.fifteen_day_plan.length, "days");
      
      
      console.log("[AI] Redistributing chapters across 15 days (INLINED LOGIC)...");
      
      // INLINED DISTRIBUTION LOGIC TO PREVENT IMPORT ISSUES
      const dayChapterMap: Record<number, Record<string, string[]>> = {};
      
      // Initialize days
      for (let day = 1; day <= 15; day++) {
        dayChapterMap[day] = {};
      }
      
      
      // Distribute for each subject
      input.subjects.forEach(subject => {
        let subjectChapters = input.chapters?.[subject] || [];
        
        // FAILSAFE: If no chapters provided/found, generate synthetic ones to GUARANTEE variation
        if (subjectChapters.length === 0) {
          console.warn(`[AI-Distribution] No chapters found for ${subject}. Generating defaults to ensure updates.`);
          subjectChapters = Array.from({ length: 15 }, (_, i) => `${subject} Chapter ${i + 1}`);
        }
        
        const chapterCount = subjectChapters.length;
        console.log(`[AI-Distribution] ${subject}: ${chapterCount} chapters used for distribution`);
        
        for (let day = 1; day <= 15; day++) {
          if (chapterCount >= 15) {
            // Cycle through chapters
            const chapterIndex = (day - 1) % chapterCount;
            dayChapterMap[day][subject] = [subjectChapters[chapterIndex]];
          } else if (chapterCount > 0) {
             // Spread chapters
             const daysPerChapter = 15 / chapterCount;
             const chapterIndex = Math.min(
               Math.floor((day - 1) / daysPerChapter),
               chapterCount - 1
             );
             dayChapterMap[day][subject] = [subjectChapters[chapterIndex]];
          }
        }
      });

      console.log("[AI] Chapter map keys generated:", Object.keys(dayChapterMap[1] || {}));
      
      // Import synthetic generator once
      const { generateSyntheticQuestion } = await import("./question-templates");

      // Update each day with its assigned chapters
      result.fifteen_day_plan.forEach((day: any, dayIdx: number) => {
        const dayNumber = dayIdx + 1;
        
        day.subjects?.forEach((subject: any) => {
          const assignedChapters = dayChapterMap[dayNumber]?.[subject.name] || [];
          
          // Force update the chapters
          if (assignedChapters.length > 0) {
            subject.chapters = assignedChapters;
            subject.youtube_queries = assignedChapters.map((ch: string) => `${ch} ICSE Clarify Knowledge`);
            
            // Update test questions to reference the new chapters
            if (subject.test?.questions) {
              subject.test.questions.forEach((q: any, idx: number) => {
                const chapterForQ = assignedChapters[idx % assignedChapters.length];
                // Replace with context-aware synthetic question instead of bad rewrite
                const newQ = generateSyntheticQuestion(subject.name, chapterForQ, idx);
                
                q.chapter = chapterForQ;
                q.question = newQ.question;
                q.options = newQ.options;
                q.correct_answer = newQ.correct_answer;
              });
            }
          }
        });
      });
      
      console.log("[AI] Chapter redistribution complete!");
      console.log("[AI] Day 1 chapters:", 
        result.fifteen_day_plan[0].subjects?.map((s: any) => `${s.name}: [${s.chapters.join(", ")}]`).join(" | ")
      );
      console.log("[AI] Day 2 chapters:", 
        result.fifteen_day_plan[1].subjects?.map((s: any) => `${s.name}: [${s.chapters.join(", ")}]`).join(" | ")
      );
      console.log("[AI] Day 5 chapters:", 
        result.fifteen_day_plan[4].subjects?.map((s: any) => `${s.name}: [${s.chapters.join(", ")}]`).join(" | ")
      );
    }

    return result;
    
  } catch (aiError) {
    console.error("[AI] Generation failed:", aiError);
    console.log("[FALLBACK] Using fallback generator...");
    
    const fallbackResult = generateFallbackSprint(input);
    console.log("[FALLBACK] Generated successfully with", 
      Object.values(fallbackResult.diagnostic_test).reduce(
        (t: number, s: any) => t + (s?.questions?.length || 0), 0
      ), 
      "questions"
    );
    
    return fallbackResult;
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
