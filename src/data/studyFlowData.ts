/**
 * Study Flow — Data Structure
 * 
 * Auto-generated from ICSE Study Flow PDFs.
 * Each subject contains chapters with 3 steps: Watch → Revise → Practice.
 */

export interface StudyFlowQuestion {
  question: string;
  answer: string;
}

export interface StudyFlowChapter {
  id: string;
  title: string;
  watch: { videoUrl: string; title: string };
  revise: { summary: string; bullets: string[] };
  practice: StudyFlowQuestion[];
}

export interface StudyFlowSubject {
  chapters: StudyFlowChapter[];
}

export type SubjectKey = "physics" | "chemistry" | "biology" | "mathematics" | "history" | "computer";

export type StudyFlowData = Record<SubjectKey, StudyFlowSubject>;

/** Subject display metadata */
export const SUBJECT_META: Record<SubjectKey | "english_language" | "geography", { label: string; icon: string; color: string }> = {
  physics:          { label: "Physics",          icon: "⚡", color: "#60A5FA" },
  chemistry:        { label: "Chemistry",        icon: "🧪", color: "#3ECF8E" },
  biology:          { label: "Biology",          icon: "🧬", color: "#FB923C" },
  mathematics:      { label: "Mathematics",      icon: "📐", color: "#A78BFA" },
  history:          { label: "History & Civics",  icon: "📜", color: "#F87171" },
  computer:         { label: "Computer",         icon: "💻", color: "#38BDF8" },
  english_language: { label: "English Language",  icon: "📝", color: "#94A3B8" },
  geography:        { label: "Geography",        icon: "🌍", color: "#94A3B8" },
};

/** All valid subject keys */
export const SUBJECT_KEYS: SubjectKey[] = ["physics", "chemistry", "biology", "mathematics", "history", "computer"];

/** Subjects that are coming soon */
export const COMING_SOON_SUBJECTS = ["english_language", "geography"] as const;

