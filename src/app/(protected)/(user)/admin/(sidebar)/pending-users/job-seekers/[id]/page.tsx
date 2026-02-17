"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, FileText, GraduationCap, Briefcase, Code, Trash2, Eye, UserCheck } from "lucide-react";

import { API_CONFIG } from '@/lib/config';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
const PendingJobSeekerDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    if (params.id) {
      fetchPendingUserDetails();
      fetchPlans();
    }
  }, [params.id]);

  const fetchPlans = async () => {
    try {
      const response = await adminAPI.getPlansByUserType('job_seeker');
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleConvert = async () => {
    if (!pendingUser?.id) return;
    setShowPlanDialog(true);
  };

  const handleConfirmConvert = async () => {
    if (!pendingUser?.id) return;
    
    setConverting(true);
    try {
      const planId = selectedPlan === 'none' ? undefined : selectedPlan;
      await adminAPI.convertPendingUser(pendingUser.id, planId);
      toast.success('Pending user converted to active user successfully!');
      router.push('/admin/pending-users/job-seekers');
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert user');
    } finally {
      setConverting(false);
      setShowPlanDialog(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingUser?.id) return;
    
    if (!confirm(`Are you sure you want to delete ${pendingUser.full_name}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(pendingUser.id);
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/admin/pending-users/${pendingUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        router.push('/admin/pending-users/job-seekers');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(null);
    }
  };

  const fetchPendingUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.API_URL}/admin/pending-users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingUser(data.data.user);
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

  if (!pendingUser) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">Pending user not found</div>
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
            <h1 className="text-3xl font-bold">{pendingUser.full_name}</h1>
            <p className="text-gray-600">Pending Job Seeker Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleConvert}
            disabled={converting}
            className="bg-green-600 hover:bg-green-700"
          >
            {converting ? (
              'Converting...'
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Create User
              </>
            )}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting === pendingUser.id}
          >
            {deleting === pendingUser.id ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </>
            )}
          </Button>
        </div>
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
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{pendingUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Mobile:</span>
              <span>{pendingUser.mobile || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Created:</span>
              <span>{new Date(pendingUser.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          {pendingUser.basic_info && Object.keys(pendingUser.basic_info).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Additional Info:</h4>
              {pendingUser.basic_info.location && (
                <div><span className="font-medium">Location:</span> {pendingUser.basic_info.location}</div>
              )}
              {pendingUser.basic_info.dateOfBirth && (
                <div><span className="font-medium">Date of Birth:</span> {pendingUser.basic_info.dateOfBirth}</div>
              )}
              {pendingUser.basic_info.bio && (
                <div><span className="font-medium">Bio:</span> {pendingUser.basic_info.bio}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {pendingUser.education_experience?.education && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUser.education_experience.education.map((edu: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-semibold">{edu.degree || edu.qualification}</h4>
                  <p className="text-gray-600">{edu.institution || edu.school}</p>
                  <p className="text-sm text-gray-500">
                    {edu.year || `${edu.startYear || edu.start_year || ''} - ${edu.endYear || edu.end_year || 'Present'}`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingUser.education_experience?.experience && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUser.education_experience.experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <h4 className="font-semibold">{exp.position || exp.title}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {exp.duration || `${exp.startDate || exp.start_date || ''} - ${exp.endDate || exp.end_date || 'Present'}`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingUser.education_experience?.skills && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pendingUser.education_experience.skills.map((skill: any, index: number) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  {typeof skill === 'string' ? skill : skill.name || skill.skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pendingUser.cv_file_path && (
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
                      return `${API_CONFIG.API_URL}/file/pending-user-cv/${params.id}?action=preview&token=${token}`;
                    })()}
                    className="w-full h-96"
                    title="Resume Preview"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Selection Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Plan for {pendingUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Choose a plan (optional):</label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="No plan (user can select later)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No plan (user can select later)</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name} - ${plan.price} ({plan.duration} days)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmConvert}
                disabled={converting}
                className="bg-green-600 hover:bg-green-700"
              >
                {converting ? 'Converting...' : 'Convert User'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingJobSeekerDetailPage;