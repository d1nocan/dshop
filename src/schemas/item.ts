import { z } from "zod";

export interface ItemImage {
    file: FileList;
    type: string;
}

export const selectItem = z.object({
    id: z.string(),
    input: z.string().optional(),
});

export const createItem = z.object({
    name: z.string().min(3),
    description: z.string().min(5),
    price: z.number().min(0),
    quantity: z.number().min(-1),
    image: z.string().nullable(),
    input: z.string(),
    inputRequired: z.boolean(),
    isHidden: z.boolean(),
    cooldown: z.number(),
});

export const updateItem = z.object({
    id: z.string(),
    name: z.string().min(3),
    description: z.string().min(5),
    price: z.bigint(),
    quantity: z.number().min(-1),
    image: z.string().nullable(),
    input: z.string().nullable(),
    inputRequired: z.boolean(),
    isHidden: z.boolean().nullable(),
    cooldown: z.number(),
});

export const buyItem = z.object({
    id: z.string(),
    quantity: z.number().min(0),
})