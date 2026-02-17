"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJobManagement } from "@/hooks/useJobManagement";
import { Calendar, CreditCard, Package, ArrowUpRight } from "lucide-react";

const EmployerSubscriptionDetails = () => {
  const { subscription } = useJobManagement();

  if (!subscription) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = () => {
    const expiryDateStr = subscription?.expires_at || subscription?.end_date || subscription?.endDate;
    if (!expiryDateStr) return false;
    const expiryDate = new Date(expiryDateStr);
    if (isNaN(expiryDate.getTime())) return false;
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Subscription Details
          </CardTitle>
          <Badge 
            variant={subscription.status === 'active' ? 'default' : 'secondary'}
            className={subscription?.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          >
            {subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Plan Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="font-semibold text-gray-900">{subscription?.plan?.name || subscription?.planName || 'Unknown Plan'}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="font-semibold text-gray-900">₹{subscription?.amount_paid || subscription?.plan?.price || subscription?.price || 'N/A'}</p>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isExpiringSoon() ? 'bg-red-100' : 'bg-orange-100'}`}>
              <Calendar className={`h-4 w-4 ${isExpiringSoon() ? 'text-red-600' : 'text-orange-600'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expires On</p>
              <p className={`font-semibold ${isExpiringSoon() ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(subscription?.expires_at || subscription?.end_date || subscription?.endDate)}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/employer/upgrade-plans'}
              className="flex items-center gap-2"
            >
              <ArrowUpRight className="h-4 w-4" />
              {isExpiringSoon() ? 'Renew Plan' : 'Upgrade Plan'}
            </Button>
          </div>
        </div>

        {isExpiringSoon() && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              ⚠️ Your subscription expires soon. Renew now to continue posting jobs and accessing premium features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployerSubscriptionDetails;