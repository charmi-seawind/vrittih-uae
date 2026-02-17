"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

import LoadingButton from "@/components/ui/loading-button";
// import { toast } from "sonner";
// import { deleteJob } from "@/actions/job/deleteJob";

interface DeleteCompanyPopoverProps {
  jobId: string;
}

const RemoveCompanyMemberPopover = ({ jobId }: DeleteCompanyPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const deleteJobOnClick = async () => {
    setLoading(true);
    // try {
    //   const res = await deleteJob(jobId);
    //   if (res.success) {
    //     toast.success(res.message);
    //     setOpen(false);
    //   } else {
    //     toast.error(res.message);
    //   }
    // } catch (error) {
    //   toast.error("Failed to delete job");
    // } finally {
    //   setLoading(false);
    // }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={() => setOpen(true)}>
        <p className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-accent">
          <Trash color="red" className="h-4 w-4 mr-2" />
          <span>Delete Job</span>
        </p>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="space-y-2">
          <h3 className="">Delete Job</h3>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete this job?
          </p>
          <div className="flex justify-between space-x-3">
            <Button onClick={() => setOpen(false)} variant="secondary">
              Cancel
            </Button>
            <LoadingButton
              onClick={deleteJobOnClick}
              loading={loading}
              variant="destructive"
            >
              Delete
            </LoadingButton>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default RemoveCompanyMemberPopover;
