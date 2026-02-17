"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, IndianRupee, Users, Mail, GraduationCap, Languages, Clock, Building2, Star, Briefcase } from "lucide-react";
import JobShareButton from "@/components/employer/JobShareButton";

interface Job {
  id: string;
  status: string;
  is_featured: boolean;
  company_name: string;
  job_title: string;
  job_category: string;
  job_type: string;
  work_location_type: string;
  office_address?: string;
  pay_type: string;
  pay_amount: string;
  additional_perks?: string;
  minimum_education: string;
  language_required: string;
  experience_required: string;
  additional_requirements?: string;
  job_description: string;
  application_email: string;
  is_walk_in: boolean;
  walk_in_address?: string;
  walk_in_start_date?: string;
  walk_in_end_date?: string;
  walk_in_timing?: string;
  walk_in_instructions?: string;
  createdAt: string;
}

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsModal = ({ job, isOpen, onClose }: JobDetailsModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{job.job_title}</DialogTitle>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {job.company_name}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.work_location_type}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
                {job.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Job Description</h3>
              <p className="whitespace-pre-wrap text-gray-600">{job.job_description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Requirements</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Education</p>
                      <p className="text-sm text-gray-600">{job.minimum_education}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-sm text-gray-600">{job.experience_required}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Languages</p>
                      <p className="text-sm text-gray-600">{job.language_required}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-gray-600">{job.application_email}</p>
                    </div>
                  </div>
                </div>
                {job.additional_requirements && (
                  <div>
                    <p className="font-medium mb-2">Additional Requirements</p>
                    <p className="text-sm text-gray-600">{job.additional_requirements}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Salary</p>
                    <p className="text-sm text-gray-600">₹{job.pay_amount} ({job.pay_type})</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Job Type</p>
                    <p className="text-sm text-gray-600">{job.job_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">{job.work_location_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-sm text-gray-600">{job.job_category}</p>
                  </div>
                </div>
              </div>
            </div>

            {job.additional_perks && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Perks & Benefits</h3>
                <p className="text-sm text-gray-600">{job.additional_perks}</p>
              </div>
            )}

            {job.office_address && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Office Location</h3>
                <p className="text-sm text-gray-600">{job.office_address}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <JobShareButton job={job} />
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;