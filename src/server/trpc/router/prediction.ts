import { createPrediction, selectPrediction, setWinners } from "@schemas/prediction";
import { router, protectedProcedure } from "../trpc";

export const predictionRouter = router({
    get: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.prediction.findMany({
            where: {
                isActive: ctx.session.user.role === "Admin" ? undefined : true,
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
                isActive: false,
            },
        });
    }),

    winners: protectedProcedure.input(setWinners).query(async ({ ctx, input }) => {
        const data = await ctx.prisma.prediction.findUnique({
            where: {
                id: input.id,
            },
            include: {
                choices: {
                    where: {
                        option: input.option,
                    },
                },
            },
        });
        const totalwinners = data?.choices.map((e) => e.userId);
        ctx.prisma.prediction.update({
            where: {
                id: input.id,
            },
            data: {
                winOption: {
                    set: input.option,
                },
            },
        });
        ctx.prisma.user.updateMany({
            where: {
                id: {
                    in: totalwinners ?? [],
                },
            },
            data: {
                points: {
                    increment: Number(data?.total) / Number(totalwinners?.length) || 1,
                },
            },
        });
    }),
});
