import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { type UserRole } from "@prisma/client";
import { findDangerousInput } from "@/lib/sanitize";

/**
 * Create tRPC context
 */
export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
    const session = await getSession();

    return {
        prisma,
        session,
        user: session?.user,
        resHeaders: opts?.resHeaders,
    };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        const isProduction = process.env.NODE_ENV === "production";

        return {
            ...shape,
            message: error.message,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
                // Strip stack traces in production
                ...(isProduction ? { stack: undefined } : {}),
            },
        };
    },
});

/**
 * Input sanitization middleware — blocks SQL injection & XSS patterns
 */
const sanitizationMiddleware = t.middleware(async ({ next, getRawInput }) => {
    const rawInput = await getRawInput();
    if (rawInput !== undefined && rawInput !== null) {
        const dangerousValue = findDangerousInput(rawInput as Record<string, unknown>);
        if (dangerousValue) {
            console.error("BLOCKED: Dangerous input detected:", dangerousValue.substring(0, 100));
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid request.",
            });
        }
    }
    return next();
});

/**
 * Create router and procedure helpers
 */
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

/**
 * Public procedure (no auth required) — with input sanitization
 */
export const publicProcedure = t.procedure.use(sanitizationMiddleware);

/**
 * Protected procedure (auth required) — with input sanitization
 */
export const protectedProcedure = t.procedure
    .use(sanitizationMiddleware)
    .use(({ ctx, next }) => {
        if (!ctx.session || !ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next({
            ctx: {
                ...ctx,
                session: { ...ctx.session },
                user: ctx.user,
            },
        });
    });

/**
 * Paid procedure — requires active subscription (checks DB, not stale JWT)
 */
const CUTOFF_DATE = new Date("2026-01-29T00:00:00+05:30");

export const paidProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    const freshUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
            isPaid: true,
            planType: true,
            subscriptionStatus: true,
            subscriptionExpiry: true,
            createdAt: true,
        },
    });

    if (!freshUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Grandfathered users (created before cutoff) always have access
    const isGrandfathered = freshUser.createdAt < CUTOFF_DATE;

    // Active subscription check
    const hasActiveSub =
        (freshUser.planType === "MONTHLY" || freshUser.planType === "YEARLY") &&
        freshUser.subscriptionStatus === "ACTIVE";

    // Check if subscription has expired
    const isExpired =
        freshUser.subscriptionExpiry !== null &&
        new Date(freshUser.subscriptionExpiry) < new Date();

    if (!isGrandfathered && !freshUser.isPaid && (!hasActiveSub || isExpired)) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "This feature requires an active subscription.",
        });
    }

    return next({ ctx });
});

/**
 * Role-based procedure
 */
export const createRoleProcedure = (allowedRoles: UserRole[]) => {
    return protectedProcedure.use(({ ctx, next }) => {
        if (!ctx.user || !allowedRoles.includes(ctx.user.role as UserRole)) {
            throw new TRPCError({ code: "FORBIDDEN" });
        }
        return next({ ctx });
    });
};

// Specific role procedures
export const adminProcedure = createRoleProcedure(["ADMIN"]);
export const teacherProcedure = createRoleProcedure(["TEACHER", "ADMIN"]);
export const studentProcedure = createRoleProcedure(["STUDENT"]);
