"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, IndianRupee, Users, Eye, Edit, Trash2 } from "lucide-react";
import { employerAPI } from "@/services/api";
import JobDetailsModal from "./JobDetailsModal";

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
  createdAt: string;
}

const ActiveJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await employerAPI.getJobs();
      setJobs(response.body?.jobs || response.data?.jobs || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading jobs...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Active Jobs</h1>
        <Badge variant="secondary">{jobs.length} Jobs</Badge>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{job.job_title}</CardTitle>
                    {job.is_featured && (
                      <Badge variant="default" className="bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      variant={job.status === 'active' ? 'default' : 'secondary'}
                      className={job.status === 'active' ? 'bg-green-500' : ''}
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{job.company_name}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      window.location.href = `/employer/job/edit/${job.id}`;
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{job.work_location_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{job.job_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">₹{job.pay_amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{job.job_category}</Badge>
                <Badge variant="outline">{job.experience_required}</Badge>
                <Badge variant="outline">{job.minimum_education}</Badge>
                <Badge variant="outline">{job.language_required}</Badge>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {job.job_description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No active jobs found</p>
        </Card>
      )}

      <JobDetailsModal 
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
};

export default ActiveJobs;