"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import EmployerBasicInfoForm from "./EmployerForms/EmployerBasicInfoForm";
import JobDetailsForm from "./EmployerForms/JobDetailsForm";
import CompanyLocationForm from "./EmployerForms/CompanyLocationForm";
import CompanyDescriptionForm from "./EmployerForms/CompanyDescriptionForm";
import EmployerPaymentForm from "./EmployerForms/EmployerPaymentForm";
import DualOtpVerification from "./DualOtpVerification";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MultiStepEmployerOnboardingFormProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, title: "Personal Information", description: "Tell us about yourself" },
  { id: 2, title: "Company Details", description: "Complete your company profile" },
  { id: 3, title: "Job Details", description: "Job posting information" },
  { id: 4, title: "Choose Plan", description: "Select your employer plan" },
];

interface EmployerData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  description: string;
  foundedYear: string;
  is_consultancy: boolean;
  job_title: string;
  job_category: string;
  job_type: string;
  work_location_type: string;
  office_address: string;
  pay_type: string;
  pay_amount: string;
  additional_perks: string;
  joining_fee_required: boolean;
  job_description: string;
  is_walk_in: boolean;
  application_email: string;
  // Profile completion fields
  founded_year: number;
  website_url: string;
  about_company: string;
  zip_code: string;
  gst_number?: string;
  minimum_education: string;
  language_required: string;
  experience_required: string;
  additional_requirements: string;
  required_skills: string[];
}

