const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const textPath = path.resolve('./extracted/bio-text.txt');
  const text = fs.readFileSync(textPath, 'utf8');
  
  console.log(`Sending ${text.length} characters of Bio text to OpenAI for full extraction...`);
  
  const prompt = `
    You are an AI generating structured educational data from a Biology PDF containing past year multiple-choice questions (PYQs).
    Extract EVERY SINGLE multiple choice question from the provided PDF text. Do not limit to 50. Extract them all.
    They must cover different biology chapters (e.g. Basic Biology, Plant Physiology, Human Anatomy and Physiology, Physical Health and Hygiene, Pollution).

    For each question, generate a JSON object matching this TypeScript interface exactly:
    {
      "id": "bio-p-1", // generate a unique sequence ID e.g., bio-p-1, bio-p-2, etc.
      "subject": "Biology",
      "chapter": "Chapter Name", // The chapter name based on the topic
      "year": 2023, // The year it appeared, or a random recent year like 2023 if not clear
      "marks": 1, 
      "question": "The exact question text",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Exactly 4 options
      "correctAnswer": 0 // The index (0-3) of the correct option
    }

    Return a valid JSON array.
  `;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: "You are an expert biology teacher extracting ALL multiple choice questions from a test paper. Extract *every single* multiple choice question you see in the provided text." },
      { role: "user", content: prompt + "\n\nPDF TEXT EXTRACT:\n" + text.substring(0, 100000) }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "biology_questions",
        strict: true,
        schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              description: "An array of all biology questions found in this text chunk.",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  subject: { type: "string", enum: ["Biology"] },
                  chapter: { type: "string", description: "Infer chapter name from Biology syllabus" },
                  year: { type: "integer", description: "Year of the question" },
                  marks: { type: "integer", enum: [1, 2, 3, 4] },
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 4,
                    maxItems: 4
                  },
                  correctAnswer: { type: "integer", description: "Index of correct option in options array (0-3)" }
                },
                required: ["id", "subject", "chapter", "year", "marks", "question", "options", "correctAnswer"],
                additionalProperties: false
              }
            }
          },
          required: ["questions"],
          additionalProperties: false
        }
      }
    }
  });

  const responseText = completion.choices[0].message.content;
  try {
    const parsed = JSON.parse(responseText);
    const questions = parsed.questions || [];
    
    // Clean IDs
    for(let i=0; i<questions.length; i++) {
        questions[i].id = `bio-p-${i+1}`;
    }
    
    console.log(`Extracted a total of ${questions.length} questions!`);
    
    const fileContent = `// Auto-generated Biology Precision Questions
import { PrecisionQuestion } from "./precision-config";

export const PRECISION_BIOLOGY: PrecisionQuestion[] = ${JSON.stringify(questions, null, 2)};
`;

    fs.writeFileSync(path.resolve('../src/data/precision-biology.ts'), fileContent);
    console.log("Saved to src/data/precision-biology.ts");
  } catch (e) {
    console.error(`Failed to parse response.`);
    console.error(e);
  }
}

main().catch(console.error);
