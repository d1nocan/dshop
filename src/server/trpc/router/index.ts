import { t } from "../trpc";
import { itemRouter } from "./item";
import { ticketRouter } from "./ticket";
import { transactionRouter } from "./transaction";
import { twitchRouter } from "./twitch";
import { userRouter } from "./user";

export const appRouter = t.router({
    item: itemRouter,
    ticket: ticketRouter,
    transaction: transactionRouter,
    user: userRouter,
    twitch: twitchRouter,
});

export type AppRouter = typeof appRouter;
