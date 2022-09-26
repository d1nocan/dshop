import { Role } from "@prisma/client";
import { selectItem, createItem, updateItem } from "@schemas/item";
import { createProtectedRouter } from "./protected-router";

export const itemRouter = createProtectedRouter()
    .query("get", {
        resolve({ ctx }) {
            return ctx.prisma.item.findMany({});
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
            if (ctx.session.user.role !== Role.Admin) {
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
            if (ctx.session.user.role !== Role.Admin) {
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
            if (item.cooldown > 0 && BigInt(Date.now()) - item?.lastBuy < item.cooldown) {
                throw new Error("Item is on cooldown");
            }
            if (ctx.session.user.cooldown > Date.now()) {
                throw new Error("You are on cooldown");
            }
            await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    points: {
                        decrement: item.price,
                    },
                    cooldown: Date.now() + Number(process.env.DEFAULT_USER_COOLDOWN) * 1000,
                },
            });
            return ctx.prisma.item.update({
                where: {
                    id: input.id,
                },
                data: {
                    quantity: {
                        decrement: 1,
                    },
                    lastBuy: BigInt(Date.now()),
                    transactions: {
                        create: {
                            user: {
                                connect: {
                                    id: ctx.session.user.id,
                                },
                            },
                            input: input.input,
                        },
                    },
                },
            });
        },
    });

export default itemRouter;
