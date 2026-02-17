"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useJobManagement } from "@/hooks/useJobManagement";
import { Briefcase, Star, Building, TrendingUp } from "lucide-react";

const EmployerSubscriptionUsageCards = () => {
  const { subscription, getRemainingFeaturedJobs } = useJobManagement();

  if (!subscription) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const features = subscription?.plan?.features || subscription?.features || {
    job_posts: 5,
    featured_jobs: 0,
    featured_company: false
  };

  const usage = subscription?.usage || {
    job_posts_used: 0,
    featured_jobs_used: 0
  };

  const remainingFeaturedJobs = getRemainingFeaturedJobs();

  const cards = [
    {
      title: "Job Posts",
      icon: Briefcase,
      current: usage.job_posts_used,
      total: features.job_posts,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Featured Jobs",
      icon: Star,
      current: usage.featured_jobs_used,
      total: features.featured_jobs,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Featured Company",
      icon: Building,
      current: features.featured_company ? 1 : 0,
      total: 1,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      isBoolean: true
    },
    {
      title: "Plan Status",
      icon: TrendingUp,
      current: 1,
      total: 1,
      color: "text-green-600",
      bgColor: "bg-green-100",
      isStatus: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        let percentage = 0;
        let displayText = "";
        let subText = "";

        if (card.isBoolean) {
          percentage = card.current > 0 ? 100 : 0;
          displayText = card.current > 0 ? "Yes" : "No";
          subText = card.current > 0 ? "Access granted" : "No access";
        } else if (card.isStatus) {
          percentage = 100;
          displayText = subscription?.plan?.name || subscription?.planName || 'Unknown Plan';
          subText = subscription?.status === 'active' ? 'Active' : 'Inactive';
        } else {
          if (card.total === -1) {
            percentage = 100;
            displayText = `${card.current}/∞`;
            subText = "Unlimited";
          } else {
            percentage = card.total > 0 ? (card.current / card.total) * 100 : 0;
            displayText = `${card.current}/${card.total}`;
            subText = `${Math.max(0, card.total - card.current)} remaining`;
          }
        }
        
        const Icon = card.icon;
        
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`w-8 h-8 ${card.bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {displayText}
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {subText}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EmployerSubscriptionUsageCards;