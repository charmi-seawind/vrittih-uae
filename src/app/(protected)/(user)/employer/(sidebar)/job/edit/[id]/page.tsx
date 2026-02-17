"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import SidebarContainer from "@/components/Global/SidebarContainer";
import JobEditForm from "@/components/employer/JobEditForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { employerAPI } from "@/services/api";

const EditJobPage = () => {
  const params = useParams();
  const jobId = params.id as string;
  const [employerData, setEmployerData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employer data
        const employerResponse = await employerAPI.getProfile();
        setEmployerData(employerResponse.data);
        
        // Fetch individual job data to get complete job details including custom_form_fields
        const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (jobResponse.ok) {
          const jobResult = await jobResponse.json();
          setJobData(jobResult.data?.job || jobResult.job || null);
        } else {
          // Fallback to getting job from employer profile
          const jobs = employerResponse.data?.jobs || [];
          const job = jobs.find(j => j.id === jobId);
          setJobData(job || null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  if (loading) {
    return (
      <SidebarContainer>
        <div className="p-6 text-center">
          <h2>Loading...</h2>
        </div>
      </SidebarContainer>
    );
  }

  if (error) {
    return (
      <SidebarContainer>
        <div className="p-6 text-center">
          <h2 className="text-red-600">Error: {error}</h2>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/employer/job/all-job">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Job</h1>
        </div>

        {jobData ? (
          <JobEditForm jobId={jobId} jobData={jobData} employerData={employerData} />
        ) : (
          <div className="p-6 text-center">
            <h3>No Job Found</h3>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        )}
      </div>
    </SidebarContainer>
  );
};

export default EditJobPage;
