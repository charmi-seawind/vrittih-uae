import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  pendingUserId: string | null;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  resumeData: any;
  uploadedCV: string | null;
  uploadedPhoto: string | null;
  userBasicInfo: {
    full_name: string;
    email: string;
    mobile: string;
  } | null;
  parsedCVData: any;
  setParsedCVData: (data: any) => void;
  setCurrentStep: (step: number) => void;
  setCompleted: (completed: boolean) => void;
  setPendingUserId: (id: string | null) => void;
  setEmailVerified: (verified: boolean) => void;
  setMobileVerified: (verified: boolean) => void;
  setResumeData: (data: any) => void;
  setUploadedCV: (fileName: string | null) => void;
  setUploadedPhoto: (fileName: string | null) => void;
  setUserBasicInfo: (info: { full_name: string; email: string; mobile: string } | null) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(persist(
  (set) => ({
    currentStep: 1,
    isCompleted: false,
    pendingUserId: null,
    isEmailVerified: false,
    isMobileVerified: false,
    resumeData: null,
    uploadedCV: null,
    uploadedPhoto: null,
    userBasicInfo: null,
    parsedCVData: null,
    setCurrentStep: (step) => set({ currentStep: step }),
    setCompleted: (completed) => set({ isCompleted: completed }),
    setPendingUserId: (id) => set({ pendingUserId: id }),
    setEmailVerified: (verified) => set({ isEmailVerified: verified }),
    setMobileVerified: (verified) => set({ isMobileVerified: verified }),
    setResumeData: (data) => set({ resumeData: data }),
    setUploadedCV: (fileName) => set({ uploadedCV: fileName }),
    setUploadedPhoto: (fileName) => set({ uploadedPhoto: fileName }),
    setUserBasicInfo: (info) => set({ userBasicInfo: info }),
    setParsedCVData: (data) => set({ parsedCVData: data }),
    reset: () => set({ currentStep: 1, isCompleted: false, pendingUserId: null, isEmailVerified: false, isMobileVerified: false, resumeData: null, uploadedCV: null, uploadedPhoto: null, userBasicInfo: null, parsedCVData: null }),
  }),
  {
    name: 'onboarding-storage',
  }
));