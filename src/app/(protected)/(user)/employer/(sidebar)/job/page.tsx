"use client";

import { employerJobsColumn } from "@/columns/employer-jobs-column";
import SidebarContainer from "@/components/Global/SidebarContainer";
import PostJobButton from "@/components/Job/PostJobButton";
import EmployerJobTable from "@/components/Table/EmployerJobTable";
import { useEmployerJobs } from "@/hooks/query-hooks/useEmployerJobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Briefcase, Users, TrendingUp, AlertCircle } from "lucide-react";

const JobListPage = () => {
  const { data: jobsData, isLoading, error, refetch } = useEmployerJobs();
  
  const jobs = jobsData?.body?.jobs || [];
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalApplications = jobs.reduce((acc, job) => acc + Math.floor(Math.random() * 50), 0); // Mock data

  if (isLoading) {
    return (
      <SidebarContainer>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Table Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarContainer>
    );
  }

  if (error) {
    return (
      <SidebarContainer>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all your job postings</p>
            </div>
            <PostJobButton canCreate={true} />
          </div>
          
          {/* Error State */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Jobs</h3>
              <p className="text-gray-600 text-center mb-4">{error.message}</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600 mt-1">Manage and track all your job postings</p>
          </div>
          <PostJobButton canCreate={true} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
              <Badge variant="secondary" className="mt-2">
                {activeJobs} Active
              </Badge>
            </CardContent>
          </Card> */}

          {/* <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalApplications}</div>
              <Badge variant="outline" className="mt-2 text-green-600">
                +12% this week
              </Badge>
            </CardContent>
          </Card> */}

          {/* <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg. Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0}
              </div>
              <Badge variant="outline" className="mt-2 text-purple-600">
                per job
              </Badge>
            </CardContent>
          </Card> */}
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              All Jobs ({jobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {jobs.length > 0 ? (
              <EmployerJobTable columns={employerJobsColumn} data={jobs} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
                <p className="text-gray-600 text-center mb-4">Start by creating your first job posting to attract candidates</p>
                <PostJobButton canCreate={true} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarContainer>
  );
};

export default JobListPage;
