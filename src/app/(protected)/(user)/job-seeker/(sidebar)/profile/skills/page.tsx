import { Metadata } from "next";
import SkillsPage from "./SkillsPage";

export const metadata: Metadata = {
  title: "Skills",
  description: "Manage your technical and professional skills",
};

const page = async () => {
  return <SkillsPage />;
};

export default page;