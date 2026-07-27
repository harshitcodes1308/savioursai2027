/**
 * Half Yearly Simulator
 *
 * The simulator deliberately keeps the chapter configuration separate from the
 * UI: changing the half-yearly syllabus, video query, e-book source, or test
 * mapping only requires changing this file.
 */

export interface HalfYearlyChapter {
  id: string;
  title: string;
  youtubeQuery: string;
  ebookPdfs: { textbook: string | null; questionBank: string | null };
  /** Exact chapter value in the precision question dataset. */
  precisionChapter: string | null;
}

export interface HalfYearlySubject {
  label: string;
  icon: string;
  color: string;
  precisionSubject: string | null;
  chapters: HalfYearlyChapter[];
}

export type HalfYearlySubjectKey =
  | "mathematics" | "physics" | "chemistry" | "biology"
  | "history-civics" | "computer-applications" | "english-literature";

const ebook = (subject: string) => ({
  textbook: `/ebooks/${subject}.pdf`,
  questionBank: `/ebooks/${subject}-qb.pdf`,
});

// The source library currently includes only the Mathematics textbook.
const mathematicsEbook = { textbook: "/ebooks/mathematics.pdf", questionBank: null };

const chapter = (id: string, title: string, pdfs: { textbook: string | null; questionBank: string | null }, precisionChapter: string | null): HalfYearlyChapter => ({
  id,
  title,
  youtubeQuery: `${title} Class 10 ICSE Clarify Knowledge`,
  ebookPdfs: pdfs,
  precisionChapter,
});

