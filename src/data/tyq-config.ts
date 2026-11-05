// TYQ (This Year's Questions) - Subject Configuration
import type { AppIconName } from "@/components/ui/AppIcon";

export interface TYQSubject {
  id: string;
  name: string;
  icon: AppIconName;
  examDuration: number; // minutes
  papers: number;
  color: string;
}

export const TYQ_SUBJECTS: TYQSubject[] = [
  { id: "mathematics", name: "Mathematics", icon: "calculator", examDuration: 180, papers: 2, color: "#00D4FF" },
  { id: "physics", name: "Physics", icon: "zap", examDuration: 150, papers: 2, color: "#00D4FF" },
  { id: "chemistry", name: "Chemistry", icon: "flask", examDuration: 150, papers: 2, color: "#00D4FF" },
  { id: "biology", name: "Biology", icon: "brain", examDuration: 150, papers: 2, color: "#00D4FF" },
  { id: "english-language", name: "English Language", icon: "square-pen", examDuration: 150, papers: 2, color: "#00D4FF" },
  { id: "english-literature", name: "English Literature", icon: "book", examDuration: 150, papers: 2, color: "#00D4FF" },
  { id: "history-civics", name: "History & Civics", icon: "history", examDuration: 150, papers: 2, color: "#00D4FF" },
  { id: "geography", name: "Geography", icon: "globe", examDuration: 150, papers: 2, color: "#00D4FF" },
  { id: "computer-applications", name: "Computer Applications", icon: "code", examDuration: 150, papers: 2, color: "#00D4FF" },
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
