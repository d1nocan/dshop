// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";
import { itemRouter, protectedItemRouter } from "./item";
import { ticketRouter } from "./ticket";
import { transactionRouter } from "./transaction";
import { protectedUserRouter, userRouter } from "./user";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("item.", itemRouter)
    .merge("item.", protectedItemRouter)
    .merge("user.", userRouter)
    .merge("user.", protectedUserRouter)
    .merge("ticket.", ticketRouter)
    .merge("transaction.", transactionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
