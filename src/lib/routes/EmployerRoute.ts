// Sidebar NavLinks for Employer

import {
  LayoutDashboard,
  Building,

  FileText,
  Briefcase,
  CheckCircle,

  Star,

  FilePlus2,

  UsersRound,
  Crown,
} from "lucide-react";
import { SidebarNavLinks } from "../types";

export const EmployerSideBarLinks: SidebarNavLinks[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/employer/dashboard",
  },
  {
    title: "Profile",
    icon: Building,
    url: "#",
    items: [
      {
        title: "Profile Info",
        url: "/employer/profile/info",
        icon: FileText,
      },
      {
        title: "Company Info",
        url: "/employer/company/info",
        icon: FileText,
      },
    ],
  },
  {
    title: "Job Management",
    icon: Briefcase,
    url: "#",
    items: [
{
    title: "All Jobs",
    url: "/employer/job/all-job",
    icon: Briefcase,
  },
  {
    title: "Post Job",
    url: "/employer/job/create",
    icon: FilePlus2,
  },
  {
    title: "Featured Jobs",
    url: "/employer/featured-jobs",
    icon: Star,
  },
     
      
    ],
  },
  {
    title: "Applicants",
    icon: UsersRound,
    url: "/employer/applicants",
  },
  // {
  //   title: "Upgrade Plans",
  //   icon: Crown,
  //   url: "/employer/upgrade-plans",
  // },
];
