"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import LoadingButton from "@/components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

interface DualOtpVerificationProps {
  email: string;
  mobile: string;
  pendingUserId?: string | null;
  onSuccess: () => void;
  userType?: 'employer' | 'candidate';
}

const DualOtpVerification = ({ email, mobile, pendingUserId, onSuccess, userType = 'candidate' }: DualOtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const apiEndpoint = userType === 'employer' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/employer/verify-otp`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/verify-email-otp`;
      
      const requestBody = userType === 'employer'
        ? { email: email, otp: otp }
        : { pendingUserId: pendingUserId || undefined, email: email, otp: otp };
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      toast.success("OTP verified successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-medium mb-2">Verify OTP</h4>
        <p className="text-sm text-muted-foreground">
          {userType === 'employer' ? 'OTP sent to your email' : 'OTP sent to your email and mobile'}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Enter 6-digit OTP</CardTitle>
          <p className="text-xs text-muted-foreground mb-2">
            {userType === 'employer' 
              ? 'Please enter the 6-digit OTP sent to your email'
              : 'Please enter the 6-digit OTP sent to your email and mobile'
            }
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
            </span>
            {userType !== 'employer' && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {mobile.replace(/(.{2})(.*)(.{2})/, '$1****$3')}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
            >
              <InputOTPGroup className="gap-2 sm:gap-5">
                <InputOTPSlot index={0} className="w-8 h-8 sm:w-12 sm:h-12" />
                <InputOTPSlot index={1} className="w-8 h-8 sm:w-12 sm:h-12" />
                <InputOTPSlot index={2} className="w-8 h-8 sm:w-12 sm:h-12" />
                <InputOTPSlot index={3} className="w-8 h-8 sm:w-12 sm:h-12" />
                <InputOTPSlot index={4} className="w-8 h-8 sm:w-12 sm:h-12" />
                <InputOTPSlot index={5} className="w-8 h-8 sm:w-12 sm:h-12" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <LoadingButton
            onClick={verifyOtp}
            loading={isVerifying}
            disabled={isVerifying || otp.length !== 6}
            className="w-full"
          >
            Verify OTP
          </LoadingButton>

          <button
            type="button"
            onClick={async () => {
              setIsResending(true);
              try {
                const resendEndpoint = userType === 'employer'
                  ? `${process.env.NEXT_PUBLIC_API_URL}/api/employer/resend-otp`
                  : `${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/resend-otp`;
                
                const resendBody = userType === 'employer'
                  ? { email: email }
                  : { pendingUserId };
                
                const response = await fetch(resendEndpoint, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(resendBody)
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
                toast.success('OTP resent successfully!');
                setCountdown(30);
                setCanResend(false);
              } catch (error: any) {
                toast.error(error.message || 'Failed to resend OTP');
              } finally {
                setIsResending(false);
              }
            }}
            disabled={isResending || !canResend}
            className="w-full text-sm text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? 'Resending...' : canResend ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DualOtpVerification;
