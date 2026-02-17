"use server";

// 🟠 Auth imports commented out for build
// import { signIn } from "@/auth";
import { LoginSchema } from "@/schema/LoginSchema";
// import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { identifier, password } = validatedFields.data;

  // 🟠 Auth functionality commented out for build
  // try {
  //   await signIn("credentials", {
  //     email,
  //     password,
  //     redirectTo: "/dashboard",
  //   });
  // } catch (error) {
  //   if (error instanceof AuthError) {
  //     switch (error.type) {
  //       case "CredentialsSignin":
  //         return { error: "Invalid credentials!" };
  //       default:
  //         return { error: "Something went wrong!" };
  //     }
  //   }
  //   throw error;
  // }
  
  // 🔹 Dummy response for build
  return { success: "Login functionality disabled for static build" };
};