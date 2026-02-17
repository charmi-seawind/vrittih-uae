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
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/logo";
import BackButton from "@/components/Global/BackButton";

export default function JobSeekerLoginPage() {
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
      // First validate if user is pending or registered
      const validateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-user/validate-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const validateData = await validateResponse.json();

      if (validateData.success) {
        if (validateData.data.userType === "registered") {
          // Continue with regular login
          setUserType("registered");
          const response = await fetch("/api/job-seeker/send-login-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          toast.success("OTP sent to your email!");
          setOtpSent(true);
        } else if (validateData.data.userType === "pending") {
          // Handle pending user
          setUserType("pending");
          setPendingUserId(validateData.data.pendingUserId);
          
          const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-user/send-otp`, {
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
        // Regular user verification
        const response = await fetch("/api/job-seeker/verify-login-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const userData = data.data?.data || data.data;
        if (userData?.user && userData?.token) {
          login(userData.user, userData.token);
          toast.success("Login successful!");
          router.push("/job-seeker/dashboard");
        } else {
          throw new Error("Invalid response");
        }
      } else if (userType === "pending") {
        // Pending user verification
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-user/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        if (data.success) {
          localStorage.setItem("pendingUserToken", data.data.token);
          localStorage.setItem("pendingUserId", data.data.pendingUser.id);
          toast.success("Login successful! Complete your registration.");
          router.push("/pending-user/dashboard");
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
    <>
      <div className="p-5">
        <BackButton
          className="
    bg-[#19489e] text-white
   
    transition-colors duration-200
  "
        />

        <div className="min-h-[800px] flex flex-col items-center justify-center bg-background p-4">
          <Logo />

          <Card
            className="
      border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl
      w-full max-w-[600px]
      rounded-2xl
    "
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                {otpSent ? (
                  <ShieldCheck className="w-5 h-5 text-primary" />
                ) : (
                  <Mail className="w-5 h-5 text-primary" />
                )}
                Job Seeker Login
              </CardTitle>

              <p className="text-sm text-muted-foreground text-center">
                {otpSent
                  ? "Enter the 6-digit code sent to your email"
                  : "Login securely using OTP verification"}
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <Button
                    onClick={sendOtp}
                    disabled={isLoading}
                    className="w-full h-11 text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-center block">
                      OTP sent to{" "}
                      <span className="font-medium break-all">{email}</span>
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
                              className="w-10 h-11 sm:w-11 sm:h-12 text-lg rounded-lg border"
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

                  <div className="flex flex-col sm:flex-row gap-2">
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
        </div>
      </div>
    </>
  );
}
