"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/hooks/useSubscription";
import { useResumes } from "@/hooks/query-hooks/useResumes";
import { jobsAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { FileText, Briefcase, Download, Star } from "lucide-react";

const SubscriptionUsageCards = () => {
  const subscriptionResult = useSubscription();
  const { data: subscription, isLoading: loading } = subscriptionResult;
  
  const { data: resumesData } = useResumes();
  
  // Get applications data
  const { data: applicationsData } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => jobsAPI.getMyApplications({ page: 1, limit: 100 }),
    staleTime: 30 * 1000,
  });
  
  const resumes = resumesData?.data?.resumes || [];
  const applications = applicationsData?.data?.applications || [];
  

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

  if (!subscription) {
    return null;
  }

  // Get features from plan (backend structure: subscription.plan.features)
  const planFeatures = subscription?.plan?.features || subscription?.features || {};
  
  // Default values if features/usage not available
  const features = {
    cv_uploads: planFeatures.cv_uploads || 10,
    job_applications: planFeatures.job_applications || 5,
    job_withdrawals: planFeatures.job_withdrawals || 0,
    featured_jobs_access: planFeatures.featured_jobs_access || false
  };

  // Use real data for usage with localStorage fallback
  const getAppliedJobsCount = () => {
    if (applications.length > 0) return applications.length;
    
    // Fallback to localStorage
    try {
      const appliedJobsData = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (Array.isArray(appliedJobsData)) {
        return appliedJobsData.length;
      } else if (typeof appliedJobsData === 'object') {
        // Handle object format {userId: [jobIds]}
        return Object.values(appliedJobsData).flat().length;
      }
    } catch (e) {
    }
    return 0;
  };
  
  const usage = {
    cv_uploads_used: resumes.length,
    job_applications_used: getAppliedJobsCount(),
    job_withdrawals_used: 0 // TODO: Add withdrawal tracking
  };

  const cards = [
    {
      title: "CV Uploads",
      icon: FileText,
      current: usage.cv_uploads_used,
      total: features.cv_uploads,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Job Applications",
      icon: Briefcase,
      current: usage.job_applications_used,
      total: features.job_applications,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Withdrawals",
      icon: Download,
      current: usage.job_withdrawals_used,
      total: features.job_withdrawals,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Featured Jobs",
      icon: Star,
      current: features.featured_jobs_access ? 1 : 0,
      total: 1,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      isBoolean: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const percentage = card.isBoolean 
          ? (card.current > 0 ? 100 : 0)
          : (card.current / card.total) * 100;
        
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
                {card.isBoolean 
                  ? (card.current > 0 ? "Yes" : "No")
                  : `${card.current}/${card.total}`
                }
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {card.isBoolean 
                  ? (card.current > 0 ? "Access granted" : "No access")
                  : `${card.total - card.current} remaining`
                }
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionUsageCards;