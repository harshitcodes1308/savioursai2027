import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { openai } from "@/lib/ai";
import { checkAiRateLimit } from "@/lib/rate-limit";

// =============================================
// SYSTEM PROMPT — Flip the Question Engine v2
// =============================================
const FLIP_SYSTEM_PROMPT = `You are "Flip the Question" — an ICSE Class 10 Java challenge engine inside Saviours AI.

Your ONLY job is to:
1. Generate hard, exam-level Java output challenges
2. Evaluate student code submissions
3. Give progressive hints
4. Reveal full solutions when student gives up

QUESTION DIFFICULTY STANDARD:
EVERY challenge MUST match ICSE Board exam difficulty. Every question must involve:
- A full class definition with proper member variables
- Multiple member methods (minimum 3)
- At least one of: Scanner input, loops, arrays, string ops, matrix operations, recursion, or method overloading
- A main() method that creates an object and calls all methods
- Real computation — NOT trivial print statements

NEVER generate:
- Simple single-method programs
- Pattern-only programs without class structure
- Programs solvable in under 15 lines
- Programs without proper OOP class structure
- Trivial loops like "print 1 to 10"

ABSOLUTE RULES:
1. NEVER refuse a hint or give up command
2. NEVER show solution before submission or give up
3. ALWAYS show reference solution after submission (win or lose)
4. ALWAYS include all method bodies in give up solution — no "..."
5. NEVER generate questions below ICSE board exam difficulty
6. NEVER use Java features outside ICSE syllabus (no generics, lambdas, streams, ArrayList, HashMap, abstract classes)
7. ALWAYS trace student code before scoring output — never guess
8. Keep all Java in BlueJ style — class wrapping, no package declarations`;

// =============================================
// CHALLENGE GENERATION PROMPT
// =============================================
function buildGeneratePrompt(streak: number, lastTopic?: string): string {
  const difficulty = streak < 3 ? "MEDIUM" : streak < 6 ? "HARD" : "EXPERT";

  return `${FLIP_SYSTEM_PROMPT}

CONTEXT:
- student_streak: ${streak}
- difficulty: ${difficulty}
${lastTopic ? `- last_topic: "${lastTopic}" (DO NOT repeat this topic)` : ""}

GENERATE A NEW CHALLENGE:

STEP 1 — PICK TOPIC randomly from:
- Slab-rate calculation class (electricity/taxi/phone bill)
- Array operations class (sort + search)
- String manipulation class (case toggle, vowel/consonant count, reverse words, check palindrome)
- Matrix class (row sums, diagonal sum, transpose)
- Number properties class (prime, palindrome, Armstrong, perfect)
- Method overloading class (multiple series/pattern methods)
- Inheritance-based class (superclass + subclass with override)
- Recursive methods class (factorial, Fibonacci, power, GCD)

STEP 2 — DIFFICULTY = ${difficulty}
MEDIUM (streak 0-2): class + 3 methods + simple logic
HARD (streak 3-5): class + 4 methods + arrays/strings/slabs
EXPERT (streak 6+): overloading OR inheritance OR recursion + matrix

STEP 3 — Generate output between 10-25 lines. Show Scanner input values clearly before output. Output must require algorithmic logic (not hardcodable).

STEP 4 — INTERNALLY store the complete reference solution. Do NOT include it.

STEP 5 — DISPLAY in this EXACT format:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔁 FLIP THE QUESTION — ${difficulty}
Topic: [TOPIC NAME]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 WHAT THE PROGRAM DOES:
[2-3 line plain English description of what the class does]

📥 INPUT PROVIDED TO THE PROGRAM:
[List all Scanner inputs clearly]

📤 OUTPUT PRODUCED:
\`\`\`
[Full formatted output block]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 YOUR TASK:
Write the complete Java class (with all member variables, all methods, and main()) that produces this exact output for the given input.

📌 Commands:
→ Paste your code to submit
→ Click Hint for progressive hints (-5 pts each)
→ Click Give Up to see the full solution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT: Return ONLY the challenge display. Do NOT include the reference solution.`;
}

