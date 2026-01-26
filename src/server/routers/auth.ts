import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/trpc";
import {
    authenticate,
    createUser,
    createToken,
    setSessionCookie,
    clearSessionCookie,
} from "@/lib/auth";
import { ConflictError, ValidationError, AuthenticationError } from "@/lib/errors";

export const authRouter = createTRPCRouter({
    /**
     * Sign up new user
     */
    signup: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(8),
                name: z.string().min(2),
                role: z.enum(["STUDENT", "TEACHER"]).optional().default("STUDENT"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Check if user already exists
            const existingUser = await ctx.prisma.user.findUnique({
                where: { email: input.email.toLowerCase() },
            });

            if (existingUser) {
                throw new ConflictError("User with this email already exists");
            }

            // Create user
            const user = await createUser(
                input.email,
                input.password,
                input.name,
                input.role
            );

            // Create student profile if role is STUDENT
            if (input.role === "STUDENT") {
                await ctx.prisma.studentProfile.create({
                    data: {
                        userId: user.id,
                        grade: 10, // Default to Class 10
                    },
                });
            }

            // Create teacher profile if role is TEACHER
            if (input.role === "TEACHER") {
                await ctx.prisma.teacherProfile.create({
                    data: {
                        userId: user.id,
                        subjects: [],
                    },
                });
            }

            // Create session token
            const token = await createToken(user);
            await setSessionCookie(token);

            // Return only serializable data
            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
        }),

    /**
     * Login user
     */
    login: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                // RULE: Password must start with uppercase 'W'
                // This is a strict server-side validation gate.
                if (!input.password.startsWith('W')) {
                    // Generic error message to not reveal the rule
                    throw new AuthenticationError("Invalid password. Please retry or check the credentials sent to your email.");
                }

                const user = await authenticate(input.email, input.password);

                if (!user) {
                    throw new AuthenticationError("Invalid email or password");
                }

                // Create session token
                const token = await createToken(user);
                await setSessionCookie(token);

                // Return only serializable data
                return {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                };
            } catch (error) {
                console.error("Login error:", error);
                throw error;
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
