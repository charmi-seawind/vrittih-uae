"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import SimplePersonalInfoForm from "./SimplePersonalInfoForm";
import OptionalDetailsForm from "./OptionalDetailsForm";
import CVUploadForm from "./CVUploadForm";
import PaymentStepForm from "./PaymentStepForm";
import OnboardingMethodSelection from "./OnboardingMethodSelection";
import AIOnboardingFlow from "./AIOnboardingFlow";
import AICVUploadForm from "./AICVUploadForm";
import ManualPaymentForm from "./ManualPaymentForm";
import { ResumeValues } from "@/schema/ResumeEditorSchema";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import OnboardingStatus from "./OnboardingStatus";
import { toast } from "sonner";

interface MultiStepOnboardingFormProps {
  onComplete: () => void;
  isAdminCreated?: boolean;
}

const steps = [
  { id: 1, title: "Personal Info & Verification", description: "Tell us about yourself" },
  { id: 2, title: "Additional Details", description: "Add your experience & skills (Optional)" },
  { id: 3, title: "Upload Documents", description: "Upload CV and profile photo" },
  { id: 4, title: "Choose Plan", description: "Select your subscription plan" },
  { id: 5, title: "Payment Verification", description: "Upload payment proof" },
];

const MultiStepOnboardingForm = ({ onComplete, isAdminCreated = false }: MultiStepOnboardingFormProps) => {
  const cvUploadRef = React.useRef<{ getFiles: () => { file: File | null; photo: File | null } }>(null);
  const paymentRef = React.useRef<{ getSelectedPlan: () => string; handleContinueToPayment: () => void }>(null);
  const [onboardingMethod, setOnboardingMethod] = React.useState<'ai' | 'manual' | null>(() => {
    // Auto-set to manual if user has existing progress
    if (typeof window !== 'undefined') {
      const storedPendingUserId = localStorage.getItem('pendingUserId');
      const storedOnboarding = localStorage.getItem('onboarding-storage');
      if (storedPendingUserId || storedOnboarding) {
        // Check if user has AI progress (parsedCVData)
        try {
          const parsed = JSON.parse(storedOnboarding || '{}');
          if (parsed.state?.parsedCVData && parsed.state?.isEmailVerified && parsed.state?.isMobileVerified) {
            return 'ai';
          }
        } catch (e) {}
        return 'manual';
      }
    }
    return null;
  });
  const [parsedCVData, setParsedCVData] = React.useState<any>(null);

  const handleCVParsed = (data: any) => {

    setParsedCVData(data);
    
    // Store CV and photo files for later upload
    if (data.cvFile) {
      setUploadedCV(data.cvFile.name);
    }
    if (data.photoFile) {
      setUploadedPhoto(data.photoFile.name);
    }
    
    const filledData = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || '',
      country: data.country || '',
      jobTitle: data.jobTitle || '',
      jobCategory: data.jobCategory || '',
      state: data.state || '',
      dob: data.dob || '',
      bio: data.bio || '',
      expectedSalary: data.expectedSalary || '',
      currentSalary: data.currentSalary || '',
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
  const { 
    currentStep, 
    setCurrentStep, 
    pendingUserId, 
    setPendingUserId, 
    isCompleted,
    isEmailVerified,
    isMobileVerified,
    resumeData: storedResumeData,
    uploadedCV,
    uploadedPhoto,
    userBasicInfo,
    setEmailVerified,
    setMobileVerified,
    setResumeData: setStoredResumeData,
    setUploadedCV,
    setUploadedPhoto
  } = useOnboardingStore();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeValues>(() => {
    // Initialize with stored data or basic info
    if (storedResumeData) {
      return storedResumeData;
    }
    if (userBasicInfo) {
      return {
        firstName: userBasicInfo.full_name?.split(' ')[0] || "",
        lastName: userBasicInfo.full_name?.split(' ').slice(1).join(' ') || "",
        email: userBasicInfo.email || "",
        phone: userBasicInfo.mobile || "",
        city: "",
        country: "",
        jobTitle: "",
        jobCategory: "",
        state: "",
        dob: "",
        bio: "",
        expectedSalary: "",
        currentSalary: "",
        educations: [],
        education: [],
        workExperiences: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
      };
    }
    return {
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
      expectedSalary: "",
      currentSalary: "",
      educations: [],
      education: [],
      workExperiences: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
    };
  });

  // Initialize current step based on user progress
  useEffect(() => {
    const initializeStep = async () => {
      if (pendingUserId && isEmailVerified && isMobileVerified) {
        try {
          // Fetch latest user data from backend to verify session is still valid
          const response = await fetch(`/api/job-seeker/pending-user?pendingUserId=${pendingUserId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Session is valid, but don't auto-skip steps for new registrations
              // Only skip if CV is already uploaded
              if (uploadedCV) {
                setCurrentStep(4); // Skip to payment if CV uploaded
              }
            } else {
              // Session expired, reset to step 1
              setCurrentStep(1);
              toast.info("Your session has expired. Please verify your details again.");
            }
          } else {
            // Backend error, reset to step 1
            setCurrentStep(1);
            toast.info("Please verify your details to continue.");
          }
        } catch (error) {
          // Network error, allow user to continue but show warning
          setCurrentStep(1);
          toast.warning("Unable to verify session. Please check your connection.");
        }
      }
    };
    
    initializeStep();
  }, [pendingUserId, isEmailVerified, isMobileVerified, uploadedCV, setCurrentStep]);

  useEffect(() => {
    setStoredResumeData(resumeData);
  }, [resumeData, setStoredResumeData]);

  // Sync local resumeData with stored data when it changes
  useEffect(() => {
    if (storedResumeData) {
      setResumeData(storedResumeData);
    } else if (userBasicInfo && !storedResumeData) {
      // If no stored resume data but we have basic info, populate it
      const basicResumeData = {
        firstName: userBasicInfo.full_name?.split(' ')[0] || "",
        lastName: userBasicInfo.full_name?.split(' ').slice(1).join(' ') || "",
        email: userBasicInfo.email || "",
        phone: userBasicInfo.mobile || "",
        city: "",
        country: "",
        jobTitle: "",
        jobCategory: "",
        state: "",
        dob: "",
        bio: "",
        expectedSalary: "",
        currentSalary: "",
        educations: [],
        education: [],
        workExperiences: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
      };
      setResumeData(basicResumeData);
      setStoredResumeData(basicResumeData);
    }
  }, [storedResumeData, userBasicInfo, setStoredResumeData]);

  useEffect(() => {
    if (isEmailVerified && isMobileVerified && currentStep === 1) {
      setShowOtpVerification(false);
      setCurrentStep(2); // Auto-advance to step 2 after OTP verification
    }
    // Skip to payment step for admin-created users
    if (isAdminCreated && pendingUserId && currentStep === 1) {
      setCurrentStep(4);
    }
  }, [isEmailVerified, isMobileVerified, currentStep, isAdminCreated, pendingUserId, setCurrentStep]);

  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const totalSteps = onboardingMethod === 'ai' && parsedCVData ? 4 : 5; // Skip CV upload step for AI
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep === 1 && !showOtpVerification) {
      // If already verified with pendingUserId, skip to next step
      if (isEmailVerified && isMobileVerified && pendingUserId) {
        setCurrentStep(2);
        return;
      }

      // Validate required fields
      if (typeof (window as any).validatePersonalInfo === 'function') {
        const isValid = (window as any).validatePersonalInfo();
        if (!isValid) {
          return;
        }
      } else if (!resumeData.firstName || !resumeData.lastName || !resumeData.email || !resumeData.phone || 
          !resumeData.jobTitle || !resumeData.jobCategory || !resumeData.dob || !resumeData.city) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      setIsLoading(true);
      try {
        const checkResponse = await fetch('/api/job-seeker/check-existing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: resumeData.email,
            phone: resumeData.phone
          })
        });
        
        if (!checkResponse.ok) {
          const checkError = await checkResponse.json();
          toast.error(checkError.message || 'User validation failed');
          return;
        }
        
        const response = await fetch('/api/job-seeker/save-basic-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            expectedSalary: resumeData.expectedSalary,
            currentSalary: resumeData.currentSalary
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        
        const data = await response.json();
        const backendPendingUserId = data.data?.data?.pendingUserId || data.data?.pendingUserId;
        if (backendPendingUserId) {
          setPendingUserId(backendPendingUserId);
          localStorage.setItem('pendingUserId', backendPendingUserId);
        }
        setShowOtpVerification(true);
        setStoredResumeData(resumeData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to save user data');
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      setIsLoading(true);
      const saved = await (renderStepContent() as any)?.props?.onSave?.();
      setIsLoading(false);
      if (saved !== false) {
        // For AI method, skip step 3 and go directly to step 4
        if (onboardingMethod === 'ai' && parsedCVData?.cvFile) {
          // Upload CV and photo before going to payment
          try {
            const currentPendingUserId = pendingUserId || localStorage.getItem('pendingUserId');
            if (!currentPendingUserId) throw new Error('No pending user ID found');

            const formData = new FormData();
            formData.append('pendingUserId', currentPendingUserId);
            formData.append('cv', parsedCVData.cvFile);
            if (parsedCVData.photoFile) {
              formData.append('photo', parsedCVData.photoFile);
            }

            const response = await fetch('/api/job-seeker/upload-cv', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || 'Upload failed');
            }
            
            setUploadedCV(parsedCVData.cvFile.name);
            if (parsedCVData.photoFile) setUploadedPhoto(parsedCVData.photoFile.name);
            setCurrentStep(4); // Skip to payment
          } catch (error: any) {
            toast.error(error.message || 'Failed to upload files');
          } finally {
            setIsLoading(false);
          }
        } else {
          setCurrentStep(currentStep + 1);
        }
      }
    } else if (currentStep === 3) {
      // Skip upload if already uploaded or AI method
      if (uploadedCV || (onboardingMethod === 'ai' && parsedCVData?.cvFile)) {
        // Upload CV and photo from AI parsing
        if (onboardingMethod === 'ai' && parsedCVData?.cvFile && !uploadedCV) {
          setIsLoading(true);
          try {
            const currentPendingUserId = pendingUserId || localStorage.getItem('pendingUserId');
            if (!currentPendingUserId) throw new Error('No pending user ID found');

            const formData = new FormData();
            formData.append('pendingUserId', currentPendingUserId);
            formData.append('cv', parsedCVData.cvFile);
            if (parsedCVData.photoFile) {
              formData.append('photo', parsedCVData.photoFile);
            }

            const response = await fetch('/api/job-seeker/upload-cv', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || 'Upload failed');
            }
            
            setUploadedCV(parsedCVData.cvFile.name);
            if (parsedCVData.photoFile) setUploadedPhoto(parsedCVData.photoFile.name);
          } catch (error: any) {
            toast.error(error.message || 'Failed to upload files');
            setIsLoading(false);
            return;
          } finally {
            setIsLoading(false);
          }
        }
        setCurrentStep(currentStep + 1);
        return;
      }
      
      const files = cvUploadRef.current?.getFiles();
      if (!files?.file) {
        toast.error('Please upload your CV');
        return;
      }
      const uploaded = await (renderStepContent() as any)?.props?.onUpload?.(files.file, files.photo);
      if (uploaded) {
        setUploadedCV(files.file.name);
        if (files.photo) setUploadedPhoto(files.photo.name);
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
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
    if (!onboardingMethod) {
      return <OnboardingMethodSelection onSelectMethod={setOnboardingMethod} />;
    }

    if (onboardingMethod === 'ai' && !parsedCVData) {
      return <AICVUploadForm onParseComplete={handleCVParsed} />;
    }
    
    switch (currentStep) {
      case 1:
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
            onSave={async () => {
              const currentPendingUserId = pendingUserId || localStorage.getItem('pendingUserId');
              if (!currentPendingUserId) {
                toast.error('Session expired. Please start again.');
                return false;
              }
              try {
                const response = await fetch('/api/job-seeker/save-education-experience', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    pendingUserId: currentPendingUserId,
                    education: resumeData.education || [],
                    experience: resumeData.experience || [],
                    skills: resumeData.skills || [],
                    projects: resumeData.projects || [],
                    certifications: resumeData.certifications || []
                  })
                });
                if (!response.ok) throw new Error('Failed to save details');
                return true;
              } catch (error: any) {
                toast.error(error.message || 'Failed to save details');
                return false;
              }
            }}
          />
        );
      case 3:
        // Skip CV upload for AI method since already uploaded
        if (onboardingMethod === 'ai' && parsedCVData?.cvFile) {
          return null;
        }
        return <CVUploadForm ref={cvUploadRef} alreadyUploaded={!!uploadedCV} onUpload={async (file, photo) => {
          setIsLoading(true);
          try {
            const currentPendingUserId = pendingUserId || localStorage.getItem('pendingUserId');
            if (!currentPendingUserId) throw new Error('No pending user ID found');

            const formData = new FormData();
            formData.append('pendingUserId', currentPendingUserId);
            formData.append('cv', file);
            if (photo) {
              formData.append('photo', photo);
            }

            const response = await fetch('/api/job-seeker/upload-cv', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || 'Upload failed');
            }
            return true;
          } catch (error: any) {
            toast.error(error.message || 'Failed to upload files');
            return false;
          } finally {
            setIsLoading(false);
          }
        }} />;
      case 4:
        return <PaymentStepForm ref={paymentRef} onComplete={onComplete} />;
      case 5:
        return (
          <div className="space-y-6">
            <ManualPaymentForm selectedPlan={selectedPlan} pendingUserId={pendingUserId || ''} onSuccess={onComplete} onSubmit={async () => {}} isUploading={isLoading} />
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Transaction ID *</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction/reference ID"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Screenshot *</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Payment screenshot" className="h-full object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Click to upload screenshot</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("File size should be less than 5MB");
                          return;
                        }
                        setScreenshot(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!onboardingMethod) {
    return (
      <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        <OnboardingMethodSelection onSelectMethod={setOnboardingMethod} />
      </div>
    );
  }

  if (onboardingMethod === 'ai') {
    return <AIOnboardingFlow onComplete={onComplete} />;
  }

  return (
    <div className="w-full">
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-2xl sm:text-3xl text-center font-bold text-primary">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {steps[currentStep - 1]?.title || 'Loading...'}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {steps[currentStep - 1]?.description || ''}
              </p>
            </div>

            <div className="min-h-[300px] py-4">
              {renderStepContent()}
            </div>

            {!showOtpVerification && (
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  {currentStep > 1 && currentStep < 4 ? (
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handlePrevious}
                      className="px-6"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}
                  {currentStep < 4 ? (
                    <Button 
                      onClick={handleNext} 
                      disabled={isLoading}
                      size="default"
                      className="px-6"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <>
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                      {isLoading && "Loading..."}
                    </Button>
                  ) : currentStep === 4 ? (
                    <Button 
                      onClick={() => {
                        paymentRef.current?.handleContinueToPayment();
                      }}
                      disabled={isLoading}
                      size="default"
                      className="px-6"
                    >
                      Proceed to Payment
                    </Button>
                  ) : currentStep === 5 ? (
                    <Button 
                      onClick={async () => {
                        if (!transactionId.trim()) {
                          toast.error("Please enter transaction ID");
                          return;
                        }
                        if (!screenshot) {
                          toast.error("Please upload payment screenshot");
                          return;
                        }
                        setIsLoading(true);
                        try {
                          const formData = new FormData();
                          formData.append("pendingUserId", pendingUserId || '');
                          formData.append("transactionId", transactionId);
                          formData.append("planId", selectedPlan);
                          formData.append("amount", "999");
                          formData.append("paymentScreenshot", screenshot);

                          const response = await fetch("/api/job-seeker/upload-payment-proof", {
                            method: "POST",
                            body: formData,
                          });

                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.message || "Upload failed");
                          }

                          toast.success("Payment proof submitted successfully!");
                          toast.info("Creating your account...");
                          
                          // Create account
                          const completeResponse = await fetch("/api/job-seeker/complete-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              pendingUserId,
                              paymentId: transactionId,
                              planId: selectedPlan
                            })
                          });

                          if (!completeResponse.ok) {
                            const error = await completeResponse.json();
                            throw new Error(error.message || "Account creation failed");
                          }

                          const result = await completeResponse.json();
                          const apiData = result?.data?.data;
                          const user = apiData?.user;
                          const token = apiData?.token;
                          
                          if (user && token) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));
                            localStorage.removeItem('pendingUserId');
                            localStorage.removeItem('onboarding-storage');
                            
                            toast.success("Account created! You can apply for jobs once payment is verified.");
                            setTimeout(() => {
                              window.location.href = '/job-seeker/dashboard';
                            }, 1500);
                          } else {
                            throw new Error("Invalid response from server");
                          }
                        } catch (error: any) {
                          toast.error(error.message || "Failed to submit payment proof");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading || !transactionId || !screenshot}
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Verify Payment'
                      )}
                    </Button>
                  ) : (
                    <div />
                  )}
                </div>
                <Progress value={progress} className="w-full h-2 sm:h-3" />
                <div className="flex justify-between text-xs sm:text-sm">
                  {steps.filter((step) => !(onboardingMethod === 'ai' && parsedCVData && step.id === 3)).map((step) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center min-w-0 ${
                        step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          step.id <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {step.id}
                      </div>
                      <span className="mt-1 text-xs text-center leading-tight">
                        {step.title.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <p className="text-xs text-gray-600">
                    <span className="text-red-500">*</span> means Required Fields
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepOnboardingForm;
