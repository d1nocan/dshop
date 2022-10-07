import { Role } from "@prisma/client";
import { giveItem, givePoints } from "@schemas/twitch";
import { TRPCError } from "@trpc/server";
import { t, authedProcedure } from "../trpc";

export const twitchRouter = t.router({
    givePoints: authedProcedure.input(givePoints).mutation(({ ctx, input }) => {
        return ctx.prisma.user.updateMany({
            where: {
                name: input.user ?? undefined,
                role: {
                    not: Role.Banned,
                },
            },
            data: {
                points: {
                    increment: input.points ?? 0,
                },
            },
        });
    }),
    giveItem: authedProcedure.input(giveItem).mutation(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findUnique({
            where: {
                name: input.user,
            },
        });
        if (!user) {
            throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
        }
        return ctx.prisma.item.update({
            where: {
                id: input.itemId,
            },
            data: {
                transactions: {
                    create: {
                        user: {
                            connect: {
                                name: input.user,
                            },
                        },
                    },
                },
            },
        });
    }),
});
