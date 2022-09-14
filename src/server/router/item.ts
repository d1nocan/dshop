import { selectItem, createItem, updateItem } from "@schemas/item";
import { createProtectedRouter } from "./protected-router";

export const itemRouter = createProtectedRouter()
    .query("get", {
        resolve({ ctx }) {
            return ctx.prisma.item.findMany();
        },
    })
    .query("select", {
        input: selectItem,
        resolve({ ctx, input }) {
            return ctx.prisma.item.findUnique({
                where: {
                    id: input.id,
                },
            });
        },
    })
    .mutation("create", {
        input: createItem,
        resolve({ ctx, input }) {
            if (ctx.session.user.role !== "admin") {
                throw new Error("Unauthorized");
            }
            return ctx.prisma.item.create({
                data: {
                    ...input,
                },
            });
        },
    })
    .mutation("update", {
        input: updateItem,
        resolve({ ctx, input }) {
            if (ctx.session.user.role !== "admin") {
                throw new Error("Unauthorized");
            }
            return ctx.prisma.item.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...input,
                },
            });
        },
    })
    .mutation("delete", {
        input: selectItem,
        resolve({ ctx, input }) {
            return ctx.prisma.item.delete({
                where: {
                    id: input.id,
                },
            });
        },
    })
    .mutation("buy", {
        input: selectItem,
        async resolve({ ctx, input }) {
            const item = await ctx.prisma.item.findUnique({
                where: {
                    id: input.id,
                },
            });
            if (!item || item.isHidden) {
                throw new Error("Item not found");
            }
            if (item.quantity === 0) {
                throw new Error("Item is out of stock");
            }
            if (ctx.session.user.points < item.price) {
                throw new Error("Not enough points");
            }
            if (item.cooldown > 0 && (Date.now() - item?.lastBuy) < item.cooldown) {
                    throw new Error("Item is on cooldown");
            }
            if (ctx.session.user.cooldown > Date.now()){
                throw new Error("You are on cooldown");
            }
            return ctx.prisma.item.update({
                where: {
                    id: input.id,
                },
                data: {
                    quantity: {
                        decrement: 1,
                    },
                    lastBuy: Date.now(),
                    transactions: {
                        create: {
                            user: {
                                connect: {
                                    id: ctx.session.user.id,
                                },
                            },
                        },
                    },
                },
            });
        },
    });

export default itemRouter;
