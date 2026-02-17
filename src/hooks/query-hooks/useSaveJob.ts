import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsAPI } from '@/services/api';
import { toast } from 'sonner';

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobsAPI.saveJob(jobId),
    onSuccess: (data, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['browse-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job saved successfully!', { id: 'save-job' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save job', { id: 'save-job' });
    },
  });
};