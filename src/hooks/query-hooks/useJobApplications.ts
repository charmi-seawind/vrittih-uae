import { useQuery } from '@tanstack/react-query';
import { employerAPI } from '@/services/api';

export const useJobApplications = (jobId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['job-applications', jobId, page, limit],
    queryFn: () => employerAPI.getJobApplications(jobId, page, limit),
    enabled: !!jobId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};