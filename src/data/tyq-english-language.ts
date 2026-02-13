// English Language — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const englishLanguagePaper1: TYQPaper = {
  subject: "English Language",
  subjectId: "english-language",
  paperNumber: 1,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Section A — Composition",
      instructions: "Write a composition (300-350 words) on any one of the following.",
      questions: [
        {
          number: "1",
          text: "Write a composition (300-350 words) on any one of the following:\n(i) \"The best way to predict the future is to create it.\" Express your views on this statement and discuss how young people can shape a better future for themselves and their communities.\n(ii) You were caught in a sudden thunderstorm while walking home from school. Describe the experience, focusing on how you felt and what you saw around you.\n(iii) \"Every school should have a compulsory life-skills program for all students.\" Argue for or against this statement.\n(iv) Study the picture given below (A crowded railway platform with people rushing, a child selling balloons, and a family struggling with luggage). Write a story, description, or account based on what it suggests to you.\n(v) Narrate an incident from your life when you had to make a difficult choice.",
          marks: 20
        }
      ]
    },
    {
      name: "Section A — Letter Writing",
      instructions: "Write a letter on any one of the following.",
      questions: [
        {
          number: "2",
          text: "Write a letter on any one of the following:\n(i) Informal Letter: Your cousin has been neglecting their studies and spending too much time playing online games. Write a letter expressing your concern and advising them on how to balance studies and leisure.\n(ii) Formal Letter: You are a resident of Green Park Colony. The main road has several deep potholes causing accidents. Write a letter to the Municipal Commissioner complaining and requesting immediate action.",
          marks: 15
        }
      ]
    },
    {
      name: "Section A — Notice and Email",
      instructions: "Read the situation and answer the questions.",
      questions: [
        {
          number: "3",
          text: "Your school, St. Xavier's High School, is organizing a Science Exhibition on the theme \"Innovations for a Sustainable Future\" on 15th November 2025 in the school auditorium from 9:00 AM to 4:00 PM.\n(i) Notice: As Head Boy/Head Girl, draft a notice informing students about the Science Exhibition. Include all necessary details and last date for registration. [5]\n(ii) Email: Write an email to the District Education Officer, inviting them to be the Chief Guest at the inauguration ceremony at 9:00 AM. [5]",
          marks: 10
        }
      ]
    },
    {
      name: "Section B — Comprehension",
      instructions: "Read the passage and answer the questions that follow.",
      questions: [
        {
          number: "4",
          text: "Read the passage about an old man sitting on a park bench watching children play. He felt most alive there. A little six-year-old girl with pigtails offered him a wilted yellow flower saying, \"Because you looked lonely. My mommy says flowers make people happy.\" The act of kindness inspired him to bring flowers for others. Answer the following:\n(i) Why did the old man come to the park every day? [2]\n(ii) What was the little girl holding, and how did she offer it? [2]\n(iii) Why was the old man \"taken aback\" by the girl's gesture? [2]\n(iv) What reason did the girl give for offering the flower? [2]\n(v) How did the girl's act of kindness inspire the old man? [2]\n(vi) Find words meaning: (a) hallways or passages (b) held tightly (c) not caring or showing interest (d) precious or valuable [4]\n(vii) Summary: Summarize the interaction in about 100 words. [6]",
          marks: 20
        }
      ]
    },
    {
      name: "Section B — Grammar",
      instructions: "Answer all questions.",
      questions: [
        {
          number: "5",
          text: "(a) Fill in blanks with correct verb forms: [4]\nWhen I (reach) home yesterday, I (find) that my mother (prepare) my favourite dish...\n\n(b) Fill in the blanks with appropriate words: [4]\n(i) The police are looking ______ the case.\n(ii) She has been suffering ______ a severe headache.\n(iii) We must abide ______ the rules.\n(iv) The teacher divided the chocolates ______ the students.\n(v) He congratulated me ______ my success.\n(vi) The climbers had to cope ______ extreme weather.\n(vii) I prefer tea ______ coffee.\n(viii) The dog ran ______ the road to catch the ball.\n\n(c) Join the sentences (Choose correct option): [4]\n(i) The rain stopped. We went out for a walk.\n(ii) He is very rich. He is not happy.\n(iii) He worked hard. He wanted to pass the exam.\n(iv) You must leave now. You will miss the train.\n\n(d) Rewrite as directed: [8]\n(i) As soon as the teacher entered... (Begin: No sooner...)\n(ii) He is too tired to go for a walk. (Rewrite using: so...that)\n(iii) \"I have completed my homework,\" said Rohan. (Indirect speech)\n(iv) The children are playing in the garden. (Change voice)\n(v) He was the most talented musician... (Begin: No other...)\n(vi) If you do not water the plants... (Begin: Unless...)\n(vii) The teacher praised the boy... (Rewrite using: complimented)\n(viii) This is the same restaurant ______ we ate last year. (Fill relative pronoun)",
          marks: 20
        }
      ]
    }
  ]
};

