"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, DollarSign, Bookmark, Filter, Building, Users, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Filters,
  useBrowseJobInfiniteQuery,
} from "@/hooks/query-hooks/useBrowseJobInfiniteQuery";
import SimpleJobCard from "@/components/Job/SimpleJobCard";
import JobCardSkeleton from "@/components/skeletons/JobCardSkeleton";
import { createArray } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { API_CONFIG } from '@/lib/config';

const BrowseJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await fetch(`${API_CONFIG.API_URL}/user/${user.id}/subscription`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus(data.data.subscription?.status || null);
        }
      } catch (error) {
      } finally {
        setLoadingSubscription(false);
      }
    };
    checkSubscription();
  }, []);

  const searchParams = useSearchParams();
  const filters: Filters = {
    workMode: searchParams.get("workMode") || "",
    jobTypes: jobTypeFilter,
    experienceLevel: searchParams.get("experienceLevel") || "",
    globalSearch: "", // Remove search from API call
    companySearch: searchParams.get("companySearch") || "",
    locationSearch: locationFilter,
  };

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useBrowseJobInfiniteQuery(filters);

  // Get all jobs from API and deduplicate
  const allJobs = useMemo(() => {
    const jobsMap = new Map();
    
    data?.pages.forEach((page, pageIndex) => {
      const apiJobs = page?.data?.jobs || [];
      
      apiJobs.forEach((job: any) => {
        // Always include the job, update if it exists to preserve latest data
        jobsMap.set(job.id, {
          id: job.id,
          title: job.job_title,
          company: job.company_name,
          location: job.office_address,
          type: job.job_type,
          salary: job.pay_amount,
          description: job.job_description,
          requirements: job.additional_requirements ? [job.additional_requirements] : [],
          postedDate: new Date(job.createdAt).toLocaleDateString(),
          isRemote: job.work_location_type === 'Remote',
          isSaved: job.isSaved,
          hasApplied: job.hasApplied || false
        });
      });
    });
    
    return Array.from(jobsMap.values());
  }, [data]);

  // Filter jobs based on search term
  const [filteredJobs, setFilteredJobs] = useState(allJobs || []);

  useEffect(() => {
    if (allJobs) {
      setFilteredJobs(
        allJobs.filter((job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [allJobs, searchTerm]);

  const jobs = filteredJobs;
  



  if (loadingSubscription) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (subscriptionStatus === 'pending') {
    return (
      <div className="w-full space-y-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              Payment Verification Pending
            </h3>
            <p className="text-yellow-700 text-center mb-4 max-w-md">
              Your payment is currently being verified by our admin team. You will be able to browse and apply for jobs once your payment is verified.
            </p>
            <p className="text-sm text-yellow-600">
              This usually takes 24-48 hours. You'll receive an email once verified.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Discover your next career opportunity</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>


          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {jobs.length} jobs
        </p>
        
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {status === "loading" ? (
          <div className="space-y-4">
            {createArray(5).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 && searchTerm ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No matches found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 text-center mb-4">
                We couldn't find any jobs matching "{searchTerm}"
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job, index) => (
            <SimpleJobCard key={`${job.id}-${index}`} job={job} />
          ))
        )}
        
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            <Users className="w-4 h-4" />
            {isFetchingNextPage ? "Loading..." : "Load More Jobs"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;