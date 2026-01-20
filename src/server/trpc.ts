import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { type UserRole } from "@prisma/client";

/**
 * Create tRPC context
 */
export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
    const session = await getSession();

    return {
        prisma,
        session,
        user: session?.user,
    };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

/**
 * Create router and procedure helpers
 */
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

/**
 * Public procedure (no auth required)
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure (auth required)
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
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
