import { STUDY_FLOW_DATA, SUBJECT_META, type SubjectKey, type StudyFlowChapter } from "@/data/studyFlowData";

const SUBJECT_NAME_MAP: Record<string, SubjectKey> = {
  physics: "physics",
  chemistry: "chemistry",
  mathematics: "mathematics",
  maths: "mathematics",
  math: "mathematics",
  biology: "biology",
  history: "history",
  "history & civics": "history",
  "history and civics": "history",
  civics: "history",
  computer: "computer",
  "computer applications": "computer",
  computers: "computer",
};

export interface MatchedStudyFlow {
  subjectKey: SubjectKey | null;
  chapter: StudyFlowChapter | null;
  directUrl: string;
  subjectMeta: { label: string; icon: string; color: string } | null;
}

/**
 * Match a Pre-Board 90 subject and topicRef to the exact Study Flow chapter
 */
export function matchStudyFlowChapter(subject: string, topicRef: string): MatchedStudyFlow {
  const normSubject = subject.trim().toLowerCase();
  const subjectKey = SUBJECT_NAME_MAP[normSubject] || null;

  if (!subjectKey || !STUDY_FLOW_DATA[subjectKey]) {
    return {
      subjectKey: null,
      chapter: null,
      directUrl: "/dashboard/study-flow",
      subjectMeta: null,
    };
  }

  const chapters = STUDY_FLOW_DATA[subjectKey].chapters;
  const meta = SUBJECT_META[subjectKey] || null;

  // Tokenize and clean the topicRef
  const rawTokens = topicRef
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !["and", "the", "for", "with", "from", "part"].includes(w));

  let bestChapter: StudyFlowChapter | null = null;
  let highestScore = 0;

  for (const ch of chapters) {
    const chTokens = ch.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    let score = 0;
    for (const t of rawTokens) {
      const stem = t.slice(0, 5);
      if (chTokens.includes(t)) {
        score += 5;
      } else if (chTokens.some((ct) => ct.startsWith(stem) || t.startsWith(ct.slice(0, 5)))) {
        score += 3;
      } else if (chTokens.some((ct) => ct.includes(t) || t.includes(ct))) {
        score += 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestChapter = ch;
    }
  }

  // If no good match, default to first chapter of the subject
  const resolvedChapter = bestChapter || chapters[0] || null;

  return {
    subjectKey,
    chapter: resolvedChapter,
    directUrl: resolvedChapter
      ? `/dashboard/study-flow/${subjectKey}/${resolvedChapter.id}`
      : `/dashboard/study-flow/${subjectKey}`,
    subjectMeta: meta,
  };
}
