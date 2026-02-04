const { PrismaClient } = require('@prisma/client');

const productionUrl = "postgresql://neondb_owner:npg_YIoJxb7q6ZXG@ep-fragrant-rice-ah61nzi8.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const previewUrl = "postgresql://neondb_owner:npg_LKWsc4X9VepB@ep-aged-bird-ah8f1emc-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const prodDb = new PrismaClient({ datasources: { db: { url: productionUrl } } });
const prevDb = new PrismaClient({ datasources: { db: { url: previewUrl } } });

async function syncUsers() {
  try {
    console.log('🔄 Fetching users from PRODUCTION...');
    const prodUsers = await prodDb.user.findMany(); // Get all fields

    console.log(`✓ Found ${prodUsers.length} users in production`);

    for (const user of prodUsers) {
      console.log(`  → Syncing ${user.email}...`);
      
      await prevDb.user.upsert({
        where: { id: user.id },
        create: user,
        update: user
      });
    }

    console.log(`\n✅ Successfully synced ${prodUsers.length} users to PREVIEW!`);
    console.log('   You can now create sprints in preview database.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prodDb.$disconnect();
    await prevDb.$disconnect();
  }
}

syncUsers();
