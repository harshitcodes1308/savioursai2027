export interface EbookPdf { label: string; pdfPath: string; }

export interface EbookSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  pdfs: EbookPdf[];
  description: string;
}

const sidekick = (id: string): EbookPdf[] => [{ label: "Sidekick E-book", pdfPath: `/ebooks/${id}.pdf` }];

export const EBOOK_SUBJECTS: EbookSubject[] = [
  { id: "biology", name: "Biology", icon: "book", color: "#00D4FF", pdfs: sidekick("biology"), description: "Concepts, diagrams and chapter-wise revision." },
  { id: "chemistry", name: "Chemistry", icon: "book", color: "#00D4FF", pdfs: sidekick("chemistry"), description: "Reactions, equations, tests and key concepts." },
  { id: "computer-applications", name: "Computer Applications", icon: "book", color: "#00D4FF", pdfs: sidekick("computer-applications"), description: "Java theory, programs and exam-focused practice." },
  { id: "english-language", name: "English Language", icon: "book", color: "#00D4FF", pdfs: sidekick("english-language"), description: "Grammar, composition and comprehension." },
  { id: "english-literature", name: "English Literature", icon: "book", color: "#00D4FF", pdfs: sidekick("english-literature"), description: "Prose, poetry, drama and literary analysis." },
  { id: "geography", name: "Geography", icon: "book", color: "#00D4FF", pdfs: sidekick("geography"), description: "Maps, climate, resources and topography." },
  { id: "history-civics", name: "History & Civics", icon: "book", color: "#00D4FF", pdfs: sidekick("history-civics"), description: "Events, dates, government and revision." },
  { id: "julius-caesar", name: "Julius Caesar", icon: "book", color: "#00D4FF", pdfs: sidekick("julius-caesar"), description: "Acts, characters, themes and key quotations." },
  { id: "mathematics", name: "Mathematics", icon: "book", color: "#00D4FF", pdfs: sidekick("mathematics"), description: "Formulas, worked examples and practice sets." },
  { id: "physics", name: "Physics", icon: "book", color: "#00D4FF", pdfs: sidekick("physics"), description: "Laws, numericals, units and exam-ready revision." },
];

export function getEbookBySlug(slug: string): EbookSubject | undefined {
  return EBOOK_SUBJECTS.find((subject) => subject.id === slug);
}
