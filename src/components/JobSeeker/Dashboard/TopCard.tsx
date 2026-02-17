"use client";
import { useJobSeekerAnalytics } from "@/hooks/query-hooks/useJobSeekerAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CheckCircle, FileUser, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import LinkButtonAnimated from "@/components/ui/animated-button-link";
import Link from "next/link";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

const ProfileCompletionCard = () => {
  const { percentage, completedCount, totalFields, score, loading, completionLevel } = useProfileCompletion();

  return (
    <Card className="col-span-1 md:col-span-2 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant={completionLevel.color === 'green' ? "default" : 
                    completionLevel.color === 'blue' ? "secondary" : 
                    completionLevel.color === 'yellow' ? "outline" : "destructive"}
            className="text-xs"
          >
            {percentage}%
          </Badge>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
          <Skeleton className="w-full h-[35px]" />
        ) : (
          <div className="flex flex-col h-full justify-center">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{percentage}%</div>
             
            </div>
            <Progress value={percentage} className="h-2 mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{completionLevel.level} Profile</span>
              <span className="text-xs text-muted-foreground">{completionLevel.message}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TopCard = () => {
  const { data: analytics, isLoading, error } = useJobSeekerAnalytics();

  return (
    <div className="mt-5 flex flex-col">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Job Applied Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Job Applied
            </CardTitle>
            <FileUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-grow flex items-center">
            <div className="text-2xl font-bold ">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="w-[35px] h-[35px]" />
                ) : (
                  (analytics?.totalApplied ?? 0) === 0 ? (
                    <span>0</span>
                  ) : (
                    <NumberTicker value={analytics.totalApplied} />
                  )
                )}
              </div>
              <LinkButtonAnimated>
                <Link href={"/job-seeker/applied-jobs"} className="text-sm">
                  View Applied Jobs
                </Link>
              </LinkButtonAnimated>
            </div>
          </CardContent>
        </Card>

        {/* Job Saved Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Saved</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-grow flex items-center">
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="w-[35px] h-[35px]" />
              ) : (
                <>
                  {(analytics?.totalSaved ?? 0) === 0 ? (
                    <span>0</span>
                  ) : (
                    <NumberTicker value={analytics.totalSaved} />
                  )}
                  <LinkButtonAnimated>
                    <Link href={"/job-seeker/saved-jobs"} className="text-sm">
                      View Saved Jobs
                    </Link>
                  </LinkButtonAnimated>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion Card */}
        <ProfileCompletionCard />
      </div>
    </div>
  );
};

export default TopCard;
