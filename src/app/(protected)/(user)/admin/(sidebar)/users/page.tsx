"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { adminAPI } from "@/services/api";

const UsersPage = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('job_seeker');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // First get all users to see what roles exist
      const allUsersResponse = await adminAPI.getAllUsers(1, 100);
      
      const allUsers = allUsersResponse.data.users || [];
      const jobSeekerUsers = allUsers.filter((user: any) => user.role === 'candidate');
      const employerUsers = allUsers.filter((user: any) => user.role === 'employer');
      
      
      setJobSeekers(jobSeekerUsers);
      setEmployers(employerUsers);
    } catch (error) {
      setJobSeekers([]);
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      employer: "bg-blue-100 text-blue-800",
      job_seeker: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800"
    };
    return (
      <Badge className={colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  const renderUsersTable = (users: any[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.company_name || '-'}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-gray-600 mt-1">Manage all registered users</p>
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
              <span className="ml-2">Loading job seekers...</span>
            </div>
          ) : (
            renderUsersTable(jobSeekers, "Job Seekers")
          )}
        </TabsContent>
        
        <TabsContent value="employer">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading employers...</span>
            </div>
          ) : (
            renderUsersTable(employers, "Employers")
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersPage;