import { Metadata } from "next";
import BrowseJobsPage from "./BrowseJobsPage";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description: "Discover and search for job opportunities",
};

const page = async () => {
  return <BrowseJobsPage />;
};

export default page;