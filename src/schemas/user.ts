import { z } from "zod";
import { Role } from "@prisma/client";

export const getPage = z.object({
    page: z.number().min(1),
});

export const selectUser = z.object({
    id: z.string(),
});

export const updateUser = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    image: z.string().nullable(),
    role: z.nativeEnum(Role),
    points: z.bigint(),
    cooldown: z.bigint(),
});
