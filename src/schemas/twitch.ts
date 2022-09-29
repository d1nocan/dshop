import { z } from "zod";

export const addPoints = z.object({
    points: z.number(),
    users: z.array(z.string()),
});
