import { useCallback } from 'react';
import { useProfileFormStore } from '@/store/useProfileFormStore';

export function useFormPersistence() {
  const { formData, updateFormData } = useProfileFormStore();

  const saveFormData = useCallback((data: Record<string, any>) => {
    updateFormData(data);
  }, [updateFormData]);

  return {
    formData,
    saveFormData
  };
}