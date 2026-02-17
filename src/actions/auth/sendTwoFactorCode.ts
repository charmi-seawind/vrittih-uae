"use server";

export const sendTwoFactorCode = async (email: string) => {
  try {
    // Here you would typically send a two-factor authentication code
    // For now, just return success
    return { success: "Two-factor code sent!" };
  } catch (error) {
    return { error: "Failed to send two-factor code!" };
  }
};