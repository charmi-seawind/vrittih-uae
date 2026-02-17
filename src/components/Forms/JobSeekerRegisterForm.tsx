


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import LoadingButton from "../ui/loading-button";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormHeader from "./FormHeader";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as z from "zod";
// import { api, apiCall } from "@/lib/api";
import MultiStepOnboardingForm from "./MultiStepOnboardingForm";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import SavedDataIndicator from "./SavedDataIndicator";

const RegisterSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9+\-\s()]+$/, "Mobile number can only contain numbers, +, -, spaces, and parentheses")
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must not exceed 15 characters"),
});

type RegisterSchemaType = z.infer<typeof RegisterSchema>;

const JobSeekerRegisterForm = () => {
  const router = useRouter();
  const { setPendingUserId, setUserBasicInfo, userBasicInfo, pendingUserId, isEmailVerified } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'register' | 'otp' | 'onboarding'>('register');
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Check if user is already verified and has data
  useEffect(() => {
    if (pendingUserId && isEmailVerified && userBasicInfo) {
      // User has already completed registration, redirect to onboarding
      router.push('/onboarding/job-seeker');
    }
  }, [pendingUserId, isEmailVerified, userBasicInfo, router]);



  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: userBasicInfo?.full_name || "",
      email: userBasicInfo?.email || "",
      mobile: userBasicInfo?.mobile || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: RegisterSchemaType) => {
    setIsLoading(true);

    try {
      // Store user data temporarily and send OTP
      setUserEmail(data.email);
      setUserId(data.email); // Using email as temporary ID
      
      // Call backend save-basic-info API that returns pendingUserId
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/save-basic-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.full_name.split(' ')[0],
          lastName: data.full_name.split(' ').slice(1).join(' ') || '',
          email: data.email,
          phone: data.mobile,
          location: '',
          dateOfBirth: '',
          bio: ''
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store the pendingUserId from registration response
        if (result.data?.pendingUserId) {
          localStorage.setItem('pendingUserId', result.data.pendingUserId);
          setPendingUserId(result.data.pendingUserId);
        }
        
        // Store user basic info for later use
        setUserBasicInfo({
          full_name: data.full_name,
          email: data.email,
          mobile: data.mobile
        });
        
        setCurrentStep('otp');
        setCountdown(60);
        
        // Show development OTP if available
        if (result.debug?.otp) {
          toast.success(`OTP sent! Development OTP: ${result.debug.otp}`);
        } else {
          toast.success("OTP sent to your email address!");
        }
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCountdown(60);
        toast.success("OTP sent to your email address!");
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail, 
          otp: otp 
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Email verified successfully!");
        
        // Redirect to job seeker login page
        router.push('/login/job-seeker');
      } else {
        toast.error(result.message || "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/job-seeker/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to resend OTP');
      }
      
      setCountdown(60);
      toast.success("OTP resent to your email address!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleOnboardingComplete = () => {
    router.push("/job-seeker/dashboard");
  };

  if (currentStep === 'onboarding') {
    return (
      <article className="mx-auto max-w-7xl w-full px-2 sm:px-4 lg:px-6 pt-4 sm:pt-8 pb-6">
        <MultiStepOnboardingForm onComplete={handleOnboardingComplete} />
      </article>
    );
  }

  if (currentStep === 'otp') {
    return (
      <article className="mx-auto max-w-[500px] w-full px-4 sm:px-6 pt-8 sm:pt-16 pb-6">
        <div className="text-center sm:text-left flex flex-col gap-3 mb-6">
          <FormHeader
            headingText="Verify Your Email"
            supportingText={`We've sent a 6-digit verification code to ${userEmail}`}
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
              className="gap-2 sm:gap-3"
            >
              <InputOTPGroup className="gap-2 sm:gap-3">
                <InputOTPSlot index={0} className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
                <InputOTPSlot index={1} className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
                <InputOTPSlot index={2} className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
                <InputOTPSlot index={3} className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
                <InputOTPSlot index={4} className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
                <InputOTPSlot index={5} className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
              </InputOTPGroup>
            </InputOTP>
          </div>
{/* 
          <LoadingButton
            onClick={verifyOtp}
            loading={isVerifying}
            disabled={isVerifying || otp.length !== 6}
            className="w-full h-11 sm:h-12 text-base"
          >
            Verify Email
          </LoadingButton> */}

          {/* <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm sm:text-base text-muted-foreground">
                Resend OTP in {countdown}s
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={resendOtp}
                disabled={isResending}
                className="text-sm sm:text-base h-10 sm:h-11"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </Button>
            )}
          </div> */}
        </div>

        <div className="text-center my-8 sm:my-10">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep('register')}
            className="text-primary text-sm sm:text-base h-10 sm:h-11"
          >
            ← Back to Registration
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-[500px] w-full px-4 sm:px-6 pt-8 sm:pt-16 pb-6">
      <div className="text-center sm:text-left flex flex-col gap-3 mb-6 sm:mb-8">
        <FormHeader
          headingText="Get Started!"
          supportingText="Please register your details to continue"
        />
      </div>
      
      {/* Show saved data indicator if user has already filled details */}
      {userBasicInfo && pendingUserId && isEmailVerified ? (
        <SavedDataIndicator 
          userBasicInfo={userBasicInfo}
          onContinue={() => router.push('/onboarding/job-seeker')}
          onEdit={() => {
            // Allow user to edit by clearing the saved state
            setUserBasicInfo(null);
            form.reset();
          }}
        />
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white dark:bg-transparent h-11 sm:h-12 text-base"
                        disabled={isLoading}
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="bg-white dark:bg-transparent h-11 sm:h-12 text-base"
                        disabled={isLoading}
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Mobile Number *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        className="bg-white dark:bg-transparent h-11 sm:h-12 text-base"
                        disabled={isLoading}
                        placeholder="Enter your mobile number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <LoadingButton
                type="submit"
                className="w-full h-11 sm:h-12 text-base font-medium mt-6 sm:mt-8"
                loading={isLoading}
                disabled={isLoading}
              >
                Create Job Seeker Account
              </LoadingButton>
            </form>
          </Form>

          <div className="text-center my-8 sm:my-10 text-sm sm:text-base">
            <span>Already have an account? </span>
            <Link
              className={cn(
                "text-primary relative group font-medium",
                isLoading && "pointer-events-none"
              )}
              href={"/login"}
            >
              Sign In
              <div className="bg-primary w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ease-in-out block absolute right-0"></div>
            </Link>
          </div>
        </>
      )}
    </article>
  );
};

export default JobSeekerRegisterForm;
