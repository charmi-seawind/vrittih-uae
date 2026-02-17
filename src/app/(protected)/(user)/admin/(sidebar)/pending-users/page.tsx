"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const PendingUsersPage = () => {
  const [pendingJobSeekers, setPendingJobSeekers] = useState([]);
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('job_seeker');

  useEffect(() => {
    // For now, we'll show a placeholder since we need to create the backend endpoint
    setLoading(false);
    setPendingJobSeekers([]);
    setPendingEmployers([]);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading pending users...</span>
      </div>
    );
  }

  const renderPendingUsersTable = (users: any[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">No pending {title.toLowerCase()} found</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {user.role?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.company_name || '-'}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button className="text-green-600 hover:text-green-800">Approve</button>
                      <button className="text-red-600 hover:text-red-800">Reject</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Users</h1>
        <p className="text-gray-600 mt-1">Manage users awaiting approval</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="job_seeker">Job Seekers</TabsTrigger>
          <TabsTrigger value="employer">Employers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="job_seeker">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading pending job seekers...</span>
            </div>
          ) : (
            renderPendingUsersTable(pendingJobSeekers, "Pending Job Seekers")
          )}
        </TabsContent>
        
        <TabsContent value="employer">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading pending employers...</span>
            </div>
          ) : (
            renderPendingUsersTable(pendingEmployers, "Pending Employers")
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PendingUsersPage;