import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { type UserRole } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isPaid: boolean;
    lnbChemistryUnlocked?: boolean;
}

export interface Session {
    user: SessionUser;
    expires: string;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return await hash(password, 12);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return await compare(password, hashedPassword);
}

/**
 * Create JWT token
 */
export async function createToken(user: SessionUser): Promise<string> {
    const token = await new SignJWT({ user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

    return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<Session | null> {
    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return verified.payload as unknown as Session;
    } catch {
        return null;
    }
}

/**
 * Get current session from cookies
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    return await verifyToken(token);
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
    const session = await getSession();
    return session?.user || null;
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string, rememberMe: boolean = false, resHeaders?: Headers) {
    const maxAge = rememberMe
        ? 60 * 60 * 24 * 30 // 30 days
        : 60 * 60 * 24 * 1; // 1 day

    if (resHeaders) {
        const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
        resHeaders.append(
            "Set-Cookie",
            `auth-token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
        );
    } else {
        const cookieStore = await cookies();
        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge,
            path: "/",
        });
    }
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(resHeaders?: Headers) {
    if (resHeaders) {
        const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
        resHeaders.append(
            "Set-Cookie",
            `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`
        );
    } else {
        const cookieStore = await cookies();
        cookieStore.delete("auth-token");
    }
}

/**
 * Authenticate user with email and password
 */
export async function authenticate(
    email: string,
    password: string
): Promise<SessionUser | null> {
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });

    if (!user) return null;

    // Google users cannot login with email/password
    if (!user.password) return null;

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return null;

    // GRANDFATHERING LOGIC
    const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");
    const isLegacyUser = user.createdAt < CUTOFF_DATE;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPaid: user.isPaid || isLegacyUser,
    };
}

/**
 * Create new user
 */
export async function createUser(
    email: string,
    password: string,
    name: string,
    role: UserRole = "STUDENT",
    phone?: string // Optional phone number
): Promise<SessionUser> {
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            phone: phone || null, // Save phone if provided, null otherwise
            role,
            isPaid: false, // Default to unpaid
        },
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPaid: user.isPaid, // Newly created users are always false (Unpaid)
    };
}
