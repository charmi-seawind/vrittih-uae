"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { Building, Eye, Users, TrendingUp, Star, Calendar, Download, Globe, MapPin } from "lucide-react";

export default function CompanyAnalyticsPage() {
  const profileViewsData = [
    { month: "Aug", views: 1200, followers: 45 },
    { month: "Sep", views: 1450, followers: 52 },
    { month: "Oct", views: 1680, followers: 61 },
    { month: "Nov", views: 1520, followers: 58 },
    { month: "Dec", views: 1890, followers: 67 },
    { month: "Jan", views: 2100, followers: 74 }
  ];

  const employeeGrowthData = [
    { quarter: "Q1 2023", employees: 45 },
    { quarter: "Q2 2023", employees: 52 },
    { quarter: "Q3 2023", employees: 58 },
    { quarter: "Q4 2023", employees: 61 },
    { quarter: "Q1 2024", employees: 67 }
  ];

  const brandMetrics = [
    { metric: "Brand Awareness", score: 78, change: "+12%" },
    { metric: "Employee Satisfaction", score: 85, change: "+5%" },
    { metric: "Glassdoor Rating", score: 4.2, change: "+0.3" },
    { metric: "Social Media Reach", score: 15600, change: "+23%" }
  ];

  const topLocations = [
    { city: "San Francisco", views: 450, applications: 67 },
    { city: "New York", views: 380, applications: 52 },
    { city: "Austin", views: 320, applications: 41 },
    { city: "Seattle", views: 290, applications: 38 },
    { city: "Boston", views: 240, applications: 32 }
  ];

  const competitorComparison = [
    { company: "Your Company", jobPostings: 12, avgSalary: 125000, rating: 4.2 },
    { company: "TechCorp A", jobPostings: 18, avgSalary: 130000, rating: 4.1 },
    { company: "TechCorp B", jobPostings: 15, avgSalary: 120000, rating: 4.3 },
    { company: "TechCorp C", jobPostings: 22, avgSalary: 135000, rating: 3.9 }
  ];

  const industryBenchmarks = [
    { metric: "Time to Hire", yourCompany: 28, industry: 32, unit: "days" },
    { metric: "Cost per Hire", yourCompany: 4500, industry: 5200, unit: "$" },
    { metric: "Employee Retention", yourCompany: 92, industry: 87, unit: "%" },
    { metric: "Offer Acceptance", yourCompany: 78, industry: 73, unit: "%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Analytics</h1>
          <p className="text-muted-foreground">Track your company's performance and market presence</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 6 Months
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
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">2,100</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+11.2%</span>
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
                <p className="text-sm font-medium text-muted-foreground">Followers</p>
                <p className="text-2xl font-bold">74</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+10.4%</span>
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
                <p className="text-sm font-medium text-muted-foreground">Company Rating</p>
                <p className="text-2xl font-bold">4.2</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-green-500">+0.3</span>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">67</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+9.8%</span>
                </div>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth Metrics</TabsTrigger>
          <TabsTrigger value="locations">Geographic Data</TabsTrigger>
          <TabsTrigger value="benchmarks">Industry Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Views & Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={profileViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="followers" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brandMetrics.map((metric) => (
                  <div key={metric.metric} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-muted-foreground">{metric.change} from last period</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{metric.score}</p>
                      <Badge variant="secondary" className="text-xs">
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={employeeGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="employees" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorComparison.map((company, index) => (
                    <div key={company.company} className={`p-3 rounded-lg border ${index === 0 ? 'bg-blue-50 border-blue-200' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${index === 0 ? 'text-blue-700' : ''}`}>
                          {company.company}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{company.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Job Postings: </span>
                          <span className="font-medium">{company.jobPostings}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Salary: </span>
                          <span className="font-medium">${(company.avgSalary / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Top Locations by Interest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <div key={location.city} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{location.city}</h3>
                        <p className="text-sm text-muted-foreground">
                          {location.views} profile views
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {location.applications} applications
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((location.applications / location.views) * 100).toFixed(1)}% conversion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarks Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {industryBenchmarks.map((benchmark) => (
                  <div key={benchmark.metric} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{benchmark.metric}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-600 font-semibold">
                          You: {benchmark.unit === '$' ? '$' : ''}{benchmark.yourCompany}{benchmark.unit !== '$' ? benchmark.unit : ''}
                        </span>
                        <span className="text-muted-foreground">
                          Industry: {benchmark.unit === '$' ? '$' : ''}{benchmark.industry}{benchmark.unit !== '$' ? benchmark.unit : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ 
                            width: `${(benchmark.yourCompany / Math.max(benchmark.yourCompany, benchmark.industry)) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ 
                            width: `${(benchmark.industry / Math.max(benchmark.yourCompany, benchmark.industry)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Your Performance</span>
                      <span>Industry Average</span>
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