import { selectItem, createItem, updateItem } from '@schemas/item';
import { createProtectedRouter } from "./protected-router";


export const itemRouter = createProtectedRouter()
    .query("get", {
        resolve({ ctx }) {
            return ctx.prisma.item.findMany();
        }
    })
    .query("select", {
        input: selectItem,
        resolve({ ctx, input }) {
            return ctx.prisma.item.findUnique({
                where: {
                    id: input.id,
                },
            });
        }
    })
    .mutation("create", {
        input: createItem,
        resolve({ ctx, input }) {
            if (ctx.session.user.role !== "admin") {throw new Error("Unauthorized")}
            return ctx.prisma.item.create({
                data: {
                    ...input,
                }
            })
        }
    })
    .mutation("update", {
        input: updateItem,
        resolve({ ctx, input }) {
            if (ctx.session.user.role !== "admin") {throw new Error("Unauthorized")}
            return ctx.prisma.item.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...input,
                }
            })
        }
    })
    .mutation("delete", {
        input: selectItem,
        resolve({ ctx, input }) {
            return ctx.prisma.item.delete({
                where: {
                    id: input.id,
                },
            })
        }
    })