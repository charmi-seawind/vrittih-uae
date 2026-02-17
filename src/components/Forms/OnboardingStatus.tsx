"use client";

import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OnboardingStatusProps {
  pendingUserId: string | null;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  uploadedCV: string | null;
  currentStep: number;
}

const OnboardingStatus = ({ 
  pendingUserId, 
  isEmailVerified, 
  isMobileVerified, 
  uploadedCV, 
  currentStep 
}: OnboardingStatusProps) => {
  const statusItems = [
    {
      label: "Account Created",
      completed: !!pendingUserId,
      icon: pendingUserId ? CheckCircle : Clock
    },
    {
      label: "Email & Mobile Verified",
      completed: isEmailVerified && isMobileVerified,
      icon: (isEmailVerified && isMobileVerified) ? CheckCircle : Clock
    },
    {
      label: "CV Uploaded",
      completed: !!uploadedCV,
      icon: uploadedCV ? CheckCircle : Clock
    }
  ];

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-3">Your Progress</h3>
        <div className="space-y-2">
          {statusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Icon 
                  className={`w-4 h-4 ${
                    item.completed ? 'text-green-600' : 'text-gray-400'
                  }`} 
                />
                <span className={item.completed ? 'text-green-700' : 'text-gray-600'}>
                  {item.label}
                </span>
                {item.completed && (
                  <span className="text-xs text-green-600 font-medium">✓ Done</span>
                )}
              </div>
            );
          })}
        </div>
        
        {pendingUserId && (
          <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Your data is safely stored. You can continue from where you left off.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnboardingStatus;