"use client";

import ApplicationStatusDistributionPie from "@/components/JobSeeker/Dashboard/ApplicationStatusDistributionPie";
import RecommendedJob from "@/components/JobSeeker/Dashboard/RecommendedJob";
import TopCard from "@/components/JobSeeker/Dashboard/TopCard";
import SubscriptionDetails from "@/components/JobSeeker/Dashboard/SubscriptionDetails";
import SubscriptionUsageCards from "@/components/JobSeeker/Dashboard/SubscriptionUsageCards";
import SubscriptionWarning from "@/components/ui/subscription-warning";
import PaymentRejectedBanner from "@/components/JobSeeker/Dashboard/PaymentRejectedBanner";


import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  if (loading) {
    return (
      <div className="w-full min-h-screen p-2 sm:p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <div className="w-full min-h-screen p-2 sm:p-4 lg:p-6">
      <PaymentRejectedBanner userId={user.id} />
      <SubscriptionWarning onRenew={() => router.push('/plans')} />
      {/* Welcome Banner */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-green-800 dark:text-green-200">Job Seeker Dashboard</h2>
        <p className="text-xs sm:text-sm text-green-600 dark:text-green-300 mt-1">Welcome to your job seeker dashboard! Find jobs, track applications, and manage your career.</p>
      </div>
      
      {/* Top Cards Section */}
      <div className="mb-4 sm:mb-6">
        <TopCard />
      </div>
      
      {/* Subscription Usage Cards */}
      <div className="mb-4 sm:mb-6">
        <SubscriptionUsageCards />
      </div>
      
      {/* Profile & Analytics Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2 mb-4 sm:mb-6">
        <div className="w-full h-full">
          <SubscriptionDetails />
        </div>
        <div className="w-full h-full">
          <ApplicationStatusDistributionPie />
        </div>
      </div>
      
      {/* Recommended Jobs Section */}
      <div className="w-full">
        <RecommendedJob jobseekerId={user.id} />
      </div>
    </div>
  );
};
export default DashboardPage;