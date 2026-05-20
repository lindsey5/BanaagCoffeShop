import * as z from 'zod';
import { PERMISSIONS } from '../config/permissions';

export const roleSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must not exceed 50 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(100, "Description must not exceed 100 characters"),

    permissions: z
        .array(z.enum(Object.values(PERMISSIONS)))
        .min(1, "At least one permission is required"),
});

export type RoleFormData = z.infer<typeof roleSchema>;