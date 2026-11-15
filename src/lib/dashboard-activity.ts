// Shared allowlist: only feature identifiers are sent, never URLs or page content.
export const DASHBOARD_FEATURES: Record<string, string> = {
  ebooks: "Sidekick Ebooks", "ai-assistant": "AI Assistant", planner: "Smart Planner",
  "study-flow": "Study Flow", "video-lectures": "Video Lectures", tests: "Practice Tests",
  notes: "Smart Notes", focus: "Focus Mode", "pre-board-90": "Pre-Board 60",
  "preboard-ready": "Pre-Board Ready", "cheat-sheets": "Cheat Sheets", chronoscroll: "ChronoScroll",
  "date-battle": "Date Battle", "numerical-mastery": "Numerical Mastery",
  "flip-the-question": "Flip the Question", "precision-practice": "Competency Practice",
  "guess-papers": "Guess Papers", "half-yearly": "Half Yearly Simulator", strategy: "Exam Strategy",
  "last-night-before": "Last Night Before", scholarship: "Scholarship Test", tracker: "Study Tracker",
  subjects: "Subjects", todo: "Monthly Mission", webinar: "Webinar", content: "Study Content",
};
export const ONLINE_WINDOW_MS = 2 * 60 * 1000;
export const PRESENCE_ACTION = "DASHBOARD_PRESENCE";
export const FEATURE_OPEN_ACTION = "DASHBOARD_FEATURE_OPEN";