export const englishLanguagePaper1Answers: TYQAnswerKey = {
  subject: "English Language",
  subjectId: "english-language",
  paperNumber: 1,
  answers: [
    { questionNumber: "1", answer: "Composition — Marking Criteria:\n• Content (Relevance, ideas, originality): 6 marks\n• Organization (Structure, coherence, paragraphing): 4 marks\n• Expression (Vocabulary, sentence structure): 5 marks\n• Accuracy (Grammar, spelling, punctuation): 5 marks" },
    { questionNumber: "2", answer: "Letter Writing — Marking Criteria:\n• Format (Address, date, salutation, subscription): 3 marks\n• Content (Relevance, coverage of points): 6 marks\n• Expression (Tone, vocabulary, accuracy): 6 marks" },
    { questionNumber: "3(i)", answer: "Notice: ST. XAVIER'S HIGH SCHOOL — SCIENCE EXHIBITION\n15th November 2025, 9:00 AM to 4:00 PM, School Auditorium\nTheme: \"Innovations for a Sustainable Future\"\nStudents of Classes VI to XII are invited to participate. Register by 5th November 2025." },
    { questionNumber: "3(ii)", answer: "Email to District Education Officer inviting them as Chief Guest at inauguration at 9:00 AM, with all event details." },
    { questionNumber: "4(i)", answer: "The old man came to the park every day because it was where he felt most alive. The laughter of the children reminded him of his own youth." },
    { questionNumber: "4(ii)", answer: "The little girl was holding a bright yellow flower that was slightly wilted. She thrust it towards the old man and said, \"This is for you.\"" },
    { questionNumber: "4(iii)", answer: "The old man was taken aback because in the busy city, everyone usually rushed past without a glance. A child's simple gesture of kindness felt like a miracle." },
    { questionNumber: "4(iv)", answer: "The girl gave the flower because the old man looked lonely. Her mother had told her that flowers make people happy." },
    { questionNumber: "4(v)", answer: "The girl's act inspired the old man to bring flowers from his balcony garden the next day and give them to someone who needed cheering up. He realized kindness grows when shared." },
    { questionNumber: "4(vi)", answer: "(a) corridors\n(b) clutched\n(c) indifferent\n(d) precious" },
    { questionNumber: "4(vii)", answer: "An old man who visited the park daily was surprised when a little girl offered him a slightly wilted yellow flower. She explained that he looked lonely and that flowers make people happy. This simple act of kindness touched the old man deeply. Inspired by her gesture, he decided to share kindness by bringing flowers to give to others who seemed sad." },
    { questionNumber: "5(a)", answer: "(0) reached (1) found (2) had prepared (3) smiled (4) told (5) wanted (6) had scored (7) were eating (8) discussed" },
    { questionNumber: "5(b)", answer: "(i) into (ii) from (iii) by (iv) among (v) on (vi) with (vii) to (viii) across" },
    { questionNumber: "5(c)", answer: "(i) (a) We went out for a walk when the rain stopped.\n(ii) (b) He is very rich but he is not happy.\n(iii) (b) He worked hard because he wanted to pass the exam.\n(iv) (c) You must leave now or you will miss the train." },
    { questionNumber: "5(d)", answer: "(i) No sooner did the teacher enter the class than the students stood up.\n(ii) He is so tired that he cannot go for a walk.\n(iii) Rohan said that he had completed his homework.\n(iv) The garden is being played in by the children.\n(v) No other musician in the competition was as talented as him.\n(vi) Unless you water the plants, they will die.\n(vii) The teacher complimented the boy on his honesty.\n(viii) where" }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const englishLanguagePaper2: TYQPaper = {
  subject: "English Language",
  subjectId: "english-language",
  paperNumber: 2,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Section A — Composition",
      instructions: "Write a composition (300-350 words) on any one of the following.",
      questions: [
        {
          number: "1",
          text: "Write a composition (300-350 words) on any one of the following:\n(i) \"Social media has done more harm than good to the younger generation.\" Argue for or against this statement.\n(ii) You witnessed a road accident on your way to school. Describe the scene, the reactions of bystanders, and how the situation was resolved.\n(iii) \"Physical education should be given equal importance as academic subjects in school.\" Express your views.\n(iv) Study the picture (An elderly person sitting alone by a window, looking out at children playing in a park). Write a story, description, or account.\n(v) Narrate an experience you had while travelling in public transport that taught you something valuable.",
          marks: 20
        }
      ]
    },
    {
      name: "Section A — Letter Writing",
      instructions: "Write a letter on any one of the following.",
      questions: [
        {
          number: "2",
          text: "Write a letter on any one of the following:\n(i) Informal Letter: Your younger sibling is nervous about upcoming Board examinations. Write a letter encouraging them, offering study tips, and reminding them to stay calm.\n(ii) Formal Letter: You purchased a mobile phone online but it arrived with a defective screen and non-functional camera. Write to customer service requesting replacement or refund.",
          marks: 15
        }
      ]
    },
    {
      name: "Section A — Notice and Email",
      instructions: "Read the situation and answer the questions.",
      questions: [
        {
          number: "3",
          text: "Your school, Delhi Public School, is organizing a Blood Donation Camp in collaboration with Red Cross Society on 20th December 2025 in the school gymnasium from 10:00 AM to 3:00 PM.\n(i) Notice: As Secretary of the Social Service League, draft a notice inviting volunteers and donors. [5]\n(ii) Email: Write an email to the Secretary of the local Rotary Club requesting their members to participate. [5]",
          marks: 10
        }
      ]
    },
    {
      name: "Section B — Comprehension",
      instructions: "Read the passage and answer the questions.",
      questions: [
        {
          number: "4",
          text: "Read the passage about young Arjun in the village of Shahpur during a flood. While villagers debated and prayed, Arjun gathered friends to move livestock to higher ground. When water entered the village, they used an old country boat to ferry people to safety. When the rescue team arrived, all villagers were safe thanks to Arjun.\n(i) How did the river change after three days of rain? [2]\n(ii) What warning signs did Arjun notice? [2]\n(iii) What did Arjun and friends do first to prepare? [2]\n(iv) How did they help villagers during the flood? [2]\n(v) What did the rescue team officer ask? [2]\n(vi) Find words meaning: (a) without stopping (b) small in quantity (c) search for safety (d) went down or subsided [4]\n(vii) Summary: Summarize Arjun's efforts in about 100 words. [6]",
          marks: 20
        }
      ]
    },
    {
      name: "Section B — Grammar",
      instructions: "Answer all questions.",
      questions: [
        {
          number: "5",
          text: "(a) Fill in blanks with correct verb forms: [4]\nLast Sunday, while I (walk) through the park, I (see) a small puppy that (look) lost...\n\n(b) Fill in the blanks with appropriate words: [4]\n(i) He apologized ______ his rude behavior.\n(ii) The book consists ______ ten chapters.\n(iii) She has been absent ______ school for a week.\n(iv) We must guard ______ evil thoughts.\n(v) The patient has recovered ______ his illness.\n(vi) He was appointed ______ the post of manager.\n(vii) The cat jumped ______ the table.\n(viii) I am not interested ______ watching horror movies.\n\n(c) Join the sentences (Choose correct option): [4]\n(i) He finished his homework. He went out to play.\n(ii) She is very intelligent. She is very humble.\n(iii) He missed the bus. He was late for school.\n(iv) The music was loud. I could not concentrate.\n\n(d) Rewrite as directed: [8]\n(i) As soon as the bell rang... (Begin: No sooner...)\n(ii) The cake was too sweet for me to eat. (Rewrite using: so...that)\n(iii) \"Please help me with this heavy box,\" said the old woman. (Indirect speech)\n(iv) The chef is preparing a delicious meal. (Change voice)\n(v) Very few cities in India are as clean as Chandigarh. (Begin: Chandigarh is...)\n(vi) If you do not hurry... (Begin: Unless...)\n(vii) \"I am sorry I broke your vase,\" said Mohit. (Rewrite using: apologized)\n(viii) The man ______ car was stolen has filed a complaint. (Fill relative pronoun)",
          marks: 20
        }
      ]
    }
  ]
};

