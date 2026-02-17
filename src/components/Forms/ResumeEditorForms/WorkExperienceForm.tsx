import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ResumeEditorFormShell from "./ResumeEditorFormShell";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { workExperienceSchema, WorkExperienceValues } from "@/schema/ResumeEditorSchema";

const WorkExperienceForm = forwardRef(({
  resumeData,
  setResumeData,
}: any, ref) => {
  const [experiences, setExperiences] = useState(resumeData.experience || []);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    achievements: "",
  });
  
  // Sync with parent resumeData when it changes
  useEffect(() => {
    setExperiences(resumeData.experience || []);
  }, [resumeData.experience]);
  
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: formData,
    values: formData,
    mode: "onChange",
  });

  // Update form data whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as any);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: WorkExperienceValues) => {
    // Check for duplicate work experience entry
    const isDuplicate = experiences.some((experience: any) => 
      experience.jobTitle.toLowerCase() === data.jobTitle.toLowerCase() &&
      experience.company.toLowerCase() === data.company.toLowerCase()
    );

    if (isDuplicate) {
      form.setError("jobTitle", {
        type: "manual",
        message: "This work experience record already exists"
      });
      return;
    }

    // Convert achievements from comma-separated string to array
    const formattedData = {
      ...data,
      achievements: data.achievements
        ? data.achievements.split(",").map((item: string) => item.trim()).filter((item: string) => item.length > 0)
        : [],
    };

    const newExperiences = [...experiences, formattedData];
    setExperiences(newExperiences);
    setResumeData({
      ...resumeData,
      experience: newExperiences,
    });
    // Reset form and all local state variables
    const resetData = {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
      achievements: "",
    };
    setFormData(resetData);
    form.reset(resetData);
    setStartYear("");
    setEndYear("");
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_: any, i: number) => i !== index);
    setExperiences(updatedExperiences);
    setResumeData({
      ...resumeData,
      experience: updatedExperiences,
    });
  };

  useImperativeHandle(ref, () => ({
    getValues: () => form.getValues(),
  }));

  return (
    <ResumeEditorFormShell
    //  title="Work Experience"
    //  description="Share your professional experience"
     >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Job Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter job title" 
                      className="h-10 sm:h-11 text-xs sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Company <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter company name" 
                      className="h-10 sm:h-11 text-xs sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Company Location <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter company location" 
                    className="h-10 sm:h-11 text-xs sm:text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => {
                const updateDate = (y: string) => {
                  if (y) {
                    const date = `${y}-01-01`;
                    field.onChange(date);
                    setStartYear(y);
                  } else {
                    field.onChange('');
                    setStartYear('');
                  }
                };
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Start Year <span className="text-red-500">*</span></FormLabel>
                    <Select value={startYear} onValueChange={updateDate}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                );
              }}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => {
                const updateDate = (y: string) => {
                  if (y) {
                    const date = `${y}-01-01`;
                    field.onChange(date);
                    setEndYear(y);
                  } else {
                    field.onChange('');
                    setEndYear('');
                  }
                };
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">End Year</FormLabel>
                    <Select value={endYear} onValueChange={updateDate} disabled={form.watch("currentlyWorking")}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="currentlyWorking"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 sm:gap-3">
                <FormControl>
                  <input 
                    type="checkbox" 
                    checked={field.value} 
                    onChange={field.onChange} 
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </FormControl>
                <FormLabel className="text-sm sm:text-base font-medium cursor-pointer">Currently Working Here</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Description <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Describe your role, responsibilities, and achievements" 
                    className="resize-none min-h-[80px] sm:min-h-[100px]  text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="achievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Achievements</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter achievements separated by commas (e.g., Achievement 1, Achievement 2)"
                    className="resize-none min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium">
            Add Experience
          </Button>
        </form>
      </Form>
      
      {experiences.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Added Work Experience</h3>
          <div className="space-y-3 sm:space-y-4">
            {experiences.map((experience: any, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow relative group"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{experience.jobTitle}</h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-1">{experience.company}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{experience.location}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    {new Date(experience.startDate).getFullYear()} - {experience.currentlyWorking ? "Present" : new Date(experience.endDate).getFullYear()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{experience.description}</p>

                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Achievements:</p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                        {experience.achievements.map((ach: string, i: number) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeExperience(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ResumeEditorFormShell>
  );
});

// Validation function to check if work experience section is complete
export const validateWorkExperienceSection = (resumeData: any) => {
  // Check if at least one work experience entry is added
  if (!resumeData.experience || resumeData.experience.length === 0) {
    return {
      isValid: false,
      message: "Please add at least one work experience entry before proceeding to next step"
    };
  }
  
  return {
    isValid: true,
    message: ""
  };
};

export default WorkExperienceForm;
