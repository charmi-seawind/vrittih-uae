"use client";

import { CheckCircle, User, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SavedDataIndicatorProps {
  userBasicInfo: {
    full_name: string;
    email: string;
    mobile: string;
  };
  onContinue: () => void;
  onEdit: () => void;
}

const SavedDataIndicator = ({ userBasicInfo, onContinue, onEdit }: SavedDataIndicatorProps) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">
            Your Information is Already Saved
          </h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Name:</span>
            <span>{userBasicInfo.full_name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Email:</span>
            <span>{userBasicInfo.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Mobile:</span>
            <span>{userBasicInfo.mobile}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={onContinue} className="flex-1">
            Continue to Next Step
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit Information
          </Button>
        </div>
        
        <p className="text-xs text-gray-600 mt-3 text-center">
          Your email and mobile have been verified. You can proceed to complete your profile.
        </p>
      </CardContent>
    </Card>
  );
};

export default SavedDataIndicator;