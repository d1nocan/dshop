import { z } from "zod";

export const CreateGiveawaySchema = z.object({
    endsAt: z.bigint(),
    title: z.string().min(5),
    totalWinner: z.number().min(1),
    points: z.number().min(0),
});

export const JoinGiveawaySchema = z.object({
    id: z.string(),
});
