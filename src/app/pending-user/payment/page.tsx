"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PaymentStepForm from "@/components/Forms/PaymentStepForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PendingUserPayment = () => {
  const router = useRouter();
  const [pendingUserId, setPendingUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("pendingUserToken");
    const storedPendingUserId = localStorage.getItem("pendingUserId");
    
    if (!token || !storedPendingUserId) {
      router.push("/pending-user/login");
      return;
    }
    
    setPendingUserId(storedPendingUserId);
  }, []);

  const handlePaymentComplete = () => {
    // Clear pending user data
    localStorage.removeItem("pendingUserToken");
    localStorage.removeItem("pendingUserId");
    
    // Redirect to regular user dashboard
    router.push("/job-seeker/dashboard");
  };

  const handleBack = () => {
    router.push("/pending-user/dashboard");
  };

  if (!pendingUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Complete Payment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Choose Your Plan
            </CardTitle>
            <p className="text-center text-gray-600">
              Complete your payment to activate your job seeker account
            </p>
          </CardHeader>
          <CardContent>
            <PaymentStepForm 
              onComplete={handlePaymentComplete}
              ref={null}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingUserPayment;