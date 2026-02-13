// Chemistry — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const chemistryPaper1: TYQPaper = {
  subject: "Chemistry",
  subjectId: "chemistry",
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
            { number: "(i)", text: "Which of the following elements has the highest electronegativity?", options: ["Sodium", "Magnesium", "Chlorine", "Silicon"], marks: 1 },
            { number: "(ii)", text: "The compound that does not conduct electricity in aqueous solution is:", options: ["NaCl", "Sugar", "HCl", "NaOH"], marks: 1 },
            { number: "(iii)", text: "Assertion (A): In the electrolysis of acidified water, hydrogen is collected at the cathode.\nReason (R): Hydrogen ions are positively charged and migrate to the cathode.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(iv)", text: "The gas evolved when dilute hydrochloric acid reacts with sodium sulphite is:", options: ["Hydrogen", "Hydrogen sulphide", "Sulphur dioxide", "Carbon dioxide"], marks: 1 },
            { number: "(v)", text: "Which of the following is a covalent compound?", options: ["Sodium chloride", "Magnesium oxide", "Carbon tetrachloride", "Calcium chloride"], marks: 1 },
            { number: "(vi)", text: "The number of atoms present in 12 g of carbon-12 is:", options: ["6.022 × 10²²", "6.022 × 10²³", "3.011 × 10²³", "12 × 10²³"], marks: 1 },
            { number: "(vii)", text: "An element X has electronic configuration 2, 8, 2. It belongs to:", options: ["Group 2, Period 3", "Group 3, Period 2", "Group 2, Period 2", "Group 8, Period 3"], marks: 1 },
            { number: "(viii)", text: "The catalyst used in the Contact Process for manufacturing sulphuric acid is:", options: ["Vanadium pentoxide", "Platinum", "Iron", "Nickel"], marks: 1 },
            { number: "(ix)", text: "Which of the following is a basic salt?", options: ["NaCl", "Na₂CO₃", "NaHCO₃", "CuSO₄"], marks: 1 },
            { number: "(x)", text: "The hydrocarbon with the general formula CₙH₂ₙ belongs to the homologous series of:", options: ["Alkanes", "Alkenes", "Alkynes", "Arenes"], marks: 1 },
            { number: "(xi)", text: "Assertion (A): Ammonia gas is collected by downward displacement of air.\nReason (R): Ammonia is lighter than air and highly soluble in water.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(xii)", text: "The ore of aluminium is:", options: ["Haematite", "Bauxite", "Zinc blende", "Cinnabar"], marks: 1 },
            { number: "(xiii)", text: "The IUPAC name of CH₃-CH₂-CH₂-OH is:", options: ["Propanal", "Propanone", "Propanol", "Propanoic acid"], marks: 1 },
            { number: "(xiv)", text: "Which of the following metals reacts with cold water to produce hydrogen gas?", options: ["Iron", "Zinc", "Sodium", "Magnesium"], marks: 1 },
            { number: "(xv)", text: "The colour of ferric hydroxide precipitate when treated with sodium hydroxide solution is:", options: ["White", "Blue", "Green", "Reddish brown"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Name the following:\n(a) The process of electrolysis used to purify a metal.\n(b) The bond formed when two atoms share a pair of electrons.\n(c) The salt formed by partial replacement of hydrogen ions of an acid by a metal.\n(d) The gas that turns lime water milky.\n(e) The element with the smallest atomic size in Period 3.", marks: 5 },
            { number: "(ii)", text: "Match Column A with Column B:\n(a) Sodium hydroxide → ?\n(b) Sodium hydrogen carbonate → ?\n(c) Acetic acid → ?\n(d) Ammonia → ?\n(e) Nitric acid → ?", marks: 5 },
            { number: "(iii)", text: "Complete the following:\n(a) An element with electronic configuration 2, 8, 1 will form an ion with charge [+1 / -1].\n(b) During electrolysis, cations migrate towards the [anode / cathode].\n(c) Concentrated sulphuric acid is a [dehydrating / reducing] agent.\n(d) In the periodic table, the most electropositive elements are placed on the [left / right] side.\n(e) The functional group present in alcohols is [-OH / -COOH].", marks: 5 },
            { number: "(iv)", text: "Identify the following:\n(a) A metal which reacts with nitric acid to produce hydrogen gas.\n(b) A compound which turns anhydrous copper sulphate blue.\n(c) The gas evolved when ammonium chloride reacts with sodium hydroxide.\n(d) The type of bond present in ammonium ion.\n(e) The alloy consisting of copper and tin.", marks: 5 },
            { number: "(v)", text: "(a) Draw the structural formula for: 1. Ethanoic acid 2. Propane 3. But-2-ene\n(b) Give the IUPAC name of: 1. CH₃-CH₂-CHO 2. CH₃-CO-CH₃", marks: 5 }
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
          text: "(i) Define Electrolysis. Difference between electrolyte and non-electrolyte with examples. [3]\n(ii) Explain electrolysis of acidified water using platinum electrodes. Write reactions at anode and cathode. [3]\n(iii) What is electroplating? State two reasons for electroplating. [2]\n(iv) In electroplating silver onto copper spoon, name: (a) Electrolyte used (b) Material of anode. [2]",
          marks: 10
        },
        {
          number: "4",
          text: "(i) State Mendeleev's Periodic Law. How did Mendeleev classify elements? [2]\n(ii) Element X has electronic configuration 2, 8, 5. Answer: (a) Atomic number (b) Group and Period (c) Metal or non-metal? [3]\n(iii) Explain trends in atomic size along a period and down a group. Give reasons. [3]\n(iv) What is electronegativity? How does it vary in Group 17? [2]",
          marks: 10
        },
        {
          number: "5",
          text: "(i) Write balanced equations for: (a) HCl from NaCl (b) Ammonia from ammonium chloride. [3]\n(ii) Explain the fountain experiment for HCl solubility. [3]\n(iii) Give reasons: (a) HCl can't be stored in Al containers (b) NH₃ not collected over water. [2]\n(iv) Name gas when NH₃ reacts with: (a) Heated CuO (b) Excess chlorine. [2]",
          marks: 10
        },
        {
          number: "6",
          text: "(i) Describe Contact Process for H₂SO₄ manufacture with conditions and equations. [4]\n(ii) Two differences between dilute and concentrated H₂SO₄. [2]\n(iii) Write balanced equations: (a) Conc. H₂SO₄ + Cu (b) Conc. H₂SO₄ + sugar (c) Dil. H₂SO₄ + Na₂CO₃ (d) Dil. H₂SO₄ + Zn. [4]",
          marks: 10
        },
        {
          number: "7",
          text: "(i) Define Mole. Calculate moles in: (a) 22 g CO₂ (b) 3.011 × 10²³ oxygen atoms. [3]\n(ii) State Avogadro's Law. Volume of 1 mole gas at STP? [2]\n(iii) Calculate percentage composition of H₂O. [2]\n(iv) Find empirical formula: 40% C, 6.67% H, 53.33% O. [3]",
          marks: 10
        },
        {
          number: "8",
          text: "(i) Explain extraction of aluminium from bauxite by electrolytic reduction with Baeyer's Process and electrode reactions. [4]\n(ii) What are alloys? Composition and uses of (a) Brass (b) Stainless steel. [3]\n(iii) Write balanced equations: (a) Dil. HCl + Na₂CO₃ (b) NaOH + Zn (c) Thermal decomposition of Pb(NO₃)₂. [3]",
          marks: 10
        }
      ]
    }
  ]
};

