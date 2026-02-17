"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";

const AdminTopCard = () => {
  const { stats, loading, error, refreshStats } = useAdminDashboardStats();

  const renderValue = (value: number) => {
    if (loading) {
      return <Skeleton className="w-[35px] h-[35px]" />;
    }
    return value === 0 ? <span>0</span> : <NumberTicker value={value} />;
  };

  if (error) {
    return (
      <div className="mt-5 p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard Stats</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <Button onClick={refreshStats} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const analytics = stats || {
    totalUsers: 0,
    totalEmployers: 0,
    totalJobSeekers: 0,
    activeUsers: 0,
    activeJobSeekers: 0,
    activeEmployers: 0,
    inactiveUsers: 0,
    inactiveJobSeekers: 0,
    inactiveEmployers: 0,
    totalPendingUsers: 0,
    totalPendingEmployers: 0,
    totalPendingJobSeekers: 0,
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0,
    featuredJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    reviewedApplications: 0,
    shortlistedApplications: 0,
    totalSubscribedUsers: 0,
    totalUnsubscribedUsers: 0,
    totalCancelledUsers: 0,
    totalAmount: 0,
    totalSubscribedAmount: 0,
    totalUnsubscribedAmount: 0,
    totalCancelledAmount: 0,
    totalPendingAmount: 0
  };

  return (
    <div className="mt-5 flex flex-col space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Dashboard Statistics</h2>
        <Button 
          onClick={refreshStats} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Subscription & Revenue - Top Priority */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Subscription & Revenue</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Subscribed Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">{renderValue(analytics.totalSubscribedUsers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Unsubscribed Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">{renderValue(analytics.totalUnsubscribedUsers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cancelled Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gray-600">{renderValue(analytics.totalCancelledUsers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">₹{renderValue(analytics.totalAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Subscribed Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">₹{renderValue(analytics.totalSubscribedAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cancelled Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gray-600">₹{renderValue(analytics.totalCancelledAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">₹{renderValue(analytics.totalPendingAmount)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">User Statistics</h3>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{renderValue(analytics.totalUsers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{renderValue(analytics.totalEmployers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{renderValue(analytics.totalJobSeekers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">{renderValue(analytics.activeUsers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">{renderValue(analytics.activeJobSeekers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">{renderValue(analytics.activeEmployers)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inactive Users */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Inactive Users</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Inactive Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">{renderValue(analytics.inactiveUsers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Inactive Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">{renderValue(analytics.inactiveJobSeekers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Inactive Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">{renderValue(analytics.inactiveEmployers)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Users */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Pending Users</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Pending Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">{renderValue(analytics.totalPendingUsers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">{renderValue(analytics.totalPendingEmployers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">{renderValue(analytics.totalPendingJobSeekers)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Job Statistics</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{renderValue(analytics.totalJobs)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">{renderValue(analytics.activeJobs)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Inactive Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">{renderValue(analytics.inactiveJobs)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Featured Jobs ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-yellow-600">{renderValue(analytics.featuredJobs)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Application Statistics</h3>
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{renderValue(analytics.totalApplications)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">{renderValue(analytics.pendingApplications)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">{renderValue(analytics.rejectedApplications)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Reviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-600">{renderValue(analytics.reviewedApplications)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Shortlisted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">{renderValue(analytics.shortlistedApplications)}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTopCard;