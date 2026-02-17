"use client";

import type { JobEditorFormProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Edit } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const JobSettingForm = ({
  currentStep,
  jobData,
  setJobData,
}: JobEditorFormProps) => {
  const form = useForm({
    defaultValues: {
      resumeRequired: jobData.resumeRequired || false,
      getEmailNotification: jobData.getEmailNotification || false,
      applicationDeadline: jobData.applicationDeadline || null,
      isUrgent: jobData.isUrgent || false,
      postInLinkedin: jobData.postInLinkedin || false,
      linkedinCaption: jobData.linkedinCaption || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      setJobData({ ...jobData, ...values });
    });
    return unsubscribe;
  }, [form.watch]);

  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const postInLinkedinValue = form.watch("postInLinkedin");

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-5">
      <Form {...form}>
        <form className="space-y-5">
          {/* Application Deadline */}
          <FormField
            control={form.control}
            name="applicationDeadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Application Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      disabled={(date) => date < new Date()}
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Urgent Checkbox */}
          <FormField
            control={form.control}
            name="isUrgent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Urgent Job?</FormLabel>
                  <FormDescription>
                    Adds urgent tag on job posting
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Resume Required */}
          <FormField
            control={form.control}
            name="resumeRequired"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Resume Required</FormLabel>
                  <FormDescription>
                    Applicants must upload resume to apply
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Email Notification */}
          <FormField
            control={form.control}
            name="getEmailNotification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Email Notifications</FormLabel>
                  <FormDescription>
                    Receive email when candidate applies
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* LinkedIn Post */}
          <FormField
            control={form.control}
            name="postInLinkedin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <div className="space-y-1 leading-none w-full">
                  <div className="flex justify-between items-center">
                    <FormLabel>Post on LinkedIn</FormLabel>
                    {postInLinkedinValue && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLinkedinModal(true)}
                        className="h-8"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Caption
                      </Button>
                    )}
                  </div>
                  <FormDescription>
                    Optionally post this job on LinkedIn
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* LinkedIn Dialog */}
          <Dialog open={showLinkedinModal} onOpenChange={setShowLinkedinModal}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit LinkedIn Caption</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="linkedinCaption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Caption</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[120px]" />
                      </FormControl>
                      <FormDescription>
                        Customize LinkedIn post content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button onClick={() => setShowLinkedinModal(false)}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
};

export default JobSettingForm;
