import { addPoints } from "./../../schemas/twitch";
import { createRouter } from "./context";

const twitchRouter = createRouter().query("givepoints", {
    input: addPoints,
    resolve({ ctx, input }) {
        return ctx.prisma.user.updateMany({
            where: {
                name: {
                    in: input.users,
                },
            },
            data: {
                points: {
                    increment: input.points,
                },
            },
        });
    },
});

export default twitchRouter;
