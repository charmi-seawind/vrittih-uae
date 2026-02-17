import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ResumeEditorFormShell from "./ResumeEditorFormShell";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useRef, useState } from "react";
import { ResumeEditorFormProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, apiCall } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LoadingButton from "@/components/ui/loading-button";
import { personalInfoSchema, PersonalInfoValues } from "@/schema/ResumeEditorSchema";

const jobCategories = [
  {
    value: "it-software",
    label: "IT / Software",
    subCategories: [
      { value: "web-development", label: "Web Development" },
      { value: "mobile-development", label: "Mobile Development" },
      { value: "data-science", label: "Data Science" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "devops", label: "DevOps" },
      { value: "qa-testing", label: "QA Testing" },
    ]
  },
  {
    value: "sales-marketing",
    label: "Sales & Marketing",
    subCategories: [
      { value: "digital-marketing", label: "Digital Marketing" },
      { value: "sales-executive", label: "Sales Executive" },
      { value: "business-development", label: "Business Development" },
      { value: "content-marketing", label: "Content Marketing" },
      { value: "seo-sem", label: "SEO/SEM" },
    ]
  },
  {
    value: "accounting",
    label: "Accounting",
    subCategories: [
      { value: "financial-analyst", label: "Financial Analyst" },
      { value: "tax-consultant", label: "Tax Consultant" },
      { value: "auditor", label: "Auditor" },
      { value: "bookkeeper", label: "Bookkeeper" },
    ]
  },
  {
    value: "admin-back-office",
    label: "Admin / Back Office",
    subCategories: [
      { value: "data-entry", label: "Data Entry" },
      { value: "office-manager", label: "Office Manager" },
      { value: "documentation", label: "Documentation" },
      { value: "customer-support", label: "Customer Support" },
    ]
  },
  {
    value: "technician",
    label: "Technician",
    subCategories: [
      { value: "maintenance", label: "Maintenance" },
      { value: "repair-services", label: "Repair Services" },
      { value: "technical-support", label: "Technical Support" },
      { value: "field-technician", label: "Field Technician" },
    ]
  },
  {
    value: "hr-recruiter",
    label: "HR / Recruiter",
    subCategories: [
      { value: "talent-acquisition", label: "Talent Acquisition" },
      { value: "employee-relations", label: "Employee Relations" },
      { value: "training-development", label: "Training & Development" },
      { value: "payroll", label: "Payroll" },
    ]
  },
  {
    value: "construction",
    label: "Construction",
    subCategories: [
      { value: "civil-engineer", label: "Civil Engineer" },
      { value: "architect", label: "Architect" },
      { value: "project-manager", label: "Project Manager" },
      { value: "site-supervisor", label: "Site Supervisor" },
    ]
  },
  {
    value: "design-creative",
    label: "Design / Creative",
    subCategories: [
      { value: "ui-ux-designer", label: "UI/UX Designer" },
      { value: "graphic-designer", label: "Graphic Designer" },
      { value: "content-creator", label: "Content Creator" },
      { value: "video-editor", label: "Video Editor" },
    ]
  },
];

const indianStates = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Anantapur", "Vizianagaram"],
  "Dubai ": ["Dubai", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Navsari"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur", "Haldia", "Krishnanagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Malappuram", "Kannur", "Kasaragod"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Batala", "Pathankot", "Moga"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Diphu"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Nahan", "Paonta Sahib", "Sundarnagar", "Chamba"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwar", "Ramnagar", "Manglaur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Cuncolim", "Quepem"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia", "Khowai", "Pratapgarh", "Ranirbazar", "Sonamura", "Amarpur"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Jiribam", "Kakching"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara", "Williamnagar", "Nongstoin", "Mawkyrwat", "Resubelpara", "Ampati"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Kiphire", "Longleng", "Peren"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Mamit", "Lawngtlai", "Saitual", "Khawzawl"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tezpur", "Bomdila", "Tawang", "Ziro", "Along", "Basar", "Khonsa"],
  "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Jorethang", "Nayabazar", "Rangpo", "Singtam", "Pakyong", "Ravangla"],
  "Delhi": ["New Delhi", "Delhi", "Dwarka", "Rohini", "Janakpuri", "Lajpat Nagar", "Karol Bagh", "Connaught Place", "Saket", "Vasant Kunj"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};

