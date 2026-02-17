import JobApplicationPage from "@/components/Job/JobApplicationPage";

// Mock job data - replace with actual API call
const mockJobData = {
  id: "1",
  title: "Senior Frontend Developer",
  company: {
    id: "1",
    name: "Tech Solutions Inc.",
    logoUrl: "/images/default-company-vrrittih.png"
  },
  location: "Mumbai, India",
  workMode: "Remote",
  jobType: "Full-time"
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function JobApplyPage({ params }: PageProps) {
  return <JobApplicationPage jobData={mockJobData} />;
}
