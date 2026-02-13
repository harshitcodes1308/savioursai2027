// Mathematics — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const mathematicsPaper1: TYQPaper = {
  subject: "Mathematics",
  subjectId: "mathematics",
  paperNumber: 1,
  year: "2026",
  totalMarks: 80,
  sections: [
    {
      name: "Section A",
      instructions: "Attempt all questions from this section. Internal choice is not provided.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options. (Do not copy the question. Write the correct answers only.)",
          marks: 15,
          subQuestions: [
            { number: "(i)", text: "If the discriminant of the quadratic equation 2x² - 5x + k = 0 is 1, then the value of k is:", options: ["2", "3", "4", "5"], marks: 1 },
            { number: "(ii)", text: "The ratio in which the point (2, y) divides the line segment joining (4, 3) and (6, 3) is:", options: ["1:2", "2:1", "1:1", "1:3"], marks: 1 },
            { number: "(iii)", text: "If the volume of a cylinder is 770 cm³ and its radius is 7 cm, then the height of the cylinder is:", options: ["5 cm", "10 cm", "15 cm", "20 cm"], marks: 1 },
            { number: "(iv)", text: "The median of the data: 3, 5, 9, 10, 11, 4, 5, 8, when arranged in ascending order is:", options: ["5", "6.5", "7", "8"], marks: 1 },
            { number: "(v)", text: "A bag contains 5 red, 3 blue and 2 green balls. A ball is drawn at random. The probability that the ball drawn is not blue is:", options: ["3/10", "7/10", "1/2", "1/5"], marks: 1 },
            { number: "(vi)", text: "If matrix A = [2 3; 1 4] and B = [1 0; 2 5], then A + B is:", options: ["[3 3; 3 9]", "[3 3; 1 9]", "[1 3; 3 9]", "[3 3; 3 5]"], marks: 1 },
            { number: "(vii)", text: "The slope of a line perpendicular to the line 3x - 4y + 7 = 0 is:", options: ["3/4", "-3/4", "4/3", "-4/3"], marks: 1 },
            { number: "(viii)", text: "If sinθ = 3/5, then the value of tanθ is:", options: ["3/4", "4/3", "5/3", "3/5"], marks: 1 },
            { number: "(ix)", text: "The total surface area of a cone with radius r and slant height l is:", options: ["πrl", "πr(r + l)", "πr²l", "2πrl"], marks: 1 },
            { number: "(x)", text: "A man deposits ₹200 per month for 36 months. The total principal deposited is:", options: ["₹7200", "₹7000", "₹7400", "₹7600"], marks: 1 },
            { number: "(xi)", text: "If a:b = 3:4 and b:c = 2:5, then a:c is:", options: ["3:10", "6:20", "3:5", "6:5"], marks: 1 },
            { number: "(xii)", text: "The 10th term of an A.P. 3, 7, 11, 15, ... is:", options: ["39", "43", "35", "47"], marks: 1 },
            { number: "(xiii)", text: "In the given figure, PA and PB are tangents to the circle from point P. If ∠APB = 60°, then ∠OAB is:", options: ["30°", "60°", "90°", "120°"], marks: 1 },
            { number: "(xiv)", text: "Assertion (A): The roots of the equation x² + 4x + 5 = 0 are not real.\nReason (R): The discriminant of the equation is negative.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(xv)", text: "If the sum of the deviations from a certain value 'a' is zero, then 'a' is the:", options: ["Mean", "Median", "Mode", "Range"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Using the Remainder Theorem, find the remainder when 2x³ - 3x² + 7x - 8 is divided by (x - 1).", marks: 4 },
            { number: "(ii)", text: "Solve the following inequation and represent the solution set on a number line:\n-2 ≤ ½ - ⅔x ≤ 1⅗, x ∈ R", marks: 3 },
            { number: "(iii)", text: "Mr. Sharma has a recurring deposit account in a bank for 3 years at 9% per annum simple interest. If the maturity value of his account is ₹16,476, find the monthly deposit.", marks: 4 },
            { number: "(iv)", text: "If the lines y = 3x + 7 and 2y + ax = 14 are parallel, find the value of a.", marks: 4 },
            { number: "(v)", text: "Find the mean proportion of 4 and 25.", marks: 3 },
            { number: "(vi)", text: "Using section formula, find the point which divides the line joining A(2, -5) and B(5, 2) in the ratio 2:1.", marks: 4 },
            { number: "(vii)", text: "A coin is tossed three times. Find the probability of getting: (a) at least two heads, (b) exactly one tail.", marks: 3 }
          ]
        }
      ]
    },
    {
      name: "Section B",
      instructions: "Attempt any four questions from this section.",
      questions: [
        {
          number: "3",
          text: "(i) Solve the quadratic equation 3x² - 5x - 2 = 0 and verify the relationship between roots and coefficients. [4]\n(ii) Cards numbered 3, 4, 5, ..., 17 are put in a box and mixed. A card is drawn at random. Find the probability that the drawn card bears: (a) an even number, (b) a number divisible by 3 or 5. [3]\n(iii) Find the remainder when f(x) = x³ - 6x² + 9x + 7 is divided by (x - 1). Hence factorize f(x) completely. [3]",
          marks: 10
        },
        {
          number: "4",
          text: "(i) The marked price of a TV is ₹32,000. A shopkeeper sells it at a discount of 20% and charges GST at 28%. Calculate: (a) the selling price, (b) the amount of GST, (c) the price paid by the customer. [4]\n(ii) Prove: (cosec A - sin A)(sec A - cos A) = 1/(tan A + cot A). [3]\n(iii) Find the coordinates of the centroid of the triangle whose vertices are: A(1, -3), B(4, 7), C(-2, 5). [3]",
          marks: 10
        },
        {
          number: "5",
          text: "(i) Construct a ΔABC where AB = 5 cm, BC = 6 cm, AC = 7 cm. Construct the circumscribed circle and measure its radius. [4]\n(ii) In a circle with centre O, AB is a chord. Prove that the perpendicular from the centre to the chord bisects the chord. [3]\n(iii) A solid cone has a radius 7 cm and height 24 cm. Find its volume and total surface area. [3]",
          marks: 10
        },
        {
          number: "6",
          text: "(i) Draw a histogram for the following distribution and estimate the mode from the graph:\nClass: 0-10, 10-20, 20-30, 30-40, 40-50\nFrequency: 5, 8, 15, 12, 6 [4]\n(ii) Find the equation of a line passing through (-2, 3) with slope 4. [3]\n(iii) For the simultaneous equations: 2x + 3y = 12 and 5x - 2y = 11, find x and y. [3]",
          marks: 10
        },
        {
          number: "7",
          text: "(i) From the top of a tower 100 m high, the angle of depression of a car is 30°. Find the distance of the car from the base of the tower. [4]\n(ii) Find the mean of the following data using the step-deviation method:\nClass: 10-20, 20-30, 30-40, 40-50, 50-60\nFrequency: 6, 10, 12, 8, 4 [3]\n(iii) If the nth term of an A.P. is (3n + 5), find the A.P. and sum of first 20 terms. [3]",
          marks: 10
        },
        {
          number: "8",
          text: "(i) A sphere of radius 3 cm is melted and recast into a cylinder of radius 2 cm. Find the height. [4]\n(ii) If A = [3 0; 0 4] and B = [1 2; 0 3], find A × B. [3]\n(iii) Prove that tanA/(1 - cotA) + cotA/(1 - tanA) = 1 + secA·cosecA. [3]",
          marks: 10
        }
      ]
    }
  ]
};

