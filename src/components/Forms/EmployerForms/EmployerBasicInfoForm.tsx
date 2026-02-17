"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "Singapore" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" }
];



interface EmployerBasicInfoFormProps {
  employerData: {
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
  };
  setEmployerData: (data: any) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

const EmployerBasicInfoForm = ({ employerData, setEmployerData, errors = {}, onClearError }: EmployerBasicInfoFormProps) => {
  const [countryCode, setCountryCode] = useState(() => {
    if (employerData.phone) {
      const match = employerData.phone.match(/^(\+\d{1,4})/);
      return match ? match[1] : "+91";
    }
    return "+91";
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (employerData.phone) {
      const match = employerData.phone.match(/^\+\d{1,4}(.*)/);
      return match ? match[1] : employerData.phone;
    }
    return "";
  });

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = value.replace(/<script[^>]*>.*?<\/script>/gi, '')
                               .replace(/javascript:/gi, '')
                               .replace(/on\w+=/gi, '');
    setEmployerData({ ...employerData, [field]: sanitizedValue });
    if (onClearError && errors[field]) {
      onClearError(field);
    }
  };

  const handlePhoneChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(sanitizedValue);
    const fullPhone = countryCode + sanitizedValue;
    handleInputChange("phone", fullPhone);
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    const fullPhone = value + phoneNumber;
    handleInputChange("phone", fullPhone);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            value={employerData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            className={errors.fullName ? "border-red-500 focus:border-red-500" : ""}
            required
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={employerData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="your.email@company.com"
            className={errors.email ? "border-red-500 focus:border-red-500" : ""}
            required
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Select value={countryCode} onValueChange={handleCountryCodeChange}>
              <SelectTrigger className={`w-32 ${errors.phone ? "border-red-500" : ""}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.code} {country.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Enter phone number"
              className={`flex-1 ${errors.phone ? "border-red-500 focus:border-red-500" : ""}`}
              required
            />
          </div>
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            value={employerData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="Enter company name"
            className={errors.companyName ? "border-red-500 focus:border-red-500" : ""}
            required
          />
          {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
        </div>
      </div>
    </div>
  );
};

export default EmployerBasicInfoForm;
