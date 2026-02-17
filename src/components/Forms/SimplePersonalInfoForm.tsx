"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Loader2 } from "lucide-react";
import DualOtpVerification from "./DualOtpVerification";
import { ResumeValues } from "@/schema/ResumeEditorSchema";

interface SimplePersonalInfoFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  showOtpVerification: boolean;
  onOtpSuccess: () => void;
  pendingUserId: string | null;
}

const jobCategories = ["IT / Software", "Sales & Marketing", "Accounting", "Admin / Back Office", "Technician", "HR / Recruiter", "Construction", "Design / Creative"];

const SimplePersonalInfoForm = ({ resumeData, setResumeData, showOtpVerification, onOtpSuccess, pendingUserId }: SimplePersonalInfoFormProps) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [showSalaryFields, setShowSalaryFields] = useState(
    !!(resumeData.expectedSalary || resumeData.currentSalary)
  );
  const [countryCode, setCountryCode] = useState("+971");

  const countries = [
    { code: "+971", flag: "https://flagcdn.com/w20/ae.png", name: "UAE" },
    { code: "+91", flag: "https://flagcdn.com/w20/in.png", name: "India" },
    { code: "+1", flag: "https://flagcdn.com/w20/us.png", name: "USA" },
    { code: "+44", flag: "https://flagcdn.com/w20/gb.png", name: "UK" },
    { code: "+966", flag: "https://flagcdn.com/w20/sa.png", name: "Saudi Arabia" },
    { code: "+974", flag: "https://flagcdn.com/w20/qa.png", name: "Qatar" },
    { code: "+965", flag: "https://flagcdn.com/w20/kw.png", name: "Kuwait" },
    { code: "+968", flag: "https://flagcdn.com/w20/om.png", name: "Oman" },
    { code: "+973", flag: "https://flagcdn.com/w20/bh.png", name: "Bahrain" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - 18 - i);

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (!resumeData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (resumeData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z]+$/.test(resumeData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters';
    }
    
    if (!resumeData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (resumeData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z]+$/.test(resumeData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters';
    }
    
    if (!resumeData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!resumeData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (resumeData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!resumeData.dob?.trim()) newErrors.dob = 'Birth year is required';
    if (!resumeData.city?.trim()) {
      newErrors.city = 'Location is required';
    }
    if (!resumeData.jobTitle?.trim()) newErrors.jobTitle = 'Job title is required';
    if (!resumeData.jobCategory?.trim()) newErrors.jobCategory = 'Job category is required';
    
    setErrors(newErrors);
    setShowErrors(true);
    return Object.keys(newErrors).length === 0;
  };

  // Update showSalaryFields when resumeData changes
  React.useEffect(() => {
    setShowSalaryFields(!!(resumeData.expectedSalary || resumeData.currentSalary));
  }, [resumeData.expectedSalary, resumeData.currentSalary]);

  // Expose validation function to parent
  React.useEffect(() => {
    (window as any).validatePersonalInfo = validateFields;
  }, [resumeData]);

  const handleGeoLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `/api/geocode?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            if (data.location) {
              setResumeData({ ...resumeData, city: data.location });
            } else {
              const location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
              setResumeData({ ...resumeData, city: location });
            }
          } catch (error) {
            const location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            setResumeData({ ...resumeData, city: location });
          } finally {
            setIsDetectingLocation(false);
          }
        },
        () => {
          setIsDetectingLocation(false);
        }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  if (showOtpVerification) {
    return (
      <DualOtpVerification
        email={resumeData.email || ""}
        mobile={resumeData.phone || ""}
        pendingUserId={pendingUserId}
        onSuccess={onOtpSuccess}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name <span className="text-red-500">*</span></Label>
          <Input
            value={resumeData.firstName}
            onChange={(e) => {
              const value = e.target.value;
              setResumeData({ ...resumeData, firstName: value });
              if (value.trim() && value.trim().length >= 2 && /^[a-zA-Z]+$/.test(value.trim())) {
                clearFieldError('firstName');
              }
            }}
            placeholder="Enter first name"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          <div className=" ">
            {showErrors && errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>
        </div>
        <div>
          <Label>Last Name <span className="text-red-500">*</span></Label>
          <Input
            value={resumeData.lastName}
            onChange={(e) => {
              const value = e.target.value;
              setResumeData({ ...resumeData, lastName: value });
              if (value.trim() && value.trim().length >= 2 && /^[a-zA-Z]+$/.test(value.trim())) {
                clearFieldError('lastName');
              }
            }}
            placeholder="Enter last name"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          <div className="">
            {showErrors && errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Email <span className="text-red-500">*</span></Label>
          <Input
            type="email"
            value={resumeData.email}
            onChange={(e) => {
              const value = e.target.value;
              setResumeData({ ...resumeData, email: value });
              if (value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                clearFieldError('email');
              }
            }}
            placeholder="Enter email"
            className={errors.email ? 'border-red-500' : ''}
          />
          {showErrors && errors.email ? (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          ) : (
            <p className="text-sm text-gray-600 mt-1">
              Enter Email Address on which OTP will come
            </p>
          )}
        </div>
        <div>
          <Label>Phone <span className="text-red-500">*</span></Label>
          <div className="flex">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className={`w-[120px] rounded-r-none border-r-0 ${errors.phone ? 'border-red-500' : ''}`}>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <img src={countries.find(c => c.code === countryCode)?.flag} alt="" className="w-5 h-4" />
                    <span>{countryCode}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <img src={country.flag} alt={country.name} className="w-5 h-4" />
                      <span>{country.code}</span>
                      <span className="text-gray-500 text-xs">({country.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="tel"
              maxLength={10}
              value={resumeData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setResumeData({ ...resumeData, phone: value });
                if (value.length === 10) {
                  clearFieldError('phone');
                }
              }}
              placeholder="Enter 10 digit phone"
              className={`flex-1 rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
            />
          </div>
          {showErrors && errors.phone ? (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          ) : (
            <p className="text-sm text-gray-600 mt-1">
              Enter Phone number on which OTP will come
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Birth Year <span className="text-red-500">*</span></Label>
          <Select value={resumeData.dob} onValueChange={(value) => {
            setResumeData({ ...resumeData, dob: value });
            if (value) {
              clearFieldError('dob');
            }
          }}>
            <SelectTrigger className={errors.dob ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select birth year" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-2 md:h-5 mt-1">
            {showErrors && errors.dob ? (
              <p className="text-xs text-red-500">{errors.dob}</p>
            ) : (
              <p className="text-sm text-gray-600">
                Your Age should be 18+
              </p>
            )}
          </div>
        </div>
        <div>
          <Label>Current Location <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              value={resumeData.city}
              onChange={(e) => {
                const value = e.target.value;
                setResumeData({ ...resumeData, city: value });
                if (value.trim()) {
                  clearFieldError('city');
                }
              }}
              placeholder="Enter your city or complete address"
              className={`pr-10 ${errors.city ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={handleGeoLocation}
              disabled={isDetectingLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isDetectingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              ) : (
                <MapPin className="h-4 w-4 text-gray-500 hover:text-primary" />
              )}
            </button>
          </div>
          <div className=" h-2 md:h-5 mt-1">
            {showErrors && errors.city ? (
              <p className="text-xs text-red-500">{errors.city}</p>
            ) : (
              <p className="text-sm text-gray-600">
                Enter city or full address. Click 📍 to auto-detect
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Job Title <span className="text-red-500 mt-7 md:mt-0">*</span></Label>
          <Input
            value={resumeData.jobTitle}
            onChange={(e) => {
              const value = e.target.value;
              setResumeData({ ...resumeData, jobTitle: value });
              if (value.trim()) {
                clearFieldError('jobTitle');
              }
            }}
            placeholder="e.g. Software Developer"
            className={errors.jobTitle ? 'border-red-500' : ''}
          />
          <div className=" ">
            {showErrors && errors.jobTitle && (
              <p className="text-xs text-red-500">{errors.jobTitle}</p>
            )}
          </div>
        </div>
        <div>
          <Label>Job Category <span className="text-red-500">*</span></Label>
          <Select value={resumeData.jobCategory} onValueChange={(value) => {
            setResumeData({ ...resumeData, jobCategory: value });
            if (value) {
              clearFieldError('jobCategory');
            }
          }}>
            <SelectTrigger className={errors.jobCategory ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {jobCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className=" h-2 md:h-5 mt-1">
            {showErrors && errors.jobCategory && (
              <p className="text-xs text-red-500">{errors.jobCategory}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="salary-checkbox"
            checked={showSalaryFields}
            onCheckedChange={(checked) => {
              setShowSalaryFields(!!checked);
              if (!checked) {
                // Clear salary fields when unchecked
                setResumeData({ ...resumeData, expectedSalary: '', currentSalary: '' });
              }
            }}
          />
          <Label htmlFor="salary-checkbox" className="text-sm font-medium cursor-pointer">
            Add salary information (Optional)
          </Label>
        </div>
        
        {showSalaryFields && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Expected Salary (Optional)</Label>
              <Input
                value={resumeData.expectedSalary || ''}
                onChange={(e) => setResumeData({ ...resumeData, expectedSalary: e.target.value })}
                placeholder="e.g. 5,00,000 per annum"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter your expected salary
              </p>
            </div>
            <div>
              <Label>Current Salary (Optional)</Label>
              <Input
                value={resumeData.currentSalary || ''}
                onChange={(e) => setResumeData({ ...resumeData, currentSalary: e.target.value })}
                placeholder="e.g. 4,00,000 per annum"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter your current salary
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePersonalInfoForm;