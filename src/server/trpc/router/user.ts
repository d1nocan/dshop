import { getPage } from "@schemas/user";
import { selectUser, updateUser } from "@schemas/user";
import { Role } from "@prisma/client";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
    get: publicProcedure.input(getPage).query(async ({ ctx, input }) => {
        const total = await ctx.prisma.user.count();
        const users = await ctx.prisma.user.findMany({
            where: {
                role: {
                    not: ctx.session?.user?.role === Role.Admin ? undefined : Role.Banned,
                },
                name: {
                    contains: input.search || undefined,
                    mode: "insensitive",
                },
            },
            orderBy: {
                points: "desc",
            },
            take: input.search ? undefined : 25,
            skip: input.search ? undefined : (input.page - 1) * 25,
        });
        return {
            total,
            users,
        };
    }),
    select: protectedProcedure.input(selectUser).query(({ ctx, input }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input.id,
            },
        });
    }),
    update: protectedProcedure.input(updateUser).mutation(({ ctx, input }) => {
        if (ctx.session?.user?.role !== Role.Admin) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return ctx.prisma.user.update({
            where: {
                id: input.id,
            },
            data: {
                ...input,
            },
        });
    }),
});
