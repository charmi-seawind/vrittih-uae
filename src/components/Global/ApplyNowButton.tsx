"use client";
import { useState, useEffect } from "react";
import { Button, ButtonProps } from "../ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "../ui/responsive-dailog";
// 🟠 API hook commented out
// import { getJobSeekerProfile } from "@/hooks/query-hooks/getJobSeekerProfile";
import { Skeleton } from "../ui/skeleton";
import { cn, getTimeDifference, jobSeekerProfileStatus } from "@/lib/utils";
// import { JobDataBrowse, JobDataDescription } from "@/lib/prisma-types/Job";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, UserCircle, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import ApplyJobForm from "../Forms/ApplyJobForm";
// import { JobSeekerProfileApplication } from "@/lib/prisma-types/JobSeekerProfile";
import Link from "next/link";
import { jobsAPI } from "@/services/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "@/hooks/useSubscription";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useResumes } from "@/hooks/query-hooks/useResumes";
import { useResumeJobMatch } from "@/hooks/query-hooks/useResumeJobMatch";
import VideoUpload from "../VideoUpload/VideoUpload";
import FileUpload from "../VideoUpload/FileUpload";
import { AppliedJobsManager } from "@/lib/appliedJobsManager";

interface ApplyNowButtonProps extends ButtonProps {
  jobData: any; // Changed from JobDataBrowse | JobDataDescription
}
const ApplyNowButton = ({ jobData, ...props }: ApplyNowButtonProps) => {
  const { canApplyToJob, getRemainingApplications } = useSubscription();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openProfileModal, setProfileModal] = useState<boolean>(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const { data: resumesData } = useResumes();
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [showMatchAnalysis, setShowMatchAnalysis] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const resumeJobMatch = useResumeJobMatch();
  const queryClient = useQueryClient();
  
  // Check localStorage on component mount
  useEffect(() => {
    const isJobApplied = jobData.hasApplied || AppliedJobsManager.hasUserApplied(jobData.id);
    setIsApplied(isJobApplied);
  }, [jobData.id, jobData.hasApplied]);
  
  // Update applied status when jobData.hasApplied changes
  useEffect(() => {
    if (jobData.hasApplied !== undefined) {
      setIsApplied(jobData.hasApplied);
    }
  }, [jobData.hasApplied]);
  
  const daysLeft = jobData.deadline ? getTimeDifference(jobData.deadline) : true;
  const hasUserApplied = isApplied;
  
  const isUserProfileCompleted = { completed: true };
  
  const handleClick = async () => {
    if (hasUserApplied) {
      return; // Do nothing if already applied
    }
    
    if (!canApplyToJob()) {
      toast.error(`Application limit reached. You have ${getRemainingApplications()} applications remaining.`);
      return;
    }
    
    if (!isUserProfileCompleted.completed) {
      setProfileModal(true);
      return;
    }

    // Check if job has custom form fields
    
    if (jobData.custom_form_fields && jobData.custom_form_fields.length > 0) {
      setOpenModal(true);
      return;
    }
    
    setOpenModal(true);
  };

  const submitApplication = async (customFormData = null) => {
    setIsApplying(true);
    try {
      let coverLetter = null;
      let resumeId = null;
      let formResponses = customFormData;
      
      // Extract resume_id and cover_letter if they exist in customFormData
      if (customFormData && typeof customFormData === 'object') {
        const { resume_id, cover_letter, ...otherResponses } = customFormData;
        coverLetter = cover_letter;
        resumeId = resume_id;
        formResponses = Object.keys(otherResponses).length > 0 ? otherResponses : null;
      }
      
      const response = await jobsAPI.applyForJob(jobData.id, coverLetter, { resume_id: resumeId, ...formResponses });
      toast.success("Applied Job!", { id: "apply-job" });
      
      // Save to localStorage using AppliedJobsManager
      AppliedJobsManager.addAppliedJob(jobData.id);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('appliedJobsUpdated'));
      
      setIsApplied(true);
      jobData.hasApplied = true;
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["browse-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      
      // Notify browse page about job application
      window.dispatchEvent(new CustomEvent('jobApplicationUpdated', { detail: { jobId: jobData.id } }));
      
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error.message || "Apply nahi ho saka", { id: "apply-job" });
    } finally {
      setIsApplying(false);
    }
  };

  const handleAnalyzeMatch = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await resumeJobMatch.mutateAsync({
        resumeId: selectedResumeId,
        jobId: jobData.id
      });
      setMatchResult(result);
      setShowMatchAnalysis(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze match');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (jobData.resumeRequired && !selectedResumeId) {
      return;
    }
    setIsApplying(true);
    
    try {
      await jobsAPI.applyForJob(jobData.id, coverLetter, { resume_id: selectedResumeId });
      toast.success("Application submitted successfully!", { id: "apply-job" });
      
      // Save to localStorage using AppliedJobsManager
      AppliedJobsManager.addAppliedJob(jobData.id);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('appliedJobsUpdated'));
      
      setIsApplied(true);
      jobData.hasApplied = true;
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["browse-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      
      setOpenModal(false);
      setSelectedResumeId("");
      setCoverLetter("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: "apply-job" });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <Button
        disabled={isApplying || (!canApplyToJob() && !hasUserApplied)}
        variant={hasUserApplied ? "outline" : "default"}
        onClick={handleClick}
        {...props}
        title={!canApplyToJob() && !hasUserApplied ? `Application limit reached. ${getRemainingApplications()} remaining.` : undefined}
      >
        {isApplying ? "Applying..." : hasUserApplied ? "Applied" : !canApplyToJob() ? "Limit Reached" : "Apply Now"}
      </Button>
      
      <ApplyModal
        open={openModal && (!jobData.custom_form_fields || jobData.custom_form_fields.length === 0)}
        setOpen={setOpenModal}
        jobData={jobData}
        resumes={resumesData?.data?.resumes || []}
        selectedResumeId={selectedResumeId}
        setSelectedResumeId={setSelectedResumeId}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        onSubmit={handleSubmitApplication}
        isSubmitting={isApplying}
        onAnalyzeMatch={handleAnalyzeMatch}
        showMatchAnalysis={showMatchAnalysis}
        matchResult={matchResult}
        isAnalyzing={isAnalyzing}
      />
      
      {jobData.custom_form_fields && jobData.custom_form_fields.length > 0 && (
        <CustomFormModal 
          open={openModal} 
          setOpen={setOpenModal}
          jobData={jobData}
          onSubmit={submitApplication}
          isSubmitting={isApplying}
          onAnalyzeMatch={handleAnalyzeMatch}
          showMatchAnalysis={showMatchAnalysis}
          matchResult={matchResult}
          isAnalyzing={isAnalyzing}
          selectedResumeId={selectedResumeId}
          setSelectedResumeId={setSelectedResumeId}
        />
      )}
      
      <CompleteProfileModal open={openProfileModal} setOpen={setProfileModal} />
    </>
  );
};
export default ApplyNowButton;
interface ApplyModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  jobData: any;
  resumes: any[];
  selectedResumeId: string;
  setSelectedResumeId: (value: string) => void;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onAnalyzeMatch: () => void;
  showMatchAnalysis: boolean;
  matchResult: any;
  isAnalyzing: boolean;
}
const ApplyModal = ({
  jobData,
  resumes,
  open,
  setOpen,
  selectedResumeId,
  setSelectedResumeId,
  coverLetter,
  setCoverLetter,
  onSubmit,
  isSubmitting,
  onAnalyzeMatch,
  showMatchAnalysis,
  matchResult,
  isAnalyzing,
}: ApplyModalProps) => {

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>
            Apply For {jobData.title || jobData.job_title || 'this position'} ?
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Complete the form below to apply for this position at{" "}
            {jobData.company?.name || jobData.company_name || 'this company'}
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <Alert className="my-3" variant={"info"}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please make sure your profile is up to date before moving ahead.
            Your data from your profile will be used to apply for this job.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium">
              Select Resume{" "}
              <span className="text-xs font-semibold text-red-500">
                (Required)
              </span>
            </label>
            <Select onValueChange={setSelectedResumeId} value={selectedResumeId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a resume" />
              </SelectTrigger>
              <SelectContent>
                {!resumes || resumes.length <= 0 ? (
                  <div className="flex flex-col items-center gap-4 text-center my-2">
                    <div className="rounded-full bg-primary/15 p-3">
                      <PlusCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium ">No resumes found</h3>
                      <p className="text-sm text-muted-foreground ">
                        You don't have any resumes yet. Create one to get
                        started.
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link href="/job-seeker/design-studio/resume">
                        Create Resume
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {resumes.map((resume) => (
                      <SelectItem
                        className="py-2"
                        key={resume.id}
                        value={resume.id.toString()}
                      >
                        {resume.title || "Untitled Resume"}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            
            {selectedResumeId && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAnalyzeMatch}
                disabled={isAnalyzing}
                className="mt-2 w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Analyzing Match...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze Resume Match
                  </>
                )}
              </Button>
            )}
          </div>
          
          {showMatchAnalysis && matchResult && (
            <div className="p-4 bg-blue-50 rounded-lg border">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Resume Match Score: {matchResult.matchScore}%
              </h4>
              <Progress value={matchResult.matchScore} className="mb-3" />
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-blue-700">Breakdown:</h5>
                {matchResult.breakdown?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span className="font-medium">{item.score} pts</span>
                  </div>
                ))}
              </div>
              
              {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-sm text-blue-700 mb-1">Recommendations:</h5>
                  <ul className="text-xs space-y-1">
                    {matchResult.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                      <li key={idx} className="text-blue-600 flex items-start gap-1">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium">
              Cover Letter{" "}
              <span className="text-xs font-semibold text-red-500">
                (Required)
              </span>
            </label>
            <Textarea
              className="mt-2 min-h-[100px]"
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
        </div>
        
        <ResponsiveModalFooter>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || !selectedResumeId || !coverLetter.trim()}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
interface CustomFormModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  jobData: any;
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
  onAnalyzeMatch: () => void;
  showMatchAnalysis: boolean;
  matchResult: any;
  isAnalyzing: boolean;
  selectedResumeId: string;
  setSelectedResumeId: (value: string) => void;
}

const CustomFormModal = ({ open, setOpen, jobData, onSubmit, isSubmitting, onAnalyzeMatch, showMatchAnalysis, matchResult, isAnalyzing, selectedResumeId, setSelectedResumeId }: CustomFormModalProps) => {
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [videoFiles, setVideoFiles] = useState<Record<string, File>>({});
  const [documentFiles, setDocumentFiles] = useState<Record<string, File>>({});
  const { data: resumesData } = useResumes();
  
  
  const resumes = resumesData?.data?.resumes || [];

  const handleInputChange = (fieldId: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = (prev[fieldId] as string[]) || [];
      if (checked) {
        return { ...prev, [fieldId]: [...currentValues, option] };
      } else {
        return { ...prev, [fieldId]: currentValues.filter(v => v !== option) };
      }
    });
  };

  const handleVideoSelected = (fieldId: string, videoFile: File | null) => {
    if (videoFile) {
      setVideoFiles(prev => ({ ...prev, [fieldId]: videoFile }));
    } else {
      setVideoFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fieldId];
        return newFiles;
      });
    }
  };

  const handleFileSelected = (fieldId: string, file: File | null) => {
    if (file) {
      setDocumentFiles(prev => ({ ...prev, [fieldId]: file }));
    } else {
      setDocumentFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fieldId];
        return newFiles;
      });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = jobData.custom_form_fields.filter((field: any) => field.required);
    const missingFields = requiredFields.filter((field: any) => {
      if (field.type === 'video') {
        return !videoFiles[field.id];
      }
      if (field.type === 'file') {
        return !documentFiles[field.id];
      }
      if (field.type === 'checkbox') {
        const values = formData[field.id] as string[];
        return !values || values.length === 0;
      }
      return !formData[field.id];
    });
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.map((f: any) => f.label).join(', ')}`);
      return;
    }
    
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }
    
    if (!coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    // Upload files first
    const uploadedVideos: Record<string, string> = {};
    const uploadedFiles: Record<string, string> = {};

    try {
      // Upload videos
      for (const [fieldId, videoFile] of Object.entries(videoFiles)) {
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('jobId', jobData.id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/upload-video`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          uploadedVideos[fieldId] = result.data.url;
        } else {
          throw new Error('Video upload failed');
        }
      }

      // Upload files
      for (const [fieldId, file] of Object.entries(documentFiles)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobId', jobData.id);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/upload-file`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          uploadedFiles[fieldId] = result.data.url;
        } else {
          throw new Error('File upload failed');
        }
      }

      // Combine all data
      const combinedData = { ...formData, ...uploadedVideos, ...uploadedFiles };
      onSubmit({ ...combinedData, resume_id: selectedResumeId, cover_letter: coverLetter });
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalContent className="max-w-2xl">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Application Form</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Please fill out the additional information required for this position.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Resume Selection */}
          <div className="space-y-2">
            <Label>Select Resume <span className="text-red-500">*</span></Label>
            <Select onValueChange={setSelectedResumeId} value={selectedResumeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a resume" />
              </SelectTrigger>
              <SelectContent>
                {!resumes || resumes.length <= 0 ? (
                  <div className="flex flex-col items-center gap-4 text-center my-2">
                    <div className="rounded-full bg-primary/15 p-3">
                      <PlusCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">No resumes found</h3>
                      <p className="text-sm text-muted-foreground">
                        You don't have any resumes yet. Create one to get started.
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link href="/job-seeker/design-studio/resume">
                        Create Resume
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {resumes.map((resume) => (
                      <SelectItem
                        className="py-2"
                        key={resume.id}
                        value={String(resume.id)}
                      >
                        {resume.title || "Untitled Resume"}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            
            {selectedResumeId && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAnalyzeMatch}
                disabled={isAnalyzing}
                className="mt-2 w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Analyzing Match...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze Resume Match
                  </>
                )}
              </Button>
            )}
          </div>
          
          {showMatchAnalysis && matchResult && (
            <div className="p-4 bg-blue-50 rounded-lg border">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Resume Match Score: {matchResult.matchScore}%
              </h4>
              <Progress value={matchResult.matchScore} className="mb-3" />
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-blue-700">Breakdown:</h5>
                {matchResult.breakdown?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span className="font-medium">{item.score} pts</span>
                  </div>
                ))}
              </div>
              
              {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-sm text-blue-700 mb-1">Recommendations:</h5>
                  <ul className="text-xs space-y-1">
                    {matchResult.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                      <li key={idx} className="text-blue-600 flex items-start gap-1">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label>Cover Letter <span className="text-red-500">*</span></Label>
            <Textarea
              className="min-h-[100px]"
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
          
          {/* Custom Form Fields */}
          {jobData.custom_form_fields.map((field: any) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <Select onValueChange={(value) => handleInputChange(field.id, value)} value={formData[field.id] || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || 'Select an option'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options && field.options.length > 0 ? (
                      field.options.map((option: string, index: number) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-options" disabled>
                        No options available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              ) : field.type === 'video' ? (
                <VideoUpload
                  fieldId={field.id}
                  fieldLabel={field.label}
                  required={field.required}
                  onVideoSelected={handleVideoSelected}
                  jobId={jobData.id}
                />
              ) : field.type === 'file' ? (
                <FileUpload
                  fieldId={field.id}
                  fieldLabel={field.label}
                  required={field.required}
                  onFileSelected={handleFileSelected}
                  jobId={jobData.id}
                />
              ) : field.type === 'radio' ? (
                <div className="space-y-2">
                  {field.options?.map((option: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`${field.id}_${index}`}
                        name={field.id}
                        value={option}
                        checked={formData[field.id] === option}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="rounded"
                      />
                      <label htmlFor={`${field.id}_${index}`} className="text-sm cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <div className="space-y-2">
                  {field.options?.map((option: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${field.id}_${index}`}
                        value={option}
                        checked={((formData[field.id] as string[]) || []).includes(option)}
                        onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor={`${field.id}_${index}`} className="text-sm cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>

        <ResponsiveModalFooter>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

interface CompleteProfileModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const CompleteProfileModal = ({ open, setOpen }: CompleteProfileModalProps) => {
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Complete Your Profile</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            You need to complete your profile before applying for jobs.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <Alert className="my-3" variant={"warning"}>
          <UserCircle className="size-5" />
          <AlertTitle className="font-bold text-lg">
            Profile Incomplete
          </AlertTitle>
          <AlertDescription>
            <div>
              <p className="text-sm  mb-3">
                We noticed your profile is not complete. To apply for jobs, you
                need to:
              </p>
              <ul className="text-sm  space-y-1 mb-3">
                <li>• Upload your resume</li>
                <li>• Complete your work experience</li>
                <li>• Add your skills</li>

                <li>• Add Education</li>
              </ul>
              <p className="text-sm ">
                A complete profile increases your chances of being noticed by
                employers.
              </p>
            </div>
          </AlertDescription>
        </Alert>
        <ResponsiveModalFooter>
          <div className="flex items-start gap-5 w-full">
            <Button
              onClick={() => setOpen(false)}
              className="flex-1"
              variant={"secondary"}
            >
              Cancel
            </Button>
            <Button asChild className="flex-1">
              <Link href="/job-seeker/profile/personal-info">
                Complete Profile
              </Link>
            </Button>
          </div>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
