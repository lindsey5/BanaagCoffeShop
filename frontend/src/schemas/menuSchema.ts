import * as z from 'zod';

export const menuIngredientSchema = z.object({
    inventory_item_id: z.string({ error: 'Select ingredient' }),
    amount: z.number({ error: 'Amount is required' }).positive({ error: 'Amount should not be negative or 0'}),
    unit: z.string({ error: 'Unit is required' }).min(1, "Unit is required")
})

export type MenuIngredientFormData = z.infer<typeof menuIngredientSchema>;

export const menuSchema = z.object({
    code: z.string()
        .min(5, "Code must be at least 5 characters")
        .max(100, "code must not exceed 100 characters"),
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters"),

    price: z.number({ error: "Price is required" }),
    
    category: z.string({ error: 'Category is required' })
        .min(1, "Category is required"),

    menuIngredients: z.array(menuIngredientSchema).min(1, "At least one ingredient is required")
});

export type MenuFormData = z.infer<typeof menuSchema>;