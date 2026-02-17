"use client";
import JobDescriptionPageContent from "./JobDescriptionPage";

import JobSeekerNav from "@/components/sidebar/JobSeekerNav";

import NavBar from "@/components/LandingPage/NavBar";

import { useJobDetails } from "@/hooks/query-hooks/useJobDetails";

import { useAuth } from "@/hooks/useAuth";

import { useParams } from "next/navigation";

import Container from "@/components/Global/Container";

import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";


const JobDetailsSkeleton = () => (

  <Container className="pt-10 mb-10">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <Skeleton className="h-20 w-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Container>
);
const containerVariants = {

  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;
const itemVariant = {

  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
} as const;

const JobDescriptionPage = () => {

  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const { data: job, isLoading, error } = useJobDetails(slug);

  if (error) {
    return (
      <>
        {user ? <JobSeekerNav user={user} hasSidebar={false} /> : <NavBar />}
        <Container className="pt-10 mb-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Job Not Found</h1>
            <p className="text-muted-foreground mt-2">The job you're looking for doesn't exist.</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      {user ? <JobSeekerNav user={user} hasSidebar={false} /> : <NavBar />}
      
      {isLoading ? (
        <JobDetailsSkeleton />
      ) : job ? (
        <JobDescriptionPageContent
          session={user ? { user } as any : null}
          containerVariants={containerVariants}
          itemVariant={itemVariant}
          job={job}
        />
      ) : null}
    </>
  );
};

export default JobDescriptionPage;
