"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Clock, Star, CheckCircle, XCircle, EyeIcon } from "lucide-react";
import { useUpdateApplicationStatus } from "@/hooks/query-hooks/useUpdateApplicationStatus";
import { toast } from "sonner";

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: string;
  onStatusChange?: (applicationId: string, newStatus: string) => void;
}

const ApplicationActions = ({ 
  applicationId, 
  currentStatus, 
  onStatusChange 
}: ApplicationActionsProps) => {
  const updateStatusMutation = useUpdateApplicationStatus();

  const handleStatusChange = async (newStatus: string) => {
    updateStatusMutation.mutate(
      { applicationId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Application status updated to ${newStatus}`);
          onStatusChange?.(applicationId, newStatus);
        },
        onError: (error) => {
          toast.error('Failed to update application status');
        }
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shortlisted': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${getStatusColor(currentStatus)} border flex items-center gap-1 px-3 py-1 text-xs font-medium`}>
        {currentStatus === 'pending' && <Clock className="h-3 w-3" />}
        {currentStatus === 'reviewed' && <EyeIcon className="h-3 w-3" />}
        {currentStatus === 'shortlisted' && <Star className="h-3 w-3" />}
        {currentStatus === 'rejected' && <XCircle className="h-3 w-3" />}
        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
      </Badge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={updateStatusMutation.isPending}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {currentStatus !== 'reviewed' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('reviewed')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 text-blue-700"
            >
              <EyeIcon className="h-4 w-4" />
              <span className="font-medium">Mark as Reviewed</span>
            </DropdownMenuItem>
          )}
          {currentStatus !== 'shortlisted' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('shortlisted')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-green-50 text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Shortlist Candidate</span>
            </DropdownMenuItem>
          )}
          {currentStatus !== 'rejected' && (
            <DropdownMenuItem 
              onClick={() => handleStatusChange('rejected')}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-red-50 text-red-700"
            >
              <XCircle className="h-4 w-4" />
              <span className="font-medium">Reject Application</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ApplicationActions;