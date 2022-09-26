import { z } from "zod";
import { Status } from "@prisma/client";

export const selectTransaction = z.object({
    id: z.string(),
});

export const createTransaction = z.object({
    userId: z.string(),
    itemId: z.string(),
});

export const updateTransaction = z.object({
    id: z.string(),
    status: z.nativeEnum(Status),
});
