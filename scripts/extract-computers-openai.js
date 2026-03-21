const fs = require("fs");
const path = require("path");
const OpenAI = require("openai").default;
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PDF_PATH = path.join(
  __dirname,
  "..",
  "public",
  "pdfs",
  "competency",
  "Computer Applications",
  "ICSE Computer Applications (Class 10) - Complete Chapter-wise MCQ Bank.pdf"
);

const OUTPUT_PATH = path.join(__dirname, "..", "src", "data", "precision-computers.ts");

async function extractText() {
  const { PDFParse } = require("pdf-parse");
  const buffer = new Uint8Array(fs.readFileSync(PDF_PATH));
  const parser = new PDFParse(buffer);
  await parser.load();
  const result = await parser.getText();
  // result is { pages: [...], text: string, total: number }
  return result.text || result.pages?.join("\n") || "";
}

function chunkText(text, maxLen = 12000) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    // Try to split at a newline to avoid cutting mid-question
    if (end < text.length) {
      const lastNewline = text.lastIndexOf("\n", end);
      if (lastNewline > start + maxLen * 0.5) end = lastNewline;
    }
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

async function extractQuestionsFromChunk(chunk, chunkIdx, totalChunks, existingIds) {
  const prompt = `You are a precise ICSE data extraction engine.

TASK: Extract ALL MCQ questions from this text chunk (chunk ${chunkIdx + 1}/${totalChunks}) of an ICSE Class 10 Computer Applications competency question bank.

RULES:
1. Extract EVERY question — do not skip any
2. Each question must have exactly 4 options
3. correctAnswer is the 0-based index of the correct option
4. The "chapter" field must be the chapter/topic heading the question falls under (e.g., "Introduction to Object Oriented Programming", "Elementary Concept of Objects and Classes", "Values and Data Types", etc.)
5. Set subject to "Computer Applications"
6. Set year to 2024 (default) unless a specific year is mentioned
7. Set marks to 1 (all MCQs are 1 mark)
8. Use id format "comp-p-N" starting from ${existingIds + 1}
9. Return ONLY a valid JSON array, no extra text

OUTPUT FORMAT — JSON array of objects:
[
  {
    "id": "comp-p-1",
    "subject": "Computer Applications",
    "chapter": "Chapter Name Here",
    "year": 2024,
    "marks": 1,
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0
  }
]

TEXT CHUNK:
${chunk}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 16000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content || "{}";
  try {
    const parsed = JSON.parse(content);
    const arr = parsed.questions || parsed.data || (Array.isArray(parsed) ? parsed : []);
    return arr;
  } catch (e) {
    console.error(`Failed to parse chunk ${chunkIdx + 1}:`, e.message);
    return [];
  }
}

async function main() {
  console.log("📄 Reading PDF...");
  const text = await extractText();
  console.log(`📏 Total text length: ${text.length} characters`);

  const chunks = chunkText(text, 12000);
  console.log(`🔪 Split into ${chunks.length} chunks`);

  let allQuestions = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`🧠 Processing chunk ${i + 1}/${chunks.length}...`);
    const questions = await extractQuestionsFromChunk(chunks[i], i, chunks.length, allQuestions.length);
    console.log(`   → Extracted ${questions.length} questions`);
    allQuestions.push(...questions);
  }

  // Deduplicate by question text
  const seen = new Set();
  const unique = [];
  for (const q of allQuestions) {
    const key = q.question?.trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      unique.push(q);
    }
  }

  // Re-index IDs
  unique.forEach((q, i) => {
    q.id = `comp-p-${i + 1}`;
  });

  // Get unique chapters
  const chapters = [...new Set(unique.map((q) => q.chapter))];

  console.log(`\n✅ Total unique questions: ${unique.length}`);
  console.log(`📚 Chapters found: ${chapters.length}`);
  chapters.forEach((c) => {
    const count = unique.filter((q) => q.chapter === c).length;
    console.log(`   - ${c}: ${count} questions`);
  });

  // Write TypeScript file
  const tsContent = `// Auto-generated Computer Applications Precision Questions
import { PrecisionQuestion } from "./precision-config";

export const computerQuestions: PrecisionQuestion[] = ${JSON.stringify(unique, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, tsContent, "utf-8");
  console.log(`\n💾 Saved to ${OUTPUT_PATH}`);

  // Print chapters for page.tsx integration
  console.log("\n📋 Chapter config for page.tsx:");
  chapters.forEach((c) => {
    console.log(`      { id: "${c}", name: "${c}" },`);
  });
}

main().catch(console.error);
