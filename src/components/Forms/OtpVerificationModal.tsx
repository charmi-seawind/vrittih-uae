// "use client";

// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import {
//   ResponsiveModal,
//   ResponsiveModalContent,
//   ResponsiveModalDescription,
//   ResponsiveModalHeader,
//   ResponsiveModalTitle,
// } from "@/components/ui/responsive-dailog";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
// import LoadingButton from "@/components/ui/loading-button";
// import { Button } from "@/components/ui/button";
// import { api, apiCall } from "@/lib/api";
// import MultiStepOnboardingForm from "./MultiStepOnboardingForm";

// interface OtpVerificationModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   userId: string;
//   email: string;
//   onSuccess: () => void;
// }

// const OtpVerificationModal = ({
//   open,
//   onOpenChange,
//   userId,
//   email,
//   onSuccess,
// }: OtpVerificationModalProps) => {
//   const [otp, setOtp] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isResending, setIsResending] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   useEffect(() => {
//     if (open && userId) {
//       sendOtp();
//     }
//   }, [open, userId]);

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   const sendOtp = async () => {
//     try {
//       await apiCall(api.auth.sendOtp, {
//         method: 'POST',
//         body: JSON.stringify({ userId, type: 'email' }),
//       });
//       setCountdown(60);
//       toast.success('OTP sent to your email');
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to send OTP');
//     }
//   };

//   const verifyOtp = async () => {
//     if (otp.length !== 6) {
//       toast.error('Please enter complete OTP');
//       return;
//     }

//     setIsVerifying(true);
//     try {
//       const response = await apiCall(api.auth.verifyOtp, {
//         method: 'POST',
//         body: JSON.stringify({ userId, code: otp, type: 'email' }),
//       });

//       if (response.success) {
//         toast.success('Email verified successfully!');
//         setShowOnboarding(true);
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Invalid OTP');
//       setOtp("");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const resendOtp = async () => {
//     setIsResending(true);
//     try {
//       await sendOtp();
//     } catch (error: any) {
//       toast.error('Failed to resend OTP');
//     } finally {
//       setIsResending(false);
//     }
//   };

//   const handleOnboardingComplete = () => {
//     onSuccess();
//     onOpenChange(false);
//   };

//   return (
//     <ResponsiveModal open={open} onOpenChange={onOpenChange}>
//       <ResponsiveModalContent className={showOnboarding ? "max-w-5xl" : "max-w-md"}>
//         {!showOnboarding ? (
//           <>
//             <ResponsiveModalHeader>
//               <ResponsiveModalTitle>Verify Your Email</ResponsiveModalTitle>
//               <ResponsiveModalDescription>
//                 We've sent a 6-digit verification code to {email}
//               </ResponsiveModalDescription>
//             </ResponsiveModalHeader>

//             <div className="space-y-6 p-6">
//               <div className="flex justify-center">
//                 <InputOTP
//                   maxLength={6}
//                   value={otp}
//                   onChange={setOtp}
//                   disabled={isVerifying}
//                 >
//                   <InputOTPGroup>
//                     <InputOTPSlot index={0} />
//                     <InputOTPSlot index={1} />
//                     <InputOTPSlot index={2} />
//                     <InputOTPSlot index={3} />
//                     <InputOTPSlot index={4} />
//                     <InputOTPSlot index={5} />
//                   </InputOTPGroup>
//                 </InputOTP>
//               </div>

//               <LoadingButton
//                 onClick={verifyOtp}
//                 loading={isVerifying}
//                 disabled={isVerifying || otp.length !== 6}
//                 className="w-full"
//               >
//                 Verify Email
//               </LoadingButton>

//               <div className="text-center">
//                 {countdown > 0 ? (
//                   <p className="text-sm text-muted-foreground">
//                     Resend OTP in {countdown}s
//                   </p>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     onClick={resendOtp}
//                     disabled={isResending}
//                     className="text-sm"
//                   >
//                     {isResending ? "Sending..." : "Resend OTP"}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </>
//         ) : (
//           <MultiStepOnboardingForm onComplete={handleOnboardingComplete} />
//         )}
//       </ResponsiveModalContent>
//     </ResponsiveModal>
//   );
// };

// export default OtpVerificationModal;








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
import { api, apiCall } from "@/lib/api";
import MultiStepOnboardingForm from "./MultiStepOnboardingForm";

interface OtpVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  email: string;
  onSuccess: () => void;
}

const OtpVerificationModal = ({
  open,
  onOpenChange,
  userId,
  email,
  onSuccess,
}: OtpVerificationModalProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (open && userId) {
      sendOtp();
    }
  }, [open, userId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOtp = async () => {
    try {
      const response = await apiCall(api.auth.sendOtp, {
        method: 'POST',
        body: JSON.stringify({ userId, type: 'email' }),
      });
      
      
      // Show OTP in toast for debugging
      if (response.debug?.otp) {
        toast.success(`OTP sent to your email. Debug OTP: ${response.debug.otp}`);
      } else {
        toast.success('OTP sent to your email');
      }
      
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiCall(api.auth.verifyOtp, {
        method: 'POST',
        body: JSON.stringify({ userId, code: otp, type: 'email' }),
      });

      if (response.success) {
        toast.success('Email verified successfully!');
        setShowOnboarding(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      await sendOtp();
    } catch (error: any) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleOnboardingComplete = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent
        className={showOnboarding ? "max-w-5xl" : "max-w-md"}
      >
        {!showOnboarding ? (
          <>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>Verify Your Email</ResponsiveModalTitle>
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
                Verify Email
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
          </>
        ) : (
          <MultiStepOnboardingForm onComplete={handleOnboardingComplete} />
        )}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default OtpVerificationModal;

