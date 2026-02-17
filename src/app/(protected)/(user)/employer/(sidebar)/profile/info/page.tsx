"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, Edit3, X, Loader2, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useEmployerData } from "@/hooks/useEmployerData";
import { employerAPI, authAPI } from "@/services/api";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/config";

export default function ProfileInfoPage() {
  const { data: employerData, loading, error, refetch } = useEmployerData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePhoto: ""
  });
  
  const [uploading, setUploading] = useState(false);
  
  const [originalEmail, setOriginalEmail] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  useEffect(() => {
    if (employerData) {
      const email = employerData.email || "";
      setFormData({
        fullName: employerData.full_name || "",
        email: email,
        phone: employerData.profile?.phone || "",
        profilePhoto: employerData.profile?.profile_photo || ""
      });
      
      if (employerData.profile_image) {
        setFormData(prev => ({
          ...prev,
          profilePhoto: `${process.env.NEXT_PUBLIC_API_URL }/api/file/profile-image/${employerData.id}?t=${Date.now()}`
        }));
      }
      setOriginalEmail(email);
    }
  }, [employerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('profileImage', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/api/user/profile-image`, {
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
          profilePhoto: `${process.env.NEXT_PUBLIC_API_URL }/api/file/profile-image/${employerData?.id}?t=${Date.now()}`
        }));
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

  const handleSubmit = async () => {
    // Check if email has changed
    if (formData.email !== originalEmail) {
      // Send OTP for email verification
      await sendOtpForEmailVerification();
    } else {
      // Update profile without email verification
      await updateProfile();
    }
  };

  const sendOtpForEmailVerification = async () => {
    try {
      setIsSendingOtp(true);
      const cleanEmail = formData.email.replace(/^mailto:/g, '');
      await authAPI.resendEmployerOtp(cleanEmail, 'email_update');
      setShowOtpVerification(true);
      toast.success("OTP sent to your new email address");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtpAndUpdate = async () => {
    try {
      setIsVerifyingOtp(true);
      
      const cleanEmail = formData.email.replace(/^mailto:/g, '');
      await authAPI.verifyEmailOtp(cleanEmail, otp);
      await updateProfile();
      setShowOtpVerification(false);
      setOtp("");
      toast.success("Email updated successfully!");
    } catch (error) {
      toast.error("OTP verification failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const updateProfile = async () => {
    try {
      setIsSubmitting(true);
      
      let photoUrl = formData.profilePhoto;
      

      
      const response = await employerAPI.updateProfile({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        profile: {
          phone: formData.phone,
          profile_photo: photoUrl
        }
      });
      
      if (response.success) {
        toast.success(response.message || "Profile updated successfully!");
        setIsEditing(false);
        setOriginalEmail(formData.email);
        
        // Update user data in localStorage and force page reload
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.email = formData.email;
        localStorage.setItem('user', JSON.stringify(user));
        
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
          <span>Loading profile information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading profile</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Information</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal profile details</p>
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

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 shadow-lg flex items-center justify-center overflow-hidden">
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Profile Photo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded">
                    <User className="w-12 h-12 text-white" />
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
                {formData.fullName || "User Name"}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{formData.email || "Email not provided"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{formData.phone || "Phone not provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

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
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50 dark:bg-gray-800" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
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

      {/* OTP Verification Modal */}
      {showOtpVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center">Verify New Email</CardTitle>
              <p className="text-center text-gray-600 text-sm">
                We've sent a verification code to {formData.email}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowOtpVerification(false);
                    setOtp("");
                  }}
                  className="flex-1"
                  disabled={isVerifyingOtp}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={verifyOtpAndUpdate}
                  disabled={isVerifyingOtp || otp.length !== 6}
                  className="flex-1"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Update"
                  )}
                </Button>
              </div>
              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={sendOtpForEmailVerification}
                  disabled={isSendingOtp}
                  className="text-sm"
                >
                  {isSendingOtp ? "Sending..." : "Resend OTP"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
