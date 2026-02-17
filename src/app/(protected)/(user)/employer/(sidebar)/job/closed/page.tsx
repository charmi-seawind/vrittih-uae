"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Archive, Search, Filter, Calendar, Users, Eye, RotateCcw, Download } from "lucide-react";
import { useState } from "react";

export default function ClosedJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const closedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      closedDate: "2024-01-15",
      applications: 45,
      hired: 1,
      reason: "Position Filled",
      salary: "$120k - $150k"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      closedDate: "2024-01-10",
      applications: 67,
      hired: 1,
      reason: "Position Filled",
      salary: "$130k - $160k"
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "New York, NY",
      closedDate: "2024-01-05",
      applications: 32,
      hired: 0,
      reason: "Budget Constraints",
      salary: "$90k - $120k"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Austin, TX",
      closedDate: "2023-12-28",
      applications: 28,
      hired: 1,
      reason: "Position Filled",
      salary: "$110k - $140k"
    }
  ];

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "Position Filled":
        return <Badge variant="default">Position Filled</Badge>;
      case "Budget Constraints":
        return <Badge variant="destructive">Budget Constraints</Badge>;
      case "Requirements Changed":
        return <Badge variant="secondary">Requirements Changed</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Closed Jobs</h1>
          <p className="text-muted-foreground">View and manage your closed job postings</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Closed</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Archive className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successfully Filled</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">892</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time to Fill</p>
                <p className="text-2xl font-bold">28d</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search closed jobs..."
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

      {/* Jobs List */}
      <div className="space-y-4">
        {closedJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {job.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        {getReasonBadge(job.reason)}
                        <Badge variant="outline">Closed on {job.closedDate}</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{job.applications} applications</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{job.hired} hired</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Repost
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {closedJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Closed Jobs</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any closed job postings yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}