import { z } from "zod";

export const createPrediction = z.object({
    question: z.string().min(3),
    min: z.bigint(),
    max: z.bigint(),
    endsAt: z.instanceof(Date),
    options: z
        .array(z.object({ text: z.string().min(1) }))
        .min(2)
        .max(10),
});

export type CreatePredictionInputType = z.infer<typeof createPrediction>;

export const selectPrediction = z.object({
    id: z.string(),
});

export const makePrediction = z.object({
    predictionId: z.string(),
    optionId: z.number(),
    bet: z.bigint().optional(),
});

export type makePredictionInputType = z.infer<typeof makePrediction>;

export const setWinners = z.object({
    id: z.string(),
    option: z.number().min(0),
});
