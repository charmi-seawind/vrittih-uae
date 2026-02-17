'use client';

import { useState, useEffect } from 'react';
import { useEmployerProfile, EmployerProfileData } from '@/hooks/useEmployerProfile';
import { employerAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const EmployerProfileForm = () => {
  const { profile, loading, fetchProfile } = useEmployerProfile();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<EmployerProfileData>({
    company_name: '',
    company_description: '',
    company_website: '',
    company_size: '',
    industry: '',
    location: '',
    contact_person: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        company_description: profile.company_description || '',
        company_website: profile.company_website || '',
        company_size: profile.company_size || '',
        industry: profile.industry || '',
        location: profile.location || '',
        contact_person: profile.contact_person || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedProfile = await employerAPI.updateProfile(formData);
      
      // Directly update form with API response
      if (updatedProfile) {
        setFormData({
          company_name: updatedProfile.company_name || '',
          company_description: updatedProfile.company_description || '',
          company_website: updatedProfile.company_website || '',
          company_size: updatedProfile.company_size || '',
          industry: updatedProfile.industry || '',
          location: updatedProfile.location || '',
          contact_person: updatedProfile.contact_person || '',
          phone: updatedProfile.phone || '',
        });
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      fetchProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <Input
          value={formData.company_name}
          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
          placeholder="Enter company name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company Description</label>
        <Textarea
          value={formData.company_description}
          onChange={(e) => setFormData({...formData, company_description: e.target.value})}
          placeholder="Describe your company"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Website</label>
        <Input
          value={formData.company_website}
          onChange={(e) => setFormData({...formData, company_website: e.target.value})}
          placeholder="https://company.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company Size</label>
        <Input
          value={formData.company_size}
          onChange={(e) => setFormData({...formData, company_size: e.target.value})}
          placeholder="e.g., 1-10, 11-50, 51-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Industry</label>
        <Input
          value={formData.industry}
          onChange={(e) => setFormData({...formData, industry: e.target.value})}
          placeholder="e.g., Technology, Healthcare"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="City, State"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contact Person</label>
        <Input
          value={formData.contact_person}
          onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
          placeholder="HR Manager name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="Contact number"
        />
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Update Profile'}
      </Button>
    </form>
  );
};