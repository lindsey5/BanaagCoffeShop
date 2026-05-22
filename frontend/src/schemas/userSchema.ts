import z from "zod";

export const UserSchema = z.object({
    firstname: z.string()
        .min(1, "Firstname is required")
        .max(50, "Firstname must not exceed 50 characters"),

    lastname: z.string()
        .min(1, "Lastname is required")
        .max(50, "Lastname must not exceed 50 characters"),

    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters"),
});

export type UserFormData = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
    firstname: z.string()
        .min(1, "Firstname is required")
        .max(50, "Firstname must not exceed 50 characters"),

    lastname: z.string()
        .min(1, "Lastname is required")
        .max(50, "Lastname must not exceed 50 characters"),

    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters"),
    
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters")
        .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
        .regex(/[a-z]/, "Must include at least 1 lowercase letter")
        .regex(/[0-9]/, "Must include at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character"),

    confirmPassword: z.string()
        .min(1, "Please confirm password"),

    role_id: z.string().min(1, "Role is required")
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type CreateUserFormData = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
    firstname: z.string().min(1, "Firstname is required").max(50),

    lastname: z.string().min(1, "Lastname is required").max(50),

    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(100),

    password: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional()
        .refine((val) => !val || val.length >= 8, {
            message: "Password must be at least 8 characters",
        })
        .refine((val) => !val || val.length <= 100, {
            message: "Password must not exceed 100 characters",
        })
        .refine((val) => !val || /[A-Z]/.test(val), {
            message: "Must include at least 1 uppercase letter",
        })
        .refine((val) => !val || /[a-z]/.test(val), {
            message: "Must include at least 1 lowercase letter",
        })
        .refine((val) => !val || /[0-9]/.test(val), {
            message: "Must include at least 1 number",
        })
        .refine((val) => !val || /[^A-Za-z0-9]/.test(val), {
            message: "Must include at least 1 special character",
        }),

    confirmPassword: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional(),

    role_id: z.string().min(1, "Role is required"),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;