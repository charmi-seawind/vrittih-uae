"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Code, FileText, CreditCard, CheckCircle, XCircle, Image as ImageIcon, Eye, LogIn } from "lucide-react";

import { API_CONFIG } from '@/lib/config';
import { adminAPI } from '@/services/api';
import Image from 'next/image';
import { toast } from 'sonner';

const PaymentVerification = ({ userId, subscriptionStatus, onVerificationComplete }: { userId: string; subscriptionStatus: string; onVerificationComplete: () => void }) => {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (subscriptionStatus === 'pending') {
      fetchPaymentProof();
      fetchImage();
    }
  }, [userId, subscriptionStatus]);

  const fetchImage = async () => {
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
  };

  const fetchPaymentProof = async () => {
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
  };

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

  if (subscriptionStatus !== 'pending') return null;
  if (loading) return <div className="text-sm text-gray-500">Loading payment proof...</div>;
  if (!payment) return null;

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
const JobSeekerDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [jobSeeker, setJobSeeker] = useState<any>(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLoginAsUser = async () => {
    try {
      setLoggingIn(true);
      const response = await adminAPI.adminLoginAsUser(params.id as string);
      
      // Store the user token and data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to user dashboard
      if (response.data.user.role === 'candidate') {
        window.open('/job-seeker/dashboard', '_blank');
      } else {
        window.open('/employer/dashboard', '_blank');
      }
      
      toast.success('Logged in as user successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login as user');
    } finally {
      setLoggingIn(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchJobSeekerDetails();
    }
  }, [params.id]);

  const fetchJobSeekerDetails = async () => {
    try {
      setLoading(true);
      
      // Use single optimized API call
      const response = await fetch(`${API_CONFIG.API_URL}/admin/users/job-seekers/${params.id}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobSeeker(data.data.user);
        setApplications(data.data.applications || []);
        setSubscription(data.data.subscription);
        setCandidateProfile({ resume: data.data.resume });
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
        <span className="ml-2">Loading job seeker details...</span>
      </div>
    );
  }

  if (!jobSeeker) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">Job seeker not found</div>
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
            <h1 className="text-3xl font-bold">{jobSeeker.full_name}</h1>
            <p className="text-gray-600">Job Seeker Profile Details</p>
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

      {/* Personal Information */}
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
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{jobSeeker.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Mobile:</span>
              <span>{jobSeeker.mobile || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Location:</span>
              <span>{jobSeeker.location || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Date of Birth:</span>
              <span>{jobSeeker.date_of_birth ? new Date(jobSeeker.date_of_birth).toLocaleDateString() : 'Not provided'}</span>
            </div>
          </div>
          {jobSeeker.bio && (
            <div className="mt-4">
              <span className="font-medium">Bio:</span>
              <p className="mt-1 text-gray-700">{jobSeeker.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Details
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
                  <span className="font-medium">Duration:</span>
                  <span>{subscription.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-800' : subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                    {subscription.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Start Date:</span>
                  <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">End Date:</span>
                  <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Payment ID:</span>
                  <span className="text-sm text-gray-600">{subscription.paymentId}</span>
                </div>
              </div>
              <PaymentVerification userId={params.id as string} subscriptionStatus={subscription.status} onVerificationComplete={fetchJobSeekerDetails} />
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No active subscription found</div>
          )}
        </CardContent>
      </Card>

      {/* Resume Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setShowResumePreview(!showResumePreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showResumePreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            {showResumePreview && (
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={(() => {
                    const token = localStorage.getItem('token');
                    return `${API_CONFIG.API_URL}/file/user-cv/${params.id}?action=preview&token=${token}`;
                  })()}
                  className="w-full h-96"
                  title="Resume Preview"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidateProfile?.resume?.education && candidateProfile.resume.education.length > 0 ? (
            <div className="space-y-4">
              {candidateProfile.resume.education.map((edu: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-semibold">{edu.degree || edu.qualification}</h4>
                  <p className="text-gray-600">{edu.institution || edu.school}</p>
                  <p className="text-sm text-gray-500">
                    {edu.startYear || edu.start_year} - {edu.endYear || edu.end_year || 'Present'}
                  </p>
                  {edu.grade && <p className="text-sm text-gray-600">Grade: {edu.grade}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education information available</p>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidateProfile?.resume?.experience && candidateProfile.resume.experience.length > 0 ? (
            <div className="space-y-4">
              {candidateProfile.resume.experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <h4 className="font-semibold">{exp.position || exp.title}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {exp.startDate || exp.start_date} - {exp.endDate || exp.end_date || 'Present'}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No work experience information available</p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidateProfile?.resume?.skills && candidateProfile.resume.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidateProfile.resume.skills.map((skill: any, index: number) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  {typeof skill === 'string' ? skill : skill.name || skill.skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills information available</p>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      {candidateProfile?.resume?.projects && candidateProfile.resume.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidateProfile.resume.projects.map((project: any, index: number) => (
                <div key={index} className="border-l-4 border-purple-200 pl-4">
                  <h4 className="font-semibold">{project.name || project.title}</h4>
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                  )}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech: string, techIndex: number) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {candidateProfile?.resume?.certifications && candidateProfile.resume.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidateProfile.resume.certifications.map((cert: any, index: number) => (
                <div key={index} className="border-l-4 border-yellow-200 pl-4">
                  <h4 className="font-semibold">{cert.name || cert.title}</h4>
                  <p className="text-gray-600">{cert.issuer || cert.organization}</p>
                  {cert.date && (
                    <p className="text-sm text-gray-500">Issued: {cert.date}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No applications found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.job?.job_title}</TableCell>
                    <TableCell>{app.job?.company_name}</TableCell>
                    <TableCell>
                      <Badge className={
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
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

export default JobSeekerDetailPage;