"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import LoadingButton from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { api, apiCall } from "@/lib/api";

import { API_CONFIG } from '@/lib/config';
interface InlineOtpVerificationProps {
  email: string;
  pendingUserId?: string | null;
  onSuccess: () => void;
}

const InlineOtpVerification = ({ email, pendingUserId, onSuccess }: InlineOtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // OTP is already sent by save-basic-info API, no need to send again

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    try {
      // Use employer verification endpoint
      const data = await apiCall(api.employer.verifyOtp, {
        method: 'POST',
        body: JSON.stringify({ email, otp, pendingUserId })
      });
      
      toast.success("Email verified successfully!");
      // Pass the verified pending user ID back to parent
      onSuccess(data.pendingUserId || data.data?.pendingUserId || pendingUserId);
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/employer/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to resend OTP');
      }
      
      setCountdown(60);
      toast.success("OTP resent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h4 className="text-lg font-medium mb-2">Verify Your Email</h4>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit verification code to {email}
        </p>
  
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          disabled={isVerifying}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <LoadingButton
        onClick={verifyOtp}
        loading={isVerifying}
        disabled={isVerifying || otp.length !== 6}
        className="w-full max-w-xs"
      >
        Verify Email
      </LoadingButton>

      <div>
        {countdown > 0 ? (
          <p className="text-sm text-muted-foreground">
            Resend OTP in {countdown}s
          </p>
        ) : (
          <Button
            variant="ghost"
            onClick={resendOtp}
            disabled={isResending}
            className="text-sm"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InlineOtpVerification;