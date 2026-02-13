// TYQ (This Year's Questions) - Subject Configuration

export interface TYQSubject {
  id: string;
  name: string;
  icon: string;
  examDuration: number; // minutes
  papers: number;
  color: string;
}

export const TYQ_SUBJECTS: TYQSubject[] = [
  { id: "mathematics", name: "Mathematics", icon: "🔢", examDuration: 180, papers: 2, color: "#3B82F6" },
  { id: "physics", name: "Physics", icon: "⚡", examDuration: 150, papers: 2, color: "#F59E0B" },
  { id: "chemistry", name: "Chemistry", icon: "🧪", examDuration: 150, papers: 2, color: "#10B981" },
  { id: "biology", name: "Biology", icon: "🧬", examDuration: 150, papers: 2, color: "#EC4899" },
  { id: "english-language", name: "English Language", icon: "📝", examDuration: 150, papers: 2, color: "#8B5CF6" },
  { id: "english-literature", name: "English Literature", icon: "📖", examDuration: 150, papers: 2, color: "#6366F1" },
  { id: "history-civics", name: "History & Civics", icon: "🏛️", examDuration: 150, papers: 2, color: "#EF4444" },
  { id: "geography", name: "Geography", icon: "🌍", examDuration: 150, papers: 2, color: "#14B8A6" },
  { id: "computer-applications", name: "Computer Applications", icon: "💻", examDuration: 150, papers: 2, color: "#F97316" },
];

export const READING_TIME_MINUTES = 15;

export function getSubjectById(id: string): TYQSubject | undefined {
  return TYQ_SUBJECTS.find(s => s.id === id);
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
