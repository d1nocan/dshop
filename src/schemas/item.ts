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
    input: z.string().nullish(),
    isHidden: z.boolean(),
    cooldown: z.number().min(0),
});

export const buyItem = z.object({
    id: z.string(),
    quantity: z.number().min(0),
})