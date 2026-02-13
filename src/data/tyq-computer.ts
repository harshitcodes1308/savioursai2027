// Computer Applications — Real Specimen Paper Data (extracted from PDFs)
import { TYQPaper, TYQAnswerKey } from "./tyq-papers";

// ==========================================
// PAPER 1 — MOCK SPECIMEN PAPER 01 (2026)
// ==========================================

export const computerPaper1: TYQPaper = {
  subject: "Computer Applications",
  subjectId: "computer-applications",
  paperNumber: 1,
  year: "2026",
  totalMarks: 100,
  sections: [
    {
      name: "Section A (40 Marks)",
      instructions: "Attempt all questions from this Section.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options. (Do not copy the question. Write the correct answers only.)",
          marks: 20,
          subQuestions: [
            { number: "(i)", text: "Which of the following is a valid Java identifier?", options: ["2ndName", "_value", "class", "my-var"], marks: 1 },
            { number: "(ii)", text: "The output of: System.out.println(5 + 3 + \"Hello\") is:", options: ["53Hello", "8Hello", "Hello53", "Hello8"], marks: 1 },
            { number: "(iii)", text: "Which of the following data types occupies the most memory?", options: ["int", "float", "double", "char"], marks: 1 },
            { number: "(iv)", text: "Which of the following is a logical operator in Java?", options: ["+", "%", "&&", "=="], marks: 1 },
            { number: "(v)", text: "Which keyword is used to define a class in Java?", options: ["define", "Class", "class", "struct"], marks: 1 },
            { number: "(vi)", text: "Which of the following is not a type of loop in Java?", options: ["for", "while", "repeat-until", "do-while"], marks: 1 },
            { number: "(vii)", text: "What is the result of: (int)(7.9)?", options: ["7", "8", "7.9", "Error"], marks: 1 },
            { number: "(viii)", text: "Which of the following is the correct way to create a String object?", options: ["String s = new String();", "string s = new String();", "String s = new string();", "string s = new string();"], marks: 1 },
            { number: "(ix)", text: "Which of the following methods returns the length of a string?", options: ["size()", "getLength()", "length()", "len()"], marks: 1 },
            { number: "(x)", text: "Which operator is used to compare two values for equality in Java?", options: ["=", "==", "!=", "equals"], marks: 1 },
            { number: "(xi)", text: "A constructor in Java has the same name as the:", options: ["Package", "Method", "Class", "Object"], marks: 1 },
            { number: "(xii)", text: "Which of the following correctly defines a method that accepts two integers and returns their product as an integer?", options: ["void product(int a, int b)", "int product(int a, b)", "int product(int a, int b)", "product(int a, int b)"], marks: 1 },
            { number: "(xiii)", text: "The statement used to exit from a loop prematurely is:", options: ["exit", "return", "break", "stop"], marks: 1 },
            { number: "(xiv)", text: "What is the default value of a local variable in Java?", options: ["0", "null", "false", "No default value; must be initialized"], marks: 1 },
            { number: "(xv)", text: "Which method converts a character to uppercase?", options: ["Character.toUpperCase()", "String.toUpperCase()", "char.toUpperCase()", "toUpperCase()"], marks: 1 },
            { number: "(xvi)", text: "Assertion (A): The Scanner class is used to take input from the user.\nReason (R): The Scanner class belongs to the java.util package.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(xvii)", text: "What will be the output of: System.out.println(\"Java\" + 10 + 20)?", options: ["Java30", "Java1020", "30Java", "Compilation Error"], marks: 1 },
            { number: "(xviii)", text: "To find the number of elements in an array arr, we use:", options: ["arr.length()", "length(arr)", "arr.length", "arr.size()"], marks: 1 },
            { number: "(xix)", text: "Which of the following correctly declares and initializes a 2D array with 3 rows and 4 columns?", options: ["int arr[3][4];", "int[][] arr = new int[3][4];", "int arr = new int[3][4];", "int arr[3][4] = new int;"], marks: 1 },
            { number: "(xx)", text: "What is the return type of the compareTo() method in the String class?", options: ["boolean", "int", "char", "String"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 20,
          subQuestions: [
            { number: "(i)", text: "Rewrite the following code using a single if statement:\nif (ch == 'a') System.out.println(\"Vowel\"); else if (ch == 'e') System.out.println(\"Vowel\"); else if (ch == 'i') System.out.println(\"Vowel\"); else if (ch == 'o') System.out.println(\"Vowel\"); else if (ch == 'u') System.out.println(\"Vowel\"); else System.out.println(\"Not a vowel\");", marks: 2 },
            { number: "(ii)", text: "Evaluate the expression when a = 5 and b = 2:\nint result = a++ + ++b - a-- + b++;\nSystem.out.println(\"a = \" + a);\nSystem.out.println(\"b = \" + b);\nSystem.out.println(\"result = \" + result);", marks: 2 },
            { number: "(iii)", text: "Identify the error in the following code and correct it to print \"PASS\" when the marks are 75 or above:\nint marks = 75;\nif (marks >= 75) System.out.println(\"PASS\");\nSystem.out.println(\"Congratulations!\");\nelse System.out.println(\"FAIL\");", marks: 2 },
            { number: "(iv)", text: "Write the Java expression for:\n√(a² + b²) / (a + b)", marks: 2 },
            { number: "(v)", text: "How many times will the following loop execute? What is the output?\nint x = 5; do { System.out.print(x + \" \"); x += 2; } while (x < 10);", marks: 2 },
            { number: "(vi)", text: "Write the output of the following String methods:\nString str1 = \"PROGRAM\"; String str2 = \"PROJECT\";\nSystem.out.println(str1.charAt(3));\nSystem.out.println(str1.compareTo(str2));", marks: 2 },
            { number: "(vii)", text: "Predict the output:\nchar ch = 'D'; int n = ch - 65 + 5; System.out.println((char)n);", marks: 2 },
            { number: "(viii)", text: "The following code has an error. Identify the type of error (syntax/logical/runtime) and correct it:\nString num = \"100\"; int x = Integer.parseInt(num); double result = Math.sqrt(x); System.out.println(\"Square root is \" + result);", marks: 2 },
            { number: "(ix)", text: "Consider the following class and answer the questions:\nclass Student {\n  String name;\n  int roll;\n  Student() { name = \"Unknown\"; roll = 0; }\n  Student(String n, int r) { name = n; roll = r; }\n}\n(a) Name the types of constructors used in this class.\n(b) How many constructors are defined in the class?", marks: 2 },
            { number: "(x)", text: "Given the 2D array: int X[][] = {{1,2,3}, {4,5,6}, {7,8,9}};\n(a) What is the value of X[2][1]?\n(b) What is the result of X[0][2] + X[1][1]?", marks: 2 }
          ]
        }
      ]
    },
    {
      name: "Section B (60 Marks)",
      instructions: "Answer any four questions from this Section. Each program should be written with: Variable description table, Comments for clarity, Proper indentation.",
      questions: [
        {
          number: "3",
          text: "Define a class named ElectricityBill with the following specifications:\nMember variables: String consumerNo, String consumerName, int prevReading, int currReading, double amount\nMember methods:\n• void inputData() - Accept values using Scanner\n• void calculate() - Calculate bill: First 100 units @ ₹2.50, Next 200 units @ ₹3.50, Above 300 units @ ₹5.00\n• void display() - Display all details\nWrite the main() method to create an object, call the methods, and display the bill.",
          marks: 15
        },
        {
          number: "4",
          text: "Define a class named ArraySearch with the following specifications:\nMember variables: int[] arr - to store 10 integers\nMember methods:\n• void accept() - Accept 10 integers\n• void bubbleSort() - Sort using Bubble Sort\n• int binarySearch(int key) - Binary Search, return index or -1\n• void display() - Display sorted array\nWrite the main() method to create an object, accept, sort, search, and display.",
          marks: 15
        },
        {
          number: "5",
          text: "Define a class named StringManipulation with the following specifications:\nMember variables: String str\nMember methods:\n• void accept() - Accept a string\n• String convertCase() - Convert uppercase to lowercase and vice versa\n• int countVowels() - Count and return vowels\n• void display() - Display original, converted, and vowel count\nWrite the main() method.",
          marks: 15
        },
        {
          number: "6",
          text: "Define a class named MatrixSum with the following specifications:\nMember variables: int[][] mat - a 3×3 matrix\nMember methods:\n• void accept() - Accept 9 integers\n• int sumOfRows() - Calculate and return sum of all elements\n• void rowWiseSum() - Calculate and display sum of each row\n• void display() - Display matrix in 3×3 format\nWrite the main() method.",
          marks: 15
        },
        {
          number: "7",
          text: "Define a class named NumberCheck with the following specifications:\nMember methods:\n• boolean isPrime(int n) - Check if prime\n• boolean isPalindrome(int n) - Check if palindrome\n• int sumOfDigits(int n) - Calculate sum of digits\n• void display(int n) - Display results\nWrite the main() method to accept an integer and call display.",
          marks: 15
        },
        {
          number: "8",
          text: "Define a class named Overload to overload the method series() as follows:\n(i) void series(int x, int n) - Display sum: S = x + x² + x³ + ... + xⁿ\n(ii) void series(int p) - Display pattern: 1 2 2 3 3 3 4 4 4 4... for p rows\n(iii) void series() - Display sum: S = 1 + (1+2) + (1+2+3) + ... + (1+2+3+...+10)\nWrite the main() method to demonstrate all three.",
          marks: 15
        }
      ]
    }
  ]
};

export const computerPaper1Answers: TYQAnswerKey = {
  subject: "Computer Applications",
  subjectId: "computer-applications",
  paperNumber: 1,
  answers: [
    { questionNumber: "1(i)", answer: "(b) _value" },
    { questionNumber: "1(ii)", answer: "(b) 8Hello" },
    { questionNumber: "1(iii)", answer: "(c) double" },
    { questionNumber: "1(iv)", answer: "(c) &&" },
    { questionNumber: "1(v)", answer: "(c) class" },
    { questionNumber: "1(vi)", answer: "(c) repeat-until" },
    { questionNumber: "1(vii)", answer: "(a) 7" },
    { questionNumber: "1(viii)", answer: "(a) String s = new String();" },
    { questionNumber: "1(ix)", answer: "(c) length()" },
    { questionNumber: "1(x)", answer: "(b) ==" },
    { questionNumber: "1(xi)", answer: "(c) Class" },
    { questionNumber: "1(xii)", answer: "(c) int product(int a, int b)" },
    { questionNumber: "1(xiii)", answer: "(c) break" },
    { questionNumber: "1(xiv)", answer: "(d) No default value; must be initialized" },
    { questionNumber: "1(xv)", answer: "(a) Character.toUpperCase()" },
    { questionNumber: "1(xvi)", answer: "(b) Both A and R are true, but R is not the correct explanation of A" },
    { questionNumber: "1(xvii)", answer: "(b) Java1020" },
    { questionNumber: "1(xviii)", answer: "(c) arr.length" },
    { questionNumber: "1(xix)", answer: "(b) int[][] arr = new int[3][4];" },
    { questionNumber: "1(xx)", answer: "(b) int" },
    { questionNumber: "2(i)", answer: "if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u')\n  System.out.println(\"Vowel\");\nelse\n  System.out.println(\"Not a vowel\");" },
    { questionNumber: "2(ii)", answer: "a = 5, b = 4, result = 4\nStep-by-step: a++(5) + ++b(3) - a--(6) + b++(3) = 5+3-6+3 = 5" },
    { questionNumber: "2(iii)", answer: "Error: 'else' without 'if' — the two print statements after if need braces.\nCorrected:\nif (marks >= 75) {\n  System.out.println(\"PASS\");\n  System.out.println(\"Congratulations!\");\n} else {\n  System.out.println(\"FAIL\");\n}" },
    { questionNumber: "2(iv)", answer: "Math.sqrt(a*a + b*b) / (a + b)" },
    { questionNumber: "2(v)", answer: "Loop executes 3 times. Output: 5 7 9" },
    { questionNumber: "2(vi)", answer: "G\n-3" },
    { questionNumber: "2(vii)", answer: "Output: ☼ (or a special character)\nch='D' → 68; n = 68-65+5 = 8; (char)8 is a non-printable character" },
    { questionNumber: "2(viii)", answer: "No error; the code is correct. It parses \"100\" to int, calculates square root (10.0), and prints it." },
    { questionNumber: "2(ix)", answer: "(a) Default constructor and Parameterized constructor\n(b) Two constructors are defined" },
    { questionNumber: "2(x)", answer: "(a) X[2][1] = 8\n(b) X[0][2] + X[1][1] = 3 + 5 = 8" },
    { questionNumber: "3", answer: "ElectricityBill class with inputData(), calculate() using tariff slabs, and display() methods. Full Java program with Scanner input, conditional bill calculation, and formatted output." },
    { questionNumber: "4", answer: "ArraySearch class with accept(), bubbleSort(), binarySearch(int key), and display() methods. Full Java program implementing Bubble Sort and Binary Search algorithms." },
    { questionNumber: "5", answer: "StringManipulation class with accept(), convertCase(), countVowels(), and display() methods. Uses Character.isUpperCase/isLowerCase for case conversion and vowel counting." },
    { questionNumber: "6", answer: "MatrixSum class with accept(), sumOfRows(), rowWiseSum(), and display() methods. Uses nested loops for 3×3 matrix operations." },
    { questionNumber: "7", answer: "NumberCheck class with isPrime(), isPalindrome(), sumOfDigits(), and display() methods. Checks divisibility for prime, reverses number for palindrome, extracts digits for sum." },
    { questionNumber: "8", answer: "Overload class with three overloaded series() methods:\n(i) Power series sum using Math.pow()\n(ii) Number pattern using nested loops\n(iii) Cumulative sum series" }
  ]
};

// ==========================================
// PAPER 2 — MOCK SPECIMEN PAPER 02 (2026)
// ==========================================

export const computerPaper2: TYQPaper = {
  subject: "Computer Applications",
  subjectId: "computer-applications",
  paperNumber: 2,
  year: "2026",
  totalMarks: 100,
  sections: [
    {
      name: "Section A (40 Marks)",
      instructions: "Attempt all questions from this Section.",
      questions: [
        {
          number: "1",
          text: "Choose the correct answers to the questions from the given options.",
          marks: 20,
          subQuestions: [
            { number: "(i)", text: "Which of the following is not a primitive data type in Java?", options: ["int", "char", "String", "boolean"], marks: 1 },
            { number: "(ii)", text: "Which of the following is a relational operator?", options: ["&&", "||", ">=", "!"], marks: 1 },
            { number: "(iii)", text: "What will be the output of the expression: 15 % 4?", options: ["3", "4", "3.75", "0"], marks: 1 },
            { number: "(iv)", text: "Which of the following is used to read character input from the user?", options: ["next()", "nextLine()", "nextChar()", "charAt(0) after next()"], marks: 1 },
            { number: "(v)", text: "Which of the following is the correct syntax for a for loop in Java?", options: ["for (i = 0, i < 10, i++)", "for (int i = 0; i < 10; i++)", "for (int i = 0, i < 10, i++)", "for int i = 0; i < 10; i++"], marks: 1 },
            { number: "(vi)", text: "In Java, the keyword 'this' refers to:", options: ["The current method", "The parent class", "The current object", "The main method"], marks: 1 },
            { number: "(vii)", text: "Which of the following types of errors is detected at runtime?", options: ["Syntax error", "Logical error", "Exception", "Compilation error"], marks: 1 },
            { number: "(viii)", text: "The statement used to skip the current iteration and move to the next iteration of a loop is:", options: ["break", "continue", "skip", "next"], marks: 1 },
            { number: "(ix)", text: "Consider the array: int num[] = new int[10]; What is the index of the first element?", options: ["1", "0", "-1", "10"], marks: 1 },
            { number: "(x)", text: "Which loop is best suited when the number of iterations is known in advance?", options: ["for loop", "while loop", "do-while loop", "All loops"], marks: 1 },
            { number: "(xi)", text: "A double dimensional array is declared as int M[3][4]; How many elements does it have?", options: ["7", "12", "3", "4"], marks: 1 },
            { number: "(xii)", text: "Which method prototype correctly defines a method that accepts a String and returns its length?", options: ["void length(String s)", "int length(String s)", "String length(String s)", "length(String s)"], marks: 1 },
            { number: "(xiii)", text: "The statement that skips the current iteration and moves to the next iteration of a loop is:", options: ["break", "continue", "skip", "next"], marks: 1 },
            { number: "(xiv)", text: "What is the default value of an instance variable of type int in Java?", options: ["0", "null", "undefined", "1"], marks: 1 },
            { number: "(xv)", text: "Which method checks if a character is a digit?", options: ["Character.isDigit()", "Character.digit()", "isDigit()", "char.isDigit()"], marks: 1 },
            { number: "(xvi)", text: "Assertion (A): The Math class is automatically available in all Java programs.\nReason (R): The Math class belongs to the java.lang package.", options: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is not the correct explanation of A", "A is true, but R is false", "A is false, but R is true"], marks: 1 },
            { number: "(xvii)", text: "What will be the output of: System.out.println(10 + 20 + \"Java\")?", options: ["30Java", "Java30", "1020Java", "Compilation Error"], marks: 1 },
            { number: "(xviii)", text: "To find the number of characters in a String s, we use:", options: ["s.length", "s.length()", "length(s)", "s.size()"], marks: 1 },
            { number: "(xix)", text: "Which of the following correctly declares and initializes a 2D array with 2 rows and 3 columns?", options: ["int arr = new int[2][3];", "int arr[][] = new int[2][3];", "int[][] arr = new int[2,3];", "int arr[2][3] = new int;"], marks: 1 },
            { number: "(xx)", text: "What is the return type of the equalsIgnoreCase() method in the String class?", options: ["int", "boolean", "char", "String"], marks: 1 }
          ]
        },
        {
          number: "2",
          text: "Answer the following questions:",
          marks: 20,
          subQuestions: [
            { number: "(i)", text: "Rewrite the following code using a ternary operator:\nif (num % 2 == 0) result = \"Even\"; else result = \"Odd\";", marks: 2 },
            { number: "(ii)", text: "Evaluate the expression when x = 3 and y = 4:\nint z = ++x * y-- - x++ + --y;\nSystem.out.println(\"x = \" + x);\nSystem.out.println(\"y = \" + y);\nSystem.out.println(\"z = \" + z);", marks: 2 },
            { number: "(iii)", text: "Identify the error in the following code and correct it:\nfor (int i = 1; i <= 5; i++); { System.out.println(i); }", marks: 2 },
            { number: "(iv)", text: "Write the Java expression for:\n(a³ + b³) / (a - b)", marks: 2 },
            { number: "(v)", text: "How many times will the following loop execute? What is the output?\nfor (int i = 1; i <= 3; i++) { for (int j = 1; j <= i; j++) { System.out.print(\"*\"); } System.out.println(); }", marks: 2 },
            { number: "(vi)", text: "Write the output of the following String methods:\nString s1 = \"Hello\"; String s2 = \"World\";\nSystem.out.println(s1.concat(s2));\nSystem.out.println(s2.indexOf('r'));", marks: 2 },
            { number: "(vii)", text: "Predict the output:\nint a = 10; int b = 20;\nSystem.out.println(\"Sum = \" + a + b);\nSystem.out.println(\"Sum = \" + (a + b));", marks: 2 },
            { number: "(viii)", text: "The following code has an error. Identify the type of error and correct it:\nScanner sc = new Scanner(System.in);\nSystem.out.println(\"Enter your age: \");\nint age = sc.nextInt();\nif (age >= 18) System.out.println(\"You are eligible to vote.\")\nelse System.out.println(\"You are not eligible to vote.\");", marks: 2 },
            { number: "(ix)", text: "Consider the following class and answer the questions:\nclass Rectangle {\n  int length, breadth;\n  Rectangle() { length = 0; breadth = 0; }\n  Rectangle(int l, int b) { length = l; breadth = b; }\n  int area() { return length * breadth; }\n}\n(a) Name the types of constructors used.\n(b) What is the return type of the area() method?", marks: 2 },
            { number: "(x)", text: "Given the 2D array: int A[][] = {{2,4,6}, {8,10,12}, {14,16,18}};\n(a) What is the value of A[1][2]?\n(b) What is the result of A[0][0] + A[2][2]?", marks: 2 }
          ]
        }
      ]
    },
    {
      name: "Section B (60 Marks)",
      instructions: "Answer any four questions from this Section.",
      questions: [
        {
          number: "3",
          text: "Define a class named StudentMarks with the following specifications:\nMember variables: String name, int roll, int[] marks (5 subjects)\nMember methods:\n• void accept() - Accept name, roll, and marks\n• double calculateAverage() - Calculate and return average\n• char getGrade() - Assign grade: ≥90→A, ≥75→B, ≥60→C, ≥40→D, <40→F\n• void display() - Display all details\nWrite the main() method.",
          marks: 15
        },
        {
          number: "4",
          text: "Define a class named ArrayOperations with the following specifications:\nMember variables: int[] arr (8 integers)\nMember methods:\n• void accept() - Accept 8 integers\n• void selectionSort() - Sort using Selection Sort\n• int linearSearch(int key) - Linear Search, return index or -1\n• void display() - Display sorted array\nWrite the main() method.",
          marks: 15
        },
        {
          number: "5",
          text: "Define a class named WordProcessor with the following specifications:\nMember variables: String sentence\nMember methods:\n• void accept() - Accept a sentence\n• int countWords() - Count and return words\n• String extractVowels() - Extract all vowels\n• void display() - Display sentence, word count, and vowels\nWrite the main() method.",
          marks: 15
        },
        {
          number: "6",
          text: "Define a class named DiagonalSum with the following specifications:\nMember variables: int[][] mat (4×4 matrix)\nMember methods:\n• void accept() - Accept 16 integers\n• int leftDiagonal() - Sum of left diagonal\n• int rightDiagonal() - Sum of right diagonal\n• void display() - Display matrix and both sums\nWrite the main() method.",
          marks: 15
        },
        {
          number: "7",
          text: "Define a class named SpecialNumber with the following specifications:\nMember methods:\n• boolean isArmstrong(int n) - Check Armstrong number\n• boolean isPerfect(int n) - Check Perfect number\n• int factorial(int n) - Calculate factorial\n• void display(int n) - Display results\nWrite the main() method.",
          marks: 15
        },
        {
          number: "8",
          text: "Define a class named OverloadCalc to overload the method compute() as follows:\n(i) void compute(int a, int b) - Display sum of squares: a² + b²\n(ii) void compute(double r) - Display area of circle: πr² (use π = 3.14)\n(iii) void compute(int n) - Display factorial of n\nWrite the main() method.",
          marks: 15
        }
      ]
    }
  ]
};

export const computerPaper2Answers: TYQAnswerKey = {
  subject: "Computer Applications",
  subjectId: "computer-applications",
  paperNumber: 2,
  answers: [
    { questionNumber: "1(i)", answer: "(c) String" },
    { questionNumber: "1(ii)", answer: "(c) >=" },
    { questionNumber: "1(iii)", answer: "(a) 3" },
    { questionNumber: "1(iv)", answer: "(d) charAt(0) after next()" },
    { questionNumber: "1(v)", answer: "(b) for (int i = 0; i < 10; i++)" },
    { questionNumber: "1(vi)", answer: "(c) The current object" },
    { questionNumber: "1(vii)", answer: "(c) Exception" },
    { questionNumber: "1(viii)", answer: "(b) continue" },
    { questionNumber: "1(ix)", answer: "(b) 0" },
    { questionNumber: "1(x)", answer: "(a) for loop" },
    { questionNumber: "1(xi)", answer: "(b) 12" },
    { questionNumber: "1(xii)", answer: "(b) int length(String s)" },
    { questionNumber: "1(xiii)", answer: "(b) continue" },
    { questionNumber: "1(xiv)", answer: "(a) 0" },
    { questionNumber: "1(xv)", answer: "(a) Character.isDigit()" },
    { questionNumber: "1(xvi)", answer: "(a) Both A and R are true, and R is the correct explanation of A" },
    { questionNumber: "1(xvii)", answer: "(a) 30Java" },
    { questionNumber: "1(xviii)", answer: "(b) s.length()" },
    { questionNumber: "1(xix)", answer: "(b) int arr[][] = new int[2][3];" },
    { questionNumber: "1(xx)", answer: "(b) boolean" },
    { questionNumber: "2(i)", answer: "result = (num % 2 == 0) ? \"Even\" : \"Odd\";" },
    { questionNumber: "2(ii)", answer: "x = 5, y = 2, z = 13\n++x(4) * y--(4) - x++(4) + --y(2) = 16 - 4 + 2 = 14" },
    { questionNumber: "2(iii)", answer: "Syntax error: semicolon after for loop header causes empty loop body.\nCorrected: Remove the semicolon: for (int i = 1; i <= 5; i++) { System.out.println(i); }" },
    { questionNumber: "2(iv)", answer: "(Math.pow(a, 3) + Math.pow(b, 3)) / (a - b)\nor: (a*a*a + b*b*b) / (a - b)" },
    { questionNumber: "2(v)", answer: "Output:\n*\n**\n***\nOuter loop runs 3 times, inner loop runs i times each iteration." },
    { questionNumber: "2(vi)", answer: "HelloWorld\n2" },
    { questionNumber: "2(vii)", answer: "Sum = 1020\nSum = 30" },
    { questionNumber: "2(viii)", answer: "Syntax error: Missing semicolon after the first println in the if block.\nCorrected: Add semicolon after System.out.println(\"You are eligible to vote.\");" },
    { questionNumber: "2(ix)", answer: "(a) Default constructor and Parameterized constructor\n(b) int" },
    { questionNumber: "2(x)", answer: "(a) A[1][2] = 12\n(b) A[0][0] + A[2][2] = 2 + 18 = 20" },
    { questionNumber: "3", answer: "StudentMarks class with accept(), calculateAverage(), getGrade(), and display() methods. Uses array to store 5 marks, calculates average, and assigns grade based on ranges." },
    { questionNumber: "4", answer: "ArrayOperations class with accept(), selectionSort(), linearSearch(), and display() methods. Implements Selection Sort and Linear Search algorithms." },
    { questionNumber: "5", answer: "WordProcessor class with accept(), countWords() using split(), extractVowels(), and display() methods." },
    { questionNumber: "6", answer: "DiagonalSum class with accept(), leftDiagonal() (mat[i][i]), rightDiagonal() (mat[i][3-i]), and display() methods for 4×4 matrix." },
    { questionNumber: "7", answer: "SpecialNumber class with isArmstrong() (sum of cubes = number), isPerfect() (sum of proper divisors = number), factorial(), and display() methods." },
    { questionNumber: "8", answer: "OverloadCalc class with three overloaded compute() methods:\n(i) Sum of squares: a*a + b*b\n(ii) Area of circle: 3.14 * r * r\n(iii) Factorial using loop" }
  ]
};
