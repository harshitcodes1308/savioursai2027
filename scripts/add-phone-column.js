const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addPhoneColumn() {
    try {
        console.log('🔧 Adding phone column to users table...');
        
        // Step 1: Add phone column (safe - nullable)
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phone" TEXT;
        `);
        console.log('✅ Phone column added successfully');
        
        // Step 2: Add unique constraint
        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'users_phone_key'
                ) THEN
                    ALTER TABLE "users" ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");
                END IF;
            END $$;
        `);
        console.log('✅ Unique constraint added successfully');
        
        // Step 3: Verify
        const result = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'phone';
        `;
        console.log('✅ Verification:', result);
        
        // Step 4: Count users
        const totalUsers = await prisma.user.count();
        const usersWithPhone = await prisma.user.count({
            where: { phone: { not: null } }
        });
        
        console.log(`\n📊 Migration Summary:`);
        console.log(`   Total users: ${totalUsers}`);
        console.log(`   Users with phone: ${usersWithPhone}`);
        console.log(`   Users with NULL phone: ${totalUsers - usersWithPhone}`);
        console.log('\n🎉 Migration completed successfully! No data was deleted.');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

addPhoneColumn();
