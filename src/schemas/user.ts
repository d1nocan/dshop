import { z } from "zod";

const role = ["ADMIN", "USER"] as const;

export const selectUser = z.object({
    id: z.string(),
});

export const updateUser = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string(),
    role: z.enum(role),
    points: z.number(),
});