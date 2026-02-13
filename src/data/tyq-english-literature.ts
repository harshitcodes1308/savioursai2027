// English Literature — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const englishLiteraturePaper1: TYQPaper = {
  subject: "English Literature",
  subjectId: "english-literature",
  paperNumber: 1,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Section A (16 Marks)",
      instructions: "Attempt all questions from this Section.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 16,
          subQuestions: [
            { number: "(i)", text: "Where does Act III of Julius Caesar begin?", options: ["In Brutus' orchard", "On the battlefield at Philippi", "In the Capitol / Senate House", "At Caesar's house"], marks: 1 },
            { number: "(ii)", text: "What does Antony predict will happen as a result of Caesar's death?", options: ["Peace and prosperity in Rome", "Civil war and chaos throughout Italy", "The crowning of Brutus as emperor", "The immediate surrender of the conspirators"], marks: 1 },
            { number: "(iii)", text: "In the play Julius Caesar, who is referred to as \"a slight unmeritable man\"?", options: ["Casca", "Lepidus", "Decius Brutus", "Trebonius"], marks: 1 },
            { number: "(iv)", text: "Why does Cassius believe they should not march to Philippi?", options: ["Their army is stronger if they stay where they are", "They will be welcomed by the people of Philippi", "Antony's forces are weak and will surrender", "They have no weapons to fight"], marks: 1 },
            { number: "(v)", text: "In Leigh Hunt's poem 'The Glove and the Lions', what does the lady throw into the lion's den?", options: ["A flower", "A ring", "A glove", "A handkerchief"], marks: 1 },
            { number: "(vi)", text: "In Sukumar Ray's poem 'The Power of Music', what happens to the people who hear Bhishma Lochan Sharma sing?", options: ["They dance with joy", "They clap and cheer", "They flee in terror", "They retire amazed"], marks: 1 },
            { number: "(vii)", text: "In H.W. Longfellow's poem 'Haunted Houses', what can the stranger at the fireside NOT see?", options: ["The furniture in the room", "The forms that the poet sees", "The flames in the fireplace", "The windows and doors"], marks: 1 },
            { number: "(viii)", text: "In Maya Angelou's poem 'When Great Trees Fall', what do \"small things\" do when great trees fall?", options: ["They run away quickly", "They gather together", "They recoil into silence", "They sing songs of mourning"], marks: 1 },
            { number: "(ix)", text: "In Robert Frost's poem 'A Considerable Speck', what does the poet notice on his paper?", options: ["A tiny insect", "A speck of dust", "A drop of ink", "A loose thread"], marks: 1 },
            { number: "(x)", text: "In Stephen Leacock's story 'With the Photographer', why does the narrator visit the photographer?", options: ["To buy a camera", "To get his picture taken", "To meet a friend", "To complain about a previous photograph"], marks: 1 },
            { number: "(xi)", text: "In William Sleator's story 'The Elevator', what is Martin terrified of?", options: ["The dark staircase", "The old building", "The fat lady in the elevator", "His father's anger"], marks: 1 },
            { number: "(xii)", text: "In Ama Ata Aidoo's story 'The Girl Who Can', what is Nana's objection to Adjoa's legs?", options: ["They are too long", "They are too thin and slender", "They are too muscular", "They are bent and crooked"], marks: 1 },
            { number: "(xiii)", text: "In Ray Bradbury's story 'The Pedestrian', why is Leonard Mead arrested?", options: ["For trespassing on private property", "For walking alone at night without purpose", "For stealing from a shop", "For disturbing the peace"], marks: 1 },
            { number: "(xiv)", text: "In Alphonse Daudet's story 'The Last Lesson', what shocking news does Franz learn at school?", options: ["The school is being closed permanently", "His teacher is leaving", "An order from Berlin forbids teaching French", "There will be no more examinations"], marks: 1 },
            { number: "(xv)", text: "In the poem 'The Glove and the Lions', why does the king react with anger towards the lady?", options: ["She interrupted the lion fight", "She showed cruelty without love", "She refused to marry anyone", "She laughed at the lions"], marks: 1 },
            { number: "(xvi)", text: "In the poem 'The Power of Music', what happens to Bhishma Lochan Sharma when he sings?", options: ["Everyone praises him", "He causes destruction all around", "He wins a music competition", "He becomes famous"], marks: 1 }
          ]
        }
      ]
    },
    {
      name: "Section B — Drama",
      instructions: "Answer one or more questions from this Section.",
      questions: [
        {
          number: "2",
          text: "Read the extract from Julius Caesar (Act III, Scene 1):\nCaesar: I could be well moved, if I were as you;\nIf I could pray to move, prayers would move me;\nBut I am constant as the northern star,\nOf whose true-fixed and resting quality\nThere is no fellow in the firmament.\n\n(i) Who is Caesar speaking to? What are they asking? Why is Caesar refusing? [3]\n(ii) Explain: \"I am constant as the northern star\". What quality is revealed? [3]\n(iii) What does \"There is no fellow in the firmament\" mean? [3]\n(iv) What happens immediately after? Who strikes first? What are Caesar's final words? [3]\n(v) Was Caesar's refusal an act of strength or weakness? [4]",
          marks: 16
        },
        {
          number: "3",
          text: "Read the extract from Julius Caesar (Act IV, Scene 3):\nBrutus: Remember March, the ides of March remember:\nDid not great Julius bleed for justice' sake?\nWhat villain touched his body, that did stab,\nAnd not for justice?\n\n(i) To whom is Brutus speaking? What is the context? [3]\n(ii) Why does Brutus remind about the ides of March? [3]\n(iii) What accusation has been made earlier? How does the other respond? [3]\n(iv) What news does Messala bring? How does Brutus react? [3]\n(v) Compare Brutus and Cassius. Who is the better leader? [4]",
          marks: 16
        }
      ]
    },
    {
      name: "Section C — Prose (Short Stories)",
      instructions: "Answer one or more questions from this Section.",
      questions: [
        {
          number: "4",
          text: "Read the extract from Stephen Leacock's 'With the Photographer':\n\"The photographer rolled a machine into the middle of the room and backed it against the light...\"\n\n(i) Where is the narrator? Why has he come? [3]\n(ii) What does the photographer do before taking the photograph? [3]\n(iii) How does the narrator feel about the photographer's actions? [3]\n(iv) What is the narrator's reaction to the final photograph? [3]\n(v) What is the central theme? Do you sympathize with the narrator or photographer? [4]",
          marks: 16
        },
        {
          number: "5",
          text: "Read the extract from Ray Bradbury's 'The Pedestrian':\n\"The street was silent and long and empty, with only his shadow moving like the shadow of a hawk in midcountry...\"\n\n(i) Who is described? What is he doing? [3]\n(ii) Why does he compare himself to a hawk? [3]\n(iii) What time of year and day is it? How does the setting contribute to mood? [3]\n(iv) What happens to him later? What reason is given? [3]\n(v) What is Bradbury criticizing? How is it relevant today? [4]",
          marks: 16
        },
        {
          number: "6",
          text: "Read the extract from Alphonse Daudet's 'The Last Lesson':\n\"My last French lesson! I hardly knew how to write, and I should never learn now!...\"\n\n(i) Who is the speaker? What is his feeling? [3]\n(ii) What does the speaker regret? [3]\n(iii) How has the speaker's attitude towards his books changed? [3]\n(iv) What does the speaker notice about the classroom? [3]\n(v) What is the significance of the title? What message does it convey? [4]",
          marks: 16
        }
      ]
    },
    {
      name: "Section D — Poetry",
      instructions: "Answer one or more questions from this Section.",
      questions: [
        {
          number: "7",
          text: "Read the extract from H.W. Longfellow's 'Haunted Houses' and answer:\n(i) According to Longfellow, how do houses become haunted? How are his phantoms different? [3]\n(ii) How do the phantoms move? What does this suggest? [3]\n(iii) Who is the stranger? Why can't the stranger see what the poet sees? [3]\n(iv) What does Longfellow suggest about ownership of property? [3]\n(v) Describe the mood and imagery of the poem. [4]",
          marks: 16
        },
        {
          number: "8",
          text: "Read the extract from Leigh Hunt's 'The Glove and the Lions' and answer:\n(i) What is the king watching? Where are the nobles seated? [3]\n(ii) Who is the Count de Lorge? What does he sigh for? [3]\n(iii) What does the lady do? Why does she do this? [3]\n(iv) How does the Count react after retrieving the glove? [3]\n(v) What is the king's judgment? What lesson does the poem teach? [4]",
          marks: 16
        },
        {
          number: "9",
          text: "Read the extract from Maya Angelou's 'When Great Trees Fall' and answer:\n(i) What is the \"great tree\" a metaphor for? How does its fall affect the surroundings? [3]\n(ii) What do the lions and elephants symbolize? [3]\n(iii) How do humans experience the loss? [3]\n(iv) What does \"our senses, restored, never to be the same, / whisper to us\" mean? [3]\n(v) What is the central message of the poem? [4]",
          marks: 16
        }
      ]
    }
  ]
};

export const englishLiteraturePaper1Answers: TYQAnswerKey = {
  subject: "English Literature",
  subjectId: "english-literature",
  paperNumber: 1,
  answers: [
    { questionNumber: "1(i)", answer: "(c) In the Capitol / Senate House" },
    { questionNumber: "1(ii)", answer: "(b) Civil war and chaos throughout Italy" },
    { questionNumber: "1(iii)", answer: "(b) Lepidus" },
    { questionNumber: "1(iv)", answer: "(a) Their army is stronger if they stay where they are" },
    { questionNumber: "1(v)", answer: "(c) A glove" },
    { questionNumber: "1(vi)", answer: "(d) They retire amazed" },
    { questionNumber: "1(vii)", answer: "(b) The forms that the poet sees" },
    { questionNumber: "1(viii)", answer: "(c) They recoil into silence" },
    { questionNumber: "1(ix)", answer: "(a) A tiny insect" },
    { questionNumber: "1(x)", answer: "(b) To get his picture taken" },
    { questionNumber: "1(xi)", answer: "(c) The fat lady in the elevator" },
    { questionNumber: "1(xii)", answer: "(b) They are too thin and slender" },
    { questionNumber: "1(xiii)", answer: "(b) For walking alone at night without purpose" },
    { questionNumber: "1(xiv)", answer: "(c) An order from Berlin forbids teaching French" },
    { questionNumber: "1(xv)", answer: "(b) She showed cruelty without love" },
    { questionNumber: "1(xvi)", answer: "(b) He causes destruction all around" },
    { questionNumber: "2(i)", answer: "Caesar is speaking to the conspirators (Metellus Cimber, Brutus, Cassius) who are petitioning him to repeal the banishment of Publius Cimber. Caesar refuses because he believes his decisions should be firm and unchanging." },
    { questionNumber: "2(ii)", answer: "\"Constant as the northern star\" means Caesar is fixed, unmovable, and unchanging in his decisions. This reveals his pride, arrogance, and belief in his own infallibility." },
    { questionNumber: "2(iii)", answer: "\"No fellow in the firmament\" means no star equals the northern star. Caesar compares himself to this unique star, showing he believes he is supreme and above all." },
    { questionNumber: "2(iv)", answer: "The conspirators surround Caesar and stab him. Casca strikes first. Caesar's final words are: \"Et tu, Brute? — Then fall, Caesar!\"" },
    { questionNumber: "2(v)", answer: "Personal response. Strength: standing by principles. Weakness: stubbornness and pride made him blind to danger." },
    { questionNumber: "3(i)", answer: "Brutus is speaking to Cassius. They are in Brutus' tent at Sardis having a heated argument about money and corruption." },
    { questionNumber: "3(ii)", answer: "Brutus reminds about the ides of March to emphasize they killed Caesar for justice. He accuses Cassius of now acting unjustly by taking bribes." },
    { questionNumber: "3(iii)", answer: "Brutus accused Cassius of taking bribes and refusing to send money. Cassius responds with anger, denying it and reminding of their friendship." },
    { questionNumber: "3(iv)", answer: "Messala brings news that Antony and Octavius executed many senators and are marching towards Philippi. Brutus reacts with determination to fight." },
    { questionNumber: "3(v)", answer: "Brutus: idealistic, moral, but impractical. Cassius: practical, shrewd, but sometimes self-serving. Arguments for either as better leader can be accepted." },
    { questionNumber: "4(i)", answer: "The narrator is at a photography studio. He has come to get his photograph taken." },
    { questionNumber: "4(ii)", answer: "The photographer physically adjusts the narrator's face by pulling at his ear to 'improve' his appearance." },
    { questionNumber: "4(iii)", answer: "The narrator feels uncomfortable and annoyed but remains passive, revealing he is patient and self-conscious." },
    { questionNumber: "4(iv)", answer: "The narrator cannot recognize himself because the photographer altered every feature. He is shocked, disappointed, and finally angry." },
    { questionNumber: "4(v)", answer: "Central theme: conflict between artistic vision and personal identity; body shaming; importance of accepting oneself." },
    { questionNumber: "5(i)", answer: "Leonard Mead is walking alone through the city streets at night." },
    { questionNumber: "5(ii)", answer: "He compares himself to a hawk to emphasize isolation and solitude — he is the only moving thing in a deserted landscape." },
    { questionNumber: "5(iii)", answer: "It is November, at night. The setting creates loneliness, emptiness, and eerie silence, reflecting a dystopian society." },
    { questionNumber: "5(iv)", answer: "He is stopped by an automated police car and arrested for walking without purpose, taken to the Psychiatric Center." },
    { questionNumber: "5(v)", answer: "Bradbury criticizes the loss of individuality, dominance of technology, and suppression of human connection. The story warns against isolation and control by technology." },
    { questionNumber: "6(i)", answer: "Franz, a young schoolboy. It is his last French lesson because Berlin forbade teaching French in Alsace." },
    { questionNumber: "6(ii)", answer: "He regrets wasting time in woods, missing lessons, chasing birds' nests, and sliding on the Saar." },
    { questionNumber: "6(iii)", answer: "His attitude changes from seeing books as tiresome to cherishing them as old friends, realizing he will never learn French again." },
    { questionNumber: "6(iv)", answer: "The classroom is unusually quiet and solemn. Village elders including old Hauser are seated at the back." },
    { questionNumber: "6(v)", answer: "The title signifies loss of language and cultural identity under occupation. Language is integral to identity." },
    { questionNumber: "7(i)", answer: "Houses become haunted because people lived and died in them. His phantoms are \"harmless\" and glide peacefully." },
    { questionNumber: "7(ii)", answer: "Phantoms glide with \"feet that make no sound\" — peaceful, gentle, and non-threatening." },
    { questionNumber: "7(iii)", answer: "The stranger lacks emotional connection to the house. The poet sees memories because he is connected to the house's history." },
    { questionNumber: "7(iv)", answer: "The living don't truly own property; the dead hold the title through memory. The past always inhabits the present." },
    { questionNumber: "7(v)", answer: "Mood: peaceful, contemplative, nostalgic. Imagery: open doors, gliding phantoms, silent floors, fireside." },
    { questionNumber: "8(i)", answer: "The king is watching a fight between lions. Nobles and ladies are seated around the arena." },
    { questionNumber: "8(ii)", answer: "The Count de Lorge sits among nobles. He sighs for one of the ladies, indicating he is in love." },
    { questionNumber: "8(iii)", answer: "The lady throws her glove into the lion's den to test the Count's love and courage." },
    { questionNumber: "8(iv)", answer: "The Count retrieves the glove calmly but instead of giving it romantically, throws it in her face." },
    { questionNumber: "8(v)", answer: "The king judges the lady's action as cruel. True love doesn't require reckless tests; cruelty disguised as love is unacceptable." },
    { questionNumber: "9(i)", answer: "\"Great tree\" = great soul or loved one who died. Its fall causes widespread disturbance — even rocks shudder and powerful animals seek safety." },
    { questionNumber: "9(ii)", answer: "Lions and elephants symbolize the strongest beings. Their reaction shows death affects everyone regardless of strength." },
    { questionNumber: "9(iii)", answer: "Humans experience shock, numbness, feeling small and lost. Their senses are \"eroded\" — they cannot process what happened." },
    { questionNumber: "9(iv)", answer: "Grief goes beyond normal fear. People are so stunned that even their ability to feel fear is altered." },
    { questionNumber: "9(v)", answer: "Loss of great souls is devastating but their memory continues to guide us. We can become better because they existed." }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const englishLiteraturePaper2: TYQPaper = {
  subject: "English Literature",
  subjectId: "english-literature",
  paperNumber: 2,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Section A (16 Marks)",
      instructions: "Attempt all questions from this Section.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 16,
          subQuestions: [
            { number: "(i)", text: "In Julius Caesar, who strikes Caesar first?", options: ["Brutus", "Cassius", "Casca", "Trebonius"], marks: 1 },
            { number: "(ii)", text: "What does Antony call Lepidus in Act IV?", options: ["\"a noble Roman\"", "\"a slight unmeritable man\"", "\"a valiant warrior\"", "\"a true friend\""], marks: 1 },
            { number: "(iii)", text: "Why does Brutus decide to march to Philippi despite Cassius's advice?", options: ["He believes their army is growing weaker", "He wants to surprise the enemy", "He thinks the people of Philippi will join them", "He is afraid of Cassius's plan"], marks: 1 },
            { number: "(iv)", text: "In Leigh Hunt's poem 'The Glove and the Lions', how does the Count de Lorge react after retrieving the glove?", options: ["He kisses the lady's hand", "He throws the glove in the lady's face", "He keeps the glove as a trophy", "He gives it to the king"], marks: 1 },
            { number: "(v)", text: "In Sukumar Ray's poem 'The Power of Music', what happens to Bhishma Lochan Sharma's wife?", options: ["She runs away", "She faints", "She claps her hands", "She sings along"], marks: 1 },
            { number: "(vi)", text: "In H.W. Longfellow's poem 'Haunted Houses', how do the phantoms move?", options: ["They walk heavily", "They glide without sound", "They fly through windows", "They dance in circles"], marks: 1 },
            { number: "(vii)", text: "In Maya Angelou's poem 'When Great Trees Fall', what happens to our senses after a great loss?", options: ["They become sharper", "They are eroded beyond fear", "They disappear completely", "They grow stronger"], marks: 1 },
            { number: "(viii)", text: "In Robert Frost's poem 'A Considerable Speck', why does the poet decide not to kill the mite?", options: ["He is afraid of it", "He recognizes it has a mind of its own", "He wants to study it", "He feels pity for its smallness"], marks: 1 },
            { number: "(ix)", text: "In Stephen Leacock's story 'With the Photographer', what does the photographer want to remove entirely?", options: ["The narrator's nose", "The narrator's ears", "The narrator's eyebrows", "The narrator's mouth"], marks: 1 },
            { number: "(x)", text: "In William Sleator's story 'The Elevator', where does Martin live with his father?", options: ["On the ground floor", "On the 17th floor", "On the 10th floor", "On the 5th floor"], marks: 1 },
            { number: "(xi)", text: "In Ama Ata Aidoo's story 'The Girl Who Can', what does Adjoa believe she can do well?", options: ["Sing and dance", "Have children", "Run and win races", "Cook and clean"], marks: 1 },
            { number: "(xii)", text: "In Ray Bradbury's story 'The Pedestrian', what is the name of the main character?", options: ["Mr. Smith", "Leonard Mead", "Robert Jones", "William Brown"], marks: 1 },
            { number: "(xiii)", text: "In Alphonse Daudet's story 'The Last Lesson', what subject does M. Hamel teach?", options: ["History", "German", "French", "Mathematics"], marks: 1 },
            { number: "(xiv)", text: "In Julius Caesar, what does Brutus see just before the battle at Philippi?", options: ["A vision of Caesar's ghost", "A flock of birds", "A burning city", "A marching army"], marks: 1 },
            { number: "(xv)", text: "In the poem 'The Glove and the Lions', what is the king's final judgment?", options: ["\"Love is blind and lovers cannot see\"", "\"Cruelty without love deserves no love\"", "\"True love always conquers all\"", "\"Courage is the greatest virtue\""], marks: 1 },
            { number: "(xvi)", text: "In the poem 'The Power of Music', what happens to the trees when Bhishma sings?", options: ["They bloom with flowers", "They shake and crash", "They grow taller", "They remain still"], marks: 1 }
          ]
        }
      ]
    },
    {
      name: "Section B — Drama",
      instructions: "Answer one or more questions from this Section.",
      questions: [
        {
          number: "2",
          text: "Read the extract from Julius Caesar (Act III, Scene 2):\nAntony: Friends, Romans, countrymen, lend me your ears;\nI come to bury Caesar, not to praise him.\nThe evil that men do lives after them;\nThe good is oft interred with their bones;\nSo let it be with Caesar.\n\n(i) Where is Antony speaking? What is the occasion? [3]\n(ii) Why does Antony begin by saying \"I come to bury Caesar, not to praise him\"? Real intention? [3]\n(iii) What does \"The evil that men do lives after them\" mean? [3]\n(iv) What effect does repeating \"Brutus is an honourable man\" have? [3]\n(v) Was Antony's speech justified or did he manipulate the crowd? [4]",
          marks: 16
        },
        {
          number: "3",
          text: "Read the extract from Julius Caesar (Act V, Scene 5):\nAntony: This was the noblest Roman of them all:\nAll the conspirators, save only he,\nDid that they did in envy of great Caesar;\nHe only, in a general honest thought\nAnd common good to all, made one of them.\n\n(i) Who is Antony speaking about? Why \"the noblest Roman\"? [3]\n(ii) How does Antony distinguish this person from other conspirators? [3]\n(iii) What has just happened to this person? How did he die? [3]\n(iv) What does Antony say about his life and death? How to honor him? [3]\n(v) Do you agree with Antony's assessment? Was he truly noble or flawed? [4]",
          marks: 16
        }
      ]
    },
    {
      name: "Section C — Prose (Short Stories)",
      instructions: "Answer one or more questions from this Section.",
      questions: [
        {
          number: "4",
          text: "Read the extract from William Sleator's 'The Elevator':\n\"He pushed the button for three. The doors slid shut... And in the darkness, he heard her breathing.\"\n\n(i) Who is \"he\"? Why is he afraid of the elevator? [3]\n(ii) Who is the woman? How is she described? [3]\n(iii) What happens to the elevator? Why is it terrifying for Martin? [3]\n(iv) How does Martin's father react to his fears? [3]\n(v) What do you think happens at the end? Is the ending effective? [4]",
          marks: 16
        },
        {
          number: "5",
          text: "Read the extract from Ama Ata Aidoo's 'The Girl Who Can':\n\"And I have always liked to travel... my grandmother Nana used to say that it is a wanderlust which she believes is a disease.\"\n\n(i) Who is the speaker? Relationship with Nana? [3]\n(ii) What does Nana think about her legs? Why? [3]\n(iii) What is \"wanderlust\"? Why does Nana call it a disease? [3]\n(iv) What event changes Nana's opinion? How does she react? [3]\n(v) What is the significance of the title? Message about gender expectations? [4]",
          marks: 16
        },
        {
          number: "6",
          text: "Read the extract from Alphonse Daudet's 'The Last Lesson':\n\"Then he opened a grammar book and read us our lesson. I was amazed to see how well I understood it...\"\n\n(i) Who is the speaker? What lesson? Why special? [3]\n(ii) Why does the speaker find the lesson easy on this day? [3]\n(iii) What does the speaker notice about M. Hamel's behavior? [3]\n(iv) What does M. Hamel write on the blackboard? Significance? [3]\n(v) Why is the story told from a child's perspective? How does it make it more powerful? [4]",
          marks: 16
        }
      ]
    },
    {
      name: "Section D — Poetry",
      instructions: "Answer one or more questions from this Section.",
      questions: [
        {
          number: "7",
          text: "Read the extract from Robert Frost's 'A Considerable Speck' and answer:\n(i) What does the poet notice on his paper? Why? [3]\n(ii) How does the speck change? What does the poet muse? [3]\n(iii) Why does the poet spare the mite? [3]\n(iv) What does it mean that the mite demonstrated purposeful behavior? [3]\n(v) What is the central theme about the dignity of all living things? [4]",
          marks: 16
        },
        {
          number: "8",
          text: "Read the extract from Sukumar Ray's 'The Power of Music' and answer:\n(i) Who is Bhishma Lochan Sharma? What is he performing? [3]\n(ii) What happens to his wife? What does this suggest? [3]\n(iii) What happens to nature when he sings? What literary device is used? [3]\n(iv) How do the people react to his singing? [3]\n(v) What is the tone of the poem? What comic effect is created? [4]",
          marks: 16
        },
        {
          number: "9",
          text: "Read the extract from Maya Angelou's 'When Great Trees Fall' and answer:\n(i) What does \"great souls\" refer to? Impact of their death? [3]\n(ii) How does peace return? What does \"Peace blooms\" suggest? [3]\n(iii) What does the \"soothing electric vibration\" suggest? [3]\n(iv) How are our senses restored but changed? [3]\n(v) What hope does the poem offer about grief and growth? [4]",
          marks: 16
        }
      ]
    }
  ]
};

