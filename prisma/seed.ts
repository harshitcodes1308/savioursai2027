import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    await prisma.chapter.deleteMany();
    await prisma.subject.deleteMany();

    // Create Mathematics subject with all chapters
    const math = await prisma.subject.create({
        data: {
            name: "Mathematics",
            code: "MATH",
            description: "ICSE Mathematics - Algebra, Geometry, Trigonometry, Statistics",
            icon: "📐",
            order: 1,
            chapters: {
                create: [
                    { name: "Goods and Services Tax (GST)", order: 1 },
                    { name: "Banking", order: 2 },
                    { name: "Shares and Dividends", order: 3 },
                    { name: "Linear Inequations", order: 4 },
                    { name: "Quadratic Equations", order: 5 },
                    { name: "Ratio and Proportion", order: 6 },
                    { name: "Matrices", order: 7 },
                    { name: "Arithmetic Progression (AP)", order: 8 },
                    { name: "Geometry – Similarity", order: 9 },
                    { name: "Geometry – Circles", order: 10 },
                    { name: "Geometry – Constructions", order: 11 },
                    { name: "Coordinate Geometry", order: 12 },
                    { name: "Trigonometry", order: 13 },
                    { name: "Mensuration", order: 14 },
                    { name: "Statistics", order: 15 },
                    { name: "Probability", order: 16 },
                ],
            },
        },
    });

    // Create Physics subject with all chapters
    const physics = await prisma.subject.create({
        data: {
            name: "Physics",
            code: "PHYS",
            description: "ICSE Physics - Mechanics, Heat, Light, Electricity, Magnetism",
            icon: "⚛️",
            order: 2,
            chapters: {
                create: [
                    { name: "Force", order: 1 },
                    { name: "Work, Energy and Power", order: 2 },
                    { name: "Machines", order: 3 },
                    { name: "Refraction of Light", order: 4 },
                    { name: "Spectrum", order: 5 },
                    { name: "Sound", order: 6 },
                    { name: "Current Electricity", order: 7 },
                    { name: "Magnetism", order: 8 },
                    { name: "Electromagnetic Induction", order: 9 },
                    { name: "Calorimetry", order: 10 },
                    { name: "Radioactivity", order: 11 },
                ],
            },
        },
    });

    // Create Chemistry subject with all chapters
    const chemistry = await prisma.subject.create({
        data: {
            name: "Chemistry",
            code: "CHEM",
            description: "ICSE Chemistry - Physical, Inorganic, and Organic Chemistry",
            icon: "🧪",
            order: 3,
            chapters: {
                create: [
                    { name: "Periodic Table", order: 1 },
                    { name: "Chemical Bonding", order: 2 },
                    { name: "Study of Acids, Bases and Salts", order: 3 },
                    { name: "Analytical Chemistry", order: 4 },
                    { name: "Mole Concept and Stoichiometry", order: 5 },
                    { name: "Electrolysis", order: 6 },
                    { name: "Metallurgy", order: 7 },
                    { name: "Study of Compounds (HCl, NH₃, HNO₃, H₂SO₄)", order: 8 },
                    { name: "Organic Chemistry (Alkanes, Alkenes, Alkynes, Alcohols, Acids)", order: 9 },
                ],
            },
        },
    });

    // Create Biology subject with all chapters
    const biology = await prisma.subject.create({
        data: {
            name: "Biology",
            code: "BIO",
            description: "ICSE Biology - Botany, Zoology, Human Anatomy, Ecology",
            icon: "🧬",
            order: 4,
            chapters: {
                create: [
                    { name: "Cell Cycle and Cell Division", order: 1 },
                    { name: "Genetics", order: 2 },
                    { name: "Absorption by Roots", order: 3 },
                    { name: "Transpiration", order: 4 },
                    { name: "Photosynthesis", order: 5 },
                    { name: "Circulatory System", order: 6 },
                    { name: "Excretory System", order: 7 },
                    { name: "Nervous System", order: 8 },
                    { name: "Endocrine System", order: 9 },
                    { name: "Reproductive System", order: 10 },
                    { name: "Population", order: 11 },
                    { name: "Human Evolution", order: 12 },
                    { name: "Pollution", order: 13 },
                ],
            },
        },
    });

    // Create History & Civics subject with all chapters
    const history = await prisma.subject.create({
        data: {
            name: "History & Civics",
            code: "HIST",
            description: "ICSE History - Indian History, World History, Civics",
            icon: "🏛️",
            order: 5,
            chapters: {
                create: [
                    { name: "The Union Legislature", order: 1 },
                    { name: "The Union Executive", order: 2 },
                    { name: "The Judiciary", order: 3 },
                    { name: "The First War of Independence (1857)", order: 4 },
                    { name: "Growth of Nationalism", order: 5 },
                    { name: "Mahatma Gandhi and the National Movement", order: 6 },
                    { name: "Forward Bloc and INA", order: 7 },
                    { name: "Independence and Partition of India", order: 8 },
                ],
            },
        },
    });

    // Create Geography subject with all chapters
    const geography = await prisma.subject.create({
        data: {
            name: "Geography",
            code: "GEO",
            description: "ICSE Geography - Physical, Economic, and Resource Geography",
            icon: "🌍",
            order: 6,
            chapters: {
                create: [
                    { name: "Climate of India", order: 1 },
                    { name: "Soil Resources", order: 2 },
                    { name: "Water Resources", order: 3 },
                    { name: "Natural Vegetation", order: 4 },
                    { name: "Mineral Resources", order: 5 },
                    { name: "Energy Resources", order: 6 },
                    { name: "Agriculture", order: 7 },
                    { name: "Manufacturing Industries", order: 8 },
                    { name: "Transport", order: 9 },
                    { name: "Waste Management", order: 10 },
                ],
            },
        },
    });

    // Create Computer Applications subject with all chapters
    const computer = await prisma.subject.create({
        data: {
            name: "Computer Applications",
            code: "COMP",
            description: "ICSE Computer Applications - Java Programming",
            icon: "💻",
            order: 7,
            chapters: {
                create: [
                    { name: "Objects and Classes", order: 1 },
                    { name: "Data Types and Variables", order: 2 },
                    { name: "Operators in Java", order: 3 },
                    { name: "Conditional Statements", order: 4 },
                    { name: "Looping Statements", order: 5 },
                    { name: "Nested Loops", order: 6 },
                    { name: "Arrays (1D and 2D)", order: 7 },
                    { name: "Strings", order: 8 },
                    { name: "Functions / Methods", order: 9 },
                    { name: "Library Classes", order: 10 },
                    { name: "Computing Ethics", order: 11 },
                ],
            },
        },
    });

    // Create English subject with all chapters
    const english = await prisma.subject.create({
        data: {
            name: "English Language & Literature",
            code: "ENG",
            description: "ICSE English - Grammar, Composition, Literature",
            icon: "📚",
            order: 8,
            chapters: {
                create: [
                    { name: "Composition (Letter, Notice, Email Writing)", order: 1 },
                    { name: "Comprehension Passage", order: 2 },
                    { name: "Grammar and Usage", order: 3 },
                    { name: "Drama: Julius Caesar", order: 4 },
                    { name: "Prose: With the Photographer", order: 5 },
                    { name: "Prose: The Elevator", order: 6 },
                    { name: "Prose: The Girl Who Can", order: 7 },
                    { name: "Prose: The Pedestrian", order: 8 },
                    { name: "Prose: The Last Lesson", order: 9 },
                    { name: "Poetry: Haunted Houses", order: 10 },
                    { name: "Poetry: The Glove and the Lions", order: 11 },
                    { name: "Poetry: When Great Trees Fall", order: 12 },
                    { name: "Poetry: A Considerable Speck", order: 13 },
                    { name: "Poetry: The Power of Music", order: 14 },
                ],
            },
        },
    });

    console.log("✅ Database seeded successfully!");
    console.log(`Created ${await prisma.subject.count()} subjects`);
    console.log(`Created ${await prisma.chapter.count()} chapters`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
