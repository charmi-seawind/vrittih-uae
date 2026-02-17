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
import { RefreshCw, Briefcase, Users, TrendingUp, AlertCircle, Plus, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useJobManagement } from "@/hooks/useJobManagement";
import JobDetailsModal from "@/components/employer/JobDetailsModal";
import { planAPI } from "@/services/planAPI";

const AllJobPage = () => {
  const { data: jobsData, isLoading, error, refetch } = useEmployerJobs();
  const { getRemainingFeaturedJobs, subscription } = useJobManagement();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await planAPI.getCurrentSubscription().catch(() => null);
        if (response?.data?.status) {
          setSubscriptionStatus(response.data.status);
        }
      } finally {
        setLoadingSubscription(false);
      }
    };
    checkSubscription();
  }, []);

  // Listen for view job events from table
  useEffect(() => {
    const handleViewJob = (event: any) => {
      setSelectedJob(event.detail);
      setIsModalOpen(true);
    };
    
    window.addEventListener('viewJob', handleViewJob);
    return () => window.removeEventListener('viewJob', handleViewJob);
  }, []);
  
  const jobs = jobsData?.data?.jobs || jobsData?.body?.jobs || [];
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const featuredJobs = jobs.filter(job => job.is_featured && job.status === 'active').length;
  const remainingFeaturedJobs = getRemainingFeaturedJobs();
  const totalApplications = jobs.reduce((acc, job) => acc + Math.floor(Math.random() * 50), 0);

  if (isLoading || loadingSubscription) {
    return (
      <SidebarContainer>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
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

  if (subscriptionStatus === 'pending') {
    return (
      <SidebarContainer>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              Payment Verification Pending
            </h3>
            <p className="text-yellow-700 text-center mb-4 max-w-md">
              Your payment is currently being verified. You will be able to access job management once your payment is verified.
            </p>
            <p className="text-sm text-yellow-600">
              This usually takes 24-48 hours.
            </p>
          </CardContent>
        </Card>
      </SidebarContainer>
    );
  }

  if (error) {
    return (
      <SidebarContainer>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Active Jobs</h1>
              <p className="text-gray-600 mt-1">View and manage all your active job postings</p>
            </div>
            <PostJobButton canCreate={true} />
          </div>
          
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Active Jobs</h1>
              <p className="text-gray-600 mt-1">View and manage all your active job postings</p>
            </div>
          </div>
          <PostJobButton canCreate={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
              <Badge variant="secondary" className="mt-2">
                {activeJobs} Active
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{featuredJobs}</div>
              <Badge variant="outline" className="mt-2 text-yellow-600 border-yellow-200">
                {remainingFeaturedJobs === -1 ? 'Unlimited' : `${remainingFeaturedJobs} remaining`}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Plan Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">
                {subscription?.planName || subscription?.plan?.name || 'Free Plan'}
              </div>
              {remainingFeaturedJobs === 0 && (
                <Badge variant="destructive" className="mt-2">
                  Upgrade to promote jobs
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                All Jobs ({jobs.length})
              </div>
              {jobs.length > 0 && (
                <Button onClick={refetch} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {jobs.length > 0 ? (
              <EmployerJobTable 
                columns={employerJobsColumn} 
                data={jobs}
                onViewJob={(job) => {
                  setSelectedJob(job);
                  setIsModalOpen(true);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Briefcase className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Start by creating your first job posting to attract qualified candidates and grow your team
                </p>
                <PostJobButton canCreate={true} />
              </div>
            )}
          </CardContent>
        </Card>
        
        <JobDetailsModal 
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
        />
      </div>
    </SidebarContainer>
  );
};

export default AllJobPage;