import { z } from "zod";

// Job Post Schema for employer job posting form
export const jobPostSchema = z.object({
  company_name: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  job_title: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
  job_category: z.string().min(1, "Job category is required").max(50, "Job category must be less than 50 characters"),
  job_type: z.string().min(1, "Job type is required").max(50, "Job type must be less than 50 characters"),
  work_location_type: z.string().min(1, "Work location type is required").max(50, "Work location type must be less than 50 characters"),
  office_address: z.string().max(200, "Office address must be less than 200 characters").optional(),
  pay_type: z.string().min(1, "Pay type is required").max(50, "Pay type must be less than 50 characters"),
  pay_amount: z.string().min(1, "Pay amount is required").max(50, "Pay amount must be less than 50 characters"),
  additional_perks: z.string().max(500, "Additional perks must be less than 500 characters").optional(),
  joining_fee_required: z.boolean(),
  minimum_education: z.string().min(1, "Minimum education is required").max(50, "Minimum education must be less than 50 characters"),
  language_required: z.string().min(1, "Language required is required").max(100, "Language required must be less than 100 characters"),
  experience_required: z.string().min(1, "Experience required is required").max(50, "Experience required must be less than 50 characters"),
  additional_requirements: z.string().max(1000, "Additional requirements must be less than 1000 characters").optional(),
  job_description: z.string().min(1, "Job description is required").max(2000, "Job description must be less than 2000 characters"),
  is_walk_in: z.boolean(),
  walk_in_address: z.string().max(200, "Walk-in address must be less than 200 characters").optional(),
  walk_in_start_date: z.string().optional(),
  walk_in_end_date: z.string().optional(),
  walk_in_timing: z.string().max(100, "Walk-in timing must be less than 100 characters").optional(),
  walk_in_instructions: z.string().max(500, "Walk-in instructions must be less than 500 characters").optional(),
  application_email: z.string().email("Invalid email format").max(100, "Email must be less than 100 characters"),
  is_featured: z.boolean(),
});

export type JobPostSchemaType = z.infer<typeof jobPostSchema>;

// Job category options
export const JOB_CATEGORIES = [
  "IT",
  "Sales", 
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Healthcare",
  "Education",
  "Retail",
  "Other"
] as const;

// Job type options
export const JOB_TYPES = [
  "Full-time",
  "Part-time", 
  "Contract",
  "Internship"
] as const;

// Work location type options
export const WORK_LOCATION_TYPES = [
  "Remote",
  "On-site",
  "Hybrid"
] as const;

// Pay type options
export const PAY_TYPES = [
  "Fixed",
  "Range",
  "Negotiable"
] as const;

// Education levels
export const EDUCATION_LEVELS = [
  "Any",
  "10th",
  "12th", 
  "Graduate",
  "Post Graduate"
] as const;

// Experience levels
export const EXPERIENCE_LEVELS = [
  "Fresher",
  "0-1 years",
  "1-3 years",
  "3-5 years", 
  "5+ years"
] as const;