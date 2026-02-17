"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, Clock, Target, TrendingUp, CheckCircle, Calendar, Download, UserCheck } from "lucide-react";

export default function HiringAnalyticsPage() {
  const hiringFunnelData = [
    { stage: "Applications", count: 210, percentage: 100 },
    { stage: "Screening", count: 84, percentage: 40 },
    { stage: "Interview", count: 42, percentage: 20 },
    { stage: "Final Round", count: 12, percentage: 5.7 },
    { stage: "Hired", count: 4, percentage: 1.9 }
  ];

  const timeToHireData = [
    { month: "Aug", days: 32 },
    { month: "Sep", days: 28 },
    { month: "Oct", days: 35 },
    { month: "Nov", days: 30 },
    { month: "Dec", days: 25 },
    { month: "Jan", days: 28 }
  ];

  const hiringByDepartment = [
    { name: "Engineering", hired: 8, color: "#3b82f6" },
    { name: "Product", hired: 3, color: "#10b981" },
    { name: "Design", hired: 2, color: "#f59e0b" },
    { name: "Marketing", hired: 2, color: "#ef4444" },
    { name: "Sales", hired: 1, color: "#8b5cf6" }
  ];

  const recentHires = [
    {
      name: "Sarah Johnson",
      position: "Senior Frontend Developer",
      department: "Engineering",
      hiredDate: "2024-01-15",
      timeToHire: 25,
      source: "LinkedIn"
    },
    {
      name: "Michael Chen",
      position: "Product Manager",
      department: "Product",
      hiredDate: "2024-01-12",
      timeToHire: 32,
      source: "Company Website"
    },
    {
      name: "Emily Rodriguez",
      position: "UX Designer",
      department: "Design",
      hiredDate: "2024-01-10",
      timeToHire: 28,
      source: "Referral"
    }
  ];

  const interviewMetrics = [
    { type: "Phone Screen", scheduled: 45, completed: 42, noShow: 3, passRate: 67 },
    { type: "Technical", scheduled: 28, completed: 26, noShow: 2, passRate: 73 },
    { type: "Final", scheduled: 19, completed: 18, noShow: 1, passRate: 67 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hiring Analytics</h1>
          <p className="text-muted-foreground">Track your hiring process performance and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hired</p>
                <p className="text-2xl font-bold">16</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+33%</span>
                </div>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</p>
                <p className="text-2xl font-bold">28 days</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">-3 days</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hire Rate</p>
                <p className="text-2xl font-bold">7.6%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+1.2%</span>
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
                <p className="text-sm font-medium text-muted-foreground">Active Interviews</p>
                <p className="text-2xl font-bold">12</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">This week</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-6">
        <TabsList>
          <TabsTrigger value="funnel">Hiring Funnel</TabsTrigger>
          <TabsTrigger value="time-to-hire">Time to Hire</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="interviews">Interview Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hiringFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stage.count}</span>
                        <Badge variant="secondary">{stage.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    {index < hiringFunnelData.length - 1 && (
                      <div className="flex justify-center mt-2">
                        <div className="w-px h-4 bg-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-to-hire" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Time to Hire Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeToHireData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} days`, "Time to Hire"]} />
                  <Line type="monotone" dataKey="days" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiring by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hiringByDepartment}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="hired"
                      label={({ name, hired }) => `${name}: ${hired}`}
                    >
                      {hiringByDepartment.map((entry, index) => (
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
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hiringByDepartment.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{dept.hired} hired</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((dept.hired / 16) * 100)}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {interviewMetrics.map((metric) => (
                  <div key={metric.type} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">{metric.type} Interview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{metric.scheduled}</div>
                        <div className="text-sm text-muted-foreground">Scheduled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{metric.completed}</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{metric.noShow}</div>
                        <div className="text-sm text-muted-foreground">No Show</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{metric.passRate}%</div>
                        <div className="text-sm text-muted-foreground">Pass Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Hires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Recent Hires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentHires.map((hire) => (
              <div key={hire.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {hire.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{hire.name}</h3>
                    <p className="text-sm text-muted-foreground">{hire.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary">{hire.department}</Badge>
                    <span className="text-muted-foreground">{hire.timeToHire} days</span>
                    <span className="text-muted-foreground">via {hire.source}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Hired on {hire.hiredDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}