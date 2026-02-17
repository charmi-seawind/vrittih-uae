"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Loader2 } from "lucide-react";
import SimplePersonalInfoForm from "./SimplePersonalInfoForm";
import OptionalDetailsForm from "./OptionalDetailsForm";
import PaymentStepForm from "./PaymentStepForm";
import AICVUploadForm from "./AICVUploadForm";
import { ResumeValues } from "@/schema/ResumeEditorSchema";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { toast } from "sonner";

interface AIOnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    title: "Personal Info & Verification",
    description: "Tell us about yourself",
  },
  {
    id: 2,
    title: "Additional Details",
    description: "Add your experience & skills (Optional)",
  },
  { id: 3, title: "Choose Plan", description: "Select your subscription plan" },
];

const AIOnboardingFlow = ({ onComplete }: AIOnboardingFlowProps) => {
  const {
    currentStep,
    setCurrentStep,
    pendingUserId,
    setPendingUserId,
    isCompleted,
    isEmailVerified,
    isMobileVerified,
    resumeData: storedResumeData,
    parsedCVData: storedParsedCVData,
    setEmailVerified,
    setMobileVerified,
    setResumeData: setStoredResumeData,
    setUploadedCV,
    setUploadedPhoto,
    setParsedCVData: setStoredParsedCVData,
  } = useOnboardingStore();

  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedCVData, setParsedCVData] = useState<any>(null);
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);

  // Wait for store to hydrate and then set parsedCVData
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStoreHydrated(true);
      if (storedParsedCVData) {
        setParsedCVData(storedParsedCVData);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [storedParsedCVData]);
  const [resumeData, setResumeData] = useState<ResumeValues>(
    storedResumeData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      jobTitle: "",
      jobCategory: "",
      state: "",
      dob: "",
      bio: "",
      educations: [],
      education: [],
      workExperiences: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
    }
  );

  const paymentRef = React.useRef<{
    getSelectedPlan: () => string;
    handlePayment: () => Promise<void>;
  }>(null);

  useEffect(() => {
    setStoredResumeData(resumeData);
  }, [resumeData, setStoredResumeData]);

  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  // Initialize step based on stored data after hard refresh
  useEffect(() => {
    if (storedParsedCVData && currentStep === 1 && !showOtpVerification) {
      if (isEmailVerified && isMobileVerified && pendingUserId) {
        setCurrentStep(2);
      }
    }
  }, [storedParsedCVData, currentStep, showOtpVerification, isEmailVerified, isMobileVerified, pendingUserId, setCurrentStep]);

  useEffect(() => {
    if (isEmailVerified && isMobileVerified && currentStep === 1) {
      setShowOtpVerification(false);
    }
  }, [isEmailVerified, isMobileVerified, currentStep]);

  const handleCVParsed = (data: any) => {

    setParsedCVData(data);
    setStoredParsedCVData(data); // Store in persistent storage

    const filledData = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      city: data.city || "",
      country: data.country || "",
      jobTitle: data.jobTitle || "",
      jobCategory: data.jobCategory || "",
      state: data.state || "",
      dob: data.dob || "",
      bio: data.bio || "",
      educations: data.education || [],
      education: data.education || [],
      workExperiences: data.experience || [],
      experience: data.experience || [],
      skills: data.skills || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
    };

    setResumeData(filledData);
    setStoredResumeData(filledData);
  };

  const progress = (currentStep / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 1 && !showOtpVerification) {
      if (isEmailVerified && isMobileVerified && pendingUserId) {
        setCurrentStep(2);
        return;
      }

      if (
        !resumeData.firstName ||
        !resumeData.lastName ||
        !resumeData.email ||
        !resumeData.phone ||
        !resumeData.jobTitle ||
        !resumeData.jobCategory ||
        !resumeData.dob ||
        !resumeData.city
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsLoading(true);
      try {
        const checkResponse = await fetch("/api/job-seeker/check-existing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: resumeData.email,
            phone: resumeData.phone,
          }),
        });

        if (!checkResponse.ok) {
          const checkError = await checkResponse.json();
          toast.error(checkError.message || "User validation failed");
          return;
        }

        const response = await fetch("/api/job-seeker/save-basic-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: resumeData.firstName,
            lastName: resumeData.lastName,
            email: resumeData.email,
            phone: resumeData.phone,
            jobTitle: resumeData.jobTitle,
            jobCategory: resumeData.jobCategory,
            city: resumeData.city,
            dateOfBirth: resumeData.dob,
            bio: resumeData.bio,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        const backendPendingUserId =
          data.data?.data?.pendingUserId || data.data?.pendingUserId;
        if (backendPendingUserId) {
          setPendingUserId(backendPendingUserId);
          localStorage.setItem("pendingUserId", backendPendingUserId);
        }
        setShowOtpVerification(true);
        setStoredResumeData(resumeData);
      } catch (error: any) {
        toast.error(error.message || "Failed to save user data");
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      // Save education/experience and upload CV
      setIsLoading(true);
      try {
        const currentPendingUserId =
          pendingUserId || localStorage.getItem("pendingUserId");
        if (!currentPendingUserId) {
          toast.error("Session expired. Please start again.");
          return;
        }

        // Save education/experience
        const response = await fetch(
          "/api/job-seeker/save-education-experience",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pendingUserId: currentPendingUserId,
              education: resumeData.education || [],
              experience: resumeData.experience || [],
              skills: resumeData.skills || [],
              projects: resumeData.projects || [],
              certifications: resumeData.certifications || [],
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to save details");

        // Skip CV upload for AI flow - files are already parsed and data is saved
        // The CV upload step is not needed for AI onboarding since we already have the parsed data

        setCurrentStep(3);
      } catch (error: any) {
        toast.error(error.message || "Failed to save details");
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 3) {
      // Handle payment step
      if (paymentRef.current?.handleContinueToPayment) {
        paymentRef.current.handleContinueToPayment();
      }
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpVerification(false);
    setEmailVerified(true);
    setMobileVerified(true);
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    if (!parsedCVData) {
      return <AICVUploadForm onParseComplete={handleCVParsed} />;
    }

    switch (currentStep) {
      case 1:
        // Skip personal info form if already verified
        if (isEmailVerified && isMobileVerified && pendingUserId) {
          return (
            <div className="text-center py-8">
              <p className="text-lg text-green-600">✓ Account verified successfully</p>
              <p className="text-sm text-gray-600 mt-2">Proceeding to next step...</p>
            </div>
          );
        }
        return (
          <SimplePersonalInfoForm
            resumeData={resumeData}
            setResumeData={setResumeData}
            showOtpVerification={showOtpVerification}
            onOtpSuccess={handleOtpSuccess}
            pendingUserId={pendingUserId}
          />
        );
      case 2:
        return (
          <OptionalDetailsForm
            resumeData={resumeData}
            setResumeData={setResumeData}
            pendingUserId={pendingUserId}
          />
        );
      case 3:
        return <PaymentStepForm ref={paymentRef} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  if (!isStoreHydrated || !parsedCVData) {
    return (
      <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        <AICVUploadForm onParseComplete={handleCVParsed} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
      <Card className="shadow-lg">

              <CardTitle className="text-lg sm:text-xl lg:text-2xl pt-7 pb-2 text-center flex-1">
                Complete Your Profile
              </CardTitle>
 
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-4">
            <div className="text-center">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold">
                {steps[currentStep - 1]?.title || "Complete Your Profile"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                {steps[currentStep - 1]?.description || "Fill in your details"}
              </p>
            </div>

            <div className="min-h-[300px] sm:min-h-[400px] ">
              {renderStepContent()}
            </div>

            {!showOtpVerification && (
              <div className="space-y-4 pt-1 sm:pt-2 border-t">


                <CardHeader className="p-4 sm:p-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-between">
                      {!showOtpVerification && currentStep > 1 && currentStep !== 3 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className=" p-3 md:p-5"
                          onClick={handlePrevious}
                        >
                          <ChevronLeft className="w-4 h-4 mr-0 " />
                          Previous
                        </Button>
                      ) : (
                        <div />
                      )}

                      {/* {!showOtpVerification && currentStep === steps.length ? (
                <Button 
                  onClick={async () => {
                    setIsLoading(true);
                    await paymentRef.current?.handlePayment();
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
              ) : */}
                      {!showOtpVerification && currentStep < steps.length ? (
                        <Button
                          onClick={handleNext}
                          disabled={isLoading}
                          size="sm"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Next"
                          )}
                        </Button>
                      ) : currentStep === 3 ? (
                        <Button
                          onClick={handleNext}
                          disabled={isLoading}
                          size="sm"
                          className="px-1 md:p-5 "
                        >
                          Proceed to Payment
                        </Button>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <Progress value={progress} className="w-full h-2 sm:h-3" />
                <div className="flex justify-between text-xs sm:text-sm">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center min-w-0 ${
                        step.id <= currentStep
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-medium ${
                          step.id <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {step.id}
                      </div>
                      <span className="mt-1 text-xs text-center max-w-20 ">
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIOnboardingFlow;
