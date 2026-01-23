/**
 * Simple script to register manually uploaded PDFs
 * 
 * Usage:
 * 1. Copy your PDFs to public/uploads/{subject}/
 * 2. Run: npx tsx scripts/register-pdfs.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function registerPDFs() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Get all subject folders
    const subjectFolders = fs.readdirSync(uploadsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    console.log('📁 Found subject folders:', subjectFolders);

    for (const folderName of subjectFolders) {
        // Find subject in database by name
        const subject = await prisma.subject.findFirst({
            where: {
                name: {
                    contains: folderName,
                    mode: 'insensitive'
                }
            }
        });

        if (!subject) {
            console.log(`⚠️  No subject found matching "${folderName}", skipping...`);
            continue;
        }

        console.log(`\n📚 Processing ${subject.name}...`);

        const folderPath = path.join(uploadsDir, folderName);
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            if (!file.endsWith('.pdf')) continue;

            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);

            // Check if already registered
            const existing = await prisma.subjectFile.findFirst({
                where: {
                    subjectId: subject.id,
                    fileName: file
                }
            });

            if (existing) {
                console.log(`  ⏭️  ${file} - already registered`);
                continue;
            }

            // Create title from filename
            const title = file
                .replace('.pdf', '')
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Register in database
            await prisma.subjectFile.create({
                data: {
                    subjectId: subject.id,
                    title,
                    fileName: file,
                    filePath: `/uploads/${folderName}/${file}`,
                    fileSize: stats.size,
                },
            });

            console.log(`  ✅ ${file} - registered as "${title}"`);
        }
    }

    console.log('\n🎉 Done! All PDFs registered.');
    await prisma.$disconnect();
}

registerPDFs().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
