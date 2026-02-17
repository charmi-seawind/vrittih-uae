import { Metadata } from "next";

export const METADATA_CONFIG: Metadata = {
  title: {
    template: "%s | Vrrittih.com",
    default: "Vrrittih.com - Complete Job Portal Platform",
  },
  authors: [{ name: "Vrrittih Team" }],
  creator: "Vrrittih",
  publisher: "Vrrittih",
  // metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  description:
    "Complete job portal with CV posting (₹99/₹999) and job packages (₹499/₹999/₹2,999/₹4,999) with auto-renew, payments, and automation.",
  openGraph: {
    type: "website",
    siteName: "Vrrittih.com - Complete Job Portal Platform",
    title: "Vrrittih.com - Complete Job Portal Platform",
    description:
      "Complete job portal with CV posting (₹99/₹999) and job packages (₹499/₹999/₹2,999/₹4,999) with auto-renew, payments, and automation.",
  },
  twitter: {
    card: "summary_large_image",
  },
  keywords: [
    "Vrrittih",
    "Job Portal",
    "CV Posting",
    "Job Packages",
    "Resume Builder",
    "Job Search",
    "Career Platform",
    "Employment",
    "Job Seeker",
    "Employer",
    "Job Application",
    "Job Posting",
    "Job Listing",
    "Job Board",
    "Career Services",
    "Professional Network",
    "Job Marketplace",
    "Recruitment Platform",
  ],
};
