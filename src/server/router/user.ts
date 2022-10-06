import { getPage } from "./../../schemas/user";
import { selectUser, updateUser } from "@schemas/user";
import { Role } from "@prisma/client";
import { createProtectedRouter } from "./protected-router";
import { createRouter } from "./context";

export const userRouter = createRouter().query("get", {
    input: getPage,
    async resolve({ ctx, input }) {
        const total = await ctx.prisma.user.count();
        const users = await ctx.prisma.user.findMany({
            where: {
                role: {
                    not: ctx.session?.user?.role === Role.Admin ? undefined : Role.Banned,
                },
            },
            orderBy: {
                points: "desc",
            },
            take: 20,
            skip: (input.page - 1) * 20,
        });
        return {
            total,
            users,
        };
    },
});

export const protectedUserRouter = createProtectedRouter()
    .query("select", {
        input: selectUser,
        resolve({ ctx, input }) {
            return ctx.prisma.user.findUnique({
                where: {
                    id: input.id,
                },
            });
        },
    })
    .mutation("update", {
        input: updateUser,
        resolve({ ctx, input }) {
            return ctx.prisma.user.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...input,
                },
            });
        },
    });
