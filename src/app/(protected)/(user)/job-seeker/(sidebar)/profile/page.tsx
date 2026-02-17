import { Metadata } from "next";
import ProfilePage from "./ProfilePage";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your complete profile information",
};

const page = async () => {
  return <ProfilePage />;
};

export default page;