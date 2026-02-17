"use client";
import { motion } from "framer-motion";
import JobEditorFooter from "@/components/Job/JobEditorFooter";
import BoxReveal from "@/components/ui/box-reveal";
import { JobSchemaType } from "@/schema/CreateJobSchema";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { JobEditorFormSteps } from "@/lib/multi-form-steps/JobEditorStep";
import JobPreviewSection from "@/components/Job/JobPreviewSection";
import { cn } from "@/lib/utils";
import JobEditorBreadcrumbs from "@/components/JobEditorBreadCrumbs";

interface JobEditorPageProps {
  jobToEdit: any | null; // simplified type
}

const JobEditorPage = ({ jobToEdit }: JobEditorPageProps) => {
  const searchParams = useSearchParams();
  const [JobData, setJobData] = useState<JobSchemaType>(
    jobToEdit ? jobToEdit : ({} as JobSchemaType)
  );

  const [showSMPreview, setShowSMPreview] = useState(false);

  const currentStep =
    searchParams.get("step") || JobEditorFormSteps[0].key;

  const setStep = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
  };

  const FormComponent = JobEditorFormSteps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <section className="flex grow flex-col relative">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <div className="flex items-center justify-center">
          <BoxReveal boxColor={"gray"} classname="" duration={0.2}>
            <h1 className="text-2xl font-bold text-center">
              Create Your Job
            </h1>
          </BoxReveal>
        </div>
        <div className="flex items-center justify-center">
          <BoxReveal boxColor={"gray"} classname="" duration={0.4}>
            <p className="text-sm text-muted-foreground">
              Follow the steps below to create a new job post.
            </p>
          </BoxReveal>
        </div>
      </header>

      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          {/* Form */}
          <div
            className={cn(
              "w-full md:w-1/2 p-3 overflow-y-auto space-y-6",
              showSMPreview && "hidden"
            )}
          >
            <JobEditorBreadcrumbs currentStep={currentStep} />
            <motion.div
              key={currentStep}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {FormComponent && (
                <FormComponent
                  currentStep={currentStep}
                  jobData={JobData}
                  setJobData={setJobData}
                />
              )}
            </motion.div>
          </div>

          <div className="grow md:border-r" />

          {/* Preview */}
          <JobPreviewSection
            className={cn(showSMPreview && "flex")}
            jobData={JobData}
          />
        </div>
      </main>

      {/* Footer */}
      <JobEditorFooter
        setShowSMPreview={setShowSMPreview}
        showSMPreview={showSMPreview}
        currentStep={currentStep}
        setCurrentStep={setStep}
        isSaving={false} // removed auto-save
        jobId={undefined} // removed db id usage
      />
    </section>
  );
};

export default JobEditorPage;
