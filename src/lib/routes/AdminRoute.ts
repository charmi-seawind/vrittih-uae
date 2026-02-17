import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  UserPlus,
} from "lucide-react";
import { SidebarNavLinks } from "../types";

export const AdminSideBarLinks: SidebarNavLinks[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin/dashboard",
  },
  {
    title: "Users",
    icon: Users,
    url: "#",
    items: [
      {
        title: "Job Seekers",
        url: "/admin/users/job-seekers",
        icon: Users,
      },
      {
        title: "Employers",
        url: "/admin/users/employers",
        icon: Users,
      },
    ],
  },
  {
    title: "Pending Users",
    icon: UserCheck,
    url: "#",
    items: [
      {
        title: "Job Seekers",
        url: "/admin/pending-users/job-seekers",
        icon: UserCheck,
      },
      {
        title: "Employers",
        url: "/admin/pending-users/employers",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Create User",
    icon: UserPlus,
    url: "/admin/create-user",
  },
  {
    title: "Plans",
    icon: CreditCard,
    url: "/admin/plans",
  },
];