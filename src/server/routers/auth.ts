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
                password: z.string().min(6),
                name: z.string().min(2),
                phone: z.string().optional().default(""),
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
                await setSessionCookie(token, false, ctx.resHeaders);

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
                console.error("Signup error:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An unexpected error occurred. Please try again."
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
                    // TODO: Remove this fallback once no users hit it (check logs)
                    if (!authenticatedUser) {
                        authenticatedUser = await authenticate(input.email, input.password.substring(1));
                        if (authenticatedUser) {
                            console.warn(`[auth] DEPRECATION: substring(1) fallback used for ${input.email} — user should reset password`);
                        }
                    }

                    if (!authenticatedUser) {
                        throw new TRPCError({
                            code: "UNAUTHORIZED",
                            message: "Invalid email or password"
                        });
                    }

                } else {
                    // --- User does not exist — do not auto-create ---
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Invalid email or password",
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
                // Pass rememberMe flag and resHeaders to cookie setter
                await setSessionCookie(token, input.rememberMe || false, ctx.resHeaders);

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
                    message: "Authentication failed. Please try again."
                });
            }
        }),

    /**
     * Logout user
     */
    logout: protectedProcedure.mutation(async ({ ctx }) => {
        await clearSessionCookie(ctx.resHeaders);
        return { success: true };
    }),

    /**
     * Get current session — re-validates plan data from DB on every call.
     * If the JWT is stale (e.g. admin changed plan directly in Neon),
     * it auto-refreshes the cookie so middleware picks up the new values.
     */
    getSession: publicProcedure.query(async ({ ctx }) => {
        if (!ctx.session?.user) return ctx.session;

        // Re-read the user's current plan data from the database
        const freshUser = await ctx.prisma.user.findUnique({
            where: { id: ctx.session.user.id },
            select: {
                isPaid: true,
                planType: true,
                subscriptionStatus: true,
                subscriptionExpiry: true,
                onboardingComplete: true,
                name: true,
                role: true,
                lnbChemistryUnlocked: true,
            },
        });

        if (!freshUser) return ctx.session;

        const jwt = ctx.session.user;

        // Detect drift between the JWT snapshot and the live DB
        const hasDrift =
            jwt.isPaid !== freshUser.isPaid ||
            jwt.planType !== freshUser.planType ||
            jwt.subscriptionStatus !== freshUser.subscriptionStatus ||
            jwt.onboardingComplete !== freshUser.onboardingComplete;

        if (hasDrift) {
            // Build an updated SessionUser from the DB values
            const updatedUser = {
                ...jwt,
                isPaid: freshUser.isPaid,
                planType: freshUser.planType,
                subscriptionStatus: freshUser.subscriptionStatus,
                subscriptionExpiry: freshUser.subscriptionExpiry?.toISOString() ?? null,
                onboardingComplete: freshUser.onboardingComplete,
                name: freshUser.name,
                role: freshUser.role,
                lnbChemistryUnlocked: freshUser.lnbChemistryUnlocked,
            };

            // Mint a fresh JWT and set the cookie so middleware sees the update
            const newToken = await createToken(updatedUser);
            await setSessionCookie(newToken, false, ctx.resHeaders);

            return { user: updatedUser, expires: ctx.session.expires };
        }

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
