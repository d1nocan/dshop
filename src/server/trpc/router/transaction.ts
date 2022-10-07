import { Role, Status } from "@prisma/client";
import { selectTransaction, updateTransaction } from "@schemas/transaction";
import { TRPCError } from "@trpc/server";
import { t, authedProcedure } from "../trpc";

export const transactionRouter = t.router({
    get: authedProcedure.query(({ ctx }) => {
        return ctx.prisma.transaction.findMany({
            where: {
                ...(ctx.session.user.role === Role.Admin ? {} : { userId: ctx.session.user.id }),
            },
            include: {
                user: true,
                item: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }),
    select: authedProcedure.input(selectTransaction).query(({ ctx, input }) => {
        return ctx.prisma.transaction.findUnique({
            where: {
                id: input.id,
            },
            include: {
                user: true,
                item: true,
            },
        });
    }),
    update: authedProcedure.input(updateTransaction).mutation(async ({ ctx, input }) => {
        if (ctx.session.user.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        const transaction = await ctx.prisma.transaction.findUnique({
            where: {
                id: input.id,
            },
        });
        return ctx.prisma.transaction.update({
            where: {
                id: input.id,
            },
            data: {
                id: input.id,
                status: input.status as Status,
                user: {
                    update: {
                        points: {
                            increment: input.status === Status.Canceled ? transaction?.points : 0,
                        },
                    },
                },
                response: input.response,
            },
        });
    }),
});