const MultiStepEmployerOnboardingForm = ({ onComplete }: MultiStepEmployerOnboardingFormProps) => {
  const { currentStep, setCurrentStep, pendingUserId, setPendingUserId, isCompleted } = useOnboardingStore();
  const { toast: useToastHook } = useToast();
  const router = useRouter();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [employerData, setEmployerData] = useState<EmployerData>({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    companyName: "",
    companySize: "",
    industry: "Technology",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    description: "",
    foundedYear: "",
    is_consultancy: false,
    job_title: "",
    job_category: "",
    job_type: "",
    work_location_type: "",
    office_address: "",
    pay_type: "",
    pay_amount: "",
    additional_perks: "",
    joining_fee_required: false,
    job_description: "",
    is_walk_in: false,
    application_email: "",
    // Profile completion fields
    founded_year: 0,
    website_url: "",
    about_company: "",
    zip_code: "",
    minimum_education: "",
    language_required: "",
    experience_required: "",
    additional_requirements: "",
    required_skills: [],
    gst_number: "",
  });

  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  // Load registration data from localStorage on component mount
  useEffect(() => {
    const savedRegistrationData = localStorage.getItem('employerRegistrationData');
    if (savedRegistrationData) {
      try {
        const parsedData = JSON.parse(savedRegistrationData);
        setEmployerData(prev => ({
          ...prev,
          fullName: parsedData.full_name || "",
          email: parsedData.email || "",
          phone: parsedData.mobile || parsedData.phone || "",
          companyName: parsedData.company_name || "",
          companySize: parsedData.company_size || "",
          industry: parsedData.industry || "Technology",
          is_consultancy: parsedData.is_consultancy || false,
          address: parsedData.address || "",
          city: parsedData.city || "",
          state: parsedData.state || "",
          zipCode: parsedData.zip_code || "",
          website: parsedData.website_url || "",
          description: parsedData.about_company || "",
          foundedYear: parsedData.founded_year ? parsedData.founded_year.toString() : "",
          gst_number: parsedData.gst_number || ""
        }));
      } catch (error) {
      }
    }
  }, []);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 1) {
      // If pendingUserId exists and OTP not showing, assume already verified
      if (pendingUserId && !showOtpVerification) {
        const stored = localStorage.getItem('onboarding-storage');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            // If verification flags exist and true, skip
            if (parsed.state?.isEmailVerified && parsed.state?.isMobileVerified) {
              setCurrentStep(2);
              return;
            }
            // If pendingUserId matches and we're on step 1, likely already verified
            if (parsed.state?.pendingUserId === pendingUserId && currentStep === 1) {
              setCurrentStep(2);
              return;
            }
          } catch (e) {}
        }
      }

      // If OTP is showing, don't send again
      if (showOtpVerification) {
        return;
      }

      // Validate required fields
      if (!employerData.fullName || !employerData.email || !employerData.phone || !employerData.companyName) {
        toast.error('Please fill in all required fields before proceeding.');
        return;
      }
      
      // Validate phone number
      if (!employerData.phone || employerData.phone.length < 10) {
        toast.error('Please enter a valid phone number.');
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: employerData.fullName,
            email: employerData.email,
            phone: employerData.phone,
            company_name: employerData.companyName,
            company_size: employerData.companySize,
            is_consultancy: employerData.is_consultancy,
            industry: employerData.industry || 'Technology'
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        
        const data = await response.json();
        
        // Check if user already exists
        if (data.data?.isExistingUser) {
          toast.error('User already exists. Please use the login page to access your account.');
          setTimeout(() => {
            router.push('https://vrrittih.com');
          }, 2000);
          return;
        }
        
        // Store pendingUserId from response
        if (data.data?.pendingUserId) {
          setPendingUserId(data.data.pendingUserId);
          localStorage.setItem('pendingUserId', data.data.pendingUserId);
          sessionStorage.setItem('pendingUserId', data.data.pendingUserId);
        } else if (data.pendingUserId) {
          setPendingUserId(data.pendingUserId);
          localStorage.setItem('pendingUserId', data.pendingUserId);
          sessionStorage.setItem('pendingUserId', data.pendingUserId);
        } else {
        }
        
        setShowOtpVerification(true);
      } catch (error: any) {
        toast.error(error.message || 'Failed to register employer');
      } finally {
        setIsLoading(false);
      }

    } else if (currentStep === 2) {
      // Validate company details
      if (!employerData.industry || !employerData.founded_year || !employerData.website_url || 
          !employerData.phone || !employerData.about_company || !employerData.address || 
          !employerData.state || !employerData.city || !employerData.zip_code) {
        toast.error('Please fill in all required company details.');
        return;
      }
      
      setIsLoading(true);
      try {
        const currentPendingUserId = pendingUserId || localStorage.getItem('pendingUserId');
        
        if (!currentPendingUserId) {
          toast.error('No pending user ID found. Please start from the beginning.');
          return;
        }
        
        const profileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/employer/pending/${currentPendingUserId}/profile`;
        const profileBody = {
          company_name: employerData.companyName,
          industry: employerData.industry || 'Technology',
          company_size: employerData.companySize,
          founded_year: employerData.founded_year ? parseInt(employerData.founded_year.toString()) : null,
          website_url: employerData.website_url || employerData.website,
          phone: employerData.phone,
          about_company: employerData.about_company || employerData.description,
          address: employerData.address,
          city: employerData.city,
          state: employerData.state,
          zip_code: employerData.zip_code || employerData.zipCode,
          gst_number: employerData.gst_number || null
        };
        
        const response = await fetch(profileUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileBody)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update profile');
        }
        
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error(error.message || 'Failed to save company details');
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 3) {
      // Validate job details
      if (!employerData.job_title || !employerData.job_category || !employerData.job_type || 
          !employerData.work_location_type || !employerData.pay_type || !employerData.pay_amount || 
          !employerData.job_description || !employerData.minimum_education || !employerData.language_required || !employerData.experience_required) {
        toast.error('Please fill in all required job details.');
        return;
      }
      
      setIsLoading(true);
      try {
        const currentPendingUserId = pendingUserId || localStorage.getItem('pendingUserId');
        
        if (!currentPendingUserId) {
          toast.error('No pending user ID found. Please start from the beginning.');
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/pending/${currentPendingUserId}/job-details`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_title: employerData.job_title,
            job_category: employerData.job_category,
            job_type: employerData.job_type,
            work_location_type: employerData.work_location_type,
            office_address: employerData.office_address,
            pay_type: employerData.pay_type,
            pay_amount: employerData.pay_amount,
            additional_perks: employerData.additional_perks,
            joining_fee_required: employerData.joining_fee_required,
            job_description: employerData.job_description,
            is_walk_in: employerData.is_walk_in,
            application_email: employerData.application_email,
            minimum_education: employerData.minimum_education,
            language_required: employerData.language_required,
            experience_required: employerData.experience_required,
            additional_requirements: employerData.additional_requirements,
            required_skills: employerData.required_skills
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error(error.message || 'Failed to save job details');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePaymentSuccess = () => {
    onComplete();
  };

  const handleOtpSuccess = (verifiedUserId?: string) => {
    setShowOtpVerification(false);
    
    // Update pendingUserId with the verified one if provided
    if (verifiedUserId) {
      setPendingUserId(verifiedUserId);
      localStorage.setItem('pendingUserId', verifiedUserId);
      sessionStorage.setItem('pendingUserId', verifiedUserId);
    }
    
    // Mark as verified
    const stored = localStorage.getItem('onboarding-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.state) parsed.state = {};
        parsed.state.isEmailVerified = true;
        parsed.state.isMobileVerified = true;
        parsed.state.pendingUserId = verifiedUserId || pendingUserId;
        localStorage.setItem('onboarding-storage', JSON.stringify(parsed));
      } catch (e) {}
    } else {
      // Create new storage
      localStorage.setItem('onboarding-storage', JSON.stringify({
        state: {
          isEmailVerified: true,
          isMobileVerified: true,
          pendingUserId: verifiedUserId || pendingUserId
        }
      }));
    }
    
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1 && showOtpVerification) {
      return (
        <DualOtpVerification
          email={employerData.email || "user@example.com"}
          mobile={employerData.phone || ""}
          pendingUserId={pendingUserId}
          onSuccess={handleOtpSuccess}
          userType="employer"
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <EmployerBasicInfoForm
            employerData={employerData}
            setEmployerData={setEmployerData}
          />
        );
      case 2:
        return (
          <CompanyLocationForm
            employerData={employerData}
            setEmployerData={setEmployerData}
          />
        );
      case 3:
        return (
          <JobDetailsForm
            employerData={employerData}
            setEmployerData={setEmployerData}
          />
        );
      case 4:
        return (
          <EmployerPaymentForm
            pendingUserId={pendingUserId || localStorage.getItem('pendingUserId') || ''}
            onPaymentSuccess={handlePaymentSuccess}
            employerData={{
              industry: employerData.industry,
              companySize: employerData.companySize,
              website: employerData.website,
              description: employerData.description,
              address: employerData.address
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 md:p-4">
      <Card>
        <CardHeader className="pb-6">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <CardTitle className="  text-xl md:text-3xl font-bold text-gray-900 mb-2">Complete Your Company Profile</CardTitle>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-primary">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">

            <div>
              {renderStepContent()}
            </div>

            {!showOtpVerification && (
              <div className="space-y-4 pt-2 border-t">
                <div className="flex items-center justify-between">
                  {currentStep > 1 && currentStep !== 2 && currentStep !== 4 ? (
                    <Button variant="outline" size="sm" onClick={handlePrevious}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  ) : <div />}
                  {currentStep < steps.length ? (
                    <Button onClick={handleNext} disabled={isLoading} size="sm">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Next'}
                    </Button>
                  ) : <div />}
                </div>
                <Progress value={progress} className="w-full h-2" />
                <div className="flex justify-between text-xs">
                  {steps.map((step) => (
                    <div key={step.id} className={`flex flex-col items-center ${step.id <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step.id <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {step.id}
                      </div>
                      <span className="mt-1 text-xs text-center max-w-20 ">{step.title}</span>
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

export default MultiStepEmployerOnboardingForm;