import * as z from "zod";

export const supplierSchema = z.object({
    code: z
        .string()
        .trim()
        .min(5, "Code must be at least 5 characters")
        .max(100, "Code must not exceed 100 characters"),

    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters"),

    phone: z
        .string()
        .trim()
        .optional(),

    email: z
        .string()
        .trim()
        .max(100, "Email must not exceed 100 characters")
        .optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;