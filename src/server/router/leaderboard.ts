import { createRouter } from "./context";

const leaderboardRouter = createRouter()
    .query("leaderboard", {
        resolve({ ctx }) {
            return ctx.prisma.user.findMany(
                {
                    orderBy: {
                        points: "desc",
                    },
                    take: 10,
                }
            );
        },
    })

export default leaderboardRouter;