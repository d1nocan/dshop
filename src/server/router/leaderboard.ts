import { createRouter } from "./context";

const leaderboardRouter = createRouter().query("get", {
    resolve({ ctx }) {
        return ctx.prisma.user.findMany({
            orderBy: {
                points: "desc",
            },
            take: 5,
        });
    },
});

export default leaderboardRouter;
