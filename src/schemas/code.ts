import { z } from "zod";

export const Code = z.object({
    code: z.string(),
    limit: z.number().min(-1),
    points: z.bigint(),
});

export const useCode = z.object({
    code: z.string(),
});
