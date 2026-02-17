"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import JobDetailsModal from "../employer/JobDetailsModal";

interface JobData {
  id: string;
  employer_id: string;
  company_name: string;
  job_title: string;
  job_category: string;
  job_type: string;
  work_location_type: string;
  office_address: string | null;
  pay_type: string;
  pay_amount: string;
  additional_perks: string | null;
  joining_fee_required: boolean;
  minimum_education: string;
  language_required: string;
  experience_required: string;
  additional_requirements: string | null;
  job_description: string;
  is_walk_in: boolean;
  walk_in_address: string | null;
  walk_in_start_date: string | null;
  walk_in_end_date: string | null;
  walk_in_timing: string | null;
  walk_in_instructions: string | null;
  application_email: string;
  status: string;
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmployerJobCardProps {
  jobData: JobData;
  onViewJob?: (job: JobData) => void;
}

const formatCurrency = (amount: string) => {
  const num = parseInt(amount);
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border text-xs`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const EmployerJobCard = ({ jobData, onViewJob }: EmployerJobCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {jobData.job_title}
            </h3>
            <p className="text-sm text-gray-600">{jobData.company_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={jobData.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => {
                    if (onViewJob) {
                      onViewJob(jobData);
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
            <span>{jobData.job_category}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-red-500" />
            <span>{jobData.work_location_type}</span>
          </div>
        </div>

        {/* Salary and Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
            <span className="font-semibold text-green-600">
              {formatCurrency(jobData.pay_amount)}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({jobData.pay_type})
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {jobData.job_type}
          </Badge>
        </div>

        {/* Experience and Posted Date */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <span className="font-medium">Experience:</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {jobData.experience_required}
            </Badge>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(jobData.createdAt)}
          </div>
        </div>

        {/* Additional Info */}
        {jobData.is_featured && (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
            ⭐ Featured Job
          </Badge>
        )}
      </CardContent>
      
      <JobDetailsModal 
        job={jobData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};

export default EmployerJobCard;