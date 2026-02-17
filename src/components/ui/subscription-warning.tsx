"use client";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

interface SubscriptionWarningProps {
  onRenew: () => void;
}

const SubscriptionWarning = ({ onRenew }: SubscriptionWarningProps) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/subscriptions/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setSubscriptionStatus(data.data);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkStatus();
  }, []);

  if (!subscriptionStatus?.isExpiring || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              ⚠️ Your subscription expires in {subscriptionStatus.daysLeft} days! Renew now to continue using all features.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={onRenew}
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Renew Now
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setDismissed(true)}
              className="text-white hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionWarning;