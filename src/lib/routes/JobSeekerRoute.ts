// Sidebar NavLinks for JobSeeker

import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  FileText,
  Search,
  Bookmark,
  Bell,
  Send,
  ClipboardCheck,
  Settings,
  UserCog,
  CreditCard,
  Shield,
  FolderOpen,
  Award,
  Crown,
} from "lucide-react";
import { SidebarNavLinks } from "../types";

export const JobSeekerSideBarLinks: SidebarNavLinks[] = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/job-seeker/dashboard" },
  {
    title: "My Profile",
    icon: User,
    url: "",
    items: [
      {
        title: "Personal Info",
        url: "/job-seeker/profile/personal-info",
        icon: User,
      },
      {
        title: "Education",
        url: "/job-seeker/profile/education",
        icon: GraduationCap,
      },
      {
        title: "Experience",
        url: "/job-seeker/profile/experience",
        icon: Briefcase,
      },
      {
        title: "Skills",
        url: "/job-seeker/profile/skills",
        icon: Wrench,
      },
      {
        title: "Projects",
        url: "/job-seeker/profile/projects",
        icon: FolderOpen,
      },
      {
        title: "Certifications",
        url: "/job-seeker/profile/certifications",
        icon: Award,
      },
      {
        title: "Resume",
        url: "/job-seeker/profile/resume",
        icon: FileText,
      },
    ],
  },
  {
    title: "Jobs",
    icon: Search,
    url: "/",
    items: [
      {
        title: "Browse Jobs",
        url: "/job-seeker/jobs/browse",
        icon: Search,
      },
      {
        title: "Saved Jobs",
        url: "/job-seeker/saved-jobs",
        icon: Bookmark,
      },
      // {
      //   title: "Job Alerts",
      //   url: "/job-seeker/jobs/alerts",
      //   icon: Bell,
      // },
    ],
  },
  {
    title: "Applications",
    icon: Send,
    url: "/job-seeker/applications",
    items: [
      {
        title: "Applied Jobs",
        url: "/job-seeker/applied-jobs",
        icon: ClipboardCheck,
      },
     
    ],
  },
  // {
  //   title: "Upgrade Plans",
  //   icon: Crown,
  //   url: "/job-seeker/upgrade-plans",
  // },
];
