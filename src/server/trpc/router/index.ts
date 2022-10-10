import { t } from "../trpc";
import { codeRouter } from "./code";
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
    code: codeRouter,
});

export type AppRouter = typeof appRouter;
