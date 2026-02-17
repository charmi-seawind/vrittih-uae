import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobCategory: z.string().min(1, "Job category is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  dob: z.string().min(1, "Date of birth is required").refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, "You must be at least 18 years old to apply"),
  bio: z.string().optional(),
  photo: z.any().optional(),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "School/University is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  grade: z.string().min(1, "Grade/CGPA is required").refine((val) => {
    return /^\d+(\.\d+)?$/.test(val);
  }, "Grade must be a numeric value"),
  description: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type EducationValues = z.infer<typeof educationSchema>;

export const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().min(1, "Description is required"),
  achievements: z.string().optional(),
}).refine((data) => {
  if (!data.currentlyWorking && (!data.endDate || data.endDate === "")) {
    return false;
  }
  if (data.startDate && data.endDate && !data.currentlyWorking) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date is required when not currently working and must be after start date",
  path: ["endDate"],
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export const skillsSchema = z.object({
  skill: z.string().min(1, "Skill name is required").min(2, "Skill must be at least 2 characters"),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

export const projectsSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.string().min(1, "Technologies are required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  url: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Please enter a valid URL (e.g., https://github.com/user/project)"),
  achievements: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type ProjectsValues = z.infer<typeof projectsSchema>;

export const certificationsSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().min(1, "Issue date is required").refine((date) => {
    if (!date) return true;
    const issueYear = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    return issueYear <= currentYear;
  }, "Issue year cannot be in the future"),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    return /^[A-Za-z0-9@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(val);
  }, "Credential ID contains invalid characters"),
}).refine((data) => {
  if (data.issueDate && data.expiryDate) {
    return new Date(data.issueDate) <= new Date(data.expiryDate);
  }
  return true;
}, {
  message: "Expiry date must be after issue date",
  path: ["expiryDate"],
});

export type CertificationsValues = z.infer<typeof certificationsSchema>;

export interface ResumeValues {
  id?: string;
  title?: string;
  description?: string;
  photo?: string | null;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  jobCategory?: string;
  city?: string;
  country?: string;
  dob?: string;
  bio?: string;
  expectedSalary?: string;
  currentSalary?: string;
  templateId?: string;
  workExperiences?: any[];
  experience?: any[];
  educations?: any[];
  education?: any[];
  certification?: any[];
  certifications?: any[];
  skills?: string[];
  projects?: any[];
  borderStyle?: string;
  colorHex?: string;
  summary?: string;
}