import { useQuery } from '@tanstack/react-query';
import { employerAPI } from '@/services/api';

export const useEmployerJobs = () => {
  
  return useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () => {
      return employerAPI.getJobs();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
    },
    onError: (error) => {
    },
  });
};