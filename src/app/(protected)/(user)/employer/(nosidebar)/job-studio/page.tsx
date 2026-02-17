import { Metadata } from "next";
import JobEditorPage from "./JobEditorPage";

interface PageProps {
  searchParams?: { jobId?: string };
}

export const metadata: Metadata = {
  title: "Create Job",
  description: "Create a new job posting to attract the best candidates",
};

const Page = ({ searchParams }: PageProps) => {
  const jobToEdit = null; // Removed DB fetch logic

  return <JobEditorPage jobToEdit={jobToEdit} />;
};

export default Page;
