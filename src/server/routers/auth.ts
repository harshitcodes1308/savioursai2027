import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/trpc";
import {
    authenticate,
    createUser,
    createToken,
    setSessionCookie,
    clearSessionCookie,
} from "@/lib/auth";
import { TRPCError } from "@trpc/server";
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/api-rate-limit";

export const authRouter = createTRPCRouter({
    /**
     * Sign up new user - (Kept for optional separate flow, but Login handles auto-creation now)
     */
    signup: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(8),
                name: z.string().min(2),
                phone: z.string().optional(), // Optional phone number
                role: z.enum(["STUDENT", "TEACHER"]).optional().default("STUDENT"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Rate limit signup attempts
            const rateLimitKey = `signup:${input.email.toLowerCase()}`;
            const rateCheck = checkRateLimit(rateLimitKey, AUTH_RATE_LIMIT);
            if (!rateCheck.allowed) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: `Too many attempts. Please try again in ${rateCheck.retryAfterSeconds}s.`
                });
            }

            try {
                // Check for existing phone number first
                if (input.phone) {
                    const existingPhone = await ctx.prisma.user.findUnique({
                        where: { phone: input.phone },
                    });
                    
                    if (existingPhone) {
                        throw new TRPCError({
                            code: "CONFLICT",
                            message: "This phone number already exists. Please use a different number."
                        });
                    }
                }
                
                const existingUser = await ctx.prisma.user.findUnique({
                    where: { email: input.email.toLowerCase() },
                });

                if (existingUser) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "User with this email already exists"
                    });
                }

                const user = await createUser(
                    input.email,
                    input.password,
                    input.name,
                    input.role,
                    input.phone // Pass phone to createUser
                );

                if (input.role === "STUDENT") {
                    await ctx.prisma.studentProfile.create({
                        data: { userId: user.id, grade: 10 },
                    });
                }

                if (input.role === "TEACHER") {
                    await ctx.prisma.teacherProfile.create({
                        data: { userId: user.id, subjects: [] },
                    });
                }

                const token = await createToken(user);
                await setSessionCookie(token);

                return {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                };
            } catch (error: any) {
                // Catch Prisma unique constraint errors
                if (error.code === 'P2002') {
                    const field = error.meta?.target?.[0];
                    if (field === 'phone') {
                        throw new TRPCError({
                            code: "CONFLICT",
                            message: "This phone number already exists. Please use a different number."
                        });
                    } else if (field === 'email') {
                        throw new TRPCError({
                            code: "CONFLICT",
                            message: "User with this email already exists"
                        });
                    }
                }
                
                // Keep TRPCErrors intact, wrap others
                if (error instanceof TRPCError) throw error;
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An expected error occurred during signup"
                });
            }
        }),

    /**
     * Login / Auto-Signup Mutation
     * 1. Validates password starts with 'W'.
     * 2. Checks if user exists.
     * 3. IF EXISTS: Logs them in (trying strict 'W' password first, then fallback without 'W').
     * 4. IF NOT EXISTS: Creates a new account with the provided credentials and logs them in.
     */
    login: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string(),
                name: z.string().optional(), // Added name for auto-signup
                rememberMe: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Rate limit login attempts
            const rateLimitKey = `login:${input.email.toLowerCase()}`;
            const rateCheck = checkRateLimit(rateLimitKey, AUTH_RATE_LIMIT);
            if (!rateCheck.allowed) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: `Too many login attempts. Please try again in ${rateCheck.retryAfterSeconds}s.`
                });
            }

            try {
                // RULE 1: Removed strict 'W' password check to allow normal login/signup
                // if (!input.password.startsWith('W')) { ... }

                // RULE 2: Check database for existing user
                const existingUser = await ctx.prisma.user.findUnique({
                    where: { email: input.email.toLowerCase() },
                });

                let authenticatedUser = null;

                if (existingUser) {
                    // --- SCENARIO A: User Exists (Login) ---
                    
                    // 1. Try strict match (e.g. user typed "Wpass", DB has "Wpass")
                    authenticatedUser = await authenticate(input.email, input.password);

                    // 2. If failed, try compatible match (e.g. user typed "Wpass", DB has "pass")
                    if (!authenticatedUser) {
                        authenticatedUser = await authenticate(input.email, input.password.substring(1));
                    }

                    if (!authenticatedUser) {
                        throw new TRPCError({
                            code: "UNAUTHORIZED",
                            message: "Invalid email or password"
                        });
                    }

                } else {
                    // --- SCENARIO B: User Does Not Exist (Auto-Signup) ---
                    
                    // We need a name for the new user. Use provided name or default.
                    const newName = input.name || input.email.split('@')[0];

                    // Create the user with the STRICT password (starts with W)
                    authenticatedUser = await createUser(
                        input.email,
                        input.password,
                        newName,
                        "STUDENT" // Default to STUDENT for auto-signup
                    );

                    // Create default Student Profile
                    await ctx.prisma.studentProfile.create({
                        data: {
                            userId: authenticatedUser.id,
                            grade: 10, // Default grade
                        },
                    });
                }

                // Final Step: Issue Session
                if (!authenticatedUser) {
                    // Should be unreachable, but for type safety
                     throw new TRPCError({
                         code: "UNAUTHORIZED",
                         message: "Authentication failed"
                     });
                }

                const token = await createToken(authenticatedUser);
                // Pass rememberMe flag to cookie setter
                await setSessionCookie(token, input.rememberMe || false);

                return {
                    success: true,
                    user: {
                        id: authenticatedUser.id,
                        email: authenticatedUser.email,
                        name: authenticatedUser.name,
                        role: authenticatedUser.role,
                    },
                };

            } catch (error) {
                console.error("Login/Auth error:", error);
                if (error instanceof TRPCError) throw error;
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to authenticate user"
                });
            }
        }),

    /**
     * Logout user
     */
    logout: protectedProcedure.mutation(async () => {
        await clearSessionCookie();
        return { success: true };
    }),

    /**
     * Get current session
     */
    getSession: publicProcedure.query(async ({ ctx }) => {
        return ctx.session;
    }),

    /**
     * Get current user profile
     */
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { id: ctx.user.id },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });

        return user;
    }),
});
