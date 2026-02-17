"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  phone: string;
  position: string;
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  description: string;
  foundedYear: string;
  is_consultancy: boolean;
  job_title: string;
  job_category: string;
  job_type: string;
  work_location_type: string;
  office_address: string;
  pay_type: string;
  pay_amount: string;
  additional_perks: string;
  joining_fee_required: boolean;
  job_description: string;
  is_walk_in: boolean;
  application_email: string;
  walk_in_address?: string;
  walk_in_start_date?: string;
  walk_in_end_date?: string;
  walk_in_timing?: string;
  walk_in_instructions?: string;
  // Profile completion fields
  founded_year: number;
  website_url: string;
  about_company: string;
  zip_code: string;
  minimum_education: string;
  language_required: string;
  experience_required: string;
  additional_requirements: string;
  required_skills: string[];
}

interface JobDetailsFormProps {
  employerData: EmployerData;
  setEmployerData: (data: EmployerData) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

const JobDetailsForm = ({ employerData, setEmployerData, errors = {}, onClearError }: JobDetailsFormProps) => {
  const [skills, setSkills] = useState<any[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  useEffect(() => {
    // Load skills from public/skills.json
    fetch('/skills.json')
      .then(response => response.json())
      .then(data => setSkills(data))
      .catch(error => console.error('Error loading skills:', error));
  }, []);

  useEffect(() => {
    if (skillInput.trim() && skills.length > 0) {
      const filtered = skills.filter(skill => 
        skill.skill.toLowerCase().includes(skillInput.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions
      setFilteredSkills(filtered);
      setShowSkillDropdown(true);
    } else {
      setShowSkillDropdown(false);
    }
  }, [skillInput, skills]);

  const handleInputChange = (field: keyof EmployerData, value: string | boolean | string[]) => {
    const sanitizedValue = typeof value === 'string' ? 
      value.replace(/<script[^>]*>.*?<\/script>/gi, '')
           .replace(/javascript:/gi, '')
           .replace(/on\w+=/gi, '') : value;
    setEmployerData({
      ...employerData,
      [field]: sanitizedValue,
    });
    if (onClearError && errors[field as string]) {
      onClearError(field as string);
    }
  };

  const addSkill = (skillName: string) => {
    const currentSkills = employerData.required_skills || [];
    if (!currentSkills.includes(skillName)) {
      handleInputChange('required_skills', [...currentSkills, skillName]);
    }
    setSkillInput("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = employerData.required_skills || [];
    handleInputChange('required_skills', currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  return (
    <Card className="shadow-md rounded-2xl border border-gray-200">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="job_title" className="text-sm font-medium text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="job_title"
              value={employerData.job_title}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
              placeholder="e.g., Software Developer"
              className={errors.job_title ? "border-red-500" : ""}
              required
            />
            {errors.job_title && <p className="text-sm text-red-500">{errors.job_title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_category" className="text-sm font-medium text-gray-700">
              Job Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={employerData.job_category}
              onValueChange={(value) => handleInputChange("job_category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Content Writer">Content Writer</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Jr.Web Developer">Jr.Web Developer</SelectItem>
                <SelectItem value="Sr.Web Developer">Sr.Web Developer</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Human Resource">Human Resource</SelectItem>
                <SelectItem value="HR Executive">HR Executive</SelectItem>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_type" className="text-sm font-medium text-gray-700">
              Job Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={employerData.job_type}
              onValueChange={(value) => handleInputChange("job_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="work_location_type" className="text-sm font-medium text-gray-700">
              Work Location Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={employerData.work_location_type}
              onValueChange={(value) => handleInputChange("work_location_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="office_address" className="text-sm font-medium text-gray-700">
              Office Address
            </Label>
            <Input
              id="office_address"
              value={employerData.office_address}
              onChange={(e) => handleInputChange("office_address", e.target.value)}
              placeholder="e.g., Mumbai Office"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pay_type" className="text-sm font-medium text-gray-700">
              Pay Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={employerData.pay_type}
              onValueChange={(value) => handleInputChange("pay_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pay type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed">Fixed</SelectItem>
                <SelectItem value="Range">Range</SelectItem>
                <SelectItem value="Negotiable">Negotiable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pay_amount" className="text-sm font-medium text-gray-700">
              Pay Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pay_amount"
              value={employerData.pay_amount}
              onChange={(e) => handleInputChange("pay_amount", e.target.value)}
              placeholder="e.g., 50000"
              className={errors.pay_amount ? "border-red-500" : ""}
              required
            />
            {errors.pay_amount && <p className="text-sm text-red-500">{errors.pay_amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_email" className="text-sm font-medium text-gray-700">
              Application Email
            </Label>
            <Input
              id="application_email"
              type="email"
              value={employerData.application_email}
              onChange={(e) => handleInputChange("application_email", e.target.value)}
              placeholder="hr@company.com"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="additional_perks" className="text-sm font-medium text-gray-700">
              Additional Perks
            </Label>
            <Input
              id="additional_perks"
              value={employerData.additional_perks}
              onChange={(e) => handleInputChange("additional_perks", e.target.value)}
              placeholder="e.g., Health insurance, Flexible hours"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="job_description" className="text-sm font-medium text-gray-700">
              Job Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="job_description"
              value={employerData.job_description}
              onChange={(e) => handleInputChange("job_description", e.target.value)}
              placeholder="Describe the job responsibilities and requirements..."
              rows={4}
              className={errors.job_description ? "border-red-500" : ""}
              required
            />
            {errors.job_description && <p className="text-sm text-red-500">{errors.job_description}</p>}
          </div>

          {/* Required Skills Section */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="required_skills" className="text-sm font-medium text-gray-700">
              Required Skills
            </Label>
            <div className="relative">
              <Input
                id="required_skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleSkillInputKeyPress}
                placeholder="Type to search and add skills..."
              />
              {showSkillDropdown && filteredSkills.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => addSkill(skill.skill)}
                    >
                      {skill.skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Display selected skills */}
            {employerData.required_skills && employerData.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {employerData.required_skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Requirements Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minimum_education" className="text-sm font-medium text-gray-700">
                  Minimum Education <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={employerData.minimum_education}
                  onValueChange={(value) => handleInputChange("minimum_education", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">10th</SelectItem>
                    <SelectItem value="12th">12th</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                    <SelectItem value="Any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language_required" className="text-sm font-medium text-gray-700">
                  Language Required <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Select
                    value={employerData.language_required.split(',')[0] || ''}
                    onValueChange={(value) => {
                      const currentLanguages = employerData.language_required ? employerData.language_required.split(',').map(l => l.trim()).filter(l => l) : [];
                      if (!currentLanguages.includes(value)) {
                        const newLanguages = [...currentLanguages, value].join(', ');
                        handleInputChange("language_required", newLanguages);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Dubai i">Dubai i</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Display selected languages */}
                  {employerData.language_required && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {employerData.language_required.split(',').map((lang, index) => {
                        const trimmedLang = lang.trim();
                        if (!trimmedLang) return null;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                          >
                            <span>{trimmedLang}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const languages = employerData.language_required.split(',').map(l => l.trim()).filter(l => l !== trimmedLang);
                                handleInputChange("language_required", languages.join(', '));
                              }}
                              className="text-green-600 hover:text-green-800"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_required" className="text-sm font-medium text-gray-700">
                  Experience Required <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={employerData.experience_required}
                  onValueChange={(value) => handleInputChange("experience_required", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fresher">Fresher</SelectItem>
                    <SelectItem value="0-1 years">0-1 years</SelectItem>
                    <SelectItem value="1-3 years">1-3 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="5+ years">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_requirements" className="text-sm font-medium text-gray-700">
                  Additional Requirements
                </Label>
                <Input
                  id="additional_requirements"
                  value={employerData.additional_requirements}
                  onChange={(e) => handleInputChange("additional_requirements", e.target.value)}
                  placeholder="Good communication"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              id="joining_fee_required"
              type="checkbox"
              checked={employerData.joining_fee_required}
              onChange={(e) => handleInputChange("joining_fee_required", e.target.checked)}
              className="h-5 w-5 accent-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />
            <Label htmlFor="joining_fee_required" className="text-sm font-medium text-gray-700">
              Joining fee required
            </Label>
          </div>

          <div className="flex items-center space-x-3 md:col-span-2">
            <input
              id="is_walk_in"
              type="checkbox"
              checked={employerData.is_walk_in}
              onChange={(e) => handleInputChange("is_walk_in", e.target.checked)}
              className="h-5 w-5 accent-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            />
            <Label htmlFor="is_walk_in" className="text-sm font-medium text-gray-700">
              Walk-in interview
            </Label>
          </div>

          {employerData.is_walk_in && (
            <>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="walk_in_address" className="text-sm font-medium text-gray-700">
                  Walk-in Address
                </Label>
                <Input
                  id="walk_in_address"
                  value={employerData.walk_in_address || ""}
                  onChange={(e) => handleInputChange("walk_in_address", e.target.value)}
                  placeholder="Walk-in interview address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="walk_in_start_date" className="text-sm font-medium text-gray-700">
                  Walk-in Start Date
                </Label>
                <Input
                  id="walk_in_start_date"
                  type="date"
                  value={employerData.walk_in_start_date || ""}
                  onChange={(e) => handleInputChange("walk_in_start_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="walk_in_end_date" className="text-sm font-medium text-gray-700">
                  Walk-in End Date
                </Label>
                <Input
                  id="walk_in_end_date"
                  type="date"
                  value={employerData.walk_in_end_date || ""}
                  onChange={(e) => handleInputChange("walk_in_end_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="walk_in_timing" className="text-sm font-medium text-gray-700">
                  Walk-in Timing
                </Label>
                <Input
                  id="walk_in_timing"
                  value={employerData.walk_in_timing || ""}
                  onChange={(e) => handleInputChange("walk_in_timing", e.target.value)}
                  placeholder="e.g., 10:00 AM - 5:00 PM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="walk_in_instructions" className="text-sm font-medium text-gray-700">
                  Walk-in Instructions
                </Label>
                <Textarea
                  id="walk_in_instructions"
                  value={employerData.walk_in_instructions || ""}
                  onChange={(e) => handleInputChange("walk_in_instructions", e.target.value)}
                  placeholder="Any special instructions for walk-in candidates"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailsForm;