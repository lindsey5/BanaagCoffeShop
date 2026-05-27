import * as z from "zod";

// PurchaseOrderItem schema
export const purchaseOrderItemSchema = z.object({
    inventory_item_id: z.string().min(1, "Inventory item ID is required"),

    quantity: z.number().min(1, "Quantity must be at least 1"),

    unit: z.enum(["kg", "g", "ml", "l", "pcs"]),

    unit_cost: z.number().min(0, "Unit cost cannot be negative"),
    base_quantity: z.number().min(1, "Base quantity must be at least 1"),
    total_cost: z.number().min(0, "Total cost cannot be negative")
}).refine(
    (data) => data.quantity >= data.base_quantity,
    {
        message: "Quantity must be greater than or equal to base quantity",
        path: ["quantity"] // or ["base_quantity"] depending on UI preference
    }
);

// CreatePurchaseOrderDTO schema
export const createPurchaseOrderSchema = z.object({
    supplier_id: z.string().min(1, "Supplier ID is required"),

    items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),

    notes: z.string().max(300, "Notes must be at most 300 characters").optional()
});

// Type inference
export type CreatePurchaseOrderFormData = z.infer<typeof createPurchaseOrderSchema>;