// src/server/router/index.ts
import { default as item } from "./item";
import { default as user } from "./user";
import { default as transaction } from "./transaction";
import { default as ticket } from "./ticket";
import { default as twitch } from "./twitch";
import { createRouter } from "./context";
import superjson from "superjson";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("item.", item)
    .merge("ticket.", ticket)
    .merge("transaction.", transaction)
    .merge("user.", user)
    .merge("twitch.", twitch);

// export type definition of API
export type AppRouter = typeof appRouter;
