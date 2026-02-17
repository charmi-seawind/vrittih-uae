import { Metadata } from "next";
import PersonalInfoPage from "./PersonalInfoPage";

export const metadata: Metadata = {
  title: "Personal Information",
  description: "Manage your personal information and contact details",
};

const page = async () => {
  return <PersonalInfoPage />;
};

export default page;