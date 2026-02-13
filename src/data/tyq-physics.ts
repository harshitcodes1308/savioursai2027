// Physics — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const physicsPaper1: TYQPaper = {
  subject: "Physics",
  subjectId: "physics",
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
          text: "Choose the correct answers to the questions from the given options. (Do not copy the question, write the correct answers only.)",
          marks: 15,
          subQuestions: [
            { number: "(i)", text: "The moment of a force about a given axis depends on:", options: ["Only the magnitude of force", "Only the distance from the axis", "Both magnitude of force and distance from axis", "Neither force nor distance"], marks: 1 },
            { number: "(ii)", text: "The refractive index of glass with respect to air is 1.5. The speed of light in glass is:", options: ["3 × 10⁸ m/s", "2 × 10⁸ m/s", "1.5 × 10⁸ m/s", "4.5 × 10⁸ m/s"], marks: 1 },
            { number: "(iii)", text: "Assertion: A fuse wire is always connected in series with live wire.\nReason: A fuse wire should have high resistance and low melting point.", options: ["Both are true, Reason explains Assertion", "Both true but Reason does not explain Assertion", "Assertion is true, Reason is false", "Assertion is false, Reason is true"], marks: 1 },
            { number: "(iv)", text: "The SI unit of specific heat capacity is:", options: ["J/kg", "J/kg°C", "J/°C", "cal/g°C"], marks: 1 },
            { number: "(v)", text: "When a ray of light passes from denser to rarer medium, the angle of refraction is:", options: ["Less than angle of incidence", "Greater than angle of incidence", "Equal to angle of incidence", "Always 90°"], marks: 1 },
            { number: "(vi)", text: "The velocity ratio of a single fixed pulley is:", options: ["0", "1", "2", "Greater than 1"], marks: 1 },
            { number: "(vii)", text: "In a step-up transformer:", options: ["Output voltage > Input voltage", "Output voltage < Input voltage", "Output voltage = Input voltage", "Output current > Input current"], marks: 1 },
            { number: "(viii)", text: "The frequency of sound depends on:", options: ["Amplitude of vibration", "Speed of sound", "Wavelength of sound", "Source of vibration"], marks: 1 },
            { number: "(ix)", text: "The mass number of an isotope of carbon is 14, which has 6 protons. The number of neutrons is:", options: ["6", "8", "14", "20"], marks: 1 },
            { number: "(x)", text: "The power of a convex lens of focal length 25 cm is:", options: ["+2D", "+4D", "-4D", "+0.25D"], marks: 1 },
            { number: "(xi)", text: "Assertion: Sound cannot travel through vacuum.\nReason: Sound waves need a material medium for propagation.", options: ["Both are true, Reason explains Assertion", "Both true but Reason does not explain", "Assertion true, Reason false", "Assertion false, Reason true"], marks: 1 },
            { number: "(xii)", text: "A body of mass 2 kg is lifted to a height of 10 m. The potential energy gained by the body is (g = 10 m/s²):", options: ["20 J", "200 J", "2000 J", "100 J"], marks: 1 },
            { number: "(xiii)", text: "The resistance of a wire of length l and cross-sectional area A is given by:", options: ["R = ρl/A", "R = ρA/l", "R = ρlA", "R = l/(ρA)"], marks: 1 },
            { number: "(xiv)", text: "The image formed by a concave mirror when the object is at the centre of curvature is:", options: ["Real, inverted, magnified", "Real, inverted, same size", "Virtual, erect, magnified", "Real, erect, same size"], marks: 1 },
            { number: "(xv)", text: "The calorific value of a fuel is measured in:", options: ["J/kg", "J/kg°C", "W", "N/m²"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Complete the following:\n(a) In a single fixed pulley, the effort is applied in the ______ direction.\n(b) The S.I. unit of electric current is ______.\n(c) The phenomenon of change of a liquid into vapour at any temperature below its boiling point is called ______.\n(d) Work done by a force is positive when the displacement is in the ______ of the force.\n(e) A short-sighted person should use a ______ lens.\n(f) The specific latent heat of fusion of ice is ______ cal/g.", marks: 6 },
            { number: "(ii)", text: "Match Column A with Column B:\n(a) Watt → ?\n(b) Joule → ?\n(c) Pascal → ?\n(d) Hertz → ?", marks: 4 },
            { number: "(iii)", text: "(a) What is the audible range of human ear?\n(b) Name the property of a wave used to determine its pitch.", marks: 2 }
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
          text: "(i)(a) State the principle of conservation of energy.\n(b) A ball of mass 0.2 kg is thrown vertically upwards with a velocity of 20 m/s. Find its maximum height and KE at half the maximum height (g=10m/s²). [4]\n(ii)(a) Define critical angle.\n(b) Calculate the critical angle for glass-air interface if μ = 1.5. [3]\n(iii)(a) What is meant by 'One kilowatt-hour'?\n(b) Calculate the cost of operating 5 lamps each of 100 W for 8 hours daily for 30 days if 1 kWh costs ₹5. [3]",
          marks: 10
        },
        {
          number: "4",
          text: "(i)(a) What is the function of a commutator in a DC motor?\n(b) An electric heater of resistance 44Ω is connected to a 220V supply. Find the current drawn and the heat produced in 5 minutes. [4]\n(ii)(a) Draw a ray diagram for a convex lens when the object is placed at 2F.\n(b) State two characteristics of the image formed. [3]\n(iii)(a) Define half-life of a radioactive element.\n(b) The half-life of a radioactive element is 20 years. What fraction will remain after 60 years? [3]",
          marks: 10
        },
        {
          number: "5",
          text: "(i)(a) State Ohm's law.\n(b) Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. Find the equivalent resistance.\n(ii)(a) What are electromagnetic waves?\n(b) Name and state the rule used to determine the direction of force on a current-carrying conductor in a magnetic field.\n(iii)(a) Define mechanical advantage of a simple machine.\n(b) A lever of effort arm 60 cm and load arm 40 cm is used to lift a load of 30 kgf. Find the effort needed.",
          marks: 10
        },
        {
          number: "6",
          text: "(i)(a) State the difference between nuclear fission and nuclear fusion.\n(b) Complete: ²³⁵U + ¹n → ⁵⁶Ba + ³⁶Kr + 3¹n + Energy.\n(ii)(a) A ray enters a glass slab (μ=1.5) at angle 30°. Find the angle of refraction.\n(b) Draw a labelled diagram showing refraction through a rectangular glass slab.\n(iii)(a) What is meant by escape velocity?\n(b) Name two conditions for total internal reflection.",
          marks: 10
        },
        {
          number: "7",
          text: "(i) A 2Ω wire is bent into a circle. Find the effective resistance between two diametrically opposite points. [3]\n(ii)(a) Define echo. (b) Calculate the time for an echo from a cliff 170 m away (speed of sound = 340 m/s). [4]\n(iii)(a) What is a couple? (b) Calculate the moment of a couple if each force is 5N and the distance between them is 0.3m. [3]",
          marks: 10
        }
      ]
    }
  ]
};

export const physicsPaper1Answers: TYQAnswerKey = {
  subject: "Physics",
  subjectId: "physics",
  paperNumber: 1,
  answers: [
    { questionNumber: "1(i)", answer: "(c) Both magnitude of force and distance from axis" },
    { questionNumber: "1(ii)", answer: "(b) 2 × 10⁸ m/s" },
    { questionNumber: "1(iii)", answer: "(a) Both true, Reason explains Assertion" },
    { questionNumber: "1(iv)", answer: "(b) J/kg°C" },
    { questionNumber: "1(v)", answer: "(b) Greater than angle of incidence" },
    { questionNumber: "1(vi)", answer: "(b) 1" },
    { questionNumber: "1(vii)", answer: "(a) Output voltage > Input voltage" },
    { questionNumber: "1(viii)", answer: "(d) Source of vibration" },
    { questionNumber: "1(ix)", answer: "(b) 8" },
    { questionNumber: "1(x)", answer: "(b) +4D" },
    { questionNumber: "1(xi)", answer: "(a) Both true, Reason explains Assertion" },
    { questionNumber: "1(xii)", answer: "(b) 200 J" },
    { questionNumber: "1(xiii)", answer: "(a) R = ρl/A" },
    { questionNumber: "1(xiv)", answer: "(b) Real, inverted, same size" },
    { questionNumber: "1(xv)", answer: "(a) J/kg" },
    { questionNumber: "2(i)", answer: "(a) downward\n(b) Ampere\n(c) evaporation\n(d) direction\n(e) concave\n(f) 80" },
    { questionNumber: "2(ii)", answer: "(a) Watt → Power\n(b) Joule → Work/Energy\n(c) Pascal → Pressure\n(d) Hertz → Frequency" },
    { questionNumber: "2(iii)", answer: "(a) 20 Hz to 20,000 Hz\n(b) Frequency" },
    { questionNumber: "3(i)", answer: "Max height = v²/(2g) = 400/20 = 20 m. KE at half = ½ × 0.2 × 200 = 2 J (half of PE)." },
    { questionNumber: "3(ii)", answer: "sin C = 1/μ = 1/1.5. Critical angle C ≈ 41.8°" },
    { questionNumber: "3(iii)", answer: "Energy = 5 × 100 × 8 × 30 / 1000 = 120 kWh. Cost = 120 × 5 = ₹600." },
    { questionNumber: "4(i)", answer: "Current I = V/R = 220/44 = 5A. Heat = I²Rt = 25 × 44 × 300 = 330,000 J." },
    { questionNumber: "4(ii)", answer: "Image at 2F, real, inverted, same size." },
    { questionNumber: "4(iii)", answer: "After 60 years = 3 half-lives: (1/2)³ = 1/8 remains." },
    { questionNumber: "5(i)", answer: "Equivalent resistance = 1 Ω." },
    { questionNumber: "5(ii)", answer: "Fleming's Left-Hand Rule." },
    { questionNumber: "5(iii)", answer: "Effort = Load × Load arm / Effort arm = 30 × 40/60 = 20 kgf." },
    { questionNumber: "6(i)", answer: "Fission: Heavy nucleus splits. Fusion: Light nuclei combine. Missing: ³⁶Kr." },
    { questionNumber: "6(ii)", answer: "sin r = sin 30° / 1.5 = 0.333. Angle r ≈ 19.5°." },
    { questionNumber: "7(i)", answer: "Two 1Ω in parallel = 0.5Ω." },
    { questionNumber: "7(ii)", answer: "Time = 2 × 170 / 340 = 1 s." },
    { questionNumber: "7(iii)", answer: "Moment = 5 × 0.3 = 1.5 Nm." }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const physicsPaper2: TYQPaper = {
  subject: "Physics",
  subjectId: "physics",
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
            { number: "(i)", text: "A couple produces a:", options: ["Translatory motion", "Rotatory motion", "Vibratory motion", "Oscillatory motion"], marks: 1 },
            { number: "(ii)", text: "Which of the following is a non-renewable source of energy?", options: ["Wind", "Natural gas", "Solar", "Tidal"], marks: 1 },
            { number: "(iii)", text: "The S.I. unit of power is:", options: ["Joule", "Newton", "Watt", "Pascal"], marks: 1 },
            { number: "(iv)", text: "The phenomenon of splitting of light into its constituent colours is called:", options: ["Reflection", "Refraction", "Dispersion", "Diffraction"], marks: 1 },
            { number: "(v)", text: "The critical angle is maximum for:", options: ["Glass", "Water", "Diamond", "Kerosene"], marks: 1 },
            { number: "(vi)", text: "The device used to measure the potential difference between two points in a circuit is called a:", options: ["Ammeter", "Voltmeter", "Galvanometer", "Rheostat"], marks: 1 },
            { number: "(vii)", text: "In an AC generator, the current in the coil is reversed by the:", options: ["Slip rings", "Brushes", "Split rings", "Armature"], marks: 1 },
            { number: "(viii)", text: "The fundamental frequency of a sound wave is 200 Hz. What is its time period?", options: ["200 s", "0.5 s", "0.05 s", "0.005 s"], marks: 1 },
            { number: "(ix)", text: "Which of the following has the highest specific heat capacity?", options: ["Iron", "Mercury", "Water", "Alcohol"], marks: 1 },
            { number: "(x)", text: "In a step-down transformer, the output voltage is:", options: ["Greater than the input voltage", "Equal to the input voltage", "Less than the input voltage", "Zero"], marks: 1 },
            { number: "(xi)", text: "The force acting on a unit positive test charge placed at a point in an electric field is called:", options: ["Electric current", "Electric potential", "Electric power", "Electric field intensity"], marks: 1 },
            { number: "(xii)", text: "A 100 g iron ball at 90°C is dropped into 100 g of water at 20°C. The final temperature will be:", options: ["55°C", "less than 55°C", "more than 55°C", "70°C"], marks: 1 },
            { number: "(xiii)", text: "The unit of radioactivity is:", options: ["Roentgen", "Curie", "Rutherford", "All of these"], marks: 1 },
            { number: "(xiv)", text: "A concave lens always forms an image which is:", options: ["Real and inverted", "Virtual and erect", "Real and erect", "Virtual and inverted"], marks: 1 },
            { number: "(xv)", text: "For a body starting from rest, the kinetic energy is:", options: ["directly proportional to the velocity", "directly proportional to the square of the velocity", "inversely proportional to the velocity", "inversely proportional to the square of the velocity"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Complete the following by choosing the correct answer:\n(a) The turning effect of force is called its ______ (moment / impulse).\n(b) The ratio of the mass of a substance to the mass of an equal volume of water at 4°C is its ______ (density / relative density).\n(c) The angle through which the emergent ray deviates from the incident ray is called the angle of ______ (deviation / emergence).\n(d) In a conductor, current flows from ______ (higher potential to lower potential / lower potential to higher potential).\n(e) The temperature at which a liquid boils is called its ______ (melting point / boiling point).\n(f) The nucleus of an atom consists of ______ (protons and electrons / protons and neutrons).", marks: 6 },
            { number: "(ii)", text: "Match physical quantity in Column A with its S.I. unit in Column B:\n(a) Pressure → ?\n(b) Work → ?\n(c) Moment of force → ?", marks: 3 },
            { number: "(iii)", text: "(a) What is the audible range of frequencies for a normal human ear?\n(b) Name the characteristic of sound that helps distinguish between two sounds of the same loudness and pitch.", marks: 2 }
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
          text: "(i)(a) State the principle of moments.\n(b) A metre scale balanced at its centre. Two coins (5g each) at 10 cm mark balance at 15 cm. Calculate the mass of the scale. [4]\n(ii)(a) What is the power of accommodation of the human eye?\n(b) Name the lens to correct: (1) Myopia (2) Hypermetropia. [3]\n(iii)(a) Define specific heat capacity.\n(b) 200 g of water at 80°C is mixed with 100 g at 20°C. Find the final temperature. [3]",
          marks: 10
        },
        {
          number: "4",
          text: "(i)(a) What is the function of a fuse?\n(b) Electric iron of 750W, 220V. Calculate current drawn and fuse rating. [4]\n(ii) A ray enters a prism at 45°. Critical angle is 42°. Will total internal reflection occur? Draw the path. [4]\n(iii)(a) Define radioactivity.\n(b) Name two types of radiation. Which has highest ionizing power? [2]",
          marks: 10
        },
        {
          number: "5",
          text: "(i)(a) 1 kWh = ? J\n(b) Two bulbs A (100W) and B (60W) in series at 220V. Which glows brighter? [3]\n(ii)(a) Two factors affecting induced e.m.f. in Faraday's experiment.\n(b) Fleming's Right-Hand Rule. [4]\n(iii)(a) Define velocity ratio.\n(b) Velocity ratio of inclined plane = l/h. [3]",
          marks: 10
        },
        {
          number: "6",
          text: "(i)(a) Fission vs Fusion.\n(b) Complete: ²³⁵U + ¹n → ¹⁴⁴Ba + ? + 3¹n + Energy. [4]\n(ii)(a) Glass slab μ=1.5, angle of incidence 45°. Find angle of refraction.\n(b) Draw ray diagram for glass slab. [4]\n(iii)(a) What is a geostationary satellite? [2]",
          marks: 10
        },
        {
          number: "7",
          text: "(i) A 4Ω wire bent into a circle. Find effective resistance between diametrically opposite points. [3]\n(ii)(a) Define echo.\n(b) Calculate time for echo from a cliff 75 m away (speed = 340 m/s). [3]\n(iii)(a) What is a couple? Example.\n(b) Moment of force = 2N × 0.20m = ? [4]",
          marks: 10
        }
      ]
    }
  ]
};

