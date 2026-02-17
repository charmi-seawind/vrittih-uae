"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Briefcase, Award, FolderKanban, FileCheck, AlertCircle, CreditCard, User, FileText, Upload, Loader2, Check, Star, Crown } from "lucide-react";
import EducationForm from "@/components/Forms/ResumeEditorForms/EducationForm";
import WorkExperienceForm from "@/components/Forms/ResumeEditorForms/WorkExperienceForm";
import SkillsForm from "@/components/Forms/ResumeEditorForms/SkillsForm";
import CVUploadForm from "@/components/Forms/CVUploadForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaymentSuccessModal from "@/components/ui/PaymentSuccessModal";
import { useRouter } from "next/navigation";

const PendingUserDashboard = () => {
  const router = useRouter();
  const [pendingUser, setPendingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("pendingUserToken");
    const pendingUserId = localStorage.getItem("pendingUserId");
    
    if (!token || !pendingUserId) {
      router.push("/pending-user/login");
      return;
    }

    // Fetch real pending user data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/pending-user/${pendingUserId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const userData = data.data;
          // Parse education_experience if it exists
          let educationExperience = {};
          try {
            if (userData.education_experience) {
              educationExperience = JSON.parse(userData.education_experience);
            }
          } catch (e) {
            console.error('Error parsing education_experience:', e);
          }
          


          
          setPendingUser({
            ...userData,
            educationExperience
          });
          setEditData({
            basicInfo: userData.basicInfo || {},
            educationExperience
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [router]);

  // Fetch job seeker plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/job_seeker`);
        const data = await response.json();
        
        if (data.success) {
          const plans = data.data.plans.map((plan, index) => {
            // Handle mixed features format
            let features = [];
            if (plan.features && typeof plan.features === 'object') {
              // Extract numeric keys (0, 1, 2, 3) for display features
              const displayFeatures = [];
              Object.keys(plan.features).forEach(key => {
                if (!isNaN(Number(key))) {
                  displayFeatures.push(plan.features[key]);
                }
              });
              
              // If we have display features, use them; otherwise use limits
              if (displayFeatures.length > 0) {
                features = displayFeatures;
              } else {
                features = [
                  `CV Uploads: ${plan.features.cv_uploads || 1}`,
                  `Job Applications: ${plan.features.job_applications || 3}`,
                  `Job Withdrawals: ${plan.features.job_withdrawals || 0}`,
                  plan.features.featured_jobs_access ? 'Featured Jobs Access' : 'No Featured Jobs'
                ];
              }
            }
            
            return {
              id: plan.id,
              name: plan.name,
              price: parseFloat(plan.price),
              duration: `${plan.duration} days`,
              features: features,
              popular: index === 1 // Make second plan popular by default
            };
          });
          setPackages(plans);
        }
      } catch (error) {
        setPackages([]);
        console.error('Failed to load plans:', error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const currentIsLoading = isLoading;
    if (currentIsLoading) return;
    
    setIsLoading(true);
    try {
      const currentPendingUserId = pendingUser?.pendingUserId || localStorage.getItem('pendingUserId');
      
      // Save basic info
      const basicResponse = await fetch('/api/job-seeker/update-basic-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingUserId: currentPendingUserId,
          ...editData.basicInfo
        })
      });
      
      // Save education/experience
      const eduResponse = await fetch('/api/job-seeker/save-education-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingUserId: currentPendingUserId,
          ...editData.educationExperience
        })
      });
      
      if (basicResponse.ok && eduResponse.ok) {
        setPendingUser(prev => ({
          ...prev,
          basicInfo: editData.basicInfo,
          educationExperience: editData.educationExperience
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pendingUserToken");
    localStorage.removeItem("pendingUserId");
    sessionStorage.removeItem("pendingUserToken");
    sessionStorage.removeItem("pendingUserId");
    localStorage.clear();
    sessionStorage.clear();
    router.push("https://vrrittih.com");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    setIsProcessingPayment(true);
    try {
      const currentPendingUserId = pendingUser?.id || localStorage.getItem('pendingUserId');
      if (!currentPendingUserId) throw new Error('No pending user ID found');
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const orderResponse = await fetch('/api/job-seeker/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: packages.find(p => p.id === selectedPlan)?.price,
          planId: selectedPlan,
          pendingUserId: currentPendingUserId
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');
      const { orderId } = await orderResponse.json();
      
      // Open Razorpay checkout
      const options = {
        key: "rzp_live_RrtsJrVleUY6RP",
        amount: packages.find(p => p.id === selectedPlan)?.price * 100,
        currency: 'INR',
        name: 'Vrrittih',
        description: `${packages.find(p => p.id === selectedPlan)?.name} Plan`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/job-seeker/verify-razorpay-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                pendingUserId: currentPendingUserId,
                planId: selectedPlan
              })
            });

            if (!verifyResponse.ok) throw new Error('Payment verification failed');
            
            const result = await verifyResponse.json();
            if (!result.success) throw new Error(result.error || 'Payment verification failed');
            
            const apiData = result?.data;
            const user = apiData?.user;
            const token = apiData?.token;
            
            if (user && token) {
              localStorage.removeItem('pendingUserId');
              localStorage.removeItem('pendingUserToken');
              sessionStorage.removeItem('pendingUserId');
              localStorage.removeItem('onboarding-storage');
              
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              
              const selectedPackage = packages.find(p => p.id === selectedPlan);
              setPaymentDetails({
                amount: selectedPackage?.price || 0,
                transactionId: response.razorpay_payment_id,
                planName: selectedPackage?.name || '',
                duration: selectedPackage?.duration || '',
                date: new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                paymentMethod: 'Razorpay'
              });
              setShowPaymentSuccess(true);
              
              setTimeout(() => {
                router.push('/job-seeker/dashboard');
              }, 2000);
            } else {
              throw new Error('Invalid response: missing user or token');
            }
          } catch (error: any) {
            alert(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: pendingUser?.full_name || 'User',
          email: pendingUser?.email || ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      alert(error.message || 'Payment failed');
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Complete Your Registration</h1>
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Incomplete
              </Badge>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </Button>
                <Button
                  variant={activeTab === "details" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("details")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Education & Experience
                </Button>
                <Button
                  variant={activeTab === "upload" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("upload")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CV
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {activeTab === "profile" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                        <Button onClick={(e) => handleSave(e)} disabled={isLoading} type="button">Save</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} type="button">Edit</Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input value={pendingUser?.basicInfo?.firstName || ""} disabled />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value={pendingUser?.basicInfo?.lastName || ""} disabled />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={pendingUser?.email || ""} disabled />
                    </div>
                    <div>
                      <Label>Mobile</Label>
                      <Input value={pendingUser?.mobile || ""} disabled />
                    </div>
                    <div>
                      <Label>Birth Year</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.dateOfBirth || "" : pendingUser?.basicInfo?.dateOfBirth || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, dateOfBirth: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.city || "" : pendingUser?.basicInfo?.city || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, city: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Job Title</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.jobTitle || "" : pendingUser?.basicInfo?.jobTitle || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, jobTitle: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Job Category</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.jobCategory || "" : pendingUser?.basicInfo?.jobCategory || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, jobCategory: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Expected Salary</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.expectedSalary || "" : pendingUser?.basicInfo?.expectedSalary || "Not specified"} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, expectedSalary: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Current Salary</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.currentSalary || "" : pendingUser?.basicInfo?.currentSalary || "Not specified"} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, currentSalary: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Your information is saved. Complete payment to activate your account.
                    </p>
                  </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "details" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Education & Experience Details</CardTitle>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                        <Button onClick={(e) => handleSave(e)} disabled={isLoading} type="button">Save</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} type="button">Edit</Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                          Education
                        </h3>
                        <EducationForm 
                          resumeData={{education: editData.educationExperience?.education || []}}
                          setResumeData={(data) => {
                            setEditData(prev => ({...prev, educationExperience: {...prev.educationExperience, education: data.education}}));
                          }}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-green-600" />
                          Work Experience
                        </h3>
                        <WorkExperienceForm 
                          resumeData={{experience: editData.educationExperience?.experience || []}}
                          setResumeData={(data) => {
                            setEditData(prev => ({...prev, educationExperience: {...prev.educationExperience, experience: data.experience}}));
                          }}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Award className="h-5 w-5 text-purple-600" />
                          Skills
                        </h3>
                        <SkillsForm 
                          resumeData={{skills: editData.educationExperience?.skills || []}}
                          setResumeData={(data) => {
                            setEditData(prev => ({...prev, educationExperience: {...prev.educationExperience, skills: data.skills}}));
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Accordion type="multiple" className="w-full space-y-4">
                      <AccordionItem value="education" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            <div className="text-left">
                              <p className="font-semibold">Education</p>
                              <p className="text-xs text-muted-foreground">
                                {pendingUser?.educationExperience?.education?.length || 0} education
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-3">
                            {pendingUser?.educationExperience?.education?.length > 0 ? (
                              pendingUser.educationExperience.education.map((edu, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><Label>Degree</Label><div className="p-2 bg-gray-50 rounded text-sm">{edu.degree}</div></div>
                                    <div><Label>Institution</Label><div className="p-2 bg-gray-50 rounded text-sm">{edu.institution}</div></div>
                                    <div><Label>Year/Duration</Label><div className="p-2 bg-gray-50 rounded text-sm">{edu.year || `${edu.startDate} - ${edu.endDate}`}</div></div>
                                    {edu.gpa && <div><Label>GPA</Label><div className="p-2 bg-gray-50 rounded text-sm">{edu.gpa}</div></div>}
                                    {edu.location && <div><Label>Location</Label><div className="p-2 bg-gray-50 rounded text-sm">{edu.location}</div></div>}
                                    {edu.grade && <div><Label>Grade/CGPA</Label><div className="p-2 bg-gray-50 rounded text-sm">{edu.grade}</div></div>}
                                  </div>
                                  {edu.description && (
                                    <div className="mt-3"><Label>Description</Label><div className="p-2 bg-gray-50 rounded text-sm">{edu.description}</div></div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No education information provided</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="experience" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-green-600" />
                            <div className="text-left">
                              <p className="font-semibold">Work Experience</p>
                              <p className="text-xs text-muted-foreground">
                                {pendingUser?.educationExperience?.experience?.length || 0} work experience
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-3">
                            {pendingUser?.educationExperience?.experience?.length > 0 ? (
                              pendingUser.educationExperience.experience.map((exp, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><Label>Job Title</Label><div className="p-2 bg-gray-50 rounded text-sm">{exp.title || exp.jobTitle}</div></div>
                                    <div><Label>Company</Label><div className="p-2 bg-gray-50 rounded text-sm">{exp.company}</div></div>
                                    <div><Label>Duration</Label><div className="p-2 bg-gray-50 rounded text-sm">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</div></div>
                                    {exp.location && <div><Label>Location</Label><div className="p-2 bg-gray-50 rounded text-sm">{exp.location}</div></div>}
                                  </div>
                                  {exp.description && (
                                    <div className="mt-3"><Label>Description</Label><div className="p-2 bg-gray-50 rounded text-sm">{exp.description}</div></div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No experience information provided</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="skills" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-purple-600" />
                            <div className="text-left">
                              <p className="font-semibold">Skills</p>
                              <p className="text-xs text-muted-foreground">
                                {pendingUser?.educationExperience?.skills?.length || 0} skills
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="flex flex-wrap gap-2">
                            {pendingUser?.educationExperience?.skills?.length > 0 ? (
                              pendingUser.educationExperience.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                              ))
                            ) : (
                              <p className="text-gray-500">No skills provided</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="projects" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <FolderKanban className="h-5 w-5 text-orange-600" />
                            <div className="text-left">
                              <p className="font-semibold">Projects</p>
                              <p className="text-xs text-muted-foreground">
                                {pendingUser?.educationExperience?.projects?.length || 0} projects
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-3">
                            {pendingUser?.educationExperience?.projects?.length > 0 ? (
                              pendingUser.educationExperience.projects.map((project, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <div><Label>Project Name</Label><div className="p-2 bg-gray-50 rounded text-sm">{project.name}</div></div>
                                  <div><Label>Technologies</Label><div className="p-2 bg-gray-50 rounded text-sm">{Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</div></div>
                                  {project.duration && <div><Label>Duration</Label><div className="p-2 bg-gray-50 rounded text-sm">{project.duration}</div></div>}
                                  {project.description && <div><Label>Description</Label><div className="p-2 bg-gray-50 rounded text-sm">{project.description}</div></div>}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No projects provided</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="certifications" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <FileCheck className="h-5 w-5 text-red-600" />
                            <div className="text-left">
                              <p className="font-semibold">Certifications</p>
                              <p className="text-xs text-muted-foreground">
                                {pendingUser?.educationExperience?.certifications?.length || 0} certifications
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-3">
                            {pendingUser?.educationExperience?.certifications?.length > 0 ? (
                              pendingUser.educationExperience.certifications.map((cert, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <div><Label>Certification Name</Label><div className="p-2 bg-gray-50 rounded text-sm">{cert.name}</div></div>
                                  <div><Label>Issuer</Label><div className="p-2 bg-gray-50 rounded text-sm">{cert.issuer}</div></div>
                                  {cert.date && <div><Label>Date</Label><div className="p-2 bg-gray-50 rounded text-sm">{cert.date}</div></div>}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No certifications provided</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingUser?.cvUploaded ? (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Uploaded Documents</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">CV Uploaded</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setShowPreview(true)}>Preview</Button>
                            <Button size="sm" variant="destructive" onClick={async () => {
                              try {
                                const response = await fetch('/api/job-seeker/delete-cv', {
                                  method: 'DELETE',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ pendingUserId: pendingUser.pendingUserId })
                                });
                                if (response.ok) {
                                  setPendingUser(prev => ({...prev, cvUploaded: false}));
                                }
                              } catch (error) {
                                console.error('Delete failed:', error);
                              }
                            }}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="space-y-4">
                        <div>
                          <Label>CV File *</Label>
                          <Input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditData(prev => ({...prev, cvFile: file}));
                              }
                            }}
                          />
                          {editData.cvFile && (
                            <p className="text-sm text-green-600 mt-1">Selected: {editData.cvFile.name}</p>
                          )}
                        </div>
                        <div>
                          <Label>Profile Photo (Optional)</Label>
                          <Input 
                            type="file" 
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditData(prev => ({...prev, photoFile: file}));
                              }
                            }}
                          />
                          {editData.photoFile && (
                            <p className="text-sm text-green-600 mt-1">Selected: {editData.photoFile.name}</p>
                          )}
                        </div>
                        <Button 
                          onClick={async () => {
                            if (!editData.cvFile) return;
                            
                            setIsLoading(true);
                            try {
                              const formData = new FormData();
                              formData.append('pendingUserId', pendingUser.pendingUserId);
                              formData.append('cv', editData.cvFile);
                              if (editData.photoFile) formData.append('photo', editData.photoFile);
                              
                              const response = await fetch('/api/job-seeker/upload-cv', {
                                method: 'POST',
                                body: formData
                              });
                              
                              if (response.ok) {
                                setPendingUser(prev => ({...prev, cvUploaded: true}));
                                setEditData(prev => ({...prev, cvFile: null, photoFile: null}));
                              }
                            } catch (error) {
                              console.error('Upload error:', error);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={!editData.cvFile || isLoading}
                        >
                          {isLoading ? 'Uploading...' : 'Save Documents'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Complete Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingPlans ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading plans...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Choose Your Subscription Plan</h3>
                        <p className="text-gray-600 mb-6">
                          Select the perfect package to activate your account
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packages.map((pkg) => (
                          <Card 
                            key={pkg.id}
                            className={`relative cursor-pointer transition-all duration-200 ${
                              selectedPlan === pkg.id 
                                ? "ring-2 ring-primary border-primary" 
                                : "hover:shadow-lg"
                            } ${pkg.popular ? "border-primary" : ""}`}
                            onClick={() => setSelectedPlan(pkg.id)}
                          >
                            {pkg.popular && (
                              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-xs">
                                <Star className="w-2 h-2 mr-1" />
                                Most Popular
                              </Badge>
                            )}
                            <CardHeader className="text-center p-4">
                              <div className="flex justify-center mb-2">
                                {pkg.id === "featured" ? (
                                  <Crown className="w-6 h-6 text-primary" />
                                ) : (
                                  <Check className="w-6 h-6 text-green-500" />
                                )}
                              </div>
                              <CardTitle className="text-lg">{pkg.name}</CardTitle>
                              <div>
                                <span className="text-2xl font-bold text-primary">₹{pkg.price}</span>
                                <span className="text-sm text-gray-500 ml-2 block">for {pkg.duration}</span>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <ul className="space-y-2">
                                {pkg.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                    <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {selectedPlan && (
                        <Card className="mt-6">
                          <CardHeader>
                            <CardTitle className="text-lg">Payment Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center mb-4">
                              <span>Package: {packages.find(p => p.id === selectedPlan)?.name}</span>
                              <span className="font-bold">₹{packages.find(p => p.id === selectedPlan)?.price}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                              <span>Total Amount:</span>
                              <span>₹{packages.find(p => p.id === selectedPlan)?.price}</span>
                            </div>
                            <Button 
                              onClick={handlePayment}
                              disabled={!selectedPlan || isProcessingPayment}
                              className="w-full mt-6 h-12 text-base font-medium"
                              size="lg"
                            >
                              {isProcessingPayment ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing Payment...
                                </>
                              ) : (
                                'Complete Payment'
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* CV Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={(() => {
                  const token = localStorage.getItem('pendingUserToken');
                  return `${process.env.NEXT_PUBLIC_API_URL}/api/file/user-cv/${pendingUser?.pendingUserId}?action=preview&token=${token}`;
                })()}
                className="w-full h-96"
                title="Resume Preview"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Success Modal */}
      {paymentDetails && (
        <PaymentSuccessModal
          isOpen={showPaymentSuccess}
          onClose={() => setShowPaymentSuccess(false)}
          paymentDetails={paymentDetails}
        />
      )}
    </div>
  );
};

export default PendingUserDashboard;