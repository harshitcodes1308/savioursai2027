// Biology — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const biologyPaper1: TYQPaper = {
  subject: "Biology",
  subjectId: "biology",
  paperNumber: 1,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Section A (40 Marks)",
      instructions: "Attempt all questions from this Section.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 15,
          subQuestions: [
            { number: "(i)", text: "The stage of mitosis where chromosomes align at the equator is called:", options: ["Prophase", "Metaphase", "Anaphase", "Telophase"], marks: 1 },
            { number: "(ii)", text: "The part of the brain responsible for maintaining balance and coordination is:", options: ["Cerebrum", "Cerebellum", "Medulla oblongata", "Hypothalamus"], marks: 1 },
            { number: "(iii)", text: "Assertion (A): The wall of the left ventricle is thicker than the right ventricle.\nReason (R): The left ventricle pumps blood to all parts of the body except the lungs.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(iv)", text: "In a neuron, the direction of nerve impulse conduction is:", options: ["Dendrite → Axon → Cell body", "Axon → Dendrite → Cell body", "Dendrite → Cell body → Axon", "Cell body → Dendrite → Axon"], marks: 1 },
            { number: "(v)", text: "The hormone that regulates blood calcium level is:", options: ["Thyroxine", "Insulin", "Parathyroid hormone", "Adrenaline"], marks: 1 },
            { number: "(vi)", text: "The scientific name of the garden pea plant used by Mendel is:", options: ["Pisum sativum", "Phaseolus vulgaris", "Solanum tuberosum", "Oryza sativa"], marks: 1 },
            { number: "(vii)", text: "Assertion (A): Haemophilia is more common in males than in females.\nReason (R): The gene for haemophilia is located on the X chromosome and is recessive.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(viii)", text: "Which of the following is a biodegradable waste?", options: ["Plastic bottle", "Glass jar", "Vegetable peels", "Polythene bag"], marks: 1 },
            { number: "(ix)", text: "The structure in the kidney that performs ultrafiltration is:", options: ["Bowman's capsule", "Loop of Henle", "Collecting duct", "Renal pelvis"], marks: 1 },
            { number: "(x)", text: "The part of the human ear that equalizes pressure on both sides of the eardrum is:", options: ["Cochlea", "Eustachian tube", "Semicircular canal", "Auditory nerve"], marks: 1 },
            { number: "(xi)", text: "Assertion (A): Plants in deserts have reduced leaves or spines.\nReason (R): This adaptation helps reduce transpiration in dry conditions.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(xii)", text: "The first human ancestor to use tools is believed to be:", options: ["Australopithecus", "Homo habilis", "Homo erectus", "Neanderthal man"], marks: 1 },
            { number: "(xiii)", text: "Which of the following is NOT a function of the liver?", options: ["Production of bile", "Detoxification of blood", "Production of insulin", "Storage of glycogen"], marks: 1 },
            { number: "(xiv)", text: "The part of the flower that becomes the fruit after fertilization is:", options: ["Ovary", "Ovule", "Petal", "Sepal"], marks: 1 },
            { number: "(xv)", text: "In the genetic cross TT × tt, the phenotype of the F1 generation will be:", options: ["All tall", "All dwarf", "50% tall, 50% dwarf", "75% tall, 25% dwarf"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Name the following:\n(a) The process by which plants lose water in the form of water vapor.\n(b) The hormone that regulates blood sugar level.\n(c) The structure that connects the placenta to the foetus.\n(d) The statistical study of human population.\n(e) The nitrogen base that pairs with Guanine in DNA.", marks: 5 },
            { number: "(ii)", text: "Given below is a diagram of the human brain. Identify the parts labelled (a) to (e) and write their functions.", marks: 5 },
            { number: "(iii)", text: "Arrange in correct logical sequence, beginning with the underlined term:\n(a) Pollen grain, Fertilization, Pollination, Zygote formation\n(b) Urethra, Urinary bladder, Ureter, Kidney\n(c) Phloem, Xylem, Root hair, Soil water\n(d) Right ventricle, Lungs, Left atrium, Pulmonary artery\n(e) DNA, Chromosome, Gene, Nucleus", marks: 5 },
            { number: "(iv)", text: "Match Column A with Column B:\n(a) Myopia → ?\n(b) Insulin → ?\n(c) Leydig cells → ?\n(d) Thyroxine → ?\n(e) Eardrum → ?", marks: 5 },
            { number: "(v)", text: "Study the diagram of the human nephron and answer:\n(a) Name the parts labelled A, B, C, D, and E.\n(b) What process occurs in part A?\n(c) What is the function of the Loop of Henle?\n(d) Name the blood vessel that brings blood to the glomerulus.\n(e) Name the hormone that regulates water reabsorption.", marks: 5 }
          ]
        }
      ]
    },
    {
      name: "Section B (40 Marks)",
      instructions: "Attempt any four questions from this Section.",
      questions: [
        {
          number: "3",
          text: "(i) Differentiate between Mitosis and Meiosis based on: (a) Number of daughter cells (b) Chromosome number in daughter cells (c) Location in the body where it occurs. [3]\n(ii) State any two significance of photosynthesis for life on Earth. [2]\n(iii) Draw a neat, labelled diagram of a stomatal apparatus. [3]\n(iv) Mention any two adaptations in desert plants to reduce transpiration. [2]",
          marks: 10
        },
        {
          number: "4",
          text: "(i) Define Reflex action. Give one example. [2]\n(ii) Explain the path of a reflex arc with the help of a flow chart. [3]\n(iii) What is the function of the cerebrospinal fluid? [1]\n(iv) Differentiate between Natural reflex and Acquired reflex with one example each. [2]\n(v) Name the part of the brain responsible for: (a) Control of body temperature (b) Regulation of breathing and heartbeat. [2]",
          marks: 10
        },
        {
          number: "5",
          text: "(i) What is double circulation? Explain its significance. [2]\n(ii) Draw a neat, labelled diagram of the internal structure of the human heart. [3]\n(iii) Differentiate between Arteries and Veins based on: (a) Direction of blood flow (b) Presence of valves (c) Wall thickness. [3]\n(iv) Name the blood vessel: (a) Deoxygenated blood to lungs (b) Oxygenated blood from lungs. [2]",
          marks: 10
        },
        {
          number: "6",
          text: "(i) State Mendel's Law of Dominance and Law of Segregation. [2]\n(ii) Show a monohybrid cross between TT (Tall) × tt (Dwarf) with Punnett Square. [3]\n(iii) What is sex-linked inheritance? Give an example. [2]\n(iv) Explain why haemophilia is more common in males than females. [3]",
          marks: 10
        },
        {
          number: "7",
          text: "(i) Name the endocrine glands located at: (a) Base of brain (b) Above kidneys (c) Behind stomach (d) In front of neck. [2]\n(ii) State the functions of: (a) Insulin (b) Thyroxine (c) Adrenaline. [3]\n(iii) Explain the feedback mechanism with an example of the thyroid gland. [3]\n(iv) Differentiate between endocrine and exocrine glands. [2]",
          marks: 10
        },
        {
          number: "8",
          text: "(i) What is immunity? Differentiate between Active and Passive immunity. [3]\n(ii) Name any two diseases that can be prevented by vaccination. [2]\n(iii) Describe the work of Red Cross Society. [3]\n(iv) What is meant by the term 'HIV'? Name the disease it causes. [2]",
          marks: 10
        }
      ]
    }
  ]
};

