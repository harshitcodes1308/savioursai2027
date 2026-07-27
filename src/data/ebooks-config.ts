export interface EbookPdf {
  label: string;
  pdfPath: string;
}

export interface EbookSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  pdfs: EbookPdf[];
  description: string;
}

export const EBOOK_PUBLISHER = "Clarify Knowledge";

export const EBOOK_SUBJECTS: EbookSubject[] = [
  {
    id: "physics",
    name: "Physics",
    icon: "◈",
    color: "#F59E0B",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/physics.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/physics-qb.pdf" },
    ],
    description: "Mechanics, electricity, light, sound & modern physics — complete ICSE coverage.",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "◉",
    color: "#10B981",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/chemistry.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/chemistry-qb.pdf" },
    ],
    description: "Periodic table, acids & bases, organic chemistry — every reaction explained.",
  },
  {
    id: "biology",
    name: "Biology",
    icon: "◎",
    color: "#EC4899",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/biology.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/biology-qb.pdf" },
    ],
    description: "Cell biology, genetics, human physiology — diagrams & key concepts.",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "◈",
    color: "#3B82F6",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/mathematics.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/mathematics-qb.pdf" },
    ],
    description: "Algebra, geometry, trigonometry, statistics — solved examples & formulae.",
  },
  {
    id: "english-language",
    name: "English Language",
    icon: "◎",
    color: "#00D4FF",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/english-language.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/english-language-qb.pdf" },
    ],
    description: "Grammar, composition, comprehension — master the language paper.",
  },
  {
    id: "english-literature",
    name: "English Literature",
    icon: "◉",
    color: "#6366F1",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/english-literature.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/english-literature-qb.pdf" },
    ],
    description: "Poetry, prose, drama — character sketches, themes & critical analysis.",
  },
  {
    id: "history-civics",
    name: "History & Civics",
    icon: "◈",
    color: "#EF4444",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/history-civics.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/history-civics-qb.pdf" },
    ],
    description: "Indian freedom struggle, world wars, Indian constitution — dates & events.",
  },
  {
    id: "geography",
    name: "Geography",
    icon: "◎",
    color: "#14B8A6",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/geography.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/geography-qb.pdf" },
    ],
    description: "Map work, climate, soils, natural vegetation — complete topography guide.",
  },
  {
    id: "computer-applications",
    name: "Computer Applications",
    icon: "◉",
    color: "#F97316",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/computer-applications.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/computer-applications-qb.pdf" },
    ],
    description: "Java programming, data structures, boolean logic — programs & theory.",
  },
  {
    id: "julius-caesar",
    name: "Julius Caesar",
    icon: "⇌",
    color: "#A855F7",
    pdfs: [
      { label: "Textbook", pdfPath: "/ebooks/julius-caesar.pdf" },
      { label: "Question Bank", pdfPath: "/ebooks/julius-caesar-qb.pdf" },
    ],
    description: "Shakespeare's Julius Caesar — act-wise summary, character analysis & key quotes.",
  },
];

export function getEbookBySlug(slug: string): EbookSubject | undefined {
  return EBOOK_SUBJECTS.find((s) => s.id === slug);
}
