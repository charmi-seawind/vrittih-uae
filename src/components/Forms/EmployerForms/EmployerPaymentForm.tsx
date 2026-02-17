'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { planAPI } from '@/services/planAPI';
import { toast as sonnerToast } from 'sonner';

interface PaymentPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: {
    job_posts: number;
    featured_jobs: number;
    featured_company: boolean;
  };
  description?: string;
  popular?: boolean;
}

interface EmployerPaymentFormProps {
  pendingUserId: string;
  onPaymentSuccess: () => void;
  employerData?: {
    industry?: string;
    companySize?: string;
    website?: string;
    description?: string;
    address?: string;
  };
}

export default function EmployerPaymentForm({ pendingUserId, onPaymentSuccess, employerData }: EmployerPaymentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { login, refreshAuth } = useAuth();
  const [employerPackages, setEmployerPackages] = useState<PaymentPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    fetchEmployerPlans();
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const subscriptionResponse = await planAPI.getCurrentSubscription().catch(() => null);
      if (subscriptionResponse?.data?.status) {
        setSubscriptionStatus(subscriptionResponse.data.status);
      }
    } finally {
      setLoadingSubscription(false);
    }
  };

  const fetchEmployerPlans = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/plans/employer`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const plans = data.data?.plans || data.plans || [];
      
      const formattedPlans = plans.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        price: parseFloat(plan.price),
        duration: plan.duration,
        features: plan.features || { job_posts: 5, featured_jobs: 0, featured_company: false },
        description: plan.description,
        popular: plan.name.toLowerCase().includes('premium')
      }));
      
      
      setEmployerPackages(formattedPlans);
      if (formattedPlans.length > 0) {
        setSelectedPackage(formattedPlans[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load plans. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleContinueToPayment = async () => {
    if (!selectedPackage) {
      sonnerToast.error('Please select a plan');
      return;
    }

    const selectedPlanData = employerPackages.find(p => p.id === selectedPackage);
    if (!selectedPlanData) return;

    setIsProcessing(true);
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order for employer registration
      const orderResponse = await fetch('/api/job-seeker/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlanData.price,
          planId: selectedPackage,
          pendingUserId: pendingUserId
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');
      const { orderId } = await orderResponse.json();

      // Open Razorpay checkout
      const options = {
        key: "rzp_live_RrtsJrVleUY6RP",
        amount: selectedPlanData.price * 100,
        currency: 'INR',
        name: 'Vrrittih',
        description: `${selectedPlanData.name} - Employer Registration`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/employer/complete-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pendingUserId: pendingUserId,
                paymentId: response.razorpay_payment_id,
                planId: selectedPackage,
                industry: employerData?.industry || 'Technology',
                company_size: (employerData?.companySize || '1-10').replace(' employees', ''),
                location: employerData?.address || 'India',
                website: employerData?.website || '',
                description: employerData?.description || ''
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }
            
            const result = await verifyResponse.json();
            
            if (result.success) {
              const { user, token } = result.data?.data || {};
              
              if (user && token) {
                login(user, token);
                
                localStorage.removeItem('pendingUserId');
                sessionStorage.removeItem('pendingUserId');
                localStorage.removeItem('onboarding-storage');

                sonnerToast.success('Payment successful! Account created.');
                onPaymentSuccess();
              }
            } else {
              throw new Error(result.message || 'Payment verification failed');
            }
          } catch (error: any) {
            sonnerToast.error(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Employer',
          email: 'employer@example.com'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            sonnerToast.error('Payment cancelled');
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      sonnerToast.error(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!transactionId || !paymentScreenshot) {
      sonnerToast.error('Please provide transaction ID and payment screenshot');
      return;
    }

    if (!pendingUserId) {
      sonnerToast.error('No pending user ID found. Please restart registration.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const selectedPlanData = employerPackages.find(p => p.id === selectedPackage);
      if (!selectedPlanData) throw new Error('Plan not found');

      const formData = new FormData();
      formData.append('pendingUserId', pendingUserId);
      formData.append('transactionId', transactionId);
      formData.append('planId', selectedPackage);
      formData.append('amount', selectedPlanData.price.toString());
      formData.append('paymentScreenshot', paymentScreenshot);

      const uploadResponse = await fetch('/api/employer/upload-payment-proof', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.message || 'Failed to upload payment proof');
      }
      
      const response = await fetch('/api/employer/complete-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingUserId,
          paymentId: transactionId,
          planId: selectedPackage,
          industry: employerData?.industry || 'Technology',
          company_size: (employerData?.companySize || '1-10').replace(' employees', ''),
          location: employerData?.address || 'India',
          website: employerData?.website || '',
          description: employerData?.description || ''
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      const { user, token } = result.data?.data || {};
      
      if (user && token) {
        login(user, token);
        
        localStorage.removeItem('pendingUserId');
        sessionStorage.removeItem('pendingUserId');
        localStorage.removeItem('onboarding-storage');

        sonnerToast.success('Account created! Payment verification pending.');
        onPaymentSuccess();
      } else {
        throw new Error('Invalid response format: missing user or token data');
      }
    } catch (error: any) {
      sonnerToast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPkg = employerPackages.find(pkg => pkg.id === selectedPackage);

  if (loadingSubscription) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (subscriptionStatus === 'pending') {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-16 h-16 text-yellow-600 mb-4" />
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">
            Payment Verification Pending
          </h3>
          <p className="text-yellow-700 text-center mb-4 max-w-md">
            Your payment is currently being verified. Please wait for admin approval before selecting a new plan.
          </p>
          <p className="text-sm text-yellow-600">
            This usually takes 24-48 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showPaymentProof) {
    const selectedPlanData = employerPackages.find(p => p.id === selectedPackage);
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setShowPaymentProof(false)} className="mb-4">
          ← Back to Plans
        </Button>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Bank Details</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="font-medium">Iceberg Business solutions Private Limited</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-medium">935150200097369351</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="font-medium">HDFC0009173</p>
              </div>
              <div className="p-3 bg-blue-50 rounded text-center">
                <p className="text-sm text-blue-800 font-medium">
                  Amount to Pay: ₹{selectedPlanData?.price || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upload Payment Proof</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="transactionId">Transaction ID / UTR Number *</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
            <div>
              <Label htmlFor="screenshot">Payment Screenshot *</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
              />
              {paymentScreenshot && (
                <p className="text-sm text-green-600 mt-1">File selected: {paymentScreenshot.name}</p>
              )}
            </div>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !transactionId || !paymentScreenshot}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit & Create Account'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 md:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Employer Plan</h2>
        <p className="text-gray-600 mt-2">Select a plan to start posting jobs and hiring candidates</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading plans...</span>
        </div>
      ) : employerPackages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No plans available. Please try refreshing the page.</p>
          <Button onClick={fetchEmployerPlans} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {employerPackages.map((pkg) => {
            const features = [
              pkg.features.job_posts === -1 ? 'Post unlimited jobs' : `Post up to ${pkg.features.job_posts} jobs`,
              pkg.features.featured_jobs === -1 ? 'Unlimited featured jobs' : pkg.features.featured_jobs > 0 ? `${pkg.features.featured_jobs} featured jobs` : 'No featured jobs',
              pkg.features.featured_company ? 'Featured company profile' : 'Standard company profile',
              `${pkg.duration} days validity`
            ];
            
            return (
              <Card 
                key={pkg.id}
                className={`cursor-pointer transition-all ${
                  selectedPackage === pkg.id 
                    ? 'ring-2 ring-blue-500 border-blue-500' 
                    : 'hover:shadow-lg'
                } ${pkg.popular ? 'relative' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{pkg.price}
                    <span className="text-sm text-gray-500 font-normal">/plan</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedPkg && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleContinueToPayment}
            disabled={!selectedPackage || isProcessing}
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}