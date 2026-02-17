"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { jobsAPI } from "@/services/api";
import { useSubscription } from "@/hooks/useSubscription";

export interface Filters {
  workMode: string;
  jobTypes: string;
  experienceLevel: string;
  globalSearch: string;
  companySearch: string;
  locationSearch: string;
}

export interface JobDataBrowse {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl?: string;
    id: string;
  } | string;
  location: string;
  workMode?: string;
  jobType?: string;
  type: string;
  salary?: string;
  Salary?: {
    rate?: string;
    amount?: number;
    maxAmount?: number;
    minAmount?: number;
    type?: "Maximum" | "Starting" | "Range" | "Exact";
    currency?: string;
  };
  description: string;
  requirements?: string[];
  postedDate: string;
  deadline?: Date;
  isRemote?: boolean;
  isSaved?: boolean;
  isUrgent?: boolean;
  is_featured?: boolean;
  saved?: Array<{ id: string }>;
  _count?: { applications: number };
  hasApplied?: boolean;
}

export const useBrowseJobInfiniteQuery = (filters: Filters) => {
  const { data: subscription } = useSubscription();
  const canViewFeaturedJobs = () => {
    const planFeatures = subscription?.plan?.features || subscription?.features || {};
    
    // Only check explicit featured access, not price
    const hasAccess = planFeatures.featured_jobs_access || false;
    
    return hasAccess;
  };
  
  return useInfiniteQuery({
    queryKey: ["browse-jobs", 
      filters.workMode, 
      filters.jobTypes, 
      filters.experienceLevel, 
      filters.globalSearch, 
      filters.companySearch, 
      filters.locationSearch
    ],
    queryFn: async ({ pageParam = 0 }) => {
      
      // Clean empty filter values - ensure proper trimming
      const cleanFilters = {
        page: pageParam,
        limit: 10,
        ...(filters.workMode?.trim() && { workMode: filters.workMode.trim() }),
        ...(filters.jobTypes?.trim() && { jobTypes: filters.jobTypes.trim() }),
        ...(filters.experienceLevel?.trim() && { experienceLevel: filters.experienceLevel.trim() }),
        ...(filters.globalSearch?.trim() && { globalSearch: filters.globalSearch.trim() }),
        ...(filters.companySearch?.trim() && { companySearch: filters.companySearch.trim() }),
        ...(filters.locationSearch?.trim() && { locationSearch: filters.locationSearch.trim() }),
      };
      
      
      const response = await jobsAPI.browseJobs(cleanFilters);
      
      // Check localStorage for applied jobs and merge with API response
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      
      // Filter jobs based on subscription
      
      
      if (response && response.data && response.data.jobs) {
        const appliedJobsData = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        
        // Handle both array and object formats
        let appliedJobs = [];
        if (Array.isArray(appliedJobsData)) {
          appliedJobs = appliedJobsData;
        } else if (typeof appliedJobsData === 'object') {
          // Extract job IDs from all user arrays
          appliedJobs = Object.values(appliedJobsData).flat();
        }
        
        response.data.jobs = response.data.jobs.map((job: JobDataBrowse) => ({
          ...job,
          hasApplied: job.hasApplied || appliedJobs.includes(job.id)
        }));
        
        // Filter jobs based on featured access
        const canView = canViewFeaturedJobs();
        
        if (canView) {
          // Show all jobs (featured + non-featured) if user has access
        } else {
          // Show only non-featured jobs if user doesn't have access
          const beforeFilter = response.data.jobs.length;
          response.data.jobs = response.data.jobs.filter((job: any) => {
            return !job.is_featured;
          });
        }
      }
      
      
      return response;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
    cacheTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage?.data?.hasMore || lastPage?.hasMore || 
                     (lastPage?.data?.jobs && lastPage.data.jobs.length === 10) ||
                     (lastPage?.jobs && lastPage.jobs.length === 10);
      
      if (hasMore) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};