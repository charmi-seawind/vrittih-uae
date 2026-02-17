// Shared global stores
declare global {
  var pendingUsers: Map<string, any> | undefined;
  var educationExperienceStore: Map<string, any> | undefined;
  var otpStore: Map<string, { otp: string; expires: number }> | undefined;
}

// Initialize global stores
if (!global.pendingUsers) {
  global.pendingUsers = new Map();
}
if (!global.educationExperienceStore) {
  global.educationExperienceStore = new Map();
}
if (!global.otpStore) {
  global.otpStore = new Map();
}

export const pendingUsers = global.pendingUsers;
export const educationExperienceStore = global.educationExperienceStore;
export const otpStore = global.otpStore;