import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

const handler = async (req: NextRequest) => {
    // FIX for Next.js 15+ / 16+ where NextRequest body stream gets locked/undefined
    const request = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        duplex: 'half',
    } as RequestInit);

    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: createTRPCContext,
        onError:
            process.env.NODE_ENV === "development"
                ? ({ path, error }) => {
                    console.error(
                        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
                    );
                }
                : undefined,
    });
};

export { handler as GET, handler as POST };
