import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ICSE_SUBJECTS = [
    { name: 'Mathematics', code: 'MATH', order: 1 },
    { name: 'Physics', code: 'PHY', order: 2 },
    { name: 'Chemistry', code: 'CHEM', order: 3 },
    { name: 'Biology', code: 'BIO', order: 4 },
    { name: 'History & Civics', code: 'HIST', order: 5 },
    { name: 'Geography', code: 'GEO', order: 6 },
    { name: 'English Language', code: 'ENG1', order: 7 },
    { name: 'English Literature', code: 'ENG2', order: 8 },
    { name: 'Computer Applications', code: 'COMP', order: 9 },
];

async function main() {
    console.log('🌱 Seeding subjects...');

    for (const subject of ICSE_SUBJECTS) {
        await prisma.subject.upsert({
            where: { code: subject.code },
            update: subject,
            create: subject,
        });
    }

    console.log('✅ Subjects seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
