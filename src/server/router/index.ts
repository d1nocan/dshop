// src/server/router/index.ts
import { itemRouter } from './item';
import { userRouter } from './user';
import { createRouter } from "./context";
import superjson from "superjson";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("item.", itemRouter)
  .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
