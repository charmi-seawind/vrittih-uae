import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { jobsAPI } from "@/services/api";
import { toast } from "sonner";

interface SaveJobButtonProps {
  jobId: string;
  initialState: { isSavedByUser: boolean };
  className?: string;
  withText?: boolean;
}

const SaveJobButton = ({
  initialState,
  jobId,
  className,
  withText = false,
}: SaveJobButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialState?.isSavedByUser || false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveJob = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        await jobsAPI.unsaveJob(jobId);
      } else {
        await jobsAPI.saveJob(jobId);
      }
      setIsSaved(!isSaved);
      toast.success(isSaved ? "Job removed from saved jobs" : "Job saved successfully!", { id: "save-job" });
    } catch (error) {
      toast.error("Failed to save job. Please try again.", { id: "save-job" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleSaveJob}
      className={cn(
        "flex justify-center items-center gap-2 hover:text-red-500 disabled:animate-pulse",
        className
      )}
    >
      <Bookmark
        className={cn(
          " size-5 group",
          isSaved && "fill-current text-blue-600",
          isLoading && "animate-pulse"
        )}
      />
      {withText && (
        <span className="hover:text-foreground text-foreground">
          {isSaved ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
};
export default SaveJobButton;