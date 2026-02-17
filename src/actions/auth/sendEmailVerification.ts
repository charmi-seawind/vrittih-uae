"use server";

export const sendEmailVerification = async (email: string) => {
  try {
    // Here you would typically send an email verification
    // For now, just return success
    return { success: "Verification email sent!" };
  } catch (error) {
    return { error: "Failed to send verification email!" };
  }
};