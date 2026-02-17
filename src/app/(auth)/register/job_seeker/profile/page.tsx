'use client';

import { Suspense } from 'react';
import JobSeekerProfileForm from '@/components/Forms/JobSeekerProfileForm';
import MultiStepFormWrapper from '@/components/Forms/MultiStepFormWrapper';

export default function JobSeekerProfilePage() {
  return (
    <MultiStepFormWrapper
      currentStep={2}
      totalSteps={3}
      stepTitle="Complete Your Profile"
    >
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <JobSeekerProfileForm />
      </Suspense>
    </MultiStepFormWrapper>
  );
}