export const chemistryPaper1Answers: TYQAnswerKey = {
  subject: "Chemistry",
  subjectId: "chemistry",
  paperNumber: 1,
  answers: [
    { questionNumber: "1(i)", answer: "(c) Chlorine" },
    { questionNumber: "1(ii)", answer: "(b) Sugar" },
    { questionNumber: "1(iii)", answer: "(a) Both A and R are true, and R is the correct explanation of A" },
    { questionNumber: "1(iv)", answer: "(c) Sulphur dioxide" },
    { questionNumber: "1(v)", answer: "(c) Carbon tetrachloride" },
    { questionNumber: "1(vi)", answer: "(b) 6.022 × 10²³" },
    { questionNumber: "1(vii)", answer: "(a) Group 2, Period 3" },
    { questionNumber: "1(viii)", answer: "(a) Vanadium pentoxide" },
    { questionNumber: "1(ix)", answer: "(b) Na₂CO₃" },
    { questionNumber: "1(x)", answer: "(b) Alkenes" },
    { questionNumber: "1(xi)", answer: "(a) Both A and R are true, and R is the correct explanation of A" },
    { questionNumber: "1(xii)", answer: "(b) Bauxite" },
    { questionNumber: "1(xiii)", answer: "(c) Propanol" },
    { questionNumber: "1(xiv)", answer: "(c) Sodium" },
    { questionNumber: "1(xv)", answer: "(d) Reddish brown" },
    { questionNumber: "2(i)", answer: "(a) Electrorefining\n(b) Covalent bond\n(c) Acid salt\n(d) Carbon dioxide\n(e) Chlorine" },
    { questionNumber: "2(ii)", answer: "(a) Sodium hydroxide → Strong base\n(b) Sodium hydrogen carbonate → Acid salt\n(c) Acetic acid → Weak electrolyte\n(d) Ammonia → Haber's process\n(e) Nitric acid → Oxidizing agent" },
    { questionNumber: "2(iii)", answer: "(a) +1\n(b) cathode\n(c) dehydrating\n(d) left\n(e) -OH" },
    { questionNumber: "2(iv)", answer: "(a) Magnesium\n(b) Water\n(c) Ammonia\n(d) Coordinate bond / Dative bond\n(e) Bronze" },
    { questionNumber: "2(v)", answer: "(a) Structural formulas: 1. CH₃-COOH 2. CH₃-CH₂-CH₃ 3. CH₃-CH=CH-CH₃\n(b) IUPAC names: 1. Propanal 2. Propanone (Acetone)" },
    { questionNumber: "3(i)", answer: "Electrolysis: Chemical decomposition of an electrolyte by electric current.\nElectrolyte: Conducts electricity in aqueous/molten state (e.g. NaCl).\nNon-electrolyte: Does not conduct (e.g. Sugar)." },
    { questionNumber: "3(ii)", answer: "At cathode: 2H⁺ + 2e⁻ → H₂\nAt anode: 2OH⁻ → H₂O + ½O₂ + 2e⁻\nVolume ratio H₂:O₂ = 2:1" },
    { questionNumber: "3(iii)", answer: "Electroplating: Coating metal by electrolysis. Reasons: Prevent corrosion; improve appearance." },
    { questionNumber: "3(iv)", answer: "(a) Silver nitrate solution\n(b) Pure silver metal" },
    { questionNumber: "4(i)", answer: "Properties of elements are periodic function of atomic masses. Classified by atomic mass in groups and periods." },
    { questionNumber: "4(ii)", answer: "(a) Atomic number = 15\n(b) Group 15 (VA), Period 3\n(c) Non-metal" },
    { questionNumber: "4(iii)", answer: "Along period: Decreases (nuclear charge increases).\nDown group: Increases (new shells added)." },
    { questionNumber: "4(iv)", answer: "Electronegativity: Tendency to attract shared electrons. Group 17: Decreases down group (F highest)." },
    { questionNumber: "5(i)", answer: "(a) NaCl + H₂SO₄(conc.) → NaHSO₄ + HCl\n(b) 2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2H₂O + 2NH₃" },
    { questionNumber: "5(ii)", answer: "Flask with dry HCl + jet tube → water with litmus enters → fountain forms → litmus turns red → shows high solubility." },
    { questionNumber: "5(iii)", answer: "(a) Al reacts with HCl, corroding container\n(b) NH₃ is highly soluble in water, would dissolve." },
    { questionNumber: "5(iv)", answer: "(a) Nitrogen (N₂)\n(b) Nitrogen trichloride (NCl₃)" },
    { questionNumber: "6(i)", answer: "S + O₂ → SO₂\n2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅, 450°C, 2 atm)\nSO₃ + H₂SO₄ → H₂S₂O₇ (oleum)\nH₂S₂O₇ + H₂O → 2H₂SO₄" },
    { questionNumber: "6(ii)", answer: "Dilute: Typical acid. Concentrated: Oxidizing and dehydrating agent." },
    { questionNumber: "6(iii)", answer: "(a) Cu + 2H₂SO₄(conc.) → CuSO₄ + SO₂ + 2H₂O\n(b) C₁₂H₂₂O₁₁ → 12C + 11H₂O\n(c) Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂\n(d) Zn + H₂SO₄ → ZnSO₄ + H₂" },
    { questionNumber: "7(i)", answer: "Mole: Amount containing 6.022 × 10²³ particles.\n(a) 22/44 = 0.5 mol\n(b) 3.011×10²³/6.022×10²³ = 0.5 mol" },
    { questionNumber: "7(ii)", answer: "Equal volumes of gases at same T & P have same number of molecules. 1 mole = 22.4 L at STP." },
    { questionNumber: "7(iii)", answer: "% H = 11.11%, % O = 88.89%" },
    { questionNumber: "7(iv)", answer: "Empirical formula: CH₂O" },
    { questionNumber: "8(i)", answer: "Baeyer's Process: Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O\nElectrolysis: Alumina in cryolite\nCathode: Al³⁺ + 3e⁻ → Al\nAnode: 2O²⁻ → O₂ + 4e⁻" },
    { questionNumber: "8(ii)", answer: "(a) Brass: Cu 60-80% + Zn 20-40%. Uses: instruments, screws.\n(b) Stainless steel: Fe + Cr 12-18% + Ni 8-10%. Uses: cutlery, surgical instruments." },
    { questionNumber: "8(iii)", answer: "(a) Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂\n(b) Zn + 2NaOH → Na₂ZnO₂ + H₂\n(c) 2Pb(NO₃)₂ → 2PbO + 4NO₂ + O₂" }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const chemistryPaper2: TYQPaper = {
  subject: "Chemistry",
  subjectId: "chemistry",
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
            { number: "(i)", text: "Which of the following elements has the smallest atomic radius?", options: ["Lithium", "Sodium", "Potassium", "Rubidium"], marks: 1 },
            { number: "(ii)", text: "The gas liberated when dilute hydrochloric acid reacts with sodium carbonate is:", options: ["Hydrogen", "Chlorine", "Carbon dioxide", "Oxygen"], marks: 1 },
            { number: "(iii)", text: "Assertion (A): In the periodic table, elements in the same group have similar chemical properties.\nReason (R): Elements in the same group have the same number of valence electrons.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(iv)", text: "The number of moles in 44.8 litres of carbon dioxide at STP is:", options: ["1 mole", "2 moles", "3 moles", "4 moles"], marks: 1 },
            { number: "(v)", text: "Which of the following is an electrovalent compound?", options: ["Methane", "Hydrogen chloride", "Sodium chloride", "Carbon tetrachloride"], marks: 1 },
            { number: "(vi)", text: "The catalyst used in the Haber's process for manufacturing ammonia is:", options: ["Vanadium pentoxide", "Iron with molybdenum promoter", "Platinum", "Nickel"], marks: 1 },
            { number: "(vii)", text: "An element with electronic configuration 2, 8, 8, 1 belongs to:", options: ["Group 1, Period 4", "Group 2, Period 4", "Group 1, Period 3", "Group 8, Period 4"], marks: 1 },
            { number: "(viii)", text: "The acid that does not form an acid salt is:", options: ["Sulphuric acid", "Hydrochloric acid", "Phosphoric acid", "Carbonic acid"], marks: 1 },
            { number: "(ix)", text: "The gas that turns potassium dichromate paper green is:", options: ["Hydrogen", "Oxygen", "Sulphur dioxide", "Carbon dioxide"], marks: 1 },
            { number: "(x)", text: "The functional group present in aldehydes is:", options: ["-OH", "-CHO", "-COOH", "-CO-"], marks: 1 },
            { number: "(xi)", text: "Assertion (A): Aluminium oxide is amphoteric in nature.\nReason (R): It reacts with both acids and bases to form salts and water.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(xii)", text: "The alloy used in making fuse wires is:", options: ["Brass", "Bronze", "Solder", "Duralumin"], marks: 1 },
            { number: "(xiii)", text: "The IUPAC name of CH₃-CH₂-CH₂-CHO is:", options: ["Butanal", "Butanone", "Butanol", "Butanoic acid"], marks: 1 },
            { number: "(xiv)", text: "Which of the following metals does not react with dilute hydrochloric acid?", options: ["Magnesium", "Zinc", "Iron", "Copper"], marks: 1 },
            { number: "(xv)", text: "The colour of copper hydroxide precipitate when treated with excess ammonium hydroxide is:", options: ["White", "Blue", "Inky blue / deep blue", "Green"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Name the following:\n(a) The process of converting a solid directly into vapour on heating.\n(b) The bond formed by the transfer of electrons from one atom to another.\n(c) A salt formed by the complete neutralization of an acid by a base.\n(d) The gas that turns lead acetate paper black.\n(e) The element with the highest ionization potential in Period 2.", marks: 5 },
            { number: "(ii)", text: "Match Column A with Column B:\n(a) Ostwald's process → ?\n(b) Contact process → ?\n(c) Haber's process → ?\n(d) Caustic soda → ?\n(e) Marsh gas → ?", marks: 5 },
            { number: "(iii)", text: "Complete the following:\n(a) Down a group, ionization potential generally [increases / decreases].\n(b) An electrolyte conducts electricity due to movement of [electrons / ions].\n(c) Concentrated nitric acid is a [reducing / oxidizing] agent.\n(d) Number of carbon atoms in propane is [2 / 3 / 4].\n(e) A solution with pH 10 will turn litmus paper [red / blue].", marks: 5 },
            { number: "(iv)", text: "Identify the following:\n(a) A metal which is liquid at room temperature.\n(b) A compound used to remove temporary hardness of water.\n(c) The gas evolved when sodium sulphite reacts with dilute HCl.\n(d) The type of bond present in water molecule.\n(e) The ore of iron.", marks: 5 },
            { number: "(v)", text: "(a) Draw structural formula for: 1. Ethanol 2. Propene 3. 2-methyl propane\n(b) Give IUPAC name of: 1. CH₃-CH₂-COOH 2. CH₃-CH=CH-CH₃", marks: 5 }
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
          text: "(i) Define Covalent bond. Show formation of (a) Cl₂ (b) H₂O with electron dot diagrams. [4]\n(ii) Give three differences between electrovalent and covalent compounds. [3]\n(iii) What is coordinate bond? Explain formation of NH₄⁺ with electron dot diagram. [3]",
          marks: 10
        },
        {
          number: "4",
          text: "(i) State Modern Periodic Law. How many groups and periods? [2]\n(ii) Element X, atomic number 12. (a) Electronic configuration (b) Group and Period (c) Metal/non-metal? Formula of oxide. [3]\n(iii) Trend in ionization potential along period and down group. Give reasons. [3]\n(iv) What is electron affinity? How does it vary in Group 1? [2]",
          marks: 10
        },
        {
          number: "5",
          text: "(i) Write balanced equations for: (a) HNO₃ from NaNO₃ (b) H₂ from Zn + dil. H₂SO₄. [3]\n(ii) Explain fountain experiment for NH₃ solubility. [3]\n(iii) Give reasons: (a) H₂SO₄ called 'King of Chemicals' (b) HNO₃ stored in brown bottles. [2]\n(iv) Name gas when HNO₃ reacts with: (a) Copper (b) Carbon. [2]",
          marks: 10
        },
        {
          number: "6",
          text: "(i) Describe Haber's Process for NH₃ manufacture with conditions, catalyst, equations. [4]\n(ii) Two differences between dilute and concentrated HNO₃. [2]\n(iii) Write balanced equations: (a) Conc. HNO₃ + Cu (b) HNO₃ + Na₂CO₃ (c) NH₃ + HCl (d) Thermal decomposition of NH₄Cl. [4]",
          marks: 10
        },
        {
          number: "7",
          text: "(i) Define Atomic mass unit. Calculate molecular mass of (a) H₂SO₄ (b) Glucose. [3]\n(ii) State Gay Lussac's Law of Combining Volumes with example. [2]\n(iii) Calculate number of molecules in: (a) 36 g water (b) 11.2 L O₂ at STP. [2]\n(iv) Find empirical and molecular formula: 92.3% C, 7.7% H. Molecular mass = 78. [3]",
          marks: 10
        },
        {
          number: "8",
          text: "(i) What is Metallurgy? Explain steps: crushing, concentration, conversion to oxide, reduction, refining. [4]\n(ii) What are amphoteric oxides? Two examples with equations. [3]\n(iii) Write balanced equations: (a) NaOH + Al (b) Heat on ZnCO₃ (c) Dil. H₂SO₄ + Pb(NO₃)₂. [3]",
          marks: 10
        }
      ]
    }
  ]
};

