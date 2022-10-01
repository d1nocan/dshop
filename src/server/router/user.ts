import { selectUser, updateUser } from "@schemas/user";
import { createProtectedRouter } from "./protected-router";
import { createRouter } from "./context";

export const userRouter = createRouter().query("get", {
    resolve({ ctx }) {
        return ctx.prisma.user.findMany({
            orderBy: {
                points: "desc",
            },
        });
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
                data: input,
            });
        },
    });
