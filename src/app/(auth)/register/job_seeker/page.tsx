"use client";

import JobSeekerRegisterForm from "@/components/Forms/JobSeekerRegisterForm";
import FormSide from "@/components/FormSide";
import AnimateWrapper from "@/components/Global/AnimateWrapper";

const JobSeekerRegisterPage = () => {
  return (
    <>
      <article className="relative h-[900px] hidden lg:block ">
        <AnimateWrapper reverse>
          <FormSide
            title="Unlock Opportunities with Vrrittih"
            description="Explore the benefits of Vrrittih for advancing your career or finding top talent effortlessly."
          />
        </AnimateWrapper>
      </article>
      <article className="dark:bg-black bg-[#164bac]  grid  grid-cols-1  place-content-center">
        <AnimateWrapper className="relative">
          <JobSeekerRegisterForm />
        </AnimateWrapper>
      </article>
    </>
  );
};
export default JobSeekerRegisterPage;
