import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { candidateAPI, type ProfileData } from '@/services/api';

export const useProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    
    if (!isAuthenticated || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Only fetch profile for candidates
    if (user.role !== 'CANDIDATE' && user.role !== 'candidate') {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      
      // The API automatically uses the logged-in user's ID from the JWT token
      const response = await candidateAPI.getProfile();
      
      // Handle different response structures
      let profileData = {};
      let resumeData = {};
      let personalInfo = {};
      
      // Handle all possible response structures
      profileData = response.data?.profile || response.profile || response;
      resumeData = profileData.resume || profileData || {};
      personalInfo = resumeData.personal_info || resumeData || {};
      
      // Get experience from all possible locations
      const experienceArray = 
        resumeData.experience || 
        profileData.experience || 
        response.experience || 
        response.data?.experience || 
        personalInfo.experience || 
        [];
      
      
      
      // Map API response to component format
      const profileWithUserInfo = {
        id: profileData.id || user.id,
        email: profileData.email || user.email,
        full_name: profileData.full_name || profileData.fullName || user.fullName || user.full_name,
        mobile: profileData.mobile || profileData.phone || personalInfo.phone,
        date_of_birth: profileData.date_of_birth || personalInfo.dateOfBirth,
        location: profileData.location || personalInfo.location,
        bio: profileData.bio || personalInfo.bio,
        profile_image: profileData.profile_image || profileData.profileImage,
        // Add resume sections with multiple fallback paths
        education: (resumeData.education || profileData.education || response.education || []).map((edu: any) => ({
          ...edu,
          degreeTitle: edu.degreeTitle || edu.degree,
          instituteName: edu.instituteName || edu.institution,
          instituteLocation: edu.instituteLocation || edu.location,
          startDate: edu.startDate ? (typeof edu.startDate === 'string' ? edu.startDate : edu.startDate.toISOString()) : undefined,
          endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : edu.endDate.toISOString()) : undefined,
          grade: edu.grade || edu.percentage,
          description: edu.description
        })),
        experience: experienceArray.map((exp: any) => {
          
          const mappedExp = {
            id: exp.id || exp._id,
            position: exp.position || exp.jobTitle || exp.job_title || exp.title || exp.role,
            companyName: exp.companyName || exp.company_name || exp.company || exp.employer,
            location: exp.location || exp.work_location || exp.office_location || exp.city || '',
            startDate: exp.startDate || exp.start_date || exp.from_date || exp.joinDate,
            endDate: exp.endDate || exp.end_date || exp.to_date || exp.leaveDate,
            description: exp.description || exp.job_description || exp.responsibilities || exp.summary || '',
            achievements: exp.achievements || exp.achievement || exp.accomplishments || exp.key_achievements || exp.highlights || '',
            currentlyWorking: exp.currentlyWorking || exp.is_current || exp.currently_working || exp.isCurrent || false
          };
          
          return mappedExp;
        }),
        skills: resumeData.skills || profileData.skills || response.skills || [],
        projects: (resumeData.projects || profileData.projects || response.projects || []).map((proj: any) => {
          
          return {
            ...proj,
            title: proj.title || proj.project_title || proj.name,
            description: proj.description || proj.project_description,
            startDate: proj.startDate || proj.start_date || proj.from_date,
            endDate: proj.endDate || proj.end_date || proj.to_date,
            isOngoing: proj.isOngoing || proj.is_ongoing || proj.ongoing || false,
            projectUrl: proj.projectUrl || proj.project_url || proj.demo_url || proj.live_url || proj.url || '',
            githubUrl: proj.githubUrl || proj.github_url || proj.repository_url || proj.git_url || '',
            technologies: proj.technologies || proj.tech_stack || proj.skills || [],
            achievements: proj.achievements || proj.achievement || proj.accomplishments || proj.key_achievements || proj.highlights || ''
          };
        }),
        certifications: (resumeData.certifications || profileData.certifications || response.certifications || []).map((cert: any) => {
          
          return {
            id: cert.id || cert._id,
            name: cert.name || cert.certification_name || cert.title,
            issuingOrganization: cert.issuingOrganization || cert.issuing_organization || cert.issuer || cert.organization || '',
            issueDate: cert.issueDate || cert.issue_date || cert.date_issued,
            expiryDate: cert.expiryDate || cert.expiry_date || cert.date_expires,
            credentialId: cert.credentialId || cert.credential_id || cert.id_number || '',
            credentialUrl: cert.credentialUrl || cert.credential_url || cert.verification_url || '',
            description: cert.description || cert.details || '',
            isExpired: cert.isExpired || cert.is_expired || false
          };
        }),
      };
      
      
      setProfile(profileWithUserInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      
      // Fallback to user data from auth if profile fetch fails
      if (user) {
        setProfile({
          id: user.id,
          email: user.email,
          full_name: user.fullName || user.full_name,
          education: [],
          experience: [],
          skills: [],
          projects: [],
          certifications: [],
        });
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Update profile
      await candidateAPI.updateProfile(profileData);
      
      // Update local profile state immediately
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      return profile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    updateProfile,
    userId: user?.id,
    isAuthenticated,
  };
};

export type { ProfileData };