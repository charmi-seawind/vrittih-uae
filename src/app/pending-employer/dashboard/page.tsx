"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, Briefcase, CreditCard, User, FileText, AlertCircle, Loader2, Check, Star, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

const PendingEmployerDashboard = () => {
  const router = useRouter();
  const [pendingEmployer, setPendingEmployer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [packages, setPackages] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("pendingEmployerToken");
    const pendingEmployerId = localStorage.getItem("pendingEmployerId");
    
    if (!token || !pendingEmployerId) {
      router.push("/employer/login");
      return;
    }

    // Fetch pending employer data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-employer/${pendingEmployerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const employerData = data.data;

          setPendingEmployer(employerData);
          setEditData({
            basicInfo: {
              fullName: employerData.fullName || "",
              mobile: employerData.mobile || "",
              companyName: employerData.companyName || "",
              ...employerData.basicInfo
            },
            companyDetails: {
              companyName: employerData.companyName || "",
              companySize: employerData.companySize || "",
              industry: employerData.industry || "",
              ...employerData.companyDetails
            }
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [router]);

  // Update editData when pendingEmployer changes
  useEffect(() => {
    if (pendingEmployer) {
      setEditData({
        basicInfo: {
          fullName: pendingEmployer.fullName || "",
          mobile: pendingEmployer.mobile || "",
          companyName: pendingEmployer.companyName || "",
          ...pendingEmployer.basicInfo
        },
        companyDetails: {
          companyName: pendingEmployer.companyName || "",
          companySize: pendingEmployer.companySize || "",
          industry: pendingEmployer.industry || "",
          website: pendingEmployer.companyDetails?.website || "",
          address: pendingEmployer.companyDetails?.address || "",
          city: pendingEmployer.companyDetails?.city || "",
          ...pendingEmployer.companyDetails
        }
      });
    }
  }, [pendingEmployer]);
  // Fetch employer plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/employer`);
        const data = await response.json();
        
        if (data.success) {

          const plans = data.data?.plans || data.plans || [];
          const formattedPlans = plans.map((plan, index) => {
            // Use actual features from API
            let features = [];
            if (plan.features && typeof plan.features === 'object') {
              // Extract display features from API
              Object.keys(plan.features).forEach(key => {
                if (!isNaN(Number(key))) {
                  features.push(plan.features[key]);
                }
              });
              
              // If no display features, create from limits
              if (features.length === 0) {
                features = [
                  `Job Posts: ${plan.features.job_posts === -1 ? 'Unlimited' : plan.features.job_posts || 5}`,
                  `Featured Jobs: ${plan.features.featured_jobs === -1 ? 'Unlimited' : plan.features.featured_jobs || 0}`,
                  plan.features.featured_company ? 'Featured Company Profile' : 'Standard Profile',
                  `Valid for ${plan.duration} days`
                ];
              }
            } else {
              // Fallback features
              features = [
                'Post unlimited jobs',
                'Access to all candidates', 
                'Priority support'
              ];
            }
            
            return {
              id: plan.id,
              name: plan.name,
              price: parseFloat(plan.price),
              duration: `${plan.duration} days`,
              features: features,
              popular: index === 1
            };
          });
          setPackages(formattedPlans);
        }
      } catch (error) {
        setPackages([]);
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
      const currentPendingEmployerId = pendingEmployer?.id || localStorage.getItem('pendingEmployerId');
      
      // Save basic info and company details
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-employer/${currentPendingEmployerId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basicInfo: editData.basicInfo,
          companyDetails: editData.companyDetails,
          // Send direct fields too
          mobile: editData.basicInfo?.mobile,
          companyName: editData.companyDetails?.companyName,
          companySize: editData.companyDetails?.companySize,
          industry: editData.companyDetails?.industry
        })
      });
      
      if (response.ok) {
        // Refetch the data to get updated values
        const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pending-employer/${currentPendingEmployerId}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          if (updatedData.success) {
            setPendingEmployer(updatedData.data);
          }
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("pendingEmployerId");
    sessionStorage.removeItem("pendingEmployerToken");
    sessionStorage.removeItem("pendingEmployerId");
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
      const currentPendingEmployerId = pendingEmployer?.id || localStorage.getItem('pendingEmployerId');
      if (!currentPendingEmployerId) throw new Error('No pending employer ID found');
      
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load Razorpay SDK');

      const orderResponse = await fetch('/api/job-seeker/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: packages.find(p => p.id === selectedPlan)?.price,
          planId: selectedPlan,
          pendingUserId: currentPendingEmployerId
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');
      const { orderId } = await orderResponse.json();
      
      const options = {
        key: "rzp_live_RrtsJrVleUY6RP",
        amount: packages.find(p => p.id === selectedPlan)?.price * 100,
        currency: 'INR',
        name: 'Vrrittih',
        description: `${packages.find(p => p.id === selectedPlan)?.name} Plan`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/employer/complete-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pendingUserId: currentPendingEmployerId,
                paymentId: response.razorpay_payment_id,
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
              localStorage.removeItem('pendingEmployerId');
              localStorage.removeItem('pendingEmployerToken');
              sessionStorage.removeItem('pendingEmployerId');
              localStorage.removeItem('onboarding-storage');
              
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              
              setTimeout(() => {
                router.push('/employer/dashboard');
              }, 2000);
            }
          } catch (error) {
            alert(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: pendingEmployer?.fullName || 'Employer',
          email: pendingEmployer?.email || ''
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
    } catch (error) {
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
                  variant={activeTab === "company" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("company")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Company Details
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.fullName || "" : pendingEmployer?.fullName || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, fullName: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={pendingEmployer?.email || ""} disabled />
                    </div>
                    <div>
                      <Label>Mobile</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.mobile || "" : pendingEmployer?.mobile || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, mobile: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Company Name</Label>
                      <Input 
                        value={isEditing ? editData.basicInfo?.companyName || "" : pendingEmployer?.companyName || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, basicInfo: {...prev.basicInfo, companyName: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "company" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Company Details</CardTitle>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input 
                        value={isEditing ? editData.companyDetails?.companyName || "" : pendingEmployer?.companyName || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, companyDetails: {...prev.companyDetails, companyName: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Company Size</Label>
                      <Input 
                        value={isEditing ? editData.companyDetails?.companySize || "" : pendingEmployer?.companySize || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, companyDetails: {...prev.companyDetails, companySize: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Input 
                        value={isEditing ? editData.companyDetails?.industry || "" : pendingEmployer?.industry || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, companyDetails: {...prev.companyDetails, industry: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input 
                        value={isEditing ? editData.companyDetails?.website || "" : pendingEmployer?.companyDetails?.website || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, companyDetails: {...prev.companyDetails, website: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input 
                        value={isEditing ? editData.companyDetails?.address || "" : pendingEmployer?.companyDetails?.address || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, companyDetails: {...prev.companyDetails, address: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input 
                        value={isEditing ? editData.companyDetails?.city || "" : pendingEmployer?.companyDetails?.city || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, companyDetails: {...prev.companyDetails, city: e.target.value}}))}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div>
                      <Label>GST Number (Optional)</Label>
                      <Input 
                        value={isEditing ? editData.companyDetails?.gst_number || "" : pendingEmployer?.companyDetails?.gst_number || ""} 
                        onChange={(e) => setEditData(prev => ({...prev, companyDetails: {...prev.companyDetails, gst_number: e.target.value}}))}
                        disabled={!isEditing}
                        placeholder="Enter GST Number (e.g., 22AAAAA0000A1Z5)"
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Your company information is saved. Complete payment to activate your account.
                    </p>
                  </div>
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
                        <h3 className="text-lg font-medium mb-2">Choose Your Employer Plan</h3>
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
                                <Crown className="w-6 h-6 text-primary" />
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
    </div>
  );
};

export default PendingEmployerDashboard;