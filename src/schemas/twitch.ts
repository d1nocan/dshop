import { z } from "zod";

export const giveEveryone = z.object({
    points: z.number(),
});
