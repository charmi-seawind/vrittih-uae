"use client";

import SidebarContainer from "@/components/Global/SidebarContainer";
import JobPostForm from "@/components/employer/JobPostForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Plus, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { planAPI } from "@/services/planAPI";

export default function CreateJobPage() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await planAPI.getCurrentSubscription().catch(() => null);
        if (response?.data?.status) {
          setSubscriptionStatus(response.data.status);
        }
      } finally {
        setLoading(false);
      }
    };
    checkSubscription();
  }, []);

  if (loading) {
    return (
      <SidebarContainer>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </SidebarContainer>
    );
  }

  if (subscriptionStatus === 'pending') {
    return (
      <SidebarContainer>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              Payment Verification Pending
            </h3>
            <p className="text-yellow-700 text-center mb-4 max-w-md">
              Your payment is currently being verified. You will be able to post jobs once your payment is verified.
            </p>
            <p className="text-sm text-yellow-600">
              This usually takes 24-48 hours.
            </p>
          </CardContent>
        </Card>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
              <p className="text-gray-600 mt-1">Create a new job posting to attract candidates</p>
            </div>
          </div>
        </div>
        
        <JobPostForm />
      </div>
    </SidebarContainer>
  );
}