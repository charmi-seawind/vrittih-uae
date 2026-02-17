"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { SidebarMainNav } from "./SidebarMainNav";
import { SidebarTop } from "./SidebarTop";
import { AdminSideBarLinks } from "@/lib/routes/AdminRoute";

const AdminSidebar = ({
  user,
}: {
  user: any;
}) => {
  const sidebarLinks = AdminSideBarLinks;
  const isLoading = false;
  const companySubscription = "ADMIN";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTop
          userName={user?.username as string}
          isLoading={!user}
          userSubType={companySubscription}
          userType="admin"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav
          user={user}
          type="admin"
          subscriptionLevel={companySubscription}
          items={sidebarLinks}
        />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;