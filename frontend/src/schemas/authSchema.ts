import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
});


export type LoginFormData = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  
  newPassword: z.string()
      .min(12, "Password must be at least 12 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
      .regex(/[a-z]/, "Must include at least 1 lowercase letter")
      .regex(/[0-9]/, "Must include at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character"),
  
  confirmPassword: z.string().min(1, "Please confirm your password"),

}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;