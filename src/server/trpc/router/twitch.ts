import { Role } from "@prisma/client";
import { giveItem, givePoints } from "@schemas/twitch";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

export const twitchRouter = router({
    givePoints: protectedProcedure.input(givePoints).mutation(({ ctx, input }) => {
        if (ctx.session?.user?.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
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
    giveItem: protectedProcedure.input(giveItem).mutation(async ({ ctx, input }) => {
        if (ctx.session?.user?.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
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

    selectRandom: protectedProcedure.mutation(async ({ ctx }) => {
        if (ctx.session?.user?.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        const random = await ctx.prisma.user.findMany();
        return random[Math.floor(Math.random() * random.length)]?.name;
    }),
});
