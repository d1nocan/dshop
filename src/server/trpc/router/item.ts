import { router, protectedProcedure, publicProcedure } from "../trpc";
import { selectItem, createItem, updateItem } from "@schemas/item";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const itemRouter = router({
    get: publicProcedure.query(({ ctx }) => {
        if (ctx.session?.user?.role === Role.Banned) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You are banned from using this service.",
            });
        }
        return ctx.prisma.item.findMany({
            where: {
                isHidden: ctx.session?.user?.role === Role.Admin ? undefined : false,
            },
        });
    }),
    select: protectedProcedure.input(selectItem).query(({ ctx, input }) => {
        return ctx.prisma.item.findUnique({
            where: {
                id: input.id,
            },
        });
    }),
    create: protectedProcedure.input(createItem).mutation(({ ctx, input }) => {
        if (ctx.session.user.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return ctx.prisma.item.create({
            data: {
                ...input,
            },
        });
    }),
    update: protectedProcedure.input(updateItem).mutation(({ ctx, input }) => {
        if (ctx.session.user.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return ctx.prisma.item.update({
            where: {
                id: input.id,
            },
            data: {
                ...input,
            },
        });
    }),
    delete: protectedProcedure.input(selectItem).mutation(({ ctx, input }) => {
        if (ctx.session.user.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return ctx.prisma.item.delete({
            where: {
                id: input.id,
            },
        });
    }),
    buy: protectedProcedure.input(selectItem).mutation(async ({ ctx, input }) => {
        const item = await ctx.prisma.item.findUnique({
            where: {
                id: input.id,
            },
        });
        if (!item || item.isHidden) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (item.quantity === 0) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Item is out of stock." });
        }
        if (ctx.session.user.points < item.price) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough points" });
        }
        if (item.cooldown > 0 && BigInt(Math.round(Date.now() / 1000)) - item.lastBuy < item.cooldown) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Item is on cooldown." });
        }
        if (ctx.session.user.cooldown > Math.round(Date.now() / 1000)) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "You are on cooldown." });
        }
        await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                points: {
                    decrement: item.price,
                },
                cooldown: Math.round(Date.now() / 1000) + Number(process.env.DEFAULT_USER_COOLDOWN),
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
                lastBuy: BigInt(Math.round(Date.now() / 1000)),
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
    }),
});
