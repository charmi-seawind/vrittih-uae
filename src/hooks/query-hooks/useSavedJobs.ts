import { useQuery } from '@tanstack/react-query';
import { jobsAPI } from '@/services/api';

export const useSavedJobs = () => {
  return useQuery({
    queryKey: ['saved-jobs'],
    queryFn: jobsAPI.getSavedJobs,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: 3,
    onError: (error) => {
    },
  });
};