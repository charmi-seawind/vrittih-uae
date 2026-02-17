"use client";

import { useState, useEffect } from "react";
import { employerAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MapPin, Clock, IndianRupee, Briefcase, Building2, FileText, GraduationCap, Languages, Mail, Eye } from "lucide-react";

export default function FeaturedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await employerAPI.getEmployerFeaturedJobs();
        setJobs(response.data?.jobs || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          Featured Jobs
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          My Featured Jobs
        </h1>
        <Badge variant="secondary">{jobs.length} Jobs</Badge>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Featured Jobs</h3>
            <p className="text-gray-600">You don't have any featured jobs yet. Promote your jobs to make them featured.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <Card key={job.id} className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {job.job_title}
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    </CardTitle>
                    <p className="text-gray-600">{job.company_name}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {job.work_location_type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {job.job_type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IndianRupee className="h-4 w-4" />
                    {job.pay_amount} {job.pay_type}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{job.job_category}</Badge>
                  <Badge variant="outline">{job.experience_required}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Job Details - {job.job_title}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-500">Job Title</p>
                                <p className="font-semibold">{job.job_title}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Building2 className="h-4 w-4 text-purple-600" />
                              <div>
                                <p className="text-sm text-gray-500">Company</p>
                                <p className="font-semibold">{job.company_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <p className="font-semibold">{job.job_category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-orange-600" />
                              <div>
                                <p className="text-sm text-gray-500">Job Type</p>
                                <p className="font-semibold">{job.job_type}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Requirements</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <div>
                                <p className="text-sm text-gray-500">Experience</p>
                                <p className="font-semibold">{job.experience_required}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <GraduationCap className="h-4 w-4 text-blue-500" />
                              <div>
                                <p className="text-sm text-gray-500">Education</p>
                                <p className="font-semibold">{job.minimum_education}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Languages className="h-4 w-4 text-purple-500" />
                              <div>
                                <p className="text-sm text-gray-500">Language</p>
                                <p className="font-semibold">{job.language_required}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <IndianRupee className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-sm text-gray-500">Salary</p>
                                <p className="font-semibold text-green-700">{job.pay_amount} ({job.pay_type})</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-semibold text-lg border-b pb-2 mb-4">Job Description</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{job.job_description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Application Email</p>
                            <p className="font-semibold">{job.application_email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm text-gray-500">Office Address</p>
                            <p className="font-semibold">{job.office_address}</p>
                          </div>
                        </div>
                      </div>
                      
                      {job.is_walk_in && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-lg border-b pb-2 mb-4">Walk-in Interview Details</h3>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="text-sm text-blue-600">Address</p>
                                  <p className="font-semibold text-blue-800">{job.walk_in_address}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="text-sm text-blue-600">Timing</p>
                                  <p className="font-semibold text-blue-800">{job.walk_in_timing}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}