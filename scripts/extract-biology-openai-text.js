const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const textPath = path.resolve('./extracted/bio-text.txt');
  const text = fs.readFileSync(textPath, 'utf8');
  
  console.log(`Sending ${text.length} characters of Bio text to OpenAI...`);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: "You are an expert biology teacher creating exactly 50 varied and high-quality multiple choice questions from a given set of past year paper text. You must extract REAL questions from the text." },
      { role: "user", content: "PDF TEXT EXTRACT:\n" + text.substring(0, 100000) }
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
              description: "An array of exactly 50 biology questions.",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", description: "Unique ID like bio-p-1, bio-p-2 etc." },
                  subject: { type: "string", enum: ["Biology"] },
                  chapter: { type: "string", description: "Chapter name from Biology syllabus" },
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
  console.log("Received structured response.");
  
  let data;
  try {
    const parsed = JSON.parse(responseText);
    data = parsed.questions;
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
