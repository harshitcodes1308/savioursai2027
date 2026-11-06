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
  { id: "biology", name: "Biology", icon: "◎", color: "#3ECF8E", pdfs: sidekick("biology"), description: "Sidekick Biology: concepts, diagrams and chapter-wise revision." },
  { id: "chemistry", name: "Chemistry", icon: "◉", color: "#00D4FF", pdfs: sidekick("chemistry"), description: "Sidekick Chemistry: reactions, equations, tests and key concepts." },
  { id: "computer-applications", name: "Computer Applications", icon: "◈", color: "#60A5FA", pdfs: sidekick("computer-applications"), description: "Sidekick Computer Applications: Java theory, programs and practice." },
  { id: "english-language", name: "English Language", icon: "◎", color: "#A78BFA", pdfs: sidekick("english-language"), description: "Sidekick English Language: grammar, composition and comprehension." },
  { id: "english-literature", name: "English Literature", icon: "◉", color: "#EC4899", pdfs: sidekick("english-literature"), description: "Sidekick English Literature: prose, poetry, drama and analysis." },
  { id: "geography", name: "Geography", icon: "◎", color: "#14B8A6", pdfs: sidekick("geography"), description: "Sidekick Geography: maps, climate, resources and topography." },
  { id: "history-civics", name: "History & Civics", icon: "◈", color: "#FB923C", pdfs: sidekick("history-civics"), description: "Sidekick History & Civics: events, dates, government and revision." },
  { id: "julius-caesar", name: "Julius Caesar", icon: "⇌", color: "#A78BFA", pdfs: sidekick("julius-caesar"), description: "Sidekick Julius Caesar: acts, characters, themes and key quotations." },
  { id: "mathematics", name: "Mathematics", icon: "◈", color: "#60A5FA", pdfs: sidekick("mathematics"), description: "Sidekick Mathematics: formulas, worked examples and practice sets." },
  { id: "physics", name: "Physics", icon: "◈", color: "#00D4FF", pdfs: sidekick("physics"), description: "Sidekick Physics: laws, numericals, units and exam-ready revision." },
];

export function getEbookBySlug(slug: string): EbookSubject | undefined {
  return EBOOK_SUBJECTS.find((subject) => subject.id === slug);
}
