import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        // This safely adds the missing authProvider column to the users table
        // without dropping any existing columns or data.
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "authProvider" TEXT NOT NULL DEFAULT 'credentials';
        `);
        
        return NextResponse.json({ 
            success: true, 
            message: "Database schema synchronized successfully! You can now log into the application." 
        });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: String(error) 
        }, { status: 500 });
    }
}
