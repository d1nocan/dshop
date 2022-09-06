import { z } from "zod";

const status = ["pending", "approved", "rejected"] as const;

export const selectTransaction = z.object({
    id: z.string().uuid(),
});

export const createTransaction = z.object({
    userId: z.string().uuid(),
    itemId: z.string().uuid(),
});

export const updateTransaction = z.object({
    id: z.string().uuid(),
    status: z.enum(status),
});