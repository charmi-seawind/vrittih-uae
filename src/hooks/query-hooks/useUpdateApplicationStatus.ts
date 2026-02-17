import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employerAPI } from '@/services/api';

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      employerAPI.updateApplicationStatus(applicationId, status),
    onMutate: async ({ applicationId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['job-applications'] });
      await queryClient.cancelQueries({ queryKey: ['all-applications'] });

      // Snapshot previous values
      const previousJobApps = queryClient.getQueriesData({ queryKey: ['job-applications'] });
      const previousAllApps = queryClient.getQueriesData({ queryKey: ['all-applications'] });
      const previousMyApps = queryClient.getQueriesData({ queryKey: ['my-applications'] });

      // Optimistically update all relevant queries
      queryClient.setQueriesData({ queryKey: ['job-applications'] }, (old: any) => {
        if (!old?.applications && !old?.body?.applications) return old;
        const applications = old.applications || old.body?.applications || [];
        return {
          ...old,
          applications: applications.map((app: any) => 
            app.id === applicationId ? { ...app, status } : app
          ),
          body: old.body ? {
            ...old.body,
            applications: applications.map((app: any) => 
              app.id === applicationId ? { ...app, status } : app
            )
          } : undefined
        };
      });

      queryClient.setQueriesData({ queryKey: ['all-applications'] }, (old: any) => {
        if (!old?.applications && !old?.body?.applications) return old;
        const applications = old.applications || old.body?.applications || [];
        return {
          ...old,
          applications: applications.map((app: any) => 
            app.id === applicationId ? { ...app, status } : app
          ),
          body: old.body ? {
            ...old.body,
            applications: applications.map((app: any) => 
              app.id === applicationId ? { ...app, status } : app
            )
          } : undefined
        };
      });

      // Update job seeker's applications
      queryClient.setQueriesData({ queryKey: ['my-applications'] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            applications: page.applications?.map((app: any) => 
              app.id === applicationId ? { ...app, status } : app
            ) || []
          }))
        };
      });

      return { previousJobApps, previousAllApps, previousMyApps };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousJobApps) {
        context.previousJobApps.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousAllApps) {
        context.previousAllApps.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousMyApps) {
        context.previousMyApps.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['all-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
};