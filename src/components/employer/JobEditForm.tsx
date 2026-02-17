"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { employerAPI } from "@/services/api";
import { Loader2, Save, X } from "lucide-react";
import FormBuilder from "@/components/FormBuilder/FormBuilder";

interface JobData {
  id: string;
  company_name?: string;
  job_title: string;
  job_category: string;
  job_type: string;
  work_location_type: string;
  office_address?: string;
  pay_type: string;
  pay_amount: string;
  additional_perks?: string;
  joining_fee_required: boolean;
  minimum_education: string;
  language_required: string;
  experience_required: string;
  additional_requirements?: string;
  job_description: string;
  is_walk_in: boolean;
  walk_in_address?: string;
  walk_in_start_date?: string;
  walk_in_end_date?: string;
  walk_in_timing?: string;
  walk_in_instructions?: string;
  application_email: string;
  is_featured?: boolean;
  custom_form_fields?: any;
}

interface EmployerData {
  company_name?: string;
}

interface JobEditFormProps {
  jobId: string;
  jobData: JobData;
  employerData?: EmployerData;
}

const JobEditForm = ({ jobId, jobData, employerData }: JobEditFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
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

  // Populate form with job data
  useEffect(() => {
    if (jobData) {
      // Convert ISO dates to YYYY-MM-DD format for input fields
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch {
          return "";
        }
      };
      
      const newFormData = {
        company_name: jobData.company_name || employerData?.company_name || "",
        job_title: jobData.job_title || "",
        job_category: jobData.job_category || "",
        job_type: jobData.job_type || "",
        work_location_type: jobData.work_location_type || "",
        office_address: jobData.office_address || "",
        pay_type: jobData.pay_type || "",
        pay_amount: jobData.pay_amount || "",
        additional_perks: jobData.additional_perks || "",
        joining_fee_required: jobData.joining_fee_required || false,
        minimum_education: jobData.minimum_education || "",
        language_required: jobData.language_required || "",
        experience_required: jobData.experience_required || "",
        additional_requirements: jobData.additional_requirements || "",
        job_description: jobData.job_description || "",
        is_walk_in: jobData.is_walk_in || false,
        walk_in_address: jobData.walk_in_address || "",
        walk_in_start_date: formatDateForInput(jobData.walk_in_start_date),
        walk_in_end_date: formatDateForInput(jobData.walk_in_end_date),
        walk_in_timing: jobData.walk_in_timing || "",
        walk_in_instructions: jobData.walk_in_instructions || "",
        application_email: jobData.application_email || "",
        is_featured: jobData.is_featured || false,
        custom_form_fields: jobData.custom_form_fields || null,
      };
      
      setFormData(newFormData);
    }
  }, [jobData, employerData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.job_title || !formData.job_category || !formData.job_type || !formData.work_location_type || !formData.pay_type || !formData.pay_amount || !formData.job_description || !formData.minimum_education || !formData.language_required || !formData.experience_required || !formData.application_email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const updateData = {
        company_name: formData.company_name,
        job_title: formData.job_title,
        job_category: formData.job_category,
        job_type: formData.job_type,
        work_location_type: formData.work_location_type,
        office_address: formData.office_address || null,
        pay_type: formData.pay_type,
        pay_amount: formData.pay_amount,
        additional_perks: formData.additional_perks || null,
        joining_fee_required: formData.joining_fee_required,
        minimum_education: formData.minimum_education,
        language_required: formData.language_required,
        experience_required: formData.experience_required,
        additional_requirements: formData.additional_requirements || null,
        job_description: formData.job_description,
        is_walk_in: formData.is_walk_in,
        walk_in_address: formData.walk_in_address || null,
        walk_in_start_date: formData.walk_in_start_date || null,
        walk_in_end_date: formData.walk_in_end_date || null,
        walk_in_timing: formData.walk_in_timing || null,
        walk_in_instructions: formData.walk_in_instructions || null,
        application_email: formData.application_email,
        is_featured: formData.is_featured,
        custom_form_fields: formData.custom_form_fields
      };
      
      await employerAPI.updateJob(jobId, updateData);
      
      toast({
        title: "Success",
        description: "Job updated successfully!",
      });
      
      setTimeout(() => {
        router.push("/employer/job/all-job");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            <Select key={`job_category_${formData.job_category}`} value={formData.job_category} onValueChange={(value) => handleInputChange("job_category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select job category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select key={`job_type_${formData.job_type}`} value={formData.job_type} onValueChange={(value) => handleInputChange("job_type", value)}>
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
              <Select key={`work_location_type_${formData.work_location_type}`} value={formData.work_location_type} onValueChange={(value) => handleInputChange("work_location_type", value)}>
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
              <Label htmlFor="pay_type">Pay Type *</Label>
              <Select key={`pay_type_${formData.pay_type}`} value={formData.pay_type} onValueChange={(value) => handleInputChange("pay_type", value)}>
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
              <Label htmlFor="pay_amount">Pay Amount *</Label>
              <Input
                id="pay_amount"
                value={formData.pay_amount}
                onChange={(e) => handleInputChange("pay_amount", e.target.value)}
                placeholder="e.g. 50000 or 30000-50000"
                required
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
              <Select key={`minimum_education_${formData.minimum_education}`} value={formData.minimum_education} onValueChange={(value) => handleInputChange("minimum_education", value)}>
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
              <Label htmlFor="experience_required">Experience Required *</Label>
              <Select key={`experience_required_${formData.experience_required}`} value={formData.experience_required} onValueChange={(value) => handleInputChange("experience_required", value)}>
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
            <Label htmlFor="application_email">Application Email *</Label>
            <Input
              id="application_email"
              type="email"
              value={formData.application_email}
              onChange={(e) => handleInputChange("application_email", e.target.value)}
              placeholder="e.g. hr@company.com"
              required
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
            <Textarea
              id="job_description"
              value={formData.job_description}
              onChange={(e) => handleInputChange("job_description", e.target.value)}
              placeholder="Describe the job role, responsibilities, and what you're looking for..."
              rows={6}
              required
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
            key={`formbuilder-${JSON.stringify(formData.custom_form_fields)}`}
            onFormChange={(formFields) => handleInputChange("custom_form_fields", formFields)}
            initialFields={formData.custom_form_fields}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Updating..." : "Update Job"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JobEditForm;
