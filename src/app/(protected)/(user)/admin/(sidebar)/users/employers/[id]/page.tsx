"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useEffect, useState, useCallback } from "react";

import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, User, Mail, Phone, Building, CreditCard, Briefcase, CheckCircle, XCircle, LogIn } from "lucide-react";
import { toast } from 'sonner';

const PaymentVerification = ({ userId, subscriptionStatus, onVerificationComplete }: { userId: string; subscriptionStatus: string; onVerificationComplete: () => void }) => {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const fetchImage = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/file/payment-screenshot/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }, [userId]);

  const fetchPaymentProof = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.API_URL}/local-payment/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayment(data.data.payment);
      }
    } catch (error) {
      console.error('Error fetching payment proof:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (subscriptionStatus === 'pending') {
      fetchPaymentProof();
      fetchImage();
    }
  }, [subscriptionStatus, fetchPaymentProof, fetchImage]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const response = await fetch(`${API_CONFIG.API_URL}/local-payment/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        toast.success('Payment verified successfully!');
        onVerificationComplete();
      } else {
        toast.error('Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Error verifying payment');
    } finally {
      setVerifying(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this payment?')) return;
    
    try {
      setVerifying(true);
      const response = await fetch(`${API_CONFIG.API_URL}/local-payment/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        toast.success('Payment rejected');
        onVerificationComplete();
      } else {
        toast.error('Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Error rejecting payment');
    } finally {
      setVerifying(false);
    }
  };


  
  if (subscriptionStatus !== 'pending') {

    return null;
  }
  if (loading) return <div className="text-sm text-gray-500">Loading payment proof...</div>;
  if (!payment) {

    return null;
  }

  return (
    <div className="border-t pt-4 space-y-4">
      <h4 className="font-semibold text-lg">Payment Verification</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Transaction ID:</span>
          <p className="text-sm text-gray-600">{payment.transactionId}</p>
        </div>
        <div>
          <span className="font-medium">Amount:</span>
          <p className="text-sm text-gray-600">₹{payment.amount}</p>
        </div>
      </div>
      <div>
        <span className="font-medium">Payment Screenshot:</span>
        <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50 p-2">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt="Payment Screenshot"
              className="w-full h-auto max-h-96 object-contain"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">Loading screenshot...</div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={handleVerify} 
          disabled={verifying}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Verify Payment
        </Button>
        <Button 
          onClick={handleReject} 
          disabled={verifying}
          variant="destructive"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject Payment
        </Button>
      </div>
    </div>
  );
};


import { API_CONFIG } from '@/lib/config';
import { adminAPI } from '@/services/api';
const EmployerDetailPage = () => {

  const params = useParams();
  const router = useRouter();
  const [employer, setEmployer] = useState<any>(null);
  const [jobs, setJobs] = useState([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [employerProfile, setEmployerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLoginAsUser = async () => {
    try {
      setLoggingIn(true);
      const response = await adminAPI.adminLoginAsUser(params.id as string);
      
      // Store the user token and data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to employer dashboard
      window.open('/employer/dashboard', '_blank');
      
      toast.success('Logged in as user successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login as user');
    } finally {
      setLoggingIn(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchEmployerDetails();
    }
  }, [params.id]);

  const fetchEmployerDetails = async () => {
    try {
      setLoading(true);
      
      const userResponse = await fetch(`${API_CONFIG.API_URL}/admin/users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setEmployer(userData.data.user);
      }
      
      const jobsResponse = await fetch(`${API_CONFIG.API_URL}/employer/${params.id}/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData.body?.jobs || jobsData.jobs || []);
      }

      const subscriptionResponse = await fetch(`${API_CONFIG.API_URL}/admin/subscription/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        const subData = subscriptionData.data;

        if (subData) {
          setSubscription({
            planName: subData.plan?.name || 'Unknown Plan',
            price: subData.amount_paid || subData.plan?.price || 0,
            status: subData.status,
            paymentId: subData.payment_id
          });
        }
      } else {

      }

      const profileResponse = await fetch(`${API_CONFIG.API_URL}/admin/employers/${params.id}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setEmployerProfile(profileData.data);
      }

    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">Employer not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{employer.full_name}</h1>
            <p className="text-gray-600">Employer Profile</p>
          </div>
        </div>
        <Button 
          onClick={handleLoginAsUser}
          disabled={loggingIn}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loggingIn ? (
            'Logging in...'
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Login as User
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Full Name:</span>
              <span>{employer.full_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{employer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Mobile:</span>
              <span>{employer.mobile || employerProfile?.profile?.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Company:</span>
              <span>{employer.company_name || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge className={employer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {employer.status?.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Joined:</span>
              <span>{new Date(employer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Plan:</span>
                <Badge className="bg-purple-100 text-purple-800">{subscription.planName}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Price:</span>
                <span>₹{subscription.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {subscription.status.toUpperCase()}
                </Badge>
              </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Payment ID:</span>
                  <span className="text-sm text-gray-600">{subscription.paymentId}</span>
                </div>
              </div>
              <PaymentVerification userId={params.id as string} subscriptionStatus={subscription.status} onVerificationComplete={fetchEmployerDetails} />
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No subscription found</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employerProfile?.profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Company Size:</span>
                  <span>{employerProfile.profile.company_size || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Industry:</span>
                  <span>{employerProfile.profile.industry || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Founded Year:</span>
                  <span>{employerProfile.profile.founded_year || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Website:</span>
                  <span>{employerProfile.profile.website_url ? (
                    <a href={employerProfile.profile.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {employerProfile.profile.website_url}
                    </a>
                  ) : 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  <span>{employerProfile.profile.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">City:</span>
                  <span>{employerProfile.profile.city || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">State:</span>
                  <span>{employerProfile.profile.state || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">ZIP Code:</span>
                  <span>{employerProfile.profile.zip_code || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Company Verification:</span>
                  <Badge className={employerProfile.profile.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {employerProfile.profile.is_verified ? 'VERIFIED' : 'PENDING'}
                  </Badge>
                </div>
              </div>
              {employerProfile.profile.about_company && (
                <div className="mt-4">
                  <span className="font-medium">About Company:</span>
                  <p className="mt-1 text-gray-700">{employerProfile.profile.about_company}</p>
                </div>
              )}
              {employerProfile.profile.address && (
                <div className="mt-4">
                  <span className="font-medium">Address:</span>
                  <p className="mt-1 text-gray-700">{employerProfile.profile.address}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No company profile data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Jobs ({jobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No jobs posted</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job: any) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.job_title}</TableCell>
                    <TableCell>{job.job_category}</TableCell>
                    <TableCell>
                      <Badge className={job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDetailPage;