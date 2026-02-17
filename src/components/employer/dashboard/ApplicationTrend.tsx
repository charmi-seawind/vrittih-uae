"use client";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { API_CONFIG } from '@/lib/config';
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
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  applications: {
    label: "Jobs Created",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ApplicationTrendsProps {
  companyId: string;
}

const ApplicationTrends = ({ companyId }: ApplicationTrendsProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_CONFIG.API_URL}/employer/${companyId}/jobs`,
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
          const jobs = result.body?.jobs || [];
          
          // Group jobs by month
          const monthlyData = jobs.reduce((acc: any, job: any) => {
            const date = new Date(job.createdAt || job.created_at);
            const monthKey = date.toLocaleString('default', { month: 'long' });
            
            if (!acc[monthKey]) {
              acc[monthKey] = 0;
            }
            acc[monthKey]++;
            return acc;
          }, {});
          
          
          // Convert to chart format - show only last 6 months
          const currentDate = new Date();
          const last6Months = [];
          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'long' });
            last6Months.push({
              month: monthName.slice(0, 3),
              applications: monthlyData[monthName] || 0
            });
          }
          
          const data = last6Months;
          
          setChartData(data);
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

  const renderChart = () => {
    return (
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="applications"
            type="natural"
            fill="var(--color-applications)"
            fillOpacity={0.4}
            stroke="var(--color-applications)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Failed to load data</p>
          </div>
        </div>
      );
    }

    return renderChart();
  };

  return (
    <Card className="h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Job Creation Trends
        </CardTitle>
        <CardDescription className="text-gray-600">
          Monthly job posting trends
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2 h-[400px]">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ApplicationTrends;