const PersonalInfoForm = ({
  resumeData,
  setResumeData,
}: ResumeEditorFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(resumeData.state || "");
  const { toast } = useToast();
  
  const form = useForm<PersonalInfoValues>({
    defaultValues: {
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      email: resumeData.email || "",
      phone: resumeData.phone || "",
      jobTitle: resumeData.jobTitle || "",
      jobCategory: resumeData.jobCategory || "",
      state: resumeData.state || "",
      city: resumeData.city || "",
      country: resumeData.country || "India",
      dob: resumeData.dob || "",
      bio: resumeData.bio || "",
      photo: resumeData.photo || null,
    },
    resolver: zodResolver(personalInfoSchema),
  });





  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return subscription.unsubscribe;
  }, [form, resumeData, setResumeData]);



  const photoInputRef = useRef<HTMLInputElement>(null);

  return (
    <ResumeEditorFormShell 
      // title="Personal Info"
      // description="Tell us about yourself"
    >
      <Form {...form}>
        <form className="space-y-4 sm:space-y-6">

          {/* NAME FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter first name" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter last name" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* CONTACT FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Phone *</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="Enter 10 digit phone number" 
                      maxLength={10}
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* JOB TITLE & CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Job Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your job title" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Job Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select job category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {jobCategories.map((category) => (
                        <div key={category.value}>
                          <SelectItem value={category.value} className="font-medium">
                            {category.label}
                          </SelectItem>
                          {category.subCategories.map((subCategory) => (
                            <SelectItem 
                              key={subCategory.value} 
                              value={subCategory.value}
                              className="pl-6 text-sm text-muted-foreground"
                            >
                              {subCategory.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* DATE OF BIRTH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => {
                const [day, setDay] = useState(field.value ? new Date(field.value).getDate().toString() : '');
                const [month, setMonth] = useState(field.value ? (new Date(field.value).getMonth() + 1).toString() : '');
                const [year, setYear] = useState(field.value ? new Date(field.value).getFullYear().toString() : '');
                
                const updateDate = (d: string, m: string, y: string) => {
                  if (d && m && y) {
                    const date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                    field.onChange(date);
                  } else {
                    field.onChange('');
                  }
                };
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Date of Birth *</FormLabel>
                    <div className="flex gap-2">
                      <Select value={day} onValueChange={(value) => { setDay(value); updateDate(value, month, year); }}>
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                            <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={month} onValueChange={(value) => { setMonth(value); updateDate(day, value, year); }}>
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={year} onValueChange={(value) => { setYear(value); updateDate(day, month, value); }}>
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 83}, (_, i) => new Date().getFullYear() - 18 - i).map(y => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                );
              }}
            />
            <div></div>
          </div>

          {/* STATE, CITY & COUNTRY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">State *</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedState(value);
                    form.setValue("city", ""); // Reset city when state changes
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {Object.keys(indianStates).map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => {
                const [showInput, setShowInput] = useState(false);
                const cities = selectedState ? indianStates[selectedState as keyof typeof indianStates] || [] : [];
                
                return (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">City *</FormLabel>
                    {showInput ? (
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="Enter city name" 
                            className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowInput(false);
                            setTimeout(() => {
                              const selectTrigger = document.querySelector('[data-city-select]') as HTMLElement;
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
                        if (value === "other") {
                          setShowInput(true);
                          field.onChange("");
                        } else {
                          field.onChange(value);
                        }
                      }} defaultValue={field.value} disabled={!selectedState}>
                        <FormControl>
                          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base" data-city-select>
                            <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                          {selectedState && <SelectItem value="other">Other (Enter manually)</SelectItem>}
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Country *</FormLabel>
                  <FormControl>
                    <Input 
                      value="India"
                      readOnly
                      className="h-10 sm:h-11 text-sm sm:text-base bg-muted"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* BIO */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Write a short bio..." 
                    className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

        </form>
      </Form>
    </ResumeEditorFormShell>
  );
};

export default PersonalInfoForm;
