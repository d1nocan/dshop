import { router } from "../trpc";
import { codeRouter } from "./code";
import { giveawayRouter } from "./giveaway";
import { itemRouter } from "./item";
import { predictionRouter } from "./prediction";
import { ticketRouter } from "./ticket";
import { transactionRouter } from "./transaction";
import { twitchRouter } from "./twitch";
import { userRouter } from "./user";

export const appRouter = router({
    item: itemRouter,
    ticket: ticketRouter,
    transaction: transactionRouter,
    user: userRouter,
    twitch: twitchRouter,
    code: codeRouter,
    prediction: predictionRouter,
    giveaway: giveawayRouter,
});

export type AppRouter = typeof appRouter;
