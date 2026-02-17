"use server";

import { RegisterSchema } from "@/schema/RegisterSchema";
import { z } from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  try {
    // Here you would typically hash the password and save to database
    // For now, just return success
    return { success: "User registered successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};