export const englishLiteraturePaper2Answers: TYQAnswerKey = {
  subject: "English Literature",
  subjectId: "english-literature",
  paperNumber: 2,
  answers: [
    { questionNumber: "1(i)", answer: "(c) Casca" },
    { questionNumber: "1(ii)", answer: "(b) \"a slight unmeritable man\"" },
    { questionNumber: "1(iii)", answer: "(a) He believes their army is growing weaker" },
    { questionNumber: "1(iv)", answer: "(b) He throws the glove in the lady's face" },
    { questionNumber: "1(v)", answer: "(b) She faints" },
    { questionNumber: "1(vi)", answer: "(b) They glide without sound" },
    { questionNumber: "1(vii)", answer: "(b) They are eroded beyond fear" },
    { questionNumber: "1(viii)", answer: "(b) He recognizes it has a mind of its own" },
    { questionNumber: "1(ix)", answer: "(b) The narrator's ears" },
    { questionNumber: "1(x)", answer: "(b) On the 17th floor" },
    { questionNumber: "1(xi)", answer: "(c) Run and win races" },
    { questionNumber: "1(xii)", answer: "(b) Leonard Mead" },
    { questionNumber: "1(xiii)", answer: "(c) French" },
    { questionNumber: "1(xiv)", answer: "(a) A vision of Caesar's ghost" },
    { questionNumber: "1(xv)", answer: "(b) \"Cruelty without love deserves no love\"" },
    { questionNumber: "1(xvi)", answer: "(b) They shake and crash" },
    { questionNumber: "2(i)", answer: "Antony is speaking at the Roman Forum, at Caesar's funeral, addressing the crowd of citizens." },
    { questionNumber: "2(ii)", answer: "Antony begins humbly to avoid hostility. His real intention is to turn the crowd against Brutus and avenge Caesar." },
    { questionNumber: "2(iii)", answer: "People remember bad things while the good is forgotten after death. Antony ironically suggests Caesar's good deeds will be buried, but then lists them to make the crowd sympathetic." },
    { questionNumber: "2(iv)", answer: "The repetition becomes increasingly sarcastic. Each time, Antony contrasts it with Caesar's goodness, making the crowd doubt Brutus's honour." },
    { questionNumber: "2(v)", answer: "Personal response. For: loyal to Caesar, sought justice. Against: manipulated through emotional appeals rather than facts." },
    { questionNumber: "3(i)", answer: "Antony speaks about Brutus, calling him the noblest because unlike others who acted from envy, Brutus acted for the common good." },
    { questionNumber: "3(ii)", answer: "Other conspirators killed Caesar out of envy and ambition. Brutus alone joined with honest thoughts for Rome's good." },
    { questionNumber: "3(iii)", answer: "Brutus died by suicide, running onto his own sword, choosing death over being paraded as a captive." },
    { questionNumber: "3(iv)", answer: "Antony says Brutus was the only conspirator who acted for the general good. He proposes an honorable burial with full military honours." },
    { questionNumber: "3(v)", answer: "Personal response. For nobility: idealistic, motivated by principle. Against: idealism made him impractical and easily manipulated." },
    { questionNumber: "4(i)", answer: "\"He\" is Martin, a thin, weak eleven-year-old. He fears the old, creaky elevator and a strange, fat lady who appears when he's alone." },
    { questionNumber: "4(ii)", answer: "The woman is old, fat, wears a dirty raincoat, has small pale eyes, and always appears when Martin is alone." },
    { questionNumber: "4(iii)", answer: "The elevator stops between floors and lights go out. Martin hears her breathing in darkness — trapped with his fear." },
    { questionNumber: "4(iv)", answer: "Martin's father dismisses his fears as foolish. This reveals their strained relationship — the father lacks empathy." },
    { questionNumber: "4(v)", answer: "The ending is ambiguous, letting horror linger in the reader's imagination. This is effective because it allows personal interpretation." },
    { questionNumber: "5(i)", answer: "The speaker is Adjoa, a young girl. Nana is her grandmother." },
    { questionNumber: "5(ii)", answer: "Nana thinks Adjoa's legs are too thin and slender, not good for childbearing. She measures a woman's worth by her ability to have children." },
    { questionNumber: "5(iii)", answer: "\"Wanderlust\" = strong desire to travel. Nana calls it a disease because she believes a woman's place is at home." },
    { questionNumber: "5(iv)", answer: "Adjoa wins a running race at school. Nana is overjoyed and proudly declares, \"my granddaughter can do it, she can.\"" },
    { questionNumber: "5(v)", answer: "The title celebrates female potential beyond traditional roles. Girls should not be limited by societal expectations." },
    { questionNumber: "6(i)", answer: "Franz is the speaker. M. Hamel reads the French grammar lesson. It is special because it is the last French lesson ever." },
    { questionNumber: "6(ii)", answer: "Franz finds it easy because he is finally paying attention, realizing the value of what he's losing." },
    { questionNumber: "6(iii)", answer: "M. Hamel is patient, gentle, and emotional. He doesn't scold Franz and teaches with unusual seriousness." },
    { questionNumber: "6(iv)", answer: "M. Hamel writes \"Vive La France!\" showing his love for his country and despair at losing it." },
    { questionNumber: "6(v)", answer: "A child's perspective shows loss of innocence through simple, honest observations, making the theme emotionally powerful." },
    { questionNumber: "7(i)", answer: "The poet notices a tiny speck (mite) on his white paper because the paper is so white any speck stands out." },
    { questionNumber: "7(ii)", answer: "The speck suddenly moves, seeming to have legs. The poet muses it is a tiny mite." },
    { questionNumber: "7(iii)", answer: "The poet spares the mite because it has a will to live, a mind of its own, and shows intelligence by trying to escape." },
    { questionNumber: "7(iv)", answer: "The mite showed purposeful behavior, not random movement — even tiny creatures have consciousness and desire to survive." },
    { questionNumber: "7(v)", answer: "The value and dignity of all living things, no matter how small. Even the smallest creature deserves respect." },
    { questionNumber: "8(i)", answer: "Bhishma Lochan Sharma is a singer performing a raga (Bhairav) with great enthusiasm." },
    { questionNumber: "8(ii)", answer: "His wife faints at the very first note, suggesting his singing is terrible and overwhelming." },
    { questionNumber: "8(iii)", answer: "The sky weeps (rains), trees shake, branches crash. Personification makes the reaction humorous and exaggerated." },
    { questionNumber: "8(iv)", answer: "People flee, retire amazed, or faint. They cannot bear to listen and try to escape." },
    { questionNumber: "8(v)", answer: "The tone is humorous and satirical. Exaggerated reactions create comic effect, poking fun at bad singing." },
    { questionNumber: "9(i)", answer: "\"Great souls\" = extraordinary, influential people. Their death has profound impact on the world." },
    { questionNumber: "9(ii)", answer: "Peace gradually returns. \"Peace blooms\" suggests healing is slow, organic, natural, like a flower opening." },
    { questionNumber: "9(iii)", answer: "Spaces left by the departed fill with memories and comfort. A spiritual connection remains." },
    { questionNumber: "9(iv)", answer: "Senses are restored but changed by loss. They whisper that we can be better because of those who lived." },
    { questionNumber: "9(v)", answer: "Grief transforms into acceptance and growth. Memory of the departed inspires us to live more fully." }
  ]
};
