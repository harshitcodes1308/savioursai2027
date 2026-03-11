import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";

// Initialize Gemini
const apiKey = process.env.OPENAI_API_KEY; // Re-use the existing key which is actually a Gemini key in the env
if (!apiKey) {
  console.error("API Key not found in environment variables.");
  process.exit(1);
}

const ai = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function extractBiologyData() {
  const pdfPath = path.resolve("../public/pdfs/competency/biology/20 year pyq mcq for bio.pdf");
  
  if (!fs.existsSync(pdfPath)) {
    console.error("Biology PDF not found at:", pdfPath);
    process.exit(1);
  }

  console.log("Uploading Biology PDF to Gemini...");
  const uploadResult = await fileManager.uploadFile(pdfPath, {
    mimeType: "application/pdf",
    displayName: "Biology Precision Questions",
  });
  console.log("Uploaded successfully:", uploadResult.file.name);

  // Poll for processing
  let fileState = await fileManager.getFile(uploadResult.file.name);
  while (fileState.state === "PROCESSING") {
    console.log("Processing PDF...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    fileState = await fileManager.getFile(uploadResult.file.name);
  }

  if (fileState.state === "FAILED") {
    console.error("PDF processing failed.");
    process.exit(1);
  }

  console.log("Extracting questions...");

  const prompt = `
    You are an AI generating structured educational data from a Biology PDF containing past year multiple-choice questions (PYQs).
    Extract exactly 50 varied and high-quality multiple choice questions from the PDF. They must cover different biology chapters (e.g. Basic Biology, Plant Physiology, Human Anatomy and Physiology, Physical Health and Hygiene, Pollution).

    For each question, generate a JSON object matching this TypeScript interface exactly:
    {
      id: string; // generate a unique ID, e.g., "bio-p-1"
      subject: string; // "Biology"
      chapter: string; // The chapter name based on the topic
      year: number; // The year it appeared, or a random recent year like 2023 if not clear
      marks: number; // 1, 2, 3, or 4 based on complexity. Single MCQ is usually 1 mark.
      question: string; // The exact question text
      options: string[]; // Exactly 4 options
      correctAnswer: number; // The index (0-3) of the correct option
    }

    Return a valid JSON array of these 50 objects. Wrap the array in \`\`\`json and \`\`\`. Do not include any other text.
  `;

  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const result = await model.generateContent([
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
    { text: prompt },
  ]);

  const output = result.response.text();
  console.log("Extraction complete.");
  
  // Clean up JSON response
  let jsonString = output.trim();
  if (jsonString.startsWith("\`\`\`json")) {
    jsonString = jsonString.slice(7);
  }
  if (jsonString.endsWith("\`\`\`")) {
    jsonString = jsonString.slice(0, -3);
  }
  
  jsonString = jsonString.trim();

  try {
    const data = JSON.parse(jsonString);
    console.log(`Successfully parsed ${data.length} questions.`);

    const fileContent = `// Auto-generated Biology Precision Questions
import { PrecisionQuestion } from "./precision-config";

export const PRECISION_BIOLOGY: PrecisionQuestion[] = ${JSON.stringify(data, null, 2)};
`;
    
    fs.writeFileSync(path.resolve("../src/data/precision-biology.ts"), fileContent);
    console.log("Saved to src/data/precision-biology.ts");
  } catch (err) {
    console.error("Failed to parse JSON output. Raw output was:");
    console.log(output);
  }
}

extractBiologyData().catch(console.error);
