import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, coverLetter, resumeUrl }: { 
      jobId: string; 
      coverLetter?: string; 
      resumeUrl?: string; 
    }) => jobsAPI.applyForJob(jobId, coverLetter, resumeUrl),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['browse-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-seeker-analytics'] });
      toast({
        title: 'Application submitted successfully!',
        description: 'Your application has been sent to the employer',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
    },
  });
};