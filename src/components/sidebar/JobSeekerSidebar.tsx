"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarTop } from "./SidebarTop";
import { SidebarMainNav } from "./SidebarMainNav";
import { SidebarUser } from "./SidebarUser";
// 🟠 Type and context imports commented out
// import { ExtendedUser } from "@/next-auth";
import { JobSeekerSideBarLinks } from "@/lib/routes/JobSeekerRoute";
// import { useJobSeekerSubscriptionLevel } from "@/context/JobSeekerSubscriptionLevelProvider";

export default function JobSeekerSidebar({ user }: { user: any }) {
  const sidebarLinks = JobSeekerSideBarLinks;
  // 🟠 Context hook commented out
  // const subscriptionLevel = useJobSeekerSubscriptionLevel();
  
  // 🔹 Dummy subscription level
  const subscriptionLevel = "FREE";
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTop
          userName={user?.name as string}
          isLoading={!user}
          userSubType={subscriptionLevel}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav
          user={user}
          type="job-seeker"
          subscriptionLevel={subscriptionLevel}
          items={sidebarLinks}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} isLoading={!user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
