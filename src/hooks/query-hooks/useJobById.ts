import { useQuery } from '@tanstack/react-query';
import { employerAPI } from '@/services/api';

export const useJobById = (jobId: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => employerAPI.getJobById(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};