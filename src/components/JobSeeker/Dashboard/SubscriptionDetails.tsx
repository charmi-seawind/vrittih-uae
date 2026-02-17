"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { API_CONFIG } from '@/lib/config';
const SubscriptionDetails = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    fetchSubscription();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!subscription?.endDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const endTime = new Date(subscription.endDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m`);
        }
      } else {
        setTimeRemaining('Expired');
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [subscription]);

  const fetchSubscription = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${API_CONFIG.API_URL}/user/${user.id}/subscription`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.data.subscription);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {subscription?.status === 'pending' ? (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="text-yellow-800 font-semibold text-lg mb-2">
                Payment Verification Pending
              </div>
              <p className="text-yellow-700 text-sm">
                Your subscription is not active until your payment is verified by admin.
              </p>
            </div>
          </div>
        ) : subscription?.status === 'rejected' ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-800 font-semibold text-lg mb-2">
                Payment Verification Rejected
              </div>
              <p className="text-red-700 text-sm">
                Your payment verification was rejected. Please contact support at support@vrrittih.com
              </p>
            </div>
          </div>
        ) : subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{subscription.planName}</h3>
                <p className="text-sm text-muted-foreground">{subscription.duration}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{subscription.price}</div>
                <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {subscription.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              {/* Countdown Timer */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Time Remaining</span>
                </div>
                <div className="text-lg font-bold text-orange-700 mt-1">
                  {timeRemaining || 'Calculating...'}
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valid from</span>
                <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valid until</span>
                <span className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No active subscription found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionDetails;