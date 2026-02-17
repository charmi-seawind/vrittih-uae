"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

const CompanyDetailsSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  companySize: z.string().min(1, "Company size is required"),
  industry: z.string().min(1, "Industry is required"),
  website: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), "Please enter a valid website URL starting with http:// or https://"),
  foundedYear: z
    .string()
    .optional()
    .refine((val) => !val || (/^\d{4}$/.test(val) && parseInt(val) >= 1800 && parseInt(val) <= new Date().getFullYear()), 
      `Founded year must be between 1800 and ${new Date().getFullYear()}`),
});

type CompanyDetailsFormData = z.infer<typeof CompanyDetailsSchema>;

interface EmployerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  description: string;
  foundedYear: string;
}

interface CompanyDetailsFormProps {
  employerData: EmployerData;
  setEmployerData: (data: EmployerData) => void;
}

const CompanyDetailsForm = ({ employerData, setEmployerData }: CompanyDetailsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(CompanyDetailsSchema),
    defaultValues: {
      companyName: employerData.companyName || "",
      companySize: employerData.companySize || "",
      industry: employerData.industry || "",
      website: employerData.website || "",
      foundedYear: employerData.foundedYear || "",
    },
    mode: "onChange",
  });

  const handleInputChange = (field: keyof EmployerData, value: string) => {
    setEmployerData({
      ...employerData,
      [field]: value,
    });
  };

  const companySizes = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees"
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Marketing",
    "Real Estate",
    "Other"
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Company Name *</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 sm:h-12 text-base"
                        disabled={isLoading}
                        placeholder="Enter your company name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleInputChange("companyName", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Company Size *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleInputChange("companySize", value);
                    }} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 sm:h-12 text-base">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Industry *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleInputChange("industry", value);
                    }} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 sm:h-12 text-base">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Company Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      className="h-11 sm:h-12 text-base"
                      disabled={isLoading}
                      placeholder="https://www.yourcompany.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleInputChange("website", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foundedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Founded Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-11 sm:h-12 text-base"
                      disabled={isLoading}
                      placeholder="e.g., 2020"
                      min="1800"
                      max={new Date().getFullYear()}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value);
                        handleInputChange("foundedYear", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsForm;