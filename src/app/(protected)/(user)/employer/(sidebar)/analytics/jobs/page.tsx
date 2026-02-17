"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Eye, Users, Clock, Target, Download, Calendar } from "lucide-react";

export default function JobAnalyticsPage() {
  const jobPerformanceData = [
    { name: "Frontend Dev", applications: 45, views: 320, hired: 1 },
    { name: "Backend Dev", applications: 38, views: 280, hired: 1 },
    { name: "Product Manager", applications: 67, views: 450, hired: 1 },
    { name: "UX Designer", applications: 32, views: 240, hired: 0 },
    { name: "DevOps Engineer", applications: 28, views: 190, hired: 1 }
  ];

  const applicationTrendData = [
    { month: "Aug", applications: 120 },
    { month: "Sep", applications: 145 },
    { month: "Oct", applications: 180 },
    { month: "Nov", applications: 165 },
    { month: "Dec", applications: 210 },
    { month: "Jan", applications: 195 }
  ];

  const sourceData = [
    { name: "Job Boards", value: 45, color: "#3b82f6" },
    { name: "Company Website", value: 25, color: "#10b981" },
    { name: "Social Media", value: 15, color: "#f59e0b" },
    { name: "Referrals", value: 10, color: "#ef4444" },
    { name: "Direct", value: 5, color: "#8b5cf6" }
  ];

  const topJobs = [
    { title: "Senior Frontend Developer", applications: 45, views: 320, conversionRate: 14.1 },
    { title: "Product Manager", applications: 67, views: 450, conversionRate: 14.9 },
    { title: "Backend Developer", applications: 38, views: 280, conversionRate: 13.6 },
    { title: "UX Designer", applications: 32, views: 240, conversionRate: 13.3 },
    { title: "DevOps Engineer", applications: 28, views: 190, conversionRate: 14.7 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Analytics</h1>
          <p className="text-muted-foreground">Track performance and insights for your job postings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">1,480</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">210</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+8.3%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">14.2%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">-2.1%</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time to Apply</p>
                <p className="text-2xl font-bold">2.4d</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">-0.3d</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Job Performance</TabsTrigger>
          <TabsTrigger value="trends">Application Trends</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="top-jobs">Top Performing Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={jobPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" name="Views" />
                  <Bar dataKey="applications" fill="#10b981" name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Trends (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={applicationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sourceData.map((source) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="font-medium">{source.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{source.value}%</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(source.value * 2.1)} applications
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top-jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topJobs.map((job, index) => (
                  <div key={job.title} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{job.views} views</span>
                          <span>•</span>
                          <span>{job.applications} applications</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {job.conversionRate}% conversion
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}