export const STUDY_FLOW_DATA: StudyFlowData = {
  physics: {
    chapters: [
      {
        id: "ph-ch1",
        title: "FORCE",
        watch: { videoUrl: "https://youtu.be/ONS_qjuKrq8?si=1bqyc_k2nqnRvu_-", title: "FORCE — One Shot Lecture" },
        revise: {
          summary: "A force can produce two types of motion: translational motion (body moves as a whole) and rotational motion (body turns about a fixed point). Moment of Force (Torque): The turning effect produced by a",
          bullets: [
            "A force can produce two types of motion: translational motion (body moves as a whole) and rotational motion (body turns about a fixed point).",
            "Moment of Force (Torque): The turning effect produced by a force about a fixed point.",
            "It is the product of the force and the perpendicular distance from the axis of rotation to the line of action of the force.",
            "Moment of Force = Force × Perpendicular Distance from the Axis SI Unit: Newton metre (N m).",
            "Common Examples: Opening a door, turning a steering wheel, pedalling a bicycle, using a spanner to loosen a nut.",
            "Clockwise and Anticlockwise Moments: If the turning effect rotates the body clockwise, it is a clockwise moment.",
            "If the turning effect rotates the body anticlockwise, it is an anticlockwise moment.",
            "A body is said to be in equilibrium when no net force and no net moment act on it.",
          ],
        },
        practice: [
          {
            question: "Define moment of force. State its SI and CGS units.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the two conditions for a body to be in equilibrium.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the principle of moments. Describe an experiment to verify it using a metre rule.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A uniform metre rule is pivoted at its 50 cm mark. A weight of 20 gf is suspended at the 10 cm mark. Find the position where a weight of 40 gf should be suspended to balance the rule.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is meant by centre of gravity? Where does the centre of gravity of a uniform circular disc lie?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch2",
        title: "WORK, ENERGY and POWER",
        watch: { videoUrl: "https://youtu.be/uhUTO6ilpZ4?si=NDKtDkkfXV6TlF-a", title: "WORK, ENERGY and POWER — One Shot Lecture" },
        revise: {
          summary: "Work is said to be done when a force acting on a body produces a displacement in the direction of the force. Mathematical Expression: \\( W = FS \\cos \\theta \\) Where F is the force, S is the displaceme",
          bullets: [
            "Work is said to be done when a force acting on a body produces a displacement in the direction of the force.",
            "Mathematical Expression: W = FS \\cos \\theta Where F is the force, S is the displacement, and θ is the angle between the force and displacement vectors.",
            "Special Cases: When θ = 0° (force and displacement in same direction): W = FS (maximum positive work).",
            "When θ = 90° (force perpendicular to displacement): W = 0 (no work done).",
            "Example: carrying a bag while walking horizontally.",
            "SI Unit of Work: Joule (J).",
            "Work done against gravity: W = mgh.",
            "Energy is the capacity to do work.",
          ],
        },
        practice: [
          {
            question: "Define work. Write the expression for work done when a force F acts at an angle θ to the displacement S. When is work said to be zero?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Derive the expressions for potential energy (U = mgh) and kinetic energy (K = ½ mv²).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the principle of conservation of energy. Show that the total mechanical energy of a freely falling body is conserved.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the energy transformation in an oscillating simple pendulum.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define power. State the relationship between work, energy and power. Convert 1 hp into watts.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch3",
        title: "MACHINES",
        watch: { videoUrl: "https://youtu.be/4bghi4g6UhA?si=oE6xkgvsqrAqzcRc", title: "MACHINES — One Shot Lecture" },
        revise: {
          summary: "Load (L): The resistance overcome by the machine. Effort (E): The force applied to the machine. Mechanical Advantage (MA): Ratio of load to effort. \\( MA = L / E \\) Velocity Ratio (VR): Ratio of veloc",
          bullets: [
            "Load (L): The resistance overcome by the machine.",
            "Effort (E): The force applied to the machine.",
            "Mechanical Advantage (MA): Ratio of load to effort.",
            "MA = L / E Velocity Ratio (VR): Ratio of velocity of effort to velocity of load.",
            "VR = V_E / V_L = d_E / d_L Efficiency (η): Ratio of output work to input work.",
            "η = W_o / W_i × 100\\% Relationship: η = MA / VR (always less than 1 for a practical machine).",
            "A lever is a rigid bar capable of turning about a fixed point called the fulcrum.",
            "Class I Lever (Fulcrum between Load and Effort): Examples: Seesaw, scissors, crowbar, pliers.",
          ],
        },
        practice: [
          {
            question: "Define the terms: Mechanical Advantage, Velocity Ratio, and Efficiency. Derive the relationship between them.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain why MA < VR for all practical machines. How can you make an ideal machine?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the three classes of levers. Give one example of each, including one from the human body. State the relative positions of fulcrum, load, and effort in each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a neat labelled diagram of a single movable pulley. Why is its MA equal to 2?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "In a block and tackle system with 4 pulleys, a load of 400 N is raised by an effort of 120 N. Calculate (a) VR, (b) MA, (c) efficiency.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch4",
        title: "REFRACTION of LIGHT at PLANE SURFACES",
        watch: { videoUrl: "https://youtu.be/5AVlCIOOJDs?si=TzcOySn-CcXk7CxH", title: "REFRACTION of LIGHT at PLANE SURFACES — One Shot Lecture" },
        revise: {
          summary: "Refraction is the change in the direction of light when it passes from one transparent medium to another opically different medium. Cause: Change in the speed of light in different media. Effect on Wa",
          bullets: [
            "Refraction is the change in the direction of light when it passes from one transparent medium to another opically different medium.",
            "Cause: Change in the speed of light in different media.",
            "Effect on Wave Properties: Frequency remains constant.",
            "The speed (v) and wavelength (λ) change.",
            "First Law: The incident ray, the refracted ray and the normal at the point of incidence all lie in the same plane.",
            "Second Law (Snell\'s Law): For a given pair of media, the ratio of the sine of the angle of incidence (i) to the sine of the angle of refraction (r) is a constant.",
            "\\sin i / \\sin r = constant = Refractive Index (μ).",
            "Absolute Refractive Index: The ratio of the speed of light in vacuum (c) to the speed of light in the medium (v).",
          ],
        },
        practice: [
          {
            question: "Define refraction of light. State the two laws of refraction.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define refractive index. Write its formula relating to the speed of light in vacuum.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A ray of light enters a glass slab at an angle of 45° to the normal. Explain its path with a labelled diagram. State the nature of the emergent ray.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is lateral displacement? State two factors on which it depends.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain why a coin placed at the bottom of a beaker filled with water appears raised. Define real and apparent depth.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch5",
        title: "REFRACTION THROUGH a LENS",
        watch: { videoUrl: "https://youtu.be/-A0yLShb85k?si=F_NF3Efyw94yCKqS", title: "REFRACTION THROUGH a LENS — One Shot Lecture" },
        revise: {
          summary: "A lens is a transparent refracting medium bounded by two spherical surfaces. Convex (Converging) Lens: Thicker in the centre, thinner at the edges. It converges parallel rays to a point. Concave (Dive",
          bullets: [
            "A lens is a transparent refracting medium bounded by two spherical surfaces.",
            "Convex (Converging) Lens: Thicker in the centre, thinner at the edges.",
            "It converges parallel rays to a point.",
            "Concave (Diverging) Lens: Thinner in the centre, thicker at the edges.",
            "It diverges parallel rays.",
            "Key Terms: Pole (O): The geometrical centre of the spherical surface of the lens.",
            "Principal Axis: The line joining the centres of curvature of the two surfaces.",
            "Optical Centre (C): The central point of the lens where a ray passes undeviated.",
          ],
        },
        practice: [
          {
            question: "Differentiate between a convex lens and a concave lens. Draw their symbols.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "With the help of ray diagrams, show the formation of the image by a convex lens when the object is placed (a) beyond 2F, (b) at 2F, and (c) between F and O.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the nature and position of the image formed by a convex lens when the object is at F.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Where must an object be placed before a convex lens to obtain a real image of the same size? Write your answer in terms of the lens formula.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "An object 5 cm high is placed at a distance of 20 cm from a convex lens of focal length 15 cm. Find the position, nature and size of the image.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch6",
        title: "SPECTRUM",
        watch: { videoUrl: "https://youtu.be/Vk1BaG_lbj0?si=Dj6t5smqA4R9AZMo", title: "SPECTRUM — One Shot Lecture" },
        revise: {
          summary: "Dispersion is the splitting of white light into its constituent colours when passed through a triangular prism. The band of seven colours obtained is called a spectrum. Order of colours: Violet, Indig",
          bullets: [
            "Dispersion is the splitting of white light into its constituent colours when passed through a triangular prism.",
            "The band of seven colours obtained is called a spectrum.",
            "Order of colours: Violet, Indigo, Blue, Green, Yellow, Orange, Red (VIBGYOR).",
            "Cause: The refractive index of glass is different for different colours (wavelengths).",
            "Violet light has the shortest wavelength and suffers maximum deviation.",
            "Red light has the longest wavelength and suffers minimum deviation.",
            "The entire range of electromagnetic radiations arranged in order of increasing wavelength.",
            "Complete Arrangement (Increasing Wavelength): Gamma rays → X rays → Ultraviolet (UV) rays → Visible Light → Infrared (IR) rays → Microwaves → Radio waves Properties Common to All Electromagnetic Waves: All travel at the speed of light in vacuum (3 × 10⁸ m/s).",
          ],
        },
        practice: [
          {
            question: "What is dispersion of light? Name the phenomenon that causes it. Draw a diagram of the dispersion of white light by a prism.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain why violet light deviates the most and red light deviates the least when passing through a prism.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the electromagnetic spectrum? Arrange the following in increasing order of wavelength: Infrared, X-rays, Gamma rays, Radio waves, Ultraviolet, Microwaves.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State any two properties common to all electromagnetic radiations.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State two uses each of: (a) Ultraviolet rays, (b) Infrared rays.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch7",
        title: "SOUND",
        watch: { videoUrl: "https://youtu.be/tme78Q0lTkY?si=9BBftoMLvAlDwWAX", title: "SOUND — One Shot Lecture" },
        revise: {
          summary: "Sound is a form of energy that produces a sensation of hearing. It travels in the form of longitudinal waves. Sound requires a material medium (solid, liquid, or gas) to travel. It cannot travel throu",
          bullets: [
            "Sound is a form of energy that produces a sensation of hearing.",
            "It travels in the form of longitudinal waves.",
            "Sound requires a material medium (solid, liquid, or gas) to travel.",
            "It cannot travel through a vacuum.",
            "Speed of sound: Solids > Liquids > Gases.",
            "Comparison with Light: Light travels much faster (3 × 10⁸ m/s) than sound (340 m/s in air).",
            "This explains why thunder is heard after the flash of lightning is seen.",
            "Frequency (f): Number of oscillations per second.",
          ],
        },
        practice: [
          {
            question: "Why can sound not travel through a vacuum? What type of wave is a sound wave in air?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "An observer hears thunder 3 seconds after seeing a lightning flash. How far is the lightning from the observer? (Speed of sound in air = 340 m/s)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the relationship between wave velocity, frequency and wavelength for sound waves. Calculate the wavelength of a sound wave of frequency 500 Hz and speed 340 m/s.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define the following: (a) Infrasonic sound, (b) Ultrasonic sound. Give one use of ultrasonic sound.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is SONAR? Name the type of waves used in SONAR and state its principle.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch8",
        title: "CALORIMETRY",
        watch: { videoUrl: "https://youtu.be/ZHG30f6aH5U?si=t_ff5hoSNDr2p1oT", title: "CALORIMETRY — One Shot Lecture" },
        revise: {
          summary: "Heat is a form of energy that flows from a body at a higher temperature to a body at a lower temperature. SI unit: Joule (J). Temperature is the degree of hotness or coldness of a body. It determines",
          bullets: [
            "Heat is a form of energy that flows from a body at a higher temperature to a body at a lower temperature.",
            "Temperature is the degree of hotness or coldness of a body.",
            "It determines the direction of heat flow.",
            "Units: Celsius (°C) and Kelvin (K).",
            "The amount of heat energy required to raise the temperature of a given body by 1°C (or 1 K).",
            "C\' = Q / \\Delta T SI unit: Joule per Kelvin (J/K) or Joule per °C.",
            "The amount of heat energy required to raise the temperature of unit mass (1 kg) of a substance by 1°C (or 1 K).",
            "c = Q / (m \\times \\Delta T) SI unit: Joule per kilogram per Kelvin (J kg⁻¹ K⁻¹).",
          ],
        },
        practice: [
          {
            question: "Define the term specific heat capacity. Write its SI unit. Differentiate between thermal capacity and specific heat capacity.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain, with an example, why water is used as a coolant in car radiators.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why does ice at 0°C produce a greater cooling effect than water at 0°C?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "200 g of hot water at 80°C is mixed with 300 g of cold water at 20°C. Calculate the final temperature of the mixture. (Specific heat capacity of water = 4.2 J/g°C)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the principle of calorimetry.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch9",
        title: "CURRENT ELECTRICITY",
        watch: { videoUrl: "https://youtu.be/mvZKUWQBuOc?si=Q7c51423lAFSB-kQ", title: "CURRENT ELECTRICITY — One Shot Lecture" },
        revise: {
          summary: "Electric Current (I): The rate of flow of electric charge (Q) through a cross section of a conductor. \\( I = Q / t \\) SI unit: Ampere (A). 1 A = 1 C/s. In metals, current is due to the flow of electro",
          bullets: [
            "Electric Current (I): The rate of flow of electric charge (Q) through a cross section of a conductor.",
            "I = Q / t SI unit: Ampere (A).",
            "In metals, current is due to the flow of electrons (conventional current direction is opposite to electron flow).",
            "Potential Difference (V): The work done (W) in moving a unit charge (Q) between two points in a circuit.",
            "V = W / Q SI unit: Volt (V).",
            "Electromotive Force (emf): The total energy supplied by a cell in moving a unit charge around a complete circuit.",
            "Also measured in Volt.",
            "For a given conductor, the current (I) flowing through it is directly proportional to the potential difference (V) applied across its ends, provided its temperature and other physical conditions remain constant.",
          ],
        },
        practice: [
          {
            question: "State Ohm\'s law. Describe an experiment with a circuit diagram to verify it. Draw the V-I graph for an ohmic resistor.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define resistance. State its SI unit. Name two factors on which the resistance of a conductor depends.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Derive an expression for the equivalent resistance of three resistors connected in (a) series, and (b) parallel.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Calculate the equivalent resistance when three resistors of 2 Ω, 3 Ω and 6 Ω are connected in parallel.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A wire of resistance 10 Ω is stretched to twice its original length. What is its new resistance?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch10",
        title: "ELECTRICAL POWER and HOUSEHOLD CIRCUITS",
        watch: { videoUrl: "https://youtu.be/C4ZWFlXvwnk?si=JksS0PG-Pqe9Iama", title: "ELECTRICAL POWER and HOUSEHOLD CIRCUITS — One Shot Lecture" },
        revise: {
          summary: "Electrical Energy (W): The work done by a source in driving current through a conductor. \\( W = QV = VIt = I^2Rt = (V^2 / R) t \\) Electrical Power (P): The rate of doing electrical work. \\( P = W / t",
          bullets: [
            "Electrical Energy (W): The work done by a source in driving current through a conductor.",
            "W = QV = VIt = I^2Rt = (V^2 / R) t Electrical Power (P): The rate of doing electrical work.",
            "P = W / t = VI = I^2R = V^2 / R SI Unit of Power: Watt (W).",
            "Larger Units: Kilowatt (kW), Megawatt (MW), Gigawatt (GW).",
            "Commercial Unit of Electrical Energy: Kilowatt hour (kW h).",
            "This is also called one \"unit\" or Board of Trade Unit (BOTU).",
            "Power Rating of Appliances: Higher wattage means more energy consumed per second.",
            "The main supply cable enters the house and goes to the kWh meter and then to the main fuse.",
          ],
        },
        practice: [
          {
            question: "Define electrical power. Write its SI unit and its relation with voltage and current.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "An electric heater of resistance 50 Ω is connected across 220 V. Calculate (a) current drawn, (b) power of the heater, and (c) energy consumed in 5 hours in kWh.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the commercial unit of electrical energy? Derive its relation with the joule.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the ring system of household wiring. Why are appliances connected in parallel?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the three wires used in domestic wiring. State their colour codes and functions.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch11",
        title: "ELECTROMAGNETISM",
        watch: { videoUrl: "https://youtu.be/277lWoUr36E?si=jNRMSRJ-d15woj3i", title: "ELECTROMAGNETISM — One Shot Lecture" },
        revise: {
          summary: "When an electric current passes through a straight conductor, a magnetic field is produced around it. The direction of the magnetic field is given by the Right Hand Thumb Rule: If the thumb points in",
          bullets: [
            "When an electric current passes through a straight conductor, a magnetic field is produced around it.",
            "The direction of the magnetic field is given by the Right Hand Thumb Rule: If the thumb points in the direction of current, the curled fingers give the direction of the magnetic field lines.",
            "A coil with many turns of insulated wire is called a solenoid.",
            "When current flows, it behaves like a bar magnet.",
            "The magnetic field inside a solenoid is uniform and parallel.",
            "An electromagnet is a solenoid with a soft iron core.",
            "It is a temporary magnet (magnetism lasts as long as current flows).",
            "Comparison of Electromagnet and Permanent Magnet: Electromagnet: Magnetism is temporary, strength can be varied, polarity can be reversed.",
          ],
        },
        practice: [
          {
            question: "State the Right Hand Thumb Rule. Draw the magnetic field lines around a straight current carrying conductor.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is an electromagnet? Give two differences between an electromagnet and a permanent magnet.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State Fleming\'s Left Hand Rule. Name a device that uses this rule.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "With a labelled diagram, describe the construction and working of a DC electric motor. State the function of the split ring commutator.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is electromagnetic induction? State Faraday\'s law.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ph-ch12",
        title: "RADIOACTIVITY",
        watch: { videoUrl: "https://youtu.be/V6hYbriPhqk?si=E3L6Ql82Mxeu2ce8", title: "RADIOACTIVITY — One Shot Lecture" },
        revise: {
          summary: "An atom consists of a tiny, dense, positively charged nucleus containing protons and neutrons. Electrons revolve around the nucleus. Atomic Number (Z): Number of protons in the nucleus. Determines the",
          bullets: [
            "An atom consists of a tiny, dense, positively charged nucleus containing protons and neutrons.",
            "Electrons revolve around the nucleus.",
            "Atomic Number (Z): Number of protons in the nucleus.",
            "Determines the element.",
            "Mass Number (A): Total number of protons and neutrons (nucleons) in the nucleus.",
            "Nuclear Structure Equation: A = Z + N (where N is the number of neutrons).",
            "Radioactivity is the phenomenon of spontaneous disintegration of the nuclei of heavy elements with the emission of alpha (α), beta (β) and gamma (γ) radiations.",
            "During alpha emission: Atomic number decreases by 2, mass number decreases by 4.",
          ],
        },
        practice: [
          {
            question: "Define the following terms: Atomic Number, Mass Number, and Nuclide.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is radioactivity? Name the three types of radiations emitted by a radioactive element.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Compare the ionising power and penetrating power of alpha, beta and gamma radiations.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A radioactive nucleus emits a beta particle. What changes occur in the atomic number and mass number? Give an example with equation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write the equation for the alpha decay of Uranium-238.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
    ],
  },
  chemistry: {
    chapters: [
      {
        id: "ch-ch1",
        title: "PERIODIC TABLE",
        watch: { videoUrl: "https://youtu.be/IePO2EmTQkQ?si=smF2po7LIKQuIs71", title: "PERIODIC TABLE — One Shot Lecture" },
        revise: {
          summary: "A. Dobereiner\'s Triads Dobereiner arranged elements into groups of three called triads. In each triad, the atomic mass of the middle element was approximately the average of the atomic masses of the o",
          bullets: [
            "Dobereiner\'s Triads Dobereiner arranged elements into groups of three called triads.",
            "In each triad, the atomic mass of the middle element was approximately the average of the atomic masses of the other two elements.",
            "Example: Lithium (Li), Sodium (Na), Potassium (K).",
            "Limitation: Dobereiner could identify only a few triads.",
            "Newlands\' Law of Octaves Newlands arranged elements in increasing order of atomic masses.",
            "He found that the properties of every eighth element were similar to the properties of the first element, just like the eighth note in music.",
            "Limitation: It worked well only for elements up to calcium.",
            "Later, new elements did not fit into this pattern.",
          ],
        },
        practice: [
          {
            question: "State Dobereiner\'s Law of Triads. Give one example of a triad. What was its limitation?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State Newlands\' Law of Octaves. Why was it discarded?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State Mendeleev\'s Periodic Law. Mention two achievements and two limitations of Mendeleev\'s Periodic Table.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the Modern Periodic Law. Who proposed it?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How many groups and periods are there in the Modern Periodic Table?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch2",
        title: "CHEMICAL BONDING",
        watch: { videoUrl: "https://youtu.be/oFPPJstX7N0?si=BhF9E205BSDdhPgg", title: "CHEMICAL BONDING — One Shot Lecture" },
        revise: {
          summary: "Chemical bonding is the force of attraction that holds atoms together in a molecule or compound. Atoms combine to achieve a stable electronic configuration, usually an octet (8 electrons) or duplet (2",
          bullets: [
            "Chemical bonding is the force of attraction that holds atoms together in a molecule or compound.",
            "Atoms combine to achieve a stable electronic configuration, usually an octet (8 electrons) or duplet (2 electrons for hydrogen) in their outermost shell.",
            "An electrovalent bond is formed by the complete transfer of one or more electrons from a metal atom to a non-metal atom.",
            "This results in the formation of positively charged cations and negatively charged anions.",
            "The electrostatic force of attraction between these oppositely charged ions holds them together.",
            "Electron Dot Structures of Electrovalent Compounds NaCl (Sodium Chloride): Sodium (2,8,1) loses one electron to form Na⁺.",
            "Chlorine (2,8,7) gains one electron to form Cl⁻.",
            "The oppositely charged ions attract each other.",
          ],
        },
        practice: [
          {
            question: "What is the Octet Rule? Explain why atoms combine with each other.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw the electron dot structures of the following: (a) Sodium Chloride (NaCl) (b) Magnesium Chloride (MgCl₂) (c) Calcium Oxide (CaO)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Give any three characteristic properties of electrovalent compounds.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw the electron dot structures of the following covalent molecules: (a) H₂ (b) O₂ (c) N₂ (d) CH₄ (e) CCl₄",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between polar and non-polar covalent compounds with an example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch3",
        title: "ACIDS, BASES and SALTS",
        watch: { videoUrl: "https://youtu.be/6gZsd4SG6hU?si=Hc_Bs2Dq3SHKlKMy", title: "ACIDS, BASES and SALTS — One Shot Lecture" },
        revise: {
          summary: "A. Acids Acids are substances that dissociate in aqueous solution to produce hydrogen ions (H⁺) or hydronium ions (H₃O⁺). H⁺ + H₂O → H₃O⁺ Properties: Sour taste. Turn blue litmus red. Conduct electric",
          bullets: [
            "Acids Acids are substances that dissociate in aqueous solution to produce hydrogen ions (H⁺) or hydronium ions (H₃O⁺).",
            "H⁺ + H₂O → H₃O⁺ Properties: Sour taste.",
            "Conduct electricity in aqueous solution.",
            "Examples: Hydrochloric acid (HCl), Sulphuric acid (H₂SO₄), Nitric acid (HNO₃).",
            "Bases (Alkalis) Bases are substances that dissociate in aqueous solution to produce hydroxyl ions (OH⁻).",
            "A water soluble base is called an alkali.",
            "Properties: Bitter taste, soapy touch.",
            "Conduct electricity in aqueous solution.",
          ],
        },
        practice: [
          {
            question: "Define acids and bases in terms of ions produced by them in aqueous solution.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What are hydronium ions? Write an equation to show their formation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the pH scale. How is pH paper used to determine the nature of a solution?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is a salt? Name four types of salts with one example each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between a normal salt and an acid salt.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch4",
        title: "ANALYTICAL CHEMISTRY",
        watch: { videoUrl: "https://youtu.be/GNKb__9uwcM?si=NS980--9fyOViRtn", title: "ANALYTICAL CHEMISTRY — One Shot Lecture" },
        revise: {
          summary: "Sodium hydroxide reacts with salt solutions to form insoluble metal hydroxides (precipitates). The colour and solubility of the precipitate helps to identify the metal ion present. Salts of Fe²⁺ (Ferr",
          bullets: [
            "Sodium hydroxide reacts with salt solutions to form insoluble metal hydroxides (precipitates).",
            "The colour and solubility of the precipitate helps to identify the metal ion present.",
            "Salts of Fe²⁺ (Ferrous salts): Dirty green precipitate of ferrous hydroxide Fe(OH)₂.",
            "Insoluble in excess NaOH.",
            "Salts of Fe³⁺ (Ferric salts): Reddish brown precipitate of ferric hydroxide Fe(OH)₃.",
            "Insoluble in excess NaOH.",
            "Salts of Cu²⁺ (Copper salts): Bluish (Pale blue) precipitate of copper hydroxide Cu(OH)₂.",
            "Insoluble in excess NaOH.",
          ],
        },
        practice: [
          {
            question: "State what is observed when sodium hydroxide solution is added drop by drop and then in excess to solutions of: (a) Zinc sulphate (b) Copper sulphate (c) Ferrous sulphate (d) Lead nitrate Write balanced chemical equations.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the special action of ammonium hydroxide on copper sulphate solution. Write the relevant equations.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "On warming ammonium chloride with sodium hydroxide solution, a gas is evolved. Name the gas. Give two tests to identify the gas.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What do you understand by the term \"amphoteric nature\"? Explain with reference to zinc, aluminium and lead. Give equations.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the precipitate formed when sodium hydroxide is added to ferric chloride solution. State its colour.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch5",
        title: "MOLE CONCEPT and STOICHIOMETRY",
        watch: { videoUrl: "https://youtu.be/R9I0boD4taY?si=Q8xSitu4QRQbtgs9", title: "MOLE CONCEPT and STOICHIOMETRY — One Shot Lecture" },
        revise: {
          summary: "When gases react together under the same conditions of temperature and pressure, they do so in simple whole number ratios by their volumes, and the volumes of the products (if gases) also bear a simpl",
          bullets: [
            "When gases react together under the same conditions of temperature and pressure, they do so in simple whole number ratios by their volumes, and the volumes of the products (if gases) also bear a simple ratio to the volumes of the reactants.",
            "Example: N₂ + 3H₂ → 2NH₃ (1 volume : 3 volumes : 2 volumes).",
            "Equal volumes of all gases, under the same conditions of temperature and pressure, contain an equal number of molecules.",
            "Molar Volume: At standard temperature and pressure (S.",
            "), one mole of any gas occupies 22.",
            "4 litres of any gas at S.",
            "is equal to its molar mass (molecular mass in grams).",
            "Temperature in Kelvin (K) = Temperature in Celsius (°C) + 273 Standard Temperature and Pressure (S.",
          ],
        },
        practice: [
          {
            question: "State Gay Lussac\'s Law of Combining Volumes. Give one example with equation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State Avogadro\'s Law. What is molar volume?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Convert the following temperatures to Kelvin scale: (a) 27°C (b) -73°C",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define vapour density. How is it related to molecular mass?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A compound has the following percentage composition: Carbon = 40%, Hydrogen = 6.67%, Oxygen = 53.33%. Its molecular mass is 60. Find its empirical formula and molecular formula.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch6",
        title: "ELECTROLYSIS",
        watch: { videoUrl: "https://youtu.be/17_ukKwYE9U?si=qXT4sBi91bMOKu3t", title: "ELECTROLYSIS — One Shot Lecture" },
        revise: {
          summary: "Electrolysis: The process of decomposition of an electrolyte in its molten state or aqueous solution by the passage of direct electric current. Electrolyte: A compound that conducts electricity in mol",
          bullets: [
            "Electrolysis: The process of decomposition of an electrolyte in its molten state or aqueous solution by the passage of direct electric current.",
            "Electrolyte: A compound that conducts electricity in molten state or aqueous solution and undergoes chemical decomposition.",
            "Non-Electrolyte: A compound that does not conduct electricity in any state.",
            "Electrodes: The conducting rods that dip into the electrolyte.",
            "The anode is connected to the positive terminal of the battery and the cathode is connected to the negative terminal.",
            "Anode: The positive electrode where oxidation (loss of electrons) occurs.",
            "Anions (negative ions) migrate towards the anode.",
            "Cathode: The negative electrode where reduction (gain of electrons) occurs.",
          ],
        },
        practice: [
          {
            question: "Define the following terms: (a) Electrolysis (b) Electrolyte (c) Anode and Cathode",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between strong electrolytes and weak electrolytes. Give one example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the electrolysis of molten lead bromide with reactions at the electrodes.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram showing the electrolysis of acidified water. Give equations at the cathode and anode. Why is the volume of hydrogen collected double that of oxygen?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the electrolysis of copper sulphate solution using: (a) Copper electrodes (b) Platinum electrodes Why does the colour of the solution fade in case (b) but not in case (a)?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch7",
        title: "METALLURGY",
        watch: { videoUrl: "https://youtu.be/9DaA95KHpoA?si=vQO7Mn94QAnzncnC", title: "METALLURGY — One Shot Lecture" },
        revise: {
          summary: "Mineral: A naturally occurring substance containing one or more metals in the earth\'s crust. Ore: A mineral from which a metal can be extracted profitably and conveniently. All ores are minerals, but",
          bullets: [
            "Mineral: A naturally occurring substance containing one or more metals in the earth\'s crust.",
            "Ore: A mineral from which a metal can be extracted profitably and conveniently.",
            "All ores are minerals, but all minerals are not ores.",
            "Gangue (Matrix): The unwanted earthly impurities like sand, clay, and rocks associated with the ore.",
            "Iron: Haematite (Fe₂O₃), Magnetite (Fe₃O₄).",
            "Aluminium: Bauxite (Al₂O₃.",
            "Zinc: Zinc blende (ZnS), Calamine (ZnCO₃).",
            "Pulverisation and Dressing (Concentration) of the Ore The ore is crushed into fine powder.",
          ],
        },
        practice: [
          {
            question: "Define the terms: Mineral, Ore, Gangue.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the most important ore of aluminium and state its formula.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the difference between calcination and roasting? Give one example and equation for each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the principle of froth flotation. For which type of ores is it used?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe Baeyer\'s process for the purification of bauxite. Write relevant equations.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch8",
        title: "STUDY of COMPOUNDS – HYDROGEN CHLORIDE (hcl)",
        watch: { videoUrl: "", title: "STUDY of COMPOUNDS – HYDROGEN CHLORIDE (hcl) — One Shot Lecture" },
        revise: {
          summary: "Reactants: Sodium chloride (NaCl) and concentrated Sulphuric acid (H₂SO₄). Reaction: NaCl + H₂SO₄ → NaHSO₄ + HCl↑ (at low temperature below 200°C) Conditions: Temperature kept below 200°C. Procedure:",
          bullets: [
            "Reactants: Sodium chloride (NaCl) and concentrated Sulphuric acid (H₂SO₄).",
            "Reaction: NaCl + H₂SO₄ → NaHSO₄ + HCl↑ (at low temperature below 200°C) Conditions: Temperature kept below 200°C.",
            "Procedure: The gas is collected by upward displacement of air (because HCl is heavier than air).",
            "Precaution: The delivery tube should not dip into the water during the fountain experiment/absorption.",
            "Drying Agent: Concentrated sulphuric acid.",
            "Physical Properties Colourless, pungent smelling gas.",
            "Highly soluble in water - demonstrated by the Fountain Experiment.",
            "Fountain Experiment A dry round bottomed flask filled with dry HCl gas is connected to a tube dipping in blue litmus solution.",
          ],
        },
        practice: [
          {
            question: "With a labelled diagram, describe the laboratory preparation of hydrogen chloride gas. Give the balanced equation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why is HCl collected by upward displacement of air?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the fountain experiment. Why does a red fountain form when the flask is filled with HCl gas and the water contains blue litmus?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write balanced chemical equations for the reaction of hydrochloric acid with: (a) Zinc (b) Copper oxide (c) Sodium hydroxide (d) Calcium carbonate (e) Sodium sulphite",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the name of the funnel used to dissolve HCl gas in water? Why is it used?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch9",
        title: "STUDY of COMPOUNDS – AMMONIA (NH₃)",
        watch: { videoUrl: "https://youtu.be/9DAdgTkVTdg?si=ogLPp6oxMUqAZRXR", title: "STUDY of COMPOUNDS – AMMONIA (NH₃) — One Shot Lecture" },
        revise: {
          summary: "Reactants: Ammonium chloride (NH₄Cl) and Calcium hydroxide [Ca(OH)₂ / slaked lime]. Reaction: 2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2H₂O + 2NH₃↑ Conditions: Gentle heating. Drying Agent: Quicklime (CaO). Conc. H",
          bullets: [
            "Reactants: Ammonium chloride (NH₄Cl) and Calcium hydroxide [Ca(OH)₂ / slaked lime].",
            "Reaction: 2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2H₂O + 2NH₃↑ Conditions: Gentle heating.",
            "Drying Agent: Quicklime (CaO).",
            "H₂SO₄ or CaCl₂ cannot be used.",
            "Collection: Downward displacement of air (NH₃ is lighter than air).",
            "From Nitrides: Action of warm water on magnesium nitride or aluminium nitride.",
            "Mg₃N₂ + 6H₂O → 3Mg(OH)₂ + 2NH₃ From Ammonium Salts: Heating ammonium salts with an alkali.",
            "(NH₄)₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O + 2NH₃.",
          ],
        },
        practice: [
          {
            question: "Draw a labelled diagram for the laboratory preparation of ammonia gas. Write the balanced equation. Why is CaO used as the drying agent?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain Haber\'s process for the manufacture of ammonia with conditions and equation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write the reaction of ammonia with: (a) Hydrogen chloride gas (b) Hot copper (II) oxide (c) Chlorine (in excess)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the fountain experiment for ammonia. Why is a blue fountain observed?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why is ammonium hydroxide called a weak alkali? Write its reaction with sulphuric acid.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch10",
        title: "STUDY of COMPOUNDS – NITRIC ACID (HNO₃)",
        watch: { videoUrl: "https://youtu.be/zvirKZpDytg?si=f6WLlxIa65K982De", title: "STUDY of COMPOUNDS – NITRIC ACID (HNO₃) — One Shot Lecture" },
        revise: {
          summary: "Reactants: Potassium nitrate (KNO₃) or Sodium nitrate (NaNO₃) and concentrated Sulphuric acid. Reaction: KNO₃ + H₂SO₄ → KHSO₄ + HNO₃ (vapours) Temperature: Should not exceed 200°C. At higher temperatu",
          bullets: [
            "Reactants: Potassium nitrate (KNO₃) or Sodium nitrate (NaNO₃) and concentrated Sulphuric acid.",
            "Reaction: KNO₃ + H₂SO₄ → KHSO₄ + HNO₃ (vapours) Temperature: Should not exceed 200°C.",
            "At higher temperatures, HNO₃ decomposes.",
            "Apparatus: All glass apparatus (retort and receiver).",
            "Condition: Nitric acid vapours are condensed to liquid nitric acid.",
            "Colour: Pure nitric acid is colourless but the prepared acid is often yellow due to dissolved NO₂.",
            "Step 1: Catalytic oxidation of ammonia.",
            "4NH₃ + 5O₂ → (Pt/Rh gauge, 800°C) → 4NO + 6H₂O Step 2: Oxidation of nitric oxide to nitrogen dioxide.",
          ],
        },
        practice: [
          {
            question: "Draw a labelled diagram for the laboratory preparation of nitric acid. Write the balanced equation. Why is all-glass apparatus used?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe Ostwald\'s process for the manufacture of nitric acid. Give equations.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write the reaction of concentrated nitric acid with: (a) Copper (b) Carbon (c) Sulphur",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What happens when copper nitrate is heated strongly? Write the balanced equation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the brown ring test for nitrates.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch11",
        title: "STUDY of COMPOUNDS – SULPHURIC ACID (H₂SO₄)",
        watch: { videoUrl: "", title: "STUDY of COMPOUNDS – SULPHURIC ACID (H₂SO₄) — One Shot Lecture" },
        revise: {
          summary: "Step 1: Production of SO₂. Burning of sulphur or roasting of iron pyrites. S + O₂ → SO₂ 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂ Step 2: Catalytic oxidation of SO₂ to SO₃. 2SO₂ + O₂ ⇌ 2SO₃ + Heat Catalyst: Vanadi",
          bullets: [
            "Step 1: Production of SO₂.",
            "Burning of sulphur or roasting of iron pyrites.",
            "S + O₂ → SO₂ 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂ Step 2: Catalytic oxidation of SO₂ to SO₃.",
            "2SO₂ + O₂ ⇌ 2SO₃ + Heat Catalyst: Vanadium pentoxide (V₂O₅) or platinised asbestos.",
            "Step 3: Absorption of SO₃ in conc.",
            "SO₃ + H₂SO₄ → H₂S₂O₇ (Oleum / Pyrosulphuric acid) Step 4: Dilution of oleum with water.",
            "H₂S₂O₇ + H₂O → 2H₂SO₄ SO₃ is absorbed in conc.",
            "H₂SO₄ and not directly in water because the reaction is highly exothermic and produces a dense fog of acid mist.",
          ],
        },
        practice: [
          {
            question: "Explain the Contact Process for the manufacture of sulphuric acid with equations. Why is SO₃ not absorbed directly in water?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why is sulphuric acid called a dibasic acid? Give an equation to support your answer.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write balanced equations for the reaction of dilute sulphuric acid with: (a) Iron (b) Zinc carbonate (c) Sodium hydroxide",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the action of concentrated sulphuric acid as a dehydrating agent with reference to sugar and copper sulphate crystals.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What happens when concentrated sulphuric acid is added to sodium chloride? Write the equation. Which property of sulphuric acid is shown here?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ch-ch12",
        title: "ORGANIC CHEMISTRY",
        watch: { videoUrl: "https://youtu.be/_YYL7OBE11k?si=OnSKYj3ssM6L5P2w", title: "ORGANIC CHEMISTRY — One Shot Lecture" },
        revise: {
          summary: "Organic compounds are compounds of carbon (except CO, CO₂, carbonates and bicarbonates). Unique Nature of Carbon: Catenation: Carbon atoms can link together to form long chains or rings. Tetravalency:",
          bullets: [
            "Organic compounds are compounds of carbon (except CO, CO₂, carbonates and bicarbonates).",
            "Unique Nature of Carbon: Catenation: Carbon atoms can link together to form long chains or rings.",
            "Tetravalency: Carbon has four valence electrons and forms four covalent bonds.",
            "Bond types: Carbon can form single, double, and triple bonds.",
            "Structural Formulae of Hydrocarbons: Alkanes: Single bonds only.",
            "General formula C H₂ ₊₂.",
            "Alkenes: Contain a double bond.",
            "General formula C H₂ .",
          ],
        },
        practice: [
          {
            question: "Define catenation. Why does carbon show catenation to a large extent?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is isomerism? Draw the structural isomers of butane (C₄H₁₀).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define homologous series. State any two characteristics of a homologous series.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write the IUPAC names of the following: (a) CH₃-CH₂-CH₂-OH (b) CH₃-COOH (c) CH₃-CH=CH₂ (d) CH₃-CH₂-CH₂-CH₃",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe the laboratory preparation of methane with a diagram and equation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
    ],
  },
  biology: {
    chapters: [
      {
        id: "bi-ch1",
        title: "CELL DIVISION and CELL CYCLE",
        watch: { videoUrl: "", title: "CELL DIVISION and CELL CYCLE — One Shot Lecture" },
        revise: {
          summary: "The cell cycle is the sequence of events from one cell division to the next. It consists of two main phases. A. Interphase (Preparatory Phase) The cell grows in size and prepares for division. It is d",
          bullets: [
            "The cell cycle is the sequence of events from one cell division to the next.",
            "It consists of two main phases.",
            "Interphase (Preparatory Phase) The cell grows in size and prepares for division.",
            "It is divided into three stages.",
            "G₁ Phase: The cell grows.",
            "Proteins and RNA are synthesised.",
            "S Phase: DNA replication occurs.",
            "Each chromosome duplicates to form two sister chromatids held together at the centromere.",
          ],
        },
        practice: [
          {
            question: "Name the phases of the cell cycle and describe the events occurring in each phase of interphase.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of any one stage of mitosis and describe the key events occurring in that stage.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State three major differences between mitotic and meiotic division.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the significance of meiosis in living organisms.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define the terms: Chromatin, Chromatid, Centromere, Gene.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch2",
        title: "GENETICS",
        watch: { videoUrl: "", title: "GENETICS — One Shot Lecture" },
        revise: {
          summary: "Gregor Mendel conducted experiments on garden pea plants and proposed three fundamental laws of inheritance. A. Law of Dominance When two contrasting alleles are present together (heterozygous conditi",
          bullets: [
            "Gregor Mendel conducted experiments on garden pea plants and proposed three fundamental laws of inheritance.",
            "Law of Dominance When two contrasting alleles are present together (heterozygous condition), the allele that expresses itself is called dominant, and the allele that is masked is called recessive.",
            "Law of Segregation The two alleles of a gene separate during gamete formation.",
            "Each gamete receives only one allele.",
            "This is also called the law of purity of gametes.",
            "Law of Independent Assortment When two or more pairs of contrasting traits are studied together, the inheritance of one trait is independent of the inheritance of the other trait.",
            "This applies strictly to genes located on different chromosomes.",
            "Gene: The basic unit of heredity that determines a characteristic.",
          ],
        },
        practice: [
          {
            question: "State Mendel\'s three laws of inheritance.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between the following terms: (a) Phenotype and Genotype (b) Homozygous and Heterozygous (c) Dominant allele and Recessive allele",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "With the help of a Punnett square, work out a monohybrid cross between a pure tall pea plant (TT) and a pure dwarf pea plant (tt). State the phenotypic and genotypic ratios obtained in the F₂ generation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "In a dihybrid cross between Round Yellow (RRYY) and Wrinkled Green (rryy) pea plants, what will be the phenotype of the F₁ generation? State the phenotypic ratio of the F₂ generation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the mechanism of sex determination in human beings. Who determines the sex of the child, the father or the mother?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch3",
        title: "ABSORPTION by ROOTS",
        watch: { videoUrl: "", title: "ABSORPTION by ROOTS — One Shot Lecture" },
        revise: {
          summary: "Imbibition: The absorption of water by solid particles of a substance (hydrophilic colloids), causing them to swell enormously. Example: dry seeds swelling when soaked in water. Diffusion: The net mov",
          bullets: [
            "Imbibition: The absorption of water by solid particles of a substance (hydrophilic colloids), causing them to swell enormously.",
            "Example: dry seeds swelling when soaked in water.",
            "Diffusion: The net movement of molecules or ions from a region of higher concentration to a region of lower concentration until equilibrium is reached.",
            "It does not require a membrane or energy.",
            "Osmosis: The movement of water molecules from a region of lower solute concentration (higher water concentration) to a region of higher solute concentration (lower water concentration) through a selectively permeable membrane.",
            "Active Transport: The movement of molecules or ions from a region of lower concentration to a region of higher concentration across a membrane, using cellular energy (ATP).",
            "This occurs against the concentration gradient.",
            "Passive Transport: The movement of substances along the concentration gradient without the expenditure of energy.",
          ],
        },
        practice: [
          {
            question: "Define the following terms: Imbibition, Diffusion, Osmosis, Active Transport.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the process of osmosis with a suitable example.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between Turgidity and Flaccidity.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is plasmolysis? Explain what happens when a plant cell is placed in a hypertonic solution.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of a root hair cell. How is it structurally adapted to absorb water?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch4",
        title: "TRANSPIRATION",
        watch: { videoUrl: "https://youtu.be/LFmIkLQwhGg?si=bicqIB1PP2-_GPH8", title: "TRANSPIRATION — One Shot Lecture" },
        revise: {
          summary: "Transpiration is the loss of water in the form of water vapour from the aerial parts of a living plant, mainly through the stomata of leaves.",
          bullets: [
            "Transpiration is the loss of water in the form of water vapour from the aerial parts of a living plant, mainly through the stomata of leaves.",
            "Stomatal Transpiration: Water vapour lost through stomata.",
            "It accounts for about 90% of total transpiration.",
            "Cuticular Transpiration: Water vapour lost through the cuticle layer covering the epidermis.",
            "It accounts for a small percentage.",
            "Lenticular Transpiration: Water vapour lost through lenticels (small openings) present on the bark of woody stems.",
            "It is a very small amount.",
            "During the daytime (light), potassium ions (K⁺) move into the guard cells from surrounding epidermal cells.",
          ],
        },
        practice: [
          {
            question: "Define transpiration. Name the three types of transpiration.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the potassium ion exchange theory for the opening and closing of stomata.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State any three factors that affect the rate of transpiration. Explain how each factor influences it.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Give three reasons why transpiration is important for plants.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is Ganong\'s potometer? What does it actually measure? State one limitation of this instrument.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch5",
        title: "PHOTOSYNTHESIS",
        watch: { videoUrl: "https://youtu.be/5c61BkkrnEU?si=Jvh17cLV5dMKWnzc", title: "PHOTOSYNTHESIS — One Shot Lecture" },
        revise: {
          summary: "Photosynthesis is the process by which green plants synthesise food (glucose) from carbon dioxide and water using sunlight energy trapped by chlorophyll. Significance: It is the primary source of food",
          bullets: [
            "Photosynthesis is the process by which green plants synthesise food (glucose) from carbon dioxide and water using sunlight energy trapped by chlorophyll.",
            "Significance: It is the primary source of food and oxygen for almost all living organisms.",
            "It maintains the balance of oxygen and carbon dioxide in the atmosphere.",
            "6CO₂ + 12H₂O → (Sunlight, Chlorophyll) → C₆H₁₂O₆ + 6O₂ + 6H₂O.",
            "Photosynthesis takes place inside the chloroplasts present in the mesophyll cells of leaves.",
            "Grana: Stack of thylakoid membranes containing chlorophyll.",
            "This is the site of the light reaction.",
            "Stroma: The fluid matrix surrounding the grana.",
          ],
        },
        practice: [
          {
            question: "Define photosynthesis. Write the overall balanced chemical equation for photosynthesis.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a neat labelled diagram of a chloroplast and mention the site of light and dark reactions.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between the light reaction and the dark reaction of photosynthesis (any three points).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is photolysis of water? Why is it important?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe an experiment to show that light is necessary for photosynthesis.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch6",
        title: "CHEMICAL COORDINATION in PLANTS",
        watch: { videoUrl: "https://youtu.be/XHthfFM_9Hs?si=lRfEe5MMRYksCCUO", title: "CHEMICAL COORDINATION in PLANTS — One Shot Lecture" },
        revise: {
          summary: "Plant growth regulators are small, organic molecules that control growth, development and responses in plants. Auxins: Promote cell elongation and growth of shoots. Promote apical dominance (growth of",
          bullets: [
            "Plant growth regulators are small, organic molecules that control growth, development and responses in plants.",
            "Auxins: Promote cell elongation and growth of shoots.",
            "Promote apical dominance (growth of the main stem tip suppresses lateral buds).",
            "Induce root formation in stem cuttings.",
            "Suppress premature fruit drop.",
            "Gibberellins: Promote stem elongation, especially in dwarf plants.",
            "Stimulate seed germination by breaking seed dormancy.",
            "Promote bolting (sudden elongation of stem) in rosette plants.",
          ],
        },
        practice: [
          {
            question: "Name any three plant growth regulators and state one function of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is apical dominance? Which plant hormone is responsible for it?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State one function each of Gibberellins and Cytokinins.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Which plant hormone is called the stress hormone? Give two reasons.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the plant hormone responsible for ripening of fruits.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch7",
        title: "THE CIRCULATORY SYSTEM",
        watch: { videoUrl: "https://youtu.be/bqCah5NvfTM?si=BMCocGZ4XylHcdsb", title: "THE CIRCULATORY SYSTEM — One Shot Lecture" },
        revise: {
          summary: "Blood is a fluid connective tissue composed of: Plasma (about 55%): The liquid matrix, consisting of about 90% water with dissolved proteins, glucose, minerals, hormones, and waste products. Red Blood",
          bullets: [
            "Blood is a fluid connective tissue composed of: Plasma (about 55%): The liquid matrix, consisting of about 90% water with dissolved proteins, glucose, minerals, hormones, and waste products.",
            "Red Blood Cells (Erythrocytes): Biconcave, disc shaped cells.",
            "In mammals, mature RBCs lack a nucleus to maximise space for haemoglobin.",
            "They transport oxygen from lungs to tissues.",
            "White Blood Cells (Leucocytes): Nucleated cells that play a major role in the body\'s defence by fighting infections (phagocytosis and antibody production).",
            "Platelets (Thrombocytes): Small, irregular cell fragments that help in the clotting of blood.",
            "When an injury occurs, platelets release thromboplastin (thrombokinase).",
            "Thromboplastin converts prothrombin (a plasma protein) into thrombin, in the presence of calcium ions.",
          ],
        },
        practice: [
          {
            question: "Name the components of blood. State one function of each component.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the process of blood coagulation (clotting).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of the human heart showing the chambers and major blood vessels.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the concept of double circulation in humans.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between an artery and a vein (any three points).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch8",
        title: "THE EXCRETORY SYSTEM",
        watch: { videoUrl: "https://youtu.be/Wj8IfXfMUy0?si=mx1HL_ukJgGBibQ4", title: "THE EXCRETORY SYSTEM — One Shot Lecture" },
        revise: {
          summary: "Excretion is the removal of metabolic waste products from the body. Kidneys: Primary excretory organs that filter blood and produce urine. Lungs: Remove carbon dioxide and water vapour. Skin: Removes",
          bullets: [
            "Excretion is the removal of metabolic waste products from the body.",
            "Kidneys: Primary excretory organs that filter blood and produce urine.",
            "Lungs: Remove carbon dioxide and water vapour.",
            "Skin: Removes sweat containing water, salts, and small amounts of urea.",
            "Liver: Converts toxic ammonia into urea, breaks down old RBCs.",
            "Kidneys (2): Filter blood and produce urine.",
            "Ureters (2): Carry urine from the kidneys to the urinary bladder.",
            "Urinary Bladder (1): A muscular sac that temporarily stores urine.",
          ],
        },
        practice: [
          {
            question: "Name the main excretory organs in the human body and state one waste product eliminated by each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of the human urinary system.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of a longitudinal section of the kidney.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of a nephron.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the process of urine formation in the nephron. Name the three main steps involved.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch9",
        title: "THE NERVOUS SYSTEM",
        watch: { videoUrl: "https://youtu.be/ILWpicDQqQo?si=zoNoItokB4HHuv83", title: "THE NERVOUS SYSTEM — One Shot Lecture" },
        revise: {
          summary: "A neuron is the structural and functional unit of the nervous system. Dendrites: Short, branched projections that receive nerve impulses from other neurons and conduct them towards the cell body. Cell",
          bullets: [
            "A neuron is the structural and functional unit of the nervous system.",
            "Dendrites: Short, branched projections that receive nerve impulses from other neurons and conduct them towards the cell body.",
            "Cell Body (Cyton): Contains the nucleus and cytoplasm.",
            "It integrates the impulses.",
            "Axon: A single, long fibre that conducts impulses away from the cell body towards another neuron or to an effector muscle/gland.",
            "Myelin Sheath: An insulating fatty layer around some axons that speeds up impulse conduction.",
            "Synapse: The microscopic gap between the axon terminal of one neuron and the dendrite of the next neuron.",
            "Impulses cross the synapse through chemical substances called neurotransmitters.",
          ],
        },
        practice: [
          {
            question: "Draw a labelled diagram of a neuron. State the function of dendrites and axon.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is a synapse? How does an impulse travel across a synapse?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of the brain (external view) and state one function each of Cerebrum, Cerebellum and Medulla Oblongata.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between voluntary and involuntary actions. Give one example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the reflex arc with the help of a labelled diagram. Why are reflexes important?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch10",
        title: "THE ENDOCRINE SYSTEM",
        watch: { videoUrl: "https://youtu.be/dQJg4lSbnPo?si=CybSpVeNMfZx4Iri", title: "THE ENDOCRINE SYSTEM — One Shot Lecture" },
        revise: {
          summary: "Endocrine Glands: Ductless glands that secrete their products (hormones) directly into the bloodstream. Hormones act on target organs at a distance. Exocrine Glands: Glands that have ducts. They secre",
          bullets: [
            "Endocrine Glands: Ductless glands that secrete their products (hormones) directly into the bloodstream.",
            "Hormones act on target organs at a distance.",
            "Exocrine Glands: Glands that have ducts.",
            "They secrete their products (enzymes, sweat, saliva) through these ducts onto a surface or into a cavity.",
            "Pituitary Gland (Master Gland) Located at the base of the brain.",
            "Growth Hormone (GH): Stimulates overall body growth.",
            "Tropic Hormones (TSH, ACTH, FSH, LH): Control the functioning of other endocrine glands (thyroid, adrenal, gonads).",
            "ADH (Antidiuretic Hormone/Vasopressin): Reduces water loss by increasing water reabsorption in the kidneys.",
          ],
        },
        practice: [
          {
            question: "Differentiate between an endocrine gland and an exocrine gland.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why is the pituitary gland called the master gland? Name any two hormones secreted by it and state their functions.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the hormone secreted by the thyroid gland. State the effects of its hyposecretion and hypersecretion.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Which hormone is known as the emergency hormone? Name the gland that secretes it and list its effects on the body.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the hormones secreted by the Islets of Langerhans. Explain the role of insulin and glucagon in regulating blood sugar.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch11",
        title: "THE REPRODUCTIVE SYSTEM",
        watch: { videoUrl: "https://youtu.be/lfU-C0pDRlo?si=-qEYnNQr6QGTONkb", title: "THE REPRODUCTIVE SYSTEM — One Shot Lecture" },
        revise: {
          summary: "Testes (paired): Produce the male gametes (sperms) and the male hormone Testosterone. Epididymis: A coiled tube on top of each testis where sperms mature and are temporarily stored. Vas Deferens (Sper",
          bullets: [
            "Testes (paired): Produce the male gametes (sperms) and the male hormone Testosterone.",
            "Epididymis: A coiled tube on top of each testis where sperms mature and are temporarily stored.",
            "Vas Deferens (Sperm Duct): A tube that carries sperms from the epididymis to the urethra.",
            "Accessory Glands: Seminal Vesicles Prostate Gland Cowper\'s Glands Their secretions form the liquid portion of semen, which provides nutrition and a fluid medium for sperms.",
            "Urethra: Common passage for urine and semen.",
            "Ovaries (paired): Produce the female gametes (ova/eggs).",
            "Also secrete the hormones Oestrogen and Progesterone.",
            "Fallopian Tubes (Oviducts): Funnel shaped tubes that catch the ovum released from the ovary.",
          ],
        },
        practice: [
          {
            question: "Draw a labelled diagram of the male reproductive system.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Draw a labelled diagram of the female reproductive system.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the site of fertilisation and the site of implantation in humans.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State any four functions of the placenta.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the role of amniotic fluid during embryonic development.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch12",
        title: "POPULATION",
        watch: { videoUrl: "https://youtu.be/2QKio4tL1GY?si=IwGyKZNtKLXc09q3", title: "POPULATION — One Shot Lecture" },
        revise: {
          summary: "Demography: The statistical study of human populations, including their size, structure, and distribution. Population Density: The number of individuals living per unit area (e.g., per square kilometr",
          bullets: [
            "Demography: The statistical study of human populations, including their size, structure, and distribution.",
            "Population Density: The number of individuals living per unit area (e.",
            ", per square kilometre).",
            "Birth Rate (Natality): The number of live births per thousand individuals per year.",
            "Death Rate (Mortality): The number of deaths per thousand individuals per year.",
            "Growth Rate: The net increase in population size, calculated as (Birth Rate − Death Rate) plus net migration.",
            "Decline in death rate due to improved medical facilities, better sanitation, and control of epidemics.",
            "High birth rate due to early marriage, lack of education, desire for male child, and religious/social customs.",
          ],
        },
        practice: [
          {
            question: "Define the following terms: Demography, Population Density, Birth Rate, Death Rate.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Give any three reasons for the rapid rise in human population in India.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain any four problems caused by population explosion.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is vasectomy? How does it help in population control?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is tubectomy? How does it help in population control?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "bi-ch13",
        title: "POLLUTION",
        watch: { videoUrl: "https://youtu.be/lfU-C0pDRlo?si=kB7rSHVFhlzL3vjY", title: "POLLUTION — One Shot Lecture" },
        revise: {
          summary: "Air Pollution Sources: Vehicular emissions, industrial smoke, burning of garbage, brick kilns. Major Pollutants: Carbon monoxide (CO), Sulphur dioxide (SO₂), Nitrogen oxides (NOx), suspended particula",
          bullets: [
            "Air Pollution Sources: Vehicular emissions, industrial smoke, burning of garbage, brick kilns.",
            "Major Pollutants: Carbon monoxide (CO), Sulphur dioxide (SO₂), Nitrogen oxides (NOx), suspended particulate matter (dust, smoke).",
            "Water Pollution Sources: Household detergents, sewage, industrial discharge (heavy metals, chemicals), oil spills.",
            "Major Pollutants: Organic waste (increases BOD), chemicals (fertilisers, pesticides), pathogens.",
            "Soil Pollution Sources: Excessive use of chemical fertilisers and pesticides, urban commercial and domestic waste, untreated industrial waste.",
            "Major Pollutants: DDT and other pesticides, non biodegradable plastics, heavy metals.",
            "Noise Pollution Sources: Motor vehicles, industrial establishments, construction sites, loudspeakers.",
            "Major Pollutants: Unwanted, excessive, and disturbing sounds measured in decibels (dB).",
          ],
        },
        practice: [
          {
            question: "Define pollution. Name any four types of pollution and give one source for each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between biodegradable and non biodegradable wastes. Give two examples of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is biomedical waste? Why should it be handled and disposed of carefully?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the greenhouse effect and how it contributes to global warming. Name two greenhouse gases.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is acid rain? Name the two gases primarily responsible for it. State two harmful effects of acid rain.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
    ],
  },
  mathematics: {
    chapters: [
      {
        id: "ma-ch1",
        title: "GOODS and SERVICES TAX (GST)",
        watch: { videoUrl: "https://youtu.be/iWcGaP_eWeA?si=63nqi4wBCkyehr-X", title: "GOODS and SERVICES TAX (GST) — One Shot Lecture" },
        revise: {
          summary: "Goods and Services Tax (GST) is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. It is a single indirect tax for the whole country.",
          bullets: [
            "Goods and Services Tax (GST) is a comprehensive, multi-stage, destination-based tax that is levied on every value addition.",
            "It is a single indirect tax for the whole country.",
            "List Price / Marked Price: The price of an item as quoted by the manufacturer or displayed on the price tag.",
            "Basic Price / Cost Price: The price at which a dealer buys the goods from the manufacturer, before adding any taxes.",
            "Input Tax Credit (ITC): The dealer gets credit for the tax already paid to the manufacturer on the purchase of goods.",
            "Output Tax: The tax collected by the dealer from the consumer on the sale of goods.",
            "GST Paid by Dealer: Output Tax minus Input Tax Credit.",
            "GST has three components.",
          ],
        },
        practice: [
          {
            question: "A manufacturer sells a washing machine to a dealer for Rs 15,000. The dealer sells it to a consumer at a profit of Rs 3,000. If the rate of GST is 12%, calculate: (a) The amount of tax (under CGST and SGST) paid by the dealer to the manufacturer. (b) The amount of tax (under CGST and SGST) collected by the dealer from the consumer. (c) The net tax paid by the dealer to the government. (d) The final price paid by the consumer.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "The list price of a television is Rs 40,000. The shopkeeper sells it to a consumer at a discount of 10%. If the rate of GST is 18%, find: (a) The selling price after discount. (b) The amount of CGST and SGST. (c) The final amount paid by the consumer.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A dealer in Ahmedabad (Gujarat) sells an article to a consumer in Bhopal (Madhya Pradesh) for Rs 8,000. If the rate of IGST is 18%, calculate: (a) The amount of IGST. (b) The final price paid by the consumer.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A shopkeeper buys an article whose list price is Rs 2,000 at a discount of 20% on the list price from a wholesaler. The shopkeeper sells the article to a consumer at the list price. If the rate of GST is 12%, calculate the net GST paid by the shopkeeper to the government.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "For a dealer, the cost price of an article is Rs X. He marks it up by some amount, sells it and pays net GST. If the GST rate and final price are given, be able to compute the input and output tax and the profit.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch2",
        title: "BANKING",
        watch: { videoUrl: "https://youtu.be/gZCrI573Yy8?si=9y3mhkgisFuYM7g2", title: "BANKING — One Shot Lecture" },
        revise: {
          summary: "A Recurring Deposit (RD) account is an account in which a fixed sum of money is deposited every month for a specified period. After the maturity period, the total accumulated amount, including interes",
          bullets: [
            "A Recurring Deposit (RD) account is an account in which a fixed sum of money is deposited every month for a specified period.",
            "After the maturity period, the total accumulated amount, including interest, is returned to the depositor.",
            "P: Monthly installment (deposit).",
            "n: Number of months for which the deposit is made.",
            "r: Rate of interest per annum.",
            "I: Total interest earned.",
            "The total principal for the purpose of interest calculation is considered as if it was deposited for the equivalent period.",
          ],
        },
        practice: [
          {
            question: "Nagma has a Recurring Deposit account in a bank for 3 years at 8% p.a. If she gets Rs 9,990 as interest, find her monthly installment.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Mr. Saluja deposits Rs 800 per month in a Recurring Deposit account for a period of 2 years. At the time of maturity, he receives Rs 20,600. Find the rate of interest paid by the bank.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A man opened a recurring deposit account in a bank and deposited Rs 500 per month for 2 years. If he received Rs 15,000 at the time of maturity, find the rate of interest per annum.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Shobha has a recurring deposit account and deposits Rs 600 per month for 4 years. If the rate of interest is 10% p.a., find the amount she will receive at the time of maturity.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A person deposits a certain sum every month in a bank for n months. The rate of interest is r% p.a. and the maturity value is V. Set up an equation to find the monthly deposit P.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch3",
        title: "SHARES and DIVIDENDS",
        watch: { videoUrl: "https://youtu.be/cxuL191S6VY?si=Y-sxqIO85YTTIXZk", title: "SHARES and DIVIDENDS — One Shot Lecture" },
        revise: {
          summary: "A company raises capital by issuing shares to the public. A person who buys these shares is a shareholder and becomes a part owner of the company.",
          bullets: [
            "A company raises capital by issuing shares to the public.",
            "A person who buys these shares is a shareholder and becomes a part owner of the company.",
            "Face Value (FV) / Nominal Value: The original value of a share as stated by the company.",
            "Market Value (MV): The price at which a share is bought or sold in the stock market.",
            "It fluctuates based on demand and supply.",
            "At Premium: When MV > FV.",
            "At Discount: When MV < FV.",
            "Dividend: The part of the company\'s profit distributed to shareholders.",
          ],
        },
        practice: [
          {
            question: "A man invests Rs 8,800 in shares of a company which pays 10% dividend. A share has a face value of Rs 100 and is available at a market price of Rs 110. (a) Find the number of shares bought. (b) Find the annual income from the shares. (c) Find the rate of return on his investment.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A person wants to earn an annual income of Rs 1,500 by investing in shares of face value Rs 100 each available at Rs 125 each. If the company pays a dividend of 12%, how much money should he invest?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Which is a better investment: 12% at Rs 120 (FV Rs 100), or 8% at Rs 90 (FV Rs 100)?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Mr. Shukla has 200 shares of a company. The company declares a 15% dividend. If the face value of each share is Rs 10, find his total dividend income.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A company declares a dividend of 8%. A man receives Rs 1,200 as his annual dividend. If the face value of each share is Rs 10, find the number of shares he holds.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch4",
        title: "LINEAR INEQUATIONS",
        watch: { videoUrl: "https://youtu.be/gzwo0IRLkM4?si=was8nYqWJFh_tHCr", title: "LINEAR INEQUATIONS — One Shot Lecture" },
        revise: {
          summary: "A linear inequation is a mathematical statement expressing inequality between two algebraic expressions. It uses signs like: < (less than) > (greater than) <= (less than or equal to) >= (greater than",
          bullets: [
            "A linear inequation is a mathematical statement expressing inequality between two algebraic expressions.",
            "It uses signs like: < (less than) > (greater than) <= (less than or equal to) >= (greater than or equal to).",
            "The same number can be added or subtracted from both sides without changing the inequality.",
            "Both sides can be multiplied or divided by the same positive number without changing the inequality.",
            "When both sides are multiplied or divided by a negative number, the sign of the inequality reverses.",
            "Example: -x > 3 becomes x < -3.",
            "The replacement set is the set of numbers from which the solution values are to be chosen.",
            "It is usually specified as N (Natural Numbers), W (Whole Numbers), Z (Integers), or R (Real Numbers).",
          ],
        },
        practice: [
          {
            question: "Solve the following inequation and represent the solution set on the number line: 2x - 3 < 5, x belongs to N (Natural Numbers)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Solve: -3x + 4 >= -5, x belongs to Z. Represent on number line.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Solve the inequation and graph the solution on the number line: 3x - 1 >= 5, x belongs to W",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the solution set of the inequality 5 - 2x <= x - 4, given that x is a whole number.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Solve for x: -2 < (x/3) <= 2, and find the solution when x is an Integer and when x is a Real number.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch5",
        title: "QUADRATIC EQUATIONS",
        watch: { videoUrl: "https://youtu.be/q7TmhgBbEJ8?si=JFJLWbjTDX7XXL4b", title: "QUADRATIC EQUATIONS — One Shot Lecture" },
        revise: {
          summary: "A quadratic equation in variable x is an equation of the form: ax² + bx + c = 0 where a, b, c are real numbers and a is not equal to 0.",
          bullets: [
            "A quadratic equation in variable x is an equation of the form: ax² + bx + c = 0 where a, b, c are real numbers and a is not equal to 0.",
            "The discriminant (D) is given by: D = b² - 4ac If D > 0, the equation has two distinct real roots.",
            "If D = 0, the equation has two equal real roots (one real root).",
            "If D < 0, the equation has no real roots (roots are imaginary).",
            "By Factorisation Split the middle term into two parts such that their sum is b and their product is ac.",
            "Factor by grouping and set each factor to zero to find the roots.",
            "By Using the Quadratic Formula The roots of ax² + bx + c = 0 are given by: x = [-b +- sqrt(b² - 4ac)] / 2a.",
            "Many word problems can be translated into quadratic equations.",
          ],
        },
        practice: [
          {
            question: "Without solving, find the nature of roots of the quadratic equation 2x² - 7x + 3 = 0.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Determine the value of k for which the equation 4x² - 8x + k = 0 has equal roots.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Solve the quadratic equation x² - 5x + 6 = 0 by factorisation.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Using the quadratic formula, solve 3x² + 5x - 2 = 0.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "The sum of a number and its reciprocal is 17/4. Find the number.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch6",
        title: "RATIO and PROPORTION",
        watch: { videoUrl: "https://youtu.be/9yFiifEYiPI?si=WPxEG3iset6_Lbw1", title: "RATIO and PROPORTION — One Shot Lecture" },
        revise: {
          summary: "Ratio: Comparison of two quantities of the same kind. Written as a:b or a/b. Proportion: Equality of two ratios. If a:b = c:d, then a, b, c, d are in proportion. Continued Proportion: Three quantities",
          bullets: [
            "Ratio: Comparison of two quantities of the same kind.",
            "Written as a:b or a/b.",
            "Proportion: Equality of two ratios.",
            "If a:b = c:d, then a, b, c, d are in proportion.",
            "Continued Proportion: Three quantities a, b, c are in continued proportion if a:b = b:c.",
            "Here, b is called the mean proportion between a and c.",
            "For a proportion a/b = c/d: Invertendo: b/a = d/c Alternendo: a/c = b/d Componendo: (a+b)/b = (c+d)/d Dividendo: (a-b)/b = (c-d)/d Componendo and Dividendo: (a+b)/(a-b) = (c+d)/(c-d) ---.",
          ],
        },
        practice: [
          {
            question: "If (3a + 2b) : (5a + 3b) = 18 : 29, find a : b.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the mean proportional between 4 and 25.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "If x, y, z are in continued proportion, prove that (x + y)² / (y + z)² = x / z.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Using the properties of proportion, solve for x: (x² + 1) / (x² - 1) = 5 / 4",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "If (7x - 15y) : (3x + 9y) = 11 : 7, find x : y.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch7",
        title: "REMAINDER and FACTOR THEOREM",
        watch: { videoUrl: "https://youtu.be/KUmUXT0TlY8?si=2YkVvAzzVbbbxYeA", title: "REMAINDER and FACTOR THEOREM — One Shot Lecture" },
        revise: {
          summary: "If a polynomial f(x) is divided by (x - a), the remainder R is equal to f(a). For example, if f(x) is divided by (x + 2), put x = -2 in f(x) to find the remainder.",
          bullets: [
            "If a polynomial f(x) is divided by (x - a), the remainder R is equal to f(a).",
            "For example, if f(x) is divided by (x + 2), put x = -2 in f(x) to find the remainder.",
            "If a polynomial f(x) leaves remainder 0 when divided by (x - a), i.",
            ", if f(a) = 0, then (x - a) is a factor of f(x).",
            "Conversely, if (x - a) is a factor of f(x), then f(a) = 0.",
            "Use the factor theorem to find one factor (usually by trial and error on simple values like x = 1, -1, 2, -2).",
            "Once one factor is found, divide the polynomial by that factor (long division or synthetic division) to reduce it to a quadratic factor.",
            "Then factorise the quadratic factor completely.",
          ],
        },
        practice: [
          {
            question: "Use the Remainder Theorem to find the remainder when x³ - 2x² + 4x - 8 is divided by (x - 2).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Determine, using the Factor Theorem, whether (x + 1) is a factor of 2x³ + 5x² - x - 6.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "If (x - 3) is a factor of x³ - kx² + 3x + 9, find the value of k.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Factorise completely: x³ - 3x² - x + 3.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Show that (x - 1), (x + 2) and (x - 3) are factors of x³ - 2x² - 5x + 6 and factorise it completely.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch8",
        title: "MATRICES",
        watch: { videoUrl: "https://youtu.be/JwLBFvw5owU?si=7Ig7pznnk1Ua6Y5S", title: "MATRICES — One Shot Lecture" },
        revise: {
          summary: "A matrix is a rectangular arrangement of numbers (entries) in rows and columns. The order of a matrix is m x n, where m is the number of rows and n is the number of columns.",
          bullets: [
            "A matrix is a rectangular arrangement of numbers (entries) in rows and columns.",
            "The order of a matrix is m x n, where m is the number of rows and n is the number of columns.",
            "Row Matrix: Only one row (1 x n).",
            "Column Matrix: Only one column (m x 1).",
            "Square Matrix: Number of rows equals number of columns (m = n, like 2 x 2).",
            "Null (Zero) Matrix: All elements are zero.",
            "Identity Matrix (I): A square matrix with 1s on the main diagonal and 0s elsewhere.",
            "For 2 x 2 Identity Matrix I: I = [1 0] [0 1].",
          ],
        },
        practice: [
          {
            question: "Given matrix A = [2 3; -1 4] and B = [5 0; 2 -2], find A + B and 3A - 2B.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the product AB where A = [1 2; 3 4] and B = [2 0; 1 -1].",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "If [a 2b; c 3d] + [-1 4; 5 -2] = [2 6; 7 1], find a, b, c, and d.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Given A = [4 2; 1 0], find A² - 4A.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Solve for X if 2X + [1 3; 5 7] = [0 2; 5 4].",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch9",
        title: "ARITHMETIC PROGRESSION (AP)",
        watch: { videoUrl: "https://youtu.be/_1HxhsNvpzc?si=i0s8zBgJWkjYvrMu", title: "ARITHMETIC PROGRESSION (AP) — One Shot Lecture" },
        revise: {
          summary: "An Arithmetic Progression (AP) is a sequence of numbers in which the difference between any two consecutive terms is constant. This constant difference is called the common difference (d).",
          bullets: [
            "An Arithmetic Progression (AP) is a sequence of numbers in which the difference between any two consecutive terms is constant.",
            "This constant difference is called the common difference (d).",
            "First Term: a Common Difference: d nth Term (General Term): Tn = a + (n - 1)d Sum of first n Terms (Sn): Sn = (n/2) [2a + (n - 1)d] Also, Sn = (n/2) [a + l], where l is the last term.",
            "Find the nth term when a, d, n are given.",
            "Find the sum of n terms when a, d, n are given.",
            "Find the common difference if two terms are given.",
            "Find n if sum, first term and last term are given.",
          ],
        },
        practice: [
          {
            question: "Find the 20th term of the AP: 5, 9, 13, 17, ...",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Which term of the progression 20, 18, 16, ... is -80?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Determine the AP whose third term is 16 and the 7th term exceeds the 5th term by 12.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the sum of the first 25 terms of the AP: -7, -4, -1, 2, ...",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How many terms of the AP 9, 17, 25, ... must be taken to make a sum of 636?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch10",
        title: "GEOMETRIC PROGRESSION (GP)",
        watch: { videoUrl: "https://youtu.be/QR9B3qMXDDY?si=HBsz7GT3k1Q_iwHG", title: "GEOMETRIC PROGRESSION (GP) — One Shot Lecture" },
        revise: {
          summary: "A Geometric Progression (GP) is a sequence of numbers in which the ratio of any term to its preceding term is constant. This constant ratio is called the common ratio (r). Condition: r = T2/T1 = T3/T2",
          bullets: [
            "A Geometric Progression (GP) is a sequence of numbers in which the ratio of any term to its preceding term is constant.",
            "This constant ratio is called the common ratio (r).",
            "Condition: r = T2/T1 = T3/T2 =.",
            "First Term: a Common Ratio: r nth Term (General Term): Tn = ar^(n-1) Sum of first n Terms (Sn): If r > 1: Sn = a(r^n - 1) / (r - 1) If r < 1: Sn = a(1 - r^n) / (1 - r) ---.",
          ],
        },
        practice: [
          {
            question: "Find the 7th term of the GP: 3, 6, 12, 24, ...",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "For a GP, the first term is 5 and the common ratio is 2. Find its 10th term.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Determine the number of terms in the GP: 2, 6, 18, 54, ..., 4374.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the sum of the first 8 terms of the GP: 2, 6, 18, ...",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "The third term of a GP is 24 and the sixth term is 192. Find the 10th term.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch11",
        title: "REFLECTION",
        watch: { videoUrl: "https://youtu.be/N51MhaYu18I?si=_WFF-1ucMySzs-pL", title: "REFLECTION — One Shot Lecture" },
        revise: {
          summary: "Reflection is the mirror image of a point or a shape across a given line. The size and shape of the object remain unchanged after reflection.",
          bullets: [
            "Reflection is the mirror image of a point or a shape across a given line.",
            "The size and shape of the object remain unchanged after reflection.",
            "In the x-axis (y = 0): (x, y) becomes (x, -y) In the y-axis (x = 0): (x, y) becomes (-x, y) In the origin (0, 0): (x, y) becomes (-x, -y) In a vertical line x = a: (x, y) becomes (2a - x, y) In a horizontal line y = a: (x, y) becomes (x, 2a - y).",
            "A point is invariant under reflection if it does not change its position after reflection.",
            "Under reflection in the x-axis: Points on the x-axis, i.",
            ", (k, 0), are invariant.",
            "Under reflection in the y-axis: Points on the y-axis, i.",
            ", (0, k), are invariant.",
          ],
        },
        practice: [
          {
            question: "Find the coordinates of the image of the point P(5, -3) under reflection in the x-axis and in the y-axis.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A point P(a, b) is reflected in the x-axis to P\'(5, -2). Find the values of a and b.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Plot the points A(1, 4), B(3, 4), C(3, 1) and D(1, 1) on a graph. Reflect the figure in the y-axis and write the coordinates of the image points.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A point (p, q) is invariant under reflection in the line x = 3. Find the value of p.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Reflect the point (-4, 3) in the origin. Then reflect the image in the line y = 1. Write the final coordinates.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch12",
        title: "SECTION and MID-POINT FORMULA",
        watch: { videoUrl: "https://youtu.be/f5IVhHnfyCk?si=MJYZUIAv0DH8-J7U", title: "SECTION and MID-POINT FORMULA — One Shot Lecture" },
        revise: {
          summary: "The distance between two points P(x1, y1) and Q(x2, y2) is: PQ = sqrt[(x2 - x1)² + (y2 - y1)²]",
          bullets: [
            "The distance between two points P(x1, y1) and Q(x2, y2) is: PQ = sqrt[(x2 - x1)² + (y2 - y1)²].",
            "If a point P(x, y) divides the line segment joining A(x1, y1) and B(x2, y2) internally in the ratio m : n, then: x = (m x2 + n x1) / (m + n) y = (m y2 + n y1) / (m + n).",
            "The coordinates of the midpoint M of the line segment joining A(x1, y1) and B(x2, y2) are: M = ( (x1 + x2)/2 , (y1 + y2)/2 ).",
            "The centroid G of a triangle with vertices A(x1, y1), B(x2, y2), C(x3, y3) is given by: G = ( (x1 + x2 + x3)/3 , (y1 + y2 + y3)/3 ) ---.",
          ],
        },
        practice: [
          {
            question: "Find the distance between the points (2, 3) and (6, 6).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the ratio in which the point P(-1, 6) divides the line segment joining A(-3, 10) and B(6, -8).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "If the midpoint of the line segment joining A(8, -6) and B(x, y) is (4, -2), find the coordinates of B.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "The coordinates of one end of a diameter of a circle are (4, -1) and the centre of the circle is (1, -3). Find the coordinates of the other end of the diameter.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the centroid of the triangle whose vertices are A(2, 3), B(-1, -2), C(5, 1).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch13",
        title: "EQUATION of a STRAIGHT LINE",
        watch: { videoUrl: "https://youtu.be/UXYgRZWDglI?si=KRYQQnwxQDueX4y8", title: "EQUATION of a STRAIGHT LINE — One Shot Lecture" },
        revise: {
          summary: "The slope \'m\' of a line is the tangent of the angle it makes with the positive direction of the x-axis, measured anticlockwise. m = tan 0 For two points (x1, y1) and (x2, y2): m = (y2 - y1) / (x2 - x1",
          bullets: [
            "The slope \'m\' of a line is the tangent of the angle it makes with the positive direction of the x-axis, measured anticlockwise.",
            "m = tan 0 For two points (x1, y1) and (x2, y2): m = (y2 - y1) / (x2 - x1).",
            "Slope-Intercept Form: y = mx + c where \'c\' is the y-intercept (point where line cuts y-axis, x = 0).",
            "Point-Slope Form: y - y1 = m(x - x1) Two-Point Form: y - y1 = [(y2 - y1)/(x2 - x1)] (x - x1).",
            "Parallel Lines: Slopes are equal.",
            "m1 = m2 Perpendicular Lines: Product of slopes is -1.",
          ],
        },
        practice: [
          {
            question: "Find the slope and y-intercept of the line 3x - 4y = 12.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the equation of a line passing through the point (-2, 3) with slope 4.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the equation of the line joining the points (2, 3) and (4, 7).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Show that the points (1, -2), (3, 0), (1, 2) and (-1, 0) form a square or find the equations of its diagonals.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Find the equation of a line parallel to 2x + 3y = 7 and passing through (-1, 4).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch14",
        title: "SIMILARITY",
        watch: { videoUrl: "https://youtu.be/kfxibvVquHw?si=kGmBZFvJPtYEqRGe", title: "SIMILARITY — One Shot Lecture" },
        revise: {
          summary: "Two triangles are similar if their corresponding sides are proportional (same shape, not necessarily the same size).",
          bullets: [
            "Two triangles are similar if their corresponding sides are proportional (same shape, not necessarily the same size).",
            "SAS (Side Angle Side): One angle of one triangle equals one angle of the other, and the sides containing these angles are proportional.",
            "SSS (Side Side Side): All corresponding sides are in the same ratio.",
            "AA (Angle Angle): Two angles of one triangle are equal to two angles of the other.",
            "If a line is drawn parallel to one side of a triangle intersecting the other two sides, it divides those sides in the same ratio.",
            "For triangle ABC, if DE is parallel to BC, then: AD/DB = AE/EC.",
            "The ratio of the areas of two similar triangles is equal to the ratio of the squares of their corresponding sides.",
            "Area(Triangle 1) / Area(Triangle 2) = (Side 1 / Side 2)² ---.",
          ],
        },
        practice: [
          {
            question: "In triangle ABC, D and E are points on AB and AC respectively such that DE is parallel to BC. If AD = 2 cm, DB = 3 cm, AE = (3x - 2) cm and EC = (5x - 4) cm, find x.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Prove that the areas of two similar triangles are proportional to the squares of their corresponding sides.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "In two similar triangles PQR and LMN, QR = 15 cm and MN = 18 cm. If the area of PQR is 225 cm², find the area of LMN.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A vertical pole of height 6 m casts a shadow 4 m long on the ground. At the same time, a tower casts a shadow 28 m long. Find the height of the tower (using similarity).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Prove that the ratio of the areas of two similar triangles is equal to the square of the ratio of their corresponding medians.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch15",
        title: "CIRCLES – CYCLIC PROPERTIES",
        watch: { videoUrl: "https://youtu.be/No8okxqy0vA?si=8mJXeQY9Q94EcR4v", title: "CIRCLES – CYCLIC PROPERTIES — One Shot Lecture" },
        revise: {
          summary: "A quadrilateral with all its four vertices lying on a circle is called a cyclic quadrilateral.",
          bullets: [
            "A quadrilateral with all its four vertices lying on a circle is called a cyclic quadrilateral.",
            "Opposite Angles: The sum of opposite angles of a cyclic quadrilateral is 180 degrees (Supplementary).",
            "Angle A + Angle C = 180 degrees Angle B + Angle D = 180 degrees Exterior Angle: The exterior angle at a vertex of a cyclic quadrilateral is equal to the interior opposite angle.",
            "If AB is produced to E, then: Angle CBE = Angle ADC.",
            "To prove that four points are concyclic (lie on the same circle), show that the angles subtended by a segment at two points on the same side of it are equal, or that opposite angles of the quadrilateral formed by them sum to 180 degrees.",
          ],
        },
        practice: [
          {
            question: "In a cyclic quadrilateral ABCD, Angle A = (x + 10) degrees, Angle B = (y + 20) degrees, Angle C = (3y - 30) degrees and Angle D = (2x - 20) degrees. Find the values of x and y and hence all four angles.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "In the given figure, ABCD is a cyclic quadrilateral. Side AB is produced to E. If Angle CBE = 110 degrees and Angle ADC = 85 degrees, find Angle DAB and Angle DCB.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Prove that the sum of opposite angles of a cyclic quadrilateral is 180 degrees.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Two chords AB and CD of a circle intersect at point P outside the circle. Prove that triangles APC and BPD are similar. This question uses the external angle property.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "ABCD is a cyclic trapezium with AB parallel to DC. Show that AD = BC.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch16",
        title: "CIRCLES – ANGLE PROPERTIES",
        watch: { videoUrl: "https://youtu.be/nSuSvnCEGZg?si=qDMhnkHeBpoXNqk0", title: "CIRCLES – ANGLE PROPERTIES — One Shot Lecture" },
        revise: {
          summary: "The angle which an arc of a circle subtends at the centre is double the angle it subtends at any point on the remaining part of the circle. For arc AB: Angle AOB (at centre) = 2 x Angle ACB (at any po",
          bullets: [
            "The angle which an arc of a circle subtends at the centre is double the angle it subtends at any point on the remaining part of the circle.",
            "For arc AB: Angle AOB (at centre) = 2 x Angle ACB (at any point on the circle).",
            "Angles subtended by an arc in the same segment of a circle are equal.",
            "All angles formed on the same side of a chord and in the same arc of the circle are equal to each other.",
            "The angle in a semi-circle is a right angle (90 degrees).",
            "If AB is the diameter, then Angle ACB = 90 degrees for any point C on the circle.",
          ],
        },
        practice: [
          {
            question: "Prove that the angle subtended by an arc at the centre is double the angle subtended by it at any point on the remaining part of the circle.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "In a circle of radius 5 cm, AB is a chord. The angle subtended by chord AB at the centre is 60 degrees. Find the length of chord AB and its distance from the centre.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "In the given figure, O is the centre of the circle and Angle AOC = 120 degrees. Find Angle ABC.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Show that angles in the same segment of a circle are equal. Use this to find an unknown angle given others.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "AB is a diameter of a circle, and AC is a chord. If Angle CAB = 30 degrees, prove that the radius of the circle is equal to half the length of chord BC.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch17",
        title: "TANGENTS and SECANTS",
        watch: { videoUrl: "https://youtu.be/6_iEGczwfO8?si=JEFgL9UENGR8WJiu", title: "TANGENTS and SECANTS — One Shot Lecture" },
        revise: {
          summary: "A tangent is a line that touches the circle at exactly one point. The point of contact is the point where the tangent meets the circle.",
          bullets: [
            "A tangent is a line that touches the circle at exactly one point.",
            "The point of contact is the point where the tangent meets the circle.",
            "Radius Tangent Perpendicularity: The tangent at any point of a circle is perpendicular to the radius through the point of contact.",
            "Tangents from an External Point: The lengths of two tangents drawn from an external point to a circle are equal.",
            "PA = PB Alternate Segment Theorem: The angle between a tangent and a chord through the point of contact is equal to the angle in the alternate segment.",
          ],
        },
        practice: [
          {
            question: "Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "From an external point P, two tangents PA and PB are drawn to a circle with centre O. Prove that Angle AOB and Angle APB are supplementary.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Using the Alternate Segment Theorem, find the value of an angle between a chord and tangent given some other angle in the figure.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "In the given diagram, PT is a tangent and PAB is a secant to a circle. If PT = 6 cm, PA = 4 cm, find PB.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Two chords AB and CD of a circle intersect at P inside the circle. If AP = 4 cm, PB = 6 cm, CP = 3 cm, find PD.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch18",
        title: "CYLINDER, CONE and SPHERE (MENSURATION)",
        watch: { videoUrl: "https://youtu.be/GlcnVhwJA5Y?si=Z7zgiBza32MRuOuw", title: "CYLINDER, CONE and SPHERE (MENSURATION) — One Shot Lecture" },
        revise: {
          summary: "Curved Surface Area (CSA) = 2 x pi x r x h Total Surface Area (TSA) = 2 x pi x r x (r + h) Volume = pi x r² x h",
          bullets: [
            "Curved Surface Area (CSA) = 2 x pi x r x h Total Surface Area (TSA) = 2 x pi x r x (r + h) Volume = pi x r² x h.",
            "Slant Height (l): l = sqrt(r² + h²) Curved Surface Area (CSA) = pi x r x l Total Surface Area (TSA) = pi x r x (l + r) Volume = (1/3) x pi x r² x h.",
            "Sphere: Surface Area = 4 x pi x r² Volume = (4/3) x pi x r³ Hemisphere (Solid): Curved Surface Area = 2 x pi x r² Total Surface Area = 3 x pi x r² Volume = (2/3) x pi x r³.",
            "When one solid is melted and recast into another shape, the volume of the new solid equals the volume of the original solid.",
            "The surface areas will change.",
          ],
        },
        practice: [
          {
            question: "Find the volume, curved surface area and total surface area of a cylinder with radius 7 cm and height 20 cm.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "The curved surface area of a cone is 550 cm². If its slant height is 25 cm, find its radius and height. Then find its volume.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A sphere of radius 6 cm is melted and recast into a cone of height 8 cm. Find the radius of the cone.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A solid is composed of a cylinder with hemispherical ends. The total height of the solid is 20 cm, and the diameter of the cylinder and hemispheres is 14 cm. Find the total surface area and volume of the solid.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "A cylinder is open at both ends and is made of 1.5 cm thick metal. Its external diameter is 12 cm and its height is 90 cm. Find the volume of metal used to make the cylinder.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "ma-ch19",
        title: "TRIGONOMETRIC IDENTITIES",
        watch: { videoUrl: "https://youtu.be/sKVWQK2Zn34?si=Kc4aMnbeAi_o21n0", title: "TRIGONOMETRIC IDENTITIES — One Shot Lecture" },
        revise: {
          summary: "sin A = Perpendicular / Hypotenuse cos A = Base / Hypotenuse tan A = Perpendicular / Base cosec A = 1 / sin A sec A = 1 / cos A cot A = 1 / tan A",
          bullets: [
            "sin A = Perpendicular / Hypotenuse cos A = Base / Hypotenuse tan A = Perpendicular / Base cosec A = 1 / sin A sec A = 1 / cos A cot A = 1 / tan A.",
            "tan A = sin A / cos A cot A = cos A / sin A.",
            "Identity 1: sin²A + cos²A = 1 Identity 2: 1 + tan²A = sec²A Identity 3: 1 + cot²A = cosec²A.",
            "Use the fundamental identities to simplify and prove equations.",
            "General approach: convert all terms to sin A and cos A, then simplify.",
          ],
        },
        practice: [
          {
            question: "Prove that: (sin A + cos A)² + (sin A - cos A)² = 2",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Prove the identity: (1 + tan²A) / (1 + cot²A) = tan²A",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Prove that: (cosec A - sin A)(sec A - cos A) = 1 / (tan A + cot A)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Prove: sqrt[(1 + sin A) / (1 - sin A)] = sec A + tan A",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Evaluate: (sin 30 degrees + cos 60 degrees) / (sec 45 degrees + tan 45 degrees)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
    ],
  },
  history: {
    chapters: [
      {
        id: "hi-ch1",
        title: "THE FIRST WAR of INDEPENDENCE, 1857",
        watch: { videoUrl: "https://youtu.be/e8AZQ7mla84?si=rU6OUtyZ9E9EKZo_", title: "THE FIRST WAR of INDEPENDENCE, 1857 — One Shot Lecture" },
        revise: {
          summary: "A. Political Causes The British policy of expansion through the Doctrine of Lapse (Lord Dalhousie) annexed many Indian states like Satara, Jhansi, and Nagpur. When a ruler died without a natural male",
          bullets: [
            "Political Causes The British policy of expansion through the Doctrine of Lapse (Lord Dalhousie) annexed many Indian states like Satara, Jhansi, and Nagpur.",
            "When a ruler died without a natural male heir, the state was taken over by the British.",
            "This created fear and resentment among Indian rulers.",
            "The annexation of Awadh on grounds of misgovernment in 1856 further angered Indians.",
            "Social and Religious Causes The British introduced reforms like the abolition of Sati (1829), the Widow Remarriage Act (1856), and allowed Christian missionaries to propagate their religion.",
            "Indians feared that the British intended to destroy their religion and convert them to Christianity.",
            "Laws such as the Religious Disabilities Act (1850), which allowed converts to inherit ancestral property, deepened these fears.",
            "Economic Causes The economic policies of the British ruined Indian agriculture and traditional handicrafts.",
          ],
        },
        practice: [
          {
            question: "Explain any three political causes that led to the Revolt of 1857.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How did the social and religious policies of the British contribute to the outbreak of 1857?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What was the Doctrine of Lapse? Name any two states annexed under this policy.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How did the economic exploitation by the British alienate the Indian masses before 1857?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the immediate (military) cause that sparked the Revolt of 1857.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch2",
        title: "GROWTH of NATIONALISM",
        watch: { videoUrl: "https://youtu.be/gTjfRlcc8AQ?si=2qjti7KdiKG4oQm8", title: "GROWTH of NATIONALISM — One Shot Lecture" },
        revise: {
          summary: "A. Economic Exploitation The British systematically drained India\'s wealth. Raw materials were taken to Britain, and finished goods were sold back at high prices. Indian handicrafts and cottage indust",
          bullets: [
            "Economic Exploitation The British systematically drained India\'s wealth.",
            "Raw materials were taken to Britain, and finished goods were sold back at high prices.",
            "Indian handicrafts and cottage industries were ruined.",
            "Heavy land revenue made peasants poor.",
            "Famines became frequent.",
            "Indians realised that their poverty was a direct result of British colonial exploitation.",
            "Dadabhai Naoroji propounded the \"Drain Theory\" to explain this transfer of wealth from India to England.",
            "Repressive Colonial Policies Discontent against British rule grew due to various repressive policies.",
          ],
        },
        practice: [
          {
            question: "Explain how economic exploitation by the British contributed to the growth of Indian nationalism.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Mention any two repressive policies of the British that led to national awakening in India.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State any two contributions of the following reformers: (a) Raja Rammohan Roy (b) Jyotiba Phule (c) Swami Dayananda Saraswathi (d) Swami Vivekananda",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How did the Indian press contribute to the growth of nationalism?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Who founded the Indian National Congress and in which year? Where was its first session held?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch3",
        title: "INDIAN NATIONAL CONGRESS – OBJECTIVES and EARLY PHASE",
        watch: { videoUrl: "https://youtu.be/f1-vxNd36Rg?si=WgmwEKMbAKFao07N", title: "INDIAN NATIONAL CONGRESS – OBJECTIVES and EARLY PHASE — One Shot Lecture" },
        revise: {
          summary: "A. Objectives and Methods of Struggle The Early Nationalists had faith in the British sense of justice and fairness. They believed that the British would grant necessary reforms if the just demands of",
          bullets: [
            "Objectives and Methods of Struggle The Early Nationalists had faith in the British sense of justice and fairness.",
            "They believed that the British would grant necessary reforms if the just demands of Indians were placed before them.",
            "Their methods were constitutional, peaceful, and within the law.",
            "They organised meetings, sent petitions and memorials to the British government, and passed resolutions in Congress sessions.",
            "Their main aim was self-government within the British Empire, like the Dominions of Canada and Australia.",
            "Contributions of Key Leaders Dadabhai Naoroji: Known as the \"Grand Old Man of India\".",
            "He was the first Indian to be elected to the House of Commons in Britain (1892).",
            "He propounded the \"Drain Theory\" to explain how British colonial rule drained India\'s wealth.",
          ],
        },
        practice: [
          {
            question: "Explain the methods used by the Early Nationalists (Moderates) in their struggle for political reforms.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State any two contributions each of Dadabhai Naoroji, Surendranath Banerjee, and Gopal Krishna Gokhale.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why was Bengal partitioned in 1905? What was the real motive behind it?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How did the Anti-Partition Movement (Swadeshi and Boycott) influence the national movement?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What were the causes and results of the Surat Split of 1907?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch5",
        title: "CIVIL DISOBEDIENCE MOVEMENT",
        watch: { videoUrl: "https://youtu.be/rHQkh80MZFk?si=aOi1WFXd71DQsPw1", title: "CIVIL DISOBEDIENCE MOVEMENT — One Shot Lecture" },
        revise: {
          summary: "A. The Simon Commission (1927) The British government appointed the Simon Commission in 1927 to review the working of the Government of India Act 1919. The Commission consisted entirely of British mem",
          bullets: [
            "The Simon Commission (1927) The British government appointed the Simon Commission in 1927 to review the working of the Government of India Act 1919.",
            "The Commission consisted entirely of British members; no Indian was included.",
            "The Congress and the Muslim League both decided to boycott the Commission.",
            "Wherever the Commission went, it was greeted with black flags and the slogan \"Simon Go Back!\".",
            "Lala Lajpat Rai was injured in a police lathi charge during a protest against the Commission at Lahore and later died.",
            "Declaration of Poorna Swaraj (1929) The Lahore session of the Indian National Congress (December 1929), under the presidentship of Jawaharlal Nehru, declared Poorna Swaraj (Complete Independence) as the goal of the Indian people.",
            "On 26 January 1930, the first Independence Day was celebrated with the unfurling of the tricolour flag.",
            "The pledge of Poorna Swaraj was taken by millions across the country.",
          ],
        },
        practice: [
          {
            question: "What was the Simon Commission? Why was it boycotted by Indians?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the significance of the Lahore Session of the Congress (1929).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe the Dandi March and its significance in the Indian national movement.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What were the main programmes of the Civil Disobedience Movement?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What was the Gandhi-Irwin Pact? Why did Gandhi agree to participate in the Second Round Table Conference?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch6",
        title: "FORWARD BLOC and INDIAN NATIONAL ARMY (INA)",
        watch: { videoUrl: "https://youtu.be/Drw6s-hqFgM?si=5rIH5jBn4-i6eRLL", title: "FORWARD BLOC and INDIAN NATIONAL ARMY (INA) — One Shot Lecture" },
        revise: {
          summary: "The Forward Bloc was founded by Subhas Chandra Bose on 3 May 1939, shortly after he resigned from the Presidentship of the Indian National Congress due to differences with the Gandhian leadership. Obj",
          bullets: [
            "The Forward Bloc was founded by Subhas Chandra Bose on 3 May 1939, shortly after he resigned from the Presidentship of the Indian National Congress due to differences with the Gandhian leadership.",
            "Objectives of the Forward Bloc: To achieve complete independence for India through any means, including revolutionary struggle.",
            "To unite all anti-imperialist forces and the left-wing elements within the Congress and outside.",
            "To fight against British imperialism in India and support movements against other colonial powers worldwide.",
            "To reorganise and mobilise the youth and peasants for the struggle.",
            "Founder: The Indian National Army was originally formed by Captain Mohan Singh in Singapore in 1942 with the help of the Japanese.",
            "However, it was later reorganised and revived by Subhas Chandra Bose in Singapore on 5 July 1943, where he gave the famous call \"Give me blood, and I will give you freedom!\".",
            "Objectives of the INA: To liberate India from British rule by military means.",
          ],
        },
        practice: [
          {
            question: "Who founded the Forward Bloc and when? State any two objectives of the Forward Bloc.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Who was the founder of the original INA? Who revived it and gave it the name \"Azad Hind Fauj\"?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the objectives of the Indian National Army (INA).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What was the contribution of Subhas Chandra Bose to the Indian freedom struggle?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Give the meanings of the slogans: (a) \"Delhi Chalo\", (b) \"Jai Hind\", (c) \"Give me blood, and I will give you freedom!\"",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch7",
        title: "INDEPENDENCE and PARTITION of INDIA",
        watch: { videoUrl: "https://youtu.be/u6sUQwQtqsg?si=XaMSgt0Io3NvVAfM", title: "INDEPENDENCE and PARTITION of INDIA — One Shot Lecture" },
        revise: {
          summary: "The Cabinet Mission was sent by the British Government in March 1946, consisting of three Cabinet ministers: Lord Pethick-Lawrence, Sir Stafford Cripps, and A.V. Alexander. Main Clauses (Proposals): I",
          bullets: [
            "The Cabinet Mission was sent by the British Government in March 1946, consisting of three Cabinet ministers: Lord Pethick-Lawrence, Sir Stafford Cripps, and A.",
            "Main Clauses (Proposals): India would be a federal union consisting of British Indian provinces and princely states.",
            "The Union would control only three subjects: Defence, Foreign Affairs, and Communications.",
            "All other subjects would be under the control of the provinces.",
            "The provinces would be divided into three groups: Group A (Hindu majority provinces), Group B (Muslim majority provinces in the northwest), and Group C (Muslim majority provinces in the northeast).",
            "Each province could opt out of a group after the first general elections.",
            "An Interim Government of Indians was to be formed at the centre.",
            "Lord Louis Mountbatten became the last Viceroy of India in March 1947.",
          ],
        },
        practice: [
          {
            question: "What was the Cabinet Mission Plan? State any three of its main clauses.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How did the Cabinet Mission propose to divide the provinces into groups?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State any three clauses of the Mountbatten Plan.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why did the Congress and the Muslim League accept the Mountbatten Plan?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the important clauses of the Indian Independence Act of 1947.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch8",
        title: "THE FIRST WORLD WAR",
        watch: { videoUrl: "https://youtu.be/ltc4-ABipWY?si=MdDrG2IHkJYLyNaO", title: "THE FIRST WORLD WAR — One Shot Lecture" },
        revise: {
          summary: "A. Nationalism and Imperialism Nationalism in Europe was intense and aggressive. Each nation considered itself superior and wanted to dominate others. Imperialist rivalry among European powers for col",
          bullets: [
            "Nationalism and Imperialism Nationalism in Europe was intense and aggressive.",
            "Each nation considered itself superior and wanted to dominate others.",
            "Imperialist rivalry among European powers for colonies in Africa and Asia created tension.",
            "Britain, France, Germany, and Italy competed to acquire colonies for raw materials and markets.",
            "Germany challenged British naval supremacy, which created bitterness.",
            "Armament Race (Militarism) European countries engaged in a massive arms race.",
            "Germany and Britain competed to build greater naval strength.",
            "All major powers increased their armies and weapons.",
          ],
        },
        practice: [
          {
            question: "Explain how aggressive nationalism and imperialism contributed to the outbreak of the First World War.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What was the armament race? How did it cause the First World War?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Name the two major alliances that divided Europe before the First World War. Name the member nations of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What was the immediate cause of the First World War? Explain the Sarajevo Crisis.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe any three terms of the Treaty of Versailles.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch9",
        title: "RISE of DICTATORSHIPS — FASCISM and NAZISM",
        watch: { videoUrl: "https://youtu.be/4WCRGTjCYl0?si=8vKU4M_F1wWs_lVb", title: "RISE of DICTATORSHIPS — FASCISM and NAZISM — One Shot Lecture" },
        revise: {
          summary: "Fascism was a political ideology that believed in the absolute supremacy of the state and the unquestioning obedience of the people to its leader. Benito Mussolini founded the Fascist Party in Italy i",
          bullets: [
            "Fascism was a political ideology that believed in the absolute supremacy of the state and the unquestioning obedience of the people to its leader.",
            "Benito Mussolini founded the Fascist Party in Italy in 1919.",
            "Causes for the Rise of Fascism in Italy: Dissatisfaction with the Treaty of Versailles: Italy joined the war on the side of the Allies expecting territorial gains, but it did not get what was promised.",
            "Economic crisis: After the war, Italy faced severe unemployment, inflation, and industrial unrest.",
            "Fear of Communism: The industrial workers and peasants were influenced by the Russian Revolution (1917).",
            "The rich and middle classes supported Fascism to crush communism.",
            "Weak government: The democratic government in Italy failed to solve the country\'s problems.",
            "Mussolini promised stability, order, and national glory.",
          ],
        },
        practice: [
          {
            question: "What is meant by Fascism? Name its founder.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the causes that led to the rise of Fascism in Italy.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why was Italy dissatisfied with the Treaty of Versailles?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the causes that led to the rise of Nazism in Germany.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How did the Great Depression of 1929 help in the rise of Hitler and the Nazi Party?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch10",
        title: "THE SECOND WORLD WAR",
        watch: { videoUrl: "https://youtu.be/zLDgH9cU0ak?si=vAyF83KfDryAjwF5", title: "THE SECOND WORLD WAR — One Shot Lecture" },
        revise: {
          summary: "A. Dissatisfaction with the Treaty of Versailles Germany was humiliated by the harsh and unjust terms of the Treaty of Versailles. It lost its territory, its army was reduced, and it was forced to pay",
          bullets: [
            "Dissatisfaction with the Treaty of Versailles Germany was humiliated by the harsh and unjust terms of the Treaty of Versailles.",
            "It lost its territory, its army was reduced, and it was forced to pay a huge war indemnity.",
            "The desire for revenge and to restore national honour was a major cause of the rise of Hitler and the Second World War.",
            "Rise of Fascism and Nazism The aggressive and expansionist policies of Mussolini (Italy) and Hitler (Germany) led to international tensions.",
            "Hitler reoccupied the Rhineland, annexed Austria, and demanded the Sudetenland from Czechoslovakia.",
            "These actions went unchecked by the Western powers.",
            "Policy of Appeasement Britain and France followed a policy of appeasement, meaning they gave in to Hitler\'s demands to avoid another war.",
            "The Munich Pact (1938) allowed Germany to take over the Sudetenland.",
          ],
        },
        practice: [
          {
            question: "Explain any three causes that led to the Second World War.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What was the policy of appeasement? How did it contribute to the outbreak of the Second World War?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Why did the League of Nations fail to prevent the Second World War?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What was the immediate cause of the Second World War?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the significance of the attack on Pearl Harbour and the bombing of Hiroshima and Nagasaki in the course of the War.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch11",
        title: "THE UNION LEGISLATURE (PARLIAMENT)",
        watch: { videoUrl: "https://youtu.be/Hv74pZUXxn0?si=f_XmjHWGKsydcPat", title: "THE UNION LEGISLATURE (PARLIAMENT) — One Shot Lecture" },
        revise: {
          summary: "India has a federal system of government. This means that power is divided between the central government and the state governments by the Constitution. Both levels of government have their own separa",
          bullets: [
            "India has a federal system of government.",
            "This means that power is divided between the central government and the state governments by the Constitution.",
            "Both levels of government have their own separate jurisdictions and derive their authority from the Constitution.",
            "Term: The normal term is 5 years from the date of its first meeting.",
            "During a national emergency, the term can be extended by Parliament for one year at a time.",
            "Composition: The maximum strength is 552 members.",
            "Up to 530 members represent the states.",
            "Up to 20 members represent the Union Territories.",
          ],
        },
        practice: [
          {
            question: "What is meant by a federal setup? State the composition of the Lok Sabha.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is Quorum? Explain the different types of questions asked during Question Hour in the Lok Sabha.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Distinguish between a starred question and an unstarred question.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the Zero Hour? What is an Adjournment Motion?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between a Money Bill and an Ordinary Bill in terms of introduction and passing.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch12",
        title: "THE UNION EXECUTIVE – PRESIDENT and VICE PRESIDENT",
        watch: { videoUrl: "https://youtu.be/pfTlqBJg5IM?si=Ze3IUyFgWT0Uvkf0", title: "THE UNION EXECUTIVE – PRESIDENT and VICE PRESIDENT — One Shot Lecture" },
        revise: {
          summary: "A. Qualifications for Election Must be a citizen of India. Must have completed 35 years of age. Must be qualified to be elected as a member of the Lok Sabha. Must not hold any office of profit under t",
          bullets: [
            "Qualifications for Election Must be a citizen of India.",
            "Must have completed 35 years of age.",
            "Must be qualified to be elected as a member of the Lok Sabha.",
            "Must not hold any office of profit under the Government of India or any State Government.",
            "Composition of the Electoral College The President is elected by an Electoral College consisting of: The elected members of both Houses of Parliament (Lok Sabha and Rajya Sabha).",
            "The elected members of the Legislative Assemblies of all States and Union Territories of Delhi and Puducherry.",
            "Nominated members do not vote.",
            "Reason for Indirect Election The President has vast powers, and direct election would be very expensive and time-consuming.",
          ],
        },
        practice: [
          {
            question: "State the qualifications required to become the President of India.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe the composition of the Electoral College that elects the President. Why is the President elected indirectly?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How can the President be impeached?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the legislative powers of the President of India.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What are the emergency powers of the President? Name the three types of emergencies and state two effects of a National Emergency.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch13",
        title: "PRIME MINISTER and COUNCIL of MINISTERS",
        watch: { videoUrl: "https://youtu.be/CcQYZKoblsM?si=yoVP5_X7Q5E-R2T-", title: "PRIME MINISTER and COUNCIL of MINISTERS — One Shot Lecture" },
        revise: {
          summary: "The President appoints the Prime Minister. The leader of the majority party or coalition in the Lok Sabha is called by the President to form the government. The Prime Minister selects other ministers.",
          bullets: [
            "The President appoints the Prime Minister.",
            "The leader of the majority party or coalition in the Lok Sabha is called by the President to form the government.",
            "The Prime Minister selects other ministers.",
            "On the advice of the Prime Minister, the President then formally appoints other ministers.",
            "The Council of Ministers consists of three ranks: Cabinet Ministers, Ministers of State (with or without independent charge), and Deputy Ministers.",
            "The Prime Minister and the Council of Ministers are collectively responsible to the Lok Sabha.",
            "The Council of Ministers is the entire body of all ranks of ministers.",
            "The Cabinet is a smaller and more important body consisting of senior Cabinet Ministers only.",
          ],
        },
        practice: [
          {
            question: "How is the Prime Minister appointed? Describe the formation of the Council of Ministers.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Distinguish between the Council of Ministers and the Cabinet.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Describe the position and powers of the Prime Minister of India.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the concept of collective responsibility of the Council of Ministers.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is meant by the individual responsibility of a minister?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "hi-ch14",
        title: "THE UNION JUDICIARY",
        watch: { videoUrl: "https://youtu.be/CcQYZKoblsM?si=ea200KYTs42Sv8is", title: "THE UNION JUDICIARY — One Shot Lecture" },
        revise: {
          summary: "A. Composition The Supreme Court of India consists of the Chief Justice of India and other judges. At present, the maximum number of judges is 34 (including the Chief Justice). The Chief Justice is ap",
          bullets: [
            "Composition The Supreme Court of India consists of the Chief Justice of India and other judges.",
            "At present, the maximum number of judges is 34 (including the Chief Justice).",
            "The Chief Justice is appointed by the President.",
            "Other judges are appointed by the President in consultation with the Chief Justice.",
            "Qualifications of Judges Must be a citizen of India.",
            "Must have been a judge of a High Court for at least 5 years, or an advocate of a High Court for at least 10 years, or a distinguished jurist in the opinion of the President.",
            "Independence of the Judiciary from the Executive and Legislature The judges of the Supreme Court are appointed by the President and their appointment is not subject to interference by the executive.",
            "The judges have security of tenure.",
          ],
        },
        practice: [
          {
            question: "Explain the composition of the Supreme Court of India. How are the judges appointed?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State any three qualifications required to become a judge of the Supreme Court.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain any three provisions that ensure the independence of the judiciary.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the Original Jurisdiction of the Supreme Court.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is meant by Judicial Review? Why is the Supreme Court called the guardian of the Constitution?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
    ],
  },
  computer: {
    chapters: [
      {
        id: "cs-ch1",
        title: "REVISION of CLASS Ix SYLLABUS – JAVA PROGRAMMING BASICS",
        watch: { videoUrl: "https://youtu.be/nQz-FcmwGH8?si=dEEAOe8snX0v19F9", title: "REVISION of CLASS Ix SYLLABUS – JAVA PROGRAMMING BASICS — One Shot Lecture" },
        revise: {
          summary: "Object Oriented Programming is a programming paradigm based on the concept of \"objects\" which contain data and code. The four main principles of OOP are: Encapsulation: The wrapping up of data (variab",
          bullets: [
            "Object Oriented Programming is a programming paradigm based on the concept of \"objects\" which contain data and code.",
            "The four main principles of OOP are: Encapsulation: The wrapping up of data (variables) and methods (functions) together into a single unit called a class.",
            "It also involves hiding the internal details and protecting data from unauthorised access.",
            "Inheritance: The mechanism by which one class acquires the properties and behaviour of another class.",
            "The class that gives its properties is the base/super/parent class.",
            "The class that takes the properties is the derived/sub/child class.",
            "For example, a class \"Car\" can inherit from a class \"Vehicle\".",
            "Polymorphism: The ability of an object to take many forms.",
          ],
        },
        practice: [
          {
            question: "Explain the four principles of Object Oriented Programming with suitable real-life examples.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between Procedure Oriented Programming and Object Oriented Programming.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the compilation process in Java. What is byte code? What is the role of the JVM?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Define class and object with an example. How does a class act as a blueprint for objects?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the difference between primitive data types and reference (composite) data types with examples.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch2",
        title: "INPUT MECHANISM in JAVA",
        watch: { videoUrl: "https://youtu.be/06LT7JYS7Bo?si=xbJmHlfj9R3JQ_td", title: "INPUT MECHANISM in JAVA — One Shot Lecture" },
        revise: {
          summary: "Initialisation: Data is given to the variable before the program runs (hardcoded). Example: int a = 10; Parameters (Arguments): Data is passed to the method at the time of calling. Example: void displ",
          bullets: [
            "Initialisation: Data is given to the variable before the program runs (hardcoded).",
            "Example: int a = 10; Parameters (Arguments): Data is passed to the method at the time of calling.",
            "Example: void display(int n) – here n is the parameter.",
            "Input Stream (Scanner Class): Data is entered by the user at the time of program execution through the keyboard.",
            "Scanner is a class present in the java.",
            "It is used to take input from the user.",
            "Steps to use Scanner: Step 1: Import the Scanner class: import java.",
            "Scanner; Step 2: Create a Scanner object: Scanner sc = new Scanner(System.",
          ],
        },
        practice: [
          {
            question: "Explain the three ways of giving input in a Java program.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the Scanner class? In which package is it present? Write the steps to use the Scanner class for reading a string and an integer.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a Java statement using Scanner to read a single character from the user.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between the next() and nextLine() methods of the Scanner class.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the three types of errors that occur in a Java program with an example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch3",
        title: "MATHEMATICAL LIBRARY METHODS",
        watch: { videoUrl: "https://youtu.be/DWbooACEAqM?si=pv0IuiTXiGNAQPC3", title: "MATHEMATICAL LIBRARY METHODS — One Shot Lecture" },
        revise: {
          summary: "The Math class is present in the java.lang package, which is the default package. It provides ready-made methods for performing basic mathematical operations. All methods of the Math class are static,",
          bullets: [
            "The Math class is present in the java.",
            "lang package, which is the default package.",
            "It provides ready-made methods for performing basic mathematical operations.",
            "All methods of the Math class are static, meaning they are called using the class name: Math.",
            "pow(x, y): Returns x raised to the power y (x to the power y).",
            "Return type is double.",
            "sqrt(x): Returns the positive square root of x.",
            "Return type is double.",
          ],
        },
        practice: [
          {
            question: "What is the Math class? Which package contains it? Why are the methods of the Math class called using the class name?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write the return type and description for the following Math methods: (a) sqrt(x) (b) cbrt(x) (c) pow(x, y) (d) ceil(x) (e) floor(x)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between Math.ceil() and Math.floor() with examples.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the output of Math.ceil(-5.3) and Math.floor(-5.3)? Give reasons.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "How can you generate a random number between 0 and 50 in Java?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch4",
        title: "If ELSE and NESTED If ELSE (CONDITIONAL CONSTRUCTS)",
        watch: { videoUrl: "https://youtu.be/M8JYBz-R19o?si=eelnBHMSQkMoBi_Z", title: "If ELSE and NESTED If ELSE (CONDITIONAL CONSTRUCTS) — One Shot Lecture" },
        revise: {
          summary: "Conditional constructs (selection statements) are used to make decisions in a program. The program executes a set of instructions only if a certain condition is true. Java provides the following condi",
          bullets: [
            "Conditional constructs (selection statements) are used to make decisions in a program.",
            "The program executes a set of instructions only if a certain condition is true.",
            "Java provides the following conditional constructs.",
            "Syntax: if (condition) { // statements execute if condition is true } If the condition is true, the body of the if block is executed.",
            "If false, nothing happens.",
            "Example: Checking if a number is positive.",
            "Syntax: if (condition) { // statements execute if condition is true } else { // statements execute if condition is false } Used when one block must be executed when the condition is true, and another when it is false.",
            "Example: Check if a number is even or odd.",
          ],
        },
        practice: [
          {
            question: "Explain the syntax of the if statement and the if-else statement with an example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program using if-else-if ladder to check the grade of a student based on marks. Assume the grading system: >=90 A, >=70 B, >=50 C, <50 Fail.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is a nested if? Explain with an example program to find the largest of three numbers.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the switch-case statement? How does it differ from the if-else-if ladder?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the fall-through condition in a switch-case statement with an example.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch5",
        title: "LOOPS (ITERATIVE CONSTRUCTS)",
        watch: { videoUrl: "https://youtu.be/ZGa33g5ii3k?si=QxJ9iDT94nyekAPd", title: "LOOPS (ITERATIVE CONSTRUCTS) — One Shot Lecture" },
        revise: {
          summary: "Loops (iteration statements) are used to repeat a block of statements multiple times until a condition is met. Java provides three types of loops.",
          bullets: [
            "Loops (iteration statements) are used to repeat a block of statements multiple times until a condition is met.",
            "Java provides three types of loops.",
            "Syntax: for (initialisation; condition; update) { // loop body } Initialisation sets the starting value (executed once).",
            "Condition is checked before each execution.",
            "If true, the body executes.",
            "After the body, the update statement runs, then condition is checked again.",
            "If false, the loop terminates.",
            "Used when the number of iterations is known in advance.",
          ],
        },
        practice: [
          {
            question: "What is the difference between an entry-controlled loop and an exit-controlled loop? Give an example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write the syntax of a for loop. Explain the purpose of the initialisation, condition, and update expressions.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program using a for loop to find the sum of the first N natural numbers.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the difference between a while loop and a do-while loop? Give an example where a do-while loop is more appropriate.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the break and continue statements with an example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch6",
        title: "PATTERNS (NESTED for LOOPS)",
        watch: { videoUrl: "https://youtu.be/s33-gj4VHSM?si=JC8Q32JicT_xRGgJ", title: "PATTERNS (NESTED for LOOPS) — One Shot Lecture" },
        revise: {
          summary: "A nested loop means a loop inside another loop. For each iteration of the outer loop, the inner loop runs completely. Nested for loops are used to generate number and character patterns. The outer loo",
          bullets: [
            "A nested loop means a loop inside another loop.",
            "For each iteration of the outer loop, the inner loop runs completely.",
            "Nested for loops are used to generate number and character patterns.",
            "The outer loop generally controls the number of rows, and the inner loop controls the elements in each row.",
            "Rectangular Pattern: Filled matrix of numbers or characters.",
            "Outer loop for rows, inner loop for columns.",
            "Print \'*\' or a number repeatedly.",
            "Right Angled Triangular Pattern: Increasing Triangle: Inner loop goes from 1 to current row number.",
          ],
        },
        practice: [
          {
            question: "Write a program to print the following pattern (Right angled triangle of stars): * * * * * * * * * *",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to print the following number pattern: 1 1 2 1 2 3 1 2 3 4",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to print a filled square of asterisks (4 x 4 pattern).",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to print the following pattern: 1 2 2 3 3 3 4 4 4 4",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to print the following inverted triangle pattern: * * * * * * * * * *",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch7",
        title: "SERIES PROGRAMMING",
        watch: { videoUrl: "https://youtu.be/vA1Vx5Qw5OE?si=eKa9gN5rkxsdSv6O", title: "SERIES PROGRAMMING — One Shot Lecture" },
        revise: {
          summary: "A series is the summation or product of a sequence of terms following a specific rule. Programs on series require using loops to generate each term and accumulate a sum or product.",
          bullets: [
            "A series is the summation or product of a sequence of terms following a specific rule.",
            "Programs on series require using loops to generate each term and accumulate a sum or product.",
            "Simple Arithmetic Series: Sum = 1 + 2 + 3 +.",
            "Each term is directly obtained from the loop counter.",
            "Series based on Single Variable: Sum = x + x^2 + x^3 +.",
            "pow(base, exponent) to generate each term.",
            "Series with Factor in Denominator: Sum = 1 + 1/2 + 1/3 +.",
            "Be careful with type; use 1.",
          ],
        },
        practice: [
          {
            question: "Write a program to find the sum of the series: S = 1 + 2 + 3 + ... + N.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to find the sum of the series: S = 1 + 1/2 + 1/3 + ... + 1/N.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to find the sum of the series: S = 1 + x + x^2 + x^3 + ... + x^N.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to find the sum of the series: S = 1 - x + x^2 - x^3 + ... N terms. (Use a sign variable to toggle +/-.)",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to find the product of the series: P = 1 * 2 * 3 * ... * N.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch8",
        title: "USER-DEFINED METHODS (FUNCTIONS)",
        watch: { videoUrl: "https://youtu.be/DWbooACEAqM?si=JYX1e1J13bM-Q8BW", title: "USER-DEFINED METHODS (FUNCTIONS) — One Shot Lecture" },
        revise: {
          summary: "A method is a block of code that performs a specific task and can be called (invoked) whenever needed. Methods promote reusability, modularity, and readability in a program. A complex problem can be b",
          bullets: [
            "A method is a block of code that performs a specific task and can be called (invoked) whenever needed.",
            "Methods promote reusability, modularity, and readability in a program.",
            "A complex problem can be broken down into smaller sub-problems, each handled by a method.",
            "<access specifier> <return type> <method name> (<parameter list>) { // method body [return value;] // if return type is not void } Access Specifier: public, private, protected.",
            "Return Type: The data type of the value the method returns.",
            "Use void if it returns nothing.",
            "Method Name: Identifier used to call the method.",
            "Parameter List: Comma-separated list of variables that receive input values (formal parameters).",
          ],
        },
        practice: [
          {
            question: "What is a method? Explain the need for methods with an example.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the difference between actual parameters and formal parameters.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is meant by call by value? Explain with an example and show that the original variable is not affected.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between pure and impure methods with an example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the difference between a static method and a non-static method? How is each one called?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch9",
        title: "CONSTRUCTORS",
        watch: { videoUrl: "https://youtu.be/5pm61kW5hYs?si=8PQj4VBWgxzUwVdl", title: "CONSTRUCTORS — One Shot Lecture" },
        revise: {
          summary: "A constructor is a special type of method that is automatically called when an object of a class is created. It has the same name as the class. Its main purpose is to initialise the instance variables",
          bullets: [
            "A constructor is a special type of method that is automatically called when an object of a class is created.",
            "It has the same name as the class.",
            "Its main purpose is to initialise the instance variables of the object.",
            "It has the same name as the class.",
            "It has no return type, not even void.",
            "It is automatically invoked when the object is created using the new keyword.",
            "If no constructor is defined, the compiler provides a default constructor (no parameters, empty body).",
            "A class can have more than one constructor (constructor overloading).",
          ],
        },
        practice: [
          {
            question: "What is a constructor? State any three characteristics of a constructor.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the difference between a default constructor and a parameterized constructor.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "When is a default constructor automatically provided by the compiler? When is it not provided?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is constructor overloading? Give an example of a class with an overloaded constructor.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a class Student with instance variables name and rollNumber. Write a default and a parameterized constructor to initialise these variables.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch10",
        title: "LIBRARY CLASSES (WRAPPER CLASSES)",
        watch: { videoUrl: "https://youtu.be/DWbooACEAqM?si=JYX1e1J13bM-Q8BW", title: "LIBRARY CLASSES (WRAPPER CLASSES) — One Shot Lecture" },
        revise: {
          summary: "A wrapper class wraps (encloses) a primitive data type into an object. All primitive data types in Java have a corresponding wrapper class. byte -> Byte short -> Short int -> Integer long -> Long floa",
          bullets: [
            "A wrapper class wraps (encloses) a primitive data type into an object.",
            "All primitive data types in Java have a corresponding wrapper class.",
            "byte -> Byte short -> Short int -> Integer long -> Long float -> Float double -> Double char -> Character boolean -> Boolean.",
            "Autoboxing: The automatic conversion of a primitive data type into its corresponding wrapper class object.",
            "Example: Integer i = 5; // int to Integer automatically Unboxing: The automatic conversion of a wrapper class object back into its corresponding primitive data type.",
            "Example: int a = i; // Integer to int automatically.",
            "parseInt(String s): Converts a numeric String s into an int primitive.",
            "Example: int a = Integer.",
          ],
        },
        practice: [
          {
            question: "What is a wrapper class? Name the wrapper class for each primitive data type.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain autoboxing and unboxing with an example of each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a statement using Integer.parseInt() to convert a string \"456\" into an int. What happens if the string is \"abc\"?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "State the purpose of the following methods: parseDouble(), parseFloat(), parseLong().",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the difference between Character.isDigit() and Character.isLetter()? Write an example showing their use.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch11",
        title: "STRING HANDLING",
        watch: { videoUrl: "https://youtu.be/oR81oaKdrhk?si=SW_BpaPN3Jxn84Pw", title: "STRING HANDLING — One Shot Lecture" },
        revise: {
          summary: "String is a built-in class in Java present in the java.lang package. A string is a sequence of characters. Strings in Java are immutable, meaning once created, their value cannot be changed. Any opera",
          bullets: [
            "String is a built-in class in Java present in the java.",
            "A string is a sequence of characters.",
            "Strings in Java are immutable, meaning once created, their value cannot be changed.",
            "Any operation that appears to modify a string actually creates a new string object.",
            "Creating a string: String s = \"Hello\"; or String s = new String(\"Hello\");.",
            "int length(): Returns the number of characters in the string (including spaces).",
            "length() returns 5 char charAt(int index): Returns the character at the specified index position.",
            "charAt(1) returns \'e\' int indexOf(char ch): Returns the index of the first occurrence of character ch.",
          ],
        },
        practice: [
          {
            question: "What is the String class? What does it mean that strings in Java are immutable?",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the difference between equals() and compareTo() methods. Write a program segment to check if two strings are equal ignoring case.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Differentiate between the following methods with examples: (a) indexOf() and lastIndexOf() (b) length() and charAt() (c) toLowerCase() and toUpperCase()",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "What is the output of the following? (a) \" Computer \".trim().length() (b) \"Hello\".replace(\'l\', \'w\')",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to input a string and print it in reverse order using charAt() and length() methods.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch12",
        title: "ARRAYS (SINGLE DIMENSIONAL)",
        watch: { videoUrl: "https://youtu.be/N5FK6JtkAkA?si=W4Wy_R4SOw_svvk5", title: "ARRAYS (SINGLE DIMENSIONAL) — One Shot Lecture" },
        revise: {
          summary: "An array is a collection of variables of the same data type, stored in contiguous memory locations, and accessed using a common name with an index. It is a composite (reference) data type. The length",
          bullets: [
            "An array is a collection of variables of the same data type, stored in contiguous memory locations, and accessed using a common name with an index.",
            "It is a composite (reference) data type.",
            "The length statement (arrayName.",
            "length) gives the number of elements.",
            "Declaration: dataType arrayName[]; OR dataType[] arrayName; Example: int arr[]; Allocation: arrayName = new dataType[size]; Example: arr = new int[5]; Declaration and Allocation Together: int arr[] = new int[5]; Initialisation: Assigning values.",
            "At declaration: int arr[] = {5, 10, 15, 20, 25}; Using loop: for(int i = 0; i < arr.",
            "length; i++) arr[i] = sc.",
            "nextInt(); Accessing Elements: arrayName[index] – index starts from 0 and goes up to (length - 1).",
          ],
        },
        practice: [
          {
            question: "Define an array. How is an array declared, allocated memory, and initialised? Write the syntax for each.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to input 10 numbers into an array and find the sum of all elements.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the selection sort technique. Write a program to sort an array in ascending order using selection sort.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Explain the bubble sort technique. Write a program to sort an array in ascending order using bubble sort.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to search for a given element in an array using linear search. Print the index if found.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
      {
        id: "cs-ch13",
        title: "2-D ARRAY (DOUBLE DIMENSIONAL ARRAY)",
        watch: { videoUrl: "https://youtu.be/ZJ-Cb_zRxuI?si=j1-CXFZMsFDc9SQ3", title: "2-D ARRAY (DOUBLE DIMENSIONAL ARRAY) — One Shot Lecture" },
        revise: {
          summary: "A double dimensional (2-D) array is an array of arrays. It has rows and columns, forming a matrix or table. It is a composite data type.",
          bullets: [
            "A double dimensional (2-D) array is an array of arrays.",
            "It has rows and columns, forming a matrix or table.",
            "It is a composite data type.",
            "Declaration: dataType arr[][]; OR dataType[][] arr; Allocation: arr = new dataType[rows][columns]; Example: int mat[][] = new int[3][3]; // 3x3 matrix Declaration and Allocation Together: int mat[][] = new int[3][4]; Initialisation: Use nested loops.",
            "Outer loop for rows (i), inner loop for columns (j).",
            "nextInt(); Accessing Elements: mat[row_index][col_index].",
            "Use nested for loops to print each element.",
            "After the inner loop completes (each row), print a new line using System.",
          ],
        },
        practice: [
          {
            question: "Define a double dimensional array. Write the syntax for declaring and allocating a 2-D array of size 4x4.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to input elements into a 3x3 double dimensional array and display it in matrix format.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to find the sum of the elements of each row in a 2-D integer array.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to find the sum of the elements of each column in a 2-D integer array.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
          {
            question: "Write a program to find the sum of the left diagonal and right diagonal elements of a square matrix.",
            answer: "Refer to your revision notes above for a detailed answer.",
          },
        ],
      },
    ],
  },
};
