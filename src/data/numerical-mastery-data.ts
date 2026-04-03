// ⚡ Physics Numerical Mastery — Real Data from PDF
// Structure: Chapter → Topic → Formula → Solved Example → PYQ
// Source: "physics numericals -2.pdf" — ICSE PYQs 2007–2025

export interface SolvedExample {
  question: string;
  steps: string[];
  finalAnswer: string;
}

export interface PYQQuestion {
  year: number;
  question: string;
  steps: string[];
  finalAnswer: string;
}

export interface NumericalTopic {
  id: string;
  name: string;
  formula: string;
  formulaDescription: string;
  solvedExample: SolvedExample;
  pyqs: PYQQuestion[];
  aiTip: string;
}

export interface NumericalChapter {
  id: string;
  name: string;
  icon: string;
  color: string;
  topics: NumericalTopic[];
}

export const numericalMasteryData: NumericalChapter[] = [
  // ═══════════════════════════════════════════
  // Chapter 1: Force, Work, Power & Energy
  // ═══════════════════════════════════════════
  {
    id: "force-work-power-energy",
    name: "Force, Work, Power & Energy",
    icon: "🚀",
    color: "#F59E0B",
    topics: [
      {
        id: "moment-of-force",
        name: "Moment of Force / Torque",
        formula: "τ = F × d",
        formulaDescription: "Torque equals force times perpendicular distance from the pivot",
        solvedExample: {
          question: "A door lock is opened by turning the lever (handle) of length 0.2 m. If the moment of force produced is 1 Nm, find the minimum force required.",
          steps: [
            "Given: τ = 1 Nm, d = 0.2 m",
            "Using τ = F × d",
            "1 = F × 0.2",
            "F = 1/0.2 = 5 N",
          ],
          finalAnswer: "5 N",
        },
        pyqs: [
          {
            year: 2024,
            question: "A non-uniform beam of weight 120 N pivoted at one end. Calculate the value of F to keep the beam in equilibrium. (d₁ = 0.2 m, d₂ = 0.8 m)",
            steps: [
              "Applying principle of moments (clockwise = anticlockwise)",
              "120 × 0.2 = F × 0.8",
              "F = (120 × 0.2)/0.8",
              "F = 24/0.8 = 30 N",
            ],
            finalAnswer: "30 N",
          },
          {
            year: 2012,
            question: "A boy of mass 30 kg is sitting at a distance of 2 m from the middle of a see-saw. Where should a boy of mass 40 kg sit to balance the see-saw?",
            steps: [
              "Using principle of moments: 30 × 2 = 40 × x",
              "60 = 40x",
              "x = 60/40 = 1.5 m",
              "The boy should sit at 1.5 m from the centre on the other side.",
            ],
            finalAnswer: "1.5 m from the centre",
          },
        ],
        aiTip: "Always draw a clear diagram showing the pivot, forces and distances. Examiners award marks for labelled diagrams in moment questions.",
      },
      {
        id: "work-done",
        name: "Work Done",
        formula: "W = F × s × cos θ",
        formulaDescription: "Work equals force times displacement times cosine of the angle between them",
        solvedExample: {
          question: "A satellite revolves around a planet in a circular orbit. What is the work done by the satellite at any instant?",
          steps: [
            "The centripetal force acts towards the centre",
            "Displacement is tangential to the orbit",
            "θ = 90° between force and displacement",
            "W = Fs cos 90° = 0 J",
          ],
          finalAnswer: "0 Joules",
        },
        pyqs: [
          {
            year: 2011,
            question: "A coolie carrying a load on his head and moving on a frictionless horizontal platform does no work. Explain the reason why.",
            steps: [
              "W = Fs cos θ",
              "θ = 90° (force is vertical, displacement is horizontal)",
              "W = Fs cos 90° = 0",
            ],
            finalAnswer: "Work done = 0 (force ⊥ displacement)",
          },
          {
            year: 2007,
            question: "How can the work done be measured when force is applied at an angle to the direction of displacement?",
            steps: [
              "Work done = force × component of displacement in the direction of force",
              "W = F × s × cos θ",
              "where θ is the angle between force and displacement",
            ],
            finalAnswer: "W = F × s × cos θ",
          },
        ],
        aiTip: "When force is perpendicular to displacement, work done is ZERO. This is a classic trick question — look for 90° angles!",
      },
      {
        id: "potential-energy",
        name: "Potential Energy",
        formula: "PE = mgh",
        formulaDescription: "Gravitational potential energy equals mass × acceleration due to gravity × height",
        solvedExample: {
          question: "A body of mass 200 g falls freely from a height of 15 m. When the body reaches 10 m above the ground, its potential energy will be? (g = 10 m/s²)",
          steps: [
            "Given: m = 200 g = 0.2 kg, h = 10 m, g = 10 m/s²",
            "PE = mgh",
            "PE = 0.2 × 10 × 10",
            "PE = 20 J",
          ],
          finalAnswer: "20 J",
        },
        pyqs: [
          {
            year: 2013,
            question: "A girl of mass 35 kg climbs up from the first floor at height 4 m to the third floor at height 12 m. Find the increase in her gravitational PE. (g = 10 m/s²)",
            steps: [
              "PE₁ = mgh₁ = 35 × 10 × 4 = 1400 J",
              "PE₂ = mgh₂ = 35 × 10 × 12 = 4200 J",
              "Increase in PE = 4200 - 1400",
              "= 2800 J",
            ],
            finalAnswer: "2800 J",
          },
        ],
        aiTip: "Always convert grams to kilograms (÷1000) before substituting. Unit errors are the #1 mark-loss in energy problems.",
      },
      {
        id: "kinetic-energy",
        name: "Kinetic Energy",
        formula: "KE = ½mv²",
        formulaDescription: "Kinetic energy equals half the product of mass and velocity squared",
        solvedExample: {
          question: "When the speed of a moving object is doubled, what happens to its kinetic energy?",
          steps: [
            "KE = ½mv²",
            "If v becomes 2v, then KE = ½m(2v)²",
            "KE = ½m × 4v² = 4 × (½mv²)",
            "KE becomes 4 times the original",
          ],
          finalAnswer: "KE becomes 4 times",
        },
        pyqs: [
          {
            year: 2012,
            question: "A moving body weighing 400 N possesses 500 J of kinetic energy. Calculate the velocity. (g = 10 m/s²)",
            steps: [
              "m = Weight/g = 400/10 = 40 kg",
              "KE = ½mv² → 500 = ½ × 40 × v²",
              "500 = 20v² → v² = 25",
              "v = 5 m/s",
            ],
            finalAnswer: "5 m/s",
          },
          {
            year: 2009,
            question: "A body of mass 5 kg moves at 10 m/s. Find the ratio of initial KE to final KE if mass is doubled and velocity is halved.",
            steps: [
              "Initial KE = ½ × 5 × 10² = 250 J",
              "Final KE = ½ × 10 × 5² = 125 J",
              "Ratio = 250:125",
              "= 2:1",
            ],
            finalAnswer: "2:1",
          },
        ],
        aiTip: "KE depends on v² — doubling speed quadruples energy! Always mention this relationship for full marks.",
      },
      {
        id: "power",
        name: "Power",
        formula: "P = W/t  |  P = F × v",
        formulaDescription: "Power is the rate of doing work, or force times velocity",
        solvedExample: {
          question: "Calculate the power spent by a crane while lifting a load of mass 2000 kg at velocity of 1.5 m/s. (g = 10 m/s²)",
          steps: [
            "Force = mg = 2000 × 10 = 20000 N",
            "Using P = F × v",
            "P = 20000 × 1.5",
            "P = 30000 W = 30 kW",
          ],
          finalAnswer: "30000 W (30 kW)",
        },
        pyqs: [
          {
            year: 2024,
            question: "Sumit does 600 J of work in 10 min and Amit does 300 J of work in 20 min. Calculate the ratio of powers delivered by them.",
            steps: [
              "P₁ = W/t = 600/(10 × 60) = 600/600 = 1 W",
              "P₂ = W/t = 300/(20 × 60) = 300/1200 = 0.25 W",
              "Ratio P₁:P₂ = 1:0.25",
              "= 4:1",
            ],
            finalAnswer: "4:1",
          },
          {
            year: 2015,
            question: "Rajan exerts a force of 150 N in pulling a cart at a constant speed of 10 m/s. Calculate the power exerted.",
            steps: [
              "Given: F = 150 N, v = 10 m/s",
              "P = F × v",
              "P = 150 × 10",
              "P = 1500 W",
            ],
            finalAnswer: "1500 W",
          },
        ],
        aiTip: "Always convert minutes to seconds when calculating power. Use P = F × v when velocity is given directly — it's faster!",
      },
      {
        id: "mechanical-advantage",
        name: "Mechanical Advantage",
        formula: "MA = Load / Effort",
        formulaDescription: "Mechanical advantage is the ratio of load to effort in a machine",
        solvedExample: {
          question: "A woman draws water from a well using a fixed pulley. Mass of bucket + water = 10 kg, force applied = 200 N. Find MA. (g = 10 m/s²)",
          steps: [
            "Load = mg = 10 × 10 = 100 N",
            "Effort = 200 N",
            "MA = Load/Effort = 100/200",
            "MA = 0.5",
          ],
          finalAnswer: "0.5",
        },
        pyqs: [
          {
            year: 2008,
            question: "With reference to mechanical advantage, velocity ratio and efficiency of a machine, name the term that will not change for a machine of a given design.",
            steps: [
              "Mechanical Advantage changes with load",
              "Efficiency changes with friction",
              "Velocity Ratio depends only on the design/geometry",
              "VR will not change for a machine of a given design",
            ],
            finalAnswer: "Velocity Ratio (VR)",
          },
        ],
        aiTip: "For a single fixed pulley, MA = 1 (ideal) and VR = 1. The effort equals the load but direction changes.",
      },
      {
        id: "efficiency",
        name: "Efficiency of Machines",
        formula: "η = (MA/VR) × 100%",
        formulaDescription: "Efficiency equals mechanical advantage divided by velocity ratio, times 100",
        solvedExample: {
          question: "A block and tackle system has VR = 5. Rohan exerts a pull of 150 kgf. Find the maximum load if efficiency = 75%.",
          steps: [
            "Efficiency = MA/VR → 75/100 = MA/5",
            "MA = 3.75",
            "MA = Load/Effort → 3.75 = Load/150",
            "Load = 3.75 × 150 = 562.5 kgf",
          ],
          finalAnswer: "562.5 kgf",
        },
        pyqs: [
          {
            year: 2022,
            question: "A body of mass 200 g falls freely from a height of 15 m. Find the total mechanical energy just before hitting the ground. (g = 10 m/s²)",
            steps: [
              "At height 15 m: Total energy = PE = mgh",
              "= 0.2 × 10 × 15 = 30 J",
              "By conservation of energy, total energy is constant",
              "Total mechanical energy just before hitting ground = 30 J",
            ],
            finalAnswer: "30 J",
          },
        ],
        aiTip: "Efficiency is always less than 100% in real machines due to friction. If you get η > 100%, recheck your calculation!",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // Chapter 2: Light
  // ═══════════════════════════════════════════
  {
    id: "light",
    name: "Light",
    icon: "💡",
    color: "#00D4FF",
    topics: [
      {
        id: "refractive-index",
        name: "Refractive Index",
        formula: "μ = c/v  |  μ = Real depth / Apparent depth",
        formulaDescription: "Refractive index relates speed of light in vacuum to speed in a medium, or real depth to apparent depth",
        solvedExample: {
          question: "A pond appears to be 2.7 m deep. If the refractive index of water is 4/3, find the actual depth.",
          steps: [
            "Given: Apparent depth = 2.7 m, μ = 4/3",
            "μ = Real depth / Apparent depth",
            "4/3 = Real depth / 2.7",
            "Real depth = (4/3) × 2.7 = 3.6 m",
          ],
          finalAnswer: "3.6 m",
        },
        pyqs: [
          {
            year: 2015,
            question: "The speed of light in glass is 2 × 10⁵ km/s. What is the refractive index of glass? (Speed of light in air = 3 × 10⁸ m/s)",
            steps: [
              "v = 2 × 10⁵ km/s = 2 × 10⁸ m/s",
              "μ = c/v",
              "μ = (3 × 10⁸)/(2 × 10⁸)",
              "μ = 1.5",
            ],
            finalAnswer: "1.5",
          },
          {
            year: 2022,
            question: "The refractive index of a diamond is 2.4. What does this mean?",
            steps: [
              "μ = c/v → 2.4 = c/v",
              "c = 2.4v",
              "Speed of light in vacuum = 2.4 × speed of light in diamond",
            ],
            finalAnswer: "Speed of light in vacuum is 2.4 times the speed in diamond",
          },
        ],
        aiTip: "Always convert km/s to m/s before calculating. The refractive index is ALWAYS greater than 1 for any medium denser than air.",
      },
      {
        id: "critical-angle",
        name: "Critical Angle & Total Internal Reflection",
        formula: "μ = 1/sin C",
        formulaDescription: "Refractive index equals the reciprocal of the sine of the critical angle",
        solvedExample: {
          question: "The critical angle of the material of a prism for blue colour is 43°. What is the measure of the angle of this prism?",
          steps: [
            "For total internal reflection to occur inside the prism",
            "The angle of incidence must exceed the critical angle",
            "From the diagram, angle of prism = critical angle",
            "A = 43°",
          ],
          finalAnswer: "43°",
        },
        pyqs: [
          {
            year: 2007,
            question: "A right-angled prism with critical angle for glass = 42°. What is the value of the angle of deviation shown by the ray?",
            steps: [
              "In a right-angled prism with total internal reflection",
              "The ray undergoes total internal reflection at the hypotenuse",
              "The angle of deviation = 90°",
            ],
            finalAnswer: "90°",
          },
        ],
        aiTip: "Total internal reflection ONLY occurs when light goes from denser to rarer medium AND angle of incidence > critical angle.",
      },
      {
        id: "lens-formula",
        name: "Lens Formula",
        formula: "1/f = 1/v - 1/u",
        formulaDescription: "Relates focal length (f), image distance (v), and object distance (u) with sign convention",
        solvedExample: {
          question: "A convex lens of focal length 10 cm is placed 60 cm from a screen. How far from the lens should an object be placed for a real image on the screen?",
          steps: [
            "Given: v = +60 cm, f = +10 cm",
            "1/f = 1/v - 1/u → 1/10 = 1/60 - 1/u",
            "1/u = 1/60 - 1/10 = (1 - 6)/60 = -5/60",
            "u = -12 cm (object 12 cm in front of lens)",
          ],
          finalAnswer: "12 cm from the lens",
        },
        pyqs: [
          {
            year: 2024,
            question: "The image of a candle flame placed 36 cm from a spherical lens is formed on a screen 72 cm from the lens. Calculate focal length and power.",
            steps: [
              "u = -36 cm, v = +72 cm",
              "1/f = 1/v - 1/u = 1/72 - 1/(-36) = 1/72 + 1/36",
              "1/f = (1 + 2)/72 = 3/72 = 1/24 → f = 24 cm = 0.24 m",
              "P = 1/f = 1/0.24 ≈ 4.17 D",
            ],
            finalAnswer: "f = 24 cm, P ≈ 4.17 D",
          },
          {
            year: 2018,
            question: "An object is placed 12 cm from a convex lens of focal length 8 cm. Find the position and nature of the image.",
            steps: [
              "u = -12 cm, f = +8 cm",
              "1/v = 1/f + 1/u = 1/8 + 1/(-12) = 1/8 - 1/12",
              "1/v = (3 - 2)/24 = 1/24",
              "v = +24 cm → Real, inverted, magnified, 24 cm behind lens",
            ],
            finalAnswer: "v = 24 cm (real, inverted, magnified)",
          },
        ],
        aiTip: "Follow SIGN CONVENTION strictly: u is always negative for real objects. Most marks are lost due to wrong signs!",
      },
      {
        id: "lens-power",
        name: "Power of a Lens",
        formula: "P = 1/f  (f in metres, P in Dioptres)",
        formulaDescription: "Power of a lens in Dioptres equals the reciprocal of focal length in metres",
        solvedExample: {
          question: "The power of a lens is -5D. Find its focal length. Name the type of lens.",
          steps: [
            "P = 1/f → -5 = 1/f",
            "f = 1/(-5) = -0.2 m = -20 cm",
            "Negative focal length → diverging lens",
            "This is a concave lens",
          ],
          finalAnswer: "f = -20 cm (concave lens)",
        },
        pyqs: [
          {
            year: 2024,
            question: "Calculate the focal length and power of a lens when u = -36 cm and v = +72 cm.",
            steps: [
              "1/f = 1/v - 1/u = 1/72 + 1/36 = 3/72 = 1/24",
              "f = 24 cm = 0.24 m",
              "P = 1/f = 1/0.24",
              "P = 4.17 D",
            ],
            finalAnswer: "f = 24 cm, P = 4.17 D",
          },
        ],
        aiTip: "Always convert focal length to METRES before calculating power. 25 cm = 0.25 m, NOT 25. This is the most common mistake!",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // Chapter 3: Sound
  // ═══════════════════════════════════════════
  {
    id: "sound",
    name: "Sound",
    icon: "🔊",
    color: "#06B6D4",
    topics: [
      {
        id: "echo",
        name: "Echo",
        formula: "Distance = (Speed × Time) / 2",
        formulaDescription: "For an echo, sound travels to the reflector and back, so divide total distance by 2",
        solvedExample: {
          question: "Lata stands between two cliffs and claps her hands. Determine the time taken to hear the first echo. Speed of sound = 320 m/s, distance to cliff A = 120 m.",
          steps: [
            "Distance to cliff A = 120 m",
            "Sound travels to cliff and back = 2 × 120 = 240 m",
            "Time = Distance/Speed = 240/320",
            "Time = 0.75 s",
          ],
          finalAnswer: "0.75 seconds",
        },
        pyqs: [
          {
            year: 2022,
            question: "A boy standing in front of a wall produces two whistles per second. The echo coincides with his whistling. Calculate the distance between the boy and the wall. (Speed = 320 m/s)",
            steps: [
              "Time between two whistles = 1/2 = 0.5 s",
              "This is the time for echo to return",
              "v = 2d/t → 320 = 2d/0.5",
              "d = (320 × 0.5)/2 = 80 m",
            ],
            finalAnswer: "80 m",
          },
          {
            year: 2008,
            question: "A radar sends a signal to an aeroplane at a distance 45 km away with speed 3 × 10⁸ m/s. After how long is the signal received back?",
            steps: [
              "Distance = 45 km = 45000 m",
              "Total distance = 2 × 45000 = 90000 m",
              "Time = Distance/Speed = 90000/(3 × 10⁸)",
              "Time = 3 × 10⁻⁴ s",
            ],
            finalAnswer: "3 × 10⁻⁴ s",
          },
        ],
        aiTip: "Remember: the minimum distance for an echo is 17 m (since the minimum time gap for the human ear is 0.1 s and v ≈ 340 m/s).",
      },
      {
        id: "frequency-wavelength",
        name: "Frequency, Wavelength & Velocity",
        formula: "v = f × λ",
        formulaDescription: "Wave velocity equals frequency times wavelength",
        solvedExample: {
          question: "A sound wave travelling in water has wavelength 0.4 m. Is this wave audible in air? (Speed of sound in water = 1400 m/s)",
          steps: [
            "f = v/λ = 1400/0.4 = 3500 Hz",
            "Audible range: 20 Hz to 20000 Hz",
            "3500 Hz lies within audible range",
            "Yes, this wave is audible",
          ],
          finalAnswer: "Yes, audible (3500 Hz)",
        },
        pyqs: [
          {
            year: 2017,
            question: "A certain sound has a frequency of 256 Hz and a wavelength of 1.3 m. Calculate the speed of this sound.",
            steps: [
              "Given: f = 256 Hz, λ = 1.3 m",
              "v = f × λ",
              "v = 256 × 1.3",
              "v = 332.8 m/s",
            ],
            finalAnswer: "332.8 m/s",
          },
        ],
        aiTip: "Frequency stays the same when sound moves between media. Only wavelength and speed change!",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // Chapter 4: Electricity & Magnetism
  // ═══════════════════════════════════════════
  {
    id: "electricity-magnetism",
    name: "Electricity & Magnetism",
    icon: "🔌",
    color: "#3B82F6",
    topics: [
      {
        id: "ohms-law",
        name: "Ohm's Law",
        formula: "V = IR",
        formulaDescription: "Voltage equals current times resistance at constant temperature",
        solvedExample: {
          question: "A music system draws 400 mA current from a 12 V battery. (i) Find the resistance. (ii) It stops playing at 320 mA. At what voltage does it stop?",
          steps: [
            "(i) R = V/I = 12/(400 × 10⁻³) = 12/0.4 = 30 Ω",
            "(ii) V = IR = 320 × 10⁻³ × 30",
            "V = 0.32 × 30 = 9.6 V",
          ],
          finalAnswer: "(i) 30 Ω  (ii) 9.6 V",
        },
        pyqs: [
          {
            year: 2013,
            question: "A metal wire of resistance 6 Ω is stretched so that its length doubles. Calculate its new resistance.",
            steps: [
              "R = ρl/A",
              "When length becomes 2l, area becomes A/2 (volume constant)",
              "New R = ρ(2l)/(A/2) = 4ρl/A = 4R",
              "New resistance = 4 × 6 = 24 Ω",
            ],
            finalAnswer: "24 Ω",
          },
        ],
        aiTip: "When a wire is stretched to n times its length, resistance becomes n² times. This is a very common PYQ pattern!",
      },
      {
        id: "resistance-series",
        name: "Resistance in Series",
        formula: "R = R₁ + R₂ + R₃ + ...",
        formulaDescription: "In series combination, total resistance is the sum of all resistances",
        solvedExample: {
          question: "A battery of EMF 12V and internal resistance 2Ω is connected with resistors 4Ω and 6Ω in series. Find the current.",
          steps: [
            "R = R₁ + R₂ = 4 + 6 = 10 Ω",
            "Total resistance = R + r = 10 + 2 = 12 Ω",
            "I = E/(R + r) = 12/12",
            "I = 1 A",
          ],
          finalAnswer: "1 A",
        },
        pyqs: [
          {
            year: 2016,
            question: "A battery of EMF 12V and internal resistance 2Ω is connected with 4Ω and 6Ω resistors in series. Find the current in the circuit.",
            steps: [
              "External resistance R = 4 + 6 = 10 Ω",
              "Total resistance = R + r = 10 + 2 = 12 Ω",
              "I = E/(R + r) = 12/12",
              "I = 1 A",
            ],
            finalAnswer: "1 A",
          },
        ],
        aiTip: "Don't forget the internal resistance of the battery! Total R = external resistance + internal resistance.",
      },
      {
        id: "resistance-parallel",
        name: "Resistance in Parallel",
        formula: "1/R = 1/R₁ + 1/R₂ + 1/R₃ + ...",
        formulaDescription: "In parallel, reciprocals of resistances add up",
        solvedExample: {
          question: "Two combinations (10Ω+6Ω in series and 12Ω+4Ω in series) are connected in parallel. Find total resistance.",
          steps: [
            "R₁ = 10 + 6 = 16 Ω",
            "R₂ = 12 + 4 = 16 Ω",
            "1/R = 1/16 + 1/16 = 2/16 = 1/8",
            "R = 8 Ω",
          ],
          finalAnswer: "8 Ω",
        },
        pyqs: [
          {
            year: 2012,
            question: "Three resistors are connected to a 6V battery. Calculate the equivalent resistance. (R₁ = 9Ω, R₂ = 4.5Ω in parallel)",
            steps: [
              "1/R = 1/9 + 1/4.5",
              "1/R = 1/9 + 2/9 = 3/9 = 1/3",
              "R = 3 Ω",
            ],
            finalAnswer: "3 Ω",
          },
        ],
        aiTip: "Parallel resistance is ALWAYS less than the smallest individual resistor. Use this as a quick sanity check!",
      },
      {
        id: "electric-power",
        name: "Electric Power",
        formula: "P = VI = I²R = V²/R",
        formulaDescription: "Electrical power has three equivalent forms derived from Ohm's Law",
        solvedExample: {
          question: "A geyser is rated 240 W – 220 V. Explain the meaning of this statement.",
          steps: [
            "When connected to 220 V supply",
            "The geyser consumes 240 Joules of energy per second",
            "This is its power rating at the rated voltage",
          ],
          finalAnswer: "Consumes 240 J/s at 220 V supply",
        },
        pyqs: [
          {
            year: 2022,
            question: "An appliance rated 440 W, 220 V is connected to 220 V supply. (a) Calculate the maximum current. (b) Calculate the resistance.",
            steps: [
              "(a) I = P/V = 440/220 = 2 A",
              "(b) R = V²/P = (220)²/440",
              "R = 48400/440",
              "R = 110 Ω",
            ],
            finalAnswer: "(a) 2 A  (b) 110 Ω",
          },
          {
            year: 2009,
            question: "An electric heater is rated 1000 W – 200 V. Calculate: (i) resistance of the heating element, (ii) current flowing through it.",
            steps: [
              "(i) R = V²/P = (200)²/1000 = 40000/1000 = 40 Ω",
              "(ii) I = P/V = 1000/200 = 5 A",
            ],
            finalAnswer: "(i) 40 Ω  (ii) 5 A",
          },
        ],
        aiTip: "Pick the right formula based on what's given: use P = V²/R when current is not given, P = I²R when voltage is not given.",
      },
      {
        id: "electrical-energy",
        name: "Electrical Energy",
        formula: "E = P × t  (in kWh when P in kW, t in hours)",
        formulaDescription: "Electrical energy consumed equals power times time. 1 kWh = 3.6 × 10⁶ J",
        solvedExample: {
          question: "An electrical heater rated 4 kW, 220 V. Find the cost of using it for 12 hours at Rs. 3.25 per kWh.",
          steps: [
            "E = P × t = 4 × 12 = 48 kWh",
            "Cost = Energy × Rate",
            "Cost = 48 × 3.25",
            "Cost = Rs. 156",
          ],
          finalAnswer: "Rs. 156",
        },
        pyqs: [
          {
            year: 2012,
            question: "An electrical appliance is rated 1000 kVA, 220V. It operates for 2 hours. Calculate energy consumed in (i) kWh (ii) Joules.",
            steps: [
              "(i) Energy = 1000 × 2 = 2000 kWh",
              "(ii) 1 kWh = 3.6 × 10⁶ J",
              "Energy = 2000 × 3.6 × 10⁶",
              "= 7.2 × 10⁹ J",
            ],
            finalAnswer: "(i) 2000 kWh  (ii) 7.2 × 10⁹ J",
          },
        ],
        aiTip: "1 kWh = 3.6 × 10⁶ J — memorize this conversion. Also remember to use kW (not W) with hours for kWh!",
      },
      {
        id: "charge-current",
        name: "Charge & Current",
        formula: "I = Q/t",
        formulaDescription: "Current equals charge divided by time",
        solvedExample: {
          question: "In a circuit, calculate the charge passing through a 3Ω resistor in 120 s if the current is 0.5 A.",
          steps: [
            "Given: I = 0.5 A, t = 120 s",
            "Q = I × t",
            "Q = 0.5 × 120",
            "Q = 60 C",
          ],
          finalAnswer: "60 Coulombs",
        },
        pyqs: [
          {
            year: 2013,
            question: "In the circuit, calculate the charge passing through the 3Ω resistor in 120 s.",
            steps: [
              "Current through 3Ω resistor = 0.5 A",
              "Q = I × t",
              "Q = 0.5 × 120",
              "Q = 60 C",
            ],
            finalAnswer: "60 C",
          },
        ],
        aiTip: "1 Ampere = 1 Coulomb per second. Current is the rate of flow of charge.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // Chapter 5: Heat
  // ═══════════════════════════════════════════
  {
    id: "heat",
    name: "Heat",
    icon: "🔥",
    color: "#EF4444",
    topics: [
      {
        id: "specific-heat",
        name: "Specific Heat Capacity",
        formula: "Q = m × c × ΔT",
        formulaDescription: "Heat energy equals mass × specific heat capacity × change in temperature",
        solvedExample: {
          question: "A metal piece of 420 g at 80°C is dropped in 80 g of water at 20°C in a calorimeter of 84 g. If final temp = 30°C, find specific heat of metal. (c_water = 4.2 J/g°C, c_cal = 0.2 J/g°C)",
          steps: [
            "Heat lost by metal = 420 × S × (80 - 30) = 21000S J",
            "Heat gained by water = 80 × 4.2 × (30 - 20) = 3360 J",
            "Heat gained by calorimeter = 84 × 0.2 × (30 - 20) = 168 J",
            "21000S = 3360 + 168 = 3528 → S = 0.168 J/g°C",
          ],
          finalAnswer: "0.168 J/g°C",
        },
        pyqs: [
          {
            year: 2017,
            question: "A solid of 50 g at 150°C is placed in 100 g of water at 11°C. Final temp = 20°C. Find specific heat of solid. (c_water = 4.2 J/g°C)",
            steps: [
              "Heat lost by solid = 50 × c × (150 - 20) = 6500c J",
              "Heat gained by water = 100 × 4.2 × (20 - 11) = 3780 J",
              "By principle of calorimetry: 6500c = 3780",
              "c = 3780/6500 = 0.58 J/g°C",
            ],
            finalAnswer: "0.58 J/g°C",
          },
          {
            year: 2016,
            question: "Calculate mass of ice required to lower 300 g of water at 40°C to 0°C. (L_ice = 336 J/g, c_water = 4.2 J/g°C)",
            steps: [
              "Heat lost by water = 300 × 4.2 × 40 = 50400 J",
              "Heat gained by ice = m × 336",
              "m × 336 = 50400",
              "m = 50400/336 = 150 g",
            ],
            finalAnswer: "150 g",
          },
        ],
        aiTip: "Heat lost = Heat gained (principle of calorimetry). Don't forget to include the calorimeter's heat absorption if its mass is given!",
      },
      {
        id: "latent-heat",
        name: "Latent Heat",
        formula: "Q = m × L",
        formulaDescription: "Heat required for phase change equals mass times the specific latent heat",
        solvedExample: {
          question: "30 g of ice at 0°C is used to bring down water at 70°C to 20°C. Find mass of water. (c_water = 4.2 J/g°C, L_ice = 336 J/g)",
          steps: [
            "Heat absorbed by ice to melt = 30 × 336 = 10080 J",
            "Heat absorbed by melted ice (0°C → 20°C) = 30 × 4.2 × 20 = 2520 J",
            "Total heat absorbed = 10080 + 2520 = 12600 J",
            "Heat lost by water = m × 4.2 × 50 = 210m → m = 12600/210 = 60 g",
          ],
          finalAnswer: "60 g",
        },
        pyqs: [
          {
            year: 2018,
            question: "A solid metal of 150 g melts at 800°C by providing heat at 100 W. Time taken to completely melt = 4 min. Find specific latent heat of fusion.",
            steps: [
              "Heat supplied = Power × time = 100 × (4 × 60) = 24000 J",
              "Q = m × L → 24000 = 150 × L",
              "L = 24000/150 = 160 J/g",
              "= 1.6 × 10⁵ J/kg",
            ],
            finalAnswer: "160 J/g (1.6 × 10⁵ J/kg)",
          },
          {
            year: 2024,
            question: "How much heat is required to convert 500 g of ice at 0°C to water at 0°C? (L = 330 J/g)",
            steps: [
              "Q = m × L",
              "Q = 500 × 330",
              "Q = 165000 J",
              "= 165 kJ",
            ],
            finalAnswer: "165000 J (165 kJ)",
          },
        ],
        aiTip: "When ice melts and then warms up, calculate BOTH: Q₁ = mL (melting) + Q₂ = mcΔT (warming). Students often forget Q₂!",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // Chapter 6: Modern Physics
  // ═══════════════════════════════════════════
  {
    id: "modern-physics",
    name: "Modern Physics",
    icon: "⚛️",
    color: "#10B981",
    topics: [
      {
        id: "radioactivity-half-life",
        name: "Radioactivity & Half-life",
        formula: "N = N₀ × (1/2)ⁿ",
        formulaDescription: "Amount remaining after n half-lives equals initial amount times (1/2)^n",
        solvedExample: {
          question: "A radioactive nucleus containing 128 nucleons emits a β⁻ particle. After β emission, the number of nucleons present will be?",
          steps: [
            "β⁻ emission: a neutron converts to a proton + electron",
            "Mass number (nucleons) does NOT change",
            "Only atomic number increases by 1",
            "Nucleons remain 128",
          ],
          finalAnswer: "128 nucleons",
        },
        pyqs: [
          {
            year: 2007,
            question: "What happens to the atomic number of an element when it emits: (1) an alpha particle; (2) a beta particle.",
            steps: [
              "(1) α emission: 2 protons + 2 neutrons are emitted",
              "Atomic number decreases by 2",
              "(2) β emission: a neutron → proton + electron",
              "Atomic number increases by 1",
            ],
            finalAnswer: "(1) Decreases by 2  (2) Increases by 1",
          },
        ],
        aiTip: "α particle = ₂He⁴ (mass ↓4, atomic no. ↓2). β particle = ₋₁e⁰ (mass same, atomic no. ↑1). Memorize these changes!",
      },
      {
        id: "nuclear-reactions",
        name: "Nuclear Reactions",
        formula: "Conservation of mass number & atomic number",
        formulaDescription: "In nuclear reactions, total mass number and total atomic number are conserved on both sides",
        solvedExample: {
          question: "Complete the nuclear reaction: ₉₂U²³⁵ + ₀n¹ → ₅₆Ba¹⁴¹ + __Kr⁹² + 3₀n¹",
          steps: [
            "LHS mass = 235 + 1 = 236",
            "RHS mass = 141 + 92 + 3(1) = 236 ✓",
            "LHS atomic no. = 92 + 0 = 92",
            "RHS atomic no. = 56 + Z + 0 → Z = 36 (Krypton)",
          ],
          finalAnswer: "₃₆Kr⁹² (Z = 36)",
        },
        pyqs: [
          {
            year: 2016,
            question: "An element ₂S^A decays to ₈₅R²²² after emitting 2 α particles and 1 β particle. Find atomic number and mass of S.",
            steps: [
              "After 2 α emissions: mass decreases by 8, atomic no. decreases by 4",
              "After 1 β emission: mass unchanged, atomic no. increases by 1",
              "Final mass = 222, so initial mass = 222 + 8 = 230",
              "Final atomic no. = 85, so initial = 85 + 4 - 1 = 88",
            ],
            finalAnswer: "₈₈S²³⁰ (Z = 88, A = 230)",
          },
        ],
        aiTip: "Balance BOTH mass number AND atomic number on both sides of the equation. Write them clearly above/below the element symbol.",
      },
    ],
  },
];
