// TypeScript types for 15-Day Sprint AI output

export interface DiagnosticQuestion {
  question: string;
  options?: string[];
  correct_answer: string;
  marks: number;
  chapter: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface DiagnosticTest {
  [subject: string]: {
    duration_minutes: number;
    total_marks: number;
    questions: DiagnosticQuestion[];
  };
}

export interface ChapterStrength {
  [chapter: string]: {
    percentage: number;
    time_allocation_minutes: number;
  };
}

export interface Test {
  duration_minutes: number;
  questions: DiagnosticQuestion[];
  total_marks: number;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface SmartNoteTopic {
  topic: string;
  formulas?: string[];
  definitions?: string[];
  diagrams_to_include?: string[];
  exam_tips?: string[];
}

export interface SubjectDayPlan {
  name: string;
  chapters: string[];
  time_minutes: number;
  youtube_queries: string[];
  daily_targets: string[];
  test: Test;
  flashcards: Flashcard[];
  smart_notes_topics: SmartNoteTopic[];
  rapid_revision: string[];
}

export interface DayPlan {
  day: number;
  subjects: SubjectDayPlan[];
}

export interface DailyTargetsSystem {
  progress_bar_example: string;
  streak_logic: string;
  delay_warning_example: string;
}

export interface ParentReport {
  hours_studied: string;
  tests_taken: string;
  completion_percent: string;
  strong_areas: string[];
  weak_areas: string[];
  predicted_score: string;
  on_track: boolean;
}

export interface Sprint15DayPlan {
  diagnostic_test: DiagnosticTest;
  chapter_strength_analysis: {
    weak: ChapterStrength;
    medium: ChapterStrength;
    strong: ChapterStrength;
  };
  predicted_score_range: string;
  daily_targets_system: DailyTargetsSystem;
  fifteen_day_plan: DayPlan[];
  parent_report_section: ParentReport;
}

export interface SprintInput {
  subjects: string[];
  daily_study_hours: number;
  exam_date: string;
  completed_days?: number;
  previous_test_results?: any;
  time_spent_today?: number;
}
