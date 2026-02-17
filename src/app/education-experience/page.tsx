'use client';

import EducationExperienceForm from '@/components/EducationExperienceForm';

export default function EducationExperiencePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Profile</h1>
        <EducationExperienceForm />
      </div>
    </div>
  );
}