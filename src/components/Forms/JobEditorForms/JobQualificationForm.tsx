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
import SkillsInput from "@/components/Job/SkillsInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EducationLevel,
  LicenseRequired,
  PreferredGender,
  VehicleRequired,
} from "@/lib/enums/CreateJobEnums";

// 🔹 Replaced Schema type
type JobQualificationFormData = {
  skills: string[];
  license: string;
  educationLevel: string;
  preferredGender: string;
  vehicle: string;
};

const JobQualificationForm = ({
  currentStep,
  jobData,
  setJobData,
}: JobEditorFormProps) => {
  const { setTrigger } = useFormTriggersStore();

  const form = useForm<JobQualificationFormData>({
    defaultValues: {
      skills: jobData.skills || [],
      license: jobData.license || "None",
      educationLevel: jobData.educationLevel || "",
      preferredGender: jobData.preferredGender || "None",
      vehicle: jobData.vehicle || "None",
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
        skills:
          values.skills?.filter((skill): skill is string => !!skill) || [],
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
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Skills</FormLabel>
                <FormControl>
                  <SkillsInput form={form} field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Required</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select salary type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LicenseRequired.map((license) => (
                        <SelectItem key={license} value={license}>
                          {license}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Required</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VehicleRequired.map((vehicle) => (
                        <SelectItem key={vehicle} value={vehicle}>
                          {vehicle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Education Required</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Education Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EducationLevel.map((education) => (
                        <SelectItem key={education} value={education}>
                          {education}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Preferred Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PreferredGender.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JobQualificationForm;