export const mathematicsPaper1Answers: TYQAnswerKey = {
  subject: "Mathematics",
  subjectId: "mathematics",
  paperNumber: 1,
  answers: [
    { questionNumber: "1(i)", answer: "(b) 3" },
    { questionNumber: "1(ii)", answer: "(a) 1:2" },
    { questionNumber: "1(iii)", answer: "(a) 5 cm" },
    { questionNumber: "1(iv)", answer: "(b) 6.5" },
    { questionNumber: "1(v)", answer: "(b) 7/10" },
    { questionNumber: "1(vi)", answer: "(a) [3 3; 3 9]" },
    { questionNumber: "1(vii)", answer: "(d) -4/3" },
    { questionNumber: "1(viii)", answer: "(a) 3/4" },
    { questionNumber: "1(ix)", answer: "(b) πr(r + l)" },
    { questionNumber: "1(x)", answer: "(a) ₹7200" },
    { questionNumber: "1(xi)", answer: "(a) 3:10" },
    { questionNumber: "1(xii)", answer: "(a) 39" },
    { questionNumber: "1(xiii)", answer: "(a) 30°" },
    { questionNumber: "1(xiv)", answer: "(a) Both A and R are true, R is correct explanation" },
    { questionNumber: "1(xv)", answer: "(a) Mean" },
    { questionNumber: "2(i)", answer: "Remainder = 2(1)³ - 3(1)² + 7(1) - 8 = 2 - 3 + 7 - 8 = -2" },
    { questionNumber: "2(ii)", answer: "-2 ≤ ½ - ⅔x ≤ 8/5 → Solve: -33/10 ≤ x ≤ 15/4. Solution set on number line." },
    { questionNumber: "2(iii)", answer: "Monthly deposit P, n=36, r=9%. Maturity = P×36 + P×(36×37)/(2×12)×9/100. Solving: P = ₹400." },
    { questionNumber: "2(iv)", answer: "y = 3x + 7 has slope 3. 2y + ax = 14 → y = -ax/2 + 7, slope = -a/2. For parallel: -a/2 = 3, so a = -6." },
    { questionNumber: "2(v)", answer: "Mean proportion of 4 and 25: x² = 4 × 25 = 100, x = 10." },
    { questionNumber: "2(vi)", answer: "P = ((2×5+1×2)/(2+1), (2×2+1×(-5))/(2+1)) = (12/3, -1/3) = (4, -1/3)." },
    { questionNumber: "2(vii)", answer: "(a) P(at least 2 heads) = 4/8 = 1/2\n(b) P(exactly 1 tail) = 3/8" }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const mathematicsPaper2: TYQPaper = {
  subject: "Mathematics",
  subjectId: "mathematics",
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
            { number: "(i)", text: "The value of k for which the system of equations 3x - y = 5 and 6x - 2y = k has infinitely many solutions is:", options: ["5", "10", "15", "0"], marks: 1 },
            { number: "(ii)", text: "A man invests ₹10,000 in shares of face value ₹100 each, paying a dividend of 12%. If each share is available at ₹125, then the number of shares he buys is:", options: ["80", "100", "125", "150"], marks: 1 },
            { number: "(iii)", text: "In the given figure, O is the centre of the circle. If ∠AOB = 140°, then the value of ∠APB is:", options: ["70°", "80°", "110°", "140°"], marks: 1 },
            { number: "(iv)", text: "The solution set of the inequation 2(2x + 3) - 10 ≤ 6(x - 2), x ∈ W is:", options: ["{0, 1, 2, 3, 4}", "{4, 5, 6, ...}", "{0, 1, 2, 3}", "{5, 6, 7, ...}"], marks: 1 },
            { number: "(v)", text: "If the median of the data 5, 7, 8, 12, 15, x, 21, 24, 25, 28 arranged in ascending order is 18, then the value of x is:", options: ["18", "19", "20", "21"], marks: 1 },
            { number: "(vi)", text: "A cylindrical tank of radius 7 m and height 10 m is filled with water. The volume of water in litres is:", options: ["1540 L", "15400 L", "154000 L", "1540000 L"], marks: 1 },
            { number: "(vii)", text: "If sin θ = 12/13, then the value of (sec θ + tan θ) / (sec θ - tan θ) is:", options: ["5", "25", "1/5", "1/25"], marks: 1 },
            { number: "(viii)", text: "The sum of the first 20 odd natural numbers is:", options: ["400", "420", "380", "441"], marks: 1 },
            { number: "(ix)", text: "The distance between the points (a cos θ, 0) and (0, a sin θ) is:", options: ["a", "2a", "a²", "√a"], marks: 1 },
            { number: "(x)", text: "A shopkeeper marks his goods 20% above the cost price and gives a discount of 10%. His gain percentage is:", options: ["8%", "10%", "12%", "15%"], marks: 1 },
            { number: "(xi)", text: "In a cyclic quadrilateral ABCD, if ∠B = 75°, then ∠D = ?", options: ["75°", "105°", "90°", "115°"], marks: 1 },
            { number: "(xii)", text: "If A = [2 1; 3 2] and I = [1 0; 0 1], then A² - 4A is equal to:", options: ["I", "-I", "5I", "-5I"], marks: 1 },
            { number: "(xiii)", text: "The HCF of two numbers is 12 and their LCM is 360. If one of the numbers is 60, the other number is:", options: ["72", "84", "96", "108"], marks: 1 },
            { number: "(xiv)", text: "Two dice are thrown simultaneously. The probability of getting a sum of 7 is:", options: ["1/6", "1/12", "5/36", "1/9"], marks: 1 },
            { number: "(xv)", text: "If a, b, c are in continued proportion, then the value of (a² + b²)/(b² + c²) is:", options: ["a/c", "c/a", "a/b", "b/c"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 25,
          subQuestions: [
            { number: "(i)", text: "Rohan has a recurring deposit account in a bank for 3 years at 8% per annum. If he gets ₹3990 as interest at the time of maturity, find his monthly instalment.", marks: 4 },
            { number: "(ii)", text: "Solve the following inequation and graph the solution set on the number line: 2x - 5 ≤ 5x + 4 < 11, x ∈ R", marks: 3 },
            { number: "(iii)", text: "A company declares a dividend of 12% on shares of face value ₹10. Mr. X purchases 200 shares at a market price of ₹16 each. Find: (a) his investment (b) his annual dividend (c) his rate of return on investment.", marks: 4 },
            { number: "(iv)", text: "In the given figure, AB || CD and EF is a transversal cutting AB at G and CD at H. If ∠EGB = 55°, find all other angles.", marks: 4 },
            { number: "(v)", text: "Find the nature of roots of the quadratic equation 2x² - 4x + 3 = 0.", marks: 3 },
            { number: "(vi)", text: "Prove the identity: (sin θ - cos θ + 1)/(sin θ + cos θ - 1) = 1/(sec θ - tan θ)", marks: 4 },
            { number: "(vii)", text: "Find the ratio in which the point P(3/4, 5/12) divides the line segment joining the points A(1/2, 3/2) and B(2, -5).", marks: 3 }
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
          text: "(i) The 7th term of an A.P. is 32 and its 13th term is 62. Find the A.P. and the sum of its first 20 terms. [4]\n(ii) A card is drawn at random from a well-shuffled pack of 52 playing cards. Find the probability that the card drawn is: (a) a red king (b) a face card (c) a spade or a club. [3]\n(iii) Using factor theorem, factorize the polynomial x³ - 6x² + 11x - 6 completely. [3]",
          marks: 10
        },
        {
          number: "4",
          text: "(i) After allowing a discount of 10% on the marked price, a trader still makes a profit of 17%. By what percent is the marked price above the cost price? [4]\n(ii) Prove that: (cosec A - sin A)(sec A - cos A) = 1/(tan A + cot A) [3]\n(iii) Find the coordinates of the points of trisection of the line segment joining A(2, -2) and B(-7, 4). [3]",
          marks: 10
        },
        {
          number: "5",
          text: "(i) Construct a triangle ABC with BC = 7 cm, AB = 5.5 cm, and AC = 6 cm. Construct the incircle of the triangle and measure its radius. [4]\n(ii) In the given figure, O is the centre of the circle. AB and AC are tangents from point A. If ∠BAC = 40°, find: (a) ∠BOC (b) ∠OBC (c) ∠OCB. [3]\n(iii) A solid is in the form of a cylinder with hemispherical ends. Total height 20 cm, diameter 7 cm. Find the total volume. [3]",
          marks: 10
        },
        {
          number: "6",
          text: "(i) Draw a cumulative frequency curve (ogive) for the distribution:\nClass: 0-10, 10-20, 20-30, 30-40, 40-50, 50-60\nFrequency: 3, 5, 8, 12, 7, 5\nHence, find the median. [4]\n(ii) Find the equation of a line passing through (2, 3) perpendicular to 3x + 4y - 5 = 0. [3]\n(iii) Solve: 5x + 3y = 19 and 3x - 2y = 0 by elimination method. [3]",
          marks: 10
        },
        {
          number: "7",
          text: "(i) From the top of a building 60 m high, the angles of depression of the top and bottom of a tower are 30° and 45° respectively. Find the height of the tower. [4]\n(ii) The mean of 25 observations was found to be 38. Two observations 56 and 34 were misread as 46 and 39. Find the correct mean. [3]\n(iii) If S = 3n² + 5n gives the sum of first n terms, find the A.P. and its 15th term. [3]",
          marks: 10
        },
        {
          number: "8",
          text: "(i) A metallic sphere of radius 4.2 cm is melted and recast into a cylinder of radius 6 cm. Find the height of the cylinder. [4]\n(ii) If (x - 1) and (x + 2) are factors of x³ + 10x² + ax + b, find a and b. [3]\n(iii) A man deposited ₹500 per month for 2 years. If he received ₹13,500 at maturity, find the rate of interest. [3]",
          marks: 10
        }
      ]
    }
  ]
};

export const mathematicsPaper2Answers: TYQAnswerKey = {
  subject: "Mathematics",
  subjectId: "mathematics",
  paperNumber: 2,
  answers: [
    { questionNumber: "1(i)", answer: "(b) 10" },
    { questionNumber: "1(ii)", answer: "(a) 80" },
    { questionNumber: "1(iii)", answer: "(c) 110°" },
    { questionNumber: "1(iv)", answer: "(b) {4, 5, 6, ...}" },
    { questionNumber: "1(v)", answer: "(d) 21" },
    { questionNumber: "1(vi)", answer: "(d) 1540000 L" },
    { questionNumber: "1(vii)", answer: "(b) 25" },
    { questionNumber: "1(viii)", answer: "(a) 400" },
    { questionNumber: "1(ix)", answer: "(a) a" },
    { questionNumber: "1(x)", answer: "(a) 8%" },
    { questionNumber: "1(xi)", answer: "(b) 105°" },
    { questionNumber: "1(xii)", answer: "(c) 5I" },
    { questionNumber: "1(xiii)", answer: "(a) 72" },
    { questionNumber: "1(xiv)", answer: "(a) 1/6" },
    { questionNumber: "1(xv)", answer: "(a) a/c" },
    { questionNumber: "2(i)", answer: "Monthly instalment ≈ ₹900" },
    { questionNumber: "2(ii)", answer: "-3 ≤ x < 1.4, x ∈ R" },
    { questionNumber: "2(iii)", answer: "(a) Investment = ₹3200\n(b) Annual Dividend = ₹240\n(c) Rate of Return = 7.5%" },
    { questionNumber: "2(iv)", answer: "All angles: 55°, 125°, 55°, 125° alternately" },
    { questionNumber: "2(v)", answer: "D = -8 < 0, roots are imaginary (not real)" },
    { questionNumber: "2(vi)", answer: "Proof using identities: divide by cos θ, use sec²θ - tan²θ = 1" },
    { questionNumber: "2(vii)", answer: "Ratio = 1:5 internally" },
    { questionNumber: "3(i)", answer: "d = 5, a = 2. A.P. = 2, 7, 12, 17... S₂₀ = 990" },
    { questionNumber: "3(ii)", answer: "(a) 1/26 (b) 3/13 (c) 1/2" },
    { questionNumber: "3(iii)", answer: "(x-1)(x-2)(x-3)" },
    { questionNumber: "4(i)", answer: "MP is 30% above CP" },
    { questionNumber: "4(ii)", answer: "Both sides simplify to sin A cos A" },
    { questionNumber: "4(iii)", answer: "P(-1, 0) and Q(-4, 2)" },
    { questionNumber: "5(i)", answer: "Construction steps with incircle. Radius ≈ 1.8 cm" },
    { questionNumber: "5(ii)", answer: "(a) ∠BOC = 140° (b) ∠OBC = 20° (c) ∠OCB = 20°" },
    { questionNumber: "5(iii)", answer: "Total volume ≈ 680.17 cm³" },
    { questionNumber: "6(i)", answer: "Median ≈ 33.5" },
    { questionNumber: "6(ii)", answer: "4x - 3y + 1 = 0" },
    { questionNumber: "6(iii)", answer: "x = 2, y = 3" },
    { questionNumber: "7(i)", answer: "Height of tower = 60 - 20√3 ≈ 25.36 m" },
    { questionNumber: "7(ii)", answer: "Correct mean = 38.2" },
    { questionNumber: "7(iii)", answer: "A.P.: 8, 14, 20... 15th term = 92" },
    { questionNumber: "8(i)", answer: "Height ≈ 2.744 cm" },
    { questionNumber: "8(ii)", answer: "a = -7, b = -18" },
    { questionNumber: "8(iii)", answer: "Rate of interest = 12% p.a." }
  ]
};
