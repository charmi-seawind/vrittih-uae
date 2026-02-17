"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Mail, Phone, Calendar, Download, User, MapPin, Clock, FileText, Star, Search, ChevronLeft, ChevronRight, Users2, Building2, Briefcase, DollarSign, GraduationCap, Languages, MapPin as LocationIcon, Calendar as CalendarIcon, Info, CheckCircle, XCircle, Sparkles, TrendingUp, Award, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useJobApplications } from "@/hooks/query-hooks/useJobApplications";
import { useEmployerJobs } from "@/hooks/query-hooks/useEmployerJobs";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { employerAPI } from '@/services/api';
import { toast } from 'sonner';
import ApplicationActions from "@/components/employer/ApplicationActions";
import { planAPI } from '@/services/planAPI';

interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  cover_letter?: string;
  resume_url?: string;
  resume_id?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  candidate: {
    id: string;
    full_name: string;
    email: string;
  };
}

const ApplicantsPage = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const queryClient = useQueryClient();
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
  
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useEmployerJobs();
  
  // Use different queries based on whether "all" is selected or a specific job
  const { data: allApplicationsData, isLoading: allLoading, error: allError } = useQuery({
    queryKey: ['all-applications', page],
    queryFn: () => employerAPI.getAllApplications(page, 10),
    enabled: selectedJobId === "all",
    staleTime: 2 * 60 * 1000,
  });
  
  const { data: jobApplicationsData, isLoading: jobLoading, error: jobError } = useJobApplications(
    selectedJobId && selectedJobId !== "all" ? selectedJobId : "", 
    page, 
    10
  );
  
  // Use the appropriate data based on selection
  const applicationsData = selectedJobId === "all" ? allApplicationsData : jobApplicationsData;
  const loading = selectedJobId === "all" ? allLoading : jobLoading;
  const applicationsError = selectedJobId === "all" ? allError : jobError;
  
  const allApplications = applicationsData?.applications || applicationsData?.body?.applications || [];
  const totalApplications = applicationsData?.body?.total || applicationsData?.total || 0;
  const totalPages = Math.ceil(totalApplications / 10);
  const jobs = (jobsData as any)?.data?.jobs || (jobsData as any)?.body?.jobs || (jobsData as any)?.jobs || [];
  
  
  const applications = allApplications.filter((app: Application) => {
    const matchesSearch = searchTerm === "" || 
      (app.candidate?.full_name && app.candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.candidate?.email && app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  React.useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId("all");
    }
  }, [jobs, selectedJobId]);

  React.useEffect(() => {
    if (selectedJobId) {
      setPage(1);
    }
  }, [selectedJobId]);

  React.useEffect(() => {
    setPage(1);
  }, [statusFilter, searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      reviewed: { color: "bg-blue-100 text-blue-800", icon: Eye },
      shortlisted: { color: "bg-green-100 text-green-800", icon: Star },
      rejected: { color: "bg-red-100 text-red-800", icon: FileText },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: "bg-gray-100 text-gray-800", icon: FileText };
    
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'NA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // AI Analysis Mutation
  const analyzeApplicationsMutation = useMutation({
    mutationFn: (jobId: string) => employerAPI.analyzeApplications(jobId),
    onSuccess: (data) => {
      if (data.success) {
        setAnalysisResult(data.analysis);
        setShowAnalysisDialog(true);
        toast.success('Analysis completed successfully!');
      } else {
        toast.error(data.message || 'No applications to analyze');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to analyze applications');
    },
  });

  const handleAnalyzeApplications = () => {
    if (!selectedJobId || selectedJobId === 'all') {
      toast.error('Please select a specific job to analyze');
      return;
    }
    if (totalApplications === 0) {
      toast.error('No applications to analyze for this job');
      return;
    }
    analyzeApplicationsMutation.mutate(selectedJobId);
  };

  if (loadingSubscription) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (subscriptionStatus === 'pending') {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-16 h-16 text-yellow-600 mb-4" />
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">
            Payment Verification Pending
          </h3>
          <p className="text-yellow-700 text-center mb-4 max-w-md">
            Your payment is currently being verified. You will be able to view applicants once your payment is verified.
          </p>
          <p className="text-sm text-yellow-600">
            This usually takes 24-48 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Applicants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage candidates for your job positions</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedJobId && selectedJobId !== 'all' && totalApplications > 0 && (
            <Button
              onClick={handleAnalyzeApplications}
              disabled={analyzeApplicationsMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {analyzeApplicationsMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          )}
          <div className="w-80">
            <Select value={selectedJobId} onValueChange={(value) => {
              setSelectedJobId(value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder={jobs.length > 0 ? "Select a job to view applicants" : "No jobs available"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.length > 0 ? jobs.map((job: any) => (
                  <SelectItem key={job.id} value={job.id.toString()}>
                    {job.job_title} - {job.company_name}
                  </SelectItem>
                )) : (
                  <SelectItem value="no-jobs" disabled>
                    No jobs found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {selectedJobId && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users2 className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">{totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-700">{allApplications.filter((app: Application) => app.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Eye className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Reviewed</p>
                  <p className="text-xl font-bold text-blue-700">{allApplications.filter((app: Application) => app.status === 'reviewed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Shortlisted</p>
                  <p className="text-xl font-bold text-green-700">{allApplications.filter((app: Application) => app.status === 'shortlisted').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Rejected</p>
                  <p className="text-xl font-bold text-red-700">{allApplications.filter((app: Application) => app.status === 'rejected').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

     

      {/* Applications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Applications</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search candidates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(loading || jobsLoading) ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading applications...</span>
            </div>
          ) : !selectedJobId ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Job</h3>
              <p className="text-gray-600">Please select a job from the dropdown above to view its applicants.</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">No candidates have applied for this job position.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application: Application) => {
                const selectedJob = jobs.find((job: any) => job.id.toString() === selectedJobId);
                return (
                  <div key={application.id} className={`bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all duration-300 ${
                    selectedJob?.is_featured ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-16 w-16 border-3 ">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
                            {getInitials(application.candidate?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{application.candidate?.full_name}</h3>
                            {getStatusBadge(application.status)}
                            {selectedJob?.is_featured && (
                              <Badge className="bg-yellow-500 text-white font-semibold">
                                <Star className="h-3 w-3 mr-1" />
                                Featured Job
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mb-3">
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              <Briefcase className="h-3 w-3 mr-1" />
                              Applied for: {application.job?.job_title || selectedJob?.job_title || 'Unknown Position'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-normal text-gray-900 text-sm">{application.candidate?.email}</p>
                              </div>
                            </div>
                            
                          
                            
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-orange-600" />
                              <div>
                                <p className="text-sm text-gray-500">Applied Date</p>
                                <p className="font-normal text-sm text-gray-900">{formatDate(application.createdAt)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-red-600" />
                              <div>
                                <p className="text-sm text-gray-500">Last Updated</p>
                                <p className="font-normal text-sm text-gray-900">{formatDate(application.updatedAt)}</p>
                              </div>
                            </div>
                            

                          </div>
                          
                          {application.cover_letter && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500 mb-1">Cover Letter</p>
                              <p className="text-sm text-gray-700">{application.cover_letter}</p>
                            </div>
                          )}
                          
                       
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">


   <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Candidate Details - {application.candidate?.full_name}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <User className="h-4 w-4 text-blue-600" />
                                      <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-semibold">{application.candidate?.full_name}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Mail className="h-4 w-4 text-green-600" />
                                      <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold">{application.candidate?.email}</p>
                                      </div>
                                    </div>
                                    {application.candidate?.mobile && (
                                      <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-blue-600" />
                                        <div>
                                          <p className="text-sm text-gray-500">Phone</p>
                                          <p className="font-semibold">{application.candidate?.mobile}</p>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                      <Calendar className="h-4 w-4 text-orange-600" />
                                      <div>
                                        <p className="text-sm text-gray-500">Applied Date</p>
                                        <p className="font-semibold">{formatDate(application.createdAt)}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <FileText className="h-4 w-4 text-purple-600" />
                                      <div>
                                        <p className="text-sm text-gray-500">Application Status</p>
                                        <div className="mt-1">{getStatusBadge(application.status)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h3 className="font-semibold text-lg border-b pb-2">Application Details</h3>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Clock className="h-4 w-4 text-orange-500" />
                                      <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="font-semibold">{formatDate(application.updatedAt)}</p>
                                      </div>
                                    </div>
                                    {application.resume_id && (
                                      <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-red-500" />
                                        <div>
                                          <p className="text-sm text-gray-500">Resume ID</p>
                                          <p className="font-semibold">#{application.resume_id}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {application.cover_letter && (
                                <div className="mt-6">
                                  <h3 className="font-semibold text-lg border-b pb-2 mb-4">Cover Letter</h3>
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">{application.cover_letter}</p>
                                  </div>
                                </div>
                              )}
                              
                              {application.custom_form_responses && Object.keys(application.custom_form_responses).length > 0 && (
                                <div className="mt-6">
                                  <h3 className="font-semibold text-lg border-b pb-2 mb-4">Application Form Responses</h3>
                                  <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                                    {Object.entries(application.custom_form_responses).map(([fieldId, value]) => {
                                      // Find the field label from application's job custom form fields
                                      const field = application.job?.custom_form_fields?.find((f: any) => f.id === fieldId);
                                      const fieldLabel = field?.label || fieldId;
                                      const fieldType = field?.type || 'text';
                                      
                                      return (
                                        <div key={fieldId} className="border-b border-blue-200 pb-2 last:border-b-0">
                                          <p className="text-sm font-medium text-blue-800 mb-1">{fieldLabel}:</p>
                                          {(fieldType === 'video' || fieldId.toLowerCase().includes('video')) && value ? (
                                            <div className="flex items-center gap-2">
                                              <Dialog>
                                                <DialogTrigger asChild>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-2"
                                                  >
                                                    <Eye className="h-4 w-4" />
                                                    View Video
                                                  </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl max-h-[80vh]">
                                                  <DialogHeader>
                                                    <DialogTitle>Video Preview - {fieldLabel}</DialogTitle>
                                                  </DialogHeader>
                                                  <div className="mt-4 border h-full rounded-lg overflow-hidden">
                                                    <video
                                                      src={`${process.env.NEXT_PUBLIC_API_URL}/api/file/view/${encodeURIComponent(String(value))}?action=preview&token=${localStorage.getItem('token')}`}
                                                      className="w-full h-96"
                                                      controls
                                                      title="Video Preview"
                                                    />
                                                  </div>
                                                </DialogContent>
                                              </Dialog>
                                              <span className="text-xs text-gray-500">Video uploaded</span>
                                            </div>
                                          ) : (fieldType === 'file' || fieldId.toLowerCase().includes('file')) && value ? (
                                            <div className="flex items-center gap-2">
                                              <Dialog>
                                                <DialogTrigger asChild>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-2"
                                                  >
                                                    <Eye className="h-4 w-4" />
                                                    View File
                                                  </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl max-h-[80vh]">
                                                  <DialogHeader>
                                                    <DialogTitle>File Preview - {fieldLabel}</DialogTitle>
                                                  </DialogHeader>
                                                  <div className="mt-4 border h-full rounded-lg overflow-hidden">
                                                    {(() => {
                                                      const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/view/${encodeURIComponent(String(value))}?action=preview&token=${localStorage.getItem('token')}`;
                                                      const fileName = String(value).toLowerCase();
                                                      
                                                      if (fileName.endsWith('.pdf')) {
                                                        return (
                                                          <iframe
                                                            src={fileUrl}
                                                            className="w-full h-96"
                                                            title="PDF Preview"
                                                          />
                                                        );
                                                      } else {
                                                        return (
                                                          <div className="flex flex-col items-center justify-center h-96 space-y-4">
                                                            <FileText className="h-16 w-16 text-gray-400" />
                                                            <div className="text-center">
                                                              <p className="text-lg font-medium text-gray-900 mb-2">Document Preview</p>
                                                              <p className="text-sm text-gray-600 mb-4">Click below to download and view the document</p>
                                                              <div className="flex justify-center">
                                                                <Button
                                                                  onClick={() => window.open(fileUrl.replace('action=preview', 'action=download'), '_blank')}
                                                                  className="flex items-center gap-2"
                                                                >
                                                                  <Download className="h-4 w-4" />
                                                                  Download File
                                                                </Button>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    })()
                                                    }
                                                  </div>
                                                </DialogContent>
                                              </Dialog>
                                              <span className="text-xs text-gray-500">File uploaded</span>
                                            </div>
                                          ) : (
                                            <p className="text-gray-700">{String(value)}</p>
                                          )}
                                        </div>
                                      );
                                    })}
                                    
                                    {/* Show video/file fields that might exist in job but not in responses */}
                                    {application.job?.custom_form_fields?.filter((field: any) => 
                                      (field.type === 'video' || field.type === 'file') && 
                                      !application.custom_form_responses[field.id]
                                    ).map((field: any) => (
                                      <div key={field.id} className="border-b border-blue-200 pb-2 last:border-b-0">
                                        <p className="text-sm font-medium text-blue-800 mb-1">{field.label}:</p>
                                        <p className="text-gray-500 text-sm italic">No {field.type} uploaded</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
{application.resume_id && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Preview Resume
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>Resume Preview - {application.candidate?.full_name}</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 border h-full rounded-lg overflow-hidden">
                                  <iframe
                                    src={(() => {
                                      const token = localStorage.getItem('token');
                                      return `${process.env.NEXT_PUBLIC_API_URL}/api/file/resume/${application.resume_id}?token=${token}`;
                                    })()}
                                    className="w-full h-96"
                                    title="Resume Preview"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>

                        <ApplicationActions 
                          applicationId={application.id}
                          currentStatus={application.status}
                        />
                     
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {applications.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {applications.length} of {totalApplications} applications
                {statusFilter !== "all" && (
                  <span className="ml-2 text-blue-600 font-medium">
                    (filtered by {statusFilter})
                  </span>
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-purple-600" />
              AI Analysis Results
            </DialogTitle>
          </DialogHeader>
          
          {analysisResult && (
            <div className="space-y-6">
              {/* Best Candidate Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-900">Best Candidate</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{analysisResult.bestCandidate.name}</h4>
                      <p className="text-sm text-gray-600">{analysisResult.bestCandidate.email}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600">{analysisResult.bestCandidate.matchScore}%</div>
                      <p className="text-sm text-gray-600">Match Score</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">AI Reasoning:</p>
                    <p className="text-gray-800">{analysisResult.bestCandidate.reasoning}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Strengths
                      </p>
                      <ul className="space-y-1">
                        {analysisResult.bestCandidate.strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {analysisResult.bestCandidate.weaknesses?.length > 0 && (
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1">
                          <Info className="h-4 w-4" /> Areas to Consider
                        </p>
                        <ul className="space-y-1">
                          {analysisResult.bestCandidate.weaknesses.map((weakness: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-orange-600 mt-1">•</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {analysisResult.bestCandidate.keyHighlights?.length > 0 && (
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-1">
                        <Star className="h-4 w-4" /> Key Highlights
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.bestCandidate.keyHighlights.map((highlight: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800">{highlight}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Top Candidates Ranking */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Top Candidates Ranking</h3>
                </div>
                
                <div className="space-y-3">
                  {analysisResult.topCandidates.map((candidate: any) => (
                    <div key={candidate.rank} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {candidate.rank}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.summary}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{candidate.matchScore}%</div>
                          <p className="text-xs text-gray-500">Match</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Analysis Insights */}
              {analysisResult.analysisInsights && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Analysis Insights</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Candidates Analyzed</p>
                      <p className="text-2xl font-bold text-gray-900">{analysisResult.analysisInsights.totalCandidates}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Match Score</p>
                      <p className="text-2xl font-bold text-gray-900">{analysisResult.analysisInsights.averageMatchScore}%</p>
                    </div>
                  </div>
                  
                  {analysisResult.analysisInsights.topSkillsFound?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Top Skills Found:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysisInsights.topSkillsFound.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.analysisInsights.commonGaps?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Common Gaps:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysisInsights.commonGaps.map((gap: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{gap}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-xs text-gray-500 text-center">
                Analysis generated at {new Date(analysisResult.analyzedAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsPage;