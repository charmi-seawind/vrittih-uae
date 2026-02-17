import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { employerAPI } from '@/services/api';

export interface EmployerProfileData {
  id?: string;
  email?: string;
  company_name?: string;
  company_description?: string;
  company_website?: string;
  company_size?: string;
  industry?: string;
  location?: string;
  contact_person?: string;
  phone?: string;
  logo?: string;
}

export const useEmployerProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<EmployerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await employerAPI.getProfile();
      
      const profileData = response.data?.profile || response.data || {};
      
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      
      if (user) {
        setProfile({
          id: user.id,
          email: user.email,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile: refreshProfile,
    userId: user?.id,
    isAuthenticated,
  };
};