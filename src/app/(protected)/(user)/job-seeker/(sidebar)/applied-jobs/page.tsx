"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Building2, Eye, Loader2, IndianRupee, Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Star } from "lucide-react";
import { useMyApplicationsInfiniteQuery } from "@/hooks/query-hooks/useMyApplicationsInfiniteQuery";
import { jobsAPI } from "@/services/api";
import { AppliedJobsManager } from "@/lib/appliedJobsManager";
import { useMemo, useState } from "react";
import JobDetailsModal from "@/components/Job/JobDetailsModal";
import ErrorBoundary from "@/components/ErrorBoundary";

interface ApiApplication {
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

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: string;
  salary?: string;
  jobType?: string;
  workLocationType?: string;
  coverLetter?: string;
}

const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 px-3 py-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "reviewed":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1 px-3 py-1">
          <Eye className="h-3 w-3" />
          Reviewed
        </Badge>
      );
    case "shortlisted":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 px-3 py-1">
          <Star className="h-3 w-3" />
          Shortlisted
        </Badge>
      );
    case "interview":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-300 flex items-center gap-1 px-3 py-1">
          <AlertCircle className="h-3 w-3" />
          Interview
        </Badge>
      );
    case "approved":
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 px-3 py-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1 px-3 py-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-300 flex items-center gap-1 px-3 py-1">
          <AlertCircle className="h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
  }
};

const JobAppliedPage = () => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMyApplicationsInfiniteQuery();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    try {
      // Find the application to get the job ID
      const application = applications.find(app => app.id === applicationId);
      const jobId = application?.jobId;

      await jobsAPI.withdrawApplication(applicationId);
      
      // Remove from localStorage applied jobs
      if (jobId) {
        AppliedJobsManager.removeAppliedJob(jobId);
      }
      
      // Refetch the applications to update the list
      refetch();
      alert('Application withdrawn successfully! You can now reapply to this job.');
    } catch (error: any) {
      alert(error.message || 'Failed to withdraw application');
    }
  };

  const handleViewDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  const applications = useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.flatMap((page) => {
      const apps = page?.applications || [];
      return apps.map((app: any): JobApplication => ({
        id: app.id,
        jobId: app.job_id,
        jobTitle: app.job?.job_title || 'Unknown Job',
        company: app.job?.company_name || 'Unknown Company',
        location: app.job?.office_address || 'Unknown Location',
        appliedDate: app.createdAt,
        status: app.status || 'pending',
        salary: app.job?.pay_amount ? `₹${app.job.pay_amount}` : undefined,
        jobType: app.job?.job_type,
        workLocationType: app.job?.work_location_type,
        coverLetter: app.cover_letter,
      }));
    });
  }, [data]);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(app => app.status?.toLowerCase() === "pending").length,
    reviewed: applications.filter(app => app.status?.toLowerCase() === "reviewed").length,
    shortlisted: applications.filter(app => app.status?.toLowerCase() === "shortlisted").length,
    rejected: applications.filter(app => app.status?.toLowerCase() === "rejected").length,
  }), [applications]);

  if (isLoading) {
    return (
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your applications...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-6 space-y-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-600">Error loading applications</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Applied Jobs</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Applications</h2>
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {application.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.location}
                          </div>
                          {application.jobType && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {application.jobType}
                            </div>
                          )}
                          {application.workLocationType && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {application.workLocationType}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <CalendarDays className="h-4 w-4" />
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {application.salary && (
                          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <IndianRupee className="h-4 w-4" />
                            {application.salary}
                          </div>
                        )}
                        {application.coverLetter && (
                          <div className="text-xs text-muted-foreground max-w-md truncate">
                            Cover Letter: {application.coverLetter}
                          </div>
                        )}
                      </div>
                      
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleWithdrawApplication(application.id)}
                        className="ml-4"
                      >
                        Withdraw Application
                      </Button> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {hasNextPage && (
            <div className="flex justify-center py-4">
              <Button 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  'Load More Applications'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {applications.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No applications yet</h3>
              <p className="text-muted-foreground">
                Start applying to jobs to see them here
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/job-seeker/jobs/browse'}>
                Browse Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Details Modal */}
      {selectedJobId && (
        <JobDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          jobId={selectedJobId}
        />
      )}
    </main>
  );
};

const WrappedJobAppliedPage = () => {
  return (
    <ErrorBoundary>
      <JobAppliedPage />
    </ErrorBoundary>
  );
};

export default WrappedJobAppliedPage;
