"use client";
import { useState, useEffect } from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { AlertCircle, TrendingUp, Users, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

import { API_CONFIG } from '@/lib/config';
const chartConfig = {
  totalJobs: {
    label: "Total Jobs",
    color: "#10b981",
  },
  activeJobs: {
    label: "Active Jobs", 
    color: "#3b82f6",
  },
  featuredJobs: {
    label: "Featured Jobs",
    color: "#f59e0b",
  },
  totalApplicants: {
    label: "Total Applicants",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

interface ApplicationStatusDistributionPieProps {
  companyId: string;
}

const ApplicationStatusDistributionPie = ({ companyId }: ApplicationStatusDistributionPieProps) => {
  const [data, setData] = useState({
    jobCreated: 0,
    activeJobs: 0,
    featuredJobs: 0,
    totalApplicants: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_CONFIG.API_URL}/employer/${companyId}/dashboard-stats`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const result = await response.json();
          setData({
            jobCreated: result.data?.jobCreated ?? 0,
            activeJobs: result.data?.activeJobs ?? 0,
            featuredJobs: result.data?.featuredJobs ?? 0,
            totalApplicants: result.data?.totalApplicants ?? 0,
          });
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchData();
    }
  }, [companyId]);
  
  const totalStats = data.jobCreated + data.activeJobs + data.featuredJobs + data.totalApplicants;
  
  const chartData = [
    { name: "totalJobs", value: data.jobCreated, fill: chartConfig.totalJobs.color },
    { name: "activeJobs", value: data.activeJobs, fill: chartConfig.activeJobs.color },
    { name: "featuredJobs", value: data.featuredJobs, fill: chartConfig.featuredJobs.color },
    { name: "totalApplicants", value: data.totalApplicants, fill: chartConfig.totalApplicants.color },
  ].filter(item => item.value > 0);

  const getPercentage = (value: number) => {
    return totalStats > 0 ? ((value / totalStats) * 100).toFixed(1) : "0";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Loading stats...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <span className="font-medium">Failed to load data</span>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </div>
      );
    }

    if (totalStats === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Users className="h-12 w-12 mb-2 opacity-50" />
          <p className="text-sm">No data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  const percentage = getPercentage(data.value as number);
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium capitalize">{chartConfig[data.name as keyof typeof chartConfig]?.label}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-2xl font-bold">{data.value}</span>
                        <span className="text-muted-foreground ml-1">({percentage}%)</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalStats}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data).map(([status, count]) => {
            const statsMapping = {
              jobCreated: 'totalJobs',
              activeJobs: 'activeJobs', 
              featuredJobs: 'featuredJobs',
              totalApplicants: 'totalApplicants'
            };
            
            const configKey = statsMapping[status as keyof typeof statsMapping];
            const percentage = getPercentage(count);
            const config = chartConfig[configKey as keyof typeof chartConfig];
            
            if (!config) return null;
            
            return (
              <div key={status} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{percentage}%</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[500px] bg-gradient-to-br from-purple-50 to-pink-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Employer Stats
            </CardTitle>
            <CardDescription className="text-gray-600">Distribution of jobs and applicants</CardDescription>
          </div>
          {totalStats > 0 && (
            <Badge variant="outline" className="font-mono bg-white/50">
              {totalStats} Total
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 h-[400px] overflow-hidden">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusDistributionPie;