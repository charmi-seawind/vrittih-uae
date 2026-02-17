import Container from "@/components/Global/Container";
import JobCard from "@/components/Job/JobCard";
import NavBar from "@/components/LandingPage/NavBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { searchJobByLocation } from "@/data-access/job/searchJob";
const searchJobByLocation = (location: string, limit: number) => Promise.resolve([]);
import { locations } from "@/lib/data/SEOData";
import { BriefcaseIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ location: string }>;
}

export const revalidate = 86400; // revalidate after 24 hours

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { location } = await params;
  const decodedLocation = decodeURIComponent(location);
  
  return {
    title: `Jobs in ${decodedLocation} | Job Search`,
    description: `Find jobs in ${decodedLocation}. Browse through available positions and apply today.`,
  };
};

const JobLocationPage = async ({ params }: PageProps) => {
  const { location } = await params;
  const decodedLocation = decodeURIComponent(location);

  return (
    <>
      <NavBar />
      <Container className="py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">
              Jobs in {decodedLocation}
            </h1>
            <p className="text-muted-foreground">
              Discover job opportunities in {decodedLocation}
            </p>
          </div>

          <JobLocationResults location={decodedLocation} />
        </div>
      </Container>
    </>
  );
};

export default JobLocationPage;

const JobLocationResults = async ({ location }: { location: string }) => {
  try {
    const jobs = await searchJobByLocation(location, 20);

    if (!jobs || jobs.length === 0) {
      return (
        <Card className="p-8 text-center">
          <BriefcaseIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any jobs in {location} at the moment.
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

