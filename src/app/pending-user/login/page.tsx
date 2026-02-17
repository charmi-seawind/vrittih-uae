"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PendingUserLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      // First validate if user is pending or registered
      const validateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-user/validate-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const validateData = await validateResponse.json();

      if (validateData.success) {
        if (validateData.data.userType === "registered") {
          // Redirect to regular login
          toast.info("Redirecting to user login...");
          router.push("/job-seeker/login");
          return;
        }

        if (validateData.data.userType === "pending") {
          // Send OTP for pending user
          const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-user/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });

          if (otpResponse.ok) {
            setShowOtpInput(true);
            toast.success("OTP sent to your email");
          } else {
            const error = await otpResponse.json();
            toast.error(error.message || "Failed to send OTP");
          }
        }
      } else {
        toast.error(validateData.message || "User not found");
      }
    } catch (error) {
      console.error("Email validation error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("pendingUserToken", data.data.token);
        localStorage.setItem("pendingUserId", data.data.pendingUser.id);
        toast.success("Login successful!");
        router.push("/pending-user/dashboard");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Registration</h2>
          <p className="mt-2 text-gray-600">
            Login to complete your pending registration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {showOtpInput ? "Enter OTP" : "Enter Email"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showOtpInput ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    OTP sent to {email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowOtpInput(false)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            New user?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push("https://vrrittih.com")}
            >
              Register here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingUserLogin;