'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const CVUploadSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, "Please select a file")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file?.type),
      "Only PDF, DOC, and DOCX files are allowed"
    ),
  photo: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, "Invalid file")
    .refine((file) => !file || file?.size <= 2 * 1024 * 1024, "Photo size must be less than 2MB")
    .refine(
      (file) => !file || ['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type),
      "Only JPG, JPEG, and PNG files are allowed"
    ),
});

type CVUploadFormData = z.infer<typeof CVUploadSchema>;
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Loader2, Check, Star, Crown } from 'lucide-react';
import PaymentSuccessModal from '@/components/ui/PaymentSuccessModal';


interface CVUploadFormProps {
  onComplete?: () => void;
  onUpload?: (file: File, photo: File | null) => Promise<boolean>;
  alreadyUploaded?: boolean;
}

const CVUploadForm = forwardRef<{ getFiles: () => { file: File | null; photo: File | null } }, CVUploadFormProps>(({ onComplete, onUpload, alreadyUploaded }, ref) => {
  useImperativeHandle(ref, () => ({
    getFiles: () => ({ file, photo })
  }));

  useEffect(() => {
    if (alreadyUploaded) {
      // Show already uploaded message
    }
  }, [alreadyUploaded]);
  const router = useRouter();
  const { pendingUserId, reset: resetOnboarding } = useOnboardingStore();
  const { canApplyToJob, getRemainingApplications } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  
  const form = useForm<CVUploadFormData>({
    resolver: zodResolver(CVUploadSchema),
    defaultValues: {
      file: null,
      photo: null,
    },
    mode: 'onChange',
  });
  
  const getPendingUserId = () => {
    if (pendingUserId) return pendingUserId;
    const stored = localStorage.getItem('onboarding-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.state?.pendingUserId;
      } catch (e) {
      }
    }
    return null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Validate file size
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed');
      return;
    }
    
    setFile(selectedFile);
    form.setValue('file', selectedFile);
    form.trigger('file');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Validate file size
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('Photo size must be less than 2MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only JPG, JPEG, and PNG files are allowed');
      return;
    }
    
    setPhoto(selectedFile);
    form.setValue('photo', selectedFile);
    form.trigger('photo');
  };

  const handleCVUpload = async () => {
    if (!file) return;
    
    // CV upload check - for now allow all uploads during onboarding
    // TODO: Implement proper CV upload limits based on subscription
    
    setIsUploading(true);
    try {
      const currentPendingUserId = getPendingUserId();
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
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }

      // Files uploaded successfully
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload CV');
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch job seeker plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await adminAPI.getPlansByUserType('job_seeker');
        const plans = response.data.plans.map((plan: any, index: number) => {
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
      } catch (error) {
        setPackages([]);
        toast.error('Failed to load plans. Please try again later.');
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const { login } = useAuth();

  const handlePayment = async () => {
    if (!selectedPlan) return;
    setIsProcessingPayment(true);
    try {
      const currentPendingUserId = getPendingUserId();
      if (!currentPendingUserId) throw new Error('No pending user ID found');
      const paymentId = `pay_${Date.now()}`;

      const response = await fetch('/api/job-seeker/complete-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingUserId: currentPendingUserId,
          paymentId: paymentId,
          planId: selectedPlan
        })
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Extract user and token from response structure
      const apiData = result?.data?.data;
      const user = apiData?.user;
      const token = apiData?.token;
      
      
      if (user && token) {
        // Force save to localStorage before anything else
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        login(user, token);
        
        // Clear all pending user data
        localStorage.removeItem('pendingUserId');
        sessionStorage.removeItem('pendingUserId');
        localStorage.removeItem('onboarding-storage');
        resetOnboarding(); // Clear onboarding store state
        
      } else {
        throw new Error('Invalid response: missing user or token');
      }

      const selectedPackage = packages.find(p => p.id === selectedPlan);
      setPaymentDetails({
        amount: selectedPackage?.price || 0,
        transactionId: paymentId,
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
      setShowPricingModal(false);
      setShowPaymentSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/job-seeker/dashboard');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <div>
                  <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-white block">
                    Upload your CV
                  </span>
                  <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                    PDF, DOC, or DOCX files only (Max 5MB)
                  </p>
                  {form.formState.errors.file && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {form.formState.errors.file.message}
                    </p>
                  )}
                  <Input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    className="mt-3 sm:mt-4 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base" 
                    onClick={() => document.getElementById('cv-upload')?.click()}
                    type="button"
                  >
                    Choose File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                  <p className="text-green-800 dark:text-green-200 font-medium flex items-start sm:items-center gap-2 text-sm sm:text-base">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="break-all">File selected: {file.name}</span>
                  </p>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setFile(null)}
                    className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
                  >
                    Change File
                  </Button>
                </div>
              </div>
            )}

            {/* Photo Upload Section */}
            <div className="border-t pt-4 sm:pt-6">
              <Label className="text-base sm:text-lg font-medium mb-3 block">Profile Photo (Optional)</Label>
              {!photo ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">JPG, JPEG, or PNG (Max 2MB)</p>
                  {form.formState.errors.photo && (
                    <p className="text-xs sm:text-sm text-red-500 mb-2">
                      {form.formState.errors.photo.message}
                    </p>
                  )}
                  <Input
                    id="photo-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto text-sm" 
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    type="button"
                  >
                    Choose Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-800 dark:text-green-200 text-sm flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span className="break-all">{photo.name}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhoto(null)}
                  >
                    Remove Photo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Pricing Modal (unchanged) */}
      <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
          <DialogHeader className="p-4 sm:p-6">
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
              Choose Your CV Package
            </DialogTitle>
            <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Select the perfect package to showcase your profile
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 px-4 sm:px-6">
            {loadingPlans ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading plans...</span>
              </div>
            ) : (
              packages.map((pkg) => (
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
                  <Badge className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-primary text-xs sm:text-sm">
                    <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center p-3 sm:p-6">
                  <div className="flex justify-center mb-2">
                    {pkg.id === "featured" ? (
                      <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    ) : (
                      <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{pkg.name}</CardTitle>
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold text-primary">₹{pkg.price}</span>
                    <span className="text-xs sm:text-sm text-gray-500 ml-2 block sm:inline">for {pkg.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <ul className="space-y-2 sm:space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              ))
            )}
          </div>

          {selectedPlan && (
            <Card className="mt-4 sm:mt-6 mx-4 sm:mx-6">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base">Package: {packages.find(p => p.id === selectedPlan)?.name}</span>
                  <span className="font-bold text-sm sm:text-base">₹{packages.find(p => p.id === selectedPlan)?.price}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-base sm:text-lg font-bold border-t pt-3 sm:pt-4 gap-1 sm:gap-0">
                  <span>Total Amount:</span>
                  <span>₹{packages.find(p => p.id === selectedPlan)?.price}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center mt-4 sm:mt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <Button 
              onClick={handlePayment}
              disabled={!selectedPlan || isProcessingPayment}
              className="w-full sm:max-w-md h-11 sm:h-12 text-sm sm:text-base font-medium"
              size="lg"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                'Get Started'
              )}
            </Button>
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
    </>
  );
});

CVUploadForm.displayName = 'CVUploadForm';

export default CVUploadForm;
