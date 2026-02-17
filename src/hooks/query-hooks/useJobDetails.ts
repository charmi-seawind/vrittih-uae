import { useQuery } from '@tanstack/react-query';

interface JobDetails {
  id: string;
  title: string;
  description: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  location: string;
  salary?: string;
  type: string;
  workMode: string;
  experienceLevel: string;
  requirements: string[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export const useJobDetails = (jobId: string) => {
  return useQuery({
    queryKey: ['job-details', jobId],
    queryFn: async (): Promise<JobDetails> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};