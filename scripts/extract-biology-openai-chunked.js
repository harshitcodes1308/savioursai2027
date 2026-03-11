const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const textPath = path.resolve('./extracted/bio-text.txt');
  const text = fs.readFileSync(textPath, 'utf8');
  
  console.log(`Sending ${text.length} characters of Bio text to OpenAI for chunked extraction...`);
  
  const chunkSize = 15000;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  
  let allQuestions = [];
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}... (${chunks[i].length} chars)`);
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: "You are an expert biology teacher extracting ALL multiple choice questions from a test paper. Extract *every single* multiple choice question you see in the provided text. Never skip any." },
          { role: "user", content: "TEXT EXTRACT:\n" + chunks[i] }
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
      const parsed = JSON.parse(responseText);
      const questions = parsed.questions || [];
      console.log(`Extracted ${questions.length} questions from chunk ${i+1}.`);
      allQuestions = allQuestions.concat(questions);
    } catch (e) {
      console.error(`Failed to process chunk ${i+1}:`, e);
    }
  }

  // Deduplicate by question text in case of overlap between chunks
  const uniqueQuestions = [];
  const seenTexts = new Set();
  
  for (let i = 0; i < allQuestions.length; i++) {
    const q = allQuestions[i];
    q.id = `bio-p-${uniqueQuestions.length + 1}`; // Re-assign clean sequential IDs
    q.marks = 1;
    q.subject = "Biology";
    
    // basic normalisation to prevent duplicates
    const normalizedText = q.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenTexts.has(normalizedText) && q.question.length > 5) {
      seenTexts.add(normalizedText);
      uniqueQuestions.push(q);
    }
  }
  
  console.log(`Total unique questions extracted: ${uniqueQuestions.length}`);

  const fileContent = `// Auto-generated Biology Precision Questions
import { PrecisionQuestion } from "./precision-config";

export const PRECISION_BIOLOGY: PrecisionQuestion[] = ${JSON.stringify(uniqueQuestions, null, 2)};
`;

  fs.writeFileSync(path.resolve('../src/data/precision-biology.ts'), fileContent);
  console.log("Saved to src/data/precision-biology.ts");
}

main().catch(console.error);
