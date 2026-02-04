import type { SprintInput } from "@/types/sprint";

/**
 * Distributes chapters across 15 days ensuring all chapters are covered
 */
export function distributeChaptersAcross15Days(input: SprintInput): Record<number, Record<string, string[]>> {
  const { subjects, chapters = {} } = input;
  
  // Result: day number -> subject -> chapters for that day
  const dayChapterMap: Record<number, Record<string, string[]>> = {};
  
  // Initialize all 15 days
  for (let day = 1; day <= 15; day++) {
    dayChapterMap[day] = {};
  }
  
  // For each subject, distribute its chapters across 15 days
  subjects.forEach(subject => {
    const subjectChapters = chapters[subject] || [];
    const chapterCount = subjectChapters.length;
    
    if (chapterCount === 0) {
      console.warn(`[Chapter Distribution] No chapters for ${subject}`);
      return;
    }
    
    console.log(`[Chapter Distribution] Distributing ${chapterCount} chapters of ${subject} across 15 days`);
    
    // Strategy: Distribute chapters evenly across 15 days
    for (let day = 1; day <= 15; day++) {
      if (chapterCount >= 15) {
        // Many chapters (>=15): assign one unique chapter per day
        // For 16 chapters: day 1 gets chapter[0], day 2 gets chapter[1], etc.
        const chapterIndex = (day - 1) % chapterCount;
        dayChapterMap[day][subject] = [subjectChapters[chapterIndex]];
      } else {
        // Few chapters (<15): spread them out
        // For 9 chapters: each chapter gets ~1.67 days
        // Day 1-2 (ch0), Day 3-4 (ch1), Day 5-6 (ch2), etc.
        const daysPerChapter = 15 / chapterCount;
        const chapterIndex = Math.min(
          Math.floor((day - 1) / daysPerChapter),
          chapterCount - 1
        );
        dayChapterMap[day][subject] = [subjectChapters[chapterIndex]];
      }
      
      // LOG first few days for this subject
      if (day <= 3) {
        console.log(`  Day ${day}: ${dayChapterMap[day][subject][0]}`);
      }
    }
    
    console.log(`[Chapter Distribution] ${subject}: DONE`);
  });
  
  return dayChapterMap;
}

/**
 * Get chapters for a specific day
 */
export function getChaptersForDay(
  dayNumber: number,
  subject: string,
  dayChapterMap: Record<number, Record<string, string[]>>
): string[] {
  return dayChapterMap[dayNumber]?.[subject] || [];
}
