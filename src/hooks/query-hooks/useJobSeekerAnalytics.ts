import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

interface JobSeekerAnalytics {
  totalApplied: number;
  totalSaved: number;
  profileCompletion: {
    percentage: number;
  };
  applicationStatusDistribution: {
    accepted: number;
    rejected: number;
    pending: number;
    interview: number;
  };
}

export const useJobSeekerAnalytics = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['job-seeker-analytics', user?.id],
    queryFn: async (): Promise<JobSeekerAnalytics> => {
      const token = localStorage.getItem('token');
      
      if (!token || !isAuthenticated) {
        throw new Error('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || `${API_CONFIG.BASE_URL}`;
      
      // Fetch all analytics data in parallel
      const [appliedResponse, savedResponse, profileResponse, statusDistributionResponse] = await Promise.allSettled([
        fetch(`${baseUrl}/api/candidates/applications/count`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${baseUrl}/api/candidates/saved-jobs/count`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${baseUrl}/api/candidates/profile`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${baseUrl}/api/candidates/applications/status-distribution`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      // Process applied jobs count
      let totalApplied = 0;
      if (appliedResponse.status === 'fulfilled' && appliedResponse.value.ok) {
        const appliedData = await appliedResponse.value.json();
        totalApplied = appliedData?.data?.totalApplied || 0;
      }

      // Process saved jobs count
      let totalSaved = 0;
      if (savedResponse.status === 'fulfilled' && savedResponse.value.ok) {
        const savedData = await savedResponse.value.json();
        totalSaved = savedData?.data?.totalSaved || 0;
      }

      // Process profile completion
      let profileCompletion = { percentage: 0 };
      if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
        const profileData = await profileResponse.value.json();
        const profile = profileData?.data?.profile;
        
        // Calculate profile completion percentage
        let completedFields = 0;
        const totalFields = 8;
        
        if (profile?.full_name) completedFields++;
        if (profile?.email) completedFields++;
        if (profile?.mobile) completedFields++;
        if (profile?.resume?.personal_info?.location) completedFields++;
        if (profile?.resume?.education?.length > 0) completedFields++;
        if (profile?.resume?.experience?.length > 0) completedFields++;
        if (profile?.resume?.skills?.length > 0) completedFields++;
        if (profile?.profile_image) completedFields++;
        
        profileCompletion.percentage = Math.round((completedFields / totalFields) * 100);
      }

      // Process application status distribution
      let applicationStatusDistribution = {
        accepted: 0,
        rejected: 0,
        pending: 0,
        interview: 0,
      };
      if (statusDistributionResponse.status === 'fulfilled' && statusDistributionResponse.value.ok) {
        const statusData = await statusDistributionResponse.value.json();
        const distribution = statusData?.data;
        if (distribution) {
          applicationStatusDistribution = {
            accepted: distribution.accepted || 0,
            rejected: distribution.rejected || 0,
            pending: distribution.pending || 0,
            interview: distribution.interview || 0,
          };
        }
      }

      return {
        totalApplied,
        totalSaved,
        profileCompletion,
        applicationStatusDistribution,
      };
    },
    enabled: !!isAuthenticated && !!user,
    staleTime: 0, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error.message.includes('authentication')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};