import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const menuIngredientSchema = z.object({
    inventory_item_id: z.string({ error: 'Select ingredient' }),
    amount: z.number({ error: 'Amount is required' }).positive({ error: 'Amount should not be negative or 0'}),
    unit: z.string({ error: 'Unit is required' }).min(1, "Unit is required")
})

export type MenuIngredientFormData = z.infer<typeof menuIngredientSchema>;

export const createMenuSchema = z.object({
    code: z.string()
        .min(5, "Code must be at least 5 characters")
        .max(100, "code must not exceed 100 characters"),
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters"),

    price: z.number({ error: "Price is required" }),
    
    category: z.string({ error: 'Category is required' })
        .min(1, "Category is required"),

    menuIngredients: z.array(menuIngredientSchema).min(1, "At least one ingredient is required"),

    image: z
        .instanceof(File, { message: "Image is required" })
        .refine((file) => file !== undefined, { message: "Image is required" })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "Image must be less than 5MB",
        }),
});

export type CreateMenuFormData = z.infer<typeof createMenuSchema>;

export const updateMenuSchema = z.object({
    code: z.string()
        .min(5, "Code must be at least 5 characters")
        .max(100, "code must not exceed 100 characters"),
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters"),

    price: z.number({ error: "Price is required" }),
    
    category: z.string({ error: 'Category is required' })
        .min(1, "Category is required"),

    menuIngredients: z.array(menuIngredientSchema).min(1, "At least one ingredient is required"),

    image: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Image must be less than 5MB",
        }),
});

export type UpdateMenuFormData = z.infer<typeof createMenuSchema>;