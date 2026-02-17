"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Users, 
  Briefcase,
  GraduationCap,
  Languages,
  Star,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import ApplyNowButton from "@/components/Global/ApplyNowButton";
import { useAuth } from "@/hooks/useAuth";

const JobDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const jobId = params.id as string;

  const { data: jobData, isLoading, error } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch job details');
      return response.json();
    },
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !jobData?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const job = jobData.data.job;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{job.job_title}</CardTitle>
                <p className="text-lg text-gray-600 flex items-center gap-2">
                  <Building className="h-5 w-5" />
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
              {isAuthenticated && (
                <ApplyNowButton jobData={job} />
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none prose-sm prose-headings:text-base prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:text-sm prose-li:text-sm"
                  dangerouslySetInnerHTML={{ __html: job.job_description }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                </div>
                {job.additional_requirements && (
                  <div>
                    <p className="font-medium mb-2">Additional Requirements</p>
                    <p className="text-sm text-gray-600">{job.additional_requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
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
              </CardContent>
            </Card>

            {job.additional_perks && (
              <Card>
                <CardHeader>
                  <CardTitle>Perks & Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{job.additional_perks}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Email: {job.application_email}
                </p>
                {job.joining_fee_required && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Joining fee required
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;