
export const QUESTION_TEMPLATES: Record<string, string[]> = {
  "Mathematics": [
    "Solve the following problem related to {chapter}.",
    "Explain the key formula used in {chapter}.",
    "Apply the concepts of {chapter} to solve this.",
    "Calculate the value based on the principles of {chapter}.",
    "Derive the relationship described in {chapter}."
  ],
  "Physics": [
    "Explain the phenomenon of {chapter}.",
    "Calculate the magnitude using the laws of {chapter}.",
    "Describe the experiment related to {chapter}.",
    "Derive the formula for {chapter}.",
    "Compare and contrast the concepts in {chapter}."
  ],
  "Chemistry": [
    "Write the chemical equation for the reaction in {chapter}.",
    "Explain the properties of {chapter}.",
    "Describe the preparation method for {chapter}.",
    "What are the uses of {chapter}?",
    "Distinguish between the compounds in {chapter}."
  ],
  "Biology": [
    "Draw a well-labelled diagram of {chapter}.",
    "Explain the process of {chapter}.",
    "What is the function of {chapter}?",
    "Differentiate between the terms in {chapter}.",
    "Describe the structure of {chapter}."
  ],
  "History": [
    "Discuss the causes and consequences of {chapter}.",
    "Describe the role of key figures in {chapter}.",
    "When and where did {chapter} take place?",
    "Explain the significance of {chapter}.",
    "Write a short note on {chapter}."
  ],
  "Geography": [
    "Explain the climatic conditions of {chapter}.",
    "Describe the soil type found in {chapter}.",
    "Locate and label {chapter} on the map.",
    "What are the economic activities in {chapter}?",
    "Explain the geographical features of {chapter}."
  ],
  "Computer Applications": [
    "Write a Java program to specific to {chapter}.",
    "Explain the syntax and usage of {chapter}.",
    "Differentiate between the concepts in {chapter}.",
    "What is the output of the following {chapter} code?",
    "Debug the program related to {chapter}."
  ],
  "English Literature": [
    "Analyze the theme of {chapter}.",
    "Sketch the character of the protagonist in {chapter}.",
    "Explain the significance of the title {chapter}.",
    "Summarize the plot of {chapter}.",
    "What literary devices are used in {chapter}?"
  ],
   "English Language": [
    "Write an essay on the topic related to {chapter}.",
    "Change the voice of the sentences in {chapter}.",
    "Combine the sentences using {chapter}.",
    "Read the passage from {chapter} and answer questions.",
    "Write a letter based on the scenario in {chapter}."
  ],
  "default": [
    "Explain the core concept of {chapter}.",
    "Discuss the importance of {chapter}.",
    "Solve a problem related to {chapter}.",
    "Analyze the key aspects of {chapter}.",
    "Describe the characteristics of {chapter}."
  ]
};

export const OPTION_TEMPLATES = [
  ["Option A", "Option B", "Option C", "Option D"],
  ["True", "False", "Partially True", "Cannot be determined"],
  ["Statement I is correct", "Statement II is correct", "Both are correct", "Neither is correct"],
  ["increase", "decrease", "remain same", "fluctuate"],
  ["Analysis A", "Analysis B", "Analysis C", "Analysis D"]
];

export function generateSyntheticQuestion(subject: string, chapter: string, index: number) {
  const templates = QUESTION_TEMPLATES[subject] || QUESTION_TEMPLATES["default"];
  // Randomize based on chapter + index to determine template
  const pseudoRandom = (chapter.length + index) % templates.length;
  const template = templates[pseudoRandom];
  
  const questionText = template.replace("{chapter}", chapter);
  
  // Create randomized options
  const optionSetIdx = (chapter.length + index) % OPTION_TEMPLATES.length;
  const baseOptions = OPTION_TEMPLATES[optionSetIdx];
  const options = baseOptions.map((opt, i) => `${opt} related to ${chapter}`);
  
  return {
    question: `[Day 15+] ${questionText}`,
    options: options,
    correct_answer: options[0], // Synthetic always A? Better to randomize or hide.
    marks: 3,
    chapter: chapter,
    difficulty: "medium"
  };
}
