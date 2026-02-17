/**
 * Applied Jobs Manager - User-specific job application state management
 */

export class AppliedJobsManager {
  private static STORAGE_KEY = 'appliedJobs';

  /**
   * Get current user ID from localStorage
   */
  private static getCurrentUserId(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || null;
    } catch {
      return null;
    }
  }

  /**
   * Get all applied jobs data from localStorage
   */
  private static getAllAppliedJobs(): Record<string, string[]> {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  /**
   * Save all applied jobs data to localStorage
   */
  private static saveAllAppliedJobs(data: Record<string, string[]>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Get applied jobs for current user
   */
  static getUserAppliedJobs(): string[] {
    try {
      // Try to get simple array first (legacy format)
      const simpleArray = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (Array.isArray(simpleArray)) {
        return simpleArray;
      }
      
      // Fallback to user-specific format
      const userId = this.getCurrentUserId();
      if (!userId) return [];
      const allAppliedJobs = this.getAllAppliedJobs();
      return allAppliedJobs[userId] || [];
    } catch {
      return [];
    }
  }

  /**
   * Check if current user has applied for a specific job
   */
  static hasUserApplied(jobId: string): boolean {
    const userAppliedJobs = this.getUserAppliedJobs();
    const hasApplied = userAppliedJobs.includes(jobId);
    return hasApplied;
  }

  /**
   * Add a job to current user's applied jobs
   */
  static addAppliedJob(jobId: string): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    // Add to user-specific format
    const allAppliedJobs = this.getAllAppliedJobs();
    const userAppliedJobs = allAppliedJobs[userId] || [];

    if (!userAppliedJobs.includes(jobId)) {
      userAppliedJobs.push(jobId);
      allAppliedJobs[userId] = userAppliedJobs;
      this.saveAllAppliedJobs(allAppliedJobs);
    }

    // Also update legacy simple array format for backward compatibility
    try {
      const simpleArray = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (Array.isArray(simpleArray) && !simpleArray.includes(jobId)) {
        simpleArray.push(jobId);
        localStorage.setItem('appliedJobs', JSON.stringify(simpleArray));
      }
    } catch {
      // If parsing fails, create new array
      localStorage.setItem('appliedJobs', JSON.stringify([jobId]));
    }
  }

  /**
   * Remove a job from current user's applied jobs
   */
  static removeAppliedJob(jobId: string): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    // Remove from user-specific format
    const allAppliedJobs = this.getAllAppliedJobs();
    const userAppliedJobs = allAppliedJobs[userId] || [];
    const updatedJobs = userAppliedJobs.filter(id => id !== jobId);
    allAppliedJobs[userId] = updatedJobs;
    this.saveAllAppliedJobs(allAppliedJobs);

    // Also remove from legacy simple array format
    try {
      const simpleArray = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (Array.isArray(simpleArray)) {
        const updatedSimpleArray = simpleArray.filter(id => id !== jobId);
        localStorage.setItem('appliedJobs', JSON.stringify(updatedSimpleArray));
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Clear all applied jobs for current user
   */
  static clearUserAppliedJobs(): void {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    const allAppliedJobs = this.getAllAppliedJobs();
    delete allAppliedJobs[userId];
    this.saveAllAppliedJobs(allAppliedJobs);
  }

  /**
   * Clear all applied jobs data (for admin use)
   */
  static clearAllAppliedJobs(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}