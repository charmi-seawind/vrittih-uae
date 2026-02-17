"use client";

import EmployerNav from "@/components/sidebar/EmployerNav";
import EmployerSidebar from "@/components/sidebar/EmployerSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SidebarPageTransition from "@/context/SidebarPageTransition";
import SidebarContainer from "@/components/Global/SidebarContainer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EmployerSidebarLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    } else if (!loading && user?.role !== 'employer') {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'job_seeker') {
        router.push('/job-seeker/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [loading, isAuthenticated, user, router]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated || user?.role !== 'employer') {
    return null;
  }
  
  const activeCompanyId = user?.id || '';

  return (
    <SidebarProvider>
      <EmployerSidebar activeCompanyId={activeCompanyId} user={user} />
      <SidebarInset>
        <EmployerNav
          activeCompanyId={activeCompanyId}
          user={user}
          hasSidebar
        />

        <div className="flex flex-1 flex-col gap-4 p-4">
          <SidebarPageTransition>
            <SidebarContainer>{children}</SidebarContainer>
          </SidebarPageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default EmployerSidebarLayout;
