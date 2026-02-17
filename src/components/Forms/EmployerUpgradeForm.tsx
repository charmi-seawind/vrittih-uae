"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminAPI } from '@/services/api';
import { planAPI } from '@/services/planAPI';
import { useRouter } from 'next/navigation';

const EmployerUpgradeForm = ({ onComplete }: { onComplete: () => void }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionResponse, plansResponse] = await Promise.all([
          planAPI.getCurrentSubscription().catch(() => null),
          adminAPI.getPlansByUserType('employer')
        ]);

        if (subscriptionResponse?.data?.subscription) {
          setCurrentPlan(subscriptionResponse.data.subscription);
        }

        const fetchedPlans = plansResponse.data.plans.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          price: parseFloat(plan.price),
          duration: plan.duration,
          features: Object.keys(plan.features || {})
            .filter(key => !isNaN(Number(key)))
            .map(key => plan.features[key])
        }));
        
        setPlans(fetchedPlans);
      } catch (error) {
        toast.error('Failed to load plans');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order for upgrade
      const orderResponse = await fetch('/api/job-seeker/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.price,
          planId: planId,
          userId: JSON.parse(localStorage.getItem('user') || '{}').id
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');
      const { orderId } = await orderResponse.json();

      // Open Razorpay checkout
      const options = {
        key: "rzp_live_RrtsJrVleUY6RP",
        amount: selectedPlan.price * 100,
        currency: 'INR',
        name: 'Vrrittih',
        description: `Upgrade to ${selectedPlan.name} Plan`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // After successful payment, upgrade subscription
            const upgradeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/subscribe`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                plan_id: planId,
                payment_id: response.razorpay_payment_id
              })
            });

            const result = await upgradeResponse.json();
            
            if (upgradeResponse.ok && result.success) {
              toast.success('Plan upgraded successfully!');
              onComplete();
            } else {
              throw new Error(result.message || 'Upgrade failed');
            }
          } catch (error: any) {
            toast.error(error.message || 'Upgrade failed');
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Employer',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {plans.map((plan) => {
        const isCurrentPlan = currentPlan && parseFloat(currentPlan.price) === plan.price;
        const isDowngrade = currentPlan && plan.price < parseFloat(currentPlan.price);
        
        return (
          <Card key={plan.id} className={isCurrentPlan ? "border-green-500 border-2" : ""}>
            <CardHeader>
              <CardTitle className="text-center">
                <div className="text-lg font-bold">{plan.name}</div>
                <div className="text-3xl font-bold text-primary mt-2">₹{plan.price}</div>
                <div className="text-sm text-muted-foreground">for {plan.duration} days</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={isProcessing || isCurrentPlan || isDowngrade}
                className="w-full"
                variant={isCurrentPlan ? 'outline' : isDowngrade ? 'secondary' : 'default'}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : isDowngrade ? (
                  'Lower Plan'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EmployerUpgradeForm;