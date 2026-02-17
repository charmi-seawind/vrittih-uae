"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

export function SidebarTop({
  userName,
  userSubType,
  isLoading,
  userType = "job-seeker",
}: {
  userName: string;
  userSubType?: "FREE" | "PRO" | "ELITE";
  isLoading: boolean;
  userType?: "job-seeker" | "employer" | "admin";
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent  data-[state=open]:text-sidebar-accent-foreground "
        >
     <div className="flex items-center justify-center ">
  <Avatar className="h-full w-full ">  
    <AvatarImage 
      src={isCollapsed ? "/favicon/favicon-logo.png" : "/logo/vrrittih.png"} 
      alt="Vrrittih" 
    />
    <AvatarFallback className="rounded-lg">V</AvatarFallback>
  </Avatar>
</div>
          {/* <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold relative">
              {userType === "employer" ? "Employer Hub" : "Vrrittih"}{" "}
              {!isLoading && userSubType && userSubType !== "FREE" && (
                <span className=" text-amber-400 text-xs absolute ml-1 bottom-[5.1px] z-[99999] ">{`${userSubType}`}</span>
              )}
            </span>
            {isLoading ? (
              <Skeleton className="h-1 w-1/2 bg-gray-400" />
            ) : (
              <span className="truncate text-xs text-muted-foreground">
                {userName}
              </span>
            )}
          </div> */}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
