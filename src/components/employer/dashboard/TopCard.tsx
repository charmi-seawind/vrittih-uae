"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Briefcase, Hourglass, SquarePlus, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

import { API_CONFIG } from '@/lib/config';
interface TopCardProps {
  companyId: string;
}

const TopCard = ({ companyId }: TopCardProps) => {
  const [analytics, setAnalytics] = useState({
    jobCreated: 0,
    activeJobs: 0,
    featuredJobs: 0,
    totalApplicants: 0,
    pendingApplicants: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_CONFIG.API_URL}/employer/${companyId}/dashboard-stats`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setAnalytics({
            jobCreated: data.data?.jobCreated ?? 0,
            activeJobs: data.data?.activeJobs ?? 0,
            featuredJobs: data.data?.featuredJobs ?? 0,
            totalApplicants: data.data?.totalApplicants ?? 0,
            pendingApplicants: data.data?.pendingApplicants ?? 0
          });
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchData();
    }
  }, [companyId]);

  const renderValue = (value: number) => {
    if (isLoading) {
      return <Skeleton className="w-[35px] h-[35px]" />;
    }
    return value === 0 ? <span>0</span> : <NumberTicker value={value} />;
  };

  return (
    <div className="mt-5 flex flex-col">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Jobs Created
            </CardTitle>
            <SquarePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {renderValue(analytics.jobCreated)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Jobs Now
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {renderValue(analytics.activeJobs)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {renderValue(analytics.totalApplicants)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Jobs
            </CardTitle>
            <span className="h-4 w-4 text-yellow-500">⭐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {renderValue(analytics.featuredJobs)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applicants
            </CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {renderValue(analytics.pendingApplicants)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TopCard;
