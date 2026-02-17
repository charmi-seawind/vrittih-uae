"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Settings, Shield, Mail, MoreVertical, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function TeamAccessPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Admin",
      department: "HR",
      status: "Active",
      lastActive: "2 hours ago",
      permissions: ["Full Access"]
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@company.com",
      role: "Recruiter",
      department: "HR",
      status: "Active",
      lastActive: "1 day ago",
      permissions: ["View Jobs", "Manage Applications"]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@company.com",
      role: "Hiring Manager",
      department: "Engineering",
      status: "Active",
      lastActive: "3 hours ago",
      permissions: ["View Jobs", "Interview Candidates"]
    },
    {
      id: 4,
      name: "David Kim",
      email: "d.kim@company.com",
      role: "Viewer",
      department: "Marketing",
      status: "Pending",
      lastActive: "Never",
      permissions: ["View Only"]
    }
  ];

  const pendingInvitations = [
    {
      email: "alex.smith@company.com",
      role: "Recruiter",
      sentDate: "2024-01-15",
      expiresDate: "2024-01-22"
    },
    {
      email: "lisa.wong@company.com",
      role: "Hiring Manager",
      sentDate: "2024-01-14",
      expiresDate: "2024-01-21"
    }
  ];

  const roles = [
    {
      name: "Admin",
      description: "Full access to all features and settings",
      permissions: ["Manage team", "View analytics", "Manage jobs", "Manage applications", "Billing access"]
    },
    {
      name: "Recruiter",
      description: "Can manage jobs and applications",
      permissions: ["Manage jobs", "Manage applications", "View analytics", "Schedule interviews"]
    },
    {
      name: "Hiring Manager",
      description: "Can review applications and conduct interviews",
      permissions: ["View jobs", "Review applications", "Schedule interviews", "Provide feedback"]
    },
    {
      name: "Viewer",
      description: "Read-only access to jobs and applications",
      permissions: ["View jobs", "View applications"]
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge variant="destructive">{role}</Badge>;
      case "Recruiter":
        return <Badge variant="default">{role}</Badge>;
      case "Hiring Manager":
        return <Badge variant="secondary">{role}</Badge>;
      case "Viewer":
        return <Badge variant="outline">{role}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Inactive":
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Access</h1>
          <p className="text-muted-foreground">Manage team members and their permissions</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invitations</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Mail className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search team members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/avatars/${member.name.toLowerCase().replace(' ', '-')}.jpg`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{member.department}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">Last active {member.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getRoleBadge(member.role)}
                          {getStatusBadge(member.status)}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.slice(0, 2).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {member.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingInvitations.map((invitation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Role: {invitation.role}</span>
                        <span>•</span>
                        <span>Sent: {invitation.sentDate}</span>
                        <span>•</span>
                        <span>Expires: {invitation.expiresDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Resend
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{role.name}</span>
                    {getRoleBadge(role.name)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Permissions:</h4>
                    <div className="space-y-1">
                      {role.permissions.map((permission) => (
                        <div key={permission} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}