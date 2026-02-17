"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  MapPin,
  Clock,
  IndianRupee,
  Building,
  Eye,
  Bookmark,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { JobDataBrowse } from "@/hooks/query-hooks/useBrowseJobInfiniteQuery";
import { useSaveJob } from "@/hooks/query-hooks/useSaveJob";
import { useUnsaveJob } from "@/hooks/query-hooks/useUnsaveJob";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { jobsAPI } from "@/services/api";
import { toast } from "sonner";
import { AppliedJobsManager } from "@/lib/appliedJobsManager";

interface SimpleJobCardProps {
  job: JobDataBrowse;
  loading?: boolean;
}

const SimpleJobCard = ({ job, loading }: SimpleJobCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={loading ? "animate-pulse" : ""}
    >
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  {job.title}
                </CardTitle>
                {job.isRemote && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Remote
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">
                    {typeof job.company === 'string' ? job.company : job.company.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.postedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <Badge variant="outline">{job.type}</Badge>
                {job.salary && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-medium">{job.salary}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {job.description?.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-2">
                {job.requirements?.slice(0, 4).map((req, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                )) || []}
                {job.requirements && job.requirements.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.requirements.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <SaveJobButton jobId={job.id} isSaved={job.isSaved} />
              <ApplyJobButton jobId={job.id} jobData={job} />
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};



// Apply Job Button Component
interface ApplyJobButtonProps {
  jobId: string;
  jobData: JobDataBrowse;
}

const ApplyJobButton = ({ jobId, jobData }: ApplyJobButtonProps) => {
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const queryClient = useQueryClient();

  // Check localStorage for applied status
  useEffect(() => {
    const checkAppliedStatus = () => {
      const isJobApplied = AppliedJobsManager.hasUserApplied(jobId);
      setIsApplied(isJobApplied);
    };
    
    checkAppliedStatus();
    
    // Listen for localStorage updates
    const handleStorageUpdate = () => {
      checkAppliedStatus();
    };
    window.addEventListener('appliedJobsUpdated', handleStorageUpdate);
    
    return () => window.removeEventListener('appliedJobsUpdated', handleStorageUpdate);
  }, [jobId]);

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isApplied || isApplying) {
      toast.info("You have already applied!");
      return;
    }
    
    // Always redirect to job details page for proper application handling
    // This ensures custom forms are shown if they exist
    window.location.href = `/job-seeker/jobs/${jobId}`;
  };

  return (
    <>
      <Button
        size="sm"
        onClick={handleApply}
        disabled={isApplying || isApplied}
        variant={isApplied ? "outline" : "default"}
        className={cn(
          isApplying && "animate-pulse",
          isApplied && "cursor-not-allowed",
          "w-full"
        )}
      >
        {isApplying ? "Applying..." : isApplied ? "Applied" : "Apply Now"}
      </Button>
      {isApplied && (
        <Link href={`/job-seeker/jobs/${jobId}`}>
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      )}
    </>
  );
};

// Save Job Button Component
interface SaveJobButtonProps {
  jobId: string;
  isSaved?: boolean;
}

const SaveJobButton = ({ jobId, isSaved }: SaveJobButtonProps) => {
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      unsaveJobMutation.mutate(jobId);
    } else {
      saveJobMutation.mutate(jobId);
    }
  };

  const isLoading = saveJobMutation.isLoading || unsaveJobMutation.isLoading;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleSave}
      disabled={isLoading}
      className={cn(
        isSaved ? "text-blue-600 hover:text-blue-700" : "text-gray-400 hover:text-gray-600",
        isLoading && "animate-pulse"
      )}
      title={isSaved ? "Remove from saved jobs" : "Save job"}
    >
      <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
    </Button>
  );
};

export default SimpleJobCard;