'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface MultiStepFormWrapperProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onBack?: () => void;
}

export default function MultiStepFormWrapper({ 
  children, 
  currentStep, 
  totalSteps, 
  stepTitle,
  onBack 
}: MultiStepFormWrapperProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/register/job_seeker'); // Always go to first step
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
              <span className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{stepTitle}</h1>
            <p className="text-gray-600 mt-2">
              Fill in your details to complete your profile
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}