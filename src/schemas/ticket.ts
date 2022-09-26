import { Status } from '@prisma/client';
import { z } from "zod";


export const getUserTickets = z.object({
    id: z.string().nullish(),
});

export const selectTicket = z.object({
    id: z.string(),
});

export const updateTicket = z.object({
    id: z.string(),
    status: z.nativeEnum(Status),
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