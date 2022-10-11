import { z } from "zod";

export const createPrediction = z.object({
    title: z.string(),
    min: z.bigint(),
    max: z.bigint(),
    isActive: z.boolean().optional(),
    options: z.array(z.string()),
});

export const selectPrediction = z.object({
    id: z.string(),
});

export const setWinners = z.object({
    id: z.string(),
    option: z.string(),
});
