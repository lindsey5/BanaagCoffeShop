import * as z from 'zod';

export const stockOutSchema = z.object({
    inventory_item_id: z.string("Select item"),
    quantity: z.number({ error: "Quantity is required" }),
    transaction_type: z.string({ error: 'Transaction type is required' }),
    unit: z.string({ error: "Unit is required" }),
    
});

export type StockOutFormData = z.infer<typeof stockOutSchema>;