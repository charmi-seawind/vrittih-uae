import Link from "next/link";
import { Button } from "../ui/button";
import { ResumeEditorFormSteps } from "@/lib/multi-form-steps/ResumeEditorStep";
import { FileUserIcon, Pen, PenLineIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface ResumeEditorFooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
  resumeData?: any;
}

const ResumeEditorFooter = ({
  currentStep,
  setCurrentStep,
  setShowSmResumePreview,
  showSmResumePreview,
  isSaving,
  resumeData,
}: ResumeEditorFooterProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previousStep = ResumeEditorFormSteps.find(
    (_, index) => ResumeEditorFormSteps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = ResumeEditorFormSteps.find(
    (_, index) => ResumeEditorFormSteps[index - 1]?.key === currentStep
  )?.key;

  const handleNextStep = async () => {
    if (currentStep === 'projects' && resumeData) {
      setIsSubmitting(true);
      try {
        let pendingUserId = localStorage.getItem('pendingUserId');
        
        // Generate UUID if not exists
        if (!pendingUserId) {
          pendingUserId = crypto.randomUUID();
          localStorage.setItem('pendingUserId', pendingUserId);
        }
        
        const payload = {
          pendingUserId,
          education: resumeData.education || [],
          experience: resumeData.experience || [],
          skills: resumeData.skills || [],
          projects: resumeData.projects || [],
          certifications: resumeData.certifications || []
        };
        

        const response = await fetch('/api/job-seeker/save-education-experience', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to save data');
        }

        toast.success('Data saved successfully!');
        if (nextStep) {
          setCurrentStep(nextStep);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to save data');
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 'certifications') {
      // Certification step ke baad bhi API call karna hai
      setIsSubmitting(true);
      try {
        let pendingUserId = localStorage.getItem('pendingUserId');
        
        // Generate UUID if not exists
        if (!pendingUserId) {
          pendingUserId = crypto.randomUUID();
          localStorage.setItem('pendingUserId', pendingUserId);
        }
        
        const payload = {
          pendingUserId,
          education: resumeData?.education || [],
          experience: resumeData?.experience || [],
          skills: resumeData?.skills || [],
          projects: resumeData?.projects || [],
          certifications: resumeData?.certifications || []
        };
        

        const response = await fetch('/api/job-seeker/save-education-experience', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to save data');
        }

        toast.success('Certifications saved successfully!');
        if (nextStep) {
          setCurrentStep(nextStep);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to save certifications');
      } finally {
        setIsSubmitting(false);
      }
    } else if (nextStep) {
      setCurrentStep(nextStep);
    }
  };
  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Previous step
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={!nextStep || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Next step'}
          </Button>
        </div>
        <Button
          title={
            showSmResumePreview ? "Show Resume Form" : "Show Resume Preview"
          }
          className="md:hidden"
          variant={"outline"}
          size={"icon"}
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
        >
          {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className="flex items-center gap-3">
          <Button variant={"secondary"}>
            <Link href={"/job-seeker/design-studio/resume"}>Cancel</Link>
          </Button>
          <p
            className={cn(
              "text-muted-foreground opacity-0",
              isSaving && "opacity-100"
            )}
          >
            Saving...
          </p>
        </div>
      </div>
    </footer>
  );
};
export default ResumeEditorFooter;
