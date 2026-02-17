'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, CreditCard, Loader2 } from 'lucide-react';

interface PaymentPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const packages: PaymentPackage[] = [
  {
    id: 'basic',
    name: 'Basic CV Post',
    price: 99,
    features: [
      'CV visible to employers',
      'Basic profile visibility',
      'Apply to jobs',
      'Email notifications',
      '30 days validity'
    ]
  },
  {
    id: 'featured',
    name: 'Featured CV',
    price: 999,
    popular: true,
    features: [
      'Priority CV visibility',
      'Featured in search results',
      'Premium badge on profile',
      'Direct employer contact',
      'Advanced analytics',
      'Priority support',
      '90 days validity'
    ]
  }
];

export default function PaymentForm() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string>('basic');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or dashboard
      router.push('/job-seeker/dashboard');
    }, 3000);
  };

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your CV Package</h2>
        <p className="text-gray-600 mt-2">Select a package to make your CV visible to employers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {packages.map((pkg) => (
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
                <span className="text-sm text-gray-500 font-normal">/package</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPkg && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">{selectedPkg.name}</span>
              <span className="font-bold">₹{selectedPkg.price}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span>GST (18%)</span>
              <span>₹{Math.round(selectedPkg.price * 0.18)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{selectedPkg.price + Math.round(selectedPkg.price * 0.18)}</span>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing ? 'Processing Payment...' : `Pay ₹${selectedPkg.price + Math.round(selectedPkg.price * 0.18)}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}