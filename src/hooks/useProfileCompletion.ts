import { useMemo } from 'react';
import { useProfile } from './useProfile';

interface ProfileField {
  key: string;
  label: string;
  weight: number;
  isCompleted: (profile: any) => boolean;
  description: string;
}

export const useProfileCompletion = () => {
  const { profile, loading } = useProfile();

  const profileFields: ProfileField[] = useMemo(() => [
    {
      key: 'basic_info',
      label: 'Basic Information',
      weight: 20,
      description: 'Name, email, and phone number',
      isCompleted: (p) => !!(p?.full_name && p?.email && p?.mobile)
    },
    {
      key: 'location',
      label: 'Location',
      weight: 10,
      description: 'Current city/location',
      isCompleted: (p) => !!p?.location
    },
    {
      key: 'bio',
      label: 'Professional Summary',
      weight: 15,
      description: 'Brief description about yourself',
      isCompleted: (p) => !!(p?.bio && p.bio.length >= 50)
    },
    {
      key: 'education',
      label: 'Education',
      weight: 25,
      description: 'Educational qualifications',
      isCompleted: (p) => !!(p?.education && p.education.length > 0)
    },
    {
      key: 'experience',
      label: 'Work Experience',
      weight: 25,
      description: 'Professional work history',
      isCompleted: (p) => !!(p?.experience && p.experience.length > 0)
    },
    {
      key: 'skills',
      label: 'Skills',
      weight: 15,
      description: 'Technical and soft skills',
      isCompleted: (p) => !!(p?.skills && p.skills.length >= 3)
    },
    {
      key: 'profile_image',
      label: 'Profile Photo',
      weight: 5,
      description: 'Professional profile picture',
      isCompleted: (p) => !!p?.profile_image
    }
  ], []);

  const completionData = useMemo(() => {
    if (!profile) {
      return {
        percentage: 0,
        completedFields: [],
        incompleteFields: profileFields,
        totalFields: profileFields.length,
        completedCount: 0,
        score: 0
      };
    }

    const completedFields = profileFields.filter(field => field.isCompleted(profile));
    const incompleteFields = profileFields.filter(field => !field.isCompleted(profile));
    
    const totalWeight = profileFields.reduce((sum, field) => sum + field.weight, 0);
    const completedWeight = completedFields.reduce((sum, field) => sum + field.weight, 0);
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    // Calculate profile strength score (0-100)
    let score = percentage;
    
    // Bonus points for having multiple items in arrays
    if (profile.education && profile.education.length > 1) score += 2;
    if (profile.experience && profile.experience.length > 2) score += 3;
    if (profile.skills && profile.skills.length > 5) score += 2;
    if (profile.projects && profile.projects.length > 0) score += 3;
    if (profile.certifications && profile.certifications.length > 0) score += 2;

    score = Math.min(100, score); // Cap at 100

    return {
      percentage,
      completedFields,
      incompleteFields,
      totalFields: profileFields.length,
      completedCount: completedFields.length,
      score
    };
  }, [profile, profileFields]);

  const getCompletionLevel = () => {
    const { percentage } = completionData;
    if (percentage >= 90) return { level: 'Excellent', color: 'green', message: 'Your profile is outstanding!' };
    if (percentage >= 75) return { level: 'Good', color: 'blue', message: 'Great profile! Add a few more details.' };
    if (percentage >= 50) return { level: 'Average', color: 'yellow', message: 'Good start! Complete more sections.' };
    if (percentage >= 25) return { level: 'Basic', color: 'orange', message: 'Add more information to stand out.' };
    return { level: 'Incomplete', color: 'red', message: 'Complete your profile to get noticed.' };
  };

  const getNextAction = () => {
    const { incompleteFields } = completionData;
    if (incompleteFields.length === 0) return null;
    
    // Return the highest weighted incomplete field
    return incompleteFields.reduce((prev, current) => 
      prev.weight > current.weight ? prev : current
    );
  };

  return {
    ...completionData,
    loading,
    profile,
    profileFields,
    completionLevel: getCompletionLevel(),
    nextAction: getNextAction(),
    isProfileComplete: completionData.percentage >= 90
  };
};

export type { ProfileField };