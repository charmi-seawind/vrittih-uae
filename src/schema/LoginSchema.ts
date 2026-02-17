import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;