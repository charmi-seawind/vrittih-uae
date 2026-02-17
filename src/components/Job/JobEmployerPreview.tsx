import { JobSchemaType } from "@/schema/CreateJobSchema";
import { Card, CardContent } from "../ui/card";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { formatDate, getTimeDistance, renderSalaryText } from "@/lib/utils";
import { Badge } from "../ui/badge";
import ContentViewer from "../tiptap/ContentViewer";
import { Separator } from "../ui/separator";
import Image from "next/image";

interface CompanyData {
  name: string;
  logoUrl?: string;
}

interface JobEmployerPreviewSectionProps {
  job: JobSchemaType;
  company: CompanyData; // company data now passed as props
}

const JobEmployerPreview = ({ job, company }: JobEmployerPreviewSectionProps) => {
  if (!company) return null;

  return (
    <div className="w-full overflow-y-auto p-5">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 ">
                  <div className="flex items-center gap-4">
                    {company.logoUrl && (
                      <Image
                        src={company.logoUrl}
                        width={50}
                        height={50}
                        alt={company.name}
                        className="rounded-md object-cover"
                      />
                    )}
                    {job.title && (
                      <h1 className="text-3xl font-bold">{job.title}</h1>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BriefcaseBusiness size={16} />
                      {company.name}
                    </span>

                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      Posted {getTimeDistance(new Date())} ago
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.isUrgent && (
                      <Badge variant={"destructive"} className="text-xs py-1">
                        Hiring Urgent
                      </Badge>
                    )}
                    {job.jobType && (
                      <Badge className="text-xs py-1 bg-blue-400/10 text-blue-500 hover:bg-blue-400/10 ">
                        {job.jobType}
                      </Badge>
                    )}
                    {job.workMode && (
                      <Badge className="text-xs py-1 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/10 ">
                        {job.workMode}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {job.description && (
          <Card>
            <CardContent className="p-6">
              <ContentViewer content={job.description} />
            </CardContent>
          </Card>
        )}

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Skills & Requirements</h2>
              <div className="space-y-6">

                {job.skills && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant={"outline"} className="text-sm py-1.5 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <section className="space-y-6 grid grid-cols-1 md:grid-cols-2 items-start ">

                  {job.educationLevel && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Education
                      </h3>
                      <p className="flex items-center gap-2">
                        <BookOpen size={16} className="text-muted-foreground" />
                        {job.educationLevel}
                      </p>
                    </div>
                  )}

                  {job.experienceLevel && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Experience
                      </h3>
                      <p className="flex items-center gap-2">
                        <Award size={16} className="text-muted-foreground" />
                        {job.experienceLevel === "0"
                          ? "Fresher"
                          : job.experienceLevel}
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <aside>
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold">Job Details</h2>

                <div className="space-y-4">
                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Salary</span>
                    <p>
                      {renderSalaryText({
                        maxAmount: Number(job?.maxSalaryAmount),
                        startingAmount: Number(job?.minSalaryAmount),
                        exactAmount: Number(job?.amount),
                        //@ts-ignore
                        displayType: job?.salaryType,
                        currency: job?.salaryCurrency,
                      })}{" "}
                      / per {job?.salaryRate}
                    </p>
                  </div>

                  <Separator />

                  {job.jobType && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Job Type</span>
                        <span className="font-medium">{job.jobType}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {job.workMode && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Work Mode</span>
                        <span className="font-medium">{job.workMode}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Deadline</span>
                    <div className="flex items-center text-amber-600 font-medium">
                      <Calendar size={16} className="mr-1" />
                      {job.applicationDeadline && formatDate(job.applicationDeadline)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            {job.benefits && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Benefits</h2>

                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-green-500 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default JobEmployerPreview;
