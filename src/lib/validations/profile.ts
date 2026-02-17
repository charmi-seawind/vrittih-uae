import { z } from "zod";

// Education validation schema
export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required").max(100, "Degree must be less than 100 characters"),
  institution: z.string().min(1, "Institution is required").max(100, "Institution must be less than 100 characters"),
  year_of_completion: z.string().min(4, "Year is required").max(4, "Invalid year format"),
  percentage: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Experience validation schema
export const experienceSchema = z.object({
  position: z.string().min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
  company: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  location: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.string().optional(),
}).refine((data) => {
  if (!data.is_current && !data.end_date) {
    return false;
  }
  return true;
}, {
  message: "End date is required if not currently working",
  path: ["end_date"],
});

// Skills validation schema
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(50, "Skill name must be less than 50 characters"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"], {
    required_error: "Skill level is required",
  }),
});

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isOngoing: z.boolean().default(false),
  technologies: z.array(z.string()).optional(),
  projectUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  achievements: z.string().optional(),
}).refine((data) => {
  if (!data.isOngoing && !data.endDate) {
    return false;
  }
  return true;
}, {
  message: "End date is required if project is not ongoing",
  path: ["endDate"],
});

// Certification validation schema
export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required").max(100, "Name must be less than 100 characters"),
  issuingOrganization: z.string().min(1, "Issuing organization is required").max(100, "Organization name must be less than 100 characters"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;