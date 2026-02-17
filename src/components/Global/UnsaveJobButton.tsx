import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useUnsaveJob } from "@/hooks/query-hooks/useUnsaveJob";

interface UnsaveJobButtonProps {
  jobId: string;
  className?: string;
  withText?: boolean;
}

const UnsaveJobButton = ({
  jobId,
  className,
  withText = false,
}: UnsaveJobButtonProps) => {
  const unsaveJobMutation = useUnsaveJob();
  
  const handleUnsaveJob = async () => {
    unsaveJobMutation.mutate(jobId);
  };

  return (
    <button
      disabled={unsaveJobMutation.isLoading}
      onClick={handleUnsaveJob}
      className={cn(
        "flex justify-center items-center gap-2 hover:text-gray-500 disabled:animate-pulse",
        className
      )}
    >
      <Bookmark
        className={cn(
          "size-5 group fill-current text-blue-600",
          unsaveJobMutation.isLoading && "animate-pulse"
        )}
      />
      {withText && (
        <span className="hover:text-foreground text-foreground">
          Saved
        </span>
      )}
    </button>
  );
};

export default UnsaveJobButton;