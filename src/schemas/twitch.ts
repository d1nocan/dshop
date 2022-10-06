import { z } from "zod";

export const giveIt = z.object({
    points: z.number().nullable(),
    user: z.string().nullable(),
});

export const giveItem = z.object({
    itemId: z.string(),
    user: z.string(),
});
