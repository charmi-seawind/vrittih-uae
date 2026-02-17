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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { educationSchema, EducationValues } from "@/schema/ResumeEditorSchema";

const indianDegrees = {
  "10th (SSC/SSLC)": 0,
  "12th (HSC/Intermediate)": 2,
  "Diploma": 3,
  "ITI": 2,
  "B.A. (Bachelor of Arts)": 3,
  "B.Sc. (Bachelor of Science)": 3,
  "B.Com. (Bachelor of Commerce)": 3,
  "B.Tech. (Bachelor of Technology)": 4,
  "B.E. (Bachelor of Engineering)": 4,
  "BCA (Bachelor of Computer Applications)": 3,
  "BBA (Bachelor of Business Administration)": 3,
  "B.Pharm. (Bachelor of Pharmacy)": 4,
  "MBBS (Bachelor of Medicine and Bachelor of Surgery)": 5.5,
  "BDS (Bachelor of Dental Surgery)": 5,
  "BAMS (Bachelor of Ayurvedic Medicine and Surgery)": 5.5,
  "BHMS (Bachelor of Homeopathic Medicine and Surgery)": 5.5,
  "B.Ed. (Bachelor of Education)": 2,
  "LLB (Bachelor of Laws)": 3,
  "B.Arch. (Bachelor of Architecture)": 5,
  "B.Des. (Bachelor of Design)": 4,
  "M.A. (Master of Arts)": 2,
  "M.Sc. (Master of Science)": 2,
  "M.Com. (Master of Commerce)": 2,
  "M.Tech. (Master of Technology)": 2,
  "M.E. (Master of Engineering)": 2,
  "MCA (Master of Computer Applications)": 3,
  "MBA (Master of Business Administration)": 2,
  "M.Pharm. (Master of Pharmacy)": 2,
  "MD (Doctor of Medicine)": 3,
  "MS (Master of Surgery)": 3,
  "MDS (Master of Dental Surgery)": 3,
  "M.Ed. (Master of Education)": 2,
  "LLM (Master of Laws)": 1,
  "M.Arch. (Master of Architecture)": 2,
  "M.Des. (Master of Design)": 2,
  "Ph.D. (Doctor of Philosophy)": 3,
  "Other": 0
};

