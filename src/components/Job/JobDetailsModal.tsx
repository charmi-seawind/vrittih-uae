"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building2, Clock, IndianRupee, Calendar, Briefcase, X } from "lucide-react";

import { API_CONFIG } from '@/lib/config';
interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

const JobDetailsModal = ({ isOpen, onClose, jobId }: JobDetailsModalProps) => {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetails();
    }
  }, [isOpen, jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobDetails(data.data || data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!jobDetails && !loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{jobDetails?.job_title || 'Job Details'}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{jobDetails?.company_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{jobDetails?.office_address}</span>
              </div>
            </div>

            {/* Job Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{jobDetails?.job_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{jobDetails?.work_location_type}</span>
              </div>
              {jobDetails?.pay_amount && (
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">₹{jobDetails.pay_amount}</span>
                </div>
              )}
              {jobDetails?.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Posted: {new Date(jobDetails.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Job Description */}
            {jobDetails?.job_description && (
              <div className="space-y-2">
                <h3 className="font-semibold">Job Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {jobDetails.job_description}
                </p>
              </div>
            )}

            {/* Requirements */}
            {jobDetails?.additional_requirements && (
              <div className="space-y-2">
                <h3 className="font-semibold">Requirements</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {jobDetails.additional_requirements}
                </p>
              </div>
            )}

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobDetails?.minimum_education && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">Education</h4>
                  <p className="text-sm text-muted-foreground">{jobDetails.minimum_education}</p>
                </div>
              )}
              {jobDetails?.experience_required && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">Experience</h4>
                  <p className="text-sm text-muted-foreground">{jobDetails.experience_required}</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            {jobDetails?.additional_perks && (
              <div className="space-y-2">
                <h3 className="font-semibold">Perks & Benefits</h3>
                <p className="text-sm text-muted-foreground">{jobDetails.additional_perks}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;