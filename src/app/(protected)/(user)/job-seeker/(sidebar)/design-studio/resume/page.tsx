"use client";

import { useState, useRef } from "react";
import CreateNewResumeButton from "@/components/Resume/CreateNewResumeButton";
import CreatedResumeCard from "@/components/Resume/CreatedResumeCard";
import UploadResumeButton from "@/components/Resume/UploadResumeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Eye, X, BarChart3, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useResumes, useUploadCV, usePreviewResume } from "@/hooks/query-hooks/useResumes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { API_CONFIG } from "@/lib/config";
import { useSubscription } from "@/hooks/useSubscription";
import { useATSAnalysis } from "@/hooks/query-hooks/useATSAnalysis";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ResumeStudioPage = () => {
  const { data: resumesData, isLoading } = useResumes();
  const { data: subscription, isLoading: subscriptionLoading } = useSubscription();

  const atsAnalysis = useATSAnalysis();
  const [previewingResumeId, setPreviewingResumeId] = useState<string | null>(null);
  const [analyzingResumeId, setAnalyzingResumeId] = useState<string | null>(null);
  const [atsResults, setAtsResults] = useState<{[key: string]: any}>({});
  
  const resumes = resumesData?.data?.resumes || [];
  
  // Check if user has active subscription
  const hasActiveSubscription = subscription?.status === 'active';
  const canCreate = hasActiveSubscription;
  
  // Get CV upload limits from plan features (backend structure: subscription.plan.features)
  const planFeatures = subscription?.plan?.features || subscription?.features || {};
  const maxCVUploads = planFeatures.cv_uploads || 10;
  const currentCVCount = resumes.length;
  const canUpload = currentCVCount < maxCVUploads;
  const remainingUploads = Math.max(0, maxCVUploads - currentCVCount);

  const handleATSAnalysis = async (resumeId: string) => {
    setAnalyzingResumeId(resumeId);
    try {
      const result = await atsAnalysis.mutateAsync(resumeId);
      setAtsResults(prev => ({ ...prev, [resumeId]: result }));
      toast({ title: "ATS analysis completed successfully" });
    } catch (error) {
      toast({ title: "Failed to analyze resume", variant: "destructive" });
    } finally {
      setAnalyzingResumeId(null);
    }
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getATSScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertCircle;
    return XCircle;
  };

  // Show loading state
  if (subscriptionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Show subscription required message
  if (!hasActiveSubscription) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Subscription Required</h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            You need an active subscription to access the Resume Studio. Please upgrade your plan to continue.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/job-seeker/upgrade-plans'}>
            Upgrade Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Studio</h1>
          <p className="text-muted-foreground">
            Create and manage your professional resumes
          </p>
        </div>
        <CreateNewResumeButton canCreate={canCreate} />
      </div>

      {/* Upload CV Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <UploadResumeButton canUpload={canUpload} remainingUploads={remainingUploads} />
            <p className="text-sm text-muted-foreground">
              {remainingUploads} CV uploads remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resume Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resumes.length > 0 ? (
        <div className="grid gap-6 h-full md:grid-cols-2 lg:grid-cols-1">
          {resumes.map((resume: any) => (
            <Card key={resume.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{resume.title || resume.filename || "Resume"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : new Date(resume.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                    {resume.ats_score && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={getATSScoreColor(resume.ats_score)}>
                          <BarChart3 className="h-3 w-3 mr-1" />
                          ATS Score: {resume.ats_score}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  {resume.ats_score && (
                    <div className="flex items-center">
                      {(() => {
                        const Icon = getATSScoreIcon(resume.ats_score);
                        return <Icon className={`h-5 w-5 ${getATSScoreColor(resume.ats_score)}`} />;
                      })()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (previewingResumeId === resume.id) {
                        setPreviewingResumeId(null);
                      } else {
                        setPreviewingResumeId(resume.id);
                      }
                    }}
                  >
                    {previewingResumeId === resume.id ? (
                      <><X className="h-4 w-4 mr-1" />Close</>
                    ) : (
                      <><Eye className="h-4 w-4 mr-1" />Preview</>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleATSAnalysis(resume.id)}
                    disabled={analyzingResumeId === resume.id}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {analyzingResumeId === resume.id ? "Analyzing..." : "ATS Score"}
                  </Button>

                </div>
                {previewingResumeId === resume.id && (
                  <div className="mt-4 border h-full rounded-lg overflow-hidden">
                    <iframe
                      src={(() => {
                        const token = localStorage.getItem('token');
                        return `${API_CONFIG.API_URL}/file/resume/${resume.id}?token=${token}`;
                      })()}
                      className="w-full h-96"
                      title="Resume Preview"
                      onError={() => {
                        toast({ title: "Failed to load resume preview", variant: "destructive" });
                      }}
                    />
                  </div>
                )}
                {atsResults[resume.id] && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      ATS Analysis Results (Score: {atsResults[resume.id].atsScore}%)
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm text-blue-700 mb-2">📋 Recommendations:</h5>
                        <ul className="text-sm space-y-1">
                          {atsResults[resume.id].recommendations?.map((rec: string, idx: number) => (
                            <li key={idx} className="text-blue-600 flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6" />
            </div>
            <CardTitle>No resumes yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Upload your first resume to get started
            </p>
            <UploadResumeButton canUpload={canUpload} remainingUploads={remainingUploads} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeStudioPage;
