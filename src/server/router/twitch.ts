import { Role } from "@prisma/client";
import { giveItem, giveIt } from "@schemas/twitch";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";

const twitchRouter = createRouter()
    .mutation("givePoints", {
        input: giveIt,
        resolve({ ctx, input }) {
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
        },
    })
    .mutation("giveItem", {
        input: giveItem,
        async resolve({ ctx, input }) {
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
        },
    });

export default twitchRouter;
