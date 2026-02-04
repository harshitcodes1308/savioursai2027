
import { distributeChaptersAcross15Days } from "./src/lib/chapter-distribution";

const mockInput = {
  subjects: ["Math", "Physics"],
  chapters: {
    "Math": [
      "Ch1", "Ch2", "Ch3", "Ch4", "Ch5", 
      "Ch6", "Ch7", "Ch8", "Ch9", "Ch10",
      "Ch11", "Ch12", "Ch13", "Ch14", "Ch15", "Ch16"
    ], // 16 chapters
    "Physics": [
      "P1", "P2", "P3", "P4", "P5"
    ] // 5 chapters
  },
  daily_study_hours: 2
};

console.log("Testing with 16 Math chapters and 5 Physics chapters...");
const result = distributeChaptersAcross15Days(mockInput);

console.log("\n--- Math Distribution (16 chapters) ---");
for (let d = 1; d <= 5; d++) {
  console.log(`Day ${d}: ${result[d]["Math"]}`);
}

console.log("\n--- Physics Distribution (5 chapters) ---");
for (let d = 1; d <= 5; d++) {
  console.log(`Day ${d}: ${result[d]["Physics"]}`);
}
