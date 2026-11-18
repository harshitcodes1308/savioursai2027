export interface MCQ {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    chapter: string;
    difficulty: "easy" | "medium" | "hard";
}

export interface CustomTestCatalogChapter {
    id: string;
    name: string;
    questionCount: number;
    source: "Competency Bank" | "Guess Paper Bank";
}

export interface CustomTestCatalogSubject {
    id: string;
    name: string;
    chapters: CustomTestCatalogChapter[];
    questionCount: number;
}
