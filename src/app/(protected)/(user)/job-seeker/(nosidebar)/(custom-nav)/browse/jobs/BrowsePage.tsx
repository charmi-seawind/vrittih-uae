"use client";

import {
  Filters,
  useBrowseJobInfiniteQuery,
} from "@/hooks/query-hooks/useBrowseJobInfiniteQuery";
import BrowsePageFilter from "./BrowseJobFilter";
import BrowsePageContent from "./BrowsePageContent";
import { useSearchParams } from "next/navigation";
import BrowsePageSearch from "./BrowsePageSearch";
import { Session } from "next-auth";
import BrowsePageFilterSheet from "./BrowsePageFilterSheet";
import BackButton from "@/components/Global/BackButton";
import NearByJobs from "./NearByJobs";
import { Briefcase, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

interface BrowsePageProps {
  session?: Session | null;
  showBackButton?: boolean;
  showNearByJobs: boolean;
}

const BrowsePage = ({
  session,
  showBackButton = true,
  showNearByJobs,
}: BrowsePageProps) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filters: Filters = {
    workMode: searchParams.get("workMode") || "",
    jobTypes: searchParams.get("jobTypes") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    globalSearch: searchParams.get("globalSearch") || "",
    companySearch: searchParams.get("companySearch") || "",
    locationSearch: searchParams.get("locationSearch") || "",
  };

  
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useBrowseJobInfiniteQuery(filters);
  
  // Listen for URL changes from search and filter components
  useEffect(() => {
    const handleParamsChange = () => {
      refetch();
    };
    
    window.addEventListener('searchParamsChanged', handleParamsChange);
    window.addEventListener('filterParamsChanged', handleParamsChange);
    
    return () => {
      window.removeEventListener('searchParamsChanged', handleParamsChange);
      window.removeEventListener('filterParamsChanged', handleParamsChange);
    };
  }, [refetch]);
  

  const jobs = useMemo(() => {
    
    if (!data?.pages) {
      return [];
    }
    
    const allJobs = data.pages.flatMap((page) => {
      const jobsArray = page?.jobs || page?.data?.jobs || [];
      
      return jobsArray.map((job: any) => ({
          id: job.id,
          title: job.job_title,
          company: {
            name: job.company_name,
            logoUrl: '/logo/vrrittih.png',
            id: job.company_id || job.id
          },
          location: job.office_address,
          workMode: job.work_location_type,
          jobType: job.job_type,
          type: job.job_type,
          salary: job.pay_amount,
          Salary: {
            rate: 'year',
            amount: job.pay_amount,
            type: 'Exact' as const,
            currency: '₹'
          },
          description: job.job_description,
          requirements: job.additional_requirements ? [job.additional_requirements] : [],
          postedDate: new Date(job.createdAt).toLocaleDateString(),
          deadline: job.application_deadline ? new Date(job.application_deadline) : undefined,
          isRemote: job.work_location_type === 'Remote',
          isSaved: job.isSaved || false,
          isUrgent: job.is_urgent || false,
          saved: job.isSaved ? [{ id: 'saved' }] : [],
          _count: { applications: job.application_count || 0 }
        }));
      }) ?? [];

    if (!searchTerm.trim()) return allJobs;
    
    return allJobs.filter((job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);
  

  return (
    <>
      <div className="flex">
        <aside className="max-w-[300px] w-[300px] bg-sidebar fixed h-[calc(100vh-64px)] overflow-y-auto hidden md:block">
          <div className="flex items-center px-5">
            {showBackButton && <BackButton />}
          </div>
          <BrowsePageFilter />
        </aside>
        <section className="flex-1 md:pl-[340px] px-10 mx-auto mt-10 ">
          {session && showNearByJobs && (
            <div>
              <NearByJobs />
              <div className="flex items-center my-5">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <Briefcase className="text-primary" size={20} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl">All Jobs</p>
                  <p className="text-sm text-muted-foreground">
                    Discover job opportunities that match your skills and
                    interests
                  </p>
                </div>
              </div>
            </div>
          )}
          <BrowsePageSearch />
          
          {/* Local Search */}
          <div className="mb-5">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="md:hidden mb-5">
            <BrowsePageFilterSheet>
              <BrowsePageFilter />
            </BrowsePageFilterSheet>
          </div>
          <BrowsePageContent
            session={session}
            status={status}
            fetchNextPage={fetchNextPage}
            hasNextPage={!!hasNextPage}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            jobs={jobs}
          />
          
          {jobs.length === 0 && searchTerm && status === "success" && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                No matches found
              </h3>
              <p className="mt-2 text-muted-foreground max-w-md">
                We couldn't find any jobs matching "{searchTerm}"
              </p>
              <button
                className="mt-4 px-4 py-2 border rounded-md"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default BrowsePage;
