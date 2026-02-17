"use client";

import { useState, useEffect } from 'react';
import { api, apiCall } from '@/lib/api';
import { AppliedJobsManager } from '@/lib/appliedJobsManager';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  role: string;
  status?: string;
  is_email_verified?: boolean;
  is_mobile_verified?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    let token = localStorage.getItem('token');
    let storedUser = localStorage.getItem('user');
    
    // Fallback to sessionStorage if localStorage is empty
    if (!token) {
      token = sessionStorage.getItem('token');
      storedUser = sessionStorage.getItem('user');
    }
    
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Try to get user from localStorage first
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setLoading(false);
          return;
        } catch {
        }
      }
      
      // If no stored user, remove invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
    
    // Sync applied jobs with database for job seekers
    if (userData.role === 'candidate') {
      try {
        await syncAppliedJobsWithDatabase();
      } catch (error) {
      }
    }
  };
  
  const syncAppliedJobsWithDatabase = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/my-applications?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const appliedJobIds = data.data?.applications?.map((app: any) => app.job_id) || [];
        
        // Clear current user's applied jobs and update with database data
        AppliedJobsManager.clearUserAppliedJobs();
        appliedJobIds.forEach((jobId: string) => {
          AppliedJobsManager.addAppliedJob(jobId);
        });
        
      }
    } catch (error) {
    }
  };
  
  const refreshAuth = () => {
    verifyToken();
  };

  const logout = () => {
    // Clear user-specific applied jobs data
    AppliedJobsManager.clearUserAppliedJobs();
    
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('pendingUserId');
    localStorage.removeItem('onboarding-storage');
    localStorage.removeItem('appliedJobs');
    
    // Clear Razorpay data
    localStorage.removeItem('rzp_checkout_anon_id');
    localStorage.removeItem('rzp_device_id');
    localStorage.removeItem('rzp_stored_checkout_id');
    
    // Clear sessionStorage
    sessionStorage.removeItem('pendingUserId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Clear React Query cache
    queryClient.clear();
    
    setUser(null);
    window.location.href = 'https://vrrittih.com';
  };

  return {
    user,
    loading,
    login,
    logout,
    refreshAuth,
    isAuthenticated: !!user,
  };
};