"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import QuickFix from "@/components/QuickFix";

const ProfileOverview = () => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-3">
          <CardTitle className="text-base sm:text-lg">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="flex items-center justify-center h-24 sm:h-32">
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="h-full">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-3">
          <CardTitle className="text-base sm:text-lg">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-center text-gray-500 py-6 sm:py-8">
            <User className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm sm:text-base">Complete your profile to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-3">
        <CardTitle className="text-base sm:text-lg">Profile Overview</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 shrink-0">
            <AvatarImage src={profile.profile_image || "/avatar-placeholder.png"} />
            <AvatarFallback className="text-sm sm:text-lg font-bold bg-blue-500 text-white">
              {profile.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-lg truncate">{profile.full_name || "Complete your profile"}</h3>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-1">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-xs sm:text-sm">
          {profile.mobile && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-3 h-3 shrink-0" />
              <span className="truncate">{profile.mobile}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
          )}
          {profile.date_of_birth && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="truncate">{new Date(profile.date_of_birth).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {profile.bio && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              {profile.bio.length > 100 ? profile.bio.substring(0, 100) + '...' : profile.bio}
            </p>
          </div>
        )}
        
   
      
        
        <QuickFix />

      

      </CardContent>
    </Card>
  );
};

export default ProfileOverview;