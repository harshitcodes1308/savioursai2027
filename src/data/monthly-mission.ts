/**
 * Monthly Mission — 12-Month ICSE Class 10 Board Prep Plan
 * Weekly format: each month → weeks → per-subject tasks + add-ons
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface WeekTask {
  id: string;
  subject: string;  // "" for general tasks (Dec, Jan, Feb, Mar)
  task: string;
}

export interface WeekPlan {
  id: string;       // stable key for localStorage: "w1", "w2", "w34", "every", etc.
  label: string;    // "Week 1", "Weeks 1–2", "Every Week", "For Every Exam"
  tasks: WeekTask[];
  addons: string[];
}

export interface MonthPlan {
  month: string;
  tagline: string;
  brief: string;
  weeks: WeekPlan[];
}

// ── Subject meta ─────────────────────────────────────────────────────────────

const META: Record<string, { icon: string; color: string; short: string }> = {
  'Maths':                { icon: '🔢', color: '#3B82F6', short: 'Maths'   },
  'Mathematics':          { icon: '🔢', color: '#3B82F6', short: 'Maths'   },
  'Physics':              { icon: '⚡', color: '#F59E0B', short: 'Physics' },
  'Chemistry':            { icon: '🧪', color: '#00D4FF', short: 'Chem'   },
  'Biology':              { icon: '🧬', color: '#22c55e', short: 'Bio'     },
  'History & Civics':     { icon: '🏛️', color: '#FB923C', short: 'History' },
  'History':              { icon: '🏛️', color: '#FB923C', short: 'History' },
  'Geography':            { icon: '🌍', color: '#14B8A6', short: 'Geo'     },
  'English Language':     { icon: '📝', color: '#A78BFA', short: 'English' },
  'English':              { icon: '📝', color: '#A78BFA', short: 'English' },
  'English Literature':   { icon: '📖', color: '#EC4899', short: 'Lit'     },
  'Literature':           { icon: '📖', color: '#EC4899', short: 'Lit'     },
  'Hindi':                { icon: '🪷', color: '#F472B6', short: 'Hindi'   },
  'Computer Applications':{ icon: '💻', color: '#F97316', short: 'CS'      },
  'Computer':             { icon: '💻', color: '#F97316', short: 'CS'      },
};

export function getSubjectMeta(subject: string) {
  return META[subject] ?? { icon: '◈', color: '#6B7280', short: subject };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function t(subject: string, task: string, idx: number, weekId: string): WeekTask {
  return { id: `${weekId}-t${idx}`, subject, task };
}

function tasks(weekId: string, entries: [string, string][]): WeekTask[] {
  return entries.map(([s, task], i) => t(s, task, i, weekId));
}

function week(id: string, label: string, ts: WeekTask[], addons: string[] = []): WeekPlan {
  return { id, label, tasks: ts, addons };
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const MONTHLY_MISSION: MonthPlan[] = [

  // ── MAY ──────────────────────────────────────────────────────────────────
  {
    month: 'May',
    tagline: 'Foundation + Habit Building',
    brief: 'The novelty is gone. Real work begins. Push deeper into every subject and build the daily study habit that will carry you through the year.',
    weeks: [
      week('w1', 'Week 1', tasks('w1', [
        ['Maths',            'GST basics + 10 sums'],
        ['Physics',          'Force (definitions + 5 numericals)'],
        ['Chemistry',        'Periodic Table (groups overview)'],
        ['Biology',          'Cell Division (concept + 2 diagrams)'],
        ['History & Civics', '1857 (causes)'],
        ['Geography',        'Climate (factors)'],
        ['English',          '1 Essay + 1 Letter'],
        ['Literature',       'Julius Caesar Act 1 Scene 1–2'],
        ['Computer',         'Basics + variables'],
      ]), ['Revise same topics (2 quick sessions)', 'PYQs: Maths (GST basic)', '1 light mixed test (Maths + Sci)']),

      week('w2', 'Week 2', tasks('w2', [
        ['Maths',            'GST mixed + Banking intro'],
        ['Physics',          'Force numericals + WEP intro'],
        ['Chemistry',        'Periodic trends (detailed)'],
        ['Biology',          'Cell Division PYQs'],
        ['History & Civics', '1857 complete + Nationalism intro'],
        ['Geography',        'Climate (monsoon)'],
        ['English',          'Grammar (tenses) + Essay'],
        ['Literature',       'Act 1 revision'],
        ['Computer',         'Data types + operators'],
      ]), ['Revise Week 1', '1 Maths test', 'PYQs (Bio/Geo)']),

      week('w3', 'Week 3', tasks('w3', [
        ['Maths',            'Banking (RD problems)'],
        ['Physics',          'Work Energy Power (numericals)'],
        ['Chemistry',        'Chemical Bonding intro'],
        ['Biology',          'Genetics (basics)'],
        ['History & Civics', 'Nationalism (events)'],
        ['Geography',        'Climate revision + map'],
        ['English',          'Precis + Letter'],
        ['Literature',       'Act 2 start'],
        ['Computer',         'If-else'],
      ]), ['Revise Week 2', 'Mixed Sci test', 'Start error notebook']),

      week('w4', 'Week 4', tasks('w4', [
        ['Maths',            'GST + Banking revision + 15 PYQs'],
        ['Physics',          'Force + WEP revision (10 numericals)'],
        ['Chemistry',        'Bonding basics + 10 PYQs'],
        ['Biology',          'Genetics diagrams + 5 PYQs'],
        ['History & Civics', '1857 + Nationalism revision'],
        ['Geography',        'Climate full revision + map'],
        ['English',          '1 full Language paper (timed)'],
        ['Literature',       'Act 1–2 revision'],
        ['Computer',         'Practice 6 programs'],
      ]), ['Mini mock (3 subjects)', 'Monthly review']),
    ],
  },

  // ── JUNE ─────────────────────────────────────────────────────────────────
  {
    month: 'June',
    tagline: 'Slow Burn (Vacation)',
    brief: 'Vacations are here. One focused hour a day in June is worth ten hours of panic in December. Consolidate, don\'t rush forward.',
    weeks: [
      week('w1', 'Week 1', tasks('w1', [
        ['Maths',            'Quadratic (basics + 8 sums)'],
        ['Physics',          'Machines (concepts)'],
        ['Chemistry',        'Acids & Bases (intro)'],
        ['Biology',          'Absorption by Roots'],
        ['History & Civics', 'Nationalism deeper'],
        ['Geography',        'Soil'],
        ['English',          'Essay + grammar'],
        ['Literature',       'Act 2 scenes'],
        ['Computer',         'Operators'],
      ]), ['Revise May W3–4', 'PYQs (Maths/Bio)', '1 test']),

      week('w2', 'Week 2', tasks('w2', [
        ['Maths',            'Quadratic word problems'],
        ['Physics',          'Machines numericals (8–10)'],
        ['Chemistry',        'pH + indicators'],
        ['Biology',          'Transpiration'],
        ['History & Civics', 'Gandhian Movement intro'],
        ['Geography',        'Natural Vegetation'],
        ['English',          'Letter + Precis'],
        ['Literature',       'Act 2 key scenes'],
        ['Computer',         'I/O programs'],
      ]), ['Revise W1', 'PYQs (Chem/Geo)', 'Physics test']),

      week('w3', 'Week 3', tasks('w3', [
        ['Maths',            'AP (intro + 6 sums)'],
        ['Physics',          'Revise Force + Machines (10 numericals)'],
        ['Chemistry',        'Mole Concept (intro)'],
        ['Biology',          'Plant Physiology revision (diagrams)'],
        ['History & Civics', 'Gandhian Movement (events)'],
        ['Geography',        'Soil + Vegetation revision'],
        ['English',          'Comprehension'],
        ['Literature',       'Act 3 start'],
        ['Computer',         'If-else practice'],
      ]), ['Mixed PYQs', 'Science test']),

      week('w4', 'Week 4', tasks('w4', [
        ['Maths',            'AP (word problems + 10 PYQs)'],
        ['Physics',          'Machines + WEP recap (mixed numericals)'],
        ['Chemistry',        'Mole (6 numericals)'],
        ['Biology',          'Absorption + Transpiration PYQs'],
        ['History & Civics', 'Nationalism + Gandhian revision'],
        ['Geography',        'Map (soil + veg)'],
        ['English',          '1 full paper'],
        ['Literature',       'Act 2–3 revision'],
        ['Computer',         '6 programs'],
      ]), ['Mini mock', 'Monthly review']),
    ],
  },

  // ── JULY ─────────────────────────────────────────────────────────────────
  {
    month: 'July',
    tagline: 'Serious Mode (~50% coverage)',
    brief: 'School is back and so is pressure. First unit tests or internal assessments are approaching. Treat every piece of work like it\'s the real board exam.',
    weeks: [
      week('w1', 'Week 1', tasks('w1', [
        ['Maths',            'Trigonometric Identities'],
        ['Physics',          'Refraction (plane)'],
        ['Chemistry',        'Electrolysis (intro)'],
        ['Biology',          'Circulatory System'],
        ['History & Civics', 'Gandhian Movement complete'],
        ['Geography',        'Water Resources'],
        ['English',          'Essay + grammar'],
        ['Literature',       'Act 3'],
        ['Computer',         'Loops (for/while)'],
      ]), ['PYQs (Maths/Phy)', '1 test']),

      week('w2', 'Week 2', tasks('w2', [
        ['Maths',            'Heights & Distances'],
        ['Physics',          'Refraction numericals'],
        ['Chemistry',        'Electrolysis reactions'],
        ['Biology',          'Excretory System'],
        ['History & Civics', 'Forward Bloc + INA'],
        ['Geography',        'Minerals'],
        ['English',          'Letter + Precis'],
        ['Literature',       'Act 4'],
        ['Computer',         'Loop programs'],
      ]), ['Revise W1', 'Chem/Geo PYQs', 'Physics test']),

      week('w3', 'Week 3', tasks('w3', [
        ['Maths',            'Trig PYQs (15)'],
        ['Physics',          'Light revision (10 numericals)'],
        ['Chemistry',        'Electrolysis PYQs'],
        ['Biology',          'Circulatory + Excretory revision'],
        ['History & Civics', '1857 → INA quick revision'],
        ['Geography',        'Map (water + minerals)'],
        ['English',          'Comprehension'],
        ['Literature',       'Act 5 start'],
        ['Computer',         'Arrays intro'],
      ]), ['Mixed test', 'Error notebook update']),

      week('w4', 'Week 4', tasks('w4', [
        ['Maths',            'Trig full revision'],
        ['Physics',          'Refraction mixed numericals'],
        ['Chemistry',        'Electrolysis recap'],
        ['Biology',          'Diagrams practice'],
        ['History & Civics', 'PYQs (national movement)'],
        ['Geography',        'Revision'],
        ['English',          'Full paper'],
        ['Literature',       'Act 3–5 revision'],
        ['Computer',         'Arrays basics practice'],
      ]), ['Mini mock', 'Monthly review']),
    ],
  },

  // ── AUGUST ───────────────────────────────────────────────────────────────
  {
    month: 'August',
    tagline: 'Build to ~65%',
    brief: 'By end of August, 65% of your syllabus should be complete. If you\'re behind, this is your correction month — no panic, but no excuses either.',
    weeks: [
      week('w1', 'Week 1', tasks('w1', [
        ['Maths',            'Mensuration (Cylinder/Cone basics)'],
        ['Physics',          'Lens (concepts)'],
        ['Chemistry',        'Metallurgy (intro)'],
        ['Biology',          'Nervous System'],
        ['History & Civics', 'Independence & Partition (intro)'],
        ['Geography',        'Agriculture (types)'],
        ['English',          'Essay + grammar'],
        ['Literature',       'Poetry 1'],
        ['Computer',         'Arrays'],
      ]), ['PYQs (Maths/Bio)', '1 test']),

      week('w2', 'Week 2', tasks('w2', [
        ['Maths',            'Mensuration numericals'],
        ['Physics',          'Lens numericals'],
        ['Chemistry',        'Metallurgy processes'],
        ['Biology',          'Endocrine System'],
        ['History & Civics', 'Independence events'],
        ['Geography',        'Agriculture (crops)'],
        ['English',          'Letter + Precis'],
        ['Literature',       'Poetry 2'],
        ['Computer',         'Strings intro'],
      ]), ['Revise W1', 'Chem/Geo PYQs', 'Physics test']),

      week('w3', 'Week 3', tasks('w3', [
        ['Maths',            'Mensuration PYQs'],
        ['Physics',          'Sound (intro)'],
        ['Chemistry',        'Metallurgy PYQs'],
        ['Biology',          'Nervous + Endocrine revision'],
        ['History & Civics', 'Full revision (movement)'],
        ['Geography',        'Map (agriculture)'],
        ['English',          'Comprehension'],
        ['Literature',       'Prose 1'],
        ['Computer',         'Strings practice'],
      ]), ['Mixed test']),

      week('w4', 'Week 4', tasks('w4', [
        ['Maths',            'Mensuration revision'],
        ['Physics',          'Lens + Sound numericals'],
        ['Chemistry',        'Metallurgy recap'],
        ['Biology',          'Diagrams + PYQs'],
        ['History & Civics', 'PYQs'],
        ['Geography',        'Revision'],
        ['English',          'Full paper'],
        ['Literature',       'Poetry revision'],
        ['Computer',         'Practice'],
      ]), ['2 mixed tests', 'Identify weak areas']),
    ],
  },

  // ── SEPTEMBER ────────────────────────────────────────────────────────────
  {
    month: 'September',
    tagline: 'Half-Yearly Mode (60–65% syllabus)',
    brief: 'Half-yearly exams are here — your first full dress rehearsal before boards. Your performance this month tells you exactly where you stand.',
    weeks: [
      week('w1', 'Week 1', tasks('w1', [
        ['Maths',            'Revise GST, Banking, Quadratic (20 PYQs)'],
        ['Physics',          'Revise Force, Machines, Light (15 numericals)'],
        ['Chemistry',        'Revise Bonding, Acids (15 PYQs)'],
        ['Biology',          'Revise Cell → Excretory (diagrams + 15 PYQs)'],
        ['History & Civics', '1857 → INA revision'],
        ['Geography',        'Climate → Agriculture revision + maps'],
        ['English',          '1 full paper + grammar revision'],
        ['Literature',       'Acts 1–5 key scenes'],
        ['Computer',         'Basics → Loops revision'],
      ]), ['2 subject tests (timed)']),

      week('w2', 'Week 2', tasks('w2', [
        ['Maths',            'AP + Trig revision (15 PYQs)'],
        ['Physics',          'Refraction + Lens numericals'],
        ['Chemistry',        'Electrolysis + Mole revision'],
        ['Biology',          'Nervous + Endocrine'],
        ['History & Civics', 'Full movement timeline revision'],
        ['Geography',        'Minerals + Water'],
        ['English',          'Letter + Precis + Comprehension'],
        ['Literature',       'Poetry analysis'],
        ['Computer',         'Arrays + Strings'],
      ]), ['2 timed papers (Maths + Sci)']),

      week('w3', 'Week 3', tasks('w3', [
        ['', 'All subjects: Target weak chapters (from test results)'],
        ['', '1 full paper each: Maths, Science, English'],
      ]), ['Deep error analysis — write every mistake']),

      week('w4', 'Week 4 — Exam Week', tasks('w4', [
        ['', 'Light revision only (formulas + diagrams)'],
        ['', '1–2 practice sections per subject per day'],
        ['', 'Maintain sleep schedule + routine'],
      ]), []),
    ],
  },

  // ── OCTOBER ──────────────────────────────────────────────────────────────
  {
    month: 'October',
    tagline: 'Recovery + Continue (~80% target)',
    brief: 'Half-yearlies are done. You know your weaknesses now — those dropped marks aren\'t bad luck, they\'re information. Attack those gaps while pushing into the remaining syllabus.',
    weeks: [
      week('w1', 'Week 1', tasks('w1', [
        ['Maths',            'Similarity (intro)'],
        ['Physics',          'Sound numericals'],
        ['Chemistry',        'Analytical Chemistry'],
        ['Biology',          'Reproductive System'],
        ['History & Civics', 'WW1'],
        ['Geography',        'Manufacturing'],
        ['English',          'Essay + grammar'],
        ['Literature',       'Prose 2'],
        ['Computer',         'Classes & Objects intro'],
      ]), ['Analyze half-yearly mistakes']),

      week('w2', 'Week 2', tasks('w2', [
        ['Maths',            'Similarity numericals'],
        ['Physics',          'Sound PYQs'],
        ['Chemistry',        'Analytical PYQs'],
        ['Biology',          'Reproductive diagrams'],
        ['History & Civics', 'Rise of Dictatorships'],
        ['Geography',        'Transport'],
        ['English',          'Letter + Precis'],
        ['Literature',       'Poetry'],
        ['Computer',         'Classes programs'],
      ]), ['PYQs + 1 test']),

      week('w3', 'Week 3', tasks('w3', [
        ['Maths',            'Circles (intro)'],
        ['Physics',          'Electricity (intro)'],
        ['Chemistry',        'Organic Chemistry (intro)'],
        ['Biology',          'Population'],
        ['History & Civics', 'WW2'],
        ['Geography',        'Revision (Manufacturing + Transport)'],
        ['English',          'Comprehension'],
        ['Literature',       'Prose'],
        ['Computer',         'Revision'],
      ]), ['Mixed test']),

      week('w4', 'Week 4', tasks('w4', [
        ['Maths',            'Circles numericals'],
        ['Physics',          'Electricity numericals'],
        ['Chemistry',        'Organic basics'],
        ['Biology',          'Full revision (new chapters)'],
        ['History & Civics', 'UN'],
        ['Geography',        'Map work'],
        ['English',          'Full paper'],
        ['Literature',       'Revision'],
        ['Computer',         'Practice'],
      ]), ['Mini mock']),
    ],
  },

  // ── NOVEMBER ─────────────────────────────────────────────────────────────
  {
    month: 'November',
    tagline: 'Finish Syllabus (100%)',
    brief: '100% syllabus must be done by November 30th. No exceptions. The student who finishes coverage in November has the full advantage in revision months.',
    weeks: [
      week('w12', 'Weeks 1–2', tasks('w12', [
        ['Maths',            'Remaining topics (Loci + Coordinate Geometry)'],
        ['Physics',          'Electricity — complete'],
        ['Chemistry',        'Organic Chemistry — complete'],
        ['Biology',          'Full revision of all chapters'],
        ['History & Civics', 'Remaining History + Civics portions'],
        ['Geography',        'Remaining Geography portions'],
        ['English',          '1 full paper per week (2 total)'],
        ['Literature',       'Complete all remaining chapters'],
        ['Computer',         'Complete remaining Java topics'],
      ]), []),

      week('w34', 'Weeks 3–4', tasks('w34', [
        ['', 'Full syllabus revision — ALL subjects'],
        ['', '1 full paper per subject'],
        ['', 'Error notebook review'],
        ['', 'PYQ sets (all subjects)'],
      ]), ['Error notebook update', 'Chapter-wise weakness list']),
    ],
  },

  // ── DECEMBER ─────────────────────────────────────────────────────────────
  {
    month: 'December',
    tagline: 'Sharpen the Sword',
    brief: 'Syllabus is done. Mock exams, error analysis, tight revision cycles. This month separates consistent students from last-minute ones.',
    weeks: [
      week('every', 'Every Week', tasks('every', [
        ['', '3 full papers (alternate subjects)'],
        ['', 'Analyze each paper — write every mistake'],
        ['', 'Redo all wrong questions'],
        ['', 'Revise weak chapters (formulas + diagrams)'],
      ]), []),
    ],
  },

  // ── JANUARY ──────────────────────────────────────────────────────────────
  {
    month: 'January',
    tagline: 'The Final Push — Pre-Boards',
    brief: 'Preliminary exams are here. This is your last structured feedback before boards. Every prelim mark tells you something important. Listen to it.',
    weeks: [
      week('weekly', 'Weekly Plan', tasks('weekly', [
        ['', 'Give school pre-boards seriously — full exam conditions'],
        ['', 'After each exam: list 5 mistakes immediately'],
        ['', 'Re-practice that chapter on the same day'],
        ['', '2 extra practice papers/week (beyond school schedule)'],
      ]), []),
    ],
  },

  // ── FEBRUARY ─────────────────────────────────────────────────────────────
  {
    month: 'February',
    tagline: 'Board Ready — Light + Sharp',
    brief: 'You\'re ready. This month is not about covering anything new. Entering each exam calm, sharp, and prepared. Routine and rest are as important as revision now.',
    weeks: [
      week('every', 'Every Week', tasks('every', [
        ['Maths',    'Revise formulas daily (20 min morning drill)'],
        ['Physics',  'Formula sheet scan daily (5 min) + 5 numericals'],
        ['Biology',  'Diagrams — 1 system per day from memory'],
        ['Chemistry','Key reactions revision'],
        ['',         '2 papers per subject per week'],
        ['',         'Light English practice (grammar + composition)'],
      ]), []),
    ],
  },

  // ── MARCH ────────────────────────────────────────────────────────────────
  {
    month: 'March',
    tagline: 'Your Moment — Execution',
    brief: 'Exams have begun. Everything you needed to learn, you\'ve learned. Show up fully for each paper, one at a time.',
    weeks: [
      week('night', 'Night Before Every Exam', tasks('night', [
        ['', 'Revise formulas + key PYQs only'],
        ['', 'Read chapter summaries — no new topics'],
        ['', 'Prepare exam kit (pens, ID, admit card)'],
        ['', 'Sleep by 10 PM — rest is preparation'],
      ]), []),

      week('morning', 'Morning of Every Exam', tasks('morning', [
        ['', 'Light breakfast + hydrate'],
        ['', 'Skim formula sheet — 10 minutes max'],
        ['', 'Reach exam centre 30 minutes early'],
        ['', 'No discussion with classmates before the exam'],
      ]), []),

      week('during', 'During Every Exam', tasks('during', [
        ['', 'Read all questions first (5 min)'],
        ['', 'Attempt known questions first'],
        ['', 'Write structured answers — intro, body, conclusion'],
        ['', 'Draw diagrams neatly with labels and arrows'],
        ['', 'Double-check all calculations'],
      ]), []),

      week('after', 'After Every Exam', tasks('after', [
        ['', 'Close the book — don\'t discuss answers'],
        ['', 'Move focus entirely to the next subject'],
        ['', 'Rest for 1 hour before starting next revision'],
      ]), []),
    ],
  },
];

// ── Utils ─────────────────────────────────────────────────────────────────────

export function getCurrentMonthIndex(): number {
  const names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const current = names[new Date().getMonth()];
  const idx = MONTHLY_MISSION.findIndex(m => m.month === current);
  return idx >= 0 ? idx : 0;
}

export function getMonthTaskCounts(monthIdx: number, checked: Record<string, boolean>) {
  const month = MONTHLY_MISSION[monthIdx];
  let total = 0, done = 0;
  for (const w of month.weeks) {
    for (const t of w.tasks) {
      total++;
      if (checked[`${monthIdx}:${w.id}:${t.id}`]) done++;
    }
    for (let i = 0; i < w.addons.length; i++) {
      total++;
      if (checked[`${monthIdx}:${w.id}:a${i}`]) done++;
    }
  }
  return { total, done };
}
