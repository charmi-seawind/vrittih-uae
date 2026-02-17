"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Currency, CurrencySelect } from "@/components/ui/currency-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { JobBenefits, SalaryRate, SalaryType } from "@/lib/enums/CreateJobEnums";
import { useForm } from "react-hook-form";
import { getSafeSymbolFromCurrency } from "country-data-list";
import CreateJobTags from "@/components/Job/CreateJobTags";

interface JobBenefitsFormProps {
  currentStep?: number;
  jobData: any;
  setJobData: (data: any) => void;
}

const JobBenefitsForm = ({ jobData, setJobData }: JobBenefitsFormProps) => {
  const form = useForm({
    defaultValues: {
      salaryType: jobData.salaryType || "Range",
      amount: jobData.amount || null,
      maxSalaryAmount: jobData.maxSalaryAmount || null,
      minSalaryAmount: jobData.minSalaryAmount || null,
      salaryCurrency: jobData.salaryCurrency || "NPR",
      salaryRate: jobData.salaryRate || "",
      benefits: jobData.benefits || [],
    },
  });

  const [showRangeSalary, setShowRangeSalary] = React.useState(
    form.watch("salaryType") === "Range"
  );

  useEffect(() => {
    const subscription = form.watch((values) => {
      setJobData({ ...jobData, ...values });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, jobData, setJobData]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="max-w-[70%] mx-auto space-y-6 pt-5">
      <Form {...form}>
        <form className="space-y-6">
          <motion.div variants={fadeIn} className="grid gap-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Currency */}
              <FormField
                control={form.control}
                name="salaryCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Currency</FormLabel>
                    <FormControl>
                      <CurrencySelect
                        onValueChange={(val: string) =>
                          form.setValue("salaryCurrency", val)
                        }
                        placeholder="Select currency"
                        currencies="all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary Rate */}
              <FormField
                control={form.control}
                name="salaryRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Rate</FormLabel>
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
                        {SalaryRate.map((rate) => (
                          <SelectItem key={rate} value={rate}>
                            Per {rate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Salary Type Switch */}
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <FormField
                  control={form.control}
                  name="salaryType"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-40">
                      <FormLabel>Show Pay By</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          setShowRangeSalary(val === "Range");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SalaryType.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Salary Inputs */}
                <motion.div animate={{ height: "auto" }} initial={false} className="w-full sm:flex-1">
                  {showRangeSalary ? (
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="minSalaryAmount"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Min amount"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxSalaryAmount"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Max amount"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter amount"
                              value={field.value ?? ""}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Benefits */}
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Benefits Offered</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-4">
                      {JobBenefits.map((benefit) => (
                        <button
                          key={benefit}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => {
                            field.onChange(
                              field.value.includes(benefit)
                                ? field.value.filter((b: string) => b !== benefit)
                                : [...field.value, benefit]
                            );
                          }}
                        >
                          <CreateJobTags
                            isSelected={field.value.includes(benefit)}
                            label={benefit}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </form>
      </Form>
    </div>
  );
};

export default JobBenefitsForm;
