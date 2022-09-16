// src/server/router/index.ts
import { default as item } from './item';
import { default as user } from './user';
import { createRouter } from "./context";
import superjson from "superjson";
import {default as leaderboard} from './leaderboard';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("leaderboard.", leaderboard)
  .merge("item.", item)
  .merge("user.", user);

// export type definition of API
export type AppRouter = typeof appRouter;