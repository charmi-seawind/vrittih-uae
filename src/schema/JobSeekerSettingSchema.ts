import { z } from "zod";

export const educationSchema = z.object({
  degreeTitle: z.string().min(1, "Degree title is required"),
  instituteName: z.string().min(1, "Institute name is required"),
  instituteLocation: z.string().min(1, "Institute location is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});

export const workExperienceSchema = z.object({
  position: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  currentlyWorking: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  achievements: z.string().optional(),
});

export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  expiryDate: z.date().optional(),
  credentialId: z.string().optional(),
});

export const ProfessionalDetailsSchema = z.object({
  education: z.array(educationSchema).default([]),
  workExperience: z.array(workExperienceSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  skills: z.array(z.string()).default([]),
});

export type ProfessionalDetailsSchemaType = z.infer<typeof ProfessionalDetailsSchema>;
export type EducationSchemaType = z.infer<typeof educationSchema>;
export type WorkExperienceSchemaType = z.infer<typeof workExperienceSchema>;
export type CertificationSchemaType = z.infer<typeof certificationSchema>;