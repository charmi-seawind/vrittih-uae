"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { jobsAPI } from "@/services/api";

export interface ApplicationData {
  id: string;
  job_id: string;
  candidate_id: string;
  cover_letter: string;
  resume_url: string;
  resume_id: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    job_title: string;
    company_name: string;
    office_address: string;
    job_type: string;
    work_location_type: string;
    pay_amount: string;
    status: string;
  };
}

export const useMyApplicationsInfiniteQuery = () => {

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');




  
  const isEnabled = typeof window !== 'undefined' && !!token;

  
  return useInfiniteQuery({
    queryKey: ["my-applications"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {

      try {
        const response = await jobsAPI.getMyApplications({
          page: pageParam,
          limit: 10,
        });
        

        
        const applications = response?.applications || response?.data?.applications || response?.data || [];
        

        
        return {
          applications: Array.isArray(applications) ? applications : [],
          page: Number(response?.page) || pageParam,
          totalPages: Number(response?.totalPages || response?.total_pages) || 1,
          total: Number(response?.total) || 0,
        };
      } catch (error) {
        console.error('queryFn error:', error);
        return {
          applications: [],
          page: pageParam,
          totalPages: 1,
          total: 0,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage?.page) || 1;
      const totalPages = Number(lastPage?.totalPages) || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};