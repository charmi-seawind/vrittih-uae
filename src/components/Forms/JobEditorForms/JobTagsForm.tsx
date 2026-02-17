import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { useFormTriggersStore } from "@/store/useFormTriggersStore";
import { JobEditorFormProps } from "@/lib/types";
import { InputTags } from "@/components/ui/input-tag";

const JobTagForm = ({
  currentStep,
  jobData,
  setJobData,
}: JobEditorFormProps) => {
  const { setTrigger } = useFormTriggersStore();

  const form = useForm({
    defaultValues: {
      tags: jobData.tags || [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    setTrigger(currentStep, form.trigger);
  }, [form.trigger, setTrigger, currentStep]);

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      setJobData({
        ...jobData,
        ...values,
        tags: values.tags?.filter((tag): tag is string => !!tag) || [],
      });
    });
    return unsubscribe;
  }, [form, jobData, setJobData]);

  return (
    <div className="max-w-[90%] mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Job Tags</h2>
        <p className="text-sm text-muted-foreground">
          Add tags that best describe the job.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Tags (Upto 15)</FormLabel>
                <FormControl>
                  <InputTags
                    maxLength={15}
                    {...field}
                    onChange={(e) =>
                      //@ts-ignore
                      field.onChange(e.map((tag) => tag.trim().toLowerCase()))
                    }
                  />
                </FormControl>
                <FormDescription>
                  Type Text and press enter to add the tag. This will help job
                  seekers find your job easily.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default JobTagForm;