export const chemistryPaper2Answers: TYQAnswerKey = {
  subject: "Chemistry",
  subjectId: "chemistry",
  paperNumber: 2,
  answers: [
    { questionNumber: "1(i)", answer: "(a) Lithium" },
    { questionNumber: "1(ii)", answer: "(c) Carbon dioxide" },
    { questionNumber: "1(iii)", answer: "(a) Both A and R are true, and R is the correct explanation of A" },
    { questionNumber: "1(iv)", answer: "(b) 2 moles" },
    { questionNumber: "1(v)", answer: "(c) Sodium chloride" },
    { questionNumber: "1(vi)", answer: "(b) Iron with molybdenum promoter" },
    { questionNumber: "1(vii)", answer: "(a) Group 1, Period 4" },
    { questionNumber: "1(viii)", answer: "(b) Hydrochloric acid" },
    { questionNumber: "1(ix)", answer: "(c) Sulphur dioxide" },
    { questionNumber: "1(x)", answer: "(b) -CHO" },
    { questionNumber: "1(xi)", answer: "(a) Both A and R are true, and R is the correct explanation of A" },
    { questionNumber: "1(xii)", answer: "(c) Solder" },
    { questionNumber: "1(xiii)", answer: "(a) Butanal" },
    { questionNumber: "1(xiv)", answer: "(d) Copper" },
    { questionNumber: "1(xv)", answer: "(c) Inky blue / deep blue" },
    { questionNumber: "2(i)", answer: "(a) Sublimation\n(b) Electrovalent / Ionic bond\n(c) Normal salt\n(d) Hydrogen sulphide (H₂S)\n(e) Neon" },
    { questionNumber: "2(ii)", answer: "(a) Ostwald's process → Nitric acid\n(b) Contact process → Sulphuric acid\n(c) Haber's process → Ammonia\n(d) Caustic soda → Sodium hydroxide\n(e) Marsh gas → Methane" },
    { questionNumber: "2(iii)", answer: "(a) decreases\n(b) ions\n(c) oxidizing\n(d) 3\n(e) blue" },
    { questionNumber: "2(iv)", answer: "(a) Mercury\n(b) Calcium hydroxide / Slaked lime\n(c) Sulphur dioxide\n(d) Covalent bond\n(e) Haematite" },
    { questionNumber: "2(v)", answer: "(a) 1. CH₃-CH₂-OH 2. CH₃-CH=CH₂ 3. CH₃-CH(CH₃)-CH₃\n(b) 1. Propanoic acid 2. But-2-ene" },
    { questionNumber: "3(i)", answer: "Covalent bond: Formed by sharing electrons.\nCl₂: Each Cl shares 1 electron to achieve octet.\nH₂O: O shares 1 electron each with 2 H atoms." },
    { questionNumber: "3(ii)", answer: "Electrovalent: Transfer of electrons, high m.p./b.p., soluble in water.\nCovalent: Sharing of electrons, low m.p./b.p., insoluble in water." },
    { questionNumber: "3(iii)", answer: "Coordinate bond: Shared pair contributed entirely by one atom (donor). NH₄⁺: N in NH₃ donates lone pair to H⁺." },
    { questionNumber: "4(i)", answer: "Properties are periodic functions of atomic numbers. 18 groups and 7 periods." },
    { questionNumber: "4(ii)", answer: "(a) 2, 8, 2\n(b) Group 2, Period 3\n(c) Metal (alkaline earth). Oxide: MgO" },
    { questionNumber: "4(iii)", answer: "Along period: Increases (nuclear charge increases).\nDown group: Decreases (atomic size and shielding increase)." },
    { questionNumber: "4(iv)", answer: "Electron affinity: Energy released when atom accepts electron. Group 1: Decreases down group." },
    { questionNumber: "5(i)", answer: "(a) NaNO₃ + H₂SO₄(conc.) → NaHSO₄ + HNO₃\n(b) Zn + H₂SO₄(dil.) → ZnSO₄ + H₂" },
    { questionNumber: "5(ii)", answer: "Flask with dry NH₃ + jet tube → water with litmus enters → fountain → red litmus turns blue → shows high solubility." },
    { questionNumber: "5(iii)", answer: "(a) Most widely used industrial chemical for fertilizers, dyes, etc.\n(b) Decomposes in sunlight: 4HNO₃ → 4NO₂ + 2H₂O + O₂" },
    { questionNumber: "5(iv)", answer: "(a) NO₂ (nitrogen dioxide)\n(b) CO₂ and NO₂" },
    { questionNumber: "6(i)", answer: "N₂ + 3H₂ ⇌ 2NH₃ + Heat\nConditions: 450-500°C, 200-900 atm, Fe catalyst with Mo promoter. Unreacted gases recycled." },
    { questionNumber: "6(ii)", answer: "Dilute: Typical acid. Concentrated: Strong oxidizing agent." },
    { questionNumber: "6(iii)", answer: "(a) Cu + 4HNO₃(conc.) → Cu(NO₃)₂ + 2NO₂ + 2H₂O\n(b) Na₂CO₃ + 2HNO₃ → 2NaNO₃ + H₂O + CO₂\n(c) NH₃ + HCl → NH₄Cl\n(d) NH₄Cl → NH₃ + HCl (sublimes)" },
    { questionNumber: "7(i)", answer: "1 amu = 1/12 mass of C-12 atom.\n(a) H₂SO₄ = 98 u\n(b) C₆H₁₂O₆ = 180 u" },
    { questionNumber: "7(ii)", answer: "Gases react in simple volume ratios at same T & P. Example: H₂:O₂:H₂O = 2:1:2." },
    { questionNumber: "7(iii)", answer: "(a) 36/18 = 2 mol = 1.2044 × 10²⁴ molecules\n(b) 11.2/22.4 = 0.5 mol = 3.011 × 10²³ molecules" },
    { questionNumber: "7(iv)", answer: "Empirical: CH. Empirical mass = 13. n = 78/13 = 6. Molecular formula: C₆H₆ (Benzene)." },
    { questionNumber: "8(i)", answer: "Metallurgy: Extracting metal from ore.\nSteps: Crushing → Concentration → Conversion to oxide (roasting/calcination) → Reduction → Refining." },
    { questionNumber: "8(ii)", answer: "Amphoteric oxides react with both acids and bases.\nAl₂O₃ + 6HCl → 2AlCl₃ + 3H₂O\nAl₂O₃ + 2NaOH → 2NaAlO₂ + H₂O\nZnO + 2HCl → ZnCl₂ + H₂O\nZnO + 2NaOH → Na₂ZnO₂ + H₂O" },
    { questionNumber: "8(iii)", answer: "(a) 2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂\n(b) ZnCO₃ → ZnO + CO₂\n(c) Pb(NO₃)₂ + H₂SO₄ → PbSO₄↓ + 2HNO₃" }
  ]
};
