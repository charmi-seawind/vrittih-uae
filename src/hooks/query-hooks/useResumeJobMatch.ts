import { useMutation } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/config';

interface MatchAnalysis {
  resumeId: string;
  jobId: string;
  jobTitle: string;
  resumeName: string;
  matchScore: number;
  breakdown: Array<{
    category: string;
    score: number;
    details: string;
  }>;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export const useResumeJobMatch = () => {
  return useMutation({
    mutationFn: async ({ resumeId, jobId }: { resumeId: string; jobId: string }): Promise<MatchAnalysis> => {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_CONFIG.API_URL}/candidates/resumes/${resumeId}/match-job/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume-job match');
      }

      const data = await response.json();
      return data.data;
    },
  });
};