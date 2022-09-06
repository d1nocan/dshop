import { z } from "zod";

export const selectItem = z.object({
    id: z.string(),
});

export const createItem = z.object({
    name: z.string(),
    description: z.string().nullish(),
    price: z.number().min(0),
    quantity: z.number().min(0),
    image: z.string(),
});

export const updateItem = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullish(),
    price: z.number().min(0),
    quantity: z.number().min(0),
    image: z.string(),
    cooldown: z.date().default(() => new Date()),
});