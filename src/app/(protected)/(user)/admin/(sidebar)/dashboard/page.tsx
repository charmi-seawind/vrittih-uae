"use client";

import AdminTopCard from "@/components/admin/dashboard/AdminTopCard";
import AdminApplicationTrends from "@/components/admin/dashboard/AdminApplicationTrends";
import AdminApplicationStatusDistributionPie from "@/components/admin/dashboard/AdminApplicationStatusDistributionPie";
import CVUploadForm from "@/components/admin/CVUploadForm";
import ExportUsersDialog from "@/components/admin/ExportUsersDialog";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="w-full space-y-10">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and system overview</p>
        </div>
        <ExportUsersDialog />
      </div>

      {/* CV Upload Section */}
      <div className="flex justify-center">
        <CVUploadForm />
      </div>

      <AdminTopCard />

      {/* Analytics row: 2 Column */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <AdminApplicationTrends />
        <AdminApplicationStatusDistributionPie />
      </div>
    </div>
  );
};

export default AdminDashboardPage;