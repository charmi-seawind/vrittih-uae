"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

const CVPaymentForm = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const pendingUserId = searchParams.get('pendingUserId');

  const packages = [
    {
      id: "basic",
      name: "Basic CV Post",
      price: 99,
      duration: "30 days",
      features: [
        "CV visible to employers",
        "Basic profile visibility",
        "Email notifications",
        "Standard support"
      ],
      popular: false
    },
    {
      id: "featured",
      name: "Featured CV",
      price: 999,
      duration: "90 days",
      features: [
        "Priority CV placement",
        "Enhanced profile visibility",
        "Featured in search results",
        "Premium badge",
        "Priority support",
        "Application tracking"
      ],
      popular: true
    }
  ];

  const handlePayment = async () => {
    
    if (!selectedPackage || !pendingUserId) {
      toast({
        title: "Error",
        description: "Please select a package and ensure user ID is available.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/job-seeker/complete-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pendingUserId,
          paymentId: `pay_${Date.now()}`,
          planId: selectedPackage
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      const apiData = result?.data?.data;
      const user = apiData?.user;
      const token = apiData?.token;
      
      if (user && token) {
        // Force save to localStorage before redirect
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        login(user, token);
        
        toast({
          title: "Payment Successful!",
          description: "Your job seeker account has been activated successfully.",
          variant: "default",
        });
        
        // Clear stored data
        localStorage.removeItem('pendingUserId');
        sessionStorage.removeItem('pendingUserId');

        // Add delay to ensure auth state is updated, then force reload
        setTimeout(() => {
          window.location.href = '/job-seeker/dashboard';
        }, 1000);
      } else {
        throw new Error('Invalid response format: missing user or token data');
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || 'Payment processing failed. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your CV Package
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select the perfect package to showcase your profile
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedPackage === pkg.id 
                ? "ring-2 ring-primary border-primary" 
                : "hover:shadow-lg"
            } ${pkg.popular ? "border-primary" : ""}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {pkg.id === "featured" ? (
                  <Crown className="w-8 h-8 text-primary" />
                ) : (
                  <Check className="w-8 h-8 text-green-500" />
                )}
              </div>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-primary">₹{pkg.price}</span>
                <span className="text-sm text-gray-500 ml-2">for {pkg.duration}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPackage && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span>Package: {packages.find(p => p.id === selectedPackage)?.name}</span>
              <span className="font-bold">₹{packages.find(p => p.id === selectedPackage)?.price}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total Amount:</span>
              <span>₹{packages.find(p => p.id === selectedPackage)?.price}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handlePayment}
          disabled={!selectedPackage || isProcessing}
          className="w-full max-w-md"
          size="lg"
        >
          {isProcessing ? "Processing Payment..." : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  );
};

export default CVPaymentForm;