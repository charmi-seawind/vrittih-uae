"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Mail, Briefcase } from "lucide-react";
import Logo from "@/components/ui/logo";
import { div } from "framer-motion/client";
import BackButton from "@/components/Global/BackButton";

export default function EmployerLoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userType, setUserType] = useState(null);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      // First validate if employer is pending or registered
      const validateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-employer/validate-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const validateData = await validateResponse.json();

      if (validateData.success) {
        if (validateData.data.userType === "registered") {
          // Continue with regular login
          setUserType("registered");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/employer/login/send-otp`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            }
          );

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          toast.success("OTP sent to your email!");
          setOtpSent(true);
        } else if (validateData.data.userType === "pending") {
          // Handle pending employer
          setUserType("pending");
          setPendingUserId(validateData.data.pendingUserId);
          
          const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-employer/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });

          if (otpResponse.ok) {
            toast.success("OTP sent to complete your registration!");
            setOtpSent(true);
          } else {
            const error = await otpResponse.json();
            throw new Error(error.message || "Failed to send OTP");
          }
        }
      } else {
        toast.error("Email not found. Please register first.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      if (userType === "registered") {
        // Regular employer verification
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/employer/login/verify-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const userData = data.data?.data || data.data;
        if (userData?.user && userData?.token) {
          login(userData.user, userData.token);
          toast.success("Login successful!");
          router.push("/employer/dashboard");
        } else {
          throw new Error("Invalid response");
        }
      } else if (userType === "pending") {
        // Pending employer verification
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-employer/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        if (data.success) {
          localStorage.setItem("pendingEmployerToken", data.data.token);
          localStorage.setItem("pendingEmployerId", data.data.pendingEmployer.id);
          toast.success("Login successful! Complete your registration.");
          router.push("/pending-employer/dashboard");
        } else {
          throw new Error(data.message || "Invalid OTP");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5">
      <BackButton
        className="
    bg-[#19489e] text-white
   
    transition-colors duration-200
  "
      />

      <div className="relative min-h-[800px] flex items-center justify-center bg-white px-4">
        {/* Background Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-[600px] space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <Logo />
          </div>

          <Card className="rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Employer Login
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Secure login for employers using OTP
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="hr@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className=" h-11"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={sendOtp}
                    disabled={isLoading}
                    className="w-full h-11 text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Login OTP"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-center block">
                      Enter OTP sent to{" "}
                      <span className="font-medium">{email}</span>
                    </Label>

                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading}
                      >
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="w-11 h-12 rounded-lg text-lg border"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    onClick={verifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-11 text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={sendOtp}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Resend OTP
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="flex-1"
                    >
                      Change Email
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-center text-white/70">
            Employer access only · Secure OTP authentication
          </p>
        </div>
      </div>
    </div>
  );
}
