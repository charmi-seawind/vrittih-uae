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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import LoadingButton from "../ui/loading-button";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormHeader from "./FormHeader";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as z from "zod";
import { api, apiCall } from "@/lib/api";

import { API_CONFIG } from '@/lib/config';
const EmployerRegisterSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  company_name: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9+\-\s()]+$/, "Mobile number can only contain numbers, +, -, spaces, and parentheses")
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must not exceed 15 characters"),
  is_consultancy: z.boolean().default(false),
  company_size: z.string().min(1, "Company size is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
});

type EmployerRegisterSchemaType = z.infer<typeof EmployerRegisterSchema>;

const EmployerRegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'register' | 'otp'>('register');
  const [userEmail, setUserEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [pendingUserId, setPendingUserId] = useState<string>("");
  
  const form = useForm<EmployerRegisterSchemaType>({
    resolver: zodResolver(EmployerRegisterSchema),
    defaultValues: {
      full_name: "",
      company_name: "",
      mobile: "",
      is_consultancy: false,
      company_size: "",
      email: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: EmployerRegisterSchemaType) => {
    setIsLoading(true);
    
    try {
      // Include mobile in the registration payload
      const registrationData = {
        full_name: data.full_name,
        company_name: data.company_name,
        mobile: data.mobile,
        email: data.email,
        is_consultancy: data.is_consultancy,
        company_size: data.company_size,
        // Store mobile as phone in profile data
        phone: data.mobile
      };
      
      const response = await apiCall(api.employer.register, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });

      if (response.success) {
        // Save registration data to localStorage for onboarding
        localStorage.setItem('employerRegistrationData', JSON.stringify(registrationData));
        
        // Store pendingUserId
        if (response.data?.pendingUserId) {
          setPendingUserId(response.data.pendingUserId);
          localStorage.setItem('employerPendingUserId', response.data.pendingUserId);
        }
        
        setUserEmail(data.email);
        setCurrentStep('otp');
        setCountdown(60);
        toast.success(response.message || "OTP sent to your email address!");
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiCall(api.employer.verifyOtp, {
        method: 'POST',
        body: JSON.stringify({ 
          email: userEmail, 
          otp: otp 
        }),
      });

      if (response.success) {
        toast.success(response.message || "Email verified successfully!");
        router.push('/onboarding/employer');
      }
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
        body: JSON.stringify({ 
          email: userEmail.toLowerCase(),
          pendingUserId: pendingUserId
        }),
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

          <LoadingButton
            onClick={verifyOtp}
            loading={isVerifying}
            disabled={isVerifying || otp.length !== 6}
            className="w-full h-11 sm:h-12 text-base"
          >
            Verify Email
          </LoadingButton>

          <div className="text-center">
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
          </div>
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
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Company Name *</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-transparent h-11 sm:h-12 text-base"
                    disabled={isLoading}
                    placeholder="Enter your company name"
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
          
          <FormField
            control={form.control}
            name="is_consultancy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is this a consultancy?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Company Size *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger className="bg-white dark:bg-transparent h-11 sm:h-12 text-base">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-100">51-100 employees</SelectItem>
                    <SelectItem value="101-500">101-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
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
          
          <LoadingButton
            type="submit"
            className="w-full h-11 sm:h-12 text-base font-medium mt-6 sm:mt-8"
            loading={isLoading}
            disabled={isLoading}
          >
            Create Employer Account
          </LoadingButton>
        </form>
      </Form>
      
      <div className="text-right text-xs mt-3 font-semibold flex items-center justify-end gap-1">
        <span>Switch To </span>{" "}
        <Link replace href={"/register/job_seeker"}>
          <span
            className={cn(
              " text-primary font-semibold tracking-wide relative group cursor-pointer",
              isLoading && "pointer-events-none"
            )}
          >
            Register as Job Seeker
            <div className="bg-primary w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ease-in-out block absolute right-0"></div>
          </span>
        </Link>
      </div>

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
    </article>
  );
};

export default EmployerRegisterForm;
