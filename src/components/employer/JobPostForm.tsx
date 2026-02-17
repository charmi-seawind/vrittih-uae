"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { JobPostData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { usePostJob } from "@/hooks/query-hooks/usePostJob";
import { useEmployerData } from "@/hooks/useEmployerData";
import { useSubscription } from "@/hooks/useSubscription";
import FormBuilder from "@/components/FormBuilder/FormBuilder";

const JobPostForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { postJob, isLoading } = usePostJob();
  const { data: employerData } = useEmployerData();
  const { data: subscription } = useSubscription();

  const [formData, setFormData] = useState<JobPostData>({
    company_name: "",
    job_title: "",
    job_category: "",
    job_type: "",
    work_location_type: "",
    office_address: "",
    pay_type: "",
    pay_amount: "",
    additional_perks: "",
    joining_fee_required: false,
    minimum_education: "",
    language_required: "",
    experience_required: "",
    additional_requirements: "",
    job_description: "",
    is_walk_in: false,
    walk_in_address: "",
    walk_in_start_date: "",
    walk_in_end_date: "",
    walk_in_timing: "",
    walk_in_instructions: "",
    application_email: "",
    is_featured: false,
    custom_form_fields: null,
  });

  useEffect(() => {
    if (employerData?.company_name) {
      setFormData(prev => ({
        ...prev,
        company_name: employerData.company_name
      }));
    }
  }, [employerData]);

  const handleInputChange = (field: keyof JobPostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canPostJob = () => {
    if (!subscription) return false;
    
    const job_posts = subscription.features?.job_posts || subscription.plan?.features?.job_posts || 0;
    const job_posts_used = subscription.usage?.job_posts_used || 0;
    
    return job_posts === -1 || job_posts_used < job_posts;
  };
  
  const getRemainingJobPosts = () => {
    if (!subscription) return 0;
    
    const job_posts = subscription.features?.job_posts || subscription.plan?.features?.job_posts || 0;
    const job_posts_used = subscription.usage?.job_posts_used || 0;
    
    if (job_posts === -1) return -1; // Unlimited
    return Math.max(0, job_posts - job_posts_used);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check job posting limits
    if (!canPostJob()) {
      toast({
        title: "Job Posting Limit Reached",
        description: "You have reached your job posting limit. Please upgrade your plan to post more jobs.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.company_name || !formData.job_title || !formData.job_category || !formData.job_type || !formData.work_location_type || !formData.job_description || !formData.minimum_education || !formData.language_required) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = {
        ...formData,
        walk_in_start_date: formData.walk_in_start_date || null,
        walk_in_end_date: formData.walk_in_end_date || null,
        office_address: formData.office_address || null,
        additional_perks: formData.additional_perks || null,
        additional_requirements: formData.additional_requirements || null,
        walk_in_address: formData.walk_in_address || null,
        walk_in_timing: formData.walk_in_timing || null,
        walk_in_instructions: formData.walk_in_instructions || null
      };
      
      await postJob(submitData);
      toast({
        title: "Success",
        description: "Job posted successfully!",
      });
      router.push("/employer/job/all-job");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      });
    }
  };

  const remainingPosts = getRemainingJobPosts();
  const canPost = canPostJob();

  return (
    <div className="space-y-6">
      {subscription && (
        <Card className={`border-l-4 ${canPost ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${canPost ? 'bg-green-100' : 'bg-red-100'}`}>
                  <AlertCircle className={`h-5 w-5 ${canPost ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Job Posting Limit
                  </h3>
                  <p className="text-sm text-gray-600">
                    Plan: {subscription.planName || subscription.plan?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {remainingPosts === -1 ? '∞' : remainingPosts}
                </div>
                <Badge variant={canPost ? "secondary" : "destructive"} className="mt-1">
                  {remainingPosts === -1 ? 'Unlimited' : `${remainingPosts} remaining`}
                </Badge>
              </div>
            </div>
            {!canPost && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-800">
                    You have reached your job posting limit. Upgrade to post more jobs.
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => window.location.href = '/employer/plans'}
                    className="ml-3"
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
              placeholder="e.g. Seawind Solution"
              required
            />
          </div>

          <div>
            <Label htmlFor="job_title">Job Title *</Label>
            <Input
              id="job_title"
              value={formData.job_title}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>

          <div>
            <Label htmlFor="job_category">Job Category *</Label>
            <Select onValueChange={(value) => handleInputChange("job_category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select job category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Human Resource">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select onValueChange={(value) => handleInputChange("job_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full Time</SelectItem>
                  <SelectItem value="Part-time">Part Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="work_location_type">Work Location Type *</Label>
              <Select onValueChange={(value) => handleInputChange("work_location_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.work_location_type !== 'Remote' && (
            <div>
              <Label htmlFor="office_address">Office Address</Label>
              <Input
                id="office_address"
                value={formData.office_address}
                onChange={(e) => handleInputChange("office_address", e.target.value)}
                placeholder="Enter office address"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pay_type">Pay Type</Label>
              <Select onValueChange={(value) => handleInputChange("pay_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pay type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Range">Range</SelectItem>
                  <SelectItem value="Negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pay_amount">Pay Amount</Label>
              <Input
                id="pay_amount"
                value={formData.pay_amount}
                onChange={(e) => handleInputChange("pay_amount", e.target.value)}
                placeholder="e.g. 50000 or 30000-50000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="additional_perks">Additional Perks</Label>
            <Textarea
              id="additional_perks"
              value={formData.additional_perks}
              onChange={(e) => handleInputChange("additional_perks", e.target.value)}
              placeholder="Health insurance, flexible hours, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minimum_education">Minimum Education *</Label>
              <Select onValueChange={(value) => handleInputChange("minimum_education", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="10th">10th Pass</SelectItem>
                  <SelectItem value="12th">12th Pass</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                  <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience_required">Experience Required</Label>
              <Select onValueChange={(value) => handleInputChange("experience_required", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fresher">Fresher</SelectItem>
                  <SelectItem value="0-1 years">0-1 years</SelectItem>
                  <SelectItem value="1-3 years">1-3 years</SelectItem>
                  <SelectItem value="3-5 years">3-5 years</SelectItem>
                  <SelectItem value="5+ years">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="language_required">Language Required *</Label>
            <Input
              id="language_required"
              value={formData.language_required}
              onChange={(e) => handleInputChange("language_required", e.target.value)}
              placeholder="Hindi, English, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="additional_requirements">Additional Requirements</Label>
            <Textarea
              id="additional_requirements"
              value={formData.additional_requirements}
              onChange={(e) => handleInputChange("additional_requirements", e.target.value)}
              placeholder="Any specific skills or requirements"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="application_email">Application Email</Label>
            <Input
              id="application_email"
              type="email"
              value={formData.application_email}
              onChange={(e) => handleInputChange("application_email", e.target.value)}
              placeholder="e.g. hr@company.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="job_description">Job Description *</Label>
            <RichTextEditor
              value={formData.job_description}
              onChange={(value) => handleInputChange("job_description", value)}
              placeholder="Describe the job role, responsibilities, and what you're looking for..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="joining_fee_required"
              checked={formData.joining_fee_required}
              onChange={(e) => handleInputChange("joining_fee_required", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="joining_fee_required">Joining Fee Required</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_walk_in"
              checked={formData.is_walk_in}
              onChange={(e) => handleInputChange("is_walk_in", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is_walk_in">Walk-in Interview</Label>
          </div>

          {formData.is_walk_in && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
              <div className="md:col-span-2">
                <Label htmlFor="walk_in_address">Walk-in Address</Label>
                <Input
                  id="walk_in_address"
                  value={formData.walk_in_address}
                  onChange={(e) => handleInputChange("walk_in_address", e.target.value)}
                  placeholder="Walk-in interview address"
                />
              </div>
              
              <div>
                <Label htmlFor="walk_in_start_date">Start Date</Label>
                <Input
                  type="date"
                  id="walk_in_start_date"
                  value={formData.walk_in_start_date}
                  onChange={(e) => handleInputChange("walk_in_start_date", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="walk_in_end_date">End Date</Label>
                <Input
                  type="date"
                  id="walk_in_end_date"
                  value={formData.walk_in_end_date}
                  onChange={(e) => handleInputChange("walk_in_end_date", e.target.value)}
                  min={formData.walk_in_start_date || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="walk_in_timing">Timing</Label>
                <Input
                  id="walk_in_timing"
                  value={formData.walk_in_timing}
                  onChange={(e) => handleInputChange("walk_in_timing", e.target.value)}
                  placeholder="e.g., 10:00 AM - 5:00 PM"
                />
              </div>

              <div>
                <Label htmlFor="walk_in_instructions">Instructions</Label>
                <Textarea
                  id="walk_in_instructions"
                  value={formData.walk_in_instructions}
                  onChange={(e) => handleInputChange("walk_in_instructions", e.target.value)}
                  placeholder="Special instructions for candidates"
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => handleInputChange("is_featured", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is_featured">Make this a featured job (additional charges apply)</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Create a custom form for candidates to fill when applying for this job.
          </p>
          <FormBuilder 
            onFormChange={(formFields) => handleInputChange("custom_form_fields", formFields)}
            initialFields={formData.custom_form_fields}
          />
        </CardContent>
      </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || !canPost}>
            {isLoading ? "Posting..." : !canPost ? "Upgrade Plan to Post" : "Post Job"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;