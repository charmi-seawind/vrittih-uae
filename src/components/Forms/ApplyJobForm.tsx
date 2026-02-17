import VideoUpload from "../VideoUpload/VideoUpload";
import FileUpload from "../VideoUpload/FileUpload";

// 🟠 Type imports commented out
// import { JobDataBrowse, JobDataDescription } from "@/lib/prisma-types/Job";
// import { JobSeekerProfileApplication } from "@/lib/prisma-types/JobSeekerProfile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const ApplyJobSchema = z.object({
  resumeId: z.string().optional(),
  coverLetter: z.string().optional(),
  jobSeekerId: z.string().min(1, "Job seeker ID is required"),
  jobId: z.string().min(1, "Job ID is required"),
  customFields: z.record(z.any()).optional(),
});

type ApplyJobSchemaType = z.infer<typeof ApplyJobSchema>;
import { ResponsiveModalFooter } from "../ui/responsive-dailog";
import LoadingButton from "../ui/loading-button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
// 🟠 API imports commented out
// import { createJobApplication } from "@/actions/job/applications/createJobApplication";
import { toast } from "sonner";
import { jobsAPI } from "@/services/api";
import { useSubscription } from "@/hooks/useSubscription";
// import { useQueryClient } from "react-query";
interface ApplyJobFormProps {
  jobData: any; // Changed from JobDataBrowse | JobDataDescription
  jobSeekerProfile: any; // Changed from JobSeekerProfileApplication
  setOpenModal: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  loading: boolean;
}
const ApplyJobForm = ({
  jobData,
  jobSeekerProfile,
  setOpenModal,
  setLoading,
  loading,
}: ApplyJobFormProps) => {
  const { canApplyToJob, getRemainingApplications } = useSubscription();
  const createdResume = jobSeekerProfile.JOB_SEEKER?.createdResumes || [];
  const uploadedResume = jobSeekerProfile.JOB_SEEKER?.uploadedResumes || [];
  const userResume = createdResume.concat(uploadedResume);

  const customFields = jobData.custom_form_fields || [];
  const customFieldDefaults = customFields.reduce((acc: any, field: any) => {
    if (field.type === 'checkbox') {
      acc[field.id] = [];
    } else {
      acc[field.id] = '';
    }
    return acc;
  }, {});

  // Track video and file uploads
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({});

  const form = useForm<ApplyJobSchemaType>({
    resolver: zodResolver(ApplyJobSchema),
    defaultValues: {
      resumeId: "",
      coverLetter: "",
      jobSeekerId: jobSeekerProfile.JOB_SEEKER?.id,
      jobId: jobData.id,
      customFields: customFieldDefaults,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    const handleVideoUploaded = (event: any) => {
      const { fieldId, videoUrl } = event.detail;
      setUploadedFiles(prev => {
        const updated = { ...prev, [fieldId]: videoUrl };
        return updated;
      });
      form.setValue(`customFields.${fieldId}`, videoUrl);
    };

    const handleFileUploaded = (event: any) => {
      const { fieldId, fileUrl } = event.detail;
      setUploadedFiles(prev => {
        const updated = { ...prev, [fieldId]: fileUrl };
        return updated;
      });
      form.setValue(`customFields.${fieldId}`, fileUrl);
    };

    window.addEventListener('videoUploaded', handleVideoUploaded);
    window.addEventListener('fileUploaded', handleFileUploaded);

    return () => {
      window.removeEventListener('videoUploaded', handleVideoUploaded);
      window.removeEventListener('fileUploaded', handleFileUploaded);
    };
  }, [form]);
  // 🟠 API code commented out
  // const queryClient = useQueryClient();
  const handleApplicationSubmit = async (data: ApplyJobSchemaType) => {
    if (!canApplyToJob()) {
      toast.error(`Application limit reached. You have ${getRemainingApplications()} applications remaining.`);
      return;
    }
    
    if (jobData.resumeRequired && !data.resumeId) {
      form.setError("resumeId", {
        type: "manual",
        message: "Please select a resume to continue",
      });
      return;
    }

    // Validate required custom fields
    let hasCustomFieldErrors = false;
    customFields.forEach((field: any) => {
      if (field.required) {
        if (field.type === 'video' || field.type === 'file') {
          if (!uploadedFiles[field.id]) {
            form.setError(`customFields.${field.id}`, {
              type: "manual",
              message: `${field.label} is required`,
            });
            hasCustomFieldErrors = true;
          }
        } else if (field.type === 'checkbox') {
          const values = data.customFields?.[field.id] as string[];
          if (!values || values.length === 0) {
            form.setError(`customFields.${field.id}`, {
              type: "manual",
              message: `${field.label} is required`,
            });
            hasCustomFieldErrors = true;
          }
        } else if (!data.customFields || !data.customFields[field.id]) {
          form.setError(`customFields.${field.id}`, {
            type: "manual",
            message: `${field.label} is required`,
          });
          hasCustomFieldErrors = true;
        }
      }
    });

    if (hasCustomFieldErrors) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Merge uploaded files with custom form data
      const mergedCustomFields = {
        ...data.customFields,
        ...uploadedFiles,
        resume_id: data.resumeId
      };
      
      await jobsAPI.applyForJob(data.jobId, data.coverLetter, mergedCustomFields);
      toast.success("Application submitted successfully!", { id: "apply-job" });
      setOpenModal(false);
      // queryClient.invalidateQueries("jobSeekerProfile");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: "apply-job" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(handleApplicationSubmit)}
      >
        <FormField
          control={form.control}
          name="resumeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base font-medium">
                Select Resume{" "}
                <span className="text-xs font-semibold text-muted-foreground">
                  ({jobData.resumeRequired ? "Required" : "Optional"})
                </span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 sm:h-12 text-base">
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userResume.length <= 0 ? (
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
                      {userResume.map((resume) => (
                        <SelectItem
                          className="py-2"
                          key={resume.id}
                          value={resume.id}
                        >
                          {resume.title || "Untitled Resume"}{" "}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>

              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base font-medium">
                Cover Letter
                <span className="text-xs font-semibold text-muted-foreground ml-1">
                  (Optional)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief cover letter explaining why you're interested in this position..."
                  className="min-h-[100px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        {/* Custom Form Fields */}
        {customFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            {customFields.map((field: any) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`customFields.${field.id}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                      {field.type === 'textarea' ? (
                        <Textarea
                          placeholder={field.placeholder || ''}
                          className="min-h-[80px] text-base"
                          {...formField}
                        />
                      ) : field.type === 'select' ? (
                        <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                          <SelectTrigger className="h-11 sm:h-12 text-base">
                            <SelectValue placeholder={field.placeholder || 'Select an option'} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option: string, index: number) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'radio' ? (
                        <div className="space-y-2">
                          {field.options?.map((option: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="radio"
                                id={`${field.id}_${index}`}
                                name={field.id}
                                value={option}
                                checked={formField.value === option}
                                onChange={(e) => formField.onChange(e.target.value)}
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
                                checked={((formField.value as string[]) || []).includes(option)}
                                onChange={(e) => {
                                  const currentValues = (formField.value as string[]) || [];
                                  if (e.target.checked) {
                                    formField.onChange([...currentValues, option]);
                                  } else {
                                    formField.onChange(currentValues.filter(v => v !== option));
                                  }
                                }}
                                className="rounded"
                              />
                              <label htmlFor={`${field.id}_${index}`} className="text-sm cursor-pointer">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : field.type === 'video' ? (
                        <VideoUpload
                          fieldId={field.id}
                          fieldLabel={field.label}
                          required={field.required}
                          onVideoUploaded={() => {}} // Dummy function since we use events
                          jobId={jobData.id}
                        />
                      ) : field.type === 'file' ? (
                        <FileUpload
                          fieldId={field.id}
                          fieldLabel={field.label}
                          required={field.required}
                          onFileUploaded={() => {}} // Dummy function since we use events
                          jobId={jobData.id}
                        />
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder || ''}
                          className="h-11 sm:h-12 text-base"
                          {...formField}
                        />
                      )}
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            disabled={loading}
            onClick={() => setOpenModal(false)}
            className="flex-1"
            variant={"secondary"}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            showIconOnly
            loading={loading}
            className="flex-1"
          >
            Apply
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
export default ApplyJobForm;
