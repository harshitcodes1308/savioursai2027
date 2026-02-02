const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRecentSignup() {
    try {
        // Get the most recent user
        const recentUser = await prisma.user.findFirst({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                createdAt: true,
            }
        });
        
        console.log('🔍 Most Recent User:', recentUser);
        
        if (!recentUser) {
            console.log('❌ No users found!');
            return;
        }
        
        if (!recentUser.phone) {
            console.log('\n⚠️ ISSUE: Phone is NULL for new signup!');
            console.log('This means the phone number was not sent from frontend.');
        } else {
            console.log('\n✅ Phone stored successfully:', recentUser.phone);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkRecentSignup();
