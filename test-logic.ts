import { appRouter } from './src/server/routers/_app';
import { prisma } from './src/lib/prisma';
import { createCallerFactory } from './src/server/trpc';
import * as dotenv from 'dotenv';
dotenv.config();

const createCaller = createCallerFactory(appRouter);

async function main() {
    console.log("Testing Login Mutation Direct Caller...");
    try {
        // Create context
        const ctx = {
            prisma,
            session: null,
            user: undefined,
            req: undefined,
        };

        const caller = createCaller(ctx);

        // Call the procedure
        const result = await caller.auth.login({
            email: 'test@example.com',
            password: 'testpassword',
            rememberMe: false
        });

        console.log("SUCCESS:", result);
    } catch (error) {
        console.error("EXPECTED ERROR CAUGHT:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
