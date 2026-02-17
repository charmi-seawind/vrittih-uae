"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import JobCard from "@/components/Job/JobCard";
import EmptySavedJobsState from "@/components/Job/NoSavedJobs";
import JobCardSkeleton from "@/components/skeletons/JobCardSkeleton";
import { useSavedJobs } from "@/hooks/query-hooks/useSavedJobs";
import { createArray } from "@/lib/utils";
// import { Session } from "next-auth";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SaveJobPageProps {
  session: any; // Session;
}

const SaveJobPage = ({ session }: SaveJobPageProps) => {
  const { data: savedJobsResponse, isLoading, isRefetching, refetch } = useSavedJobs();
  const [appliedJobsFromStorage, setAppliedJobsFromStorage] = useState<string[]>([]);
  
  // Get applied jobs from localStorage on mount
  useEffect(() => {
    const appliedJobsData = localStorage.getItem('appliedJobs') || '[]';
    let appliedJobs = [];
    try {
      appliedJobs = JSON.parse(appliedJobsData);
      if (!Array.isArray(appliedJobs)) {
        appliedJobs = [];
      }
    } catch (error) {
      appliedJobs = [];
    }
    setAppliedJobsFromStorage(appliedJobs);
    refetch();
  }, [refetch]);
  
  // Listen for localStorage changes to update applied status
  useEffect(() => {
    const handleStorageChange = () => {
      const appliedJobsData = localStorage.getItem('appliedJobs') || '[]';
      let appliedJobs = [];
      try {
        appliedJobs = JSON.parse(appliedJobsData);
        if (!Array.isArray(appliedJobs)) {
          appliedJobs = [];
        }
      } catch (error) {
        appliedJobs = [];
      }
      setAppliedJobsFromStorage(appliedJobs);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event when localStorage is updated from same tab
    const handleAppliedJobUpdate = () => {
      const appliedJobsData = localStorage.getItem('appliedJobs') || '[]';
      let appliedJobs = [];
      try {
        appliedJobs = JSON.parse(appliedJobsData);
        if (!Array.isArray(appliedJobs)) {
          appliedJobs = [];
        }
      } catch (error) {
        appliedJobs = [];
      }
      setAppliedJobsFromStorage(appliedJobs);
    };
    
    window.addEventListener('appliedJobsUpdated', handleAppliedJobUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('appliedJobsUpdated', handleAppliedJobUpdate);
    };
  }, []);
  
  // Transform API response to match expected format
  const data = useMemo(() => {
    
    if (!savedJobsResponse?.data?.savedJobs) return [];
    
    return savedJobsResponse.data.savedJobs.map((savedJob: any) => {
      const jobId = savedJob.job?.id || savedJob.id;
      const isApplied = savedJob.job?.applied || savedJob.applied || savedJob.job?.has_applied || savedJob.has_applied || appliedJobsFromStorage.includes(jobId);
      
      
      const jobData = {
        id: jobId,
        title: savedJob.job?.job_title || savedJob.title,
        company: { 
          name: savedJob.job?.company_name || savedJob.company_name || 'Unknown Company', 
          logoUrl: '', 
          id: savedJob.job?.company_id || savedJob.company_id || '1'
        },
        location: savedJob.job?.office_address || savedJob.location || 'Remote',
        workMode: savedJob.job?.work_location_type || savedJob.work_location_type || 'Remote',
        jobType: savedJob.job?.job_type || savedJob.job_type || 'Full-time',
        Salary: { 
          rate: 'year', 
          amount: savedJob.job?.pay_amount || savedJob.pay_amount || 0, 
          type: 'Exact' as const, 
          currency: '₹' 
        },
        deadline: savedJob.job?.application_deadline ? new Date(savedJob.job.application_deadline) : new Date(),
        isUrgent: savedJob.job?.is_urgent || savedJob.is_urgent || false,
        hasApplied: isApplied,
        saved: [{ id: savedJob.id }],
        _count: { applications: savedJob.job?.application_count || savedJob.application_count || 0 }
      };
      
      // Ensure hasApplied is properly set for ApplyNowButton
      jobData.hasApplied = isApplied;
      
      return jobData;
    });
  }, [savedJobsResponse, appliedJobsFromStorage]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(data || []);

  useEffect(() => {
    if (data) {
      setFilteredJobs(
        data.filter((job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [data, searchTerm]);

  // Simple, professional animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-background border-b border-border/10">
          <h1 className="text-2xl font-bold text-foreground">Saved Jobs</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 px-4 sm:px-6 lg:px-8">
          {createArray(10).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Simple Header */}
      <div className="w-full bg-background border-b border-border/10">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">
              Saved Jobs ({filteredJobs.length})
            </h1>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search saved jobs by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredJobs.length === 0 && searchTerm ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            No matches found
          </h3>
          <p className="mt-2 text-muted-foreground max-w-md">
            We couldn't find any saved jobs matching "{searchTerm}"
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setSearchTerm("")}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredJobs.map((job) => (
            <motion.div key={job.id} variants={itemVariants}>
              <JobCard loading={isRefetching} job={job} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SaveJobPage;