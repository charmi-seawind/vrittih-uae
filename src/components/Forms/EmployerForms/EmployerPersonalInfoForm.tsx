"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployerData {
  fullName: string;
  email: string;
  companyName: string;
  companySize: string;
  is_consultancy: boolean;
  industry: string;
}

interface EmployerPersonalInfoFormProps {
  employerData: EmployerData;
  setEmployerData: (data: EmployerData) => void;
}

const EmployerPersonalInfoForm = ({
  employerData,
  setEmployerData,
}: EmployerPersonalInfoFormProps) => {
  const handleInputChange = (field: keyof EmployerData, value: string | boolean) => {
    setEmployerData({
      ...employerData,
      [field]: value,
    });
  };

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Other",
  ];

  return (
    <Card className="shadow-md rounded-2xl border border-gray-200">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={employerData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              value={employerData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Enter your company name"
              required
            />
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <Label htmlFor="companySize" className="text-sm font-medium text-gray-700">
              Company Size <span className="text-red-500">*</span>
            </Label>
            <Select
              value={employerData.companySize}
              onValueChange={(value) => handleInputChange("companySize", value)}
            >
              <SelectTrigger id="companySize">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={employerData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
              Industry <span className="text-red-500">*</span>
            </Label>
            <Select
              value={employerData.industry}
              onValueChange={(value) => handleInputChange("industry", value)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


        </div>
      </CardContent>
    </Card>
  );
};

export default EmployerPersonalInfoForm;