export const HALF_YEARLY_DATA: Record<HalfYearlySubjectKey, HalfYearlySubject> = {
  mathematics: {
    label: "Mathematics", icon: "📐", color: "#60A5FA", precisionSubject: "Mathematics",
    chapters: [
      chapter("gst", "GST", mathematicsEbook, "GST"),
      chapter("banking", "Banking", mathematicsEbook, "Banking"),
      chapter("shares-dividends", "Shares and Dividends", mathematicsEbook, "Shares and Dividends"),
      chapter("linear-inequations", "Linear Inequations", mathematicsEbook, "Linear Inequations"),
      chapter("quadratic-equations", "Quadratic Equations", mathematicsEbook, "Quadratic Equations"),
      chapter("ratio-proportion", "Ratio and Proportion", mathematicsEbook, "Ratio and Proportion"),
      chapter("matrices", "Matrices", mathematicsEbook, "Matrices"),
      chapter("arithmetic-progression", "Arithmetic Progression", mathematicsEbook, "Arithmetic Progression"),
      chapter("geometric-progression", "Geometric Progression", mathematicsEbook, null),
      chapter("remainder-factor-theorem", "Remainder and Factor Theorem", mathematicsEbook, "Factorisation"),
    ],
  },
  physics: {
    label: "Physics", icon: "⚡", color: "#F59E0B", precisionSubject: "Physics",
    chapters: [
      chapter("force", "Force", ebook("physics"), "FORCE, WORK, POWER AND ENERGY"),
      chapter("work-energy-power", "Work, Energy and Power", ebook("physics"), "FORCE, WORK, POWER AND ENERGY"),
      chapter("machines", "Machines", ebook("physics"), "MACHINES AND LEVERS"),
      chapter("refraction-plane", "Refraction at Plane Surfaces", ebook("physics"), "LIGHT - REFRACTION AND LENSES"),
      chapter("refraction-lens", "Refraction through a Lens", ebook("physics"), "LIGHT - REFRACTION AND LENSES"),
      chapter("spectrum", "Spectrum", ebook("physics"), null),
      chapter("sound", "Sound", ebook("physics"), "SOUND"),
    ],
  },
  chemistry: {
    label: "Chemistry", icon: "🧪", color: "#34D399", precisionSubject: "Chemistry",
    chapters: [
      chapter("periodic-table", "Periodic Table", ebook("chemistry"), "PERIODIC TABLE - PERIODIC PROPERTIES"),
      chapter("chemical-bonding", "Chemical Bonding", ebook("chemistry"), "CHEMICAL BONDING"),
      chapter("acids-bases-salts", "Acids, Bases and Salts", ebook("chemistry"), "STUDY OF ACIDS, BASES AND SALTS"),
      chapter("analytical-chemistry", "Analytical Chemistry", ebook("chemistry"), "ANALYTICAL CHEMISTRY"),
      chapter("mole-concept", "Mole Concept", ebook("chemistry"), "MOLE CONCEPT AND STOICHIOMETRY"),
      chapter("electrolysis", "Electrolysis", ebook("chemistry"), "ELECTROLYSIS"),
      chapter("metallurgy", "Metallurgy", ebook("chemistry"), "METALLURGY"),
    ],
  },
  biology: {
    label: "Biology", icon: "🧬", color: "#F472B6", precisionSubject: "Biology",
    chapters: [
      chapter("cell-division", "Cell Division", ebook("biology"), "Cell Cycle, Cell Division and Structure of Chromosomes"),
      chapter("genetics", "Genetics", ebook("biology"), "Genetics - Mendel's Laws and Inheritance"),
      chapter("absorption", "Absorption by Roots", ebook("biology"), "Absorption by Roots and Osmosis"),
      chapter("transpiration", "Transpiration", ebook("biology"), "Transpiration and Photosynthesis"),
      chapter("photosynthesis", "Photosynthesis", ebook("biology"), "Photosynthesis"),
      chapter("chemical-coordination", "Chemical Coordination", ebook("biology"), "Plant Physiology"),
      chapter("circulatory-system", "Circulatory System", ebook("biology"), null),
      chapter("excretory-system", "Excretory System", ebook("biology"), null),
    ],
  },
  "history-civics": {
    label: "History & Civics", icon: "📜", color: "#F87171", precisionSubject: null,
    chapters: [
      chapter("union-legislature", "The Union Legislature", ebook("history-civics"), null),
      chapter("union-executive", "The Union Executive", ebook("history-civics"), null),
      chapter("judiciary", "The Judiciary", ebook("history-civics"), null),
      chapter("first-war-independence", "The First War of Independence", ebook("history-civics"), null),
      chapter("growth-nationalism", "Growth of Nationalism", ebook("history-civics"), null),
      chapter("mass-phase", "The Mass Phase of the National Movement", ebook("history-civics"), null),
      chapter("world-wars", "The World Wars", ebook("history-civics"), null),
      chapter("united-nations", "United Nations", ebook("history-civics"), null),
    ],
  },
  "computer-applications": {
    label: "Computer Applications", icon: "💻", color: "#818CF8", precisionSubject: "Computer Applications",
    chapters: [
      chapter("basics", "Basics of OOP", { textbook: "/ebooks/computer.pdf", questionBank: null }, "INTRODUCTION TO OBJECT ORIENTED PROGRAMMING CONCEPTS"),
      chapter("input", "Input in Java", { textbook: "/ebooks/computer.pdf", questionBank: null }, "INPUT IN JAVA"),
      chapter("if-else", "If-Else", { textbook: "/ebooks/computer.pdf", questionBank: null }, "CONDITIONAL CONSTRUCTS IN JAVA"),
      chapter("math-functions", "Math Functions", { textbook: "/ebooks/computer.pdf", questionBank: null }, "MATHEMATICAL LIBRARY METHODS"),
      chapter("loops", "Loops", { textbook: "/ebooks/computer.pdf", questionBank: null }, "ITERATIVE CONSTRUCTS IN JAVA"),
      chapter("patterns", "Patterns", { textbook: "/ebooks/computer.pdf", questionBank: null }, "NESTED FOR LOOPS"),
      chapter("series", "Series", { textbook: "/ebooks/computer.pdf", questionBank: null }, null),
      chapter("constructors", "Constructors", { textbook: "/ebooks/computer.pdf", questionBank: null }, "CONSTRUCTORS"),
      chapter("functions", "Functions", { textbook: "/ebooks/computer.pdf", questionBank: null }, "USER-DEFINED METHODS"),
      chapter("string", "String", { textbook: "/ebooks/computer.pdf", questionBank: null }, "STRING HANDLING"),
    ],
  },
  "english-literature": {
    label: "English Literature", icon: "✒️", color: "#A78BFA", precisionSubject: null,
    chapters: [
      chapter("julius-caesar-act-iii", "Julius Caesar — Act III", ebook("julius-caesar"), null),
      chapter("julius-caesar-act-iv", "Julius Caesar — Act IV", ebook("julius-caesar"), null),
    ],
  },
};

export const HALF_YEARLY_SUBJECT_KEYS = Object.keys(HALF_YEARLY_DATA) as HalfYearlySubjectKey[];
