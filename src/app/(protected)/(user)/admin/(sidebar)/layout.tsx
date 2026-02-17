"use client";

import AdminSidebar from "@/components/sidebar/AdminSidebar";
import AdminNav from "@/components/sidebar/AdminNav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SidebarPageTransition from "@/context/SidebarPageTransition";
import SidebarContainer from "@/components/Global/SidebarContainer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/admin/login");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset>
        <AdminNav user={user} hasSidebar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <SidebarPageTransition>
            <SidebarContainer>{children}</SidebarContainer>
          </SidebarPageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}