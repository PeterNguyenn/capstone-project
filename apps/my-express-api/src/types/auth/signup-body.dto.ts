import { z } from 'zod';


export const SignupSchema = z.object({
    name: z.string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters"),
    email: z.string()
      .email("Invalid email address")
      .toLowerCase(),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  });

export type SignupUser = z.infer<typeof SignupSchema>;