export const biologyPaper1Answers: TYQAnswerKey = {
  subject: "Biology",
  subjectId: "biology",
  paperNumber: 1,
  answers: [
    { questionNumber: "1(i)", answer: "(b) Metaphase" },
    { questionNumber: "1(ii)", answer: "(b) Cerebellum" },
    { questionNumber: "1(iii)", answer: "(a) Both A and R true, R explains A" },
    { questionNumber: "1(iv)", answer: "(c) Dendrite → Cell body → Axon" },
    { questionNumber: "1(v)", answer: "(c) Parathyroid hormone" },
    { questionNumber: "1(vi)", answer: "(a) Pisum sativum" },
    { questionNumber: "1(vii)", answer: "(a) Both A and R true, R explains A" },
    { questionNumber: "1(viii)", answer: "(c) Vegetable peels" },
    { questionNumber: "1(ix)", answer: "(a) Bowman's capsule" },
    { questionNumber: "1(x)", answer: "(b) Eustachian tube" },
    { questionNumber: "1(xi)", answer: "(a) Both A and R true, R explains A" },
    { questionNumber: "1(xii)", answer: "(b) Homo habilis" },
    { questionNumber: "1(xiii)", answer: "(c) Production of insulin" },
    { questionNumber: "1(xiv)", answer: "(a) Ovary" },
    { questionNumber: "1(xv)", answer: "(a) All tall" },
    { questionNumber: "2(i)", answer: "(a) Transpiration\n(b) Insulin\n(c) Umbilical cord\n(d) Demography\n(e) Cytosine" },
    { questionNumber: "2(ii)", answer: "(a) Cerebrum — Controls voluntary actions, intelligence, memory\n(b) Cerebellum — Maintains balance and coordination\n(c) Medulla oblongata — Controls involuntary actions\n(d) Pons — Connects brain parts, regulates breathing\n(e) Hypothalamus — Regulates body temperature, hunger, thirst" },
    { questionNumber: "2(iii)", answer: "(a) Pollen grain → Pollination → Fertilization → Zygote formation\n(b) Kidney → Ureter → Urinary bladder → Urethra\n(c) Soil water → Root hair → Xylem → Phloem\n(d) Right ventricle → Pulmonary artery → Lungs → Left atrium\n(e) Nucleus → Chromosome → DNA → Gene" },
    { questionNumber: "2(iv)", answer: "(a) Myopia → Concave lens\n(b) Insulin → Diabetes mellitus\n(c) Leydig cells → Testosterone\n(d) Thyroxine → Thyroid gland\n(e) Eardrum → Tympanic membrane" },
    { questionNumber: "2(v)", answer: "(a) A-Bowman's capsule, B-Glomerulus, C-PCT, D-Loop of Henle, E-Collecting duct\n(b) Ultrafiltration\n(c) Reabsorption of water, concentration of urine\n(d) Afferent arteriole\n(e) ADH (Antidiuretic Hormone) / Vasopressin" },
    { questionNumber: "3(i)", answer: "Mitosis: 2 daughter cells, diploid, somatic cells.\nMeiosis: 4 daughter cells, haploid, reproductive organs." },
    { questionNumber: "3(ii)", answer: "Releases oxygen; Produces food (glucose) for all organisms." },
    { questionNumber: "3(iii)", answer: "Diagram showing two guard cells with chloroplasts, stomatal pore between them, and surrounding epidermal cells." },
    { questionNumber: "3(iv)", answer: "Leaves reduced to spines; Thick waxy cuticle; Sunken stomata. (Any two)" },
    { questionNumber: "4(i)", answer: "Reflex action: Rapid, automatic, involuntary response to stimulus. Example: Withdrawal of hand from hot object." },
    { questionNumber: "4(ii)", answer: "Stimulus → Receptor → Sensory neuron → Spinal cord → Association neuron → Motor neuron → Effector → Response" },
    { questionNumber: "4(iii)", answer: "Cushions brain/spinal cord; provides nutrients; removes wastes." },
    { questionNumber: "4(iv)", answer: "Natural: Inborn (e.g., blinking). Acquired: Learned (e.g., riding bicycle)." },
    { questionNumber: "4(v)", answer: "(a) Hypothalamus\n(b) Medulla oblongata" },
    { questionNumber: "5(i)", answer: "Blood passes through heart twice: pulmonary (deoxygenated) and systemic (oxygenated). Ensures efficient oxygen supply." },
    { questionNumber: "5(ii)", answer: "Heart diagram with 4 chambers, valves (tricuspid, bicuspid), and major blood vessels." },
    { questionNumber: "5(iii)", answer: "Arteries: Away from heart, no valves, thick walls.\nVeins: Towards heart, have valves, thin walls." },
    { questionNumber: "5(iv)", answer: "(a) Pulmonary artery\n(b) Pulmonary vein" },
    { questionNumber: "6(i)", answer: "Law of Dominance: Dominant allele expressed in heterozygous.\nLaw of Segregation: Two alleles separate during gamete formation." },
    { questionNumber: "6(ii)", answer: "TT × tt → F1: All Tt (Tall). Ratio: 100% Tall, 100% heterozygous." },
    { questionNumber: "6(iii)", answer: "Inheritance of genes on sex chromosomes (X or Y). Example: Haemophilia, Colour blindness." },
    { questionNumber: "6(iv)", answer: "Males have one X (XY). One defective X gene = disease. Females need both X defective (rare), otherwise are carriers." },
    { questionNumber: "7(i)", answer: "(a) Pituitary gland\n(b) Adrenal glands\n(c) Pancreas\n(d) Thyroid gland" },
    { questionNumber: "7(ii)", answer: "(a) Insulin: Converts excess glucose to glycogen\n(b) Thyroxine: Regulates metabolism, growth\n(c) Adrenaline: Fight or flight response" },
    { questionNumber: "7(iii)", answer: "Feedback mechanism: Output influences input to maintain homeostasis. Low thyroxine → TSH released → Thyroid produces more thyroxine → When normal, TSH stops." },
    { questionNumber: "7(iv)", answer: "Endocrine: Ductless, secrete into blood.\nExocrine: Have ducts, secrete onto surface." },
    { questionNumber: "8(i)", answer: "Immunity: Body's ability to resist disease.\nActive: Body produces antibodies (long-lasting).\nPassive: Antibodies from outside (temporary)." },
    { questionNumber: "8(ii)", answer: "Polio, Measles, Tetanus, Diphtheria. (Any two)" },
    { questionNumber: "8(iii)", answer: "Red Cross Society: International humanitarian organization providing relief during disasters, blood banks, first aid training." },
    { questionNumber: "8(iv)", answer: "HIV = Human Immunodeficiency Virus. Causes AIDS (Acquired Immunodeficiency Syndrome)." }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const biologyPaper2: TYQPaper = {
  subject: "Biology",
  subjectId: "biology",
  paperNumber: 2,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Section A (40 Marks)",
      instructions: "Attempt all questions from this Section.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 15,
          subQuestions: [
            { number: "(i)", text: "The process of cell division that produces gametes is:", options: ["Mitosis", "Meiosis", "Binary fission", "Budding"], marks: 1 },
            { number: "(ii)", text: "The pigment present in plants that absorbs light energy for photosynthesis is:", options: ["Chlorophyll", "Haemoglobin", "Melanin", "Carotene"], marks: 1 },
            { number: "(iii)", text: "Assertion (A): Urea is the main nitrogenous waste in humans.\nReason (R): Urea is less toxic and requires less water for excretion.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(iv)", text: "The longest part of the alimentary canal is:", options: ["Oesophagus", "Stomach", "Small intestine", "Large intestine"], marks: 1 },
            { number: "(v)", text: "Which of the following is an example of an exocrine gland?", options: ["Thyroid gland", "Pituitary gland", "Salivary gland", "Adrenal gland"], marks: 1 },
            { number: "(vi)", text: "The part of the brain that controls voluntary movements is:", options: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"], marks: 1 },
            { number: "(vii)", text: "Assertion (A): Plants give out oxygen during the day but carbon dioxide at night.\nReason (R): Photosynthesis occurs only during the day, while respiration occurs all the time.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(viii)", text: "An example of a non-biodegradable waste is:", options: ["Paper", "Vegetable peels", "Plastic", "Cotton cloth"], marks: 1 },
            { number: "(ix)", text: "The blood vessel that carries blood from the heart to the lungs is:", options: ["Pulmonary vein", "Pulmonary artery", "Aorta", "Vena cava"], marks: 1 },
            { number: "(x)", text: "The hormone responsible for the development of secondary sexual characteristics in males is:", options: ["Estrogen", "Progesterone", "Testosterone", "Oxytocin"], marks: 1 },
            { number: "(xi)", text: "Assertion (A): Identical twins are always of the same sex.\nReason (R): Identical twins develop from the same zygote that splits into two.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(xii)", text: "The first step in the extraction of teeth during digestion is:", options: ["Incisors cutting food", "Canines tearing food", "Premolars grinding food", "Molars crushing food"], marks: 1 },
            { number: "(xiii)", text: "Which of the following is NOT a greenhouse gas?", options: ["Carbon dioxide", "Methane", "Oxygen", "Water vapor"], marks: 1 },
            { number: "(xiv)", text: "The part of the flower that contains the ovules is:", options: ["Anther", "Filament", "Ovary", "Stigma"], marks: 1 },
            { number: "(xv)", text: "In a dihybrid cross between RRYY and rryy, the F2 phenotypic ratio is:", options: ["3:1", "9:3:3:1", "1:2:1", "9:7"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Name the following:\n(a) The process by which water enters the root hair from the soil.\n(b) The hormone that prepares the body for emergency situations.\n(c) The structure that connects the two cerebral hemispheres.\n(d) The term for the number of individuals per unit area.\n(e) The nitrogen base that pairs with Adenine in DNA.", marks: 5 },
            { number: "(ii)", text: "Given below is a diagram of the human respiratory system. Identify the parts labelled (a) to (e) and write their functions.", marks: 5 },
            { number: "(iii)", text: "Arrange in correct logical sequence, beginning with the underlined term:\n(a) Zygote, Gamete formation, Fertilization, Embryo development\n(b) Aorta, Left ventricle, Body tissues, Left atrium\n(c) Ureter, Collecting duct, Bowman's capsule, Urinary bladder\n(d) Stomata, Xylem, Root hair, Soil water\n(e) Gene, Chromosome, Nucleus, DNA", marks: 5 },
            { number: "(iv)", text: "Match Column A with Column B:\n(a) Insulin → ?\n(b) Iodine deficiency → ?\n(c) Iron deficiency → ?\n(d) Vitamin A deficiency → ?\n(e) Oxytocin → ?", marks: 5 },
            { number: "(v)", text: "Study the diagram of the human eye and answer:\n(a) Name the parts labelled A, B, C, D, and E.\n(b) What is the function of part B (iris)?\n(c) What happens to part C (lens) when viewing nearby objects?\n(d) Where is the image formed in a normal eye?\n(e) Name the part that transmits impulses from the eye to the brain.", marks: 5 }
          ]
        }
      ]
    },
    {
      name: "Section B (40 Marks)",
      instructions: "Attempt any four questions from this Section.",
      questions: [
        {
          number: "3",
          text: "(i) Differentiate between Aerobic and Anaerobic respiration based on: (a) Presence of oxygen (b) End products (c) Amount of energy released. [3]\n(ii) Write the balanced chemical equation for aerobic respiration. [2]\n(iii) Draw a neat, labelled diagram of a mitochondrion. [3]\n(iv) Name the two types of anaerobic respiration in: (a) Yeast (b) Human muscle cells during exercise. [2]",
          marks: 10
        },
        {
          number: "4",
          text: "(i) Define Photosynthesis. Write its significance. [2]\n(ii) List any three factors affecting the rate of photosynthesis. [3]\n(iii) What is the role of chlorophyll in photosynthesis? [1]\n(iv) Explain an experiment to show that light is necessary for photosynthesis. [4]",
          marks: 10
        },
        {
          number: "5",
          text: "(i) Draw a neat, labelled diagram of the human digestive system. [3]\n(ii) Name the enzymes secreted by: (a) Salivary glands (b) Gastric glands (c) Pancreas. [3]\n(iii) What is the function of bile juice? Where is it produced and stored? [2]\n(iv) Define Peristalsis. [1]\n(v) Name the part where maximum absorption occurs. [1]",
          marks: 10
        },
        {
          number: "6",
          text: "(i) Define Transpiration. Mention any two of its importance to plants. [2]\n(ii) Differentiate between Transpiration and Guttation. [3]\n(iii) Explain the guard cell function using potassium ion theory. [3]\n(iv) Name the structures for transpiration: Stomata, Lenticels, Cuticle. [2]",
          marks: 10
        },
        {
          number: "7",
          text: "(i) Define Excretion. Name excretory organs in humans. [2]\n(ii) Draw a neat, labelled diagram of a nephron. [3]\n(iii) Explain the process of urine formation: Ultrafiltration, Selective reabsorption, Tubular secretion. [3]\n(iv) What is dialysis? When is it used? [2]",
          marks: 10
        },
        {
          number: "8",
          text: "(i) What is immunity? Differentiate Active and Passive immunity. [3]\n(ii) Name any two vaccine-preventable diseases. [2]\n(iii) Describe the work of Red Cross Society. [3]\n(iv) What is HIV? Name the disease it causes. [2]",
          marks: 10
        }
      ]
    }
  ]
};

export const biologyPaper2Answers: TYQAnswerKey = {
  subject: "Biology",
  subjectId: "biology",
  paperNumber: 2,
  answers: [
    { questionNumber: "1(i)", answer: "(b) Meiosis" },
    { questionNumber: "1(ii)", answer: "(a) Chlorophyll" },
    { questionNumber: "1(iii)", answer: "(a) Both A and R true, R explains A" },
    { questionNumber: "1(iv)", answer: "(c) Small intestine" },
    { questionNumber: "1(v)", answer: "(c) Salivary gland" },
    { questionNumber: "1(vi)", answer: "(a) Cerebrum" },
    { questionNumber: "1(vii)", answer: "(a) Both A and R true, R explains A" },
    { questionNumber: "1(viii)", answer: "(c) Plastic" },
    { questionNumber: "1(ix)", answer: "(b) Pulmonary artery" },
    { questionNumber: "1(x)", answer: "(c) Testosterone" },
    { questionNumber: "1(xi)", answer: "(a) Both A and R true, R explains A" },
    { questionNumber: "1(xii)", answer: "(a) Incisors cutting food" },
    { questionNumber: "1(xiii)", answer: "(c) Oxygen" },
    { questionNumber: "1(xiv)", answer: "(c) Ovary" },
    { questionNumber: "1(xv)", answer: "(b) 9:3:3:1" },
    { questionNumber: "2(i)", answer: "(a) Osmosis\n(b) Adrenaline\n(c) Corpus callosum\n(d) Population density\n(e) Thymine" },
    { questionNumber: "2(ii)", answer: "(a) Nasal cavity — Warms, moistens, filters air\n(b) Pharynx — Common passage for air and food\n(c) Larynx — Produces sound (voice box)\n(d) Trachea — Windpipe, carries air to lungs\n(e) Diaphragm — Muscular sheet for breathing" },
    { questionNumber: "2(iii)", answer: "(a) Gamete formation → Fertilization → Zygote → Embryo development\n(b) Left ventricle → Aorta → Body tissues → Left atrium\n(c) Bowman's capsule → Collecting duct → Ureter → Urinary bladder\n(d) Soil water → Root hair → Xylem → Stomata\n(e) Nucleus → Chromosome → DNA → Gene" },
    { questionNumber: "2(iv)", answer: "(a) Insulin → Diabetes mellitus\n(b) Iodine deficiency → Goitre\n(c) Iron deficiency → Anaemia\n(d) Vitamin A deficiency → Night blindness\n(e) Oxytocin → Milk ejection" },
    { questionNumber: "2(v)", answer: "(a) A-Cornea, B-Iris, C-Lens, D-Retina, E-Optic nerve\n(b) Iris regulates pupil size, controls light entering eye\n(c) Lens becomes thicker (more convex) — ciliary muscles contract\n(d) Image formed on the retina\n(e) Optic nerve" },
    { questionNumber: "3(i)", answer: "Aerobic: Oxygen present, CO₂+H₂O, 38 ATP.\nAnaerobic: No oxygen, Lactic acid/Ethanol+CO₂, 2 ATP." },
    { questionNumber: "3(ii)", answer: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (38 ATP)" },
    { questionNumber: "3(iii)", answer: "Mitochondrion: Outer membrane, inner membrane with cristae, matrix." },
    { questionNumber: "3(iv)", answer: "(a) Yeast: Alcoholic fermentation (Glucose → Ethanol + CO₂)\n(b) Muscle cells: Lactic acid fermentation (Glucose → Lactic acid)" },
    { questionNumber: "4(i)", answer: "Photosynthesis: Green plants synthesize glucose from CO₂ and water using light energy. Produces food; releases oxygen." },
    { questionNumber: "4(ii)", answer: "Light intensity, CO₂ concentration, Temperature. (Any three)" },
    { questionNumber: "4(iii)", answer: "Chlorophyll absorbs light energy and converts it to chemical energy." },
    { questionNumber: "4(iv)", answer: "Destarch plant → Cover part of leaf with black paper → Expose to sunlight → Test with iodine → Uncovered part turns blue-black (starch present), covered remains brown." },
    { questionNumber: "5(i)", answer: "Digestive system diagram showing mouth, oesophagus, stomach, small intestine, large intestine, liver, pancreas." },
    { questionNumber: "5(ii)", answer: "(a) Salivary amylase\n(b) Pepsin, HCl, Mucus\n(c) Trypsin, Lipase, Amylase" },
    { questionNumber: "5(iii)", answer: "Bile emulsifies fats. Produced in liver, stored in gall bladder." },
    { questionNumber: "5(iv)", answer: "Peristalsis: Rhythmic wave-like contractions pushing food forward." },
    { questionNumber: "5(v)", answer: "Small intestine" },
    { questionNumber: "6(i)", answer: "Transpiration: Loss of water vapor from aerial parts. Creates suction force; cools plant." },
    { questionNumber: "6(ii)", answer: "Transpiration: Water vapor, through stomata, daytime.\nGuttation: Liquid water, through hydathodes, early morning." },
    { questionNumber: "6(iii)", answer: "Guard cells take up K⁺ in light → Water enters by osmosis → Cells become turgid → Pore opens. In dark, reverse occurs." },
    { questionNumber: "6(iv)", answer: "Stomata (leaves), Lenticels (stem), Cuticle (general surface)." },
    { questionNumber: "7(i)", answer: "Excretion: Removing metabolic waste. Organs: Kidneys, Skin, Lungs, Liver." },
    { questionNumber: "7(ii)", answer: "Nephron: Bowman's capsule, glomerulus, PCT, Loop of Henle, DCT, collecting duct." },
    { questionNumber: "7(iii)", answer: "Ultrafiltration → Selective reabsorption → Tubular secretion → Urine (water, urea, excess salts)." },
    { questionNumber: "7(iv)", answer: "Dialysis: Artificial blood filtering when kidneys fail. Used in kidney failure patients." },
    { questionNumber: "8(i)", answer: "Immunity: Body's resistance to disease.\nActive: Body produces antibodies (long-lasting).\nPassive: Antibodies from outside (temporary)." },
    { questionNumber: "8(ii)", answer: "Polio, Measles, Tetanus, Diphtheria. (Any two)" },
    { questionNumber: "8(iii)", answer: "Red Cross: International humanitarian organization providing relief during disasters, blood banks, first aid." },
    { questionNumber: "8(iv)", answer: "HIV = Human Immunodeficiency Virus. Causes AIDS." }
  ]
};
