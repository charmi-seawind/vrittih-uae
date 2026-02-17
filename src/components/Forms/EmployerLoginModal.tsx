"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-dailog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingButton from "@/components/ui/loading-button";
import EmployerOtpVerificationModal from "./EmployerOtpVerificationModal";

interface EmployerLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployerLoginModal = ({ open, onOpenChange }: EmployerLoginModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/login/send-otp`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      toast.success("OTP sent to your email");
      setShowOtpModal(true);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    setEmail("");
    router.push("/employer/dashboard");
  };

  return (
    <>
      <ResponsiveModal open={open} onOpenChange={onOpenChange}>
        <ResponsiveModalContent className="max-w-md">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Employer Login</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              Enter your email to receive an OTP for login
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <LoadingButton
              type="submit"
              loading={isLoading}
              disabled={isLoading || !email}
              className="w-full"
            >
              Send OTP
            </LoadingButton>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </form>
        </ResponsiveModalContent>
      </ResponsiveModal>

      <EmployerOtpVerificationModal
        open={showOtpModal}
        onOpenChange={setShowOtpModal}
        email={email}
        onSuccess={handleOtpSuccess}
      />
    </>
  );
};

export default EmployerLoginModal;