"use client";

import { SortableHeader } from "@/components/Global/SortableHeader";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, MapPin, IndianRupee, Clock, TrendingUp, RefreshCw, X, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useJobManagement } from "@/hooks/useJobManagement";
import { useState } from "react";
import { toast } from 'sonner';
import JobDetailsModal from "@/components/employer/JobDetailsModal";
import JobShareButton from "@/components/employer/JobShareButton";

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
    <Badge className={`${getStatusColor(status)} border`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const employerJobsColumn: ColumnDef<JobData>[] = [
  {
    accessorKey: "job_title",
    header: ({ column }) => (
      <SortableHeader column={column} title="Job Title" />
    ),
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{job.job_title}</div>
          <div className="text-sm text-gray-500">{job.company_name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "job_category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.job_category}
      </Badge>
    ),
  },
  {
    accessorKey: "job_type",
    header: "Type",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="space-y-1">
          <Badge variant="secondary" className="text-xs">
            {job.job_type}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {job.work_location_type}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "pay_amount",
    header: ({ column }) => (
      <SortableHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center text-sm">
          <IndianRupee className="h-3 w-3 mr-1 text-green-600" />
          <span className="font-medium text-green-600">
            {formatCurrency(job.pay_amount)}
          </span>
          <span className="text-xs text-gray-500 ml-1">
            ({job.pay_type})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "experience_required",
    header: "Experience",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.experience_required}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column} title="Posted" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="h-3 w-3 mr-1" />
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          {job.is_featured && job.status === 'active' && (
            <span className="text-yellow-500">⭐</span>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const job = row.original;
      
      const ActionsCell = () => {
        const router = useRouter();
        const { promoteJob, renewJob, expireJob, deleteJob, isLoading, canPromoteJob, getRemainingFeaturedJobs } = useJobManagement();
        const [showDetailsModal, setShowDetailsModal] = useState(false);
        
        const handleEdit = () => {
          window.location.href = `/employer/job/edit/${job.id}`;
        };

        const handleViewDetails = () => {
          setShowDetailsModal(true);
        };

        const handlePromote = async () => {
          if (!canPromoteJob()) {
            toast.error('You have reached your featured jobs limit. Please upgrade your plan to promote more jobs.');
            return;
          }
          await promoteJob(job.id);
        };

        const handleRenew = async () => {
          await renewJob(job.id);
        };

        const handleExpire = async () => {
          await expireJob(job.id);
        };

        const handleDelete = async () => {
          await deleteJob(job.id);
        };
        
        return (
          <>
            <div className="flex items-center gap-2">
              <JobShareButton job={job} size="sm" variant="ghost" />
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleViewDetails}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Job
                </DropdownMenuItem>
              <DropdownMenuSeparator />
              {job.status === 'active' ? (
                <>
                  {!job.is_featured && (
                    <DropdownMenuItem 
                      className={`cursor-pointer ${canPromoteJob() ? 'text-blue-600' : 'text-gray-400'}`} 
                      onClick={handlePromote}
                      disabled={!canPromoteJob()}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {canPromoteJob() ? 'Promote Job' : 'Upgrade to Promote'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleExpire}>
                    <X className="mr-2 h-4 w-4" />
                    Expire Job
                  </DropdownMenuItem>
                </>
              ) : job.status === 'inactive' ? (
                <>
                  <DropdownMenuItem className="cursor-pointer text-green-600" onClick={handleRenew}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Renew Job
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Job
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <JobDetailsModal 
              job={job}
              isOpen={showDetailsModal} 
              onClose={() => setShowDetailsModal(false)}
            />
          </>
        );
      };
      
      return <ActionsCell />;
    },
  },
];