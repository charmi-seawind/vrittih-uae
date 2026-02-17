"use client";

import { useState, useEffect } from "react";

interface DashboardStats {
  totalUsers: number;
  totalEmployers: number;
  totalJobSeekers: number;
  activeUsers: number;
  activeJobSeekers: number;
  activeEmployers: number;
  inactiveUsers: number;
  inactiveJobSeekers: number;
  inactiveEmployers: number;
  totalPendingUsers: number;
  totalPendingEmployers: number;
  totalPendingJobSeekers: number;
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  featuredJobs: number;
  totalApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  reviewedApplications: number;
  shortlistedApplications: number;
  totalSubscribedUsers: number;
  totalUnsubscribedUsers: number;
  totalCancelledUsers: number;
  totalAmount: number;
  totalSubscribedAmount: number;
  totalUnsubscribedAmount: number;
  totalCancelledAmount: number;
  totalPendingAmount: number;
}

// Simple client-side cache
const statsCache = {
  data: null as DashboardStats | null,
  timestamp: null as number | null,
  ttl: 60000 // 1 minute cache
};

export const useAdminDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (useCache = true) => {
    try {
      const now = Date.now();
      
      // Check cache first
      if (useCache && statsCache.data && statsCache.timestamp && 
          (now - statsCache.timestamp) < statsCache.ttl) {
        setStats(statsCache.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard-stats`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Update cache
        statsCache.data = result.data;
        statsCache.timestamp = now;
        
        setStats(result.data);
        setError(null);
      } else {
        throw new Error(result.message || "Failed to fetch stats");
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    fetchStats(false); // Force refresh without cache
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats
  };
};