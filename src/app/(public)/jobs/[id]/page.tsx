"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, IndianRupee, Briefcase, Building2, Clock, GraduationCap, Languages, Star, Users, Target } from "lucide-react";
import { API_CONFIG } from "@/lib/config";
import Head from "next/head";

const PublicJobDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: jobData, isLoading, error } = useQuery({
    queryKey: ["public-job", jobId],
    queryFn: async () => {
      try {
        // Try multiple possible endpoints
        const endpoints = [
          `${API_CONFIG.API_URL}/jobs/${jobId}`,
          `${API_CONFIG.API_URL}/job/${jobId}`,
          `${API_CONFIG.BASE_URL}/api/jobs/${jobId}`,
          `${API_CONFIG.BASE_URL}/api/job/${jobId}`
        ];
        
        let lastError;
        for (const endpoint of endpoints) {
          try {

            const response = await fetch(endpoint);
            if (response.ok) {
              const data = await response.json();

              return data;
            }
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          } catch (err) {
            lastError = err;
            continue;
          }
        }
        throw lastError || new Error("All endpoints failed");
      } catch (error) {
        console.error('Job fetch error:', error);
        throw new Error("Job not found");
      }
    },
  });

  const job = jobData?.data?.job || jobData?.body?.job || jobData?.job;

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

  if (error || !job) {
    console.error('Job not found error:', error, 'Job data:', jobData);
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">
              This job posting is no longer available or the link is invalid.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Job ID: {jobId}
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push("https://vrrittih.com")} className="mr-2">
                Get Started
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          size="lg"
          onClick={() => router.push("/onboarding/job-seeker")}
          className="w-full md:w-auto"
        >
          Apply Now
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{job.job_title}</CardTitle>
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

            {job.office_address && (
              <Card>
                <CardHeader>
                  <CardTitle>Office Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{job.office_address}</p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold mb-4">Ready to Apply?</h3>
                <Button
                  size="lg"
                  onClick={() => router.push("/onboarding/job-seeker")}
                  className="w-full"
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicJobDetailPage;
