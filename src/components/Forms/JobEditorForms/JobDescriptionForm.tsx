"use client";
import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { useFormTriggersStore } from "@/store/useFormTriggersStore";
import { JobEditorFormProps } from "@/lib/types";
import CustomTipTapEditor from "@/components/tiptap/CustomTipTapEditor";

const JobDescriptionForm = ({
  currentStep,
  jobData,
  setJobData,
}: JobEditorFormProps) => {
  const { setTrigger } = useFormTriggersStore();

  const form = useForm({
    defaultValues: {
      description: jobData.description || "",
    },
  });

  useEffect(() => {
    setTrigger(currentStep, form.trigger);
  }, [form.trigger, setTrigger, currentStep]);

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      setJobData({
        ...jobData,
        ...values,
      });
    });
    return unsubscribe;
  }, [form, jobData, setJobData]);

  return (
    <div className="max-w-[90%] mx-auto space-y-6 pt-5">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <CustomTipTapEditor field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default JobDescriptionForm;
