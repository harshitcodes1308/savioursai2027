import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/trpc";

export const contentRouter = createTRPCRouter({
    /**
     * Get all ICSE subjects
     */
    getSubjects: publicProcedure.query(async ({ ctx }) => {
        const subjects = await ctx.prisma.subject.findMany({
            orderBy: { order: "asc" },
        });
        return subjects;
    }),

    /**
     * Get chapters for a specific subject
     */
    getChaptersBySubject: publicProcedure
        .input(z.object({ subjectId: z.string() }))
        .query(async ({ ctx, input }) => {
            const chapters = await ctx.prisma.chapter.findMany({
                where: { subjectId: input.subjectId },
                orderBy: { order: "asc" },
                include: {
                    subject: true,
                    _count: {
                        select: { topics: true },
                    },
                },
            });
            return chapters;
        }),

    /**
     * Get topics for a specific chapter
     */
    getTopicsByChapter: publicProcedure
        .input(z.object({ chapterId: z.string() }))
        .query(async ({ ctx, input }) => {
            const topics = await ctx.prisma.topic.findMany({
                where: { chapterId: input.chapterId },
                orderBy: { order: "asc" },
            });
            return topics;
        }),

    /**
     * Get content for a specific topic
     */
    getTopicContent: publicProcedure
        .input(z.object({ topicId: z.string() }))
        .query(async ({ ctx, input }) => {
            const topic = await ctx.prisma.topic.findUnique({
                where: { id: input.topicId },
                include: {
                    contents: {
                        orderBy: { order: "asc" },
                    },
                    chapter: {
                        include: {
                            subject: true,
                        },
                    },
                },
            });
            return topic;
        }),

    /**
     * Get notes for current user (optionally filtered by topic)
     */
    getNotes: protectedProcedure
        .input(
            z.object({
                topicId: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const profile = await ctx.prisma.studentProfile.findFirst({
                where: { userId: ctx.user.id },
            });

            if (!profile) {
                return [];
            }

            const notes = await ctx.prisma.note.findMany({
                where: {
                    profileId: profile.id,
                    ...(input.topicId && { topicId: input.topicId }),
                },
                orderBy: { updatedAt: "desc" },
                include: {
                    topic: {
                        include: {
                            chapter: {
                                include: {
                                    subject: true,
                                },
                            },
                        },
                    },
                },
            });

            return notes;
        }),

    /**
     * Create a new note
     */
    createNote: protectedProcedure
        .input(
            z.object({
                topicId: z.string(),
                title: z.string().min(1),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const profile = await ctx.prisma.studentProfile.findFirst({
                where: { userId: ctx.user.id },
            });

            if (!profile) {
                throw new Error("Student profile not found");
            }

            const note = await ctx.prisma.note.create({
                data: {
                    profileId: profile.id,
                    topicId: input.topicId,
                    title: input.title,
                    content: input.content,
                },
            });

            return { success: true, note };
        }),

    /**
     * Update an existing note
     */
    updateNote: protectedProcedure
        .input(
            z.object({
                noteId: z.string(),
                title: z.string().min(1).optional(),
                content: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const note = await ctx.prisma.note.update({
                where: { id: input.noteId },
                data: {
                    ...(input.title && { title: input.title }),
                    ...(input.content && { content: input.content }),
                },
            });

            return { success: true, note };
        }),

    /**
     * Delete a note
     */
    deleteNote: protectedProcedure
        .input(z.object({ noteId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.note.delete({
                where: { id: input.noteId },
            });

            return { success: true };
        }),
});