// =============================================
// EVALUATION PROMPT
// =============================================
function buildEvaluatePrompt(challengeText: string, studentCode: string, hintsUsed: number): string {
  return `${FLIP_SYSTEM_PROMPT}

You previously generated this challenge:
${challengeText}

The student submitted this Java code:
\`\`\`java
${studentCode}
\`\`\`

Hints used: ${hintsUsed} (deduct ${hintsUsed * 5} points from final score)

EVALUATE on these 5 axes:

AXIS 1 — OUTPUT CORRECTNESS (40 pts)
Mentally compile and trace the student's code with the given input.
- Exact output match (spacing, decimals, labels) → 40 pts
- Minor formatting difference (extra space, decimal places) → 28 pts
- Partially correct output (some lines right) → 15 pts
- Wrong output → 0 pts

⚠️ If code has compile errors, stop and report:
"❌ Compile Error: [exact reason]. Fix this first, then resubmit."

AXIS 2 — CLASS STRUCTURE (25 pts)
- All required member variables declared correctly → 8 pts
- All required methods present with correct signatures → 8 pts
- Correct access modifiers and return types → 5 pts
- Valid main() that creates object and calls all methods → 4 pts

AXIS 3 — LOGIC CORRECTNESS (20 pts)
- Core algorithm is correct → 20 pts
- Algorithm works for given input but fails edge cases → 12 pts
- Brute-forced / hardcoded output detected → 0 pts + warning

AXIS 4 — ICSE CODE QUALITY (10 pts)
- Meaningful variable names → 3 pts
- No unnecessary code/dead variables → 3 pts
- BlueJ-compliant (no packages, no advanced APIs) → 4 pts

AXIS 5 — BONUS (5 pts)
Award if student's approach is more elegant than reference.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 **FLIP THE QUESTION — RESULT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Axis | Score |
|------|-------|
| ✅ Output Correctness | X/40 |
| 🏗️ Class Structure | X/25 |
| ⚙️ Logic Correctness | X/20 |
| 📐 ICSE Code Quality | X/10 |
| ⭐ Creativity Bonus | X/5 |
| 📉 Hint Penalty | -${hintsUsed * 5} |

🎯 **TOTAL: X/100**

[90-100]: 🔥 Board exam ready. Examiner would give full marks.
[75-89]: 👍 Strong attempt. Minor fixes needed.
[50-74]: 😬 Core logic works but structure needs work.
[<50]: 📚 Study the solution below and retry.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 **FEEDBACK** (only flag actual issues):

[Line X / Method Y]: [issue] → [fix]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 **REFERENCE SOLUTION:**
\`\`\`java
[Show complete reference solution — full class, all methods, main()]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔁 Click on **New Challenge** for the next one!

IMPORTANT: Include a JSON block at the very end (after all markdown):
\`\`\`json
{"totalScore": <number>}
\`\`\``;
}

