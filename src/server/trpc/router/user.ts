import { getPage } from "@schemas/user";
import { selectUser, updateUser } from "@schemas/user";
import { Role } from "@prisma/client";
import { t, authedProcedure } from "../trpc";

export const userRouter = t.router({
    get: t.procedure.input(getPage).query(async ({ ctx, input }) => {
        const total = await ctx.prisma.user.count();
        const users = await ctx.prisma.user.findMany({
            where: {
                role: {
                    not: ctx.session?.user?.role === Role.Admin ? undefined : Role.Banned,
                },
                name: {
                    contains: input.search || undefined,
                },
            },
            orderBy: {
                points: "desc",
            },
            take: 25,
            skip: (input.page - 1) * 25,
        });
        return {
            total,
            users,
        };
    }),
    select: authedProcedure.input(selectUser).query(({ ctx, input }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: input.id,
            },
        });
    }),
    update: authedProcedure.input(updateUser).mutation(({ ctx, input }) => {
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