const EducationForm = forwardRef(({
  resumeData,
  setResumeData,
}: any, ref) => {
  const [educations, setEducations] = useState(resumeData.education || []);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  });
  
  // Sync with parent resumeData when it changes
  useEffect(() => {
    setEducations(resumeData.education || []);
  }, [resumeData.education]);
  
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
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

  const onSubmit = (data: EducationValues) => {
    // Check for duplicate education entry
    const isDuplicate = educations.some((education: any) => 
      education.degree.toLowerCase() === data.degree.toLowerCase() &&
      education.institution.toLowerCase() === data.institution.toLowerCase() &&
      new Date(education.startDate).getFullYear() === new Date(data.startDate).getFullYear() &&
      new Date(education.endDate).getFullYear() === new Date(data.endDate).getFullYear()
    );

    if (isDuplicate) {
      form.setError("degree", {
        type: "manual",
        message: "This education record already exists"
      });
      return;
    }

    const newEducations = [...educations, data];
    setEducations(newEducations);
    setResumeData({
      ...resumeData,
      education: newEducations,
    });
    // Reset form and all local state variables
    const resetData = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
    };
    setFormData(resetData);
    form.reset(resetData);
    setSelectedDegree("");
    setStartDate("");
  };

  const removeEducation = (index: number) => {
    const updatedEducations = educations.filter((_: any, i: number) => i !== index);
    setEducations(updatedEducations);
    setResumeData({
      ...resumeData,
      education: updatedEducations,
    });
  };

  useImperativeHandle(ref, () => ({
    getValues: () => form.getValues(),
  }));

  return (
    <ResumeEditorFormShell
    //  title="Education" 
    //  description="Add your educational background"
     >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => {
                const [showInput, setShowInput] = useState(false);
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Degree <span className="text-red-500">*</span></FormLabel>
                    {showInput ? (
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="Enter degree name" 
                            className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowInput(false);
                            setTimeout(() => {
                              const selectTrigger = document.querySelector('[data-degree-select]') as HTMLElement;
                              selectTrigger?.click();
                            }, 100);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <Select onValueChange={(value) => {
                        if (value === "Other") {
                          setShowInput(true);
                          field.onChange("");
                        } else {
                          field.onChange(value);
                          setSelectedDegree(value);
                        }
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base" data-degree-select>
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {Object.keys(indianDegrees).map((degree) => (
                            <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                );
              }}
            />
            
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">School/University <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter school/university name" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
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
                <FormLabel className="text-sm sm:text-base font-medium">School/University Location <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter school/university location" 
                    className="h-10 sm:h-11 text-sm sm:text-base"
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
                const [year, setYear] = useState(field.value ? new Date(field.value).getFullYear().toString() : '');
                
                const updateStartDate = (y: string) => {
                  if (y) {
                    const date = `${y}-01-01`;
                    field.onChange(date);
                    setStartDate(date);
                    
                    // Auto-calculate end date based on degree duration
                    if (selectedDegree && indianDegrees[selectedDegree as keyof typeof indianDegrees]) {
                      const duration = indianDegrees[selectedDegree as keyof typeof indianDegrees];
                      const startYear = parseInt(y);
                      const endYear = startYear + Math.floor(duration);
                      const endDate = `${endYear}-01-01`;
                      form.setValue('endDate', endDate);
                    }
                  } else {
                    field.onChange('');
                    setStartDate('');
                  }
                };
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Start Year <span className="text-red-500">*</span></FormLabel>
                    <Select value={year} onValueChange={(value) => { setYear(value); updateStartDate(value); }}>
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
                const [year, setYear] = useState(field.value ? new Date(field.value).getFullYear().toString() : '');
                
                const updateEndDate = (y: string) => {
                  if (y) {
                    const date = `${y}-01-01`;
                    field.onChange(date);
                  } else {
                    field.onChange('');
                  }
                };
                
                // Calculate minimum end date based on degree duration
                const getMinEndYear = () => {
                  if (!startDate) return new Date().getFullYear();
                  const startYear = new Date(startDate).getFullYear();
                  return startYear + 1; // Allow end year to be at least start year + 1
                };
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">End Year <span className="text-red-500">*</span></FormLabel>
                    <Select value={year} onValueChange={(value) => { setYear(value); updateEndDate(value); }}>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 20}, (_, i) => getMinEndYear() + i).map(y => (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Grade / CGPA <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.01" 
                      placeholder="Enter your grade or CGPA" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Description</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Relevant coursework, achievements, etc." 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium">
            Add Education
          </Button>
        </form>
      </Form>
      
      {educations.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Added Education</h3>
          <div className="space-y-3 sm:space-y-4">
            {educations.map((education: any, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow relative group"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{education.degree}</h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-1">{education.institution}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{education.location}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    {new Date(education.startDate).getFullYear()} - {new Date(education.endDate).getFullYear()}
                  </p>
                  {education.grade && <p className="text-xs sm:text-sm text-gray-500 mb-1">Grade: {education.grade}</p>}
                  {education.description && <p className="text-xs sm:text-sm text-gray-600">{education.description}</p>}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeEducation(index)}
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

// Validation function to check if education section is complete
export const validateEducationSection = (resumeData: any) => {
  // Check if at least one education entry is added
  if (!resumeData.education || resumeData.education.length === 0) {
    return {
      isValid: false,
      message: "Please add at least one education entry before proceeding to next step"
    };
  }
  
  return {
    isValid: true,
    message: ""
  };
};

export default EducationForm;
