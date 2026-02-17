"use client";

// import { ExtendedUser } from "@/next-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { SidebarMainNav } from "./SidebarMainNav";
import { SidebarUser } from "./SidebarUser";
import { SidebarTop } from "./SidebarTop";
// import { CompanySwitcher } from "./CompanySwitcher";
// import { useQueryAllCompanies } from "@/hooks/query-hooks/getEmployeeCompany";
// import { EmployerCompany } from "@/lib/prisma-types/Employers";
import { Skeleton } from "../ui/skeleton";
// import { useRouter } from "next/navigation";
import { EmployerSideBarLinks } from "@/lib/routes/EmployerRoute";
// import { useCompanySubscriptionLevel } from "@/context/CompanySubscriptionLevelProvider";

const EmployerSidebar = ({
  user,
  activeCompanyId,
}: {
  user: any; // ExtendedUser;
  activeCompanyId?: string | null;
}) => {
  const sidebarLinks = EmployerSideBarLinks;
  
  // Commented out store and lib related code
  // const { data, isLoading } = useQueryAllCompanies();
  // const router = useRouter();
  // const companies: EmployerCompany[] = data?.data.companies;
  // const companySubscription = useCompanySubscriptionLevel();
  // if (!isLoading && companies.length === 0) {
  //   router.push("/onboarding/employer");
  // }
  
  const isLoading = false;
  const companies = [];
  const companySubscription = "FREE";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTop
          userName={user?.name as string}
          isLoading={!user}
          userSubType={companySubscription}
          userType="employer"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav
          user={user}
          type="employer"
          subscriptionLevel={companySubscription}
          items={sidebarLinks}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={user} isLoading={!user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
export default EmployerSidebar;
