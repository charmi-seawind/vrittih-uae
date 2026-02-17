import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeAPI } from '@/services/api';

export const useResumes = () => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: resumeAPI.getResumes,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: 3,
  });
};

export const useUploadCV = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resumeAPI.uploadCV,
    onSuccess: () => {
      queryClient.invalidateQueries(['resumes']);
    },
  });
};

export const usePreviewResume = (userId: string) => {
  return useQuery({
    queryKey: ['resume-preview', userId],
    queryFn: () => resumeAPI.previewResume(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteCV = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resumeAPI.deleteCV,
    onSuccess: () => {
      queryClient.invalidateQueries(['resumes']);
    },
  });
};