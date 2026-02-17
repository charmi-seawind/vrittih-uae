"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { adminAPI } from '@/services/api';
import { planAPI } from '@/services/planAPI';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentStepFormProps {
  onComplete: () => void;
  onPayment?: (selectedPlan: string) => Promise<boolean>;
}

const PaymentStepForm = forwardRef<{ getSelectedPlan: () => string; handleContinueToPayment: () => void }, PaymentStepFormProps>(({ onComplete, onPayment }, ref) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<any>(null);

  const { pendingUserId, reset: resetOnboarding } = useOnboardingStore();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        setLoadingSubscription(false); // Skip subscription check for onboarding
        
        const response = await adminAPI.getPlansByUserType('job_seeker');
        const fetchedPlans = response.data.plans.map((plan: any) => {
          let features = [];
          if (plan.features && typeof plan.features === 'object') {
            const displayFeatures = [];
            Object.keys(plan.features).forEach(key => {
              if (!isNaN(Number(key))) {
                displayFeatures.push(plan.features[key]);
              }
            });
            
            if (displayFeatures.length > 0) {
              features = displayFeatures;
            } else {
              features = [
                `CV Uploads: ${plan.features.cv_uploads || 1}`,
                `Job Applications: ${plan.features.job_applications || 3}`,
                `Job Withdrawals: ${plan.features.job_withdrawals || 0}`,
                plan.features.featured_jobs_access ? 'Featured Jobs Access' : 'No Featured Jobs'
              ];
            }
          }
          
          return {
            id: plan.id,
            name: plan.name,
            price: parseFloat(plan.price),
            duration: plan.duration,
            features: features
          };
        });
        setPlans(fetchedPlans);
        if (fetchedPlans.length > 0) {
          setSelectedPlan(fetchedPlans[0].id);
        }
      } catch (error) {
        toast.error('Failed to load plans');
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  useImperativeHandle(ref, () => ({
    getSelectedPlan: () => selectedPlan,
    handleContinueToPayment: handleContinueToPayment
  }));

  const getPendingUserId = () => {
    // Only for new registration flow
    return pendingUserId;
  };

  const handleContinueToPayment = () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    handleRazorpayPayment();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    if (!selectedPlanData) return;

    setIsProcessing(true);
    try {
      const currentPendingUserId = getPendingUserId();
      if (!currentPendingUserId) throw new Error('Registration session expired. Please start again.');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const orderResponse = await fetch('/api/job-seeker/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlanData.price,
          planId: selectedPlan,
          pendingUserId: currentPendingUserId
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');
      const { orderId, subscriptionId, hasAutoRenewal } = await orderResponse.json();
      


      // Open Razorpay checkout
      const options = {
        key: "rzp_live_RrtsJrVleUY6RP",
        amount: selectedPlanData.price * 100,
        currency: 'INR',
        name: 'Vrrittih',
        description: `${selectedPlanData.name} Plan`,
        order_id: orderId,
        handler: async (response: any) => {
          toast.loading('Verifying payment...', { id: 'payment-verify' });
          try {
            const verifyResponse = await fetch('/api/job-seeker/verify-razorpay-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                pendingUserId: currentPendingUserId,
                planId: selectedPlan,
                razorpay_subscription_id: subscriptionId
              })
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json().catch(() => ({}));
              
              if (errorData.code === 'SESSION_EXPIRED') {
                toast.error('Session expired. Redirecting to registration...', { id: 'payment-verify' });
                setTimeout(() => {
                  router.push('/onboarding/job-seeker');
                }, 2000);
                return;
              }
              
              throw new Error(errorData.error || 'Payment verification failed');
            }
            
            const result = await verifyResponse.json();
            
            if (!result.success) {
              throw new Error(result.error || 'Payment verification failed');
            }
            
            const apiData = result?.data;
            const user = apiData?.user;
            const token = apiData?.token;
            
            if (user && token) {
              // Clear all onboarding data
              localStorage.removeItem('pendingUserId');
              localStorage.removeItem('onboarding-storage');
              localStorage.removeItem('appliedJobs');
              sessionStorage.removeItem('pendingUserId');
              
              // Clear Razorpay data
              localStorage.removeItem('rzp_checkout_anon_id');
              localStorage.removeItem('rzp_device_id');
              localStorage.removeItem('rzp_stored_checkout_id');
              
              // Reset onboarding store
              resetOnboarding();
              
              // Set only user and token
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              login(user, token);
              
              toast.success('Payment successful! Account created.', { id: 'payment-verify' });
              router.push('/job-seeker/dashboard');
            } else {
              throw new Error('Invalid response from server');
            }
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed', { id: 'payment-verify' });
          }
        },
        prefill: {
          name: 'Job Seeker',
          email: 'user@example.com'
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
    } finally {
      setIsProcessing(false);
    }
  };



  if (loadingPlans) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading plans...</span>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 gap-6 ${plans.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : plans.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "border-primary border-2 shadow-lg"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <CardHeader>
              <CardTitle className="text-center">
                <div className="text-lg font-bold">{plan.name}</div>
                <div className="text-3xl font-bold text-primary mt-2">₹{plan.price}</div>
                <div className="text-sm text-muted-foreground">for {plan.duration} days</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
});

PaymentStepForm.displayName = 'PaymentStepForm';

export default PaymentStepForm;
