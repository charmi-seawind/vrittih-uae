"use client";
// 🟠 Type and store imports commented out
import { JobDataBrowse } from "@/hooks/query-hooks/useBrowseJobInfiniteQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Banknote,
  MapPinCheckInside,
  UsersRound,
  Timer,
  Calendar,
  Bookmark,
  Star,
} from "lucide-react";
import {
  cn,
  formatNumber,
  getTimeDifference,
  renderSalaryText,
} from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import LinkButtonAnimated from "../ui/animated-button-link";

import SaveJobButton from "../Global/SaveJobButton";
import UnsaveJobButton from "../Global/UnsaveJobButton";
import { useSaveJob } from "@/hooks/query-hooks/useSaveJob";
import { useUnsaveJob } from "@/hooks/query-hooks/useUnsaveJob";
import ApplyNowButton from "../Global/ApplyNowButton";
import UnauthorizedApplyButton from "../Global/UnauthorizedApplyButton";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


interface JobCardProps {
  job: JobDataBrowse;
  loading?: boolean;
}

const JobCard = ({ job, loading }: JobCardProps) => {
  const daysLeft = getTimeDifference(job.deadline!);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const handleJobClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(`/job-seeker/jobs/${job.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("relative ", loading && "animate-pulse")}
    >
      {job.isUrgent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: 0.3,
          }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full shadow-md">
            <Timer className="size-3 animate-pulse" />
            <span className="text-xs font-semibold">Urgent</span>
          </div>
        </motion.div>
      )}
      {job.is_featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: 0.3,
          }}
          className={`absolute -top-2 z-10 ${job.isUrgent ? '-left-2' : '-right-2'}`}
        >
          <div className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full shadow-md">
            <Star className="size-3 fill-current" />
            <span className="text-xs font-semibold">Featured</span>
          </div>
        </motion.div>
      )}
      <div onClick={handleJobClick} className="cursor-pointer">
      <Card className={cn(job.isUrgent && "border-red-500", "hover:shadow-lg transition-shadow")}>
        <CardHeader>
          <div className="flex justify-between flex-row mb-3">
            <div className="flex gap-4 items-center">
              <div className="content-start flex justify-between flex-col gap-1 truncate line-clamp-1">
                <LinkButtonAnimated lineClassName="bg-muted-foreground">
                  <Link
                    className="text-xs text-muted-foreground"
                    href={`/profile/company/${job.company.id}`}
                  >
                    {job.company.name}
                  </Link>
                </LinkButtonAnimated>

                <CardTitle className="">{job.title}</CardTitle>
              </div>
            </div>
            <div>
              {isAuthenticated && (
                <JobSaveToggleButton jobId={job.id} isSaved={job.saved && job.saved.length > 0} />
              )}
            </div>
          </div>
          <div className="">
            <Separator />
          </div>
          <CardDescription className="sr-only">
            Card Description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-5 items-center">
              <JobBrowseBadge text={job.workMode} />
              <JobBrowseBadge text={job.jobType} />
            </div>
            <div className="space-y-3">
              <SalaryDisplay
                rate={job.Salary?.rate ?? "N/A"}
                exactAmount={job.Salary?.amount}
                maxAmount={job.Salary?.maxAmount}
                startingAmount={job.Salary?.minAmount}
                displayType={
                  job.Salary?.type as
                    | "Maximum"
                    | "Starting"
                    | "Range"
                    | "Exact"
                    | null
                }
                currency={job.Salary?.currency}
              />

              <p className="flex items-center gap-2 text-sm">
                <MapPinCheckInside className="text-red-600 size-5" />
                <span>{job.location ? job.location : job.workMode}</span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <UsersRound className="text-blue-600 size-5" />
                {/* <span>{formatNumber(job._count.applications)} applicants</span> */}
              </p>
              {job.deadline && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn("flex items-center gap-2 text-sm")}
                >
                  <Calendar className={cn("size-5")} />
                  {daysLeft ? (
                    <span>{daysLeft} remaining</span>
                  ) : (
                    <span>Expired</span>
                  )}
                </motion.p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <div className="flex justify-start items-center gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/job-seeker/jobs/${job.id}`);
              }}
            >
              View Details
            </Button>
            {isAuthenticated ? (
              <ApplyNowButton jobData={job} size={"sm"} />
            ) : (
              <UnauthorizedApplyButton />
            )}
          </div>
        </CardFooter>
      </Card>
      </div>
    </motion.div>
  );
};

// Job Save Toggle Button Component
interface JobSaveToggleButtonProps {
  jobId: string;
  isSaved: boolean;
  className?: string;
}

const JobSaveToggleButton = ({ jobId, isSaved, className }: JobSaveToggleButtonProps) => {
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();
  
  const handleToggleSave = async (e: React.MouseEvent) => {
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
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={cn(
        "flex justify-center items-center gap-2 hover:text-blue-500 disabled:animate-pulse",
        className
      )}
      title={isSaved ? "Remove from saved jobs" : "Save job"}
    >
      <Bookmark
        className={cn(
          "size-5",
          isSaved ? "fill-current text-blue-600" : "text-gray-400",
          isLoading && "animate-pulse"
        )}
      />
    </button>
  );
};

export default JobCard;

export const JobBrowseBadge = ({ text }: { text: string | null }) => {
  return (
    <p className="text-primary bg-primary/10 px-5 py-2 text-xs font-bold rounded-xl w-fit whitespace-nowrap">
      {text}
    </p>
  );
};

export const SalaryDisplay = ({
  maxAmount,
  startingAmount,
  exactAmount,
  displayType,
  currency = "Rs.",
  rate,
}: {
  maxAmount?: number | null;
  startingAmount?: number | null;
  exactAmount?: number | null;
  displayType: "Maximum" | "Starting" | "Range" | "Exact" | null;
  currency?: string | null;
  rate: string;
}) => {
  return (
    <p className="flex items-center gap-2 text-sm">
      <Banknote className="text-green-600 size-5" />
      <span>
        {renderSalaryText({
          maxAmount,
          startingAmount,
          exactAmount,
          displayType,
          currency,
        })}{" "}
        <span className="lowercase">/ per {rate}</span>
      </span>
    </p>
  );
};
