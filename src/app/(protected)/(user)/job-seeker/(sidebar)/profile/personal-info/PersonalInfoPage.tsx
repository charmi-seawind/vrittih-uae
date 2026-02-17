"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Loader2, Upload } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { toast } from "sonner";

const PersonalInfoPage = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const { percentage } = useProfileCompletion();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    bio: "",
    profileImage: "/avatar-placeholder.png",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
    nationality: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      const [firstName = "", lastName = ""] = (profile.full_name || "").split(" ", 2);
      setFormData({
        firstName,
        lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
        email: profile.email || "",
        phone: profile.mobile || "",
        location: profile.location || "",
        dateOfBirth: profile.date_of_birth || "",
        bio: profile.bio || "",
        profileImage: profile.profile_image ? `${process.env.NEXT_PUBLIC_API_URL}/api/file/profile-image/${profile.id}` : "/avatar-placeholder.png"
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobile: formData.phone,
        location: formData.location,
        date_of_birth: formData.dateOfBirth,
        bio: formData.bio,
        profile_image: profile.profile_image
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: "profile-update" });
    } catch (error) {
      toast.error("Failed to update profile. Please try again.", { id: "profile-update" });
    }
  };

  const handleCancel = () => {
    if (profile) {
      const [firstName = "", lastName = ""] = (profile.full_name || "").split(" ", 2);
      setFormData({
        firstName,
        lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
        email: profile.email || "",
        phone: profile.mobile || "",
        location: profile.location || "",
        dateOfBirth: profile.date_of_birth || "",
        bio: profile.bio || "",
        profileImage: profile.profile_image ? `${process.env.NEXT_PUBLIC_API_URL}/api/file/profile-image/${profile.id}` : "/avatar-placeholder.png"
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('profileImage', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (response.ok) {
        const result = await response.json();
        // Update the form data with new image URL
        setFormData(prev => ({
          ...prev,
          profileImage: `${process.env.NEXT_PUBLIC_API_URL}/api/file/profile-image/${profile?.id}?t=${Date.now()}`
        }));
        // Refresh profile data to get updated profile_image field
        window.location.reload();
        toast.success('Profile image updated successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading profile: {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal Information</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal details and contact information</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {formData.profileImage && formData.profileImage !== '/avatar-placeholder.png' ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                    {(formData.firstName[0] || 'U')}{(formData.lastName[0] || 'N')}
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 z-10">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <Button 
                    type="button"
                    size="sm" 
                    className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const input = document.getElementById('profile-image-upload') as HTMLInputElement;
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
                {formData.firstName} {formData.lastName}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{formData.location}</span>
                </div>
              </div>
              <Badge variant="secondary" className="mt-2">
                Profile {percentage}% Complete
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
          

       
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave} 
                className="flex items-center gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoPage;