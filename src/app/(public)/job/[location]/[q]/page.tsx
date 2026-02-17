import Container from "@/components/Global/Container";
import JobCard from "@/components/Job/JobCard";
import NavBar from "@/components/LandingPage/NavBar";
import { searchJobs } from "@/data-access/job/searchJob";
import { JobSearchTags, locations } from "@/lib/data/SEOData";
// import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { BriefcaseIcon, MapPinIcon, SearchIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ location: string; q: string }>;
}

export const revalidate = 86400; // revalidate after 24 hours

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { location, q } = await params;
  const decodedLocation = decodeURIComponent(location);
  const decodedQuery = decodeURIComponent(q);
  
  return {
    title: `${decodedQuery} Jobs in ${decodedLocation} | Job Search`,
    description: `Find ${decodedQuery} jobs in ${decodedLocation}. Browse through available positions and apply today.`,
  };
};

const JobSearchPage = async ({ params }: PageProps) => {
  const { location, q } = await params;
  const decodedLocation = decodeURIComponent(location);
  const decodedQuery = decodeURIComponent(q);

  return (
    <>
      <NavBar />
      <Container className="py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">
              {decodedQuery} Jobs in {decodedLocation}
            </h1>
            <p className="text-muted-foreground">
              Discover opportunities for {decodedQuery} positions in {decodedLocation}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <SearchIcon className="h-3 w-3" />
              {decodedQuery}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPinIcon className="h-3 w-3" />
              {decodedLocation}
            </Badge>
          </div>

          <JobSearchResults location={decodedLocation} query={decodedQuery} />
        </div>
      </Container>
    </>
  );
};

export default JobSearchPage;

const JobSearchResults = async ({
  location,
  query,
}: {
  location: string;
  query: string;
}) => {
  try {
    const jobs = await searchJobs({ location, query, limit: 20 });

    if (!jobs || jobs.length === 0) {
      return (
        <Card className="p-8 text-center">
          <BriefcaseIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any {query} jobs in {location} at the moment.
          </p>
          <Button asChild>
            <Link href="/job">Browse All Jobs</Link>
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </h2>
        </div>
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">
          We encountered an error while searching for jobs. Please try again later.
        </p>
        <Button asChild>
          <Link href="/job">Browse All Jobs</Link>
        </Button>
      </Card>
    );
  }
};

