import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/config';

interface ATSAnalysisResult {
  resumeId: string;
  atsScore: number;
  analysis: Array<{
    category: string;
    status: 'passed' | 'failed' | 'partial';
    points: number;
  }>;
  recommendations: string[];
}

export const useATSAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeId: string): Promise<ATSAnalysisResult> => {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_CONFIG.API_URL}/candidates/resumes/${resumeId}/ats-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      // Invalidate resumes query to refresh the list with updated ATS scores
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};