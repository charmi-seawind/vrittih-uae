import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { API_CONFIG } from '@/lib/config';

interface Job {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl?: string;
  };
  location: string;
  salary?: string;
  type: string;
  createdAt: Date;
  description: string;
}

export const useRecommendedJobs = (jobseekerId?: string) => {
  const { isAuthenticated, user } = useAuth();
  const { data: subscription } = useSubscription();

  return useQuery({
    queryKey: ['recommended-jobs', jobseekerId || user?.id, subscription?.plan?.features?.featured_jobs_access],
    queryFn: async (): Promise<Job[]> => {
      const token = localStorage.getItem('token');
      
      if (!token || !isAuthenticated) {
        throw new Error('No authentication token found');
      }
      
      // Check featured jobs access from plan features (backend structure: subscription.plan.features)
      const planFeatures = subscription?.plan?.features || subscription?.features || {};
      const hasFeaturedAccess = planFeatures.featured_jobs_access || false;
      
      // If user cannot view featured jobs, return empty array
      if (!hasFeaturedAccess) {
        return [];
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || `${API_CONFIG.BASE_URL}`;
      
      try {
        // Fetch only featured jobs
        const featuredResponse = await fetch(`${baseUrl}/api/employer/jobs/featured`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        let featuredJobs: Job[] = [];

        // Handle featured jobs response
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          const rawFeaturedJobs = featuredData?.data?.jobs || [];
          
          // Filter only jobs that are actually featured
          const actuallyFeaturedJobs = rawFeaturedJobs.filter((job: any) => job.is_featured === true);
          
          // Transform featured jobs to match JobDataBrowse interface
          featuredJobs = actuallyFeaturedJobs.map((job: any) => ({
            id: job.id,
            title: job.job_title,
            company: {
              name: job.company_name,
              id: job.company_id || job.id,
              logoUrl: job.company_logo
            },
            location: job.work_location_type || job.office_address,
            workMode: job.work_location_type,
            jobType: job.job_type,
            type: job.job_type,
            description: job.job_description,
            postedDate: job.created_at,
            Salary: {
              rate: job.pay_type,
              amount: parseInt(job.pay_amount),
              type: "Exact" as const,
              currency: "₹"
            },
            saved: [],
            isUrgent: false
          }));
        }

        // Return only featured jobs
        return featuredJobs;
      } catch (error) {
        // Return empty array instead of throwing to prevent UI breaking
        return [];
      }
    },
    enabled: !!isAuthenticated && !!user && !!subscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error.message.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};