import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface ChapterDifficulty {
    chapterId: string;
    chapterName: string;
    difficulty: number; // 1-5
    reasoning: string;
}

export interface DailyTopic {
    topicName: string;
    estimatedDays: number;
    subtopics?: string[];
}

/**
 * Decompose a chapter into daily topics following ICSE Class 10 syllabus
 */
export async function decomposeChapterIntoTopics(
    chapterName: string,
    subjectName: string,
    targetDays: number
): Promise<DailyTopic[]> {
    try {
        const prompt = `You are an ICSE Class 10 curriculum expert for ${subjectName}.

Decompose the chapter "${chapterName}" into ${targetDays} specific, actionable daily topics.

STRICT RULES:
1. Follow ICSE Class 10 syllabus ONLY - no extra content
2. Each topic must be completable in 1 day (${targetDays > 5 ? '2-3' : '3-4'} hours study)
3. Topic names must be SPECIFIC and ACTIONABLE (e.g., "Input Tax Credit & Set-offs", NOT "GST Basics")
4. Order topics by conceptual progression (foundation → advanced)
5. Balance theory + problem-solving
6. NO generic names like "Introduction" or "Revision"

Example for "GST" (4 days):
1. Input Tax Credit (ITC) & Set-offs
2. Composition Scheme & Reverse Charge Mechanism  
3. Taxable Value & GST Calculation Methods
4. Output Tax & Net GST Payable

Example for "Trigonometry" (5 days):
1. Trigonometric Ratios of Standard Angles (0°, 30°, 45°, 60°, 90°)
2. Trigonometric Ratios of Complementary Angles
3. Trigonometric Identities (sin²θ + cos²θ = 1 family)
4. Trigonometric Identities (1 + tan²θ = sec²θ family)
5. Application of Identities in Problem-Solving

Return ONLY a JSON array (no markdown):
[
  { "topicName": "...", "estimatedDays": 1 },
  { "topicName": "...", "estimatedDays": 1 },
  ...
]

Total topics: ${targetDays}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Standardized model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 1000,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);

        // Handle both array and object with array wrapper
        const topics: DailyTopic[] = Array.isArray(parsed) ? parsed : (parsed.topics || []);

        // Ensure we have exactly targetDays topics
        if (topics.length < targetDays) {
            const remaining = targetDays - topics.length;
            for (let i = 0; i < remaining; i++) {
                topics.push({
                    topicName: `${chapterName} - Practice & Problem Solving`,
                    estimatedDays: 1,
                });
            }
        }

        return topics.slice(0, targetDays);
    } catch (error) {
        console.error(`Error decomposing chapter ${chapterName}:`, error);

        // Fallback: divide chapter into generic daily topics
        return Array(targetDays).fill(null).map((_, index) => ({
            topicName: `${chapterName} - Part ${index + 1}`,
            estimatedDays: 1,
        }));
    }
}

/**
 * Predict difficulty for a chapter using AI
 */
export async function predictChapterDifficulty(
    chapterName: string,
    subjectName: string
): Promise<number> {
    try {
        const prompt = `You are an ICSE Class 10 education expert. Rate the difficulty of this chapter on a scale of 1-5:

Chapter: ${chapterName}
Subject: ${subjectName}

Consider:
- Conceptual complexity
- Typical student struggles
- Amount of content
- Prerequisite knowledge required
- Mathematical/analytical depth

Respond with ONLY a single number from 1 to 5:
1 = Very Easy
2 = Easy
3 = Medium
4 = Hard
5 = Very Hard`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Standardized model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 10,
        });

        const difficulty = parseInt(response.choices[0]?.message?.content?.trim() || "3");
        return Math.min(Math.max(difficulty, 1), 5); // Clamp to 1-5
    } catch (error) {
        console.error("Error predicting difficulty:", error);
        return 3; // Default to medium
    }
}

/**
 * Predict difficulties for multiple chapters in batch
 */
export async function predictMultipleChapterDifficulties(
    chapters: Array<{ id: string; name: string }>,
    subjectName: string
): Promise<ChapterDifficulty[]> {
    try {
        const chapterList = chapters.map((c, i) => `${i + 1}. ${c.name}`).join("\n");

        const prompt = `You are an ICSE Class 10 education expert. Rate the difficulty of each chapter on a scale of 1-5:

Subject: ${subjectName}
Chapters:
${chapterList}

For each chapter, provide:
1. Difficulty (1-5)
2. Brief reason

Format: chapter number|difficulty|reason

Example:
1|4|Complex mathematical concepts requiring strong algebra foundation
2|2|Simple definitions and basic concepts

Respond for all ${chapters.length} chapters:`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Standardized model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 500,
        });

        const content = response.choices[0]?.message?.content || "";
        const lines = content.trim().split("\n");

        return chapters.map((chapter, index) => {
            const line = lines[index];
            if (line) {
                const parts = line.split("|");
                const difficulty = parseInt(parts[1]) || 3;
                const reasoning = parts[2] || "Standard difficulty";

                return {
                    chapterId: chapter.id,
                    chapterName: chapter.name,
                    difficulty: Math.min(Math.max(difficulty, 1), 5),
                    reasoning,
                };
            }

            return {
                chapterId: chapter.id,
                chapterName: chapter.name,
                difficulty: 3,
                reasoning: "Could not determine difficulty",
            };
        });
    } catch (error) {
        console.error("Error batch predicting difficulties:", error);
        return chapters.map((c) => ({
            chapterId: c.id,
            chapterName: c.name,
            difficulty: 3,
            reasoning: "Error predicting difficulty",
        }));
    }
}

/**
 * Calculate smart study plan distribution
 */
export function calculateStudyDistribution(
    chapters: ChapterDifficulty[],
    startDate: Date,
    targetDate: Date,
    dailyHours: number
): Array<{ chapterId: string; days: number; hours: number }> {
    const totalDays = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * dailyHours;

    // Sort chapters by difficulty (hardest first - prioritize difficult chapters)
    const sortedChapters = [...chapters].sort((a, b) => b.difficulty - a.difficulty);

    // Calculate weighted distribution
    const totalWeight = sortedChapters.reduce((sum, c) => sum + c.difficulty, 0);

    return sortedChapters.map((chapter) => {
        const proportion = chapter.difficulty / totalWeight;
        const allocatedHours = totalHours * proportion;
        const allocatedDays = Math.ceil(allocatedHours / dailyHours);

        return {
            chapterId: chapter.chapterId,
            days: allocatedDays,
            hours: allocatedHours,
        };
    });
}

/**
 * Check if timeline is feasible
 */
export function checkTimelineFeasibility(
    chaptersCount: number,
    startDate: Date,
    targetDate: Date,
    dailyHours: number
): { feasible: boolean; warning?: string; recommendation?: string } {
    const totalDays = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const minDaysPerChapter = 2; // Minimum 2 days per chapter
    const recommendedDaysPerChapter = 4; // Recommended 4 days per chapter

    if (totalDays < chaptersCount * minDaysPerChapter) {
        return {
            feasible: false,
            warning: "⚠️ Timeline is too tight!",
            recommendation: `You need at least ${chaptersCount * minDaysPerChapter} days for ${chaptersCount} chapters. Consider extending your deadline or reducing chapters.`,
        };
    }

    if (totalDays < chaptersCount * recommendedDaysPerChapter) {
        return {
            feasible: true,
            warning: "⚠️ Deadline is challenging!",
            recommendation: `This schedule is aggressive. The plan is adjusted, but you'll need to study ${dailyHours} hours daily consistently. Consider ${chaptersCount * recommendedDaysPerChapter} days for comfortable preparation.`,
        };
    }

    return {
        feasible: true,
    };
}
