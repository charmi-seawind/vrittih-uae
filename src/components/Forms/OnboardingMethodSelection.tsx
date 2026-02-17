"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Edit, Sparkles, FileText } from "lucide-react";
import { FaBriefcase } from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";

interface OnboardingMethodSelectionProps {
  onSelectMethod: (method: "ai" | "manual") => void;
}

const OnboardingMethodSelection = ({
  onSelectMethod,
}: OnboardingMethodSelectionProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="flex items-center justify-center gap-3 italic text-center text-[30px] font-medium tracking-wide text-white mb-6">
        Your next career move starts here.
      </h1>
      <div className="text-center space-y-2">
        <p className="text-white">
          Choose how you'd like to create your profile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
          onClick={() => onSelectMethod("ai")}
        >
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center text-lg md:text-xl">
              AI-Assisted Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
            <p className="text-center text-xs md:text-sm text-muted-foreground">
              Complete your profile in 60 Seconds
            </p>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Upload your existing CV</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-600 mt-0.5" />
                <span>AI extracts all information</span>
              </li>
              <li className="flex items-start gap-2">
                <Edit className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Review and edit if needed</span>
              </li>
            </ul>
            <Button className="w-full text-sm md:text-base" size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload CV
            </Button>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
          onClick={() => onSelectMethod("manual")}
        >
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Edit className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center text-lg md:text-xl">
              Manual Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
            <p className="text-center text-xs md:text-sm text-muted-foreground">
              Fill in your details step by step!
            </p>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <Edit className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Enter details manually</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Step-by-step guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <Upload className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Upload CV later</span>
              </li>
            </ul>
            <Button className="w-full text-sm md:text-base" size="lg">
              <Edit className="w-4 h-4 mr-2" />
              Enter Manually
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingMethodSelection;
