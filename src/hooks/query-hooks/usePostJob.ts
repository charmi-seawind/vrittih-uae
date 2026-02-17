import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employerAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const usePostJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: employerAPI.postJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    },
    onError: (error: any) => {
    },
  });

  return {
    postJob: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};