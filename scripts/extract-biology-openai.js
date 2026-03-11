const fs = require('fs');
const path = require('path');
const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.default || pdfParseLib;
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const pdfPath = path.resolve('../public/pdfs/competency/biology/20 year pyq mcq for bio.pdf');
  const pdfBuffer = fs.readFileSync(pdfPath);
  console.log("Parsing PDF text...");
  const pdfData = await pdfParse(pdfBuffer);
  const text = pdfData.text;
  
  console.log(`Extracted ${text.length} characters from PDF.`);
  
  console.log("Sending to OpenAI for structured generation...");
  
  const prompt = `
    You are an AI generating structured educational data from a Biology PDF containing past year multiple-choice questions (PYQs).
    Extract exactly 50 varied and high-quality multiple choice questions from the provided PDF text. They must cover different biology chapters (e.g. Basic Biology, Plant Physiology, Human Anatomy and Physiology, Physical Health and Hygiene, Pollution).

    For each question, generate a JSON object matching this TypeScript interface exactly:
    {
      "id": "bio-p-1", // generate a unique ID
      "subject": "Biology",
      "chapter": "Chapter Name", // The chapter name based on the topic
      "year": 2023, // The year it appeared, or a random recent year like 2023 if not clear
      "marks": 1, 
      "question": "The exact question text",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Exactly 4 options
      "correctAnswer": 0 // The index (0-3) of the correct option
    }

    Return a valid JSON array of these 50 objects.
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are a helpful assistant that outputs JSON." },
      { role: "user", content: prompt + "\n\nPDF TEXT EXTRACT:\n" + text.substring(0, 100000) } // limit to 100k chars for safety
    ],
  });

  const responseText = completion.choices[0].message.content;
  console.log("Received response.");
  
  let data;
  try {
    const parsed = JSON.parse(responseText);
    // gpt-4o might wrap it in an object like { "questions": [...] }
    data = parsed.questions || parsed.data || parsed;
    if (!Array.isArray(data)) {
        data = Object.values(parsed).find(v => Array.isArray(v)) || [];
    }
  } catch (e) {
    console.error("Failed to parse JSON");
    process.exit(1);
  }

  const fileContent = `// Auto-generated Biology Precision Questions
import { PrecisionQuestion } from "./precision-config";

export const PRECISION_BIOLOGY: PrecisionQuestion[] = ${JSON.stringify(data, null, 2)};
`;

  fs.writeFileSync(path.resolve('../src/data/precision-biology.ts'), fileContent);
  console.log("Saved to src/data/precision-biology.ts");
}

main().catch(console.error);
