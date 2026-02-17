"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Upload, CheckCircle, Crown, Award, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { jobsAPI } from "@/services/api";

interface JobApplicationPageProps {
  jobData: any;
}

const JobApplicationPage = ({ jobData }: JobApplicationPageProps) => {
  const [cvUploaded, setCvUploaded] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const pricingPlans = [
    {
      id: "basic",
      name: "Basic CV Package",
      price: "₹99",
      features: ["1 CV Upload", "Basic Profile", "Job Alerts"],
      popular: false
    },
    {
      id: "premium",
      name: "Premium CV Package", 
      price: "₹999",
      features: ["Unlimited CV Uploads", "Premium Profile", "Priority Support", "Resume Builder"],
      popular: true
    },
    {
      id: "job-basic",
      name: "Job Package Basic",
      price: "₹499", 
      features: ["10 Job Applications", "Basic Support", "Job Matching"],
      popular: false
    },
    {
      id: "job-pro",
      name: "Job Package Pro",
      price: "₹999",
      features: ["50 Job Applications", "Priority Support", "Advanced Matching"],
      popular: false
    },
    {
      id: "job-premium",
      name: "Job Package Premium",
      price: "₹2,999",
      features: ["Unlimited Applications", "Premium Support", "Career Guidance"],
      popular: false
    },
    {
      id: "job-elite",
      name: "Job Package Elite",
      price: "₹4,999", 
      features: ["Everything Included", "Personal Career Coach", "Interview Prep"],
      popular: false
    }
  ];

  const handleCvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setCvUploaded(true);
      setShowSuccessPopup(true);
      setIsUploading(false);
      toast.success("CV uploaded successfully!");
    }, 2000);
  };

  const handleSubmitApplication = async () => {
    try {
      await jobsAPI.applyForJob(jobData.id);
      toast.success("Application submitted successfully!");
      setShowSuccessPopup(false);
      setShowPricingPlans(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleGetStarted = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setShowPricingPlans(false);
      setShowPaymentSuccess(true);
      setIsProcessingPayment(false);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        window.location.href = "/job-seeker/dashboard";
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Job Details Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Image 
                src={jobData?.company?.logoUrl || "/images/default-company-vrrittih.png"}
                alt={jobData?.company?.name || "Company Logo"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <CardTitle className="text-2xl">{jobData?.title}</CardTitle>
                <p className="text-muted-foreground">{jobData?.company?.name}</p>
                <Badge variant="secondary">{jobData?.location}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* CV Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!cvUploaded ? (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-4">Upload your CV to apply for this position</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvUpload}
                    className="hidden"
                    id="cv-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="cv-upload">
                    <Button asChild disabled={isUploading}>
                      <span className="cursor-pointer">
                        {isUploading ? "Uploading..." : "Choose File"}
                      </span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="text-green-600">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg font-semibold">CV Uploaded Successfully!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success Popup */}
        {showSuccessPopup && (
          <Card className="mb-6 border-green-500 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Upload Successful!</h3>
                    <p className="text-green-700">Your CV has been uploaded successfully.</p>
                  </div>
                </div>
                <Button onClick={() => setShowSuccessPopup(false)} variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4">
                <Button onClick={handleSubmitApplication} className="w-full">
                  Submit Your Application
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans Section */}
        {showPricingPlans && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Choose Your Plan</CardTitle>
              <p className="text-center text-muted-foreground">Select a package to continue with your application</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer transition-all",
                      selectedPlan === plan.id ? "border-blue-500 bg-blue-50" : "border-gray-200",
                      plan.popular && "ring-2 ring-orange-500"
                    )}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.popular && (
                      <Badge className="mb-2 bg-orange-500">Most Popular</Badge>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {plan.name.includes("Premium") || plan.name.includes("Elite") ? (
                        <Crown className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Award className="w-5 h-5 text-blue-500" />
                      )}
                      <h3 className="font-semibold">{plan.name}</h3>
                    </div>
                    <p className="text-2xl font-bold mb-3">{plan.price}</p>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleGetStarted}
                  disabled={!selectedPlan || isProcessingPayment}
                  className="px-8 py-3 text-lg"
                >
                  {isProcessingPayment ? "Processing..." : "Get Started"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Success Popup */}
        {showPaymentSuccess && (
          <Card className="mb-6 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h2>
                <p className="text-green-700 text-lg">Your application has been submitted successfully.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h3 className="font-semibold mb-3">Application Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="font-medium">{jobData?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <span className="font-medium">{jobData?.company?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan Selected:</span>
                    <span className="font-medium">
                      {pricingPlans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                <Sparkles className="w-5 h-5" />
                <span>Redirecting to your dashboard...</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: "100%"}}></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobApplicationPage;