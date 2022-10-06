import { Role, Status } from "@prisma/client";
import { selectTransaction, updateTransaction } from "@schemas/transaction";
import { createProtectedRouter } from "./protected-router";

export const transactionRouter = createProtectedRouter()
    .query("get", {
        resolve({ ctx }) {
            return ctx.prisma.transaction.findMany({
                where: {
                    userId: ctx.session.user.role === Role.Admin ? undefined : ctx.session.user.id,
                },
                include: {
                    user: true,
                    item: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        },
    })
    .query("select", {
        input: selectTransaction,
        resolve({ ctx, input }) {
            return ctx.prisma.transaction.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    user: true,
                    item: true,
                },
            });
        },
    })
    .mutation("update", {
        input: updateTransaction,
        async resolve({ ctx, input }) {
            if (ctx.session.user.role !== Role.Admin) {
                throw new Error("Unauthorized");
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
        },
    });

export default transactionRouter;
