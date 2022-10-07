import { z } from "zod";

export const givePoints = z.object({
    points: z.number().nullable(),
    user: z.string().nullable(),
});

export const giveItem = z.object({
    itemId: z.string(),
    user: z.string(),
});
