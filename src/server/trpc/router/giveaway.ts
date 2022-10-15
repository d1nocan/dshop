import { User } from "@prisma/client";
import { CreateGiveawaySchema, JoinGiveawaySchema } from "@schemas/giveaway";
import { router, protectedProcedure } from "../trpc";

export const giveawayRouter = router({
    create: protectedProcedure.input(CreateGiveawaySchema).mutation(({ ctx, input }) => {
        return ctx.prisma.giveaway.create({
            data: {
                endsAt: input.endsAt,
                title: input.title,
                totalWinner: input.totalWinner,
                points: input.points,
            },
        });
    }),

    get: protectedProcedure.query(async ({ ctx }) => {
        const notCompleted = await ctx.prisma.giveaway.findMany({
            where: {
                endsAt: {
                    lte: Date.now(),
                },
                winners: {
                    none: {},
                },
            },
            orderBy: {
                endsAt: "desc",
            },
            include: {
                winners: true,
                joined: true,
            },
        });
        if (notCompleted.length > 0) {
            notCompleted.forEach(async (giveaway) => {
                const winners = giveaway.joined
                    .sort(() => 0.5 - Math.random())
                    .slice(0, giveaway.totalWinner) as User[];
                await ctx.prisma.giveaway.update({
                    where: {
                        id: giveaway.id,
                    },
                    data: {
                        winners: {
                            connect: winners.map((winner) => ({
                                id: winner.id,
                            })),
                            updateMany: {
                                where: {
                                    id: {
                                        in: winners.map((winner) => winner.id),
                                    },
                                },
                                data: {
                                    points: {
                                        increment: giveaway.points as bigint,
                                    },
                                },
                            },
                        },
                    },
                });
            });
        }
        return await ctx.prisma.giveaway.findMany({
            orderBy: {
                endsAt: "desc",
            },
            include: {
                winners: true,
                joined: true,
            },
        });
    }),

    join: protectedProcedure.input(JoinGiveawaySchema).mutation(({ ctx, input }) => {
        return ctx.prisma.giveaway.update({
            where: {
                id: input.id,
            },
            data: {
                joined: {
                    connect: {
                        id: ctx.session.user.id,
                    },
                },
            },
        });
    }),
});
