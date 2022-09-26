import { Role, Status } from '@prisma/client';
import { selectTransaction, updateTransaction } from '@schemas/transaction';
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
                    createdAt: 'desc',
                },
            });
        }
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
                }
            });
        }
    })
    .mutation("update", {
        input: updateTransaction,
        resolve({ ctx, input }) {
            return ctx.prisma.transaction.update({
                where: {
                    id: input.id,
                },
                data: {
                    id: input.id,
                    status: input.status as Status,
                },
            });
        }
    });

export default transactionRouter;