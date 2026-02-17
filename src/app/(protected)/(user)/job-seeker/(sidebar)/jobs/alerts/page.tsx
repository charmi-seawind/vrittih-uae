import { Metadata } from "next";
import JobAlertsPage from "./JobAlertsPage";

export const metadata: Metadata = {
  title: "Job Alerts",
  description: "Manage your job alerts and notifications",
};

const page = async () => {
  return <JobAlertsPage />;
};

export default page;