import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employerAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ jobId, jobData }: { jobId: string; jobData: any }) => 
      employerAPI.updateJob(jobId, jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast({
        title: 'Success',
        description: 'Job updated successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update job',
        variant: 'destructive',
      });
    },
  });
};