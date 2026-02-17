"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
// 🟠 Type import commented out
// import { ExtendedUser } from "@/next-auth";
import LogOutModal from "../Global/LogOutModal";
import React from "react";
import UserAvatar from "../Global/Useravatar";
import EmployerUserMenu from "../Global/EmployerUserMenu";
import JobSeekerUserMenu from "../Global/JobSeekerUserMenu";
import AdminUserMenu from "../Global/AdminUserMenu";
import ThemeSelect from "../Global/ThemeSelect";
import { useProfile } from "@/hooks/useProfile";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";
// import UseCurrentSession from "@/hooks/use-session";

export function SidebarUser({
  isLoading,
  user,
}: {
  user: any; // Changed from ExtendedUser
  isLoading: boolean;
}) {
  const { isMobile } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const { profile, loading: profileLoading } = useProfile();
  const { profile: employerProfile, loading: employerLoading } = useEmployerProfile();
  
  // Get real user email from localStorage
  const getRealUserEmail = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData.email;
      }
    } catch (error) {
    }
    return null;
  };

  // Use appropriate data based on user type
  let displayName, displayEmail;
  if (user?.type === "EMPLOYER" || user?.role === "EMPLOYER") {
    displayName = employerProfile?.company_name || user?.fullName || user?.name || user?.full_name || 'User';
    displayEmail = getRealUserEmail() || 
                  employerProfile?.email || 
                  employerProfile?.company_email || 
                  'No email available';
  } else {
    displayName = profile?.full_name || user?.fullName || user?.name || user?.full_name || 'User';
    displayEmail = profile?.email || user?.email;
  }
  
  const isDataLoading = isLoading || profileLoading || employerLoading;
  

  // 🟠 Session hook commented out
  // UseCurrentSession();
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >

                <UserAvatar imageUrl={user?.avatarUrl || employerProfile?.logo} userName={displayName || user?.name || ''} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {isDataLoading ? (
                    <>
                      <Skeleton className="w-[70%] mb-2 h-2 bg-gray-400" />
                      <Skeleton className="w-full h-2 bg-gray-400" />
                    </>
                  ) : (
                    <>
                      <span className="truncate font-semibold">
                        {displayName}
                      </span>
                      <span className="truncate text-xs">{displayName}</span>
                    </>
                  )}
                </div>

                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar
                    imageUrl={user?.avatarUrl || employerProfile?.logo}
                    userName={displayName || user?.name || ''}
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{displayName}</span>
                    <span className="truncate text-xs">{displayName}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(user.type === "EMPLOYER" || user.role === "EMPLOYER") && <EmployerUserMenu user={user} />}
              {user.type === "JOB_SEEKER" && <JobSeekerUserMenu />}
              {user.type === "ADMIN" && <AdminUserMenu />}
              <DropdownMenuSeparator />
              {/* <ThemeSelect /> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <LogOutModal open={open} setOpen={setOpen} />
    </>
  );
}