export const englishLanguagePaper2Answers: TYQAnswerKey = {
  subject: "English Language",
  subjectId: "english-language",
  paperNumber: 2,
  answers: [
    { questionNumber: "1", answer: "Composition — Same marking criteria as Paper 1." },
    { questionNumber: "2", answer: "Letter Writing — Same marking criteria as Paper 1." },
    { questionNumber: "3(i)", answer: "Notice: DELHI PUBLIC SCHOOL — BLOOD DONATION CAMP\nIn collaboration with Red Cross Society\nDate: 20th December 2025, Time: 10:00 AM to 3:00 PM, Venue: School Gymnasium\n\"Donate Blood, Save Lives\" — Register by 15th December 2025." },
    { questionNumber: "3(ii)", answer: "Email to Rotary Club Secretary requesting members to participate in the Blood Donation Camp and help spread the word." },
    { questionNumber: "4(i)", answer: "The usually calm and placid river turned into a raging torrent with muddy waters licking hungrily at the riverbanks." },
    { questionNumber: "4(ii)", answer: "Arjun noticed the rising water level and uprooted trees floating downstream as warning signs." },
    { questionNumber: "4(iii)", answer: "Arjun and his friends first started moving the livestock to higher ground." },
    { questionNumber: "4(iv)", answer: "They used an old country boat to ferry people from flooded homes to the safety of the hill slope, working through the night." },
    { questionNumber: "4(v)", answer: "The officer asked who coordinated the evacuation. The villagers pointed to an exhausted but smiling Arjun." },
    { questionNumber: "4(vi)", answer: "(a) incessantly\n(b) meager\n(c) seek\n(d) receded" },
    { questionNumber: "4(vii)", answer: "When Shahpur faced severe flooding, young Arjun took immediate action. He gathered friends and moved livestock to safety. Using an old country boat, they ferried stranded villagers to the hill slope through the night. By morning, all were safe due to Arjun's courage." },
    { questionNumber: "5(a)", answer: "(0) was walking (1) saw (2) looked (3) was shivering (4) whimpering (5) decided (6) brought (7) agreed (8) take" },
    { questionNumber: "5(b)", answer: "(i) for (ii) of (iii) from (iv) against (v) from (vi) to (vii) onto (viii) in" },
    { questionNumber: "5(c)", answer: "(i) (c) After finishing his homework, he went out to play.\n(ii) (b) She is very intelligent but she is very humble.\n(iii) (b) He missed the bus so he was late for school.\n(iv) (d) The music was so loud that I could not concentrate." },
    { questionNumber: "5(d)", answer: "(i) No sooner did the bell ring than the children ran out of the class.\n(ii) The cake was so sweet that I could not eat it.\n(iii) The old woman requested me to help her with that heavy box.\n(iv) A delicious meal is being prepared by the chef.\n(v) Chandigarh is one of the cleanest cities in India.\n(vi) Unless you hurry, you will miss the flight.\n(vii) Mohit apologized for breaking my vase.\n(viii) whose" }
  ]
};