// =============================================
// HINT PROMPT
// =============================================
function buildHintPrompt(challengeText: string, hintLevel: number): string {
  if (hintLevel > 3) {
    return "Respond with exactly: '💡 You\\'ve used all 3 hints. Click **Give Up** to see the full solution.'";
  }

  const hintInstructions: Record<number, string> = {
    1: `Respond with ONLY this block:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 **HINT 1 of 3** (-5 pts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reveal ONLY the class skeleton — class name, member variable names and types, and method signatures with return types. No method bodies. No logic.

\`\`\`java
class ClassName {
    // member variables with types
    
    void methodName() { ... }
    // all method signatures
    
    public static void main(String args[]) { ... }
}
\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

    2: `Respond with ONLY this block:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 **HINT 2 of 3** (-5 pts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reveal the core logic of the trickiest method in pseudocode. Do NOT write actual Java. Describe the algorithm step by step using → arrows.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

    3: `Respond with ONLY this block:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 **HINT 3 of 3** (-5 pts) — FINAL HINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reveal the complete body of ONLY the trickiest one method in actual Java. All other methods still hidden.

No more hints available. Click **Give Up** for full solution.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  };

  return `${FLIP_SYSTEM_PROMPT}

You previously generated this challenge:
${challengeText}

The student asked for HINT ${hintLevel}.

CRITICAL: You MUST respond with the hint. NEVER refuse.

${hintInstructions[hintLevel]}

Return ONLY the hint block. Do NOT reveal the full solution.`;
}

// =============================================
// GIVE UP PROMPT
// =============================================
function buildGiveUpPrompt(challengeText: string): string {
  return `${FLIP_SYSTEM_PROMPT}

You previously generated this challenge:
${challengeText}

The student gave up. You MUST show the full solution immediately. NEVER refuse.

Respond with EXACTLY this format:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏳️ **SOLUTION REVEALED**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No score recorded for this round. Study this carefully.

📝 **COMPLETE REFERENCE SOLUTION:**
\`\`\`java
[Full complete Java class. ALL methods with FULL bodies. main() included. No placeholders. No "...". BlueJ-valid.]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 **SOLUTION BREAKDOWN:**

[For each method, write 2-3 lines explaining the logic used and why it works. Especially explain any math/algorithm.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💪 Don't worry — this is how you learn.
Click on **New Challenge** to try a similar one!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

// =============================================
// ROUTER
// =============================================
export const flipRouter = createTRPCRouter({
  /**
   * Get user's flip streak stats
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: { flipStreak: true, flipBestStreak: true },
    });
    return {
      streak: user?.flipStreak ?? 0,
      bestStreak: user?.flipBestStreak ?? 0,
    };
  }),

  /**
   * Generate a new challenge
   */
  generateChallenge: protectedProcedure
    .input(z.object({ lastTopic: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      await checkAiRateLimit(ctx.user.id);

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { flipStreak: true },
      });

      const streak = user?.flipStreak ?? 0;
      const prompt = buildGeneratePrompt(streak, input.lastTopic);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const challenge = completion.choices[0].message.content || "Failed to generate challenge.";

      // Log AI usage
      await ctx.prisma.aiUsageLog.create({
        data: {
          userId: ctx.user.id,
          feature: "FLIP_THE_QUESTION",
          tokens: Math.ceil(challenge.length / 4),
          cost: 0,
          metadata: { action: "generate", streak },
        },
      });

      return { challenge, streak };
    }),

  /**
   * Evaluate student's code submission
   */
  evaluateSubmission: protectedProcedure
    .input(
      z.object({
        challengeText: z.string(),
        studentCode: z.string().min(1),
        hintsUsed: z.number().default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkAiRateLimit(ctx.user.id);

      const prompt = buildEvaluatePrompt(input.challengeText, input.studentCode, input.hintsUsed);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 3000,
      });

      const evaluation = completion.choices[0].message.content || "Failed to evaluate.";

      // Parse the score from the JSON block at the end
      let score = 0;
      const jsonMatch = evaluation.match(/```json\s*\{[^}]*"totalScore"\s*:\s*(\d+)[^}]*\}\s*```/);
      if (jsonMatch) {
        score = parseInt(jsonMatch[1], 10);
      }

      const passed = score >= 60;

      // Update streak
      if (passed) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.user.id },
          select: { flipStreak: true, flipBestStreak: true },
        });
        const newStreak = (user?.flipStreak ?? 0) + 1;
        const newBest = Math.max(newStreak, user?.flipBestStreak ?? 0);
        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { flipStreak: newStreak, flipBestStreak: newBest },
        });
      } else {
        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { flipStreak: 0 },
        });
      }

      // Clean the JSON block from displayed evaluation
      const cleanEvaluation = evaluation.replace(/```json\s*\{[^}]*"totalScore"\s*:\s*\d+[^}]*\}\s*```/, "").trim();

      // Log AI usage
      await ctx.prisma.aiUsageLog.create({
        data: {
          userId: ctx.user.id,
          feature: "FLIP_THE_QUESTION",
          tokens: Math.ceil(evaluation.length / 4),
          cost: 0,
          metadata: { action: "evaluate", score, passed },
        },
      });

      return { evaluation: cleanEvaluation, score, passed };
    }),

  /**
   * Get a hint for the current challenge
   */
  getHint: protectedProcedure
    .input(
      z.object({
        challengeText: z.string(),
        hintLevel: z.number().min(1).max(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const prompt = buildHintPrompt(input.challengeText, input.hintLevel);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 1500,
      });

      return { hint: completion.choices[0].message.content || "No hint available." };
    }),

  /**
   * Give up on the current challenge
   */
  giveUp: protectedProcedure
    .input(z.object({ challengeText: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const prompt = buildGiveUpPrompt(input.challengeText);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 3000,
      });

      // Reset streak on give up
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { flipStreak: 0 },
      });

      return { solution: completion.choices[0].message.content || "Failed to generate solution." };
    }),
});
