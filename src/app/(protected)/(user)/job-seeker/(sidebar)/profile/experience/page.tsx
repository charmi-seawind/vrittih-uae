import { Metadata } from "next";
import ExperiencePage from "./ExperiencePage";

export const metadata: Metadata = {
  title: "Work Experience",
  description: "Manage your professional work experience and achievements",
};

const page = async () => {
  return <ExperiencePage />;
};

export default page;