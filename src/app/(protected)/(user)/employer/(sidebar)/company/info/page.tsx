"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Phone, MapPin, Globe, Edit3, X, Loader2, Camera, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useEmployerData } from "@/hooks/useEmployerData";
import { useAuth } from "@/hooks/useAuth";
import { employerAPI } from "@/services/api";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/config";

export default function CompanyInfoPage() {
  const { user } = useAuth();
  const { data: employerData, loading, error, refetch } = useEmployerData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    website: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    logo: ""
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (employerData) {
      const profile = employerData.profile;
      setFormData({
        companyName: employerData.company_name || "",
        industry: profile?.industry || "",
        companySize: profile?.company_size || "",
        foundedYear: profile?.founded_year?.toString() || "",
        website: profile?.website_url || "",
        phone: profile?.phone || "",
        description: profile?.about_company || "",
        address: profile?.address || "",
        city: profile?.city || "",
        state: profile?.state || "",
        zipCode: profile?.zip_code || "",
        logo: profile?.logo || ""
      });
      
      if (employerData.company_logo) {
        setFormData(prev => ({
          ...prev,
          logo: `${process.env.NEXT_PUBLIC_API_URL }/api/file/company-logo/${employerData.id}?t=${Date.now()}`
        }));
      }
    }
  }, [employerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('companyLogo', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/api/user/company-logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          logo: `${process.env.NEXT_PUBLIC_API_URL }/api/file/company-logo/${employerData?.id}?t=${Date.now()}`
        }));
        window.location.reload();
        toast.success('Company logo updated successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      let logoUrl = formData.logo;
      

      
      const profileData = {
        company_name: formData.companyName,
        profile: {
          company_name: formData.companyName,
          industry: formData.industry,
          company_size: formData.companySize,
          founded_year: formData.foundedYear,
          website_url: formData.website,
          phone: formData.phone,
          about_company: formData.description,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          logo: logoUrl
        }
      };
      
      const response = await employerAPI.updateProfile(profileData);
      
      if (response.success) {
        toast.success(response.message || "Company profile updated successfully!");
        setIsEditing(false);
        await refetch();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading company information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading company information</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Information</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company profile and details</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 shadow-lg flex items-center justify-center overflow-hidden">
                {formData.logo ? (
                  <img src={formData.logo} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 z-10">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button 
                    type="button"
                    size="sm" 
                    className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const input = document.getElementById('logo-upload') as HTMLInputElement;
                      input?.click();
                    }}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formData.companyName || "Company Name"}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{formData.phone || "Phone not provided"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{formData.city || "Location not provided"}</span>
                </div>
                {formData.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{formData.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Company Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Input
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">About Company</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              rows={4}
              placeholder="Tell us about your company..."
            />
          </div>
          
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
