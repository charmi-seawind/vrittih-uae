"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Download, 
  Share2, 
  X, 
  Calendar,
  CreditCard,
  User,
  Package,
  ArrowRight
} from "lucide-react";
import { toast } from 'sonner';
import { Button } from "./button";
import { Badge } from "./badge";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { useAuth } from "@/hooks/useAuth";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails: {
    amount: number;
    transactionId: string;
    planName: string;
    duration: string;
    date: string;
    paymentMethod: string;
  };
  userData?: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
      status: string;
    };
    token: string;
  };
}

export default function PaymentSuccessModal({ 
  isOpen, 
  onClose, 
  paymentDetails,
  userData 
}: PaymentSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-login user after successful payment
    if (userData && userData.user && userData.token) {
      login(userData.user, userData.token);
    }
  }, [userData, login]);

  const downloadReceipt = () => {
    const receiptData = {
      companyName: "Vrrittih.com",
      companyAddress: "Job Portal Platform, India",
      receiptNumber: `RCP-${paymentDetails.transactionId}`,
      date: paymentDetails.date,
      customerName: userData?.user?.fullName || "Customer",
      customerEmail: userData?.user?.email || "",
      items: [
        {
          description: paymentDetails.planName,
          duration: paymentDetails.duration,
          amount: paymentDetails.amount
        }
      ],
      total: paymentDetails.amount,
      transactionId: paymentDetails.transactionId,
      paymentMethod: paymentDetails.paymentMethod
    };

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; }
          .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .total { font-weight: bold; font-size: 18px; border-top: 2px solid #16a34a; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>${receiptData.companyName}</h1>
            <p>${receiptData.companyAddress}</p>
          </div>
          <div class="content">
            <h2>Payment Receipt</h2>
            <div class="row"><span>Receipt #:</span><span>${receiptData.receiptNumber}</span></div>
            <div class="row"><span>Date:</span><span>${receiptData.date}</span></div>
            <div class="row"><span>Customer:</span><span>${receiptData.customerName}</span></div>
            <div class="row"><span>Email:</span><span>${receiptData.customerEmail}</span></div>
            <hr>
            <h3>Payment Details</h3>
            <div class="row"><span>Plan:</span><span>${receiptData.items[0].description}</span></div>
            <div class="row"><span>Duration:</span><span>${receiptData.items[0].duration}</span></div>
            <div class="row"><span>Transaction ID:</span><span>${receiptData.transactionId}</span></div>
            <div class="row"><span>Payment Method:</span><span>${receiptData.paymentMethod}</span></div>
            <hr>
            <div class="row total"><span>Total Amount:</span><span>₹${receiptData.total}</span></div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${paymentDetails.transactionId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `🎉 Just successfully registered on Vrrittih.com! \n\n✅ Plan: ${paymentDetails.planName}\n💰 Amount: ₹${paymentDetails.amount}\n⏰ Duration: ${paymentDetails.duration}\n\nReady to find my dream job! 🚀\n\n#JobSearch #CareerGrowth #Vrrittih`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Successfully Registered on Vrrittih.com!',
          text: shareText,
          url: 'https://vrrittih.com'
        });
      } catch (error) {
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Share text copied to clipboard!');
      } catch (error) {
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-3xl overflow-hidden border-0 shadow-2xl">
        <DialogTitle className="sr-only">Payment Success</DialogTitle>
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Success Animation */}
          <div className="relative bg-gradient-to-br from-green-400 via-green-500 to-green-600 px-8 pt-12 pb-8 text-white text-center">
            {/* Confetti Effect */}
            <AnimatePresence>
              {showConfetti && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      initial={{
                        x: Math.random() * 300,
                        y: -10,
                        opacity: 1,
                        scale: Math.random() * 0.5 + 0.5
                      }}
                      animate={{
                        y: 400,
                        x: Math.random() * 300,
                        opacity: 0,
                        rotate: 360
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                delay: 0.2 
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
            </motion.div>

            {/* Success Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-white/90 text-sm">
                Your payment has been processed successfully
              </p>
            </motion.div>

            {/* Amount */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6"
            >
              <div className="text-4xl font-bold">₹{paymentDetails.amount}</div>
              <Badge className="bg-white/20 text-white border-white/30 mt-2">
                {paymentDetails.planName}
              </Badge>
            </motion.div>
          </div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="p-6 space-y-4"
          >
            {/* Transaction ID */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Transaction ID</p>
                  <p className="text-xs text-gray-500">{paymentDetails.transactionId}</p>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Plan Duration</p>
                  <p className="text-xs text-gray-500">{paymentDetails.duration}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Date</p>
                  <p className="text-xs text-gray-500">{paymentDetails.date}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Method</p>
                  <p className="text-xs text-gray-500">{paymentDetails.paymentMethod}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="p-6 pt-0 space-y-3"
          >
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-xl"
              onClick={() => {
                onClose();
                router.push('/job-seeker/dashboard');
              }}
            >
             Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                onClick={downloadReceipt}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}