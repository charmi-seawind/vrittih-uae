"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Code, Camera, Target } from "lucide-react";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

const getFieldIcon = (key: string) => {
  const icons: Record<string, React.ReactNode> = {
    basic_info: <User className="w-4 h-4" />,
    location: <MapPin className="w-4 h-4" />,
    bio: <Mail className="w-4 h-4" />,
    education: <GraduationCap className="w-4 h-4" />,
    experience: <Briefcase className="w-4 h-4" />,
    skills: <Code className="w-4 h-4" />,
    profile_image: <Camera className="w-4 h-4" />
  };
  return icons[key] || <Circle className="w-4 h-4" />;
};

const ProfileCompletion = () => {
  const {
    percentage,
    completedFields,
    incompleteFields,
    completedCount,
    totalFields,
    score,
    loading,
    completionLevel,
    nextAction
  } = useProfileCompletion();



  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-3">
          <CardTitle className="text-base sm:text-lg">Profile Completion</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }



  return (
    <Card className="h-full">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Profile Completion</CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={completionLevel.color === 'green' ? "default" : 
                      completionLevel.color === 'blue' ? "secondary" : 
                      completionLevel.color === 'yellow' ? "outline" : "destructive"}
              className="text-xs"
            >
              {percentage}%
            </Badge>
            <Badge variant="outline" className="text-xs">
              {completedCount}/{totalFields}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
         
          <Progress value={percentage} className="h-3" />
          <p className="text-xs text-gray-600">
            {completionLevel.message}
          </p>
        </div>




      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;