import { Metadata } from "next";
import EducationPage from "./EducationPage";

export const metadata: Metadata = {
  title: "Education",
  description: "Manage your educational qualifications and certifications",
};

const page = async () => {
  return <EducationPage />;
};

export default page;