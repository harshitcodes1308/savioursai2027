// TYQ (This Year's Questions) — Specimen Paper Data
// All subjects: Real data extracted from PDFs
// This file contains interfaces, imports from all subject files, and utility functions.

import { mathematicsPaper1, mathematicsPaper1Answers, mathematicsPaper2, mathematicsPaper2Answers } from './tyq-maths';
import { physicsPaper1, physicsPaper1Answers, physicsPaper2, physicsPaper2Answers } from './tyq-physics';
import { chemistryPaper1, chemistryPaper1Answers, chemistryPaper2, chemistryPaper2Answers } from './tyq-chemistry';
import { biologyPaper1, biologyPaper1Answers, biologyPaper2, biologyPaper2Answers } from './tyq-biology';
import { historyCivicsPaper1, historyCivicsPaper1Answers, historyCivicsPaper2, historyCivicsPaper2Answers } from './tyq-history-civics';
import { computerPaper1, computerPaper1Answers, computerPaper2, computerPaper2Answers } from './tyq-computer';
import { englishLanguagePaper1, englishLanguagePaper1Answers, englishLanguagePaper2, englishLanguagePaper2Answers } from './tyq-english-language';
import { englishLiteraturePaper1, englishLiteraturePaper1Answers, englishLiteraturePaper2, englishLiteraturePaper2Answers } from './tyq-english-literature';
import { geographyPaper1, geographyPaper1Answers, geographyPaper2, geographyPaper2Answers } from './tyq-geography';

export interface TYQSubQuestion {
  number: string;
  text: string;
  options?: string[];
  marks: number;
  image?: string;
}

export interface TYQQuestion {
  number: string;
  text: string;
  marks: number;
  subQuestions?: TYQSubQuestion[];
  options?: string[];
}

export interface TYQSection {
  name: string;
  instructions: string;
  questions: TYQQuestion[];
}

export interface TYQPaper {
  subject: string;
  subjectId: string;
  paperNumber: number;
  year: string;
  totalMarks: number;
  sections: TYQSection[];
}

export interface TYQAnswerItem {
  questionNumber: string;
  answer: string;
  explanation?: string;
}

export interface TYQAnswerKey {
  subject: string;
  subjectId: string;
  paperNumber: number;
  answers: TYQAnswerItem[];
}

// ==========================================
// DATA ACCESS — All subjects aggregated
// ==========================================

const ALL_PAPERS: Record<string, TYQPaper[]> = {
  "mathematics": [mathematicsPaper1, mathematicsPaper2],
  "physics": [physicsPaper1, physicsPaper2],
  "chemistry": [chemistryPaper1, chemistryPaper2],
  "biology": [biologyPaper1, biologyPaper2],
  "english-language": [englishLanguagePaper1, englishLanguagePaper2],
  "english-literature": [englishLiteraturePaper1, englishLiteraturePaper2],
  "history-civics": [historyCivicsPaper1, historyCivicsPaper2],
  "geography": [geographyPaper1, geographyPaper2],
  "computer-applications": [computerPaper1, computerPaper2],
};

const ALL_ANSWERS: Record<string, TYQAnswerKey[]> = {
  "mathematics": [mathematicsPaper1Answers, mathematicsPaper2Answers],
  "physics": [physicsPaper1Answers, physicsPaper2Answers],
  "chemistry": [chemistryPaper1Answers, chemistryPaper2Answers],
  "biology": [biologyPaper1Answers, biologyPaper2Answers],
  "english-language": [englishLanguagePaper1Answers, englishLanguagePaper2Answers],
  "english-literature": [englishLiteraturePaper1Answers, englishLiteraturePaper2Answers],
  "history-civics": [historyCivicsPaper1Answers, historyCivicsPaper2Answers],
  "geography": [geographyPaper1Answers, geographyPaper2Answers],
  "computer-applications": [computerPaper1Answers, computerPaper2Answers],
};

export function getRandomPaper(subjectId: string): TYQPaper | null {
  const papers = ALL_PAPERS[subjectId];
  if (!papers || papers.length === 0) return null;
  const index = Math.floor(Math.random() * papers.length);
  return papers[index];
}

export function getAnswerKey(subjectId: string, paperNumber: number): TYQAnswerKey | null {
  const answers = ALL_ANSWERS[subjectId];
  if (!answers) return null;
  return answers.find(a => a.paperNumber === paperNumber) || answers[0];
}

export function getPaper(subjectId: string, paperNumber: number): TYQPaper | null {
  const papers = ALL_PAPERS[subjectId];
  if (!papers) return null;
  return papers.find(p => p.paperNumber === paperNumber) || null;
}
