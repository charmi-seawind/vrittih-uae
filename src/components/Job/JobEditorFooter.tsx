import Link from "next/link";
import { Button } from "../ui/button";
import { JobEditorFormSteps } from "@/lib/multi-form-steps/JobEditorStep";
import { Eye, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingButton from "../ui/loading-button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-dailog";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface JobEditorFooterProps {
  currentStep: string;
  setCurrentStep: (key: string, isPrev: boolean) => void;
  showSMPreview: boolean;
  setShowSMPreview: (show: boolean) => void;
  isSaving: boolean;
  jobId?: string;
}

const JobEditorFooter = ({
  currentStep,
  setCurrentStep,
  setShowSMPreview,
  showSMPreview,
  isSaving,
}: JobEditorFooterProps) => {
  const previousStep = JobEditorFormSteps.find(
    (_, index) => JobEditorFormSteps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = JobEditorFormSteps.find(
    (_, index) => JobEditorFormSteps[index - 1]?.key === currentStep
  )?.key;

  const isLastStep =
    JobEditorFormSteps[JobEditorFormSteps.length - 1].key === currentStep;

  const [showDialog, setShowDialog] = useState(false);

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex flex-wrap justify-between gap-3 px-4 md:px-12 lg:px-24">
        
        {/* Previous / Next navigation */}
        <div className="flex items-center gap-3">
          <Button
            disabled={!previousStep}
            variant="secondary"
            onClick={() => previousStep && setCurrentStep(previousStep, true)}
          >
            Previous Step
          </Button>

          {isLastStep ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex justify-between items-center">
                  <span>Save As</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    Save as Draft
                  </Button>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setShowDialog(true)}
                  >
                    Send For Review
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              disabled={!nextStep}
              onClick={() => nextStep && setCurrentStep(nextStep, false)}
            >
              Next Step
            </Button>
          )}
        </div>

        {/* Preview Toggle Button */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="md:hidden"
                variant="outline"
                size="icon"
                onClick={() => setShowSMPreview(!showSMPreview)}
              >
                {showSMPreview ? <X /> : <Eye />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showSMPreview ? "Close Preview" : "Show Preview"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Close */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" disabled={isSaving}>
            {isSaving ? "Closing..." : <Link href="/employer/job">Close</Link>}
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

      {/* Review Confirmation Dialog */}
      <ResponsiveModal open={showDialog} onOpenChange={setShowDialog}>
        <ResponsiveModalContent className="space-y-5 md:space-y-0 overflow-x-hidden">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Send For Review</ResponsiveModalTitle>
            <ResponsiveModalDescription className="sr-only">
              This will be sent for review & approval.
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>

          <Alert variant="info">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
              Your job will be reviewed before it goes live.
            </AlertDescription>
          </Alert>

          <ResponsiveModalFooter>
            <Button
              className="w-full mb-5 md:mb-0"
              variant="secondary"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>

           
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </footer>
  );
};

export default JobEditorFooter;
