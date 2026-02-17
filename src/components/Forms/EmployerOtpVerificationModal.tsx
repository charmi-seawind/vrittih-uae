"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-dailog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import LoadingButton from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface EmployerOtpVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: () => void;
}

const EmployerOtpVerificationModal = ({
  open,
  onOpenChange,
  email,
  onSuccess,
}: EmployerOtpVerificationModalProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login } = useAuth();

  useEffect(() => {
    if (open) {
      setCountdown(60);
    }
  }, [open]);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/login/verify-otp`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      if (data.success && data.data?.token && data.data?.user) {
        login(data.data.user, data.data.token);
        toast.success("Login successful!");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/employer/resend-otp`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      toast.success("OTP resent to your email");
      setCountdown(60);
    } catch (error: any) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent className="max-w-md">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Verify OTP</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            We've sent a 6-digit verification code to {email}
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <div className="space-y-6 p-6">
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
            className="w-full"
          >
            Verify & Login
          </LoadingButton>

          <div className="text-center">
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
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default EmployerOtpVerificationModal;