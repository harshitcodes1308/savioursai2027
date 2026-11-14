// "Are You Pre-Board Ready?" — free 15-question readiness check.
// Pulls 1-mark PYQ / competency MCQs from the Competency Test banks, weighted
// toward "blind spot" chapters students commonly leave for last. No API cost.
import type { PrecisionQuestion } from "./precision-config";
import { physicsQuestions } from "./precision-physics";
import { chemistryQuestions } from "./precision-chemistry";
import { mathsQuestions } from "./precision-maths";
import { PRECISION_BIOLOGY } from "./precision-biology";
import { computerQuestions } from "./precision-computers";

export const READY_TOTAL_QUESTIONS = 15;
export const READY_BLIND_SPOT_QUESTIONS = 10;
export const READY_TIME_LIMIT_SECONDS = 15 * 60;

export interface ReadySubject {
  id: string;
  name: string;
  ebookId: string;
  questions: PrecisionQuestion[];
  /** Chapters students commonly skip or leave for the last week. Must match `chapter` strings exactly. */
  blindSpots: string[];
}

export const READY_SUBJECTS: ReadySubject[] = [
  {
    id: "physics",
    name: "Physics",
    ebookId: "physics",
    questions: physicsQuestions,
    blindSpots: ["HOUSEHOLD CIRCUITS", "MODERN PHYSICS - RADIOACTIVITY", "MACHINES AND LEVERS", "HEAT AND CALORIMETRY", "ELECTROMAGNETISM", "SOUND"],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    ebookId: "chemistry",
    questions: chemistryQuestions,
    blindSpots: ["PRACTICAL CHEMISTRY", "ANALYTICAL CHEMISTRY", "ALLOYS", "STUDY OF COMPOUNDS - HYDROGEN", "METALLURGY", "MOLE CONCEPT - EMPIRICAL AND MOLECULAR FORMULA"],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    ebookId: "mathematics",
    questions: mathsQuestions,
    blindSpots: ["GST", "Shares and Dividends", "Banking", "Linear Inequations", "Probability", "Matrices"],
  },
  {
    id: "biology",
    name: "Biology",
    ebookId: "biology",
    questions: PRECISION_BIOLOGY,
    blindSpots: ["Population and Health", "Pollution and Waste Management", "Human Evolution", "The Endocrine System", "Absorption by Roots and Osmosis"],
  },
  {
    id: "computer-applications",
    name: "Computer Applications",
    ebookId: "computer-applications",
    questions: computerQuestions,
    blindSpots: ["Exception Handling", "CONSTRUCTORS", "LIBRARY CLASSES (WRAPPER CLASSES)", "ENCAPSULATION (ACCESS SPECIFIERS)", "Method Overloading", "NESTED FOR LOOPS"],
  },
];

export function getReadySubject(id: string): ReadySubject | undefined {
  return READY_SUBJECTS.find((s) => s.id === id);
}

// Questions that depend on a figure/graph we can't show are excluded.
const NEEDS_VISUAL = /figure|diagram|graph|shown|given below/i;

