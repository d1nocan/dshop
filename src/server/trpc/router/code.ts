import { Code, useCode } from "@schemas/code";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

export const codeRouter = router({
    create: protectedProcedure.input(Code).mutation(({ input, ctx }) => {
        return ctx.prisma.code.create({
            data: {
                code: input.code,
                limit: input.limit,
                points: input.points,
            },
        });
    }),

    update: protectedProcedure.input(Code).mutation(({ input, ctx }) => {
        return ctx.prisma.code.update({
            where: { code: input.code },
            data: {
                points: input.points,
                limit: input.limit,
            },
        });
    }),

    use: protectedProcedure.input(useCode).mutation(async ({ input, ctx }) => {
        const code = await ctx.prisma.code.findUnique({ where: { code: input.code }, include: { whoUsed: true } });
        if (!code || code.limit === 0) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (code.whoUsed.some((u) => u.id === ctx.session.user.id)) {
            throw new TRPCError({ code: "BAD_REQUEST" });
        }
        return ctx.prisma.user.update({
            where: { id: ctx.session.user.id },
            data: {
                points: {
                    increment: code.points,
                },
                usedcodes: {
                    connect: {
                        code: input.code,
                    },
                },
            },
        });
    }),
});
