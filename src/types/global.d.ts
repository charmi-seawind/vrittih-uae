declare global {
  var otpStore: Map<string, { otp: string; expires: number }> | undefined;
}

export {};