import type { TicketStatus } from "@prisma/client";
import { z } from "zod";

export const getUserTickets = z.object({
    id: z.string().nullish(),
});

export const selectTicket = z.object({
    id: z.string(),
});

type status = z.ZodType<TicketStatus>;

export const updateTicket = z.object({
    id: z.string(),
    status: z.enum(["Open", "Closed"]) as status,
});

export const createTicket = z.object({
    title: z.string(),
    message: z.string(),
});

export const addMessage = z.object({
    ticketId: z.string(),
    content: z.string(),
    userId: z.string(),
});
