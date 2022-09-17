import { z } from "zod";

const status = ["PENDING", "APPROVED", "REJECTED"] as const;

export const selectTicket = z.object({
    id: z.string(),
});

export const updateTicket = z.object({
    id: z.string(),
    status: z.enum(status),
    message: z.string().nullable(),
});

export const createTicket = z.object({
    title: z.string(),
    message: z.string(),
});