import { Status } from '@prisma/client';
import { selectTransaction, updateTransaction } from '@schemas/transaction';
import { createProtectedRouter } from "./protected-router";

export const transactionRouter = createProtectedRouter()
    .query("get", {
        resolve({ ctx }) {
            return ctx.prisma.transaction.findMany({
                include: {
                    user: true,
                }
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