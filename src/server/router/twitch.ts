import { Role } from "@prisma/client";
import { giveEveryone } from "./../../schemas/twitch";
import { createRouter } from "./context";

const twitchRouter = createRouter().mutation("givePointsEveryone", {
    input: giveEveryone,
    resolve({ ctx, input }) {
        return ctx.prisma.user.updateMany({
            where: {
                role: {
                    not: Role.Banned,
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
