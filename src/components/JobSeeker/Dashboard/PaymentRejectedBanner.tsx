"use client";

import { useEffect, useState } from "react";
import { API_CONFIG } from '@/lib/config';
import { AlertCircle } from "lucide-react";

const PaymentRejectedBanner = ({ userId }: { userId: string }) => {
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    checkPaymentStatus();
  }, [userId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/local-payment/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.data.payment.status === 'rejected') {
          setIsRejected(true);
        }
      }
    } catch (error) {
      // Payment not found or error - ignore
    }
  };

  if (!isRejected) return null;

  return (
    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-red-800 font-medium">
            Your payment verification was rejected. Please contact support at support@vrrittih.com for assistance.
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentRejectedBanner;
