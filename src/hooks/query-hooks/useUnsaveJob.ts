import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsAPI } from '@/services/api';
import { toast } from 'sonner';

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobsAPI.unsaveJob(jobId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['browse-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job removed from saved jobs', { id: 'unsave-job' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove job', { id: 'unsave-job' });
    },
  });
};