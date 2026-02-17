import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/config';
import { useSubscription } from './useSubscription';

export const useJobManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data: subscription } = useSubscription();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  };

  const promoteJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      
      // Check featured job limits
      if (subscription) {
        const features = subscription?.plan?.features || subscription?.features || {};
        const usage = subscription?.usage || {};
        const featured_jobs = features.featured_jobs || 0;
        const featured_jobs_used = usage.featured_jobs_used || 0;
        
        if (featured_jobs !== -1 && featured_jobs_used >= featured_jobs) {
          toast.error('You have reached your featured jobs limit. Please upgrade your plan to promote more jobs.');
          return false;
        }
      }
      
      const userId = getUserId();
      const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/jobs/${jobId}/promote`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        toast.success('Job promoted successfully');
        queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to promote job');
        return false;
      }
    } catch (error) {
      toast.error('Error promoting job');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renewJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/jobs/${jobId}/renew`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        toast.success('Job renewed successfully');
        queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
        return true;
      } else {
        toast.error('Failed to renew job');
        return false;
      }
    } catch (error) {
      toast.error('Error renewing job');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const expireJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/jobs/${jobId}/expire`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        toast.success('Job expired successfully');
        queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
        return true;
      } else {
        toast.error('Failed to expire job');
        return false;
      }
    } catch (error) {
      toast.error('Error expiring job');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      const response = await fetch(`${API_CONFIG.API_URL}/employer/${userId}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        toast.success('Job deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
        return true;
      } else {
        toast.error('Failed to delete job');
        return false;
      }
    } catch (error) {
      toast.error('Error deleting job');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const canPromoteJob = () => {
    if (!subscription) return false;
    
    const features = subscription?.plan?.features || subscription?.features || {};
    const usage = subscription?.usage || {};
    const featured_jobs = features.featured_jobs || 0;
    const featured_jobs_used = usage.featured_jobs_used || 0;
    
    return featured_jobs === -1 || featured_jobs_used < featured_jobs;
  };
  
  const getRemainingFeaturedJobs = () => {
    if (!subscription) return 0;
    
    const features = subscription?.plan?.features || subscription?.features || {};
    const usage = subscription?.usage || {};
    const featured_jobs = features.featured_jobs || 0;
    const featured_jobs_used = usage.featured_jobs_used || 0;
    
    if (featured_jobs === -1) return -1; // Unlimited
    return Math.max(0, featured_jobs - featured_jobs_used);
  };

  return {
    promoteJob,
    renewJob,
    expireJob,
    deleteJob,
    isLoading,
    canPromoteJob,
    getRemainingFeaturedJobs,
    subscription,
  };
};