import { useQuery } from '@tanstack/react-query';

export const useSavedJobsCount = () => {
  return useQuery({
    queryKey: ['saved-jobs-count'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/saved-jobs/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Authentication failed');
        }
        throw new Error(`Failed to fetch saved jobs count: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!localStorage.getItem('token'),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error.message.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};