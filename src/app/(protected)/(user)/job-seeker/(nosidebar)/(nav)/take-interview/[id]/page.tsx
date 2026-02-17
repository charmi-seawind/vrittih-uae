import Container from "@/components/Global/Container";
import DisplayTechIcons from "@/components/Global/DisplayTechIcons";
// import { getSingleMockInterview } from "@/data-access/mock-interview/getUserMockInterview";
const getSingleMockInterview = () => Promise.resolve(null);
// import { auth } from "@/lib/auth";
const auth = () => Promise.resolve(null);
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
// import TakeInterviewPage from "./TakeInterviewPage";
import { Metadata } from "next";
import AgentSkeleton from "@/components/skeletons/AgentSkeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/Global/BackButton";
import { Briefcase, CheckCircle2, Lightbulb, Mic } from "lucide-react";
interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { id } = await params;
  return {
    title: "Take Interview",
    description: "Take your mock interview",
  };
};

const TakeInterviewPageWrapper = async ({ params }: PageProps) => {
  const { id } = await params;
  const session = await auth();
  
  if (!session || !session.jobSeekerId) {
    redirect("/");
  }

  return (
    <Container>
      <BackButton
        className="mt-4"
        href="/job-seeker/career-coach/mock-interview"
      />
      <Suspense fallback={<AgentSkeleton />}>
        <TakeInterviewDataLoader interviewId={id} userId={session.jobSeekerId} />
      </Suspense>
    </Container>
  );
};

export default TakeInterviewPageWrapper;

const TakeInterviewDataLoader = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}) => {
  const interview = await getSingleMockInterview(interviewId, userId);
  
  if (!interview) {
    return notFound();
  }

  return (
    <Card className="my-8 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Mock Interview: {interview?.role || 'Interview'}
        </CardTitle>
        <CardDescription>
          Take your AI-powered mock interview. Speak clearly and answer the questions to the best of your ability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/20">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-primary mb-2">
                  Interview Tips:
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  <li>Speak clearly and at a normal pace</li>
                  <li>Take your time to think before answering</li>
                  <li>Be specific and provide examples when possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
