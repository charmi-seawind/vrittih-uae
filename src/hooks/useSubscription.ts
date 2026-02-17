import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/config';

interface SubscriptionData {
  id: string;
  planName: string;
  price: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentId: string;
  duration: string;
  features: {
    cv_uploads?: number;
    job_applications?: number;
    job_withdrawals?: number;
    featured_jobs_access?: boolean;
    job_posts?: number;
    featured_jobs?: number;
    featured_company?: boolean;
  };
}

export const useSubscription = () => {
  const getAuthHeaders = () => {
    if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  };

  const query = useQuery<SubscriptionData>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const userId = getUserId();
      const response = await fetch(`${API_CONFIG.API_URL}/subscriptions/current`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      
      const data = await response.json();
      return data.data?.subscription || data.subscription || data.data || data;
    },
    enabled: !!getUserId(),
  });

  const canApplyToJob = () => {
    // For now, always return true - can be enhanced later with actual limits
    return true;
  };

  const getRemainingApplications = () => {
    // For now, return unlimited - can be enhanced later with actual limits
    return -1; // -1 means unlimited
  };

  return {
    ...query,
    canApplyToJob,
    getRemainingApplications,
  };
};