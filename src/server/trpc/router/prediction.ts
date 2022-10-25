import { makePrediction } from "./../../../schemas/prediction";
import { createPrediction, selectPrediction, setWinners } from "@schemas/prediction";
import { router, protectedProcedure } from "../trpc";

export const predictionRouter = router({
    get: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.prediction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                Vote: {
                    orderBy: {
                        choice: "asc",
                    },
                },
            },
        });
    }),
    make: protectedProcedure.input(makePrediction).mutation(async ({ ctx, input }) => {
        if (input.bet && ctx.session.user.points < input.bet) {
            throw new Error("You don't have enough point");
        }
        await ctx.prisma.prediction.update({
            where: {
                id: input.predictionId,
            },
            data: {
                total: {
                    increment: input.bet || BigInt(0),
                },
            },
        });
        return await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                points: {
                    decrement: input.bet || 0,
                },
                predictions: {
                    create: {
                        prediction: {
                            connect: {
                                id: input.predictionId,
                            },
                        },
                        choice: input.optionId,
                        points: input.bet || BigInt(0),
                    },
                },
            },
        });
    }),
    create: protectedProcedure.input(createPrediction).mutation(({ ctx, input }) => {
        return ctx.prisma.prediction.create({
            data: input,
        });
    }),

    close: protectedProcedure.input(selectPrediction).mutation(({ ctx, input }) => {
        return ctx.prisma.prediction.update({
            where: {
                id: input.id,
            },
            data: {
                endsAt: new Date(),
            },
        });
    }),

    winners: protectedProcedure.input(setWinners).mutation(async ({ ctx, input }) => {
        const data = await ctx.prisma.prediction.findUnique({
            where: {
                id: input.id,
            },
            include: {
                Vote: {
                    where: {
                        choice: input.option,
                    },
                },
            },
        });
        const totalwinners = data?.Vote.map((e) => e.userId);
        totalwinners?.length &&
            (await ctx.prisma.user.updateMany({
                where: {
                    id: {
                        in: totalwinners ?? [],
                    },
                },
                data: {
                    points: {
                        increment: Number((Number(data?.total) / Number(totalwinners?.length)).toFixed()) || 1,
                    },
                },
            }));
        return await ctx.prisma.prediction.update({
            where: {
                id: input.id,
            },
            data: {
                winOption: input.option,
            },
        });
    }),
});
