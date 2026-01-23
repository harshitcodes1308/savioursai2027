import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔐 Creating test user...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            password: hashedPassword,
            name: 'Test User',
            role: 'STUDENT',
        },
    });

    // Create student profile
    await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            grade: 10,
        },
    });

    console.log('✅ Test user created!');
    console.log('Email: test@test.com');
    console.log('Password: password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
