import { create } from 'zustand';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string;
  expectedSalary: string;
  jobTitle: string;
  summary: string;
}

interface ProfileFormState {
  formData: ProfileFormData;
  updateFormData: (data: Partial<ProfileFormData>) => void;
  clearFormData: () => void;
}

const initialFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  experience: '',
  skills: '',
  expectedSalary: '',
  jobTitle: '',
  summary: ''
};

export const useProfileFormStore = create<ProfileFormState>()((set) => ({
  formData: initialFormData,
  updateFormData: (data) => 
    set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
  clearFormData: () => 
    set({ formData: initialFormData }),
}));