export const physicsPaper2Answers: TYQAnswerKey = {
  subject: "Physics",
  subjectId: "physics",
  paperNumber: 2,
  answers: [
    { questionNumber: "1(i)", answer: "(b) Rotatory motion" },
    { questionNumber: "1(ii)", answer: "(b) Natural gas" },
    { questionNumber: "1(iii)", answer: "(c) Watt" },
    { questionNumber: "1(iv)", answer: "(c) Dispersion" },
    { questionNumber: "1(v)", answer: "(b) Water" },
    { questionNumber: "1(vi)", answer: "(b) Voltmeter" },
    { questionNumber: "1(vii)", answer: "(c) Split rings" },
    { questionNumber: "1(viii)", answer: "(d) 0.005 s" },
    { questionNumber: "1(ix)", answer: "(c) Water" },
    { questionNumber: "1(x)", answer: "(c) Less than the input voltage" },
    { questionNumber: "1(xi)", answer: "(d) Electric field intensity" },
    { questionNumber: "1(xii)", answer: "(b) less than 55°C" },
    { questionNumber: "1(xiii)", answer: "(d) All of these" },
    { questionNumber: "1(xiv)", answer: "(b) Virtual and erect" },
    { questionNumber: "1(xv)", answer: "(b) directly proportional to the square of the velocity" },
    { questionNumber: "2(i)", answer: "(a) moment\n(b) relative density\n(c) deviation\n(d) higher potential to lower potential\n(e) boiling point\n(f) protons and neutrons" },
    { questionNumber: "2(ii)", answer: "(a) Pressure → Pascal (Pa)\n(b) Work → Joule (J)\n(c) Moment of force → Newton metre (Nm)" },
    { questionNumber: "2(iii)", answer: "(a) 20 Hz to 20,000 Hz\n(b) Quality (Timbre)" },
    { questionNumber: "3(i)", answer: "Principle of moments: Sum of clockwise moments = Sum of anticlockwise moments. Mass of scale ≈ 1.43 g." },
    { questionNumber: "3(ii)", answer: "(1) Myopia → Concave lens\n(2) Hypermetropia → Convex lens" },
    { questionNumber: "3(iii)", answer: "Final temperature T = 60°C" },
    { questionNumber: "4(i)", answer: "I = P/V = 750/220 = 3.41 A. Fuse rating: 5 A." },
    { questionNumber: "4(ii)", answer: "Yes, 45° > 42° (critical angle). Total internal reflection occurs." },
    { questionNumber: "4(iii)", answer: "Alpha (α) has the highest ionizing power." },
    { questionNumber: "5(i)", answer: "1 kWh = 3.6 × 10⁶ J. The 60W bulb glows brighter (higher resistance in series)." },
    { questionNumber: "5(ii)", answer: "Fleming's Right-Hand Rule: Forefinger (field), Thumb (motion), Middle finger (current)." },
    { questionNumber: "5(iii)", answer: "V.R. = l/h" },
    { questionNumber: "6(i)", answer: "Fission: Heavy splits. Fusion: Light combine. Missing: ³⁶Kr (Krypton-89)." },
    { questionNumber: "6(ii)", answer: "sin r = sin 45° / 1.5 = 0.4714. r ≈ 28.13°." },
    { questionNumber: "6(iii)", answer: "Geostationary satellite: Orbits above equator with 24-hour period." },
    { questionNumber: "7(i)", answer: "Each semicircle = 2Ω. Two 2Ω in parallel = 1Ω." },
    { questionNumber: "7(ii)", answer: "Time = 2 × 75 / 340 ≈ 0.44 s." },
    { questionNumber: "7(iii)", answer: "Couple: Two equal, opposite forces along different lines. Moment = 2 × 0.20 = 0.4 Nm." }
  ]
};
