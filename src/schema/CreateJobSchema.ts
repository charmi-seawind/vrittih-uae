import { z } from "zod";

// Job Basics Schema
export const jobBasicsSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
  jobType: z.string().min(1, "Job type is required").max(50, "Job type must be less than 50 characters"),
  workMode: z.string().min(1, "Work mode is required").max(50, "Work mode must be less than 50 characters"),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

// Job Details Schema
export const jobDetailsSchema = z.object({
  salaryType: z.string().optional(),
  salaryRate: z.string().optional(),
  minSalary: z.string().optional(),
  maxSalary: z.string().optional(),
  currency: z.string().optional(),
  category: z.string().max(50, "Category must be less than 50 characters").optional(),
  subCategory: z.string().max(50, "Sub-category must be less than 50 characters").optional(),
});

// Job Benefits Schema
export const jobBenefitsSchema = z.object({
  benefits: z.array(z.string()).optional(),
});

// Job Tags Schema
export const jobTagsSchema = z.object({
  tags: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});

// Job Qualifications Schema
export const jobQualificationsSchema = z.object({
  educationLevel: z.string().optional(),
  experienceLevel: z.string().optional(),
  preferredGender: z.string().optional(),
  licenseRequired: z.string().optional(),
  vehicleRequired: z.string().optional(),
});

// Job Description Schema
export const jobDescriptionSchema = z.object({
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
});

// Job Settings Schema
export const jobSettingsSchema = z.object({
  applicationDeadline: z.date().optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

// Complete Job Schema
export const jobSchema = z.object({
  ...jobBasicsSchema.shape,
  ...jobDetailsSchema.shape,
  ...jobBenefitsSchema.shape,
  ...jobTagsSchema.shape,
  ...jobQualificationsSchema.shape,
  ...jobDescriptionSchema.shape,
  ...jobSettingsSchema.shape,
});

// Type exports
export type jobBasicsSchemaType = z.infer<typeof jobBasicsSchema>;
export type jobDetailsSchemaType = z.infer<typeof jobDetailsSchema>;
export type jobBenefitsSchemaType = z.infer<typeof jobBenefitsSchema>;
export type jobTagsSchemaType = z.infer<typeof jobTagsSchema>;
export type jobQualificationsSchemaType = z.infer<typeof jobQualificationsSchema>;
export type jobDescriptionSchemaType = z.infer<typeof jobDescriptionSchema>;
export type jobSettingsSchemaType = z.infer<typeof jobSettingsSchema>;
export type JobSchemaType = z.infer<typeof jobSchema>;