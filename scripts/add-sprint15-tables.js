const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function add15DaySprintTables() {
    try {
        console.log('🔧 Adding 15-Day Sprint tables to database...');
        
        // Step 1: Create Sprint15Status enum
        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Sprint15Status') THEN
                    CREATE TYPE "Sprint15Status" AS ENUM ('DIAGNOSTIC_PENDING', 'ACTIVE', 'COMPLETED', 'ABANDONED');
                END IF;
            END$$;
        `);
        console.log('✅ Created Sprint15Status enum');
        
        // Step 2: Create sprint_15_day table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "sprint_15_day" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "subjects" TEXT[],
                "dailyStudyHours" INTEGER NOT NULL,
                "examDate" TIMESTAMP(3) NOT NULL,
                "diagnosticTest" JSONB NOT NULL,
                "chapterAnalysis" JSONB NOT NULL,
                "predictedScoreRange" TEXT NOT NULL,
                "dailyPlans" JSONB NOT NULL,
                "currentDay" INTEGER NOT NULL DEFAULT 0,
                "diagnosticCompleted" BOOLEAN NOT NULL DEFAULT false,
                "status" "Sprint15Status" NOT NULL DEFAULT 'DIAGNOSTIC_PENDING',
                "parentReport" JSONB,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "sprint_15_day_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✅ Created sprint_15_day table');
        
        // Step 3: Add foreign key
        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'sprint_15_day_userId_fkey'
                ) THEN
                    ALTER TABLE "sprint_15_day" ADD CONSTRAINT "sprint_15_day_userId_fkey" 
                    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
                END IF;
            END$$;
        `);
        console.log('✅ Added foreign key constraint');
        
        // Step 4: Add indexes
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "sprint_15_day_userId_idx" ON "sprint_15_day"("userId");
        `);
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "sprint_15_day_status_idx" ON "sprint_15_day"("status");
        `);
        console.log('✅ Added indexes');
        
        // Step 5: Create sprint_15_test_submissions table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "sprint_15_test_submissions" (
                "id" TEXT NOT NULL,
                "sprintId" TEXT NOT NULL,
                "dayNumber" INTEGER NOT NULL,
                "questionsAsked" JSONB NOT NULL,
                "studentAnswers" JSONB NOT NULL,
                "score" DOUBLE PRECISION NOT NULL,
                "timeSpentMinutes" INTEGER NOT NULL,
                "topicScores" JSONB NOT NULL,
                "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT "sprint_15_test_submissions_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✅ Created sprint_15_test_submissions table');
        
        // Step 6: Add foreign key for test submissions
        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'sprint_15_test_submissions_sprintId_fkey'
                ) THEN
                    ALTER TABLE "sprint_15_test_submissions" ADD CONSTRAINT "sprint_15_test_submissions_sprintId_fkey" 
                    FOREIGN KEY ("sprintId") REFERENCES "sprint_15_day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
                END IF;
            END$$;
        `);
        console.log('✅ Added test submissions foreign key');
        
        // Step 7: Add index for test submissions
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "sprint_15_test_submissions_sprintId_dayNumber_idx" 
            ON "sprint_15_test_submissions"("sprintId", "dayNumber");
        `);
        console.log('✅ Added test submissions index');
        
        // Verify tables exist
        const result = await prisma.$queryRaw`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('sprint_15_day', 'sprint_15_test_submissions');
        `;
        console.log('\n📊 Migration Summary:');
        console.log('   Tables created:', result);
        
        console.log('\n🎉 Migration completed successfully! No data was deleted.');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

add15DaySprintTables();