function isUsable(q: PrecisionQuestion): boolean {
  return (
    q.marks === 1 &&
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    q.correctAnswer >= 0 &&
    q.correctAnswer < q.options.length &&
    !NEEDS_VISUAL.test(q.question)
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Take `count` questions, spreading across chapters round-robin so one chapter can't dominate. */
function spreadPick(pool: PrecisionQuestion[], count: number): PrecisionQuestion[] {
  const byChapter = new Map<string, PrecisionQuestion[]>();
  for (const q of shuffle(pool)) {
    const list = byChapter.get(q.chapter) ?? [];
    list.push(q);
    byChapter.set(q.chapter, list);
  }
  const buckets = shuffle([...byChapter.values()]);
  const picked: PrecisionQuestion[] = [];
  while (picked.length < count && buckets.some((b) => b.length > 0)) {
    for (const b of buckets) {
      if (picked.length >= count) break;
      const q = b.shift();
      if (q) picked.push(q);
    }
  }
  return picked;
}

export interface ReadyQuestion extends PrecisionQuestion {
  isBlindSpot: boolean;
}

export function buildReadinessTest(subject: ReadySubject): ReadyQuestion[] {
  const usable = subject.questions.filter(isUsable);
  const blind = new Set(subject.blindSpots);
  const blindPool = usable.filter((q) => blind.has(q.chapter));
  const corePool = usable.filter((q) => !blind.has(q.chapter));

  const fromBlind = spreadPick(blindPool, READY_BLIND_SPOT_QUESTIONS);
  const fromCore = spreadPick(corePool, READY_TOTAL_QUESTIONS - fromBlind.length);
  let picked = [...fromBlind, ...fromCore];

  // Top up if either pool ran short.
  if (picked.length < READY_TOTAL_QUESTIONS) {
    const used = new Set(picked.map((q) => q.id));
    picked = picked.concat(spreadPick(usable.filter((q) => !used.has(q.id)), READY_TOTAL_QUESTIONS - picked.length));
  }

  return shuffle(picked).map((q) => ({ ...q, isBlindSpot: blind.has(q.chapter) }));
}

// ── Verdicts ────────────────────────────────────────────────────────────────

export type ReadyBand = "ready" | "almost" | "danger" | "notyet";

export interface ReadyVerdict {
  band: ReadyBand;
  label: string;
  headline: string;
  message: string;
  color: string;
}

export function getVerdict(score: number, total: number, blindSpotMisses: number): ReadyVerdict {
  const pct = total > 0 ? score / total : 0;
  const blindLine =
    blindSpotMisses > 0
      ? ` ${blindSpotMisses} of your misses came from chapters most students leave for the last week, and that's exactly where pre-board papers catch people out.`
      : "";

  if (pct >= 0.85) {
    return {
      band: "ready",
      label: "Pre-Board Ready",
      headline: "You're ahead of the pack.",
      message: `Strong fundamentals across the board.${blindLine} Now it's about staying sharp until December: full papers, timing and zero silly mistakes.`,
      color: "#22c55e",
    };
  }
  if (pct >= 0.6) {
    return {
      band: "almost",
      label: "Almost There",
      headline: "Close, but not pre-board safe yet.",
      message: `You know the core, but there are gaps an examiner will find.${blindLine} A focused plan for the next few weeks turns this into a top score.`,
      color: "#F5A623",
    };
  }
  if (pct >= 0.35) {
    return {
      band: "danger",
      label: "Danger Zone",
      headline: "Pre-boards would hurt right now.",
      message: `Several chapters aren't exam-ready yet.${blindLine} The good news: there's still time if you start a structured plan today, not next week.`,
      color: "#E5534B",
    };
  }
  return {
    band: "notyet",
    label: "Not Ready Yet",
    headline: "Time to switch gears.",
    message: `This subject needs a proper reset before pre-boards.${blindLine} Don't panic: a day-by-day plan from where you are now is the fastest way back.`,
    color: "#E5534B",
  };
}

// ── Local history (per-viewer convenience only) ─────────────────────────────

const HISTORY_KEY = "saviours-preboard-ready-v1";

export interface ReadyHistoryEntry {
  score: number;
  total: number;
  at: string;
}

/** Raw JSON string — a stable primitive snapshot for useSyncExternalStore. */
export function readReadyHistoryRaw(): string {
  try {
    if (typeof window === "undefined") return "{}";
    return localStorage.getItem(HISTORY_KEY) || "{}";
  } catch {
    return "{}";
  }
}

export function loadReadyHistory(): Record<string, ReadyHistoryEntry> {
  try {
    return JSON.parse(readReadyHistoryRaw());
  } catch {
    return {};
  }
}

export function saveReadyResult(subjectId: string, entry: ReadyHistoryEntry): void {
  try {
    const all = loadReadyHistory();
    all[subjectId] = entry;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — ignore */
  }
}
