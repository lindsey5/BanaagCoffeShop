import * as z from 'zod';

export const inventorySchema = z.object({
    code: z.string()
        .min(5, "Code must be at least 5 characters")
        .max(100, "code must not exceed 100 characters"),
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters"),

    brand: z.string()
        .min(2, "Brand must be at least 2 characters")
        .max(100, "Brand must not exceed 100 characters"),

    quantity: z.number({ error: "Quantity is required" })
        .int("Stock must be a whole number"),
    
    category: z.string({ error: 'Category is required' })
        .min(1, "Category is required"),

    unit: z.string({ error: "Unit is required" }).min(1, "Unit is required"),

    threshold: z.number({ error: "Threshold is required" })
        .int("Threshold must be a whole number"),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;