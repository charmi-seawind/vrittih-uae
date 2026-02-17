"use client";

import ApplicationStatusDistributionPie from "@/components/employer/dashboard/ApplicationStatusDistributionPie";
import ApplicationTrends from "@/components/employer/dashboard/ApplicationTrend";
import RecentPendingApplicant from "@/components/employer/dashboard/RecentPendingApplicant";
import ScheduledInterview from "@/components/employer/dashboard/ScheduledInterview";
import TopCard from "@/components/employer/dashboard/TopCard";
import EmployerSubscriptionUsageCards from "@/components/employer/dashboard/SubscriptionUsageCards";
import EmployerSubscriptionDetails from "@/components/employer/dashboard/SubscriptionDetails";
import SubscriptionWarning from "@/components/ui/subscription-warning";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const EmployerDashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="w-full space-y-10"> {/* Uniform GAP between sections */}
      <SubscriptionWarning onRenew={() => router.push('/plans')} />
      <TopCard companyId={user?.id || ""} />

      {/* Subscription Usage Cards */}
      <EmployerSubscriptionUsageCards />

      {/* Subscription Details */}
      <EmployerSubscriptionDetails />

      {/* First row: 2 Column */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <ApplicationTrends companyId={user?.id || ""} />
        <ApplicationStatusDistributionPie companyId={user?.id || ""} />
      </div>



    </div>
  );
};

export default EmployerDashboardPage;
