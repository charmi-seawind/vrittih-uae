import { EmptyState } from "@/components/Global/EmptyState";
import JobCard from "@/components/Job/JobCard";
import JobCardSkeleton from "@/components/skeletons/JobCardSkeleton";
import { Button } from "@/components/ui/button";
import { useRecommendedJobs } from "@/hooks/query-hooks/useRecommendedJobs";
import { createArray } from "@/lib/utils";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface RecommendedJobProps {
  jobseekerId: string;
}
const RecommendedJob = ({ jobseekerId }: RecommendedJobProps) => {
  const { data: recommendedJobs, isLoading, error } = useRecommendedJobs(jobseekerId);
  
  // Get featured jobs count
  const { data: featuredJobsData } = useQuery({
    queryKey: ['featured-jobs-count'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/api/employer/jobs/featured`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
  
  const featuredJobsCount = featuredJobsData?.data?.jobs?.length || 0;

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1 mt-2 sm:mt-4">Recommended Jobs</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
        Jobs that match your profile and preferences
      </p>
      <div className="w-full">
        {isLoading ? (
          <RecommendedJobFetcherSkeleton />
        ) : error ? (
          <EmptyState
            title="Failed to Load Jobs"
            description="There was an error loading recommended jobs. Please try again."
            icon={<Briefcase />}
            action={
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            }
          />
        ) : !recommendedJobs || recommendedJobs.length === 0 ? (
          <EmptyState
            title={`${featuredJobsCount} Recommended Jobs Found`}
            description="To see recommended jobs upgrade your plan"
            icon={<Briefcase />}
            action={
              <Button asChild>
                <Link href="/job-seeker/upgrade-plans">
                  Upgrade Plan
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default RecommendedJob;

const RecommendedJobFetcherSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
      {createArray(6).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
};


